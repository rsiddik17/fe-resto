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

import MenuCardOnline from "../pages/customer/MenuPageOnline"
import CartPageOnline from "../pages/customer/CartPageOnline";
import CheckoutPageOnline from "../pages/customer/CheckOutPageOnline";
import PaymentPageOnline from "../pages/customer/PaymentPageOnline";
import PaymentSuccessOnline from "../pages/customer/PaymentSuccesOnline";
import OrderTrackingPage from "../pages/customer/OrderTrackingPage";
import OrderTrackingOnline from "../pages/customer/OrderTrackingOnline";
import ProfilePage from "../pages/customer/ProfilPage";


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
import { Component } from "lucide-react";
import ManajemenPegawaiPage from "../pages/admin/ManajemenPegawai";
import TambahPegawaiPage from "../components/AdminComponents/TambahPegawaiPage";
import EditPegawaiPage from "../components/AdminComponents/EditPegawai";
import DetailPegawaiPage from "../components/AdminComponents/DetailPegawaiPage";
import UbahSandiPage from "../pages/admin/UbahSandiPage";
import DaftarPelangganPage from "../pages/admin/DaftarPelanggan";
import LaporanPage from "../pages/admin/LaporanPage";
import LaporanMingguanPage from "../pages/admin/LaporanMingguanPage";
import LaporanBulananPage from "../pages/admin/LaporanBulanan";
import AdminProfilePage from "../pages/admin/AdminProfilePage";

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

    { path: "/unauthorized", Component: UnauthorizedPage },

  // --- PROTECTED ROUTES ---
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      { path: "/admin/dashboard", Component: AdminDashboardPage },
      { path: "/admin/manajemen-pegawai", Component: ManajemenPegawaiPage },
      { path: "/admin/manajemen-pegawai/tambah", Component: TambahPegawaiPage },
      { path: "/admin/manajemen-pegawai/edit/:id", Component: EditPegawaiPage },
      { path: "/admin/manajemen-pegawai/detail/:id", Component: DetailPegawaiPage },
      { path: "/admin/manajemen-pegawai/ubah-sandi/:id", Component: UbahSandiPage },
      { path: "/admin/daftar-pelanggan", Component: DaftarPelangganPage },
      { path: "/admin/laporan", Component: LaporanPage },
      { path: "/admin/laporan/mingguan", Component: LaporanMingguanPage },
      { path: "/admin/laporan/bulanan", Component: LaporanBulananPage },
      { path: "/admin/profil", Component: AdminProfilePage },
    ],
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
    element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />, 
    children: [
      { path: "/customer/home", Component: CustomerHomePage },
      { path: "/customer/menu", Component: MenuCardOnline },
      { path: "/customer/keranjang", Component: CartPageOnline },
      { path: "/customer/checkout", Component: CheckoutPageOnline },
      { path: "/customer/pembayaran", Component: PaymentPageOnline },
      { path: "/customer/pembayaran-berhasil", Component: PaymentSuccessOnline },
      {path: "/customer/pesanan", Component: OrderTrackingPage},
      {path: "/customer/pantau-pesanan", Component: OrderTrackingOnline},
      {path: "/customer/profil", Component: ProfilePage}
      
    ],
  },
    // --- PROTECTED ROUTES ---

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

    

    // 🚨 RUTE 404 HARUS DI PALING BAWAH (Catch-All Route)
    {
      path: "*",
      Component: NotFoundPage,
    },
  ],
  { basename: "/its-resto" },
);

export default router;
