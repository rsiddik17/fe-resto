// import { LogOut } from "lucide-react";
import LogoutIcon from "../Icon/LogOutIcon";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  if (!isOpen) return null; // Modal hanya muncul jika isOpen true[cite: 6]

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/10 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xs p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Icon Logout Bulat Ungu[cite: 6] */}
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
          <LogoutIcon size={32} strokeWidth={3} />
        </div>
        
        <h3 className="text-xl font-black text-black mb-3">Keluar dari akun Anda?</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Apakah Anda yakin keluar dari akun?
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1  bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 text-sm md:text-sm lg:text-sm  py-2.5 rounded-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-primary text-white text-sm md:text-sm lg:text-sm py-2.5 rounded-xs hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;