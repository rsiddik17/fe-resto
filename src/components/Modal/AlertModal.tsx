import { Clock, XCircle } from "lucide-react";
import Button from "../ui/Button";

interface AlertModalprops {
  title: string;
  message: string;
  type: "PENDING" | "CANCELED";
  onClose: () => void;
}

const AlertModal = ({ title, message, type, onClose }: AlertModalprops) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-xl animate-scaleIn border border-gray-100">
        {/* icon */}
        {type === "CANCELED" ? (
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <XCircle size={36} />
          </div>
        ) : (
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Clock size={36} />
          </div>
        )}

        {/* title */}
        <h3 className="text-lg md:text-xl font-bold text-gray-950 mb-2">
          {title}
        </h3>
        <p className="text-sm md:text-base text-gray-500 mb-6 leading-relaxed">
          {message}
        </p>

        <Button
          onClick={onClose}
          className="w-full py-2.5 bg-primary border-primary hover:bg-primary-dark hover:border-primary-dark text-white font-bold rounded-full text-sm md:text-base transition-colors shadow-md"
        >
          {type === "CANCELED" ? "Kembali ke Menu" : "Mengerti"}
        </Button>
      </div>
    </div>
  );
};

export default AlertModal;
