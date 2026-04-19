import { AlertTriangle } from "lucide-react";

interface DeleteCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCartModal = ({ isOpen, onClose, onConfirm }: DeleteCartModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/10 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xs p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-center mb-4">
          <AlertTriangle size={40} className="text-red-600" />
        </div>
        
        <h2 className="text-xl font-bold text-red-600 mb-2 leading-tight">
          Hapus item ini dari keranjang?
        </h2>
        <p className="text-black mb-8 text-sm px-2">
          Apakah anda yakin ingin menghapus item dari keranjang? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xs hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xs hover:bg-red-700 transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCartModal;