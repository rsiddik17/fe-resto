import { X } from "lucide-react";
import WarningIcon from "../Icon/WarningIcon";

interface CancelConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelConfirmationModal = ({ isOpen, onClose, onConfirm }: CancelConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-sm shadow-sm overflow-hidden animate-in zoom-in-95 duration-200 relative p-6 pt-8 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
        
        {/* Tombol Close (X) di pojok kanan atas */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-black bg-[#DEDED9] rounded-full p-0.5 transition-colors"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Ikon Warning Merah */}
          <WarningIcon strokeWidth={2.5} className="w-10 h-10 text-red-500 mb-4" />

        {/* Teks Konfirmasi */}
        <h2 className="text-base md:text-[17.5px] font-bold mb-1.5 text-red-600">
          Batalkan Pesanan?
        </h2>
        <p className="text-[#4A4553] text-xs md:text-[13.5px] mb-10 leading-relaxed">
          Tindakan ini tidak dapat diurungkan dan <br/>pesanan akan masuk ke riwayat pembatalan.
        </p>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-4 w-[97%]">
          <button
            onClick={onClose}
            className="flex-1 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 text-sm font-bold py-2.5 rounded-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white text-sm font-bold py-2.5 rounded-xs hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
          >
            Ya, Batalkan
          </button>
        </div>

      </div>
    </div>
  );
};

export default CancelConfirmationModal;