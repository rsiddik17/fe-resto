import { useState, useEffect } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";

// Komponen
import CashierOrderCard from "../../components/Card/CashierOrderCard";
import OrderDetailModal from "../../components/Modal/OrderDetailModal"; // <--- Import Modal buatanmu!
import OrderFilter from "../../components/Filter/OrderFilter";
import Button from "../../components/ui/Button";
import CreateOrderIcon from "../../components/Icon/CreateOrderIcon";
import { useNavigate } from "react-router";
import { useProfile } from "../../hooks/useProfile";
import { orderAPI } from "../../api/order.api";

// 1. FUNGSI PENERJEMAH WARNA BADGE DARI FRONTEND
const getBadgeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case "ONLINE":
      return "bg-[#BA68C8]"; // Ungu Muda
    case "KIOSK":
      return "bg-[#2196F3]"; // Biru
    case "QR_SCAN":
    case "QR":
      return "bg-[#1AE91D]"; // Hijau Terang
    case "WAITER":
      return "bg-[#F35B28]"; // Orange
    case "CASHIER":
      return "bg-[#F35B28]";
    case "PENDING":
      return "bg-yellow-400";
    case "VALIDATED":
    case "DIMASAK":
      return "bg-[#FF9100]"; // Orange/Kuning Tua
    case "READY":
    case "SIAP SAJI":
      return "bg-[#8AC926]"; // Hijau Muda (Kekuningan)
    case "COMPLETED":
    case "SELESAI":
      return "bg-[#90EB00]"; // Hijau
    case "CANCELLED":
    case "DIBATALKAN":
      return "bg-[#73736C]"; // Abu-abu
    case "DELIVERY":
      return "bg-primary"; // Ungu Tua
    case "DINE IN":
      return "bg-primary"; // Ungu Tua
    default:
      return "bg-gray-500";
  }
};

const FILTERS = [
  "Menunggu Validasi",
  "Sedang diproses",
  "Selesai",
  "Dibatalkan",
];

