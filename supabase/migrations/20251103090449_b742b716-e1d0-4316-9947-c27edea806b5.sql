-- Fix 1: Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile"
ON profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Fix 2: Create team role enum and update team_members table
CREATE TYPE team_role AS ENUM ('admin', 'manager', 'support');

-- Update existing team_members table to use the enum
ALTER TABLE team_members 
ALTER COLUMN role TYPE team_role 
USING role::team_role;