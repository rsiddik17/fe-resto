import { useState } from "react";
import { Percent } from "lucide-react";

interface PromoCode {
  code: string;
  description: string;
  discountAmount: number;
}

interface DiscountSectionProps {
  onApplyDiscount: (amount: number) => void;
}

const DiscountSectionOnline = ({ onApplyDiscount }: DiscountSectionProps) => {
  const [inputCode, setInputCode] = useState("");
  const [searchedPromo, setSearchedPromo] = useState<PromoCode | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  const handleSearchPromo = () => {
    if (!inputCode.trim()) return;

    // Simulasi data promo
    const mockPromoFound: PromoCode = {
      code: inputCode.toUpperCase(),
      description: "Diskon 5rb min belanja 10.000",
      discountAmount: 5000,
    };
    
    setSearchedPromo(mockPromoFound);
    setIsApplied(false);
    onApplyDiscount(0);
  };

  const handleApplyPromo = () => {
    if (searchedPromo) {
      setIsApplied(true);
      onApplyDiscount(searchedPromo.discountAmount);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-1 space-y-4">
      {/* Font size sedikit mengecil di mobile agar proporsional */}
      <h3 className="text-[20px] md:text-[22px] font-bold text-black ml-1">Diskon</h3>
      
      <div className="border border-primary rounded-[12px] p-4 md:p-6 bg-white min-h-auto md:min-h-55 flex flex-col transition-all">
        
        {/* Row: Input & Cari - Menggunakan flex-col di mobile agar tidak sempit */}
        <div className="flex flex-row gap-2 md:gap-4 mb-6">
          <input
            type="text"
            placeholder="Masukkan kode diskon"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
          />
          
          <button 
            onClick={handleSearchPromo}
            // Tombol full width di mobile agar mudah di-tap jari
            className={`w-full sm:w-auto px-4 sm:px-12 py-3 rounded-2xl text-[16px] transition-all active:scale-95 shadow-sm border ${
              searchedPromo 
                ? "bg-primary text-white border-primary" 
                : "bg-white text-primary border-primary"
            }`}
          >
            Cari
          </button>
        </div>

        {/* Kotak Promo */}
        {searchedPromo && (
          <div className="w-full border border-gray-200 rounded-[20px] p-4 md:p-6 flex flex-col bg-white relative animate-in fade-in slide-in-from-top-2">
            
            {/* Bagian Atas: Ikon dan Teks */}
            <div className="flex items-start gap-3 md:gap-4">
              <div className="bg-primary rounded-full p-2 md:p-2.5 shrink-0 mt-0.5">
                <Percent size={14} md:size={16} strokeWidth={4} className="text-white" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <h4 className="font-bold text-[16px] md:text-[18px] text-black leading-tight">
                  {searchedPromo.description}
                </h4>
                <p className="text-[14px] md:text-[15px] text-black font-medium">
                  Kode Diskon: <span className="text-primary font-bold">{searchedPromo.code}</span>
                </p>
              </div>
            </div>
            
            {/* Bagian Bawah: Tombol Pakai */}
            <div className="w-full flex justify-end mt-4 md:mt-2">
              <button
                onClick={handleApplyPromo}
                disabled={isApplied}
                className={`w-full sm:w-auto sm:min-w-30 py-3 rounded-2xl border-2 text-[15px] md:text-[16px] transition-all active:scale-95 ${
                  isApplied 
                  ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed" 
                  : "border-primary text-primary hover:bg-primary/5"
                }`}
              >
                {isApplied ? "Dipakai" : "Pakai"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountSectionOnline;