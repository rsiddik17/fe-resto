import { X } from "lucide-react";
import type { OrderItemDetail } from "../Card/WaiterOrderListCard";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  tableName: string;
  time: string;
  items: OrderItemDetail[];
}

const OrderDetailModal = ({ isOpen, onClose, orderId, tableName, time, items }: OrderDetailModalProps) => {
  if (!isOpen) return null;

  const totalItemsCount = items.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-107.5 rounded-sm shadow-sm overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="pl-4 pr-3 pt-2.5">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-[11px] md:text-xs">{time}</span>
            <div className="flex items-center gap-3">
              <span className="bg-[#E6DB27] text-white px-5 py-0.5 rounded-full text-[10px] font-bold">
                {tableName}
              </span>
              <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors bg-gray-200 rounded-full p-0.5">
                <X className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
            </div>
          </div>
          
          <h2 className="text-sm md:text-[14.5px] mb-0.5">Detail Pesanan</h2>
          <h1 className="text-primary font-bold text-xl md:text-[21.5px]">{orderId}</h1>
        </div>

        {/* Modal Body (List Items) */}
        <div className="p-4 pb-2 pt-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-2.5 mt-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                {/* Kotak Ungu Kecil */}
                <div className="w-3.5 h-3.5 bg-primary rounded-[3px] mt-1.5 shrink-0"></div>
                
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] md:text-[17px]">
                    {item.name} x{item.qty}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs md:text-[13px] mt-0.5 border-l-2 border-primary pl-1.5 ml-0.5">
                    Catatan: {item.note || "Tidak ada"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pl-5 pb-3 border-t border-gray-100">
          <p className="text-sm md:text-[15px]">
            Total Item: {totalItemsCount}
          </p>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;    