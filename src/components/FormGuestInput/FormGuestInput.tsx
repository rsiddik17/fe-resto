import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Users, Delete, SendHorizontal } from "lucide-react";
import { cn } from "../../utils/utils";
import Button from "../ui/Button";
import Input from "../ui/Input";

const FormGuestInput = () => {
  const navigate = useNavigate();
  const [guestCount, setGuestCount] = useState<string>("");

  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);

  const handlePress = (num: string) => {
    if (guestCount === "" && num === "0") return; // Mencegah 0 di depan
    
    if (guestCount.length < 2) {
      // Jika belum 2 digit, tambahkan angkanya ke belakang
      setGuestCount((prev) => prev + num);
    } else {
      // Jika sudah 2 digit (misal "17"), potong angka depannya ("1") lalu tambah angka baru ("3") -> jadi "13"
      setGuestCount((prev) => prev.slice(0, 1) + num);
    }
  };

  // Fungsi saat tombol backspace dipencet
  const handleBackspace = () => {
    setGuestCount((prev) => prev.slice(0, -1));
  };

  // Fungsi saat tombol enter (biru) dipencet
  const handleSubmit = () => {
    if (guestCount && parseInt(guestCount) > 0) {
      navigate(`/kiosk/info-meja?guests=${guestCount}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tangkap input angka 0-9
      if (e.key >= "0" && e.key <= "9") {
        setShowKeyboard(true); // Otomatis munculkan keyboard virtual juga
        handlePress(e.key);
      } 
      // Tangkap input Backspace
      else if (e.key === "Backspace") {
        setShowKeyboard(true);
        handleBackspace();
      } 
      // Tangkap input Enter
      else if (e.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Cleanup event listener agar tidak bentrok
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guestCount, navigate]);

  // Data untuk mapping tombol (Angka + Huruf kecil di bawahnya)
  const numpadKeys = [
    { num: "1", text: "" },
    { num: "2", text: "ABC" },
    { num: "3", text: "DEF" },
    { num: "4", text: "GHI" },
    { num: "5", text: "JKL" },
    { num: "6", text: "MNO" },
    { num: "7", text: "PQRS" },
    { num: "8", text: "TUV" },
    { num: "9", text: "WXYZ" },
  ];

  return (
    <div className="w-full flex flex-col items-center h-full relative overflow-hidden" onClick={() => setShowKeyboard(false)}>
      
      {/* --- BAGIAN ATAS: CARD INPUT --- */}
      <div className="flex-1 mt-50 w-full flex flex-col justify-center items-center px-4 z-10 relative">
        <div className="w-full max-w-lg min-h-190 bg-white py-8 px-12 rounded shadow-sm">
          <h1 className="text-3xl font-bold text-center mb-8 text-black leading-tight">
            Berapa jumlah<br />tamu?
          </h1>

          <div className="relative cursor-pointer" onClick={(e) => {
              e.stopPropagation(); 
              setShowKeyboard(true);
            }}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
              <Users className={cn("transition-colors", guestCount || showKeyboard ? "text-primary" : "text-gray-500")} size={40} />
            </div>
            {/* Input ini dibuat readOnly karena dikontrol dari tombol bawah */}
            <Input
              type="text"
              readOnly
              value={guestCount}
              placeholder="Masukkan jumlah tamu"
              className={cn(
                "w-full pl-18 pr-4 py-6 border-2 rounded text-4xl font-medium text-black bg-white focus:outline-none transition-colors cursor-pointer placeholder:text-2xl",
                guestCount || showKeyboard ? "border-primary ring-2 ring-primary/20" : "border-gray/30"
              )}
            />
          </div>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: CUSTOM NUMPAD --- */}

      <div className={cn(
          "absolute bottom-0 left-0 w-full bg-[#f3f4f6]/95 backdrop-blur-sm p-4 pb-8 z-50",
          "transition-transform duration-500 ease-in-out border-t border-gray/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]",
          showKeyboard ? "translate-y-0" : "translate-y-full"
        )} onClick={(e) => e.stopPropagation()}>
        <div className="w-full grid grid-cols-3 gap-2">
          
          {/* Mapping Angka 1-9 */}
          {numpadKeys.map((item) => (
            <Button
              key={item.num}
              onClick={() => handlePress(item.num)}
              className="bg-white py-3 rounded-md shadow-sm border border-gray/10 active:bg-gray/10 transition-colors flex flex-col items-center justify-center h-20"
            >
              <span className="text-5xl font-normal text-black">{item.num}</span>
              {item.text && <span className="text-black/60 font-normal">{item.text}</span>}
            </Button>
          ))}

          {/* Tombol Backspace */}
          <Button
            onClick={handleBackspace}
            className="bg-[#D1D5DB] py-3 rounded-md shadow-sm active:bg-gray/40 transition-colors flex items-center justify-center h-20"
          >
            <Delete size={48} className="text-black/60" />
          </Button>

          {/* Tombol 0 */}
          <Button
            onClick={() => handlePress("0")}
            className="bg-white py-3 rounded-md shadow-sm border border-gray/10 active:bg-gray/10 transition-colors flex items-center justify-center h-20"
          >
            <span className="text-5xl font-medium text-black">0</span>
          </Button>

          {/* Tombol Enter / Lanjut (Warna Biru/Primary) */}
          <Button
            onClick={handleSubmit}
            disabled={!guestCount}
            className="bg-blue py-3 rounded-md shadow-sm active:opacity-80 transition-opacity flex items-center justify-center h-20 disabled:bg-gray/30 disabled:cursor-not-allowed"
          >
            <SendHorizontal size={48} className="text-white" />
          </Button>

        </div>
      </div>

    </div>
  );
};

export default FormGuestInput;