// --- 2. FORMATTER ---
const formatTime = (isoString: string) => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString("id-ID", {
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
  const match = raw.match(/M(\d+)(_i|_o)?/i);
  if (match) {
    const num = match[1];
    const suffix =
      match[2]?.toLowerCase() === "_i"
        ? "_indoor"
        : match[2]?.toLowerCase() === "_o"
          ? "_outdoor"
          : "";
    return `Meja ${num}${suffix}`;
  }
  return `Meja ${raw}`;
};

const CashierOrderListPage = () => {
  const navigate = useNavigate();
  const { firstName, roleName } = useProfile();

  const [activeFilter, setActiveFilter] = useState("Menunggu Validasi");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // --- 1. FETCH DATA DARI API ---
  const fetchAllOrders = async () => {
    try {
      let statusesToFetch: string[] = [];

      // Tentukan status BE apa saja yang mau ditarik berdasarkan Tab aktif
      if (activeFilter === "Menunggu Validasi") {
        statusesToFetch = ["PENDING"];
      } else if (activeFilter === "Selesai") {
        statusesToFetch = ["COMPLETED"];
      } else if (activeFilter === "Dibatalkan") {
        statusesToFetch = ["CANCELLED"];
      } else if (activeFilter === "Sedang diproses") {
        // Tab ini butuh 3 status sekaligus (Masak, Dapur sedang masak, Siap Saji)
        statusesToFetch = ["VALIDATED", "COOKING", "READY"];
      }

      // Tarik API secara paralel sesuai status yang dibutuhkan
      const responses = await Promise.all(
        statusesToFetch.map((status) =>
          orderAPI
            .getOrdersByStatus(status)
            .catch(() => ({ success: false, data: [] })),
        ),
      );

      // Gabungkan data pesanan dari respons yang sukses
      let combinedData: any[] = [];
      responses.forEach((res) => {
        if (res.success && res.data) {
          combinedData = [...combinedData, ...res.data];
        }
      });

      if (combinedData.length > 0) {
        // Mapping Data ke Bentuk UI
        const mappedOrders = combinedData
          .sort(
            (a, b) =>
              new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime(),
          )
          .map((order) => {
            // Tentukan teks Badge Kanan sesuai status operasional UI
            let statusText = order.status;
            if (order.status === "VALIDATED" || order.status === "COOKING")
              statusText = "Dimasak";
            if (order.status === "READY") statusText = "Siap Saji";
            if (order.status === "COMPLETED") statusText = "Selesai";
            if (order.status === "CANCELLED") statusText = "Dibatalkan";

            const leftBadges = [
              { text: order.source, colorClass: getBadgeColor(order.source) },
            ];

            const rightBadges = [
              {
                text: order.order_type || "DINE IN",
                colorClass: getBadgeColor(order.order_type || "DINE IN"),
              },
              { text: statusText, colorClass: getBadgeColor(statusText) }, // Kirim text yang sudah dilocalize
            ];

            const mappedItems =
              order.items?.map((item: any) => ({
                name: item.menu_name,
                qty: item.quantity,
                note: item.notes === "Tidak ada" ? "" : item.notes,
              })) || [];

            return {
              id: order.order_id,
              orderId: `#${order.order_id}`,
              time: formatTime(order.timeStamp),
              title: formatTableNumber(order.table_number),
              total: Number(order.grand_total_amount || 0),
              leftBadges,
              rightBadges,
              items: mappedItems,
            };
          });

        setOrders(mappedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar pesanan:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAllOrders();
    // Real-time Polling setiap 3 detik
    const interval = setInterval(fetchAllOrders, 3000);
    return () => clearInterval(interval);
  }, [activeFilter]);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0">
        <DashboardHeader
          title="Daftar Pesanan"
          subtitle="Ringkasan data pesanan dan aktivitas restoran"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-6 lg:pb-6 px-4 lg:px-8">
        <div className="mb-4">
          <Button
            onClick={() => navigate("/cashier/order-list/create-order")}
            className="bg-white w-full md:w-62.5 text-primary text-center border-none shadow-sm rounded-md px-6 py-2.5 font-bold flex justify-center items-center gap-1 hover:bg-gray-50 transition-colors"
          >
            {/* Icon Plus Ungu */}
            <CreateOrderIcon className="w-6.5 h-6.5" strokeWidth={3} />
            Buat Pesanan
          </Button>
        </div>

        {/* ROW FILTER BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-5">
          {FILTERS.map((filter) => (
            <OrderFilter
              key={filter}
              label={filter}
              isActive={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>

        {/* GRID CARD PESANAN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-x-6 md:gap-y-5 items-stretch">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-primary font-medium bg-white rounded-xl border border-gray-100">
              <span>Memuat antrean pesanan...</span>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <CashierOrderCard
                key={order.id}
                orderId={order.orderId}
                time={order.time}
                title={order.title}
                leftBadges={order.leftBadges}
                rightBadges={order.rightBadges}
                items={order.items}
                total={order.total}
                isAwaitingValidation={activeFilter === "Menunggu Validasi"}
                onViewDetail={() => handleOpenDetail(order)}
                onValidate={() =>
                  navigate(`/cashier/order-list/payment-validation`, {
                    state: { dataOrder: order },
                  })
                }
              />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-[15px] text-gray-400 font-medium bg-white rounded-xl border border-gray-200 border-dashed">
              Tidak ada pesanan di kategori "{activeFilter}"
            </div>
          )}
        </div>
      </div>

      {/* MODAL DETAIL PESANAN */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderId={selectedOrder.orderId}
          tableName={selectedOrder.title || "ONLINE"} // Fallback jika tidak ada meja
          time={selectedOrder.time}
          items={selectedOrder.items}
        />
      )}
    </>
  );
};

export default CashierOrderListPage;
