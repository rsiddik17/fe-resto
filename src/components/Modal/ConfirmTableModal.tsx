import { X, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import TableIcon from "../Icon/TableIcon";
import UserIcon from "../Icon/UserIcon";

interface ConfirmTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  capacity: number;
  onConfirm: () => void; // Fungsi untuk masuk ke menu pesanan
}

const ConfirmTableModal = ({ isOpen, onClose, tableNumber, capacity, onConfirm }: ConfirmTableModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-sm shadow-md mx-4 md:mx-0 flex flex-col relative animate-in zoom-in-95 duration-200 w-92.5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mt-4 p-4 pb-2 border-b border-gray-100">
          <h2 className="text-[17px] font-bold">Konfirmasi Meja</h2>
          <button onClick={onClose} className="text-black/50 hover:text-black transition-colors -translate-y-6 bg-gray/30 hover:bg-gray/25 p-0.5 rounded-full cursor-pointer">
            <X size={14} strokeWidth={3.5} />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="pt-1 px-4 pb-5 flex flex-col gap-4">
          
          {/* Info Nomor Meja (Ungu Muda) */}
          <div className="bg-primary/15 rounded-sm p-3 mb-3 flex items-center gap-4 border border-primary/10">
               <TableIcon className="text-primary w-13 h-13" />
             <div className="flex flex-col">
               <span className="text-black/50 text-xs font-normal tracking-wider">Nomor Meja</span>
               <span className="font-bold text-base">Meja {tableNumber}</span>
             </div>
          </div>

          {/* Info Kapasitas (Outline Ungu) */}
          <div className="bg-white rounded-sm px-3 py-2.5 flex items-center gap-4 border-[1.34px] border-primary">
               <UserIcon className="text-primary w-9 h-9" strokeWidth={2.5} />
             <div className="flex flex-col">
               <span className="text-gray-500 text-xs font-normal tracking-wider">Kapasitas Meja</span>
               <span className="font-bold text-base">{capacity}</span>
             </div>
          </div>

          <Button 
            onClick={onConfirm}
            className="w-full mt-2.5 py-2.5 rounded-sm text-sm font-bold flex items-center justify-center gap-0.5 shadow-sm"
          >
            Pilih Menu <ChevronRight size={16} strokeWidth={3.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTableModal;