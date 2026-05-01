import { Outlet, useNavigate } from "react-router";
import Sidebar, { type SidebarItem } from "../../components/Sidebar/Sidebar";
import { useAuthStore } from "../../store/useAuthStore";
import DashboardIcon from "../../components/Icon/DashboardIcon";
import CreateOrderIcon from "../../components/Icon/CreateOrderIcon";
import OrderListIcon from "../../components/Icon/OrderListIcon";
import TableManagementIcon from "../../components/Icon/TableManagementIcon";

const WaiterLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const waiterMenus: SidebarItem[] = [
    { name: "Dashboard", icon: DashboardIcon, path: "/waiter/dashboard" },
    { name: "Buat Pesanan", icon: CreateOrderIcon, path: "/waiter/buat-pesanan" },
    { name: "Daftar Pesanan", icon: OrderListIcon, path: "/waiter/daftar-pesanan" },
    { name: "Manajemen Meja", icon: TableManagementIcon, path: "/waiter/manajemen-meja" },
  ];

  return (
    // Background utama menggunakan warna abu-abu terang sesuai desain
    <div className="flex h-screen w-full bg-[#EFEEEE] overflow-hidden">
      
      {/* Sidebar akan selalu ada di kiri */}
      <Sidebar onLogout={handleLogout} menuItems={waiterMenus} />

      {/* Area Konten Utama (Kanan) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Outlet adalah tempat di mana halaman-halaman anak (Dashboard, dll) akan dirender */}
        <Outlet />
      </div>

    </div>
  );
};

export default WaiterLayout;