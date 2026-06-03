import { Calendar } from "lucide-react";
import { cn } from "../../utils/utils";

interface OrderInfoCardProps {
  orderId: string;
  statusText: string;
  statusColorClass: string;
  statusBgClass: string;
  timeString: string;
  isOnline: boolean;
  phoneNumber?: string;
  tableNumberString: string;
}

const OrderInfoCard = ({
  orderId,
  statusText,
  statusColorClass,
  statusBgClass,
  timeString,
  isOnline,
  phoneNumber,
  tableNumberString,
}: OrderInfoCardProps) => {
  return (
    <div className="border-2 border-primary bg-primary/10 rounded-md p-2.5 flex flex-col gap-1 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-2">
          <span className="text-black font-medium text-[15px] md:text-[16px]">ID Pesanan</span>
          <span className="text-primary font-bold text-[16px] md:text-[17px]">#{orderId}</span>
        </div>
        {/* Badge Status */}
        <div className="flex justify-center items-center gap-1.5 px-2.5 py-1 rounded-full bg-white">
          <div className={cn("w-2 h-2 -translate-y-px rounded-full", statusBgClass)}></div>
          <span
            className={cn(
              "text-[11px] font-medium uppercase",
              statusColorClass,
            )}
          >
            {statusText}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-black font-medium text-[14px]">
        <div className="flex items-center gap-2 text-black/70">
          <Calendar size={18} />
          <span>{timeString}</span>
        </div>
        {/* Tampilkan Telepon jika Delivery, Meja jika Dine In */}
        {isOnline && phoneNumber ? (
          <div className="flex items-center gap-2">
            <span>{phoneNumber}</span>
            <span className="font-bold text-black ml-1">• Delivery</span>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
            <span className="font-bold text-black">{tableNumberString}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderInfoCard;
