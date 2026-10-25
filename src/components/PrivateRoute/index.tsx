import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/overview'
import { getHomePath } from '../../utils/auth'

interface PrivateRouteProps { allowedRoles?: UserRole[] }

function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { user, status } = useAuth()
  if (status === 'loading') return <p role="status">Recuperando sessão…</p>
  if (!user) return <Navigate to="/" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={getHomePath(user.role)} replace />
  return <Outlet />
}

export default PrivateRoute
