-- Add OpenAI resource columns to chatbots table
ALTER TABLE public.chatbots 
ADD COLUMN openai_assistant_id TEXT,
ADD COLUMN openai_vector_store_id TEXT;