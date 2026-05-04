import { useEffect } from "react";
import Button from "../ui/Button";
import InfoCircleIcon from "../Icon/InfoCircleIcon";

interface ExpiredModalProps {
  onClose: () => void;
}

const ExpiredModal = ({ onClose }: ExpiredModalProps) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/1 backdrop-blur-[3px] p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-[98%] md:max-w-md rounded-sm md:rounded-md  p-6 md:p-8 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        
        <div className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center mb-6 md:mb-6">
          <InfoCircleIcon className="text-red-500 w-26 h-26" />
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold mb-2">
          Waktu Habis!
        </h2>
        
        <p className="text-lg md:text-xl mb-8 md:mb-8 leading-relaxed">
          Waktu pembayaran Anda telah berakhir. Pesanan ini telah dibatalkan otomatis oleh sistem.
        </p>

        <Button 
          onClick={onClose}
          className="w-full py-2.5 md:py-3 rounded-sm md:rounded-md font-bold text-lg md:text-xl"
        >
          Kembali ke Menu
        </Button>

      </div>
    </div>
  );
};

export default ExpiredModal;