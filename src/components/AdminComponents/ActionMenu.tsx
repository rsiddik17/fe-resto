import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  FileText,
  UserCheck,
  KeyRound,
  Trash2,
} from "lucide-react";

interface ActionMenuProps {
  onDetail: () => void;
  onEditProfil: () => void;
  onUbahPassword: () => void;
  onHapus: () => void;
}

const ActionMenu = ({
  onDetail,
  onEditProfil,
  onUbahPassword,
  onHapus,
}: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fungsi untuk mendapatkan posisi dropdown
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };
    
    const rect = buttonRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const dropdownHeight = 200;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Tentukan posisi (atas atau bawah)
    const isTop = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
    
    let top;
    if (isTop) {
      top = rect.top + scrollY - dropdownHeight;
    } else {
      top = rect.bottom + scrollY;
    }
    
    // Posisi left agar dropdown rata kanan dengan tombol
    const left = rect.right + scrollX - 176; // 176px adalah lebar dropdown (w-44 = 176px)
    
    return { top, left };
  };

  const handleOpen = () => {
    if (!isOpen) {
      const { top, left } = getDropdownPosition();
      setCoords({ top, left });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="inline-block relative" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className="text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className="fixed z-50 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5"
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        >
          <button
            onClick={() => {
              onDetail();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2.5"
          >
            <FileText size={14} /> Detail
          </button>
          <button
            onClick={() => {
              onEditProfil();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2.5 border-t border-gray-100"
          >
            <UserCheck size={14} /> Edit Profil
          </button>
          <button
            onClick={() => {
              onUbahPassword();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2.5 border-t border-gray-100"
          >
            <KeyRound size={14} /> Ubah Kata Sandi
          </button>
          <button
            onClick={() => {
              onHapus();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-extrabold text-red-600 hover:bg-red-50 flex items-center gap-2.5 border-t border-gray-100"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;