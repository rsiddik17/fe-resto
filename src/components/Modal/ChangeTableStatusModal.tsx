import ChecklistWhiteIcon from "../Icon/ChecklistWhiteIcon";
import AvailableDirtyIcon from "../Icon/AvailableDirtyIcon";
import type { TableData } from "../../api/table.api";

interface ChangeTableStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableData | null;
  onStatusChange: (status: "tersedia" | "terisi" | "kotor") => void;
  onViewDetail: () => void;
}

const ChangeTableStatusModal = ({
  isOpen,
  onClose,
  table,
  onStatusChange,
  onViewDetail,
}: ChangeTableStatusModalProps) => {
  if (!isOpen || !table) return null;

  const isTersedia = table.status === "AVAILABLE";
  const isTerisi = table.status === "OCCUPIED";

  // Render warna status saat ini
  const statusColor = isTersedia ? "text-lime" : isTerisi ? "text-primary" : "text-gray-500";
  const statusText = isTersedia ? "Tersedia" : isTerisi ? "Terisi" : "Kotor";

  const formatTableNumber = (raw: string) => {
    // Hanya tangkap bagian angkanya saja, buang M dan buang _i/_o
    const match = raw.match(/M(\d+)/i);
    if (match) {
      return match[1]; // Kembalikan hanya angkanya saja, misal "01"
    }
    return raw.replace(/\D/g, "") || raw; // Fallback jika format berbeda
  };

  const displayTable = formatTableNumber(table.table_number);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose} // Menutup saat klik area gelap luar
    >
      <div
        className="bg-white w-full max-w-110 rounded-sm shadow-sm flex flex-col items-center px-6 py-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
      >
        {/* Nomor Meja Besar di Atas */}
        <div className="bg-[#D9D9D9]/50 p-2.5 rounded-xs mb-5 shadow">
          <h1 className="text-[26px] font-bold leading-none">{displayTable}</h1>
        </div>

        <h2 className="text-xl font-bold mb-1">
          Ubah status meja saat ini
        </h2>
        <p className="text-[12px] text-black/50 mb-5">
          Meja {displayTable} - Status sekarang:{" "}
          <span className={`font-bold capitalize ${statusColor}`}>
            {statusText}
          </span>
        </p>

        {/* 3 Tombol Aksi Status */}
        <div className="w-full flex flex-col gap-4 mb-4">
          {/* TANDAI TERISI */}
          <button
            onClick={() => onStatusChange("terisi")}
            className="w-full bg-primary hover:bg-[#5a0b64] text-white rounded-xs p-4 flex items-center gap-4 transition-colors shadow-sm"
          >
            <div className="bg-white/35 p-1.75 rounded-xs shrink-0">
              <ChecklistWhiteIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base tracking-wide mb-1">TANDAI TERISI</h3>
              <p className="text-white/80 text-[11px]">Meja sudah ditempati tamu</p>
            </div>
          </button>

          {/* TANDAI TERSEDIA */}
          <button
            onClick={() => onStatusChange("tersedia")}
            className="w-full bg-[#8AC926] hover:bg-[#7ab122] text-white rounded-xs p-4 flex items-center gap-4 transition-colors shadow-sm"
          >
            <div className="bg-white/35 p-1.75 rounded-xs shrink-0">
              <AvailableDirtyIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base tracking-wide mb-1">TANDAI TERSEDIA</h3>
              <p className="text-white/80 text-[11px]">Meja kosong dan siap di pesan</p>
            </div>
          </button>

          {/* TANDAI KOTOR */}
          <button
            onClick={() => onStatusChange("kotor")}
            className="w-full bg-[#73736C] hover:bg-[#6a6a6a] text-white rounded-xs p-4 flex items-center gap-4 transition-colors shadow-sm"
          >
            <div className="bg-white/35 p-1.75 rounded-xs shrink-0">
              <AvailableDirtyIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base tracking-wide mb-1">TANDAI KOTOR</h3>
              <p className="text-white/80 text-[11px]">Meja sedang dibersihkan</p>
            </div>
          </button>
        </div>

        {/* Footer Actions */}
        <button
          onClick={onViewDetail}
          className="text-primary font-bold text-[16px] mb-1 underline"
        >
          Lihat detail meja
        </button>
        <button
          onClick={onClose}
          className="text-black/50 text-sm hover:text-black transition-colors"
        >
          Batalkan
        </button>
      </div>
    </div>
  );
};

export default ChangeTableStatusModal;