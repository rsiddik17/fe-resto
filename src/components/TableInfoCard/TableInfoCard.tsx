import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import TableIcon from "../Icon/TableIcon";

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
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      
      {/* --- BAGIAN ATAS: UNGU MUDA --- */}
      <div className="bg-primary/15 w-full pt-12 pb-6 flex flex-col items-center justify-center">
        {/* Lingkaran Ikon */}
        <div className="w-40 h-40 bg-primary/30 rounded-full flex items-center justify-center mb-6">
          {/* Custom SVG Icon Meja */}
          <TableIcon className="text-primary" />
        </div>
        <p className="text-primary font-bold text-lg">Penentuan Meja Otomatis</p>
      </div>

      {/* --- BAGIAN BAWAH: PUTIH --- */}
      <div className="w-full px-8 pt-4 pb-8 flex flex-col items-center">
        
        {/* Badge Informasi */}
        <div className="bg-primary/20 text-primary px-7 py-1.5 rounded-full flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-sm font-bold">Informasi Meja</span>
        </div>

        {/* Nomor Meja */}
        <h2 className="text-4xl font-bold text-primary mb-4">
          {tableNumber}
        </h2>
        
        {/* Teks Sub-judul */}
        <h3 className="text-2xl font-bold text-black mb-3">
          Anda berada di Meja {rawNumber}
        </h3>

        {/* Teks Instruksi */}
        <p className="text-center text-gray/75 text-lg mb-7 px-4 leading-relaxed">
          Lanjutkan untuk melihat menu dan mulai <br /> memesan
        </p>

        {/* Tombol Lihat Menu */}
        <Button 
          onClick={handleLanjut} 
          className="w-full max-w-115 py-4 text-lg flex items-center justify-center cursor-pointer"
        >
          Lihat Menu <ChevronRight size={32} />
        </Button>

        {/* Tombol Batal */}
        <Button 
          onClick={handleBatal}
          className="mt-2 bg-transparent shadow-none hover:bg-transparent font-medium text-gray/75 underline hover:text-gray/90 transition-colors p-0 h-auto"
        >
          Batal
        </Button>

      </div>
    </div>
  );
};

export default TableInfoCard;