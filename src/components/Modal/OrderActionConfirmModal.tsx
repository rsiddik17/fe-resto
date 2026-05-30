import { X } from "lucide-react";
import Button from "../ui/Button";

interface OrderActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
  actionType: "MASUK" | "MEMASAK"; // Untuk menentukan teks modal
}

const OrderActionConfirmModal = ({ isOpen, onClose, onConfirm, orderId, actionType }: OrderActionConfirmModalProps) => {
  if (!isOpen) return null;

  // Menyesuaikan teks berdasarkan aksi
  const title = actionType === "MASUK" ? "Mulai Memasak" : "Pesanan Siap Saji";
  const subtitle = actionType === "MASUK" 
    ? "Apakah pesanan ini akan dimasak?" 
    : "Apakah pesanan ini sudah selesai?";
  const confirmText = actionType === "MASUK" ? "Mulai Masak" : "Siap Saji";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-sm shadow-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center relative pb-3" onClick={(e) => e.stopPropagation()}>
        
        {/* Tombol X (Close) kecil di kanan atas */}
        <button onClick={onClose} className="absolute top-3 right-3 text-black/50 hover:text-black bg-[#DEDED9] rounded-full w-4.5 h-4.5 flex items-center justify-center text-xs font-bold transition-colors">
          <X className="w-3.5 h-3.5" strokeWidth={3}/>
        </button>

        <div className="pt-8 mb-10 px-5">
          <h2 className="text-xl font-bold text-primary mb-0.5">{title}</h2>
          <p className="text-[14px] text-black/50 mb-5">{subtitle}</p>
          <h1 className="text-xl font-bold text-primary">{orderId}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-5 mb-1">
          <Button 
            onClick={onClose} 
            className="flex-1 py-2.5 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 text-[13px] md:text-[13px] lg:text-[13px] font-bold rounded-xs"
          >
            Batal
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] md:text-[13px] lg:text-[13px] font-bold rounded-xs"
          >
            {confirmText}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default OrderActionConfirmModal;