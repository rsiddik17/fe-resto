import { Check } from "lucide-react";
import Button from "../ui/Button";
// import { useNavigate } from "react-router";

interface SuccessModalProps {
  itemName: string;
  onViewCart: () => void;
  onClose: () => void;
  mode?: "kiosk" | "online";
}

const SuccessModal = ({ 
  itemName, 
  onViewCart, 
  onClose, 
  mode = "kiosk" 
}: SuccessModalProps) => {
  
  // 1. Definisikan gaya berdasarkan mode
  const isKiosk = mode === "kiosk";
  
  const containerStyle = isKiosk 
    ? "max-w-2xl p-16 rounded-[3rem]" 
    : "max-w-sm p-8 rounded-2xl";

  const iconBoxSize = isKiosk ? "w-40 h-40" : "w-26 h-26";
  const iconSize = isKiosk ? 80 : 50;
  const titleSize = isKiosk ? "text-4xl" : "text-xl";

  return (
    <div 
      className="fixed inset-0 z-110 flex items-center justify-center backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        // PERBAIKAN: max-w-sm dihapus dari sini karena sudah ada di dalam ${containerStyle}
        className={`bg-white w-full ${containerStyle} flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Ikon Ceklis */}
        <div className={`${iconBoxSize} bg-primary rounded-full flex items-center justify-center mb-6 shadow-md`}>
          <Check size={iconSize} strokeWidth={4} className="text-white" />
        </div>

        {/* Teks Judul */}
        <h2 className={`${titleSize} font-extrabold mb-2 text-black`}>
          Berhasil Ditambahkan!
        </h2>
        
        <p className={`${isKiosk ? "text-xl" : "text-sm"} text-gray-500 mb-8 leading-relaxed px-2`}>
          <span className="font-semibold">{itemName}</span> telah masuk ke keranjang pesananmu
        </p>

        {/* Tombol Aksi */}
        <div className="w-full flex flex-col gap-3">
          <Button 
            onClick={onViewCart} 
            className={`w-full ${isKiosk ? "py-6 text-xl" : "py-3 text-sm"} rounded-xs font-bold`}
          >
            Lihat Keranjang
          </Button>
          
          <Button 
            onClick={onClose}
            className={`w-full ${isKiosk ? "py-6 text-xl" : "py-3 text-sm"} rounded-xs font-bold bg-primary/20 hover:bg-primary/30 text-primary transition-colors border-none shadow-none`}
          >
            Kembali ke Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;