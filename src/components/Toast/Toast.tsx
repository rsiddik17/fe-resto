interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error"; // <-- TAMBAHAN TIPE
}

const Toast = ({ show, message, type = "error" }: ToastProps) => {
  if (!show) return null;

  // Tentukan warna berdasarkan tipe
  const bgClass = type === "success" ? "bg-green-500" : "bg-red-500";
  const borderClass = type === "success" ? "border-green-300" : "border-red-300";

  return (
    <div className={`fixed top-6 right-6 z-100 ${bgClass} text-white font-bold text-sm px-5 py-3 rounded-sm shadow-lg border ${borderClass} flex items-center gap-2 animate-in fade-in slide-in-from-right-8 duration-200`}>
      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      {message}
    </div>
  );
};

export default Toast;