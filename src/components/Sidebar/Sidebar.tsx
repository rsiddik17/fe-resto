import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronsRight,
  ChevronsLeft,
  Menu, // <-- Import icon hamburger
  X, // <-- Import icon close
  type LucideIcon, // Import tipe data icon dari lucide
} from "lucide-react";
import { type ComponentType, type SVGProps } from "react";
import { cn } from "../../utils/utils";
import Button from "../ui/Button";
import LogOutIcon from "../Icon/LogOutIcon";

type CustomIcon = ComponentType<SVGProps<SVGSVGElement>>;

// 1. TIPE DATA UNTUK MENU
export interface SidebarItem {
  name: string;
  icon: LucideIcon | CustomIcon;
  path: string;
}

interface SidebarProps {
  onLogout: () => void;
  menuItems: SidebarItem[]; // 2. PROPS DINAMIS
}

const Sidebar = ({ onLogout, menuItems }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Tutup sidebar otomatis di mobile jika user berpindah rute
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const activeMenu = menuItems.find((item) =>
  location.pathname.includes(item.path)
);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 py-2 px-2.5 flex gap-2 bg-primary text-white rounded-sm shadow-md cursor-pointer hover:bg-primary-hover transition-colors"
      >
        <Menu size={24} /> {activeMenu?.name}
      </button>

      {/* 2. OVERLAY GELAP (Hanya muncul saat sidebar mobile terbuka) */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/3 z-40 backdrop-blur-[3px] transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-primary h-screen flex flex-col transition-all duration-300 ease-in-out shadow-2xl shrink-0 z-50",
          "lg:relative",
          isCollapsed ? "lg:w-20" : "lg:w-67.5",
          "fixed top-0 left-0 w-67.5",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Tombol Collapse */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden absolute -right-3 top-10 bg-white w-5.75 h-5.75 rounded-full lg:flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-50 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronsRight size={18} className="text-primary" />
          ) : (
            <ChevronsLeft size={18} className="text-primary" />
          )}
        </button>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-6 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X size={26} strokeWidth={2.5} />
        </button>

        {/* Header Sidebar (Logo) */}
        <div
          className={cn(
            "flex items-center mt-7 mb-7 transition-all duration-300",
            // Biarkan pl-[55px] agar logo sejajar lurus dengan ikon menu di bawahnya
            isCollapsed ? "lg:justify-center pl-6 lg:pl-0" : "pl-6"
          )}
        >
          <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-12.5 h-12.5 shadow-sm">
            <img
              src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
              alt="Logo"
              className="w-13.5 h-13.5 object-cover"
            />
          </div>

          <span
            className={cn(
              "text-white font-bold text-[19px] truncate transition-all duration-300 ease-in-out",
              isCollapsed
                ? "lg:max-w-0 lg:opacity-0 lg:ml-0 max-w-50 opacity-100 ml-4"
                : "max-w-50 opacity-100 ml-4",
            )}
          >
            IT'S Resto
          </span>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 flex flex-col gap-2.75 overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center py-2 transition-all duration-300 ease-in-out group",
                  // PERBAIKAN: Pakai mx-auto dan rounded-2xl untuk mode lebar
                  isCollapsed
                    ? "lg:w-11.5 lg:mx-auto lg:justify-center lg:rounded-2xl w-60 mx-auto px-2.5 rounded-2xl"
                    : "w-60 mx-auto px-2.5 rounded-2xl", // mx-auto menempatkan ke tengah!

                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon
                  size={28}
                  className={cn(
                    "shrink-0 transition-colors w-7.25 h-7.25",
                    isActive
                      ? "text-primary"
                      : "text-white/60 group-hover:text-white",
                  )}
                />
                <span
                  className={cn(
                    "text-[15.5px] whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                    isCollapsed
                      ? "lg:max-w-0 lg:opacity-0 lg:ml-0 max-w-50 opacity-100 ml-2.5"
                      : "max-w-50 opacity-100 ml-2.5",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Keluar */}
        <div className="mb-6 flex flex-col overflow-x-hidden">
          <Button
            onClick={onLogout}
            className={cn(
              "flex items-center py-2 transition-all duration-300 ease-in-out text-white/60 hover:bg-white/10 hover:text-white cursor-pointer group",
              // PERBAIKAN: Samakan dengan menu di atas
              isCollapsed
                ? "lg:w-11.5 lg:mx-auto lg:justify-center lg:rounded-2xl w-60 mx-auto px-2.5 rounded-2xl"
                : "w-60 mx-auto px-2.5 rounded-2xl",
            )}
            title={isCollapsed ? "Keluar" : ""}
          >
            <LogOutIcon className="shrink-0 w-7.25 h-7.25 transition-colors group-hover:text-white text-white/60" />

            <span
              className={cn(
                "font-normal text-[15.5px] whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "lg:max-w-0 lg:opacity-0 lg:ml-0 max-w-50 opacity-100 ml-2.5"
                  : "max-w-50 opacity-100 ml-2.5",
              )}
            >
              Keluar
            </span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
