import { supabase } from './supabase'

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Database connection successful!')
    console.log('Sample data:', data)
    
    return { success: true, data }
  } catch (error: any) {
    console.error('Connection test failed:', error)
    return { success: false, error: error.message }
  }
}

export const testAuth = async () => {
  try {
    console.log('Testing Supabase auth...')
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth test error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Auth test successful!')
    console.log('Current session:', session ? 'Active' : 'No session')
    
    return { success: true, session }
  } catch (error: any) {
    console.error('Auth test failed:', error)
    return { success: false, error: error.message }
  }
}