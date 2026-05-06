import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronsRight,
  ChevronsLeft,
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
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-primary h-screen flex flex-col relative transition-all duration-300 ease-in-out shadow-2xl shrink-0 z-40",
        isCollapsed ? "w-22" : "w-69",
      )}
    >
      {/* Tombol Collapse */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-50 cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronsRight size={18} className="text-primary" />
        ) : (
          <ChevronsLeft size={18} className="text-primary" />
        )}
      </button>

      {/* Header Sidebar (Logo) */}
      <div
        className={cn(
          "flex items-center mt-8 mb-7 transition-all duration-300",
          // Biarkan pl-[55px] agar logo sejajar lurus dengan ikon menu di bawahnya
          isCollapsed ? "justify-center" : "pl-6",
        )}
      >
        <div className="bg-white rounded-full flex items-center justify-center shrink-0 w-13 h-13 shadow-sm">
          <img
            src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
            alt="Logo"
            className="w-14 h-14 object-cover"
          />
        </div>

        <span
          className={cn(
            "text-white font-bold text-xl truncate transition-all duration-300 ease-in-out",
            isCollapsed
              ? "max-w-0 opacity-0 ml-0"
              : "max-w-50 opacity-100 ml-4",
          )}
        >
          IT'S Resto
        </span>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 flex flex-col gap-2.5 overflow-x-hidden">
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
                  ? "w-12 mx-auto justify-center rounded-2xl"
                  : "w-60 mx-auto px-3 rounded-2xl", // mx-auto menempatkan ke tengah!

                isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              )}
              title={isCollapsed ? item.name : ""}
            >
              <item.icon
                size={32}
                className={cn(
                  "shrink-0 transition-colors w-7.5 h-7.5",
                  isActive
                    ? "text-primary"
                    : "text-white/60 group-hover:text-white",
                )}
              />
              <span
                className={cn(
                  "text-base whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                  isCollapsed
                    ? "max-w-0 opacity-0 ml-0"
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
              ? "w-12 mx-auto justify-center rounded-2xl"
              : "w-60 mx-auto px-3 rounded-2xl",
          )}
          title={isCollapsed ? "Keluar" : ""}
        >
          <LogOutIcon className="shrink-0 w-7.5 h-7.5 transition-colors group-hover:text-white text-white/60" />

          <span
            className={cn(
              "font-normal text-base whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
              isCollapsed
                ? "max-w-0 opacity-0 ml-0"
                : "max-w-50 opacity-100 ml-2.5",
            )}
          >
            Keluar
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;