import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Format knowledge source content based on type
function formatKnowledgeContent(source: any): string {
  switch (source.type) {
    case 'text':
      return source.content || '';
    case 'qa':
      if (source.question && source.answer) {
        return `Question: ${source.question}\nAnswer: ${source.answer}`;
      }
      return source.content || '';
    case 'website':
      const url = source.url || '';
      const content = source.content || '';
      return url ? `Source: ${url}\n\n${content}` : content;
    case 'file':
      const fileName = source.file_name || 'Unknown file';
      const fileContent = source.content || '';
      return `File: ${fileName}\n\n${fileContent}`;
    default:
      return source.content || '';
  }
}

// Create a file in OpenAI from text content
async function createOpenAIFile(
  content: string,
  fileName: string,
  apiKey: string
): Promise<string> {
  const blob = new Blob([content], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('purpose', 'assistants');

  const response = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create file: ${errorText}`);
  }

  const data = await response.json();
  return data.id;
}

// Create a vector store
async function createVectorStore(name: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/vector_stores', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create vector store: ${errorText}`);
  }

  const data = await response.json();
  return data.id;
}

// Delete a vector store
async function deleteVectorStore(vectorStoreId: string, apiKey: string): Promise<void> {
  const response = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`Failed to delete vector store ${vectorStoreId}: ${errorText}`);
    // Don't throw, just log warning
  }
}

// Add files to vector store and wait for processing
async function addFilesToVectorStore(
  vectorStoreId: string,
  fileIds: string[],
  apiKey: string
): Promise<void> {
  if (fileIds.length === 0) return;

  // Create a file batch
  const response = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/file_batches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file_ids: fileIds }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add files to vector store: ${errorText}`);
  }

  const batch = await response.json();
  console.log(`Created file batch: ${batch.id}, status: ${batch.status}`);

  // Poll for completion
  let status = batch.status;
  let attempts = 0;
  const maxAttempts = 10; // 50 seconds max, then let OpenAI finish in background

  while (status === 'in_progress' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    const checkResponse = await fetch(
      `https://api.openai.com/v1/vector_stores/${vectorStoreId}/file_batches/${batch.id}`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      }
    );

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      status = checkData.status;
      console.log(`Batch status: ${status}, files: ${checkData.file_counts?.completed || 0}/${checkData.file_counts?.total || 0}`);
    }
    
    attempts++;
  }

  if (status !== 'completed') {
    console.log(`Batch still processing (status: ${status}), OpenAI will continue in background`);
  } else {
    console.log('Files added to vector store');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { chatbot_id } = await req.json();
    if (!chatbot_id) {
      throw new Error('chatbot_id is required');
    }

    console.log(`Syncing knowledge for chatbot: ${chatbot_id}`);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch chatbot data
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, name, openai_vector_store_id')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      throw new Error(`Chatbot not found: ${chatbotError?.message}`);
    }

    // Fetch knowledge sources
    const { data: knowledgeSources, error: ksError } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('chatbot_id', chatbot_id)
      .eq('status', 'active');

    if (ksError) {
      throw new Error(`Failed to fetch knowledge sources: ${ksError.message}`);
    }

    console.log(`Found ${knowledgeSources?.length || 0} knowledge sources`);

    // Delete existing vector store if it exists
    if (chatbot.openai_vector_store_id) {
      console.log(`Deleting existing vector store: ${chatbot.openai_vector_store_id}`);
      await deleteVectorStore(chatbot.openai_vector_store_id, OPENAI_API_KEY);
    }

    // If no knowledge sources, clear the vector store ID and return
    if (!knowledgeSources || knowledgeSources.length === 0) {
      console.log('No knowledge sources to sync');
      
      await supabase
        .from('chatbots')
        .update({ openai_vector_store_id: null })
        .eq('id', chatbot_id);

      return new Response(JSON.stringify({
        success: true,
        files_created: 0,
        message: 'No content to sync - vector store cleared',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create new vector store
    const vectorStoreName = `chatbot_${chatbot_id}_${chatbot.name || 'knowledge'}`;
    console.log(`Creating vector store: ${vectorStoreName}`);
    const vectorStoreId = await createVectorStore(vectorStoreName, OPENAI_API_KEY);
    console.log(`Created vector store: ${vectorStoreId}`);

    // Save vector store ID IMMEDIATELY (before file upload to avoid timeout issues)
    const { error: updateError } = await supabase
      .from('chatbots')
      .update({ openai_vector_store_id: vectorStoreId })
      .eq('id', chatbot_id);

    if (updateError) {
      console.error('Failed to save vector store ID:', updateError);
      // Clean up the vector store we just created
      await deleteVectorStore(vectorStoreId, OPENAI_API_KEY);
      throw new Error(`Failed to save vector store ID: ${updateError.message}`);
    }
    console.log('Saved vector store ID to database');

    // Upload each knowledge source as a file
    const fileIds: string[] = [];
    
    for (const source of knowledgeSources) {
      const content = formatKnowledgeContent(source);
      
      if (!content.trim()) {
        console.log(`Skipping empty source: ${source.id}`);
        continue;
      }

      // Create a descriptive filename
      let fileName = `knowledge_${source.id}.txt`;
      if (source.type === 'file' && source.file_name) {
        fileName = `${source.file_name}.txt`;
      } else if (source.type === 'website' && source.url) {
        const urlPart = new URL(source.url).pathname.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
        fileName = `website_${urlPart || source.id}.txt`;
      } else if (source.type === 'qa' && source.question) {
        const qPart = source.question.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
        fileName = `qa_${qPart}.txt`;
      }

      console.log(`Uploading file: ${fileName} (${content.length} chars)`);
      
      try {
        const fileId = await createOpenAIFile(content, fileName, OPENAI_API_KEY);
        fileIds.push(fileId);
        console.log(`Created file: ${fileId}`);
      } catch (fileError) {
        console.error(`Failed to upload file for source ${source.id}:`, fileError);
        // Continue with other files
      }
    }

    console.log(`Uploaded ${fileIds.length} files`);

    // Add files to vector store
    if (fileIds.length > 0) {
      console.log('Adding files to vector store...');
      await addFilesToVectorStore(vectorStoreId, fileIds, OPENAI_API_KEY);
    }

    console.log('Sync completed successfully');

    return new Response(JSON.stringify({
      success: true,
      vector_store_id: vectorStoreId,
      files_created: fileIds.length,
      knowledge_sources_processed: knowledgeSources.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sync-knowledge:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
