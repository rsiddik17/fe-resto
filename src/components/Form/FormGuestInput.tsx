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
      navigate(`/kiosk/info-table`, { state: { guests: guestCount } });
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
      className="w-full flex flex-col items-center">
        
      {/* --- BAGIAN ATAS: CARD INPUT --- */}
      <div className="w-full flex flex-col justify-center items-center px-5 pb-6 md:px-4 md:pb-8">
        <div className="w-full max-w-xl min-h-150 md:min-h-175 bg-white py-4 px-6 md:py-8 md:px-12 lg:py-6 lg:px-8 rounded-xs shadow-sm">
          <h1 className="text-lg md:text-[30px] lg:text-xl font-bold text-center mb-4 md:mb-8 lg:mb-6 text-black leading-tight">
            Berapa jumlah
            <br />
            tamu?
          </h1>

          <div className="relative cursor-pointer">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
              <UserIcon
                className={cn(
                  "transition-colors w-6 md:w-10 lg:w-7",
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
                "w-full pl-12 md:pl-18 lg:pl-16 pr-4 py-2 md:py-5 lg:py-2.5 border-2 rounded-xs text-lg md:text-3xl lg:text-xl text-black bg-white focus:outline-none transition-all cursor-pointer placeholder:text-sm md:placeholder:text-xl lg:placeholder:text-[17px]  md:placeholder:-translate-y-1 lg:placeholder:-translate-y-px",
                guestCount
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-primary/75",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormGuestInput;
