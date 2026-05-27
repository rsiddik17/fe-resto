import { useState, useEffect } from "react";
import Button from "../ui/Button";
import { X } from "lucide-react";

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStock: number) => void;
  menu: { name: string; stock: number } | null;
  isLoading?: boolean; // Tambahan prop untuk loading state
}

const EditStockModal = ({ isOpen, onClose, onSave, menu, isLoading = false }: EditStockModalProps) => {
  const [stockValue, setStockValue] = useState("");

  useEffect(() => {
    if (menu) setStockValue(String(menu.stock));
  }, [menu, isOpen]);

  if (!isOpen || !menu) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200" onClick={!isLoading ? onClose : undefined}>
      <div className="bg-white w-full max-w-sm rounded-sm shadow-sm overflow-hidden animate-in zoom-in-95 duration-200 relative pb-2" onClick={(e) => e.stopPropagation()}>
        
        {!isLoading && (
          <button onClick={onClose} className="absolute top-4 right-4 text-black/50 hover:text-black bg-[#DEDED9] rounded-full w-4.5 h-4.5 flex items-center justify-center text-xs font-bold transition-colors">
            <X className="w-3.5 h-3.5" strokeWidth={3}/>
          </button>
        )}

        <div className="pt-4 px-5 pb-4">
          <h2 className="text-[18px] font-extrabold text-primary mb-4">Edit Stok Menu</h2>
          
          <div className="mb-4">
            <h3 className="font-bold text-base mb-1 text-black">Nama Menu</h3>
            <p className="text-[15px] text-gray-800">{menu.name}</p>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-base mb-1.5 text-black">Jumlah Stok</h3>
            <input
              type="number"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#FFFFFF] border-[1.5px] border-primary text-primary text-[20px] font-bold text-center py-2.5 rounded-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-70"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={onClose} 
              disabled={isLoading}
              className="flex-1 py-2.5 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 text-[13px] md:text-[13px] lg:text-[13px] font-bold rounded-xs disabled:opacity-70"
            >
              Batal
            </Button>
            <Button 
              onClick={() => onSave(Number(stockValue))} 
              disabled={isLoading}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] md:text-[13px] lg:text-[13px] font-bold rounded-xs disabled:opacity-70"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStockModal;