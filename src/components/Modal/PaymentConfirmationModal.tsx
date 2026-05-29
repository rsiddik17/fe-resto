import { Check, X } from "lucide-react";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentConfirmationModal = ({ isOpen, onClose, onConfirm }: PaymentConfirmationModalProps) => {
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

        {/* Ikon Centang Ungu */}
        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 shadow-sm">
          <Check size={40} strokeWidth={3.5} />
        </div>

        {/* Teks Konfirmasi */}
        <h2 className="text-base md:text-[17.5px] font-bold mb-1.5">
          Konfirmasi Validasi Pembayaran
        </h2>
        <p className="text-[#4A4553] text-xs md:text-[13.5px] mb-10">
          Validasi pembayaran untuk pesanan ini?
        </p>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-4 w-[97%]">
          <button
            onClick={onClose}
            className="flex-1 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 text-sm font-bold py-2.5 rounded-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-primary text-white text-sm font-bold py-2.5 rounded-xs hover:bg-[#5a0b64] transition-colors shadow-sm cursor-pointer"
          >
            Validasi
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentConfirmationModal;