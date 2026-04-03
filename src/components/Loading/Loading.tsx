import { LoaderCircle } from "lucide-react";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}


const Loading = ({ show, message = "Sedang memproses..." }: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-sm flex flex-col items-center min-w-32">
        <LoaderCircle size={40} className="animate-spin text-primary mb-3" />
        <p className="text-gray font-medium text-sm text-center">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;