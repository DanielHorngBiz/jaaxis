-- Add store connection columns to chatbots table
ALTER TABLE public.chatbots ADD COLUMN store_type text;
ALTER TABLE public.chatbots ADD COLUMN store_connected boolean DEFAULT false;
ALTER TABLE public.chatbots ADD COLUMN store_access text;
ALTER TABLE public.chatbots ADD COLUMN store_order_statuses text;