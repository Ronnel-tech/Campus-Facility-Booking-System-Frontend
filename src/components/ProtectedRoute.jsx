import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

/**
 * ProtectedRoute - Ensures only authenticated users can access
 * - Redirects unauthenticated users to login
 * - Checks token validity
 */
export const ProtectedRoute = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * RoleBasedRoute - Ensures only users with specific roles can access
 * - Enforces role-based access control
 * - Redirects unauthorized users to dashboard
 */
export const RoleBasedRoute = ({ allowedRoles = [] }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!authService.hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const DashboardRedirect = () => {
  const user = authService.getCurrentUser();

  if (['admin', 'faculty', 'staff'].includes(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard/student" replace />;
};

/**
 * PublicRoute - Allows only unauthenticated users
 * - Redirects authenticated users to dashboard
 * - Used for login, register pages
 */
export const PublicRoute = () => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
