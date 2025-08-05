import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

// Log configuration (without exposing the key)
console.log('Supabase configuration:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0,
  keyStart: supabaseAnonKey?.substring(0, 10) + '...',
  urlValid: supabaseUrl?.includes('supabase.co')
});

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

if (!supabaseUrl.includes('supabase.co')) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('Supabase client created successfully');

// Database types
export interface Player {
  id: string
  name: string
  created_at: string
}

export interface Match {
  id: string
  date: string
  team1_player1: string
  team1_player2: string
  team2_player1: string
  team2_player2: string
  sets: { team1: number; team2: number }[]
  winner: 'team1' | 'team2'
  created_at: string
}