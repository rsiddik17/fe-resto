import { MoreVertical } from "lucide-react";
import DeleteIcon from "../Icon/DeleteIcon";
import DetailIcon from "../Icon/DetailIcon";
import EditIcon from "../Icon/EditIcon";
import { useEffect, useRef, useState } from "react";
import type { DiscountItem } from "./DiscountTable";

const DiscountTableAction = ({
  item,
  onDetail,
  onEdit,
  onDelete,
}: {
  item: DiscountItem;
  onDetail?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Logic ajaib pendeteksi klik di luar dropdown agar bisa di-scroll
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-center" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-full text-black/50 hover:text-black transition-colors block cursor-pointer"
      >
        <MoreVertical size={18} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="absolute right-5 -top-1 mt-1.5 w-25 bg-[#EFEEEE] rounded-[10px] shadow-sm border border-gray-200 overflow-hidden text-left flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            onClick={() => {
              setIsOpen(false);
              if (onDetail) onDetail(item.id);
            }}
            className="px-4 py-2 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors flex items-center gap-3 cursor-pointer"
          >
            <DetailIcon className="w-4 h-4" /> Detail
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              if (onEdit) onEdit(item.id);
            }}
            className="px-4 py-2 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors flex items-center gap-3 cursor-pointer"
          >
            <EditIcon className="w-4 h-4" /> Edit
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              if (onDelete) onDelete(item.id);
            }}
            className="px-4 py-2 text-[13px] font-medium text-red-500 hover:bg-[#FFEBEB] transition-colors flex items-center gap-3 cursor-pointer"
          >
            <DeleteIcon className="w-4 h-4" /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscountTableAction