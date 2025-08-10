import { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import DatabaseTest from './components/DatabaseTest'

function App() {
  const [showFullApp, setShowFullApp] = useState(false)

  if (!showFullApp) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Manhas Closet - Supabase Connection Test
          </h1>
          
          <AuthProvider>
            <DatabaseTest />
          </AuthProvider>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowFullApp(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Continue to Full App
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Manhas Closet Management System
        </h1>
        <p className="text-center text-gray-600">
          Full application will be implemented here once database connection is verified.
        </p>
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowFullApp(false)}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Connection Test
          </button>
        </div>
      </div>
    </div>
  )
}

export default App