import { Check } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean; // Tambahkan prop ini untuk kontrol buka/tutup[cite: 6]
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
}

const ConfirAlamat = ({ isOpen, onConfirm, onCancel, title, description }: ConfirmationModalProps) => {
  if (!isOpen) return null; // Modal hanya merender jika isOpen bernilai true[cite: 6]

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/10 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-xs p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Icon Check Bulat ungu tetap sama[cite: 6] */}
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
          <Check size={32} strokeWidth={4} />
        </div>
        
        <h3 className="text-xl font-black text-black mb-3">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">{description}</p>

        <div className="flex gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 py-3 bg-[#E5E7EB] text-gray-500 font-bold rounded-xs hover:bg-gray-200 transition-all active:scale-95"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xs  transition-all active:scale-95"
          >
            Ya, Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirAlamat;