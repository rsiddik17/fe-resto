import { Check } from "lucide-react";
import { cn } from "../../utils/utils";
import WarningIcon from "../Icon/WarningIcon";

interface OrderActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: "save" | "delete";
}

const OrderEditActionConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
}: OrderActionConfirmModalProps) => {
  if (!isOpen) return null;

  const isDelete = actionType === "delete";

  return (
    // z-[100] dipertahankan agar selalu di atas modal lain jika tumpang tindih
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-sm shadow-sm overflow-hidden animate-in zoom-in-95 duration-200 relative p-6 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ikon Dinamis */}
        {!isDelete ? (
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
            !isDelete ? "text-black" : "text-red-500"
          )}
        >
          {isDelete ? "Hapus Item?" : "Simpan Perubahan?"}
        </h2>

        {/* Teks Dinamis (Isi dipertahankan) */}
        <p className="text-[13.5px] leading-relaxed mb-12 px-2 text-black/80">
          {isDelete
            ? "Apakah anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan"
            : "Perubahan pada pesanan akan disimpan dan rincian pesanan pelanggan akan diperbarui"}
        </p>

        {/* Tombol Aksi Dinamis */}
        <div className="flex items-center gap-8 w-[85%] mx-auto mb-1">
          <button
            onClick={onClose}
            className="flex-1 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 text-sm py-2 rounded-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "flex-1 text-white text-sm py-2 rounded-xs transition-colors cursor-pointer shadow-sm",
              !isDelete
                ? "bg-primary hover:bg-primary-hover"
                : "bg-red-500 hover:bg-red-600"
            )}
          >
            {isDelete ? "Ya, Hapus" : "Ya, Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderEditActionConfirmModal;