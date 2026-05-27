import { useState, useMemo } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";

// Komponen
import CashierOrderCard from "../../components/Card/CashierOrderCard";
import OrderDetailModal from "../../components/Modal/OrderDetailModal"; // <--- Import Modal buatanmu!
import OrderFilter from "../../components/Filter/OrderFilter";
import Button from "../../components/ui/Button";
import CreateOrderIcon from "../../components/Icon/CreateOrderIcon";
import { useNavigate } from "react-router";
import { useProfile } from "../../hooks/useProfile";

// 1. FUNGSI PENERJEMAH WARNA BADGE DARI FRONTEND
const getBadgeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case "ONLINE":
      return "bg-[#BA68C8]"; // Ungu Muda
    case "KIOSK":
      return "bg-[#2196F3]"; // Biru
    case "QR":
      return "bg-[#1AE91D]"; // Hijau Terang
    case "WAITER":
      return "bg-[#F35B28]"; // Orange
    case "DIMASAK":
      return "bg-[#FF9100]"; // Orange/Kuning Tua
    case "SIAP SAJI":
      return "bg-[#8AC926]"; // Hijau Muda (Kekuningan)
    case "SELESAI":
      return "bg-[#90EB00]"; // Hijau
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

// --- RAW MOCK DATA (Simulasi Data Mentah dari Backend) ---
// Perhatikan: rawLeftBadges dan rawRightBadges sekarang hanya berisi Array of String!
const RAW_MOCK_ORDERS = [
  // ================= 1. MENUNGGU VALIDASI =================
  {
    id: "ord-1",
    orderId: "#26040599",
    time: "12:50",
    title: null,
    statusFilter: "Menunggu Validasi",
    rawLeftBadges: ["ONLINE", "Delivery"],
    rawRightBadges: [],
    items: [
      { name: "Kwetiau Goreng", qty: 1, note: "Pedas", price: 25000 },
      { name: "Mie Ayam Bakso", qty: 1, note: "Tidak ada", price: 22000 },
      { name: "Es Teh", qty: 2, price: 5000 },
      { name: "Kerupuk", qty: 1, price: 3000 },
    ],
    total: 60000,
  },
  {
    id: "ord-6",
    orderId: "#26040577",
    time: "13:50",
    title: null,
    statusFilter: "Menunggu Validasi",
    rawLeftBadges: ["ONLINE", "Delivery"],
    rawRightBadges: [],
    items: [
      { name: "Kwetiau Goreng", qty: 1, note: "Pedas", price: 25000 },
      { name: "Mie Ayam Bakso", qty: 1, note: "Tidak ada", price: 22000 },
    ],
    total: 47000,
  },
  {
    id: "ord-2",
    orderId: "#260405100",
    time: "13:01",
    title: "Meja 02",
    statusFilter: "Menunggu Validasi",
    rawLeftBadges: ["KIOSK"],
    rawRightBadges: ["Dine in"],
    items: [
      { name: "Soto Ayam", qty: 1, note: "Tidak ada", price: 20000 },
      { name: "Lemon Tea", qty: 2, note: "Tidak ada", price: 8000 },
      { name: "Nasi Putih", qty: 1, price: 5000 },
    ],
    total: 41000,
  },
  {
    id: "ord-5",
    orderId: "#260405111",
    time: "14:01",
    title: "Meja 03",
    statusFilter: "Menunggu Validasi",
    rawLeftBadges: ["KIOSK"],
    rawRightBadges: ["Dine in"],
    items: [
      { name: "Soto Bakar", qty: 1, note: "Tidak ada", price: 28000 },
      { name: "Lemon Leci", qty: 2, note: "Tidak ada", price: 12000 },
    ],
    total: 52000,
  },

  // TAMBAHAN MOCK: QR (Menunggu Validasi)
  {
    id: "ord-qr-1",
    orderId: "#260405115",
    time: "14:15",
    title: "Meja 08",
    statusFilter: "Menunggu Validasi",
    rawLeftBadges: ["QR"],
    rawRightBadges: ["Dine in"],
    items: [
      { name: "Ayam Bakar", qty: 2, note: "Paha semua", price: 25000 },
      { name: "Es Teh Manis", qty: 2, note: "Tidak ada", price: 5000 },
    ],
    total: 60000,
  },

  // ================= 2. SEDANG DIPROSES =================
  {
    id: "ord-3",
    orderId: "#26040595",
    time: "10:30",
    title: null,
    statusFilter: "Sedang diproses",
    rawLeftBadges: ["ONLINE", "Delivery"],
    rawRightBadges: ["Siap Saji"],
    items: [
      { name: "Kwetiau Goreng", qty: 1, note: "Pedas", price: 25000 },
      { name: "Jus Mangga", qty: 1, note: "Tidak ada", price: 15000 },
    ],
    total: 40000,
  },
  {
    id: "ord-4",
    orderId: "#26040597",
    time: "10:49",
    title: "Meja 06",
    statusFilter: "Sedang diproses",
    rawLeftBadges: ["KIOSK"],
    rawRightBadges: ["Dine in", "Dimasak"],
    items: [
      { name: "Soto Ayam", qty: 1, note: "Tidak ada", price: 20000 },
      { name: "Lemon Tea", qty: 2, note: "Tidak ada", price: 8000 },
      { name: "Es Jeruk", qty: 1, price: 7000 },
    ],
    total: 43000,
  },

  // TAMBAHAN MOCK: WAITER (Sedang Diproses)
  {
    id: "ord-waiter-1",
    orderId: "#26040602",
    time: "11:05",
    title: "Meja 12",
    statusFilter: "Sedang diproses",
    rawLeftBadges: ["WAITER"],
    rawRightBadges: ["Dine in", "Dimasak"],
    items: [
      {
        name: "Nasi Goreng Seafood",
        qty: 1,
        note: "Pedas Sedang",
        price: 35000,
      },
      { name: "Jus Alpukat", qty: 1, note: "Tidak ada", price: 10000 },
    ],
    total: 45000,
  },

  // ================= 3. SELESAI =================
  {
    id: "ord-5-selesai",
    orderId: "#26040591",
    time: "09:30",
    title: null,
    statusFilter: "Selesai",
    rawLeftBadges: ["ONLINE", "Delivery"],
    rawRightBadges: ["Selesai"],
    items: [
      { name: "Kwetiau Goreng", qty: 1, note: "Pedas", price: 35000 },
      { name: "Jus Jambu", qty: 1, note: "Tidak ada", price: 12000 },
    ],
    total: 47000,
  },

  // TAMBAHAN MOCK: QR (Selesai)
  {
    id: "ord-qr-2",
    orderId: "#26040650",
    time: "09:45",
    title: "Meja 05",
    statusFilter: "Selesai",
    rawLeftBadges: ["QR"],
    rawRightBadges: ["Dine in", "Selesai"],
    items: [
      { name: "Bakso Urat", qty: 2, note: "1 ga pake sayur", price: 20000 },
    ],
    total: 40000,
  },

  // ================= 4. DIBATALKAN =================
  {
    id: "ord-6-batal",
    orderId: "#260405941",
    time: "09:30",
    title: null,
    statusFilter: "Dibatalkan",
    rawLeftBadges: ["ONLINE", "Delivery"],
    rawRightBadges: ["Dibatalkan"],
    items: [
      { name: "Kwetiau Goreng", qty: 1, note: "Pedas", price: 25000 },
      { name: "Jus Jambu", qty: 1, note: "Tidak ada", price: 12000 },
    ],
    total: 37000,
  },
];

const FILTERS = [
  "Menunggu Validasi",
  "Sedang diproses",
  "Selesai",
  "Dibatalkan",
];

const CashierOrderListPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Menunggu Validasi");

  // State untuk Modal Detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Filter Data
  const filteredOrders = useMemo(() => {
    return (
      RAW_MOCK_ORDERS
        // Filter tab aktif
        .filter((order) => order.statusFilter === activeFilter)
        // Sort berdasarkan waktu terawal
        .sort((a, b) => a.time.localeCompare(b.time))
        // Mapping warna menggunakan fungsi getBadgeColor
        .map((order) => ({
          ...order,
          leftBadges: order.rawLeftBadges.map((text) => ({
            text: text,
            colorClass: getBadgeColor(text),
          })),
          rightBadges: order.rawRightBadges.map((text) => ({
            text: text,
            colorClass: getBadgeColor(text),
          })),
        }))
    );
  }, [activeFilter]);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const { firstName, roleName } = useProfile();

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
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <CashierOrderCard
                key={order.id}
                orderId={order.orderId}
                time={order.time}
                title={order.title || undefined}
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
            <div className="col-span-full py-10 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200 border-dashed">
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
