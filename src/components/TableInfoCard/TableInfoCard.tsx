import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import Button from "../ui/Button";

interface TableInfoCardProps {
  tableNumber: string;
}

const TableInfoCard = ({ tableNumber }: TableInfoCardProps) => {
  const navigate = useNavigate();

  // Ambil hanya angkanya untuk teks "Anda berada di Meja XX"
  const rawNumber = tableNumber.replace(/\D/g, "");

  const handleLanjut = () => {
    // Arahkan ke halaman menu (bisa bawa parameter meja atau tamu jika perlu)
    navigate(`/kiosk/menu`);
  };

  const handleBatal = () => {
    // Kembali ke halaman awal kiosk
    navigate(`/kiosk/home`);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      
      {/* --- BAGIAN ATAS: UNGU MUDA --- */}
      <div className="bg-primary/15 w-full pt-10 pb-6 flex flex-col items-center justify-center">
        {/* Lingkaran Ikon */}
        <div className="w-36 h-36 bg-primary/30 rounded-full flex items-center justify-center mb-8">
          {/* Custom SVG Icon Meja */}
          <svg 
            width="70" height="70" viewBox="0 0 24 24" 
            fill="none" stroke="#5A189A" strokeWidth="2.5" 
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M3 10h18" />
            <path d="M12 10v7" />
            <path d="M9 21l3-4 3 4" />
            <ellipse cx="12" cy="10" rx="9" ry="3" fill="#5A189A" />
          </svg>
        </div>
        <p className="text-primary font-bold text-lg">Penentuan Meja Otomatis</p>
      </div>

      {/* --- BAGIAN BAWAH: PUTIH --- */}
      <div className="w-full px-8 py-8 flex flex-col items-center">
        
        {/* Badge Informasi */}
        <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-sm font-bold">Informasi Meja</span>
        </div>

        {/* Nomor Meja */}
        <h2 className="text-4xl font-extrabold text-primary mb-3">
          {tableNumber}
        </h2>
        
        {/* Teks Sub-judul */}
        <h3 className="text-xl font-bold text-black mb-3">
          Anda berada di Meja {rawNumber}
        </h3>

        {/* Teks Instruksi */}
        <p className="text-center text-gray/75 text-base mb-6 px-4 leading-relaxed">
          Lanjutkan untuk melihat menu dan mulai <br /> memesan
        </p>

        {/* Tombol Lihat Menu */}
        <Button 
          onClick={handleLanjut} 
          className="w-full py-4 text-lg flex items-center justify-center cursor-pointer"
        >
          Lihat Menu <ChevronRight size={32} />
        </Button>

        {/* Tombol Batal */}
        <Button 
          onClick={handleBatal}
          className="mt-5 bg-transparent shadow-none hover:bg-transparent font-medium text-gray/75 underline hover:text-gray/90 transition-colors p-0 h-auto"
        >
          Batal
        </Button>

      </div>
    </div>
  );
};

export default TableInfoCard;