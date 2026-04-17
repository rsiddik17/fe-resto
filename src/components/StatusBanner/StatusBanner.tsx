import { Clock, CheckCircle2 } from "lucide-react";
import { type PaymentStatus } from "../../hooks/useOrderPayment";
import SuccessIcon from "../Icon/SuccessIcon";

const StatusBanner = ({ status }: { status: PaymentStatus }) => {
  if (status === "PAYING") return null;

  const isPending = status === "PENDING";
  
  return (
    <div className={`p-6 rounded-md border-2 flex flex-col items-center text-center gap-2 transition-colors duration-500 ${
      isPending ? "bg-[#F3F9DD] border-[#8AC926] text-[#5C7024]" : "bg-[#E6F8EB] border-[#A8E4BA] text-[#1E7D37]"
    }`}>
      {isPending ? <Clock size={65} /> : <SuccessIcon className="w-16.25 h-16.25" />}
      
      <h3 className="fontbold text-2xl mt-2">
        {isPending ? "Pesanan Pending" : "Pesanan Dikonfirmasi"}
      </h3>
      <p className="text-xl">
        {isPending 
          ? "Pesanan Anda sedang menunggu konfirmasi dari kasir." 
          : "Silakan tunggu di meja anda. Pesanan akan segera diantarkan."}
      </p>
    </div>
  );
};

export default StatusBanner;