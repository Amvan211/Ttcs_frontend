import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuthToken } from '../../services/apiClient';

interface ProtectedRouteProps {
  allowedRoles?: Array<'READER' | 'PARTNER' | 'ADMIN'>;
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth();
  const token = getAuthToken();

  if (!isLoggedIn || !user || !token) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home if user does not have required permissions
    return <Navigate to="/" replace />;
  }

  // If authenticated and has correct role, render children routes
  return <Outlet />;
}
