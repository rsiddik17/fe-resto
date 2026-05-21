import { Clock } from "lucide-react";
import { cn } from "../../utils/utils";
import type { OrderStatus } from "../Filter/KitchenFilterTabs";

export type OrderType = "Delivery" | "Dine in";

export interface OrderItem {
  qty: number;
  name: string;
  note?: string; // Tambahan field note untuk modal detail
}

export interface OrderDetail {
  id: string;
  type: OrderType;
  table?: string;
  time: string;
  status: OrderStatus;
  items: OrderItem[];
}

interface KitchenOrderCardProps {
  order: OrderDetail;
  onDetailClick?: () => void;
  onActionClick?: () => void;
}

const KitchenOrderCard = ({ order, onDetailClick, onActionClick }: KitchenOrderCardProps) => {
  const getThemeColor = () => {
    if (order.status === "MASUK") return { bg: "bg-[#1890FF]", text: "text-[#1890FF]", border: "border-[#1890FF]" };
    if (order.status === "MEMASAK") return { bg: "bg-[#FF9100]", text: "text-[#FF9100]", border: "border-[#FF9100]" };
    return { bg: "bg-[#8AC926]", text: "text-[#8AC926]", border: "border-[#8AC926]" };
  };

  const getActionButtonText = () => {
    if (order.status === "MASUK") return "Mulai Masak";
    if (order.status === "MEMASAK") return "Selesai Masak";
    return ""; // Siap Saji tidak punya tombol aksi
  };

  const theme = getThemeColor();

  return (
    <div className="bg-white p-3 rounded-sm shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className={cn(
          "px-3 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm",
          order.type === "Delivery" ? "bg-[#BA68C8]" : "bg-[#E9E21A]"
        )}>
          {order.type}
        </span>
        <div className="flex items-center gap-1.5 text-[#585855] font-bold text-[12px]">
          <Clock size={14} strokeWidth={2.5} />
          {order.time}
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <h3 className="font-bold text-[18px] text-black leading-none">{order.id}</h3>
        {order.table && (
          <span className="text-[11px]">{order.table}</span>
        )}
      </div>

      <ul className="flex flex-col gap-2 mb-6 flex-1">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-[13.5px] text-gray-900 font-medium leading-tight">
            <span className={cn("w-2.5 h-2.5 rounded-[2.5px] shrink-0 mt-0.75", theme.bg)} />
            <span>{item.qty}x {item.name}</span>
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-auto pt-2">
        <button 
          onClick={onDetailClick}
          className={cn(
            "py-2 rounded-xs font-bold text-[13px] border-[1.5px] bg-white transition-colors cursor-pointer",
            theme.text, theme.border, "hover:bg-gray-50",
            // Jika Siap Saji, tombol ini memanjang penuh
            order.status === "SIAP_SAJI" ? "w-full" : "flex-1"
          )}
        >
          Lihat Detail
        </button>
        
        {/* Tombol aksi kedua HANYA MUNCUL JIKA STATUS BUKAN SIAP_SAJI */}
        {order.status !== "SIAP_SAJI" && (
          <button 
            onClick={onActionClick}
            className={cn(
              "flex-1 py-2 rounded-xs font-bold text-[13px] border-[1.5px] border-transparent text-white transition-colors cursor-pointer shadow-sm",
              theme.bg,
              "hover:opacity-90"
            )}
          >
            {getActionButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default KitchenOrderCard;