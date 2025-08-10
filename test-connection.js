import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://npuqxyocqaqvicclwjti.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdXF4eW9jcWFxdmljY2x3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzc4NTMsImV4cCI6MjA2ODk1Mzg1M30.mzMsUY0kIoRASwalbm7Pu7ohzZzFuqzMKLekJqFZS8c'

async function testConnection() {
  console.log('🔄 Testing Supabase connection...')
  console.log('📍 Supabase URL:', supabaseUrl)
  console.log('🔑 Anon Key:', supabaseAnonKey ? 'Set ✅' : 'Missing ❌')
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test basic connection
    console.log('\n🔍 Testing basic connection...')
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .limit(5)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log('📊 Sample data:', data)
    
    // Test auth
    console.log('\n🔍 Testing authentication...')
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth test failed:', authError.message)
    } else {
      console.log('✅ Auth test successful!')
      console.log('👤 Session:', session ? 'Active session found' : 'No active session (normal)')
    }
    
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 All tests passed! Supabase is properly connected.')
    } else {
      console.log('\n💥 Some tests failed. Please check your configuration.')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Test script failed:', error)
    process.exit(1)
  })