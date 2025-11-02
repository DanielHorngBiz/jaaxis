-- Add accepted column to team_members table
ALTER TABLE public.team_members 
ADD COLUMN accepted BOOLEAN NOT NULL DEFAULT false;