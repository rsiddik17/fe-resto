import { X, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

const formatPrice = (value: number | undefined | null): string => {
  if (!value && value !== 0) return "0";
  return value.toLocaleString("id-ID");
};

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const navigate = useNavigate();

  if (!order) return null;

  // 🔥 PERBAIKAN: PAKAI RUMUS BACKEND
  const subTotal = order.subTotal || 0;
  const discountAmount = order.discountAmount || 0;
  const taxAmount = order.taxAmount || 0;
  const adminFee = order.adminFee || 0;
  const finalPayment = order.finalPayment || 0;

  const s = (order.status || "").toString().trim().toLowerCase();
  const isSelesai = s === "diterima" || s === "selesai";

  // Debugging (bisa dihapus setelah jadi)
  console.log("OrderDetailModal - Data:", {
    subTotal,
    discountAmount,
    taxAmount,
    adminFee,
    finalPayment,
  });

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 px-4 backdrop-blur-[1px]">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] animate-in fade-in duration-200">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-gray-900 text-sm font-bold">Detail Pesanan</h3>
          <button
            onClick={onClose}
            className="p-1 bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {/* ID & Status */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight">
                #{order.orderId || "-"}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {order.date || "-"}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-white text-[10px] font-bold shadow-sm ${isSelesai ? "bg-[#8BC34A]" : "bg-[#FF9800]"}`}
            >
              {order.status || "PENDING"}
            </div>
          </div>

          {/* Alamat */}
          <div className="bg-[#F3E8F3]/30 border border-primary/5 rounded-[14px] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={14} className="text-primary fill-primary/10" />
              <h4 className="font-bold text-gray-950 text-[12px]">
                Alamat Pengiriman
              </h4>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal ml-5">
              {order.address || "Alamat tidak tersedia"}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-1.5">
            <h4 className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">
              Item Pesanan
            </h4>
            <div className="bg-[#F3E8F3]/30 border border-primary/5 rounded-[14px] p-3 space-y-2">
              {(order.items || []).map((item: any, idx: number) => {
                const price = item.price || 0;
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-gray-100 last:border-0 pb-2 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-gray-800 font-bold text-[12px]">
                        {item.name || "Menu"}{" "}
                        <span className="text-primary font-black ml-1">
                          x{item.qty || 0}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Catatan: {item.notes || "Tidak ada"}
                      </p>
                    </div>
                    <p className="text-gray-800 font-bold text-[12px]">
                      Rp{formatPrice(price)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan Pembayaran - PAKAI RUMUS BACKEND */}
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            <div className="flex justify-between text-[11px] text-gray-600 font-medium">
              <span>Total Pesanan</span>
              <span>Rp{formatPrice(subTotal)}</span>
            </div>

            <div className="flex justify-between text-[11px] text-gray-600 font-medium">
              <span>Diskon</span>
              <span className="text-red-500">
                -Rp{formatPrice(discountAmount)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] text-gray-600 font-medium">
              <span>PPN 10%</span>
              <span>Rp{formatPrice(taxAmount)}</span>
            </div>

            {adminFee > 0 && (
              <div className="flex justify-between text-[11px] text-gray-600 font-medium">
                <span>Biaya Admin</span>
                <span>Rp{formatPrice(adminFee)}</span>
              </div>
            )}

            <div className="flex justify-between text-[14px] font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Pembayaran</span>
              <span className="text-primary">
                Rp{formatPrice(finalPayment)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-50 shrink-0">
          <button
            onClick={() => {
              if (!isSelesai) {
                navigate("/customer/track-order", { state: { order } });
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
