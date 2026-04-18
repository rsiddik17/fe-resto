import { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";

// Mock data promo sesuai desainmu
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
  subTotal: number; // Untuk mengecek apakah memenuhi minimum belanja
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const DiscountModal = ({ onClose, onApply, subTotal }: DiscountModalProps) => {
  // Menyimpan ID promo yang sedang dipilih user di dalam modal ini
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);

 const handleApplyFinal = () => {
    // Jika ada promo yang dipilih, terapkan diskonnya
    if (selectedPromoId) {
      const promo = MOCK_PROMOS.find((p) => p.id === selectedPromoId);
      if (promo) {
        onApply(promo.amount);
      }
    }
    // Jika tidak ada promo yang dipilih, jalankan onClose saja (tidak disable tombol)
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/1 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-137.5 rounded-sm p-6 shadow-sm flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tambah Diskon</h2>
          <button onClick={onClose} className="p-2 bg-gray/25 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray" strokeWidth={4} />
          </button>
        </div>

        {/* LIST PROMO (Bisa di-scroll kalau banyak) */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4">
          {MOCK_PROMOS.map((promo) => {
            const isSelected = selectedPromoId === promo.id;
            const isEligible = subTotal >= promo.minSpend; // Cek syarat minimum belanja

            return (
              <div 
                key={promo.id}
                className={cn(
                  "border-2 border-primary rounded-md p-3 flex justify-between items-center gap-2 transition-colors",
                )}
              >
                {/* Info Kiri */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-bold text-xl text-black">
                    {promo.title} <span className="font-normal">Diskon {rupiahFormatter.format(promo.amount).replace("Rp", "")}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#EAE0F0] text-primary text-sm font-bold px-5 py-1 rounded-full">
                      {promo.code}
                    </span>
                    <span className="text-gray text-xl">
                      Min {rupiahFormatter.format(promo.minSpend)}
                    </span>
                  </div>
                </div>

                {/* Tombol Kanan */}
                <Button
                  onClick={() => setSelectedPromoId(promo.id)}
                  disabled={!isEligible}
                  variant={isSelected ? "primary" : "outline"}
                  className={cn(
                    "px-6 py-2 rounded-md text-sm transition-colors",
                    !isEligible && "border-gray-300 text-gray-400 cursor-not-allowed", // Tidak memenuhi syarat (abu-abu)
                    isEligible && !isSelected && "border-primary text-primary hover:bg-primary/10", // Memenuhi syarat tapi belum dipilih (outline ungu)
                    isSelected && ""
                  )}
                >
                  Pakai
                </Button>
              </div>
            );
          })}
        </div>

        {/* TOMBOL KONFIRMASI BAWAH */}
        <div className="pt-1 border-t border-gray-100 mt-2">
          <Button 
            onClick={handleApplyFinal}
            className="w-full py-3 rounded-md font-bold text-xl disabled:opacity-50"
          >
            Gunakan Diskon
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DiscountModal;