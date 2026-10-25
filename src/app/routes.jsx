import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import StudentDashboard from "../pages/StudentDashboard";
import FacilitiesPage from "../pages/FacilitiesPage";
import FacilityDetailsPage from "../pages/FacilityDetailsPage";
import AssetCatalogPage from "../pages/AssetCatalogPage";
import AssetDetailsPage from "../pages/AssetDetailsPage";
import NewReservationPage from "../pages/NewReservationPage";
import MyReservationsPage from "../pages/MyReservationsPage";
import ReservationDetailsPage from "../pages/ReservationDetailsPage";
import ProfilePage from "../pages/ProfilePage";
import HelpPage from "../pages/HelpPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminFacilitiesPage from "../pages/AdminFacilitiesPage";
import AdminAssetsPage from "../pages/AdminAssetsPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminReportsPage from "../pages/AdminReportsPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "/facilities",
    element: <FacilitiesPage />,
  },
  {
    path: "/facilities/:id",
    element: <FacilityDetailsPage />,
  },
  {
    path: "/assets",
    element: <AssetCatalogPage />,
  },
  {
    path: "/assets/:id",
    element: <AssetDetailsPage />,
  },
  {
    path: "/new-reservation",
    element: <NewReservationPage />,
  },
  {
    path: "/reservations",
    element: <MyReservationsPage />,
  },
  {
    path: "/reservations/:id",
    element: <ReservationDetailsPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/help",
    element: <HelpPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/facilities",
    element: <AdminFacilitiesPage />,
  },
  {
    path: "/admin/facilities/:id",
    element: <AdminFacilitiesPage />,
  },
  {
    path: "/admin/assets",
    element: <AdminAssetsPage />,
  },
  {
    path: "/admin/assets/:id",
    element: <AdminAssetsPage />,
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />,
  },
  {
    path: "/admin/reports",
    element: <AdminReportsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);