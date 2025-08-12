require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('=== COMPREHENSIVE SUPABASE VERIFICATION ===\n');

// 1. Environment Variables Check
console.log('1. Environment Variables Check:');
console.log('✅ VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
console.log('✅ VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
console.log('✅ SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
console.log('✅ DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
console.log('');

// 2. Supabase Client Connection Test
console.log('2. Testing Supabase Client Connection:');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function runVerification() {
  try {
    // Test basic connection
    const { count, error } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
    } else {
      console.log('✅ Supabase client connection successful!');
      console.log('📊 Categories table accessible, count:', count || 0);
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
  
  console.log('');
  
  // 3. Database Schema Test
  console.log('3. Testing Database Schema:');
  const serviceSupabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const tables = ['users', 'categories', 'products', 'invoices', 'payments', 'employees', 'attendance'];
  
  for (const table of tables) {
    try {
      const { count, error } = await serviceSupabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: accessible (${count || 0} records)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log('');
  
  // 4. Authentication Test
  console.log('4. Testing Authentication:');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && error.message !== 'Auth session missing!') {
      console.log('❌ Auth test failed:', error.message);
    } else {
      console.log('✅ Authentication system accessible');
      console.log('📊 Current user:', user ? 'Authenticated' : 'Anonymous');
    }
  } catch (err) {
    console.log('❌ Auth error:', err.message);
  }
  
  console.log('');
  
  // 5. CRUD Operations Test
  console.log('5. Testing CRUD Operations:');
  try {
    // Test INSERT
    const { data: insertData, error: insertError } = await serviceSupabase
      .from('categories')
      .insert({ name: 'Test Category', description: 'Verification test' })
      .select();
    
    if (insertError) {
      console.log('❌ INSERT test failed:', insertError.message);
    } else {
      console.log('✅ INSERT operation successful');
      
      // Test UPDATE
      const { error: updateError } = await serviceSupabase
        .from('categories')
        .update({ description: 'Updated verification test' })
        .eq('id', insertData[0].id);
      
      if (updateError) {
        console.log('❌ UPDATE test failed:', updateError.message);
      } else {
        console.log('✅ UPDATE operation successful');
      }
      
      // Test SELECT
      const { data: selectData, error: selectError } = await serviceSupabase
        .from('categories')
        .select('*')
        .eq('id', insertData[0].id);
      
      if (selectError) {
        console.log('❌ SELECT test failed:', selectError.message);
      } else {
        console.log('✅ SELECT operation successful');
      }
      
      // Test DELETE (cleanup)
      const { error: deleteError } = await serviceSupabase
        .from('categories')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.log('❌ DELETE test failed:', deleteError.message);
      } else {
        console.log('✅ DELETE operation successful');
      }
    }
  } catch (err) {
    console.log('❌ CRUD operations error:', err.message);
  }
  
  console.log('');
  console.log('=== VERIFICATION COMPLETE ===');
}

runVerification().catch(console.error);