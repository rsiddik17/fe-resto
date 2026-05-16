import { Check } from "lucide-react";
import { cn } from "../../utils/utils";
import WarningIcon from "../Icon/WarningIcon";

interface TableActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "save" | "delete"; // <-- Prop penentu mode modal
}

const TableActionConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
}: TableActionConfirmModalProps) => {
  if (!isOpen) return null;

  const isSave = actionType === "save";

  return (
    // z-[60] agar modal ini selalu tampil paling depan (di atas modal detail)
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-sm shadow-sm overflow-hidden animate-in zoom-in-95 duration-200 relative p-6 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ikon Dinamis */}
        {isSave ? (
          <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
            <Check size={36} strokeWidth={3.5} />
          </div>
        ) : (
          <div className="text-red-500 mb-3">
            <WarningIcon className="w-9 h-9" strokeWidth={2.5} />
          </div>
        )}

        {/* Judul Dinamis */}
        <h2
          className={cn(
            "text-lg font-bold mb-2.5",
            isSave ? "text-black" : "text-red-500"
          )}
        >
          {isSave ? "Simpan Perubahan?" : "Hapus Meja?"}
        </h2>

        {/* Teks Dinamis */}
        <p className="text-[13.5px] leading-relaxed mb-12 px-2">
          Apakah anda yakin ingin {isSave ? "mengubah data" : "menghapus"} <br /> meja
          ? Tindakan ini tidak dapat dibatalkan
        </p>

        {/* Tombol Aksi Dinamis */}
        <div className="flex items-center gap-8 w-[85%] mx-auto mb-1">
          <button
            onClick={onClose}
            className="flex-1 bg-[#DEDED9] text-sm py-2 rounded-xs hover:bg-gray/40 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "flex-1 text-white text-sm py-2 rounded-xs transition-colors cursor-pointer",
              isSave
                ? "bg-primary hover:bg-primary-hover"
                : "bg-red-500 hover:bg-red-600"
            )}
          >
            {isSave ? "Ya, Simpan" : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableActionConfirmModal;