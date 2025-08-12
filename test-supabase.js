import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Set ✅' : 'Missing ❌');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log('
🔍 Testing basic connection...');
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .limit(5)

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log('📊 Sample data:', data);

    // Test auth
    console.log('
🔍 Testing authentication...');
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Auth test successful!');
      console.log('👤 Session:', session ? 'Active session found' : 'No active session (normal)');
    }

    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('
🎉 All tests passed! Supabase is properly connected.');
    } else {
      console.log('
💥 Some tests failed. Please check your configuration.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test script failed:', error);
    process.exit(1);
  });
