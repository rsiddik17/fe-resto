import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ChevronsRight, ChevronsLeft, UserCheck } from "lucide-react";
import { cn } from "../../utils/utils";
import Button from "../ui/Button";
import LogoutIcon from "../Icon/LogOutIcon";
import ReportIcon from "../Icon/ReportIcon";
import UserIcon from "../Icon/UserIcon";
import DashboardIcon from "../Icon/DashboardIcon";
import LogoutModal from "../LogoutModal/LogoutModal";

interface AdminSidebarProps {
  onLogout?: () => void;
}

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Daftar menu sesuai fitur Anda
  const adminMenuItems = [
    { name: "Dashboard", icon: DashboardIcon, path: "/admin/dashboard" },
    { name: "Manajemen Pegawai", icon: UserCheck, path: "/admin/manajemen-pegawai" },
    { name: "Daftar Pelanggan", icon: UserIcon, path: "/admin/daftar-pelanggan" },
    { name: "Laporan", icon: ReportIcon, path: "/admin/laporan" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <>
      <aside
        className={cn(
          "bg-primary h-screen flex flex-col relative transition-all duration-300 ease-in-out shadow-xl shrink-0 z-40",
          isCollapsed ? "w-22" : "w-69",
        )}
      >
        {/* Tombol Collapse */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-50 cursor-pointer"
        >
          {isCollapsed ? <ChevronsRight size={18} className="text-primary" /> : <ChevronsLeft size={18} className="text-primary" />}
        </button>

        {/* LOGO */}
        <div className={cn("flex items-center mt-8 mb-7 transition-all duration-300", isCollapsed ? "justify-center" : "pl-6")}>
          <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-13 h-13 shadow-sm">
            <img
              src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
              alt="Logo"
              className="w-14 h-14 object-cover"
              onError={(e) => {
                  e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <span className={cn("text-white font-bold text-xl truncate transition-all duration-300", isCollapsed ? "max-w-0 opacity-0" : "max-w-50 opacity-100 ml-4")}>
            IT'S RESTO
          </span>
        </div>

        {/* MENU NAVIGASI */}
        <nav className="flex-1 flex flex-col gap-2.75 overflow-x-hidden">
          {adminMenuItems.map((item) => {
            // Logika aktif untuk laporan (termasuk sub-halaman mingguan/bulanan)
            const isActive = item.name === "Laporan" 
              ? location.pathname.includes("/admin/laporan") 
              : location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center py-2 transition-all duration-300 ease-in-out group mx-auto",
                  isCollapsed ? "w-12 justify-center rounded-2xl" : "w-60 px-3 rounded-2xl",
                  isActive ? "bg-white text-primary shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon size={32} className={cn("shrink-0 transition-colors w-7.5 h-7.5", isActive ? "text-primary" : "text-white/60 group-hover:text-white")} />
                <span className={cn("text-base whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "max-w-0 opacity-0" : "max-w-50 opacity-100 ml-2.5")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* TOMBOL KELUAR */}
        <div className="mb-6 flex flex-col overflow-x-hidden">
          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            className={cn(
              "flex items-center py-2 transition-all duration-300 ease-in-out text-white/60 hover:bg-white/10 hover:text-white cursor-pointer group mx-auto",
              isCollapsed ? "w-12 justify-center rounded-2xl" : "w-60 px-3 rounded-2xl"
            )}
          >
            <LogoutIcon className="shrink-0 w-7.5 h-7.5 transition-colors group-hover:text-white text-white/60" />
            <span className={cn("text-base whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "max-w-0 opacity-0" : "max-w-50 opacity-100 ml-2.5")}>
              Keluar
            </span>
          </Button>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default AdminSidebar;