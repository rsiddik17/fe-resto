import { Check } from "lucide-react";
import Button from "../ui/Button";

interface SuccessModalProps {
  itemName: string;
  onViewCart: () => void;
  onClose: () => void;
}

const SuccessModal = ({ itemName, onViewCart, onClose }: SuccessModalProps) => {
  return (
    // Overlay gelap dengan z-index lebih tinggi dari CartBottomBar
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/1 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose} // Tutup jika area luar diklik
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl pt-6 pb-10 px-9 flex flex-col items-center text-center shadow-sm animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Cegah klik di dalam modal menutup modal
      >
        {/* Ikon Ceklis Besar */}
        <div className="w-27.25 h-27.25 bg-primary rounded-full flex items-center justify-center mb-6 shadow-md">
          <Check size={50} strokeWidth={4} className="text-white" />
        </div>

        {/* Teks Konfirmasi */}
          <h2 className="text-xl font-bold mb-2">Berhasil Ditambahkan!</h2>
          <p className="text-sm text-gray mb-8 leading-relaxed px-2">
            <span>{itemName}</span> telah masuk ke keranjang pesananmu
          </p>

        {/* Tombol Aksi */}
        <div className="w-full flex flex-col gap-3">
          <Button
            onClick={onViewCart}
            className="w-full py-3 rounded-md font-bold"
          >
            Lihat Keranjang
          </Button>

          {/* Tombol sekunder dengan warna ungu muda */}
          <Button
            onClick={onClose}
            className="w-full py-3 rounded-md font-bold bg-primary/40 hover:bg-primary/50 text-primary transition-colors"
          >
            Kembali ke Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
