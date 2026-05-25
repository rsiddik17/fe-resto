import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";
import { discountAPI, type DiscountData } from "../../api/discount.api";

interface DiscountModalProps {
  onClose: () => void;
  onApply: (amount: number, discountId: number) => void;
  subTotal: number;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const DiscountModal = ({ onClose, onApply, subTotal }: DiscountModalProps) => {
  const [selectedPromoId, setSelectedPromoId] = useState<number | null>(null);
  const [discounts, setDiscounts] = useState<DiscountData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
        const response = await discountAPI.getAllDiscounts();
        // Filter hanya yang aktif
        const activeDiscounts = response.data.filter(
          (d: DiscountData) => d.is_active,
        );
        setDiscounts(activeDiscounts);
      } catch (error) {
        console.error("Gagal mengambil data diskon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const handleApplyFinal = () => {
    if (selectedPromoId) {
      const promo = discounts.find((p) => p.id === selectedPromoId);
      if (promo) {
        onApply(Number(promo.value), promo.id);
      }
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[95%] md:max-w-137.5 lg:max-w-110 rounded-sm p-4 md:p-6 lg:p-5 shadow-sm flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center mb-4 md:mb-6 lg:mb-4">
          <h2 className="text-[16.5px] md:text-2xl font-bold lg:text-[17px]">
            Tambah Diskon
          </h2>
          <button
            onClick={onClose}
            className="p-1 md:p-2 lg:p-1 bg-gray/25 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X
              size={20}
              className="text-gray w-4 h-4 md:w-5 md:h-5 lg:w-3.5 lg:h-3.5"
              strokeWidth={4}
            />
          </button>
        </div>

        {/* LIST PROMO (Bisa di-scroll kalau banyak) */}
        <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-2.5 overflow-y-auto pr-1 md:pr-2 pb-2 md:pb-4 lg:pb-2">
          {isLoading ? (
            <div className="py-10 flex justify-center items-center">
              <span className="animate-pulse text-primary font-bold">
                Mencari promo...
              </span>
            </div>
          ) : discounts.length > 0 ? (
            discounts.map((promo) => {
              const isSelected = selectedPromoId === promo.id;

              // Parsing string "20000" jadi angka
              const minSpend = Number(promo.min_purches);
              const discountValue = Number(promo.value);
              const isEligible = subTotal >= minSpend;

              return (
                <div
                  key={promo.id}
                  className={cn(
                    "border-2 border-primary rounded-md p-2 md:p-3 lg:p-2 flex justify-between items-center gap-2 transition-colors",
                  )}
                >
                  {/* Info Kiri */}
                  <div className="flex flex-col gap-1.5 md:gap-2">
                    <h4 className="font-bold flex flex-col md:flex-row gap-0.5 md:gap-1 text-sm md:text-xl lg:text-sm">
                      {promo.discount_name}
                      <span className="font-normal">
                        Diskon{rupiahFormatter.format(discountValue).replace("Rp", "")}
                      </span>
                    </h4>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#EAE0F0] text-primary text-[13px] md:text-sm lg:text-[10.5px] font-bold px-2.5 md:px-5 lg:px-3 py-0.5 md:py-1 lg:py-0.5 rounded-full">
                        {promo.discount_code}
                      </span>
                      <span className="text-gray text-[12.5px] md:text-xl lg:text-[13px]">
                        Min {rupiahFormatter.format(minSpend)}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Kanan */}
                  <Button
                    onClick={() => setSelectedPromoId(promo.id)}
                    disabled={!isEligible}
                    variant={isSelected ? "primary" : "outline"}
                    className={cn(
                      "px-4 md:px-6 lg:px-4 py-1.5 md:py-2 lg:py-1 rounded-xs md:rounded-md lg:rounded-sm border-[1.5px] text-sm md:text-base lg:text-[13px] font-medium transition-colors",
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
            })
          ) : (
            <div className="py-10 text-center text-gray-500">
              Tidak ada promo yang tersedia saat ini.
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 mt-2 lg:mt-3">
          <Button
            onClick={handleApplyFinal}
            className="w-full py-2.5 md:py-3 lg:py-2 rounded-sm md:rounded-md lg:rounded-sm font-bold text-sm md:text-xl lg:text-sm disabled:opacity-50"
          >
            Gunakan Diskon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
