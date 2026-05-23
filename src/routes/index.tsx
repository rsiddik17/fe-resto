/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router";
// import { lazy } from "react";

// IMPORT NORMAL (Hanya untuk Komponen Struktural)
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
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
import CustomerHomePage from "../pages/customer/CustomerHomePage";

// Kiosk Pages
import KioskHomePage from "../pages/kiosk/KioskHomePage";
import KioskGuestInputPage from "../pages/kiosk/KioskGuestInputPage";
import KioskTableInfoPage from "../pages/kiosk/KioskTableInfoPage";
import KioskMenuPage from "../pages/kiosk/KioskMenuPage";
import KioskCartPage from "../pages/kiosk/KioskCartPage";
import KioskCheckoutPage from "../pages/kiosk/KioskCheckoutPage";
import KioskPaymentPage from "../pages/kiosk/KioskPaymentPage";
import KioskOrderSuccessPage from "../pages/kiosk/KioskOrderSuccessPage";
import KioskProfilePage from "../pages/kiosk/KioskProfilePage";

// QR Pages
import MobileTableInfoPage from "../pages/qr/MobileTableInfoPage";
import MobileMenuPage from "../pages/qr/MobileMenuPage";
import MobileCartPage from "../pages/qr/MobileCartPage";
import MobileCheckoutPage from "../pages/qr/MobileCheckoutPage";
import MobilePaymentPage from "../pages/qr/MobilePaymentPage";
import MobileOrderSuccessPage from "../pages/qr/MobileOrderSuccessPage";

// Waiter Pages
import WaiterLayout from "../layouts/WaiterLayout/WaiterLayout";
import WaiterProfilePage from "../pages/waiter/WaiterProfilePage";
import WaiterCreateOrderPage from "../pages/waiter/WaiterCreateOrderPage";
import WaiterSelectTablePage from "../pages/waiter/WaiterSelectTablePage";
import WaiterSelectMenuPage from "../pages/waiter/WaiterSelectMenuPage";
import WaiterPaymentPage from "../pages/waiter/WaiterPaymentPage";
import WaiterOrderListPage from "../pages/waiter/WaiterOrderListPage";
import WaiterTableManagementPage from "../pages/waiter/WaiterTableManagementPage";
import WaiterTableDetailPage from "../pages/waiter/WaiterTableDetailPage";

// Cashier Pages
import CashierLayout from "../layouts/CashierLayout/CashierLayout";
import CashierMenuStockPage from "../pages/cashier/CashierMenuStockPage";
import CashierEditMenuPage from "../pages/cashier/CashierEditMenuPage";
import CashierDetailMenuPage from "../pages/cashier/CashierDetailMenuPage";
import CashierAddMenuPage from "../pages/cashier/CashierAddMenuPage";
import CashierProfilePage from "../pages/cashier/CashierProfilePage";
import CashierOrderListPage from "../pages/cashier/CashierOrderListPage";
import CashierPaymentValidationPage from "../pages/cashier/CashierPaymentValidationPage";
import CashierCreateOrderPage from "../pages/cashier/CashierCreateOrderPage";
import CashierSelectTablePage from "../pages/cashier/CashierSelectTablePage";
import CashierSelectMenuPage from "../pages/cashier/CashierSelectMenuPage";
import CashierPaymentPage from "../pages/cashier/CashierPaymentPage";
import CashierTableManagementPage from "../pages/cashier/CashierTableManagementPage";
import CashierDiscountManagementPage from "../pages/cashier/CashierDiscountManagementPage";
import CashierReportPage from "../pages/cashier/CashierReportPage";
import KitchenOrderListPage from "../pages/kitchen/KitchenOrderListPage";
import KitchenLayout from "../layouts/KitchenLayout/KitchenLayout";
import KitchenProfilePage from "../pages/kitchen/KitchenProfilePage";
import KitchenMenuStockPage from "../pages/kitchen/KitchenMenuStockPage";
import KitchenDetailMenuPage from "../pages/kitchen/KitchenDetailMenuPage";
import GuestRoute from "./GuestRoute";

