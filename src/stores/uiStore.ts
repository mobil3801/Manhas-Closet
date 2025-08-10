import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UIState, Notification } from '@/types'
import { STORAGE_KEYS } from '@/constants'

interface UIStore extends UIState {
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  getUnreadCount: () => number
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: true,
      theme: 'light',
      notifications: [],

      // Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          
          // Update document class for theme
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark')
          }
          
          return { theme: newTheme }
        })
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme })
        
        // Update document class for theme
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
        }
      },

      addNotification: (notificationData) => {
        const notification: Notification = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false,
          ...notificationData,
        }

        set((state) => ({
          notifications: [notification, ...state.notifications],
        }))

        // Auto-remove success notifications after 5 seconds
        if (notification.type === 'success') {
          setTimeout(() => {
            get().removeNotification(notification.id)
          }, 5000)
        }

        // Auto-remove info notifications after 3 seconds
        if (notification.type === 'info') {
          setTimeout(() => {
            get().removeNotification(notification.id)
          }, 3000)
        }
      },

      markNotificationRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          ),
        }))
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            read: true,
          })),
        }))
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(notification => notification.id !== id),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      getUnreadCount: () => {
        const { notifications } = get()
        return notifications.filter(notification => !notification.read).length
      },
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
)

// Initialize theme on load
if (typeof document !== 'undefined') {
  const { theme } = useUIStore.getState()
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Utility functions for common notification patterns
export const showSuccessNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: 'success',
    title,
    message,
  })
}

export const showErrorNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: 'error',
    title,
    message,
  })
}

export const showWarningNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: 'warning',
    title,
    message,
  })
}

export const showInfoNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: 'info',
    title,
    message,
  })
}