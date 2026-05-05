import { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button"; 
import { cn } from "../../utils/utils";

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

const DiscountModalOnline = ({ onClose, onApply, subTotal }: DiscountModalProps) => {
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
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-[1px] p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm rounded-xs p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[24px] font-bold text-black">Tambah Diskon</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-90"
          >
            <X size={22} className="text-gray-600" strokeWidth={3} />
          </button>
        </div>

        {/* LIST PROMO */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 mb-6 custom-scrollbar">
          {MOCK_PROMOS.map((promo) => {
            const isSelected = selectedPromoId === promo.id;
            const isEligible = subTotal >= promo.minSpend;

            return (
              <div 
                key={promo.id}
                className={cn(
                  "border-2 rounded-xs p-5 flex justify-between items-center transition-all duration-200",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-gray-100 bg-white hover:border-gray-50",
                  !isEligible && "opacity-60 grayscale-[0.5] cursor-not-allowed"
                )}
              >
                <div className="flex flex-col gap-1.5 text-left">
                  <h4 className="font-bold text-[16px] text-black">
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

                {/* TOMBOL PAKAI (Pengganti Bulatan) */}
                <button
                  disabled={!isEligible}
                  onClick={() => setSelectedPromoId(promo.id)}
                  className={cn(
                    "px-4 py-1.5 border rounded-md text-[13px] font-bold transition-all active:scale-95",
                    !isEligible && "border-gray-200 text-gray-300 cursor-not-allowed",
                    isEligible && !isSelected && "border-primary text-primary hover:bg-primary/5",
                    isSelected && "bg-primary text-white border-primary"
                  )}
                >
                  {isSelected ? "Terpakai" : "Pakai"}
                </button>
              </div>
            );
          })}
        </div>

        {/* TOMBOL KONFIRMASI UTAMA */}
        <div className="pt-2">
          <Button 
            onClick={handleApplyFinal}
            disabled={!selectedPromoId}
            className="w-full py-2.5 rounded-2xl font-bold text-[18px] bg-primary text-white shadow-xl shadow-primary/30 transition-all active:scale-[0.97] disabled:bg-gray-300 disabled:shadow-none"
          >
            Gunakan Diskon
          </Button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default DiscountModalOnline;