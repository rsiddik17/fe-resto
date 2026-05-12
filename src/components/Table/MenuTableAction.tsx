import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { MoreVertical } from "lucide-react";
import { cn } from "../../utils/utils";
import DetailIcon from "../Icon/DetailIcon";
import EditIcon from "../Icon/EditIcon";
import DeleteIcon from "../Icon/DeleteIcon";

interface MenuTableActionProps {
  menuId: string;
  onDelete: () => void;
}

const MenuTableAction = ({
  menuId,
  onDelete,
}: MenuTableActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-5 w-25 bg-[#EFEEEE] -top-1 mt-1.5 rounded-[10px] shadow-lg border border-gray-200 z-30 overflow-hidden flex flex-col",
            // LOGIKA AJAIB: Jika isLast true, pop-up buka ke ATAS. Jika tidak, buka ke BAWAH.
          )}
        >
          <button
            onClick={() =>
              navigate(`/cashier/management-menu-stock/detail-menu/${menuId}`)
            }
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors cursor-pointer border-b border-gray-300/70"
          >
            <DetailIcon className="w-4 h-4" /> Detail
          </button>

          <button
            onClick={() =>
              navigate(`/cashier/management-menu-stock/edit-menu/${menuId}`)
            }
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors cursor-pointer border-b border-gray-300/70"
          >
            <EditIcon className="w-4 h-4" /> Edit
          </button>

          <button
            onClick={() => {
              onDelete(); // Memanggil fungsi dari props yang membuka modal
              setIsOpen(false); // Menutup pop-up menu action
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[#FF3333] hover:bg-[#FFEBEB] transition-colors cursor-pointer"
          >
            <DeleteIcon className="w-4 h-4" /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuTableAction;
