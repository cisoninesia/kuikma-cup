-- URGENT FIX: Ensure completely public access to Kuikma Cup app
-- Run this SQL in your Supabase SQL editor to fix authentication issues

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow all operations on players" ON players;
DROP POLICY IF EXISTS "Allow all operations on matches" ON matches;

-- Disable RLS temporarily to ensure access
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;

-- Wait a moment, then re-enable with explicit public policies
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create explicit public policies that allow EVERYTHING for EVERYONE
CREATE POLICY "Public access for players" ON players
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public access for matches" ON matches
FOR ALL  
TO public
USING (true)
WITH CHECK (true);

-- Additional explicit policies for specific operations
CREATE POLICY "Public select players" ON players FOR SELECT TO public USING (true);
CREATE POLICY "Public insert players" ON players FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update players" ON players FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete players" ON players FOR DELETE TO public USING (true);

CREATE POLICY "Public select matches" ON matches FOR SELECT TO public USING (true);
CREATE POLICY "Public insert matches" ON matches FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update matches" ON matches FOR UPDATE TO public USING (true);
CREATE POLICY "Public delete matches" ON matches FOR DELETE TO public USING (true);

-- Grant explicit permissions to anonymous role
GRANT ALL ON players TO anon;
GRANT ALL ON matches TO anon;
GRANT ALL ON players TO authenticated;
GRANT ALL ON matches TO authenticated;

-- Ensure sequences are accessible
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;