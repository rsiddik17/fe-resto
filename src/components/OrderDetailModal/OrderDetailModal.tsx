import { X, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const navigate = useNavigate();

  if (!order) return null;

  const isSelesai = order.status === "Selesai";

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-xs overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header Modal */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-black text-lg ">Detail Pesanan</h3>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* ID & Status (Warna Hijau untuk Selesai) */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black text-primary tracking-tight">
                #{order.orderId}
              </h3>
              <p className="text-[12px] text-gray-400 mt-0.5">{order.date}</p>
            </div>
            <div
              className={`px-4 py-1.5 rounded-xs text-white text-[11px] font-bold shadow-sm ${isSelesai ? "bg-[#8BC34A]" : "bg-[#FF9800]"}`}
            >
              {order.status}
            </div>
          </div>

          {/* Alamat Pengiriman */}
          <div className="bg-[#F3E8F3]/50 border border-primary/10 rounded-xs p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-primary fill-primary/20" />
              <h4 className="font-bold text-black text-[14px]">
                Alamat Pengiriman
              </h4>
            </div>
            <p className="text-[11px] text-black leading-relaxed ml-6">
              {order.address ||
                "Jl. Sholeh Iskandar No.Km.02, RT.01/RW.010, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16162"}
            </p>
          </div>

          {/* Item Pesanan */}
          <div className="space-y-3">
            <h4 className=" text-black text-[10px] ">Item Pesanan</h4>
            <div className="bg-[#F3E8F3]/50 rounded-xs p-4 space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-start border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className=" text-gray-800 text-[13px]">
                      {item.name} x{item.qty}
                    </p>
                    <p className="text-[11px] text-gray-400 ">
                      Catatan: {item.notes || "Tidak ada"}
                    </p>
                  </div>
                  <p className=" text-gray-800 text-[13px]">
                    Rp{(item.price * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="space-y-2 pt-2">
            {[
              { label: "Total Pesanan", value: order.subTotal },
              { label: "PPN 10%", value: order.subTotal * 0.1 },
              {
                label: "Diskon",
                value: order.discountAmount,
                isDiscount: true,
              },
              { label: "Biaya Admin", value: order.adminFee },
            ].map(
              (item, i) =>
                item.value > 0 && (
                  <div
                    key={i}
                    className={`flex justify-between text-[13px] ${item.isDiscount ? "text-red-500 font-medium" : "text-black"}`}
                  >
                    <span>{item.label}</span>
                    <span>
                      {item.isDiscount ? "-" : ""}Rp
                      {item.value.toLocaleString("id-ID")}
                    </span>
                  </div>
                ),
            )}
            <div className="flex justify-between text-lg font-bold text-black pt-3 border-t border-gray-100">
              <span>Total Pembayaran</span>
              <span className="text-primary">
                Rp{order.finalPayment.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-6 bg-white border-t border-gray-50">
          <button
            onClick={() => {
              if (!isSelesai) {
                // Pastikan path ini mengarah ke halaman Tracking (OrderTrackingOnline)
                navigate("/customer/pantau-pesanan", { state: { order } });
                onClose();
              }
            }}
            className="w-full py-4 bg-primary text-white font-bold rounded-xs text-[16px] shadow-lg shadow-purple-200 active:scale-[0.98] transition-all"
          >
            {isSelesai ? "Beli Lagi" : "Pantau Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
