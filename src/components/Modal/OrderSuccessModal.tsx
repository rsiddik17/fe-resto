import { Check } from "lucide-react";

interface OrderSuccessModalProps {
  isOpen: boolean;
}

const OrderSuccessModal = ({ isOpen }: OrderSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/5 backdrop-blur-[3px] p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xs rounded-xl shadow-lg animate-in zoom-in-95 duration-200 p-8 flex flex-col items-center text-center">
        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center text-white mb-5 shadow-sm">
          <Check size={36} strokeWidth={3} />
        </div>
        <h2 className="text-[18px] md:text-[20px] font-bold text-black leading-tight">
          Perubahan<br />Berhasil Disimpan
        </h2>
      </div>
    </div>
  );
};

export default OrderSuccessModal;