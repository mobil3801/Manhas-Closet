import { useEffect, useState } from 'react'
import { testDatabaseConnection, testAuth } from '@/lib/testConnection'

interface TestResult {
  success: boolean
  error?: string
  data?: any
  session?: any
}

export const DatabaseTest = () => {
  const [dbResult, setDbResult] = useState<TestResult | null>(null)
  const [authResult, setAuthResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runTests = async () => {
      setLoading(true)
      
      try {
        // Test database connection
        const dbTest = await testDatabaseConnection()
        setDbResult(dbTest)
        
        // Test auth
        const authTest = await testAuth()
        setAuthResult(authTest)
      } catch (error) {
        console.error('Test failed:', error)
      } finally {
        setLoading(false)
      }
    }

    runTests()
  }, [])

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Testing Supabase Connection...
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Supabase Connection Test</h2>
      
      {/* Database Test Result */}
      <div className={`p-4 border rounded-lg ${
        dbResult?.success 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${
          dbResult?.success ? 'text-green-800' : 'text-red-800'
        }`}>
          Database Connection: {dbResult?.success ? '✅ Success' : '❌ Failed'}
        </h3>
        {dbResult?.error && (
          <p className="text-red-600 text-sm mb-2">Error: {dbResult.error}</p>
        )}
        {dbResult?.data && (
          <div className="text-sm text-gray-600">
            <p>Sample data retrieved: {JSON.stringify(dbResult.data, null, 2)}</p>
          </div>
        )}
      </div>

      {/* Auth Test Result */}
      <div className={`p-4 border rounded-lg ${
        authResult?.success 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${
          authResult?.success ? 'text-green-800' : 'text-red-800'
        }`}>
          Authentication: {authResult?.success ? '✅ Success' : '❌ Failed'}
        </h3>
        {authResult?.error && (
          <p className="text-red-600 text-sm mb-2">Error: {authResult.error}</p>
        )}
        <p className="text-sm text-gray-600">
          Session Status: {authResult?.session ? 'Active Session' : 'No Active Session'}
        </p>
      </div>

      {/* Environment Variables Check */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Environment Variables</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Supabase Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>App Name: {import.meta.env.VITE_APP_NAME || 'Not set'}</p>
        </div>
      </div>
    </div>
  )
}

export default DatabaseTest