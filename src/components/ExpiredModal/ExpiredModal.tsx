import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Button from "../ui/Button";

interface ExpiredModalProps {
  onClose: () => void;
}

const ExpiredModal = ({ onClose }: ExpiredModalProps) => {
  
  // UX TAMBAHAN: Auto-close setelah 5 detik jika user sudah pergi dari mesin Kiosk
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        
        {/* Ikon Merah Peringatan */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" strokeWidth={2.5} />
        </div>

        <h2 className="text-2xl font-extrabold mb-2">
          Waktu Habis!
        </h2>
        
        <p className="text-gray mb-8 leading-relaxed">
          Waktu pembayaran Anda telah berakhir. Pesanan ini telah dibatalkan otomatis oleh sistem.
        </p>

        <Button 
          onClick={onClose}
          className="w-full py-3.5 rounded-xl font-bold text-lg"
        >
          Kembali ke Home
        </Button>

      </div>
    </div>
  );
};

export default ExpiredModal;