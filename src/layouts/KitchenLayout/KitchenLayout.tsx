import { Outlet, useNavigate } from "react-router";
import Sidebar, { type SidebarItem } from "../../components/Sidebar/Sidebar";
import { useAuthStore } from "../../store/useAuthStore";
// Asumsi kamu punya icon ini, kalau beda silakan disesuaikan
import OrderListIcon from "../../components/Icon/OrderListIcon"; 
import StockIcon from "../../components/Icon/StockIcon"; 

const KitchenLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const kitchenMenus: SidebarItem[] = [
    { name: "Daftar Pesanan", icon: OrderListIcon, path: "/kitchen/order-list" },
    { name: "Menu Stok", icon: StockIcon, path: "/kitchen/menu-stock" },
  ];

  return (
    // Background utama abu-abu terang sesuai desain
    <div className="flex h-screen w-full bg-[#EFEEEE] overflow-hidden">
      
      {/* Sidebar Kiri */}
      <Sidebar onLogout={handleLogout} menuItems={kitchenMenus} />

      {/* Area Konten Utama (Kanan) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default KitchenLayout;