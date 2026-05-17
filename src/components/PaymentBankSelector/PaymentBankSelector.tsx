import { Landmark } from "lucide-react";
import { cn } from "../../utils/utils";

const BANKS = ["BCA", "Mandiri", "BRI", "BNI", "Lainnya"];

interface PaymentBankSelectorProps {
  selectedBank: string;
  onSelectBank: (bank: string) => void;
  otherBankName: string;
  onOtherBankNameChange: (name: string) => void;
}

const PaymentBankSelector = ({
  selectedBank,
  onSelectBank,
  otherBankName,
  onOtherBankNameChange,
}: PaymentBankSelectorProps) => {
  return (
    <div className="flex flex-col w-full">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-primary/15 w-9 h-9 rounded-full flex items-center justify-center text-primary">
          <Landmark size={18} strokeWidth={2.5} />
        </div>
        <h3 className="font-bold text-[17px]">Pilih Asal Bank</h3>
      </div>

      {/* Grid Buttons */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3.5 mb-4">
        {BANKS.map((bank) => {
          const isSelected = selectedBank === bank;
          const isLainnya = bank === "Lainnya";

          return (
            <button
              key={bank}
              onClick={() => onSelectBank(bank)}
              className={cn(
                "py-2 rounded-sm text-[14.5px] transition-all border-[1.5px] cursor-pointer",
                isSelected
                  ? "bg-primary/10 text-primary border-primary shadow-sm"
                  : // PERBAIKAN: Default tombolnya sekarang bergaris tepi ungu sesuai gambar
                    "bg-white text-primary border-primary hover:bg-primary/5",
                isLainnya && "col-span-2", // Tombol "Lainnya" memanjang
              )}
            >
              {bank}
            </button>
          );
        })}
      </div>

      {/* Input Form Jika Pilih "Lainnya" */}
      {selectedBank === "Lainnya" && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300 mt-1">
          <span className="text-sm text-primary">Bank Lainnya</span>
          <input
            type="text"
            value={otherBankName}
            onChange={(e) => onOtherBankNameChange(e.target.value)}
            placeholder="Masukkan Nama Bank"
            className="w-full bg-[#D9D9D9]/50 text-black placeholder:text-black/50 px-4 py-2.25 rounded-sm outline-none focus:ring-2 focus:ring-primary/75 text-[14px]"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentBankSelector;
