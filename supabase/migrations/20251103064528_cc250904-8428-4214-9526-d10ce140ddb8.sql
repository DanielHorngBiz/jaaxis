-- Add columns to chatbots table for whitelisted domains and blocked pages
ALTER TABLE public.chatbots 
ADD COLUMN IF NOT EXISTS whitelisted_domains text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS blocked_pages text[] DEFAULT '{}';