import { useState } from "react"; 
import { FileText } from "lucide-react";
import { useNavigate } from "react-router";
import OrderDetailModal from "../../components/OrderDetailModal/OrderDetailModal"; 

const OrderCard = ({ order, activeTab }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xs p-4 sm:p-6 shadow-sm mb-4 transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary rounded-xs flex items-center justify-center shrink-0 shadow-inner">
              <FileText className="text-white w-8 h-8 sm:w-12 sm:h-12" strokeWidth={1.5} />
            </div>

            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-[13px] sm:text-xl text-primary truncate leading-tight">
                #{order.orderId}
              </h3>
              <p className="text-gray-900 font-bold text-[12px] sm:text-sm mb-1 sm:mb-2 truncate">
                {order.items?.map((item: any) => `${item.name} x${item.qty}`).join(", ")}
              </p>
              <div className="mt-1">
                <p className="hidden sm:block text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                  Total Pembayaran
                </p>
                <p className="font-extrabold text-gray-800 text-[14px] sm:text-lg">
                  Rp{(order.finalPayment || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between sm:self-stretch pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
            <span className="text-[9px] sm:text-[11px] text-gray-400 font-medium sm:mb-2 whitespace-nowrap">
              {order.date}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 sm:px-6 py-2 border border-primary text-primary rounded-xs text-[10px] sm:text-xs font-bold whitespace-nowrap active:bg-purple-50 transition-colors"
              >
                Lihat Detail
              </button>
              
              <button
                onClick={() => {
                  if (activeTab === "Aktif") {
                    // Ke halaman tracking
                    navigate("/customer/pantau-pesanan", { state: { order } });
                  } else {
                    // Logika "Beli Lagi" -> Balik ke menu
                    navigate("/customer/menu");
                  }
                }}
                className="px-3 sm:px-6 py-2 bg-primary text-white rounded-xs text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-sm active:scale-95 transition-all"
              >
                {activeTab === "Aktif" ? "Pantau Status" : "Beli Lagi"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <OrderDetailModal order={order} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default OrderCard;