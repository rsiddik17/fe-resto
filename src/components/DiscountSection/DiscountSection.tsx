import { useState } from "react";
import { Percent } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

// Tipe data untuk promo (Nanti dari API)
interface PromoCode {
  code: string;
  description: string;
  discountAmount: number;
}

interface DiscountSectionProps {
  onApplyDiscount: (amount: number) => void;
}

const DiscountSection = ({ onApplyDiscount }: DiscountSectionProps) => {
  const [inputCode, setInputCode] = useState("");
  const [searchedPromo, setSearchedPromo] = useState<PromoCode | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  // Fungsi saat tombol "Cari" diklik
  const handleSearchPromo = () => {
    if (!inputCode.trim()) return;

    // MOCK UP API CALL: Anggap saja kita mencari kode di database
    // Jika user mengetik sembarang, kita pura-pura temukan promo ini biar bisa di-test
    const mockPromoFound: PromoCode = {
      code: inputCode.toUpperCase(),
      description: "Diskon 10rb min belanja 50.000",
      discountAmount: 10000,
    };
    
    setSearchedPromo(mockPromoFound);
    setIsApplied(false); // Reset status jika user mencari kode baru
    onApplyDiscount(0);  // Cabut diskon sebelumnya (jika ada) dari total harga
  };

  // Fungsi saat tombol "Pakai" diklik
  const handleApplyPromo = () => {
    if (searchedPromo) {
      setIsApplied(true);
      onApplyDiscount(searchedPromo.discountAmount); // Lempar nominal diskon ke halaman utama
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-3xl font-bold mb-2">Diskon</h3>
      
      {/* Container Utama Diskon */}
      <div className="border border-primary rounded-md p-4 md:p-5 h-70 flex flex-col gap-4 bg-white">
        
        {/* Baris Input & Tombol Cari */}
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Masukkan kode diskon"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="max-w-lg flex-1 py-3 text-xl border-2 focus:border-white"
          />
          <Button 
            onClick={handleSearchPromo} 
            variant={inputCode.trim() ? "primary" : "outline"}
            className="px-8 w-full max-w-1/5 py-3 text-xl rounded-sm font-bold"
          >
            Cari
          </Button>
        </div>

        {/* Baris Hasil Pencarian Promo (Muncul kalau ada hasil) */}
        {searchedPromo && (
          <div className="w-full max-w-lg border-2 border-secondary rounded-xs p-5 flex flex-col gap-4 mt-2">
            
            {/* Info Promo Kiri */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-full p-1 shrink-0">
                  <Percent size={12} strokeWidth={4} className="text-white" />
                </div>
                <h4 className="font-bold text-xl">
                  {searchedPromo.description}
                </h4>
              </div>
              <p className="text-xl ml-6">
                Kode Diskon: <span className="font-bold text-primary">{searchedPromo.code}</span>
              </p>
            </div>

            {/* Tombol Pakai Kanan */}
            <Button
              onClick={handleApplyPromo}
              disabled={isApplied}
              variant={isApplied ? "outline" : "primary"}
              className="self-end px-8 py-2.5 rounded-xs font-medium text-xl sm:w-auto max-w-37.5 disabled:border-primary disabled:text-primary"
            >
              {isApplied ? "Dipakai" : "Pakai"}
            </Button>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountSection;