// Diagnostic utilities for debugging Supabase issues
import { supabase } from '../lib/supabase';

export const runDiagnostics = async () => {
  console.log('🔍 Running Supabase diagnostics...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...');
    const { error: healthError } = await supabase
      .from('players')
      .select('count', { count: 'exact', head: true });
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError);
      return { success: false, error: healthError };
    }
    
    console.log('✅ Connection successful');
    
    // Test 2: List tables
    console.log('📋 Testing table access...');
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .limit(1);
      
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .limit(1);
    
    if (playersError) {
      console.error('❌ Players table access failed:', playersError);
      return { success: false, error: playersError };
    }
    
    if (matchesError) {
      console.error('❌ Matches table access failed:', matchesError);
      return { success: false, error: matchesError };
    }
    
    console.log('✅ Table access successful');
    console.log('📊 Current data:', {
      playersCount: players?.length || 0,
      matchesCount: matches?.length || 0
    });
    
    // Test 3: Insert test
    console.log('🧪 Testing insert operation...');
    const testPlayer = `test-player-${Date.now()}`;
    
    const { data: insertData, error: insertError } = await supabase
      .from('players')
      .insert([{ name: testPlayer }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      return { success: false, error: insertError };
    }
    
    console.log('✅ Insert test successful:', insertData);
    
    // Clean up test data
    await supabase
      .from('players')
      .delete()
      .eq('name', testPlayer);
    
    console.log('🎉 All diagnostics passed!');
    return { success: true };
    
  } catch (error) {
    console.error('💥 Diagnostic failed with exception:', error);
    return { success: false, error };
  }
};