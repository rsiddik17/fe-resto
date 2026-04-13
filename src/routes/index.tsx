/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router";
import { lazy } from "react";

// IMPORT NORMAL (Hanya untuk Komponen Struktural)
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "../components/PublicRoute/PublicRoute";
import SuspenseWrapper from "../components/SuspenseWrapper/SuspenseWrapper";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Error Pages
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";
import NotFoundPage from "../pages/errors/NotFoundPage";

// Role Dashboards
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import CashierDashboardPage from "../pages/cashier/CashierDashboardPage";
import WaiterDashboardPage from "../pages/waiter/WaiterDashboardPage";
import KitchenDashboardPage from "../pages/kitchen/KitchenDashboardPage";
import CustomerHomePage from "../pages/customer/CustomerHomePage";

// Kiosk Pages
import KioskHomePage from "../pages/kiosk/KioskHomePage";
import GuestInputPage from "../pages/kiosk/GuestInputPage";
import TableInfoPage from "../pages/kiosk/TableInfoPage";
import MenuPage from "../pages/kiosk/MenuPage";

import MenuCardOnline from "../pages/customer/MenuPageOnline"
import CartPageOnline from "../pages/customer/CartPageOnline";
import CheckoutPage from "../pages/customer/CheckOutPage";
import PaymentQRIS from "../components/PaymentQRIS/PaymentQRIS";

const router = createBrowserRouter([

  {
    element: <PublicRoute />,
    children: [
      { path: "/", Component: LoginPage },
      { path: "/register", Component: RegisterPage },
      { path: "/lupa-password", Component: ForgotPasswordPage },
      { path: "/reset-password", Component: ResetPasswordPage },
      { path: "/verifikasi-otp", Component: VerifyOtpPage },
    ],
  },

  
  { path: "/unauthorized", Component: UnauthorizedPage },


  // --- PROTECTED ROUTES ---
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [{ path: "/admin/dashboard", Component: AdminDashboardPage }],
  },
  {
    element: <ProtectedRoute allowedRoles={["CASHIER"]} />,
    children: [{ path: "/kasir/dashboard", Component: CashierDashboardPage }],
  },
  {
    element: <ProtectedRoute allowedRoles={["WAITER"]} />,
    children: [{ path: "/pelayan/order", Component: WaiterDashboardPage }],
  },
  {
    element: <ProtectedRoute allowedRoles={["KITCHEN"]} />,
    children: [{ path: "/kitchen/queue", Component: KitchenDashboardPage }],
  },
  {
    element: <ProtectedRoute allowedRoles={["KIOSK_SYSTEM"]} />, 
    children: [
      { path: "/kiosk/home", Component: KioskHomePage },
      { path: "/kiosk/input-tamu", Component: GuestInputPage },
      { path: "/kiosk/info-meja", Component: TableInfoPage },
      { path: "/kiosk/menu", Component: MenuPage },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />, 
    children: [
      { path: "/customer/home", Component: CustomerHomePage },
      { path: "/customer/menu", Component: MenuCardOnline },
      { path: "/customer/cart", Component: CartPageOnline },
      { path: "/customer/checkout", Component: CheckoutPage },
      { path: "/customer/payment", Component: PaymentQRIS},

      
      
    ],
  },


  // 🚨 RUTE 404 HARUS DI PALING BAWAH (Catch-All Route)
  { 
    path: "*", 
    Component: NotFoundPage
  },
]);

export default router;
