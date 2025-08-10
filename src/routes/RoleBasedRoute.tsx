import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { UserRole } from '@/types'
import { ROUTES } from '@/constants'

interface RoleBasedRouteProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

const RoleBasedRoute = ({ 
  children, 
  allowedRoles, 
  fallbackPath = ROUTES.DASHBOARD 
}: RoleBasedRouteProps) => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default RoleBasedRoute