import { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "../../utils/utils";
import Input from "../ui/Input";
import UserIcon from "../Icon/UserIcon";

const FormGuestInput = () => {
  const navigate = useNavigate();
  const [guestCount, setGuestCount] = useState<string>("");

  // Fungsi saat tombol enter (biru) dipencet
  const handleSubmit = () => {
    if (guestCount && parseInt(guestCount) > 0) {
      navigate(`/kiosk/info-meja?guests=${guestCount}`);
    }
  };

  // Fungsi untuk menangani ketikan dari keyboard fisik
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Memastikan hanya angka yang bisa diketik (menolak huruf)
    const val = e.target.value.replace(/\D/g, ""); 
    
    // Cegah user mengetik "0" di awal
    if (val === "0" && guestCount === "") return; 
    
    // Batasi maksimal 2 digit (maksimal 99 tamu)
    if (val.length <= 2) {
      setGuestCount(val);
    }
  };

  // Fungsi untuk mendeteksi tombol Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center h-full relative overflow-hidden">
      {/* --- BAGIAN ATAS: CARD INPUT --- */}
      <div className="flex-1 mt-47 w-full flex flex-col justify-center items-center px-4 z-10 relative">
        <div className="w-full max-w-xl min-h-197 bg-white py-8 px-12 rounded shadow-sm">
          <h1 className="text-[34px] font-bold text-center mb-8 text-black leading-tight">
            Berapa jumlah
            <br />
            tamu?
          </h1>

          <div className="relative cursor-pointer">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
              <UserIcon
                className={cn(
                  "transition-colors",
                  guestCount ? "text-primary" : "text-gray",
                )}
              />
            </div>
            {/* Input ini dibuat readOnly karena dikontrol dari tombol bawah */}
            <Input
              type="text"
              value={guestCount}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Masukkan jumlah tamu"
              className={cn(
                "w-full pl-18 pr-4 py-6 border-2 rounded text-4xl font-medium text-black bg-white focus:outline-none transition-all cursor-pointer placeholder:text-xl placeholder:-translate-y-1",
                guestCount
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray/30",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormGuestInput;
