import { useEffect, useState, useCallback, useRef } from 'react';
import authService from '../services/authService';

/**
 * useAuth Hook - Manages authentication state and token lifecycle
 * - Enforces token expiration and refresh
 * - Provides authentication context to components
 * - Handles automatic logout on token expiry
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshTimeoutRef = useRef(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();

        if (token && currentUser) {
          // Verify token is still valid (check expiry)
          if (authService.isTokenExpired()) {
            // Token expired, try to refresh
            await authService.refreshToken();
            const refreshedUser = authService.getCurrentUser();
            setUser(refreshedUser);
            setIsAuthenticated(true);
            scheduleTokenRefresh();
          } else {
            setUser(currentUser);
            setIsAuthenticated(true);
            scheduleTokenRefresh();
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setError(err.message);
        setUser(null);
        setIsAuthenticated(false);
        // Initialization failures should not trigger another network request.
        // Clear the invalid local session and let the user sign in again.
        authService.clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Schedule token refresh before expiry
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const expiresIn = authService.getTokenExpiresIn();
    if (expiresIn && expiresIn > 0) {
      // Refresh 5 minutes before expiry
      const refreshTime = (expiresIn - 300) * 1000;
      if (refreshTime > 0) {
        refreshTimeoutRef.current = setTimeout(async () => {
          try {
            await authService.refreshToken();
            const refreshedUser = authService.getCurrentUser();
            setUser(refreshedUser);
            scheduleTokenRefresh();
          } catch (err) {
            console.error('Token refresh failed:', err);
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }, refreshTime);
      }
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      scheduleTokenRefresh();
      return response;
    } catch (err) {
      setError(err.message);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  }, [scheduleTokenRefresh]);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    }
  }, []);

  const hasRole = useCallback((requiredRole) => {
    if (!user || !user.role) return false;
    if (typeof requiredRole === 'string') {
      return user.role === requiredRole;
    }
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return false;
  }, [user]);

  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
  };
};

export default useAuth;
