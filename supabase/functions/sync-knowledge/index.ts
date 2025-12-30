import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch chatbot data
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      throw new Error(`Chatbot not found: ${chatbotError?.message}`);
    }

    // Fetch knowledge sources
    const { data: knowledgeSources, error: ksError } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('chatbot_id', chatbot_id);

    if (ksError) {
      throw new Error(`Failed to fetch knowledge sources: ${ksError.message}`);
    }

    console.log(`Found ${knowledgeSources?.length || 0} knowledge sources`);

    // Delete existing vector store if it exists
    if (chatbot.openai_vector_store_id) {
      console.log(`Deleting existing vector store: ${chatbot.openai_vector_store_id}`);
      try {
        await fetch(`https://api.openai.com/v1/vector_stores/${chatbot.openai_vector_store_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        });
      } catch (e) {
        console.log('Could not delete existing vector store:', e);
      }
    }

    // Delete existing assistant if it exists
    if (chatbot.openai_assistant_id) {
      console.log(`Deleting existing assistant: ${chatbot.openai_assistant_id}`);
      try {
        await fetch(`https://api.openai.com/v1/assistants/${chatbot.openai_assistant_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        });
      } catch (e) {
        console.log('Could not delete existing assistant:', e);
      }
    }

    // Create new vector store
    console.log('Creating new vector store...');
    const vectorStoreResponse = await fetch('https://api.openai.com/v1/vector_stores', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        name: `chatbot-${chatbot_id}-knowledge`,
      }),
    });

    if (!vectorStoreResponse.ok) {
      const errorText = await vectorStoreResponse.text();
      throw new Error(`Failed to create vector store: ${errorText}`);
    }

    const vectorStore = await vectorStoreResponse.json();
    console.log(`Created vector store: ${vectorStore.id}`);

    // Upload knowledge sources as files
    const uploadedFileIds: string[] = [];

    if (knowledgeSources && knowledgeSources.length > 0) {
      for (const source of knowledgeSources) {
        let content = '';
        let fileName = '';

        switch (source.type) {
          case 'text':
            content = source.content || '';
            fileName = `${source.file_name || 'text-knowledge'}.txt`;
            break;
          case 'qa':
            content = source.content || '';
            fileName = `${source.file_name || 'qa-knowledge'}.txt`;
            break;
          case 'website':
            content = source.content || '';
            fileName = `${source.file_name || source.url || 'website'}.txt`;
            break;
          case 'file':
            content = source.content || '';
            fileName = `${source.file_name || 'file-content'}.txt`;
            break;
          default:
            continue;
        }

        if (!content.trim()) {
          console.log(`Skipping empty source: ${source.id}`);
          continue;
        }

        console.log(`Uploading file: ${fileName}`);

        // Create file in OpenAI
        const formData = new FormData();
        formData.append('purpose', 'assistants');
        formData.append('file', new Blob([content], { type: 'text/plain' }), fileName);

        const fileResponse = await fetch('https://api.openai.com/v1/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (!fileResponse.ok) {
          const errorText = await fileResponse.text();
          console.error(`Failed to upload file ${fileName}: ${errorText}`);
          continue;
        }

        const file = await fileResponse.json();
        uploadedFileIds.push(file.id);
        console.log(`Uploaded file: ${file.id}`);

        // Add file to vector store
        const addFileResponse = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStore.id}/files`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
          body: JSON.stringify({
            file_id: file.id,
          }),
        });

        if (!addFileResponse.ok) {
          const errorText = await addFileResponse.text();
          console.error(`Failed to add file to vector store: ${errorText}`);
        }
      }
    }

    console.log(`Uploaded ${uploadedFileIds.length} files to vector store`);

    // Create assistant with file_search tool
    console.log('Creating assistant...');
    const assistantResponse = await fetch('https://api.openai.com/v1/assistants', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        name: `${chatbot.name} Knowledge Assistant`,
        model: 'gpt-4o', // Use gpt-4o for assistants API
        tools: [{ type: 'file_search' }],
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore.id],
          },
        },
      }),
    });

    if (!assistantResponse.ok) {
      const errorText = await assistantResponse.text();
      throw new Error(`Failed to create assistant: ${errorText}`);
    }

    const assistant = await assistantResponse.json();
    console.log(`Created assistant: ${assistant.id}`);

    // Update chatbot with OpenAI resource IDs
    const { error: updateError } = await supabase
      .from('chatbots')
      .update({
        openai_assistant_id: assistant.id,
        openai_vector_store_id: vectorStore.id,
      })
      .eq('id', chatbot_id);

    if (updateError) {
      throw new Error(`Failed to update chatbot: ${updateError.message}`);
    }

    console.log('Sync completed successfully');

    return new Response(JSON.stringify({
      success: true,
      vector_store_id: vectorStore.id,
      assistant_id: assistant.id,
      files_uploaded: uploadedFileIds.length,
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
