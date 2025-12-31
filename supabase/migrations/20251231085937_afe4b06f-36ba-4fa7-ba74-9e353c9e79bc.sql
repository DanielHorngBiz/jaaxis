-- Drop the search function that uses pgvector
DROP FUNCTION IF EXISTS public.search_knowledge_chunks(uuid, vector, integer, double precision);

-- Drop the knowledge_chunks table (no longer used - using OpenAI vector store instead)
DROP TABLE IF EXISTS public.knowledge_chunks;