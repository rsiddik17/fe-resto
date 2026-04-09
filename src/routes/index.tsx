import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import CashierDashboardPage from "../pages/cashier/CashierDashboardPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import WaiterDashboardPage from "../pages/waiter/WaiterDashboardPage";
import KitchenDashboardPage from "../pages/kitchen/KitchenDashboardPage";
import KioskHomePage from "../pages/kiosk/KioskHomePage";
import CustomerHomePage from "../pages/customer/CustomerHomePage";
import PublicRoute from "../components/PublicRoute/PublicRoute";
import GuestInputPage from "../pages/kiosk/GuestInputPage";
import TableInfoPage from "../pages/kiosk/TableInfoPage";
import NotFoundPage from "../pages/errors/NotFoundPage";



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
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />, 
    children: [{ path: "/customer/home", Component: CustomerHomePage }],
  },


  // 🚨 RUTE 404 HARUS DI PALING BAWAH (Catch-All Route)
  { 
    path: "*", 
    Component: NotFoundPage 
  },
]);

export default router;
