/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router";
// import { lazy } from "react";

// IMPORT NORMAL (Hanya untuk Komponen Struktural)
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "../components/PublicRoute/PublicRoute";
// import SuspenseWrapper from "../components/SuspenseWrapper/SuspenseWrapper";

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
import CartPage from "../pages/kiosk/CartPage";
import CheckoutPage from "../pages/kiosk/CheckoutPage";
import PaymentPage from "../pages/kiosk/PaymentPage";
import OrderSuccessPage from "../pages/kiosk/OrderSuccessPage";
import MobileTableInfoPage from "../pages/qr/MobileTableInfoPage";
import MobileMenuPage from "../pages/qr/MobileMenuPage";
import MobileCartPage from "../pages/qr/MobileCartPage";
import MobileCheckoutPage from "../pages/qr/MobileCheckoutPage";
import MobilePaymentPage from "../pages/qr/MobilePaymentPage";
import MobileOrderSuccessPage from "../pages/qr/MobileOrderSuccessPage";
import ProfilePage from "../pages/kiosk/ProfilePage";

const router = createBrowserRouter([

  {
    element: <PublicRoute />,
    children: [
      { path: "/", Component: LoginPage },
      { path: "/register", Component: RegisterPage },
      { path: "/lupa-password", Component: ForgotPasswordPage },
      { path: "/reset-password", Component: ResetPasswordPage },
      { path: "/verifikasi-otp", Component: VerifyOtpPage },
      { path: "/qr/:tableId", Component: MobileTableInfoPage },
      { path: "/qr/menu", Component: MobileMenuPage },
      { path: "/qr/cart", Component: MobileCartPage },
      { path: "/qr/checkout", Component: MobileCheckoutPage },
      { path: "/qr/payment", Component: MobilePaymentPage },
      { path: "/qr/order-success", Component: MobileOrderSuccessPage },

      { path: "/kiosk/home", Component: KioskHomePage },
      { path: "/kiosk/guest-input", Component: GuestInputPage },
      { path: "/kiosk/info-table", Component: TableInfoPage },
      { path: "/kiosk/menu", Component: MenuPage },
      { path: "kiosk/cart", Component: CartPage},
      { path: "kiosk/checkout", Component: CheckoutPage},
      { path: "kiosk/payment", Component: PaymentPage},
      { path: "kiosk/order-success", Component: OrderSuccessPage},
      { path: "/kiosk/profile", Component: ProfilePage },
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
      { path: "/kiosk/guest-input", Component: GuestInputPage },
      { path: "/kiosk/info-table", Component: TableInfoPage },
      { path: "/kiosk/menu", Component: MenuPage },
      { path: "kiosk/cart", Component: CartPage},
      { path: "kiosk/checkout", Component: CheckoutPage},
      { path: "kiosk/payment", Component: PaymentPage},
      { path: "kiosk/order-success", Component: OrderSuccessPage}
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
], {basename: "/its-resto"});

export default router;
