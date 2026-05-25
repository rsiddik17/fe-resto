import { X, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import TableIcon from "../Icon/TableIcon";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable: () => void; // Fungsi untuk pindah ke halaman pilih meja
}

const CreateOrderModal = ({ isOpen, onClose, onSelectTable }: CreateOrderModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* PENYESUAIAN UKURAN: Lebar 400px agar pas di desktop */}
      <div 
        className="bg-white rounded-sm shadow-xl mx-4 md:mx-0 flex flex-col relative animate-in zoom-in-95 duration-200 w-118 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 mb-0.5 border-b border-gray-100">
          <h2 className="text-[17px] font-bold">Buat Pesanan Baru</h2>
          <button onClick={onClose} className="text-black/70 hover:text-black transition-colors bg-gray/30 hover:bg-gray/25 p-0.75 rounded-full cursor-pointer">
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="px-5 pb-5">
          {/* Kotak Ungu Muda */}
          <div className="bg-primary/15 rounded-sm p-4 flex flex-col items-center justify-center text-center gap-3 mb-5 border border-primary/10">
            {/* Ikon Meja (Custom SVG sederhana) */}
            <TableIcon className="text-primary w-14 h-14" />
            <p className="text-black/50 text-sm leading-relaxed px-4">
              Mulai pesanan baru dengan memilih meja
            </p>
          </div>

          <Button 
            onClick={onSelectTable}
            className="w-full py-2.5 rounded-sm text-sm font-bold flex items-center justify-center gap-0.5 shadow-sm"
          >
            Pilih Meja <ChevronRight size={16} strokeWidth={3.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;