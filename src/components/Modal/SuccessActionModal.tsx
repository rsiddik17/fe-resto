import { useEffect } from "react";
import { Check } from "lucide-react";

interface SuccessActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessActionModal = ({ isOpen, onClose, title = "Berhasil!", message }: SuccessActionModalProps) => {
  // Logic auto close setelah 4 detik
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer saat modal tertutup
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-90 rounded-sm shadow-sm p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        
        {/* Ikon Check Bulat */}
        <div className="w-18 h-18 bg-primary rounded-full flex items-center justify-center mb-5 shadow-sm">
          <Check className="text-white w-10 h-10" strokeWidth={4} />
        </div>
        
        <h2 className="text-[19px] font-extrabold text-black mb-3 leading-tight">{title}</h2>
        {message && <p className="text-gray-500 text-[13px]">{message}</p>}
        
      </div>
    </div>
  );
};

export default SuccessActionModal;