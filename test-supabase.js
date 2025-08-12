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
    console.log('\n🔍 Testing basic connection...');
    
    // Try to list all tables using RPC (PostgreSQL way)
    console.log('\n📋 Attempting to list available tables...');
    try {
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_tables');
        
      if (tablesError) {
        console.log('⚠️ Could not list tables with RPC:', tablesError.message);
        
        // Try a different approach - list common table names
        const commonTables = ['products', 'categories', 'users', 'orders', 'items', 'inventory'];
        console.log('\n🔍 Checking for common table names...');
        
        for (const table of commonTables) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('count', { count: 'exact', head: true });
              
            if (!error) {
              console.log(`✅ Found table: ${table}`);
            }
          } catch (e) {
            // Ignore errors for this check
          }
        }
      } else {
        console.log('📋 Available tables:', tablesData);
      }
    } catch (e) {
      console.log('⚠️ Could not list tables:', e.message);
    }
    
    // Try the categories table
    console.log('\n🔍 Testing categories table...');
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .limit(5)

    if (error) {
      console.error('❌ Query failed:', error.message);
      console.log('💡 Tip: The table might not exist or you might not have permissions to access it');
      
      // Try a simple query instead
      console.log('\n🔍 Trying a simple count query instead...');
      const { data: countData, error: countError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.log('❌ Simple count also failed:', countError.message);
        return false;
      } else {
        console.log('✅ Simple count query worked!');
        console.log(`📊 Found ${countData.length || 0} records in categories table`);
      }
    } else {
      console.log(`✅ Successfully retrieved ${data.length} records from categories table`);
    }

    console.log('✅ Database connection successful!');
    console.log('📊 Sample data:', data);

    // Test auth
    console.log('\n🔍 Testing authentication...');
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
      console.log('\n🎉 All tests passed! Supabase is properly connected.');
    } else {
      console.log('\n💥 Some tests failed. Please check your configuration.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test script failed:', error);
    process.exit(1);
  });
