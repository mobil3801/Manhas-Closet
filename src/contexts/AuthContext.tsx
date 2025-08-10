// import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuthStore } from '../stores/authStore'
import LoadingPage from '../components/ui/LoadingPage'
import ErrorMessage from '../components/ui/ErrorMessage'

interface User {
  id: string
  email: string
  role?: string
  fullName?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authStore = useAuthStore()

  useEffect(() => {
    // Initialize auth store by checking current auth state
    authStore.checkAuth()
  }, [])

  const contextValue: AuthContextType = {
    ...authStore,
  }

  // Show loading page during initial auth check
  if (authStore.isLoading && !authStore.user && !authStore.error) {
    return <LoadingPage message="Checking authentication..." />
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {authStore.error && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <ErrorMessage
            title="Authentication Error"
            message={authStore.error}
            onDismiss={authStore.clearError}
          />
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
