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
        className="bg-white w-full max-w-[98%] md:max-w-sm rounded-2xl md:rounded-3xl  p-6 md:p-8 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        
        <div className="w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-6 md:mb-6">
          <InfoCircleIcon className="text-red-500 w-28 h-28" />
        </div>

        <h2 className="text-2xl font-extrabold mb-2">
          Waktu Habis!
        </h2>
        
        <p className="text-xl mb-8 md:mb-8 leading-relaxed">
          Waktu pembayaran Anda telah berakhir. Pesanan ini telah dibatalkan otomatis oleh sistem.
        </p>

        <Button 
          onClick={onClose}
          className="w-full py-3 md:py-3.5 rounded-md md:rounded-xl font-bold text-xl"
        >
          Kembali ke Menu
        </Button>

      </div>
    </div>
  );
};

export default ExpiredModal;