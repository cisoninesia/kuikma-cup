-- Kuikma Cup Database Schema
-- Run this SQL in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date VARCHAR(50) NOT NULL,
  team1_player1 VARCHAR(100) NOT NULL,
  team1_player2 VARCHAR(100) NOT NULL,
  team2_player1 VARCHAR(100) NOT NULL,
  team2_player2 VARCHAR(100) NOT NULL,
  sets JSONB NOT NULL, -- Array of {team1: number, team2: number}
  winner VARCHAR(10) NOT NULL CHECK (winner IN ('team1', 'team2')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_players ON matches(team1_player1, team1_player2, team2_player1, team2_player2);

-- Row Level Security (RLS) - Enable public access for your tournament
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Allow all operations for everyone (suitable for a tournament app)
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);