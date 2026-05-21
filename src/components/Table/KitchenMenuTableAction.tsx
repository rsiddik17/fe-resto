import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { MoreVertical } from "lucide-react";
import DetailIcon from "../Icon/DetailIcon";
import EditIcon from "../Icon/EditIcon";

interface KitchenMenuTableActionProps {
  menuId: string;
  onEdit: () => void;
}

const KitchenMenuTableAction = ({ menuId, onEdit }: KitchenMenuTableActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const updatePosition = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setCoords({ top: rect.top + 2, left: rect.right - 120 });
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) updatePosition();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button onClick={handleToggle} className="p-1 rounded-full text-black/50 hover:text-black transition-colors block cursor-pointer">
        <MoreVertical size={16} />
      </button>

      {isOpen && createPortal(
        <div ref={dropdownRef} style={{ position: "fixed", top: coords.top, left: coords.left, margin: 0 }}
             className="absolute right-5 w-25 bg-[#EFEEEE] -top-1 mt-1.5 rounded-[10px] shadow-sm border border-gray-200 z-30 overflow-hidden flex flex-col">
          
          {/* Tombol Detail mengarah ke halaman detail kitchen */}
          <button
            onClick={() => {
              setIsOpen(false);
              navigate(`/kitchen/menu-stock/detail-menu/${menuId}`);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors cursor-pointer border-b border-gray-300/70"
          >
            <DetailIcon className="w-4 h-4" /> Detail
          </button>

          {/* Tombol Edit memanggil props untuk membuka modal */}
          <button
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors cursor-pointer"
          >
            <EditIcon className="w-4 h-4" /> Edit
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default KitchenMenuTableAction;