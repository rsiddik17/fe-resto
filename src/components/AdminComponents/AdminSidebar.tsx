import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronsRight,
  ChevronsLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../utils/utils";
import Button from "../ui/Button";
import LogOutIcon from "../Icon/LogOutIcon";
import LogoutConfirmModal from "../Modal/LogoutConfirmModal";
import ReportIcon from "../Icon/ReportIcon";
import UserIcon from "../Icon/UserIcon";
import DashboardIcon from "../Icon/DashboardIcon";
import UserCogIcon from "../Icon/UserCogIcon";

// Menu untuk Admin
const adminMenuItems = [
  { name: "Dashboard", icon: DashboardIcon, path: "/admin/dashboard" },
  { name: "Manajemen Pegawai", icon: UserCogIcon, path: "/admin/employee-management" },
  { name: "Daftar Pelanggan", icon: UserIcon, path: "/admin/customer-list" },
  { name: "Laporan", icon: ReportIcon, path: "/admin/report" },
];

const AdminSidebar = ({ onLogout }: { onLogout?: () => void }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();

  // Tutup sidebar otomatis di mobile saat pindah halaman
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Cari menu aktif
  const activeMenu = adminMenuItems.find((item) =>
    location.pathname.includes(item.path)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    window.location.href = "/its-resto/";
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    handleLogout();
  };

  return (
    <>
      {/* Tombol Hamburger (Mobile) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-10 left-4 z-40 py-2 px-2.5 flex gap-2 bg-primary text-white rounded-sm shadow-md cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <Menu size={24} /> {activeMenu?.name || "Menu"}
      </button>

      {/* Overlay Gelap (Mobile) */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-primary h-screen flex flex-col transition-all duration-300 ease-in-out shadow-2xl shrink-0 z-50",
          "lg:relative",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "fixed top-0 left-0 w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Tombol Collapse (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden absolute -right-3 top-10 bg-white w-6 h-6 rounded-full lg:flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-50 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronsRight size={18} className="text-primary" />
          ) : (
            <ChevronsLeft size={18} className="text-primary" />
          )}
        </button>

        {/* Tombol Close (Mobile) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-6 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X size={26} strokeWidth={2.5} />
        </button>

        {/* Logo */}
        <div
          className={cn(
            "flex items-center mt-7 mb-7 transition-all duration-300",
            isCollapsed ? "lg:justify-center" : "pl-6"
          )}
        >
          <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-12 h-12 shadow-sm">
            <img
              src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
              alt="Logo"
              className="w-10 h-10 object-cover"
            />
          </div>
          <span
            className={cn(
              "text-white font-bold text-lg truncate transition-all duration-300 ease-in-out",
              isCollapsed
                ? "lg:max-w-0 lg:opacity-0 lg:ml-0 max-w-50 opacity-100 ml-3"
                : "max-w-50 opacity-100 ml-3"
            )}
          >
            IT'S Resto
          </span>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 flex flex-col gap-2 overflow-x-hidden px-2">
          {adminMenuItems.map((item) => {
            const isActive =
              item.name === "Laporan"
                ? location.pathname.includes("/admin/report")
                : location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center py-2.5 transition-all duration-300 ease-in-out group rounded-2xl",
                  isCollapsed
                    ? "lg:w-full lg:justify-center"
                    : "w-full px-3",
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon
                  size={24}
                  className={cn(
                    "shrink-0 transition-colors w-5 h-5",
                    isActive
                      ? "text-primary"
                      : "text-white/60 group-hover:text-white"
                  )}
                />
                <span
                  className={cn(
                    "text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                    isCollapsed
                      ? "lg:max-w-0 lg:opacity-0 lg:ml-0 max-w-50 opacity-100 ml-3"
                      : "max-w-50 opacity-100 ml-3"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Keluar */}
        <div className="mb-6 flex flex-col overflow-x-hidden px-2">
          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            className={cn(
              "flex items-center py-2.5 transition-all duration-300 ease-in-out text-white/60 hover:bg-white/10 hover:text-white cursor-pointer group rounded-2xl",
              isCollapsed ? "lg:w-full lg:justify-center" : "w-full px-3"
            )}
            title={isCollapsed ? "Keluar" : ""}
          >
            <LogOutIcon className="shrink-0 w-5 h-5 transition-colors group-hover:text-white text-white/60" />
            <span
              className={cn(
                "text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "lg:max-w-0 lg:opacity-0 lg:ml-0 max-w-50 opacity-100 ml-3"
                  : "max-w-50 opacity-100 ml-3"
              )}
            >
              Keluar
            </span>
          </Button>
        </div>
      </aside>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default AdminSidebar;