import { Check } from "lucide-react";
import Button from "../ui/Button";
import WarningIcon from "../Icon/WarningIcon";

interface MenuActionModalProps {
  isOpen: boolean;
  type: "delete" | "save"; // Menentukan mode modal
  menuName?: string; // Untuk teks dinamis saat menghapus menu
  onClose: () => void;
  onConfirm: () => void;
}

const MenuActionModal = ({ isOpen, type, menuName, onClose, onConfirm }: MenuActionModalProps) => {
  if (!isOpen) return null;

  const isDelete = type === "delete";

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/1 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-95 rounded-sm py-7 px-6 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* IKON ATAS */}
        <div className="mb-4">
          {isDelete ? (
            <WarningIcon className="text-[#FC1111] w-9 h-9" strokeWidth={2.5} fill="#E6394620" />
          ) : (
            <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
              <Check className="text-white w-8 h-8" strokeWidth={3.5} />
            </div>
          )}
        </div>

        {/* JUDUL */}
        <h2 className={`text-lg font-bold mb-3 ${isDelete ? 'text-[#FC1111]' : 'text-black'}`}>
          {isDelete ? "Hapus Menu?" : "Simpan Perubahan?"}
        </h2>
        
        {/* PESAN / DESKRIPSI */}
        <p className="mb-6 text-[14px] leading-relaxed px-2">
          {isDelete 
            ? <>Apakah anda yakin ingin menghapus menu <br/><span>"{menuName}"</span> ? Tindakan ini tidak dapat dibatalkan</>
            : "Apakah anda yakin ingin mengubah data Menu ? Tindakan ini tidak dapat dibatalkan"
          }
        </p>

        {/* TOMBOL AKSI */}
        <div className="flex justify-center w-full gap-10">
          <Button 
            onClick={onClose}
            className="flex-1 max-w-30 py-2 font-normal text-[13px] bg-[#D9D9D9] hover:bg-gray/50 text-black rounded-xs transition-colors"
          >
            Batal
          </Button>
          
          <Button 
            onClick={onConfirm}
            className={`flex-1 max-w-30 py-2 font-normal text-[13px] text-white rounded-xs transition-colors ${
              isDelete ? 'bg-[#FC1111] hover:bg-red-600' : 'bg-primary hover:bg-[#5a0b64]'
            }`}
          >
            {isDelete ? "Ya, Hapus" : "Ya, Simpan"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default MenuActionModal;