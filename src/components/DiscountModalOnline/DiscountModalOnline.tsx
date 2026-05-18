import { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";

// Mock data promo sesuai desainmu
const MOCK_PROMOS = [
  {
    id: "1",
    title: "Diskon Pelajar",
    code: "PJR35",
    amount: 7000,
    minSpend: 35000,
  },
  {
    id: "2",
    title: "Diskon Akhir Pekan",
    code: "PKN160",
    amount: 15000,
    minSpend: 160000,
  },
  {
    id: "3",
    title: "Diskon Makan Siang",
    code: "MKS60",
    amount: 15000,
    minSpend: 65000,
  },
  {
    id: "4",
    title: "Diskon Keluarga",
    code: "KLG350",
    amount: 50000,
    minSpend: 350000,
  },
  {
    id: "5",
    title: "Diskon Hari Senin",
    code: "SEN150",
    amount: 40000,
    minSpend: 150000,
  },
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
     className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-[3px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[95%] md:max-w-137.5 lg:max-w-110 rounded-sm p-4 md:p-6 lg:p-5 shadow-sm flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER MODAL */}
        <div className="flex justify-between items-center mb-4 md:mb-6 lg:mb-4">
          <h2 className="text-lg md:text-2xl font-bold lg:text-[17px]">Tambah Diskon</h2>
          <button
            onClick={onClose}
            className="p-1 md:p-2 lg:p-1 bg-gray/25 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray lg:w-3.5 lg:h-3.5" strokeWidth={4} />
          </button>
        </div>

        {/* LIST PROMO (Bisa di-scroll kalau banyak) */}
        <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-2 overflow-y-auto pr-1 md:pr-2 pb-2 md:pb-4 lg:pb-2">
          {MOCK_PROMOS.map((promo) => {
            const isSelected = selectedPromoId === promo.id;
            const isEligible = subTotal >= promo.minSpend; // Cek syarat minimum belanja

            return (
              <div
                key={promo.id}
                className={cn(
                  "border-2 border-primary rounded-md p-3 lg:p-2 flex justify-between items-center gap-2 transition-colors",
                )}
              >
                {/* Info Kiri */}
                <div className="flex flex-col gap-1 md:gap-2">
                  <h4 className="font-bold text-sm md:text-xl lg:text-sm">
                    {promo.title}{" "}
                    <span className="font-normal">
                      Diskon{" "}
                      {rupiahFormatter.format(promo.amount).replace("Rp", "")}
                    </span>
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#EAE0F0] text-primary text-sm lg:text-[10.5px] font-bold px-3 md:px-5 lg:px-3 py-0.5 md:py-1 lg:py-0.5 rounded-full">
                      {promo.code}
                    </span>
                    <span className="text-gray text-sm md:text-xl lg:text-[13px]">
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
                    "px-4 md:px-6 lg:px-4 py-1.5 md:py-2 lg:py-1 rounded-md lg:rounded-sm border-[1.5px] text-sm md:text-base lg:text-[13px] font-medium transition-colors",
                    !isEligible &&
                      "border-gray-300 text-gray-400 cursor-not-allowed", // Tidak memenuhi syarat (abu-abu)
                    isEligible &&
                      !isSelected &&
                      "border-primary text-primary hover:bg-primary/10", // Memenuhi syarat tapi belum dipilih (outline ungu)
                    isSelected && "",
                  )}
                >
                  Pakai
                </Button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 mt-2 lg:mt-3">
          <Button
            onClick={handleApplyFinal}
            className="w-full py-2.5 md:py-3 lg:py-2 rounded-md lg:rounded-sm font-bold text-sm md:text-xl lg:text-sm disabled:opacity-50"
          >
            Gunakan Diskon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModalOnline;
