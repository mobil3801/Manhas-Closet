import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { ROUTES } from '@/constants'

const ProtectedRoute = () => {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute