import { Check } from "lucide-react";
import Button from "../ui/Button";

interface ConfirmFinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmFinishModal = ({ isOpen, onClose, onConfirm }: ConfirmFinishModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose} // Klik luar untuk close
    >
      <div 
        className="bg-white w-full max-w-100 rounded-sm p-6 md:pt-4 md:pb-6 md:px-8 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Klik dalam aman
      >
        {/* Icon Check Ungu */}
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-2.5 shadow-sm">
          <Check className="text-white w-8 h-8" strokeWidth={3} />
        </div>

        <h2 className="text-base md:text-[19px] font-bold mb-3">
          Konfirmasi Pesanan
        </h2>

        {/* Text Keterangan */}
        <div className="text-sm md:text-[15px] mb-3 leading-relaxed">
          <p>1. Pesanan ini akan ditandai sebagai <br /> selesai. Lanjutkan?</p>
          <p>2. Apakah Anda yakin pesanan ini sudah selesai?</p>
        </div>

        {/* Buttons (Batal & Selesai) */}
        <div className="flex justify-center w-full gap-10">
          <Button 
            onClick={onClose}
            className="py-2 w-32 bg-[#FFFFFF] hover:bg-black/5 border-[1.5px] border-gray/50 text-sm text-black font-normal rounded-[6px]"
          >
            Batal
          </Button>
          <Button 
            onClick={onConfirm}
            className="py-2 w-32 bg-primary text-white text-sm font-normal rounded-[6px] shadow-sm"
          >
            Selesai
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmFinishModal;