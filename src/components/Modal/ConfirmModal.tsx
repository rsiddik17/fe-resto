import { Check, TriangleAlert } from "lucide-react";
import Button from "../ui/Button";

export interface ConfirmModalProps {
  isOpen: boolean;
  type: "success" | "danger"; // 'success' untuk Simpan, 'danger' untuk Hapus
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ 
  isOpen, type, title, message, confirmText, cancelText = "Batal", onConfirm, onCancel 
}: ConfirmModalProps) => {
  
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl p-7 md:p-8 shadow-2xl flex flex-col items-center text-center w-[360px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ikon Atas */}
        {isDanger ? (
          <TriangleAlert size={48} className="text-[#E63946] mb-4 fill-[#E63946]/10" strokeWidth={2} />
        ) : (
          <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
        )}

        {/* Judul & Pesan */}
        <h2 className={`text-[18px] font-extrabold mb-2 ${isDanger ? 'text-[#E63946]' : 'text-black'}`}>
          {title}
        </h2>
        <p className="text-[13px] text-black font-medium mb-6 leading-relaxed px-2">
          {message}
        </p>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-3 w-full">
          <Button 
            onClick={onCancel}
            className="flex-1 bg-[#D9D9D9] hover:bg-gray-300 text-black font-extrabold py-2.5 rounded-lg text-[13px] transition-colors"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm}
            className={`flex-1 font-extrabold py-2.5 rounded-lg text-[13px] shadow-sm transition-colors text-white ${
              isDanger ? 'bg-[#E63946] hover:bg-red-700' : 'bg-primary hover:bg-[#5a0b64]'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;