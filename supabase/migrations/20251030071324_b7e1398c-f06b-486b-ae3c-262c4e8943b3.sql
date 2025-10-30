-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  street text,
  city text,
  state text,
  postal_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create chatbots table
CREATE TABLE public.chatbots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  avatar_url text,
  primary_color text NOT NULL DEFAULT '#3888FF',
  chat_position text NOT NULL DEFAULT 'right',
  mobile_display text NOT NULL DEFAULT 'show',
  persona text,
  forwarding_rules text,
  blocklist text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- Enable RLS on chatbots
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;

-- Chatbots policies
CREATE POLICY "Users can view their own chatbots"
  ON public.chatbots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chatbots"
  ON public.chatbots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbots"
  ON public.chatbots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbots"
  ON public.chatbots FOR DELETE
  USING (auth.uid() = user_id);

-- Create knowledge_sources table
CREATE TABLE public.knowledge_sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id uuid NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'text', 'qa', 'website', 'file'
  content text,
  question text, -- for Q&A type
  answer text, -- for Q&A type
  url text, -- for website type
  file_url text, -- for file type
  file_name text, -- for file type
  status text NOT NULL DEFAULT 'active', -- 'active', 'processing', 'failed'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on knowledge_sources
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;

-- Knowledge sources policies
CREATE POLICY "Users can view their chatbot knowledge"
  ON public.knowledge_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbots
      WHERE chatbots.id = knowledge_sources.chatbot_id
      AND chatbots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create knowledge for their chatbots"
  ON public.knowledge_sources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chatbots
      WHERE chatbots.id = chatbot_id
      AND chatbots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their chatbot knowledge"
  ON public.knowledge_sources FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbots
      WHERE chatbots.id = knowledge_sources.chatbot_id
      AND chatbots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their chatbot knowledge"
  ON public.knowledge_sources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbots
      WHERE chatbots.id = knowledge_sources.chatbot_id
      AND chatbots.user_id = auth.uid()
    )
  );

-- Create team_members table
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id uuid NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL, -- 'owner', 'admin', 'support'
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, email)
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team members policies
CREATE POLICY "Users can view their chatbot team"
  ON public.team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbots
      WHERE chatbots.id = team_members.chatbot_id
      AND chatbots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their chatbot team"
  ON public.team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbots
      WHERE chatbots.id = team_members.chatbot_id
      AND chatbots.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_chatbots_updated_at
  BEFORE UPDATE ON public.chatbots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_knowledge_sources_updated_at
  BEFORE UPDATE ON public.knowledge_sources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();