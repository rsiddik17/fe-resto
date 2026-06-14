import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { orderAPI } from "../../api/order.api";

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
  const [detailOrder, setDetailOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailOrder = async () => {
      if (!order?.orderId) return;
      
      try {
        setLoading(true);
        // ✅ PAKAI API getMyOrderById untuk detail lengkap
        const response = await orderAPI.getMyOrderById(order.orderId);
        const data = response.data || response;
        console.log("Detail order dari API:", data);
        setDetailOrder(data);
      } catch (error) {
        console.error("Gagal ambil detail order:", error);
        setDetailOrder(order);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailOrder();
  }, [order?.orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 px-4 backdrop-blur-[1px]">
        <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Memuat detail...</p>
        </div>
      </div>
    );
  }

  const orderData = detailOrder || order;
  
  // ✅ Ambil admin fee dari payments.unique_code
  const adminFeeValue = 
    Number(orderData.payments?.unique_code) ||  // ini yang penting!
    Number(orderData.unique_code) ||
    Number(orderData.admin_fee) ||
    0;
  
  const finalPaymentValue = 
    Number(orderData.payments?.grand_total_amount) ||
    Number(orderData.grand_total_amount) ||
    order.finalPayment ||
    0;

  const subTotal = Number(orderData.payments?.total_amount) || Number(orderData.total_amount) || order.subTotal || 0;
  const discountAmount = Number(orderData.payments?.discount_amount) || Number(orderData.discount_amount) || order.discountAmount || 0;
  const taxAmount = Number(orderData.payments?.tax_amount) || Number(orderData.tax_amount) || order.taxAmount || 0;
  const status = orderData.status || order.status || "PENDING";
  const s = status.toString().trim().toLowerCase();
const isSelesai = s === "selesai";

  console.log("OrderDetailModal - Admin Fee:", adminFeeValue);
  console.log("OrderDetailModal - Final Payment:", finalPaymentValue);

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 px-4 backdrop-blur-[1px]">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] ">
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
                #{orderData.order_id || order.orderId || "-"}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {orderData.date || order.date || new Date(orderData.created_at).toLocaleString("id-ID") || "-"}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-white text-[10px] font-bold shadow-sm ${isSelesai ? "bg-[#8BC34A]" : "bg-[#FF9800]"}`}
            >
              {status}
            </div>
          </div>

          {/* Alamat */}
          <div className="bg-[#F3E8F3]/30 border border-primary/5 rounded-[14px] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={14} className="text-primary fill-primary/10" />
              <h4 className="font-bold text-gray-950 text-[12px]">Alamat Pengiriman</h4>
            </div>
            <p className="text-[11px] text-gray-600 leading-normal ml-5">
              {orderData.address?.address_name || order.address || "Alamat tidak tersedia"}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-1.5">
            <h4 className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Item Pesanan</h4>
            <div className="bg-[#F3E8F3]/30 border border-primary/5 rounded-[14px] p-3 space-y-2">
              {(orderData.order_items || order.items || []).map((item: any, idx: number) => {
                const price = item.price_at_transaction || item.price || 0;
                const qty = item.quantity || item.qty || 0;
                const name = item.menu_name || item.menu?.name || item.name || "Menu";
                const notes = item.notes || "Tidak ada";
                return (
                  <div key={idx} className="flex justify-between items-start border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-gray-800 font-bold text-[12px]">
                        {name} <span className="text-primary font-black ml-1">x{qty}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Catatan: {notes}</p>
                    </div>
                    <p className="text-gray-800 font-bold text-[12px]">Rp{formatPrice(price * qty)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            <div className="flex justify-between text-[11px] text-gray-600 font-medium">
              <span>Total Pesanan</span>
              <span>Rp{formatPrice(subTotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[11px] text-gray-600 font-medium">
                <span>Diskon</span>
                <span className="text-red-500">-Rp{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[11px] text-gray-600 font-medium">
              <span>PPN 10%</span>
              <span>Rp{formatPrice(taxAmount)}</span>
            </div>

            {/* ✅ Biaya Admin - selalu tampil */}
            <div className="flex justify-between text-[11px] text-gray-600 font-medium">
              <span>Biaya Admin</span>
              <span>Rp{formatPrice(adminFeeValue)}</span>
            </div>

            <div className="flex justify-between text-[14px] font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Pembayaran</span>
              <span className="text-primary">Rp{formatPrice(finalPaymentValue)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-50 shrink-0">
          <button
            onClick={() => {
              if (!isSelesai) {
                navigate("/customer/track-order", { state: { order: orderData } });
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