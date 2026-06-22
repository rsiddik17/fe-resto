import { useEffect, useState } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import KitchenFilterTabs, {
  type OrderStatus,
} from "../../components/Filter/KitchenFilterTabs";
import KitchenOrderCard, {
  type OrderDetail,
} from "../../components/Card/KitchenOrderCard";
import OrderDetailModal from "../../components/Modal/OrderDetailModal";
import OrderActionConfirmModal from "../../components/Modal/OrderActionConfirmModal";
import { useProfile } from "../../hooks/useProfile";
import { orderAPI } from "../../api/order.api";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";

// --- FORMATTER HELPER ---
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
  )
    return "Takeaway";
  const match = raw.match(/\d+/);
  if (match) {
    return `Meja ${match[0]}`;
  }
  return `Meja ${raw}`;
};

const KitchenOrderListPage = () => {
  const { firstName, roleName } = useProfile();

  const [activeTab, setActiveTab] = useState<OrderStatus>("MASUK");
  const [ordersList, setOrdersList] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STATES UNTUK MODAL DETAIL
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<OrderDetail | null>(null);

  // STATES UNTUK MODAL KONFIRMASI AKSI (Mulai Masak / Selesai)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedOrderAction, setSelectedOrderAction] =
    useState<OrderDetail | null>(null);

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
      // PERBAIKAN: Petakan tab aktif ke status Backend
      let targetStatus = "VALIDATED";
      if (activeTab === "MEMASAK") targetStatus = "COOKING";
      if (activeTab === "SIAP_SAJI") targetStatus = "READY";

      // Kirim targetStatus ke API agar tidak kena Error 400
      const response = await orderAPI.getOrdersByStatus(targetStatus);

      if (response.success && response.data) {
        const kitchenOrders = response.data.map((o: any) => {
          // Mapping Status BE ke Tab UI Dapur
          let mappedStatus: OrderStatus = "MASUK";
          if (o.status === "COOKING") mappedStatus = "MEMASAK";
          if (o.status === "READY") mappedStatus = "SIAP_SAJI";

          const mappedItems =
            o.items?.map((i: any) => ({
              qty: i.quantity,
              name: i.menu_name,
              note: i.notes === "Tidak ada" ? "" : i.notes,
            })) || [];
          
          // Amankan pembacaan tanggal dari properti lowercase maupun uppercase pascal
          const orderDate = o.timestamp || o.timeStamp;

          return {
            id: `#${o.order_id}`,
            rawId: o.order_id, // ID Mentah untuk dikirim ke API aksi
            type: o.order_type === "DELIVERY" ? "Delivery" : "Dine in",
            table: formatTableNumber(o.table_number),
            time: formatTime(orderDate),
            status: mappedStatus,
            items: mappedItems,
          };
        });

        setOrdersList(kitchenOrders);
      } else {
        setOrdersList([]); // Kosongkan jika respon API bilang tidak ada data
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan dapur:", error);
      // Agar UI tidak nyangkut saat error/kosong
      setOrdersList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time polling
  useEffect(() => {
    setIsLoading(true); // Tampilkan loading sebentar saat pindah tab
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [activeTab]);

  // --- PERBAIKAN LOGIKA SORTING (LOCKED & STABLE) ---
  // Urutkan secara numerik berdasarkan rawId (ID Pesanan).
  // Pesanan paling lama (ID paling kecil) dijamin akan selalu terkunci di sebelah kiri!
  const filteredOrders = ordersList
    .filter((o) => o.status === activeTab)
    .sort((a, b) => Number(a.rawId) - Number(b.rawId));

  // HANDLER KLIK TOMBOL
  const handleOpenDetail = (order: OrderDetail) => {
    setSelectedOrderDetail(order);
    setIsDetailModalOpen(true);
  };

  const handleOpenAction = (order: OrderDetail) => {
    setSelectedOrderAction(order);
    setIsActionModalOpen(true);
  };

  // LOGIKA AJAIB PINDAH TAB
  const handleConfirmAction = async () => {
    if (!selectedOrderAction) return;

    setIsSubmitting(true);
    setIsActionModalOpen(false);

    try {
      // 1. Jika MASUK -> Ubah ke COOKING
      if (selectedOrderAction.status === "MASUK") {
        await orderAPI.startCooking(selectedOrderAction.rawId);
        triggerToast("Pesanan mulai dimasak!", "success");
      }
      // 2. Jika MEMASAK -> Ubah ke READY
      else if (selectedOrderAction.status === "MEMASAK") {
        await orderAPI.setOrderReady(selectedOrderAction.rawId);
        triggerToast("Pesanan siap disajikan!", "success");
      }

      // Ambil ulang data segar
      fetchOrders();
    } catch (error: any) {
      console.error("Gagal mengubah status pesanan:", error);
      triggerToast(
        error.response?.data?.message || "Gagal mengubah status",
        "error",
      );
    } finally {
      setSelectedOrderAction(null);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0 shrink-0">
        <DashboardHeader
          title="Daftar Pesanan"
          subtitle="Pantau pesanan dan status masakan"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-6 lg:pb-6 px-4 lg:px-8 flex-1 flex flex-col">
        {/* COMPONENT BUTTON TABS */}
        <KitchenFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary">
              <span className="font-bold">Memuat pesanan dapur...</span>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start pr-2">
              {filteredOrders.map((order) => (
                <KitchenOrderCard
                  key={order.rawId}
                  order={order}
                  onDetailClick={() => handleOpenDetail(order)}
                  onActionClick={() => handleOpenAction(order)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 text-[15px] bg-white rounded-md border border-gray-100 border-dashed">
              Tidak ada pesanan di kategori ini.
            </div>
          )}
        </div>
      </div>

      {/* RENDER MODAL DETAIL (Jika ada order yang di-select) */}
      {selectedOrderDetail && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          orderId={selectedOrderDetail.id}
          tableName={selectedOrderDetail.table || selectedOrderDetail.type}
          time={selectedOrderDetail.time}
          // SOLUSI ERROR TYPESCRIPT: Gunakan "as any" untuk melempar data tanpa merusak tipe Waiter
          items={selectedOrderDetail.items as any}
        />
      )}

      {/* RENDER MODAL KONFIRMASI (Jika ada order yang di-select) */}
      {selectedOrderAction && (
        <OrderActionConfirmModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          onConfirm={handleConfirmAction}
          orderId={selectedOrderAction.id}
          actionType={selectedOrderAction.status as "MASUK" | "MEMASAK"}
        />
      )}

      <Loading show={isSubmitting} message="Memperbarui status..." />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
};

export default KitchenOrderListPage;
