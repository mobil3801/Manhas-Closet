import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ui/ErrorBoundary'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#059669',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#DC2626',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App