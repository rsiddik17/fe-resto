import { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button"; 
import { cn } from "../../utils/utils";

// Mock data sesuai desain IT'S RESTO
const MOCK_PROMOS = [
  { id: "1", title: "Diskon Pelajar", code: "PJR35", amount: 7000, minSpend: 35000 },
  { id: "2", title: "Diskon Akhir Pekan", code: "PKN160", amount: 15000, minSpend: 160000 },
  { id: "3", title: "Diskon Makan Siang", code: "MKS60", amount: 15000, minSpend: 65000 },
  { id: "4", title: "Diskon Keluarga", code: "KLG350", amount: 50000, minSpend: 350000 },
  { id: "5", title: "Diskon Hari Senin", code: "SEN150", amount: 40000, minSpend: 150000 },
];

interface DiscountModalProps {
  onClose: () => void;
  onApply: (amount: number) => void;
  subTotal: number;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const DiscountModal = ({ onClose, onApply, subTotal }: DiscountModalProps) => {
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);

  const handleApplyFinal = () => {
    if (selectedPromoId) {
      const promo = MOCK_PROMOS.find((p) => p.id === selectedPromoId);
      if (promo) {
        onApply(promo.amount);
      }
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-xs p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-120 rounded-xs p-8 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[28px] font-bold text-black ">
            Tambah Diskon
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-90"
          >
            <X size={22} className="text-gray-600" strokeWidth={3} />
          </button>
        </div>

        {/* LIST PROMO (Scrollable Area) */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 mb-6 custom-scrollbar">
          {MOCK_PROMOS.map((promo) => {
            const isSelected = selectedPromoId === promo.id;
            const isEligible = subTotal >= promo.minSpend;

            return (
              <div 
                key={promo.id}
                onClick={() => isEligible && setSelectedPromoId(promo.id)}
                className={cn(
                  "border-2 rounded-xs p-5 flex justify-between items-center cursor-pointer transition-all duration-200",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-gray-100 bg-white hover:border-gray-200",
                  !isEligible && "opacity-60 grayscale-[0.5] cursor-not-allowed"
                )}
              >
                {/* Info Diskon */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-[18px] text-black">
                    {promo.title} <span className="text-primary ml-1">-{rupiahFormatter.format(promo.amount).replace("Rp", "Rp ")}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F3E8F3] text-primary text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
                      {promo.code}
                    </span>
                    <span className="text-gray-400 text-[13px] font-medium">
                      Min. {rupiahFormatter.format(promo.minSpend)}
                    </span>
                  </div>
                </div>

                {/* Indikator Pilihan (Bulatan) */}
                <div className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "border-primary bg-primary shadow-md" : "border-gray-200"
                )}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* TOMBOL KONFIRMASI */}
        <div className="pt-2">
          <Button 
            onClick={handleApplyFinal}
            disabled={!selectedPromoId}
            className="w-full py-4 rounded-xs font-bold text-[18px] bg-primary text-white shadow-xl shadow-primary/30 transition-all active:scale-[0.97] disabled:bg-gray-300 disabled:shadow-none"
          >
            Gunakan Diskon
          </Button>
        </div>
      </div>

      {/* CSS internal untuk scrollbar halus */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default DiscountModal;