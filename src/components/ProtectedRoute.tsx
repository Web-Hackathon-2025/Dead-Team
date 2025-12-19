import { Navigate } from 'react-router-dom'
import { useAuth, UserType } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredType?: UserType
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredType }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredType && user?.type !== requiredType) {
    // Redirect to appropriate dashboard if wrong type
    if (user?.type === 'customer') {
      return <Navigate to="/dashboard/customer" replace />
    } else {
      return <Navigate to="/dashboard/provider" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute

