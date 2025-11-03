-- Fix team role authorization with proper RLS and security definer functions

-- Create a security definer function to check if a user owns a chatbot
CREATE OR REPLACE FUNCTION public.user_owns_chatbot(_user_id uuid, _chatbot_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chatbots
    WHERE id = _chatbot_id
      AND user_id = _user_id
  )
$$;

-- Create a security definer function to add team members (only chatbot owners can add)
CREATE OR REPLACE FUNCTION public.add_team_member(
  _chatbot_id uuid,
  _email text,
  _role team_role
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new_member_id uuid;
BEGIN
  -- Check if the calling user owns the chatbot
  IF NOT public.user_owns_chatbot(auth.uid(), _chatbot_id) THEN
    RAISE EXCEPTION 'Only chatbot owners can add team members';
  END IF;

  -- Insert the new team member
  INSERT INTO public.team_members (chatbot_id, email, role)
  VALUES (_chatbot_id, _email, _role)
  RETURNING id INTO _new_member_id;

  RETURN _new_member_id;
END;
$$;

-- Create a security definer function to update team member roles (only chatbot owners can update)
CREATE OR REPLACE FUNCTION public.update_team_member_role(
  _member_id uuid,
  _new_role team_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _chatbot_id uuid;
BEGIN
  -- Get the chatbot_id for this team member
  SELECT chatbot_id INTO _chatbot_id
  FROM public.team_members
  WHERE id = _member_id;

  IF _chatbot_id IS NULL THEN
    RAISE EXCEPTION 'Team member not found';
  END IF;

  -- Check if the calling user owns the chatbot
  IF NOT public.user_owns_chatbot(auth.uid(), _chatbot_id) THEN
    RAISE EXCEPTION 'Only chatbot owners can update team member roles';
  END IF;

  -- Update the role
  UPDATE public.team_members
  SET role = _new_role
  WHERE id = _member_id;
END;
$$;

-- Drop existing permissive policies on team_members
DROP POLICY IF EXISTS "Users can manage their chatbot team" ON public.team_members;
DROP POLICY IF EXISTS "Users can view their chatbot team" ON public.team_members;

-- Create restrictive RLS policies that prevent direct INSERT/UPDATE from clients
CREATE POLICY "Team members can be viewed by chatbot owners"
ON public.team_members
FOR SELECT
TO authenticated
USING (
  public.user_owns_chatbot(auth.uid(), chatbot_id)
);

CREATE POLICY "Team members can only be deleted by chatbot owners"
ON public.team_members
FOR DELETE
TO authenticated
USING (
  public.user_owns_chatbot(auth.uid(), chatbot_id)
);

-- Block direct INSERT and UPDATE operations - force use of security definer functions
CREATE POLICY "Block direct team member inserts"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Block direct team member updates"
ON public.team_members
FOR UPDATE
TO authenticated
USING (false);