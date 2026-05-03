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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/1 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-sm shadow-md flex flex-col relative animate-in zoom-in-95 duration-200 w-95 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 pb-3 border-b border-gray-100">
          <h2 className="text-[17px] font-bold">Konfirmasi Meja</h2>
          <button onClick={onClose} className="text-black/70 hover:text-red-500 transition-colors bg-gray/30 hover:bg-gray/25 p-1 rounded-full cursor-pointer">
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="pt-1 px-5 pb-5 flex flex-col gap-4">
          
          {/* Info Nomor Meja (Ungu Muda) */}
          <div className="bg-primary/15 rounded-sm p-3 flex items-center gap-4 border border-primary/10">
               <TableIcon className="text-primary w-13 h-13" />
             <div className="flex flex-col">
               <span className="text-black/50 text-[11px] font-normal uppercase tracking-wider">Nomor Meja</span>
               <span className="font-bold text-base">Meja {tableNumber}</span>
             </div>
          </div>

          {/* Info Kapasitas (Outline Ungu) */}
          <div className="bg-white rounded-sm p-3 flex items-center gap-4 border border-primary">
               <UserIcon className="text-primary w-9 h-9" strokeWidth={2.5} />
             <div className="flex flex-col">
               <span className="text-gray-500 text-[11px] font-normal uppercase tracking-wider">Kapasitas Meja</span>
               <span className="font-bold text-base">{capacity} Orang</span>
             </div>
          </div>

          <Button 
            onClick={onConfirm}
            className="w-full mt-2 py-2.5 rounded-sm text-sm font-bold flex items-center justify-center gap-1 shadow-sm"
          >
            Pilih Menu <ChevronRight size={16} strokeWidth={4} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTableModal;