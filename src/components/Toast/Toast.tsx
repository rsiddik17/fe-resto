interface ToastProps {
  show: boolean;
  message: string;
}

const Toast = ({ show, message }: ToastProps) => {
  if (!show) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-100 bg-[#E63946] text-white font-bold text-sm px-6 py-3.5 rounded-sm shadow-lg border border-red-600/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      {message}
    </div>
  );
};

export default Toast;