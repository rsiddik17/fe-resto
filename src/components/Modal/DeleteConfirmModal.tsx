import Button from "../ui/Button";
import WarningIcon from "../Icon/WarningIcon";

interface DeleteConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({ onClose, onConfirm }: DeleteConfirmModalProps) => {
  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-[90%] md:max-w-131.5 min-h-74 md:h-94 lg:max-w-98 lg:min-h-0 lg:h-65 rounded-2xl pt-8 pb-6 px-4 md:pt-9 md:pb-8 md:px-8 lg:pb-3 lg:pt-6 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Ikon Segitiga Peringatan */}
        <div className="mb-3 md:mb-4">
          <WarningIcon className="text-[#FC1111] w-11 h-11 md:w-13 md:h-13 lg:w-10 lg:h-10" />
        </div>

        <h2 className="text-base md:text-[26px] lg:text-base font-bold text-[#FC1111] mb-4 md:mb-4.5 lg:mb-3">
          Hapus item ini dari keranjang?
        </h2>
        
        <p className="mb-6 md:mb-9 lg:mb-6 text-sm md:text-xl lg:text-sm px-2">
          Apakah anda yakin ingin menghapus item dari keranjang? Tindakan ini tidak dapat dibatalkan
        </p>

        {/* Baris Tombol */}
        <div className="flex justify-center w-full gap-x-8 md:gap-x-16 lg:gap-x-6 mt-0">
          <Button 
            onClick={onClose}
            // Kita override warnanya jadi abu-abu karena di Button.tsx belum ada variant abu-abu
            className="flex-1 max-w-35 md:max-w-41.75 lg:max-w-30 py-2 md:py-2.5 lg:py-1.5 font-normal text-[15px] md:text-lg lg:text-[15px] bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 shadow-none"
          >
            Batal
          </Button>
          
          <Button 
            onClick={onConfirm}
            className="flex-1 max-w-35 md:max-w-41.75 lg:max-w-30 py-2 md:py-2.5 lg:py-1.5 font-normal text-[15px] md:text-lg lg:text-[15px] bg-[#FC1111] hover:bg-[#ec0c0c] text-white"
          >
            Ya, Hapus
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;