import { AlertCircle } from "lucide-react";
import Button from "../ui/Button";

interface ExpiredModalOnlineProps {
  onClose: () => void;
}

const ExpiredModalOnline = ({ onClose }: ExpiredModalOnlineProps) => {
  // Kita hapus timer auto-close karena di Web/HP user lebih baik menutupnya secara manual
  
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-sm rounded-4xl p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        
        {/* Ikon Merah Peringatan - Pakai bg-red-50 agar lembut */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" strokeWidth={2.5} />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-black">
          Waktu Habis!
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Waktu pembayaran Anda telah berakhir. Pesanan ini telah dibatalkan otomatis oleh sistem.
        </p>

        {/* Button dengan radius melengkung sesuai style Amalia */}
        <Button 
          onClick={onClose}
          className="w-full py-3.5 rounded-full font-bold text-lg bg-primary text-white"
        >
          Kembali ke Menu
        </Button>

      </div>
    </div>
  );
};

export default ExpiredModalOnline;