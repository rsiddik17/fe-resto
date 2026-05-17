import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; // <-- TAMBAHAN: Untuk nembus tabel
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
  const [coords, setCoords] = useState({ top: 0, left: 0 }); // <-- TAMBAHAN: Penyimpan posisi
  
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // <-- TAMBAHAN: Referensi dropdown di luar
  const navigate = useNavigate();

  // --- LOGIKA BARU: Kalkulasi posisi agar nempel sama tombol ---
  const updatePosition = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + 2, // Ekivalen dengan efek -top-1 dan mt-1.5 milikmu
        left: rect.right - 120, // Ekivalen dengan efek right-5 milikmu
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Karena pakai Portal, kita harus cegah menu tertutup saat isi menunya sendiri diklik
        if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
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
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="p-1 rounded-full text-black/50 hover:text-black transition-colors block cursor-pointer"
      >
        <MoreVertical size={16} />
      </button>

      {/* PORTAL: Memindahkan menu asli milikmu keluar dari tabel */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          // INLINE STYLE: Memaksa fixed position meng-override absolute dari class mu
          style={{ position: "fixed", top: coords.top, left: coords.left, margin: 0 }}
          className={cn(
            // KELAS ASLI MILIKMU SAMA PERSIS 100% TIDAK ADA YANG DIUBAH
            "absolute right-5 w-25 bg-[#EFEEEE] -top-1 mt-1.5 rounded-[10px] shadow-sm border border-gray-200 z-30 overflow-hidden flex flex-col",
            // LOGIKA AJAIB: Jika isLast true, pop-up buka ke ATAS. Jika tidak, buka ke BAWAH.
          )}
        >
          {/* FUNGSI ONCLICK ASLI MILIKMU SAMA PERSIS 100% */}
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
        </div>,
        document.body // Ditempel ke ujung HTML agar bebas hambatan
      )}
    </div>
  );
};

export default MenuTableAction;