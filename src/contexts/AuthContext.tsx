import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/stores'
import type { User, AuthState } from '@/types'

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

  return (
    <AuthContext.Provider value={contextValue}>
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
