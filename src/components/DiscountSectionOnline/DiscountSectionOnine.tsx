import { useState } from "react";
import { Percent } from "lucide-react";

interface DiscountSectionProps {
  onApplyDiscount: (amount: number) => void;
}

const DiscountSection = ({ onApplyDiscount }: DiscountSectionProps) => {
  const [couponInput, setCouponInput] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleSearch = () => {
    if (couponInput.toUpperCase() === "DSKIT5") {
      setShowCoupon(true);
    }
  };

  const handleApply = () => {
    setIsApplied(true);
    onApplyDiscount(5000);
  };

  return (
    <div className="space-y-4 pt-2">
      <h2 className="font-bold text-xl text-black">Diskon</h2>
      
      {/* Box Utama dengan Border Ungu Tipis */}
      <div className="bg-white rounded-2xl border border-primary/30 p-8 flex flex-col gap-6">
        
        {/* Baris Input dan Tombol Cari */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Masukkan kode diskon"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 bg-white border border-primary/40 rounded-xs px-5 py-3 outline-none focus:ring-1 focus:ring-primary/20 text-sm text-black"
          />
          <button 
            onClick={handleSearch}
            className="bg-white border border-primary text-primary px-10 py-3 rounded-xs font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
          >
            Cari
          </button>
        </div>

        {/* Bagian Kartu Diskon */}
        <div className="min-h-20">
          {showCoupon ? (
            <div className="bg-white border border-gray-100 rounded-xs p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden ring-1 ring-gray-50">
              
              <div className="flex items-center gap-3">
                {/* Ikon Persen Lingkaran Ungu */}
                <div className="bg-primary p-1.5 rounded-full text-white flex items-center justify-center">
                  <Percent size={14} strokeWidth={3} />
                </div>
                <p className="font-bold text-black text-[15px]">Diskon 5rb min belanja 10.000</p>
              </div>

              <div className="flex justify-between items-center pl-10">
                <p className="text-xs text-gray-400">
                  Kode Diskon: <span className="font-bold text-primary">DSKIT5</span>
                </p>
                
                <button
                  onClick={handleApply}
                  disabled={isApplied}
                  className={`px-10 py-2 rounded-xs  text-sm transition-all border ${
                    isApplied 
                      ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed" 
                      : "bg-white border-primary text-primary hover:bg-primary/5"
                  }`}
                >
                  {isApplied ? "Dipakai" : "Pakai"}
                </button>
              </div>
            </div>
          ) : (
            /* Ruang kosong agar layout tidak melompat saat kartu muncul */
            <div className="h-24"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;