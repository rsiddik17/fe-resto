import { useState, useRef, useEffect } from "react";
import { MoreVertical, FileText, UserCheck, KeyRound, Trash2 } from "lucide-react";

interface ActionMenuProps {
  onDetail: () => void;
  onEditProfil: () => void;
  onUbahPassword: () => void;
  onHapus: () => void;
}

const ActionMenu = ({ onDetail, onEditProfil, onUbahPassword, onHapus }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="inline-block relative" ref={menuRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-150/40"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        /* 🌟 FIX CONTAINER BOX: Menggunakan border-gray-100 halus dengan shadow yang lembut */
        <div className="absolute right-4 mt-1 w-44 bg-white border border-gray-100/80 rounded-[16px] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
          
          {/* Item: Detail */}
          <button
            type="button"
            onClick={() => { onDetail(); setIsOpen(false); }}
            /* 🌟 FIX HOVER: Menggunakan bg-[#F3F4F6] abu-abu flat sesuai mockup figma */
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-[#F3F4F6] hover:text-black flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <FileText size={14} className="text-gray-400" />
            Detail
          </button>

          {/* Item: Edit Profil */}
          <button
            type="button"
            onClick={() => { onEditProfil(); setIsOpen(false); }}
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-[#F3F4F6] hover:text-black flex items-center gap-2.5 cursor-pointer border-t border-gray-100/50 transition-colors"
          >
            <UserCheck size={14} className="text-gray-400" />
            Edit Profil
          </button>

          {/* Item: Ubah Kata Sandi */}
          <button
            type="button"
            onClick={() => { onUbahPassword(); setIsOpen(false); }}
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-[#F3F4F6] hover:text-black flex items-center gap-2.5 cursor-pointer border-t border-gray-100/50 transition-colors"
          >
            <KeyRound size={14} className="text-gray-400" />
            Ubah Kata Sandi
          </button>

          {/* Item: Hapus */}
          <button
            type="button"
            onClick={() => { onHapus(); setIsOpen(false); }}
            /* 🌟 FIX HAPUS: Warna teks menggunakan merah cerah solid, dengan hover bg-red-50 transparan */
            className="w-full text-left px-3.5 py-2.5 text-[13px] font-extrabold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer border-t border-gray-100/80 transition-colors"
          >
            <Trash2 size={14} className="text-red-500" />
            Hapus
          </button>

        </div>
      )}
    </div>
  );
};

export default ActionMenu;