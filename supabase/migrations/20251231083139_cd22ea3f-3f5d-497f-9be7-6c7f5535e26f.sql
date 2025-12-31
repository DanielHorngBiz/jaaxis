-- Add OpenAI vector store ID column to chatbots table
ALTER TABLE public.chatbots 
ADD COLUMN openai_vector_store_id TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.chatbots.openai_vector_store_id IS 'OpenAI Vector Store ID for file search';

-- We can now drop the knowledge_chunks table since we're using OpenAI's hosted vector stores
-- But keeping it for now in case we need to rollback
-- DROP TABLE IF EXISTS public.knowledge_chunks;