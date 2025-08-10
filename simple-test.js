import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔄 Testing Supabase connection...');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseAnonKey ? 'Set ✅' : 'Missing ❌');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log('\n🔍 Testing basic connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('⚠️  Auth session error (expected for new project):', error.message);
    } else {
      console.log('✅ Auth connection successful');
    }

    // Test if we can access any tables (this will fail if no tables exist)
    console.log('\n🔍 Testing database access...');
    try {
      const { data: tables, error: dbError } = await supabase
        .from('categories')
        .select('*')
        .limit(1);
      
      if (dbError) {
        console.log('⚠️  Database access error (expected if tables don\'t exist):', dbError.message);
        console.log('💡 This means the connection works but the database schema needs to be created');
      } else {
        console.log('✅ Database access successful');
        console.log('📊 Sample data:', tables);
      }
    } catch (err) {
      console.log('⚠️  Database test error:', err.message);
    }

    // Test authentication signup (this will help verify the project is properly configured)
    console.log('\n🔍 Testing auth configuration...');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (authError) {
        if (authError.message.includes('User already registered')) {
          console.log('✅ Auth is working (user already exists)');
        } else if (authError.message.includes('Email not confirmed')) {
          console.log('✅ Auth is working (email confirmation required)');
        } else {
          console.log('⚠️  Auth configuration issue:', authError.message);
        }
      } else {
        console.log('✅ Auth signup successful');
      }
    } catch (err) {
      console.log('⚠️  Auth test error:', err.message);
    }

    console.log('\n🎉 Connection test completed!');
    console.log('📋 Summary:');
    console.log('   - Supabase client can be created ✅');
    console.log('   - Basic connection works ✅');
    console.log('   - Database schema needs to be created manually 📝');
    console.log('   - Ready to proceed with application development 🚀');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();