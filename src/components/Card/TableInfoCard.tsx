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
    <div className="w-full max-w-xl lg:max-w-lg bg-white rounded-md shadow-sm overflow-hidden flex flex-col justify-center">
      {/* --- BAGIAN ATAS: UNGU MUDA --- */}
      <div className="bg-primary/15 w-full pt-8 pb-5 md:pt-12 md:pb-6 lg:pt-10 flex flex-col items-center justify-center">
        {/* Lingkaran Ikon */}
        <div className="w-26 h-26 md:w-40 md:h-40 lg:w-32 lg:h-32 bg-primary/30 rounded-full flex items-center justify-center mb-4 md:mb-6">
          {/* Custom SVG Icon Meja */}
          <TableIcon className="text-primary w-18 h-18 md:w-22 md:h-22" />
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
        <h2 className="text-[26px] md:text-[32px] lg:text-[28px] font-bold text-primary mb-2 md:mb-4">
          {tableNumber}
        </h2>

        {/* Teks Sub-judul */}
        <h3 className="text-[19px] md:text-2xl lg:text-[21px]  font-bold text-black mb-3 md:mb-3">
          Anda berada di Meja {rawNumber}
        </h3>

        {/* Teks Instruksi */}
        <p className="text-center text-gray/75 text-sm md:text-lg lg:text-base mb-6 md:mb-7 px-2 md:px-4 leading-relaxed">
          Lanjutkan untuk melihat menu dan mulai <br className="hidden md:block" /> memesan
        </p>

        {/* Tombol Lihat Menu */}
        <Button
          onClick={onLanjut}
          className="w-full max-w-68 md:max-w-115 py-2.25 md:py-4 lg:py-2.25 text-base md:text-xl lg:text-lg  font-semibold text-center flex items-center justify-center cursor-pointer"
        >
          Lihat Menu <ChevronRight size={24} strokeWidth={2} className="-ml-1 md:ml-0.5" />
        </Button>

        {/* Tombol Batal */}
        <Button
          onClick={onBatal}
          className="mt-3 md:mt-2 bg-transparent shadow-none hover:bg-transparent font-normal text-gray/75 underline hover:text-gray/90 transition-colors p-0 h-auto text-base md:text-xl lg:text-lg"
        >
          Batal
        </Button>
      </div>
    </div>
  );
};

export default TableInfoCard;
