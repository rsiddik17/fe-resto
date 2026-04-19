import { ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import TableIcon from "../Icon/TableIcon";

interface TableInfoCardProps {
  tableNumber: string;
  onLanjut: () => void;
  onBatal: () => void;
  isKioskMode?: boolean;
}

const TableInfoCard = ({
  tableNumber,
  onLanjut,
  onBatal,
  isKioskMode = false,
}: TableInfoCardProps) => {
  // Ambil hanya angkanya untuk teks "Anda berada di Meja XX"
  const rawNumber = tableNumber.replace(/\D/g, "");

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col mx-auto">
      {/* --- BAGIAN ATAS: UNGU MUDA --- */}
      <div className="bg-primary/15 w-full pt-8 pb-5 md:pt-12 md:pb-6 flex flex-col items-center justify-center">
        {/* Lingkaran Ikon */}
        <div className="w-28 h-28 md:w-40 md:h-40 bg-primary/30 rounded-full flex items-center justify-center mb-4 md:mb-6">
          {/* Custom SVG Icon Meja */}
          <TableIcon className="text-primary w-20 h-20 md:w-22 md:h-22" />
        </div>
        {isKioskMode && (
          <p className="text-primary font-bold text-base md:text-lg">
            Penentuan Meja Otomatis
          </p>
        )}
      </div>

      {/* --- BAGIAN BAWAH: PUTIH --- */}
      <div className="w-full px-2 pt-4 pb-6 md:px-8 md:pb-8 flex flex-col items-center">
        {/* Badge Informasi */}
        <div className="bg-primary/20 text-primary px-5 md:px-7 py-1.5 rounded-full flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-sm font-bold">Informasi Meja</span>
        </div>

        {/* Nomor Meja */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 md:mb-4">
          {tableNumber}
        </h2>

        {/* Teks Sub-judul */}
        <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-3">
          Anda berada di Meja {rawNumber}
        </h3>

        {/* Teks Instruksi */}
        <p className="text-center text-gray/75 text-sm md:text-lg mb-6 md:mb-7 px-2 md:px-4 leading-relaxed">
          Lanjutkan untuk melihat menu dan mulai <br /> memesan
        </p>

        {/* Tombol Lihat Menu */}
        <Button
          onClick={onLanjut}
          className="w-full max-w-68 md:max-w-115 py-1.5 md:py-4 text-base md:text-lg flex items-center justify-center cursor-pointer"
        >
          Lihat Menu <ChevronRight size={32} />
        </Button>

        {/* Tombol Batal */}
        <Button
          onClick={onBatal}
          className="mt-3 md:mt-2 bg-transparent shadow-none hover:bg-transparent font-normal text-gray/75 underline hover:text-gray/90 transition-colors p-0 h-auto text-base md:text-xl"
        >
          Batal
        </Button>
      </div>
    </div>
  );
};

export default TableInfoCard;
