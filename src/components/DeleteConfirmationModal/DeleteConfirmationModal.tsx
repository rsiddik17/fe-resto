import WarningIcon from "../Icon/Warning";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;       // Judul dinamis (Hapus Alamat? / Hapus Keranjang?)
  description: string; // Deskripsi dinamis
}

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description 
}: DeleteConfirmationModalProps) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/10 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
      {/* Container utama dengan rounded-xs sesuai request-mu */}
      <div className="bg-white rounded-xs p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
        
        {/* Icon Warning dengan warna red-600 */}
        <div className="flex justify-center mb-4">
          <WarningIcon size={40} className="text-red-600" />
        </div>
        
        {/* Judul dengan warna red-600[cite: 6] */}
        <h2 className="text-xl font-bold text-red-600 mb-2 leading-tight">
          {title}
        </h2>
        
        {/* Deskripsi[cite: 6] */}
        <p className="text-black mb-8 text-sm px-2 leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3">
          {/* Tombol Batal[cite: 6] */}
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 rounded-xs"
          >
            Batal
          </button>
          
          {/* Tombol Konfirmasi Hapus dengan warna red-600[cite: 6] */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xs hover:bg-red-700 transition-colors  "
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;