const router = createBrowserRouter(
  [
    {
      element: <PublicRoute />,
      children: [
        { path: "/", Component: LoginPage },
        { path: "/register", Component: RegisterPage },
        { path: "/forgot-password", Component: ForgotPasswordPage },
        { path: "/reset-password", Component: ResetPasswordPage },
        { path: "/verification-otp", Component: VerifyOtpPage },
      ],
    },
    

    { path: "/unauthorized", Component: UnauthorizedPage },
    

    // --- GUEST ROUTES ---
    { path: "/qr/:tableId", Component: MobileTableInfoPage },
    {
      element: <GuestRoute />, // Wrapper khusus Guest
      children: [
        { path: "/qr/menu", Component: MobileMenuPage },
        { path: "/qr/cart", Component: MobileCartPage },
        { path: "/qr/checkout", Component: MobileCheckoutPage },
        { path: "/qr/payment", Component: MobilePaymentPage },
        { path: "/qr/order-success", Component: MobileOrderSuccessPage },
      ],
    },

    // --- PROTECTED ROUTES ---
    {
      element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
      children: [{ path: "/admin/dashboard", Component: AdminDashboardPage }],
    },

    {
      element: <ProtectedRoute allowedRoles={["CASHIER"]} />,
      children: [
        {
          element: <CashierLayout />,
          children: [
            {
              path: "/cashier/dashboard",
              Component: CashierDashboardPage,
            },
            {
              path: "/cashier/management-menu-stock",
              Component: CashierMenuStockPage,
            },
            {
              path: "/cashier/management-menu-stock/add-menu",
              Component: CashierAddMenuPage,
            },
            {
              path: "/cashier/management-menu-stock/edit-menu/:id",
              Component: CashierEditMenuPage,
            },
            {
              path: "/cashier/management-menu-stock/detail-menu/:id",
              Component: CashierDetailMenuPage,
            },
            {
              path: "/cashier/order-list",
              Component: CashierOrderListPage,
            },
            {
              path: "/cashier/order-list/payment-validation",
              Component: CashierPaymentValidationPage,
            },
            {
              path: "/cashier/order-list/create-order",
              Component: CashierCreateOrderPage,
            },
            {
              path: "/cashier/order-list/create-order/select-table",
              Component: CashierSelectTablePage,
            },
            {
              path: "/cashier/order-list/create-order/select-menu",
              Component: CashierSelectMenuPage,
            },
            {
              path: "/cashier/order-list/create-order/payment-order",
              Component: CashierPaymentPage,
            },
            {
              path: "/cashier/management-table",
              Component: CashierTableManagementPage,
            },
            {
              path: "/cashier/management-discount",
              Component: CashierDiscountManagementPage,
            },
            {
              path: "/cashier/report",
              Component: CashierReportPage,
            },
          ],
        },
        {
          path: "/cashier/profile",
          Component: CashierProfilePage,
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["WAITER"]} />,
      children: [
        {
          element: <WaiterLayout />,
          children: [
            {
              path: "/waiter/dashboard",
              Component: WaiterDashboardPage,
            },
            {
              path: "/waiter/create-order",
              Component: WaiterCreateOrderPage,
            },
            {
              path: "/waiter/create-order/select-table",
              Component: WaiterSelectTablePage,
            },
            {
              path: "/waiter/create-order/select-menu",
              Component: WaiterSelectMenuPage,
            },
            {
              path: "/waiter/create-order/payment-order",
              Component: WaiterPaymentPage,
            },
            {
              path: "/waiter/order-list",
              Component: WaiterOrderListPage,
            },
            {
              path: "/waiter/table-management",
              Component: WaiterTableManagementPage,
            },
            {
              path: "/waiter/table-management/:id",
              Component: WaiterTableDetailPage,
            },
          ],
        },
        {
          path: "/waiter/profile",
          Component: WaiterProfilePage,
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["KITCHEN"]} />,
      children: [
        {
          element: <KitchenLayout />,
          children: [
            {
              path: "/kitchen/order-list",
              Component: KitchenOrderListPage,
            },
            {
              path: "/kitchen/menu-stock",
              Component: KitchenMenuStockPage,
            },
            {
              path: "/kitchen/menu-stock/detail-menu/:id",
              Component: KitchenDetailMenuPage,
            },
          ],
        },
        {
          path: "/kitchen/profile",
          Component: KitchenProfilePage,
        },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["KIOSK_SYSTEM"]} />,
      children: [
        { path: "/kiosk/home", Component: KioskHomePage },
        { path: "/kiosk/guest-input", Component: KioskGuestInputPage },
        { path: "/kiosk/info-table", Component: KioskTableInfoPage },
        { path: "/kiosk/menu", Component: KioskMenuPage },
        { path: "/kiosk/cart", Component: KioskCartPage },
        { path: "/kiosk/checkout", Component: KioskCheckoutPage },
        { path: "/kiosk/payment", Component: KioskPaymentPage },
        { path: "/kiosk/order-success", Component: KioskOrderSuccessPage },
        { path: "/kiosk/profile", Component: KioskProfilePage },
      ],
    },

    {
      element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />,
      children: [{ path: "/customer/home", Component: CustomerHomePage }],
    },

    // 🚨 RUTE 404 HARUS DI PALING BAWAH (Catch-All Route)
    {
      path: "*",
      Component: NotFoundPage,
    },
  ],
  { basename: "/its-resto" },
);

export default router;
