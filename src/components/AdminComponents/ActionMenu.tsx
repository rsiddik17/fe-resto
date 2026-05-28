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
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 200;
      setDropdownPosition(spaceBelow < dropdownHeight ? "top" : "bottom");
    }
  }, [isOpen]);

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
      <button ref={buttonRef} type="button" onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100">
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-50 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"}`}>
          <button onClick={() => { onDetail(); setIsOpen(false); }} className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2.5">
            <FileText size={14} /> Detail
          </button>
          <button onClick={() => { onEditProfil(); setIsOpen(false); }} className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2.5 border-t border-gray-100">
            <UserCheck size={14} /> Edit Profil
          </button>
          <button onClick={() => { onUbahPassword(); setIsOpen(false); }} className="w-full text-left px-3.5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2.5 border-t border-gray-100">
            <KeyRound size={14} /> Ubah Kata Sandi
          </button>
          <button onClick={() => { onHapus(); setIsOpen(false); }} className="w-full text-left px-3.5 py-2.5 text-[13px] font-extrabold text-red-600 hover:bg-red-50 flex items-center gap-2.5 border-t border-gray-100">
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;