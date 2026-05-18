import { X, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const navigate = useNavigate();

  if (!order) return null;

  // Normalisasi status ke huruf kecil agar anti-ngaco
  const s = (order.status || "").toString().trim().toLowerCase();
  const isSelesai = s === "diterima" || s === "selesai";

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 px-4 backdrop-blur-[1px]">
      {/* UKURAN MODAL DIRAMPINGKAN: max-w-sm (380px), rounded-2xl agar halus dan tidak ngezoom kaku */}
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] animate-in fade-in duration-200">
        
        {/* Header Modal - Padding dikurangi jadi p-4 */}
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-gray-900 text-sm font-bold">Detail Pesanan</h3>
          <button
            onClick={onClose}
            className="p-1 bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Content - Scrollable */}
        <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {/* ID & Status */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight">
                #{order.orderId}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-white text-[10px] font-bold shadow-sm ${
                isSelesai ? "bg-[#8BC34A]" : "bg-[#FF9800]"
              }`}
            >
              {order.status}
            </div>
          </div>

          {/* Alamat Pengiriman */}
          <div className="bg-[#F3E8F3]/30 border border-primary/5 rounded-[14px] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={14} className="text-primary fill-primary/10" />
              <h4 className="font-bold text-gray-950 text-[12px]">
                Alamat Pengiriman
              </h4>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal ml-5">
              {order.address}
            </p>
          </div>

          {/* Item Pesanan */}
          <div className="space-y-1.5">
            <h4 className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Item Pesanan</h4>
            <div className="bg-[#F3E8F3]/30 border border-primary/5 rounded-[14px] p-3 space-y-2">
              {order.items?.map((item: any, idx: number) => {
                // SOLUSI BUG RpNaN: Jika item.price tidak ada, gunakan hitungan perkiraan dari subTotal
                const fallbackPrice = item.price || (order.subTotal / item.qty);
                
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-gray-100 last:border-0 pb-2 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-gray-800 font-bold text-[12px]">
                        {item.name} <span className="text-primary font-black ml-1">x{item.qty}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Catatan: {item.notes || "Tidak ada"}
                      </p>
                    </div>
                    <p className="text-gray-800 font-bold text-[12px]">
                      Rp{fallbackPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            {[
              { label: "Total Pesanan", value: order.subTotal },
              { label: "Biaya Admin", value: order.adminFee },
              {
                label: "Diskon",
                value: order.discountAmount,
                isDiscount: true,
              },
            ].map(
              (item, i) =>
                item.value > 0 && (
                  <div
                    key={i}
                    className={`flex justify-between text-[11px] ${
                      item.isDiscount ? "text-red-500 font-bold" : "text-gray-600 font-medium"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span>
                      {item.isDiscount ? "-" : ""}Rp
                      {item.value.toLocaleString("id-ID")}
                    </span>
                  </div>
                ),
            )}
            <div className="flex justify-between text-[14px] font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Pembayaran</span>
              <span className="text-primary">
                Rp{order.finalPayment.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Button - Padding dirampingkan */}
        <div className="p-4 bg-white border-t border-gray-50 shrink-0">
          <button
            onClick={() => {
              if (!isSelesai) {
                navigate("/customer/pantau-pesanan", { state: { order } });
                onClose();
              }
            }}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl text-[14px] shadow-md shadow-purple-100 active:scale-[0.98] transition-all"
          >
            {isSelesai ? "Beli Lagi" : "Pantau Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;