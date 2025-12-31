import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Chunking configuration
const CHUNK_SIZE = 500; // tokens (approximately words for English)
const CHUNK_OVERLAP = 50; // tokens overlap between chunks
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_BATCH_SIZE = 100; // Max texts per embedding request

// Simple word-based chunking with overlap
function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const chunks: string[] = [];
  
  if (words.length === 0) return [];
  
  let i = 0;
  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSize);
    const chunk = chunkWords.join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
    i += chunkSize - overlap;
    
    // Prevent infinite loop if overlap >= chunkSize
    if (chunkSize - overlap <= 0) break;
  }
  
  return chunks;
}

// Estimate token count (rough approximation: 1 word ≈ 1.3 tokens)
function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

// Generate embeddings using OpenAI text-embedding-3-small
async function generateEmbeddings(
  texts: string[],
  apiKey: string
): Promise<number[][]> {
  if (texts.length === 0) return [];
  
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed: ${errorText}`);
  }

  const data = await response.json();
  return data.data.map((d: any) => d.embedding);
}

// Format knowledge source content based on type
function formatKnowledgeContent(source: any): string {
  switch (source.type) {
    case 'text':
      return source.content || '';
    case 'qa':
      // Format Q&A as a natural text for better embedding
      if (source.question && source.answer) {
        return `Question: ${source.question}\nAnswer: ${source.answer}`;
      }
      return source.content || '';
    case 'website':
      // Include URL context
      const url = source.url || '';
      const content = source.content || '';
      return url ? `Source: ${url}\n\n${content}` : content;
    case 'file':
      // Include filename context
      const fileName = source.file_name || 'Unknown file';
      const fileContent = source.content || '';
      return `File: ${fileName}\n\n${fileContent}`;
    default:
      return source.content || '';
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

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch chatbot data
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, name')
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

    // Delete existing chunks for this chatbot
    console.log('Deleting existing chunks...');
    const { error: deleteError } = await supabase
      .from('knowledge_chunks')
      .delete()
      .eq('chatbot_id', chatbot_id);

    if (deleteError) {
      console.error('Failed to delete existing chunks:', deleteError);
      // Continue anyway
    }

    // Prepare all chunks
    interface ChunkData {
      knowledge_source_id: string;
      chatbot_id: string;
      chunk_index: number;
      content: string;
      token_count: number;
    }

    const allChunks: ChunkData[] = [];

    if (knowledgeSources && knowledgeSources.length > 0) {
      for (const source of knowledgeSources) {
        const content = formatKnowledgeContent(source);
        
        if (!content.trim()) {
          console.log(`Skipping empty source: ${source.id}`);
          continue;
        }

        // Chunk the content
        const chunks = chunkText(content);
        console.log(`Source ${source.id} (${source.type}): ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
          allChunks.push({
            knowledge_source_id: source.id,
            chatbot_id: chatbot_id,
            chunk_index: i,
            content: chunks[i],
            token_count: estimateTokens(chunks[i]),
          });
        }
      }
    }

    console.log(`Total chunks to process: ${allChunks.length}`);

    if (allChunks.length === 0) {
      console.log('No chunks to process');
      return new Response(JSON.stringify({
        success: true,
        chunks_created: 0,
        message: 'No content to sync',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate embeddings in batches
    console.log('Generating embeddings...');
    const allEmbeddings: number[][] = [];
    
    for (let i = 0; i < allChunks.length; i += EMBEDDING_BATCH_SIZE) {
      const batch = allChunks.slice(i, i + EMBEDDING_BATCH_SIZE);
      const texts = batch.map(c => c.content);
      
      console.log(`Processing batch ${Math.floor(i / EMBEDDING_BATCH_SIZE) + 1}/${Math.ceil(allChunks.length / EMBEDDING_BATCH_SIZE)}`);
      
      const embeddings = await generateEmbeddings(texts, OPENAI_API_KEY);
      allEmbeddings.push(...embeddings);
    }

    console.log(`Generated ${allEmbeddings.length} embeddings`);

    // Insert chunks with embeddings into database
    console.log('Inserting chunks into database...');
    
    // Format embeddings as pgvector expects: [1,2,3,...]
    const chunksWithEmbeddings = allChunks.map((chunk, index) => ({
      ...chunk,
      embedding: `[${allEmbeddings[index].join(',')}]`,
    }));

    // Insert in batches to avoid request size limits
    const INSERT_BATCH_SIZE = 50;
    let insertedCount = 0;

    for (let i = 0; i < chunksWithEmbeddings.length; i += INSERT_BATCH_SIZE) {
      const batch = chunksWithEmbeddings.slice(i, i + INSERT_BATCH_SIZE);
      
      const { error: insertError } = await supabase
        .from('knowledge_chunks')
        .insert(batch);

      if (insertError) {
        console.error(`Failed to insert batch at index ${i}:`, insertError);
        throw new Error(`Failed to insert chunks: ${insertError.message}`);
      }
      
      insertedCount += batch.length;
    }

    console.log(`Inserted ${insertedCount} chunks successfully`);
    console.log('Sync completed successfully');

    return new Response(JSON.stringify({
      success: true,
      chunks_created: insertedCount,
      knowledge_sources_processed: knowledgeSources?.length || 0,
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
