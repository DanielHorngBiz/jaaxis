-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge_chunks table for storing embeddings
CREATE TABLE public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_source_id UUID NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- RLS policies for knowledge_chunks (service role access for edge functions)
CREATE POLICY "Service role can manage all chunks"
ON public.knowledge_chunks
FOR ALL
USING (true)
WITH CHECK (true);

-- Index for fast similarity search using cosine distance
CREATE INDEX idx_knowledge_chunks_embedding 
ON public.knowledge_chunks 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Index for chatbot lookups
CREATE INDEX idx_knowledge_chunks_chatbot_id 
ON public.knowledge_chunks(chatbot_id);

-- Create similarity search function
CREATE OR REPLACE FUNCTION public.search_knowledge_chunks(
  p_chatbot_id UUID,
  p_query_embedding VECTOR(1536),
  p_match_count INTEGER DEFAULT 5,
  p_match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.content,
    (1 - (kc.embedding <=> p_query_embedding))::FLOAT AS similarity
  FROM public.knowledge_chunks kc
  WHERE kc.chatbot_id = p_chatbot_id
    AND (1 - (kc.embedding <=> p_query_embedding)) > p_match_threshold
  ORDER BY kc.embedding <=> p_query_embedding
  LIMIT p_match_count;
END;
$$;

-- Remove old OpenAI assistant columns from chatbots (cleanup)
ALTER TABLE public.chatbots 
DROP COLUMN IF EXISTS openai_assistant_id,
DROP COLUMN IF EXISTS openai_vector_store_id;