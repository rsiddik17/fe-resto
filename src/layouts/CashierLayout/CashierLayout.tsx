import { Outlet, useNavigate } from "react-router";

import { useAuthStore } from "../../store/useAuthStore";
import Sidebar, { type SidebarItem } from "../../components/Sidebar/Sidebar";
import DashboardIcon from "../../components/Icon/DashboardIcon";
import AllMenuIcon from "../../components/Icon/AllMenuIcon";
import OrderListIcon from "../../components/Icon/OrderListIcon";
import TableManagementIcon from "../../components/Icon/TableManagementIcon";
import DiscountIcon from "../../components/Icon/DiscountIcon";
import ReportIcon from "../../components/Icon/ReportIcon";

const CashierLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cashierMenus: SidebarItem[] = [
    { name: "Dashboard", icon: DashboardIcon, path: "/cashier/dashboard" },
    { name: "Manajemen Menu & Stok", icon: AllMenuIcon, path: "/cashier/management-menu-stock" },
    { name: "Daftar Pesanan", icon: OrderListIcon, path: "/cashier/order-list" },
    { name: "Manajemen Meja", icon: TableManagementIcon, path: "/cashier/management-table" },
    { name: "Manajemen Diskon", icon: DiscountIcon, path: "/cashier/management-discount" },
    { name: "Laporan", icon: ReportIcon, path: "/cashier/reports" },
  ];

  return (
    <div className="flex h-screen w-full bg-[#EFEEEE] overflow-hidden">
      <Sidebar onLogout={handleLogout} menuItems={cashierMenus} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default CashierLayout;