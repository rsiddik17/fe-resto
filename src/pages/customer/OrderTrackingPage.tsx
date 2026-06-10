import { useState, useEffect } from "react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { orderAPI } from "../../api/order.api";
import { addressAPI } from "../../api/address.api";
import EmptyOrder from "../../components/EmptyOrder/EmptyOrder";
import OrderCard from "../../components/OrderCard/OrderCard";

interface Order {
  orderId: string;
  address: string;
  items: any[];
  finalPayment: number;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  adminFee: number;
  status: string;
  date: string;
}

const OrderTrackingPage = () => {
  const [activeTab, setActiveTab] = useState<"Aktif" | "Selesai">("Aktif");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const addressResponse = await addressAPI.getMyAddresses();
      const addresses = addressResponse.data || [];
      const addressMap: Record<string, string> = {};

      addresses.forEach((addr: any) => {
        addressMap[addr.id] =
          addr.address_name || addr.detail || "Alamat tidak tersedia";
      });
      console.log("✅ Address map loaded:", addressMap);

      const orderResponse = await orderAPI.getMyAllOrders();
      const orderList = orderResponse.data || orderResponse.orders || [];

      const mappedOrders: Order[] = orderList.map((order: any) => {
        const adminFeeValue =
          Number(order.admin_fee) ||
          Number(order.unique_code) ||
          Number(order.payments?.unique_code) || // ← ini yang penting!
          0;
        return {
          orderId: order.id || order.orderId,
          address: addressMap[order.address_id] || "Alamat tidak tersedia",
          items: (order.order_items || []).map((item: any) => ({
            name: item.menu?.name || item.name || "Menu",
            qty: item.quantity || 1,
            price: Number(item.sub_total || item.price || 0),
            notes: item.notes || "",
          })),
          subTotal: Number(order.total_amount) || 0,
          taxAmount: Number(order.tax_amount) || 0,
          discountAmount: Number(order.discount_amount) || 0,
          adminFee: adminFeeValue,
          finalPayment:
            Number(order.grand_total_amount) ||
            Number(order.payments?.grand_total_amount) ||
            0,

          // finalPayment: Number(order.grand_total_amount) || 0,
          status: (order.status || "pending").toLowerCase(),
          date: order.created_at
            ? new Date(order.created_at).toLocaleString("id-ID")
            : order.date || new Date().toLocaleString("id-ID"),
        };
      });

      console.log("✅ Mapped orders with addresses:", mappedOrders);
      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("❌ Gagal mengambil data:", err);
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredOrders = orders.filter((o: Order) => {
    const s = o.status.toLowerCase().trim();
    if (activeTab === "Aktif") {
      return (
        s === "pending" || s === "proses" || s === "dimasak" || s === "diantar"
      );
    } else {
       return s === "selesai" || s === "dibatalkan";
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header mode="online" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Memuat pesanan Anda...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header mode="online" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchAllData}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header mode="online" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="flex items-center gap-3 mb-8 sm:mb-12">
          <button
            onClick={() => setActiveTab("Aktif")}
            className={`px-6 sm:px-10 py-2.5 rounded-xs font-bold text-[12px] sm:text-sm transition-all duration-300 ${
              activeTab === "Aktif"
                ? "bg-primary text-white shadow-lg"
                : "bg-white text-primary border border-primary"
            }`}
          >
            Pesanan Aktif
          </button>
          <button
            onClick={() => setActiveTab("Selesai")}
            className={`px-6 sm:px-10 py-2.5 rounded-xs font-bold text-[12px] sm:text-sm transition-all duration-300 ${
              activeTab === "Selesai"
                ? "bg-primary text-white shadow-lg"
                : "bg-white text-primary border border-primary"
            }`}
          >
            Pesanan Selesai
          </button>
        </div>

        <div className="w-full">
          {filteredOrders.length === 0 ? (
            <EmptyOrder
              title={
                activeTab === "Aktif"
                  ? "Tidak ada pesanan aktif"
                  : "Belum ada pesanan selesai"
              }
              description={
                activeTab === "Aktif"
                  ? "Anda belum memiliki pesanan yang sedang diproses"
                  : "Pesanan yang sudah selesai akan muncul di sini"
              }
            />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredOrders.map((order: Order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  activeTab={activeTab}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;
