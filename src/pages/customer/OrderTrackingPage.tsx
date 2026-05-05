import { useState } from "react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { useOrderStore } from "../../store/useOrderStore";
import EmptyOrder from "../../components/EmptyOrder/EmptyOrder";
import OrderCard from "../../components/OrderCard/OrderCard";

const OrderTrackingPage = () => {
  const [activeTab, setActiveTab] = useState<"Aktif" | "Selesai">("Aktif");
  const { orders } = useOrderStore() as any;

  const filteredOrders = (orders || []).filter((o: any) => {
    if (activeTab === "Aktif") {
      // Pesanan Aktif: Sedang dimasak ATAU Sedang diantar (status 'Selesai' di dummy kita)[cite: 2]
      return o.status === "Dimasak" || o.status === "Selesai" || o.status === "Proses";
    } else {
      // Pesanan Selesai: Benar-benar sudah final / diterima[cite: 2]
      return o.status === "Diterima";
    }
  });

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
                : "bg-white text-primary border border-primary hover:bg-purple-50"
            }`}
          >
            Pesanan Aktif
          </button>
          <button
            onClick={() => setActiveTab("Selesai")}
            className={`px-6 sm:px-10 py-2.5 rounded-xs font-bold text-[12px] sm:text-sm transition-all duration-300 ${
              activeTab === "Selesai"
                ? "bg-primary text-white shadow-lg"
                : "bg-white text-primary border border-primary hover:bg-purple-50"
            }`}
          >
            Pesanan Selesai
          </button>
        </div>

        <div className="w-full">
          {filteredOrders.length === 0 ? (
            <EmptyOrder />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredOrders.map((order: any) => (
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