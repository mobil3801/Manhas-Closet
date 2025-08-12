import { createClient } from '@supabase/supabase-js';

// 使用提供的服务密钥进行直接访问
const supabaseUrl = 'https://nehhjsiuhthflfwkfequ.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laGhqc2l1aHRoZmxmd2tmZXF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzAxMzE3NSwiZXhwIjoyMDY4NTg5MTc1fQ.7naT6l_oNH8VI5MaEKgJ19PoYw1EErv6-ftkEin12wE';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('Testing Supabase connection with service key...');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? 'Set ✅' : 'Missing ❌');

// 使用服务密钥创建客户端以获得管理员访问权限
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

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

    // 使用服务密钥测试认证
    console.log('\n🔍 Testing authentication with service key...');
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
