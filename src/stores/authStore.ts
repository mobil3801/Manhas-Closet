import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User, AuthState } from '@/types'
import { STORAGE_KEYS } from '@/constants'

interface AuthStore extends AuthState {
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      loading: true,
      error: null,

      // Actions
      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null })
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          if (data.user) {
            // Fetch user profile from our users table
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profileError) throw profileError

            set({
              user: userProfile,
              session: data.session,
              loading: false,
              error: null,
            })
          }
        } catch (error: any) {
          set({
            user: null,
            session: null,
            loading: false,
            error: error.message || 'Failed to sign in',
          })
          throw error
        }
      },

      signUp: async (email: string, password: string, fullName: string, role = 'sales_staff') => {
        try {
          set({ loading: true, error: null })

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: role,
              },
            },
          })

          if (error) throw error

          set({
            loading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to sign up',
          })
          throw error
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null })
          
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          set({
            user: null,
            session: null,
            loading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to sign out',
          })
          throw error
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ loading: true, error: null })

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          })

          if (error) throw error

          set({ loading: false, error: null })
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to send reset email',
          })
          throw error
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        try {
          set({ loading: true, error: null })
          const { user } = get()
          
          if (!user) throw new Error('No user logged in')

          const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

          if (error) throw error

          set({
            user: data,
            loading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to update profile',
          })
          throw error
        }
      },

      checkAuth: async () => {
        try {
          set({ loading: true })

          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) throw error

          if (session?.user) {
            // Fetch user profile
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profileError) throw profileError

            set({
              user: userProfile,
              session,
              loading: false,
              error: null,
            })
          } else {
            set({
              user: null,
              session: null,
              loading: false,
              error: null,
            })
          }
        } catch (error: any) {
          set({
            user: null,
            session: null,
            loading: false,
            error: error.message || 'Failed to check authentication',
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
)

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  const { checkAuth } = useAuthStore.getState()
  
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    await checkAuth()
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      session: null,
      loading: false,
      error: null,
    })
  }
})