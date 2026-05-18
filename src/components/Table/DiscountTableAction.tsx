import { MoreVertical } from "lucide-react";
import DeleteIcon from "../Icon/DeleteIcon";
import DetailIcon from "../Icon/DetailIcon";
import EditIcon from "../Icon/EditIcon";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- LOGIKA BARU: Kalkulasi posisi agar nempel sama tombol ---
  const updatePosition = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + 2, // Ekivalen dengan efek -top-1 dan mt-1.5
        left: rect.right - 120, // Sesuaikan dengan lebar dropdown (w-25) agar proporsional
      });
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition(); // Set koordinat dulu sebelum dibuka!
    }
    setIsOpen(!isOpen);
  };

  // Logic ajaib pendeteksi klik di luar dropdown agar bisa di-scroll
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (
          dropdownRef.current &&
          dropdownRef.current.contains(e.target as Node)
        )
          return;
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIKA BARU: Update posisi terus-menerus saat di-scroll (tidak ditutup!) ---
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
    <div className="relative inline-block text-center" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="p-1 rounded-full text-black/50 hover:text-black transition-colors block cursor-pointer"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              margin: 0,
            }}
            className="absolute right-5 -top-1 mt-1.5 w-25 bg-[#EFEEEE] rounded-[10px] shadow-sm border border-gray-200 overflow-hidden flex flex-col z-30"
          >
            <button
              onClick={() => {
                setIsOpen(false);
                if (onDetail) onDetail(item.id);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors cursor-pointer border-b border-gray-300/70"
            >
              <DetailIcon className="w-4 h-4" /> Detail
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                if (onEdit) onEdit(item.id);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-black hover:bg-gray-100/80 transition-colors cursor-pointer border-b border-gray-300/70"
            >
              <EditIcon className="w-4 h-4" /> Edit
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                if (onDelete) onDelete(item.id);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[#FF3333] hover:bg-[#FFEBEB] transition-colors cursor-pointer"
            >
              <DeleteIcon className="w-4 h-4" /> Hapus
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default DiscountTableAction;
