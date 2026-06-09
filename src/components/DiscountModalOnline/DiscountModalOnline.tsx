import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";
import { discountAPI, type DiscountData } from "../../api/discount.api";

interface DiscountModalProps {
  onClose: () => void;
  onApply: (amount: number, discountId: number) => void; // ✅ Perbaiki ini
  subTotal: number;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const DiscountModalOnline = ({
  onClose,
  onApply,
  subTotal,
}: DiscountModalProps) => {
  const [selectedPromoId, setSelectedPromoId] = useState<number | null>(null);
  const [discounts, setDiscounts] = useState<DiscountData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
        const response = await discountAPI.getAllDiscounts();
        console.log("Discount data:", response);
        const discountData = response.data || response;
        const activeDiscounts = discountData.filter(
          (d: DiscountData) => !!d.is_active,
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
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-[3px] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[95%] md:max-w-137.5 rounded-sm p-4 md:p-6 shadow-sm flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold">Tambah Diskon</h2>
          <button
            onClick={onClose}
            className="p-1 md:p-2 bg-gray/25 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray" strokeWidth={4} />
          </button>
        </div>

        {/* LIST PROMO */}
        <div className="flex flex-col gap-2.5 md:gap-3 overflow-y-auto pr-1 md:pr-2 pb-2 md:pb-4 max-h-[60vh]">
          {isLoading ? (
            <div className="py-10 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-primary font-bold">
                Mencari promo...
              </span>
            </div>
          ) : discounts.length > 0 ? (
            discounts.map((promo) => {
              const isSelected = selectedPromoId === promo.id;
              const minSpend = Number(promo.min_purches);
              const discountValue = Number(promo.value);
              const isEligible = subTotal >= minSpend;

              return (
                <div
                  key={promo.id}
                  className={cn(
                    "border-2 border-primary rounded-md p-3 md:p-4 flex justify-between items-center gap-2 transition-colors",
                  )}
                >
                  <div className="flex flex-col gap-1.5 md:gap-2 flex-1">
                    <h4 className="font-bold text-sm md:text-base">
                      {promo.discount_name}
                      <span className="font-normal ml-1">
                        Diskon{" "}
                        {rupiahFormatter
                          .format(discountValue)
                          .replace("Rp", "")}
                      </span>
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#EAE0F0] text-primary text-xs md:text-sm font-bold px-3 py-0.5 md:py-1 rounded-full">
                        {promo.discount_code}
                      </span>
                      <span className="text-gray-400 text-xs md:text-sm">
                        Min {rupiahFormatter.format(minSpend)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedPromoId(promo.id)}
                    disabled={!isEligible}
                    variant={isSelected ? "primary" : "outline"}
                    className={cn(
                      "px-4 md:px-6 py-1.5 md:py-2 rounded-md text-sm md:text-base font-medium transition-colors whitespace-nowrap",
                      !isEligible &&
                        "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100",
                      isEligible &&
                        !isSelected &&
                        "border-primary text-primary hover:bg-primary/10",
                      isSelected && "bg-primary text-white",
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

        {/* Tombol Gunakan Diskon */}
        <div className="border-t border-gray-100 mt-4 pt-4">
          <Button
            onClick={handleApplyFinal}
            className="w-full py-2.5 md:py-3 rounded-md font-bold text-sm md:text-base"
            disabled={!selectedPromoId}
          >
            Gunakan Diskon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModalOnline;
