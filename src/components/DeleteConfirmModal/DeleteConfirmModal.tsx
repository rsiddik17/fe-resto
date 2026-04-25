import Button from "../ui/Button";
import WarningIcon from "../Icon/WarningIcon";

interface DeleteConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({ onClose, onConfirm }: DeleteConfirmModalProps) => {
  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/1 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[90%] md:max-w-131.5 h-93 md:h-91 rounded-2xl pt-8 pb-6 px-2 md:pt-9 md:pb-8 md:px-8 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Ikon Segitiga Peringatan */}
        <div className="mb-3 md:mb-4">
          <WarningIcon className="text-[#FC1111] w-14 h-14" />
        </div>

        <h2 className="text-xl md:text-[26px] font-bold text-[#FC1111] mb-5 md:mb-4.5">
          Hapus item ini dari keranjang?
        </h2>
        
        <p className="mb-6 md:mb-9 text-lg md:text-xl px-2">
          Apakah anda yakin ingin menghapus item dari keranjang? Tindakan ini tidak dapat dibatalkan
        </p>

        {/* Baris Tombol */}
        <div className="flex justify-center w-full gap-x-10 md:gap-x-16 mt-6">
          <Button 
            onClick={onClose}
            // Kita override warnanya jadi abu-abu karena di Button.tsx belum ada variant abu-abu
            className="flex-1 max-w-36 md:max-w-41.75 font-normal text-lg bg-[#D9D9D9] text-black"
          >
            Batal
          </Button>
          
          <Button 
            onClick={onConfirm}
            className="flex-1 max-w-36 md:max-w-41.75 py-3 md:py-2.5 font-semibold text-lg bg-[#FC1111] text-white"
          >
            Ya, Hapus
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;