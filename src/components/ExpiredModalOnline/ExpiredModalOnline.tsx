import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface ExpiredModalOnlineProps {
  onClose: () => void;
}

const ExpiredModalOnline = ({ onClose }: ExpiredModalOnlineProps) => {
  
  // Timer otomatis 10 detik dari temanmu tetap jalan
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    // Menggunakan kelas standar utility Tailwind tanpa library tambahan
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      
      {/* CARD PUTIH: Dipaksa bulat melengkung halus pakai rounded-[32px] atau rounded-3xl */}
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center">
        
        {/* LINGKARAN IKON: Bulatan merah muda lembut bg-red-50 */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" strokeWidth={2.5} />
        </div>

        {/* JUDUL */}
        <h2 className="text-2xl font-bold mb-2 text-black">
          Waktu Habis!
        </h2>
        
        {/* DESKRIPSI */}
        <p className="text-gray-500 mb-8 leading-relaxed text-sm max-w-[280px]">
          Waktu pembayaran Anda telah berakhir. Pesanan ini telah dibatalkan otomatis oleh sistem.
        </p>

        {/* TOMBOL: Diganti pakai tag <button> biasa + rounded-full agar PASTI berbentuk kapsul bulat oval */}
        <button 
          onClick={onClose}
          className="w-full py-3.5 rounded-full font-bold text-lg bg-[#7A1FA2] hover:bg-[#6A1B9A] text-white transition-all active:scale-95 shadow-md shadow-purple-900/10"
        >
          Kembali ke Menu
        </button>

      </div>
    </div>
  );
};

export default ExpiredModalOnline;