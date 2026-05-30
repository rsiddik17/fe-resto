import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import WaiterOrderListCard, {
  type OrderStatus,
} from "../../components/Card/WaiterOrderListCard";
import OrderDetailModal from "../../components/Modal/OrderDetailModal";
import ConfirmFinishModal from "../../components/Modal/ConfirmFinishModal";
import { cn } from "../../utils/utils";
import { useProfile } from "../../hooks/useProfile";
import { orderAPI } from "../../api/order.api";
import Toast from "../../components/Toast/Toast";
import Loading from "../../components/Loading/Loading";

// --- HELPER FORMATTER ---
const formatTime = (isoString: string) => {
  if (!isoString) return "--:--";
  return new Date(isoString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTableNumber = (raw?: string) => {
  if (!raw) return "Takeaway";
  if (
    raw.toLowerCase().includes("takeaway") ||
    raw.toLowerCase().includes("tanpa")
  ) {
    return "Takeaway";
  }
 const match = raw.match(/\d+/);
  if (match) {
    return `Meja ${match[0]}`;
  }
  return `Meja ${raw}`;
};

const WaiterOrderListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus>("DIMASAK");

  const { firstName, roleName } = useProfile();

  // STATE DATA API
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // STATE BARU UNTUK MENAMPUNG ID PESANAN YANG AKAN DISELESAIKAN
  const [orderToFinish, setOrderToFinish] = useState<string | null>(
    null,
  );

  // STATES TOAST
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

  // --- 1. FETCH DATA DARI API ---
  const fetchOrders = async () => {
    try {
      // Tentukan status mana yang ditarik berdasarkan Tab
      let statusesToFetch: string[] = [];
      if (activeTab === "DIMASAK") {
        statusesToFetch = ["VALIDATED", "COOKING"];
      } else if (activeTab === "SIAP") {
        statusesToFetch = ["READY"];
      }

      // Hit API secara paralel untuk mencegah Error 400
      const responses = await Promise.all(
        statusesToFetch.map((status) =>
          orderAPI
            .getOrdersByStatus(status)
            .catch(() => ({ success: false, data: [] })),
        ),
      );

      // Gabungkan data dari semua respons yang sukses
      let combinedData: any[] = [];
      responses.forEach((res) => {
        if (res.success && res.data) {
          combinedData = [...combinedData, ...res.data];
        }
      });

      if (combinedData.length > 0) {
        const mappedOrders = combinedData.map((o: any) => {
          const mappedItems =
            o.items?.map((i: any) => ({
              qty: i.quantity,
              name: i.menu_name,
              note: i.notes === "Tidak ada" ? "" : i.notes,
            })) || [];

          return {
            rawId: o.order_id,
            orderId: `#${o.order_id}`,
            tableName: formatTableNumber(o.table_number),
            time: formatTime(o.timeStamp),
            status: activeTab, // Tampilkan sesuai nama Tab
            totalPrice: Number(o.grand_total_amount || 0),
            items: mappedItems,
          };
        });

        // Urutkan waktu ascending agar yang paling lama dipesan muncul di atas
        mappedOrders.sort((a, b) => a.time.localeCompare(b.time));
        setOrdersList(mappedOrders);
      } else {
        setOrdersList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      setOrdersList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling Real-time setiap 5 detik, trigger juga jika tab berubah
  useEffect(() => {
    setIsLoading(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Filter Data berdasarkan Search (Meja) dan Tab Status
  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) =>
      order.tableName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, ordersList]);

  const handleConfirmFinish = async () => {
    if (!orderToFinish) return;

    try {
      setIsSubmitting(true);

      // Hit API PATCH /order/:id/completed
      const response = await orderAPI.setOrderCompleted(orderToFinish);

      if (response.success) {
        triggerToast("Pesanan berhasil diselesaikan!", "success");
        fetchOrders(); // Tarik data terbaru untuk menghilangkan kartu dari daftar
      } else {
        triggerToast("Gagal menyelesaikan pesanan", "error");
      }
    } catch (error: any) {
      console.error("Error validasi:", error);
      triggerToast(
        error.response?.data?.message || "Terjadi kesalahan jaringan",
        "error",
      );
    } finally {
      setIsSubmitting(false);
      setOrderToFinish(null); // Tutup modal
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER */}
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0">
        <DashboardHeader
          title="Daftar Pesanan"
          subtitle="Pantau aktivitas pesanan dan layanan meja"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-0 lg:pb-0 px-4 lg:px-8 flex flex-col flex-1 min-h-0">
        {/* 2. SEARCH BAR */}
        <div className="relative mb-3 shrink-0 max-w-110">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-black/50" />
          </div>
          <Input
            type="text"
            className="w-full pl-11 pr-4 py-2 text-[14.5px] rounded-sm border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-black/50 shadow-sm"
            placeholder="Cari nomor meja"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 3. TAB FILTER (Custom Styling sesuai Figma) */}
        <div className="flex flex-col md:flex-row gap-5 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab("DIMASAK")}
            className={cn(
              `px-3 py-2 rounded-sm font-bold text-[14px] transition-all border ${
                activeTab === "DIMASAK"
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-transparent text-primary border-primary hover:bg-primary/5"
              }`,
            )}
          >
            Pesanan Dimasak
          </button>
          <button
            onClick={() => setActiveTab("SIAP")}
            className={cn(
              `px-11 py-2 rounded-sm font-bold text-[14px] transition-all border-[1.5px] ${
                activeTab === "SIAP"
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-transparent text-primary border-primary hover:bg-primary/5"
              }`,
            )}
          >
            Siap Saji
          </button>
        </div>

        {/* 4. GRID KARTU (Scrollable area) */}
        <div className="flex-1 pb-4 pr-1 lg:mr-16">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-primary">
              <span className="font-bold text-[14px]">
                Memuat data pesanan...
              </span>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <WaiterOrderListCard
                  key={order.rawId}
                  orderId={order.orderId}
                  tableName={order.tableName}
                  time={order.time}
                  status={order.status}
                  items={order.items}
                  totalPrice={order.totalPrice}
                  onViewDetail={() => setSelectedOrder(order)}
                  onFinish={() => setOrderToFinish(order.rawId)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <p>Tidak ada pesanan untuk kategori ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. RENDER MODAL DETAIL */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          orderId={selectedOrder.orderId}
          tableName={selectedOrder.tableName}
          time={selectedOrder.time}
          items={selectedOrder.items}
        />
      )}

      {/* 6. RENDER MODAL KONFIRMASI SELESAI */}
      <ConfirmFinishModal
        isOpen={!!orderToFinish}
        onClose={() => setOrderToFinish(null)}
        onConfirm={handleConfirmFinish}
      />

      <Loading show={isSubmitting} message="Menyelesaikan pesanan..." />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default WaiterOrderListPage;
