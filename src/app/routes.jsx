import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import StudentDashboard from '../pages/StudentDashboard';
import FacilitiesPage from '../pages/FacilitiesPage';
import FacilityDetailsPage from '../pages/FacilityDetailsPage';
import AssetCatalogPage from '../pages/AssetCatalogPage';
import AssetDetailsPage from '../pages/AssetDetailsPage';
import NewReservationPage from '../pages/NewReservationPage';
import MyReservationsPage from '../pages/MyReservationsPage';
import ReservationDetailsPage from '../pages/ReservationDetailsPage';
import ProfilePage from '../pages/ProfilePage';
import HelpPage from '../pages/HelpPage';
import AdminDashboard from '../pages/AdminDashboard';
import AdminFacilitiesPage from '../pages/AdminFacilitiesPage';
import AdminAssetsPage from '../pages/AdminAssetsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminReportsPage from '../pages/AdminReportsPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import { ProtectedRoute, RoleBasedRoute, PublicRoute } from '../components/ProtectedRoute';

/**
 * Route Configuration with Role-Based Access Control
 * - Public routes: Landing, Login, Register
 * - Protected routes: Dashboard, Facilities, Reservations, Profile
 * - Admin routes: Admin pages (admin, faculty, staff roles only)
 * - All routes enforce authentication and authorization via backend tokens
 */
export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },

  // Protected user routes (all authenticated users)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <StudentDashboard />,
      },
      {
        path: '/facilities',
        element: <FacilitiesPage />,
      },
      {
        path: '/facilities/:id',
        element: <FacilityDetailsPage />,
      },
      {
        path: '/assets',
        element: <AssetCatalogPage />,
      },
      {
        path: '/assets/:id',
        element: <AssetDetailsPage />,
      },
      {
        path: '/new-reservation',
        element: <NewReservationPage />,
      },
      {
        path: '/reservations',
        element: <MyReservationsPage />,
      },
      {
        path: '/reservations/:id',
        element: <ReservationDetailsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/help',
        element: <HelpPage />,
      },
    ],
  },

  // Admin routes (admin, faculty, staff roles only)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={['admin', 'faculty', 'staff']} />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboard />,
          },
          {
            path: '/admin/facilities',
            element: <AdminFacilitiesPage />,
          },
          {
            path: '/admin/facilities/:id',
            element: <AdminFacilitiesPage />,
          },
          {
            path: '/admin/assets',
            element: <AdminAssetsPage />,
          },
          {
            path: '/admin/assets/:id',
            element: <AdminAssetsPage />,
          },
          {
            path: '/admin/users',
            element: <AdminUsersPage />,
          },
          {
            path: '/admin/reports',
            element: <AdminReportsPage />,
          },
        ],
      },
    ],
  },

  // Error pages
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);