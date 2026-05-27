import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import WaiterOrderListCard, {
  type OrderStatus,
} from "../../components/Card/WaiterOrderListCard";
import OrderDetailModal from "../../components/Modal/OrderDetailModal";
import ConfirmFinishModal from "../../components/Modal/ConfirmFinishModal";
import { cn } from "../../utils/utils";
import { useNavigate } from "react-router";
import { useProfile } from "../../hooks/useProfile";

// --- MOCK DATA SEMENTARA ---
// Nanti ini diganti dengan data asli dari Backend menggunakan React Query
const MOCK_ORDERS = [
  {
    orderId: "#260401123",
    tableName: "Meja 12",
    time: "20:10",
    status: "DIMASAK" as OrderStatus,
    totalPrice: 132123,
    items: [
      { name: "Ayam Penyet", qty: 1, note: "Tidak ada" },
      { name: "Matcha Latte", qty: 2, note: "1 Less Sugar" },
      { name: "Es Teler", qty: 1, note: "Tidak ada" },
    ],
  },
  {
    orderId: "#260401122",
    tableName: "Meja 02",
    time: "20:00",
    status: "DIMASAK" as OrderStatus,
    totalPrice: 110122,
    items: [
      { name: "Ayam Penyet", qty: 1, note: "Pedes bang" },
      { name: "Matcha Latte", qty: 2, note: "Normal" },
    ],
  },
  {
    orderId: "#260402211",
    tableName: "Meja 03",
    time: "21:00",
    status: "DIMASAK" as OrderStatus,
    totalPrice: 110111,
    items: [
      { name: "Ayam", qty: 1, note: "Pedes bang" },
      { name: "Matcha Choco", qty: 2, note: "Normal" },
    ],
  },
  {
    orderId: "#260402222",
    tableName: "Meja 04",
    time: "21:00",
    status: "DIMASAK" as OrderStatus,
    totalPrice: 110111,
    items: [
      { name: "Ayam", qty: 1, note: "Asin bang" },
      { name: "Choco", qty: 2, note: "Normal" },
    ],
  },
  {
    orderId: "#260401120",
    tableName: "Meja 09",
    time: "19:50",
    status: "SIAP" as OrderStatus,
    totalPrice: 99120,
    items: [
      { name: "Nasi Goreng", qty: 1, note: "Gak pake sayur" },
      { name: "Lychee Tea", qty: 2, note: "Es dipisah" },
      { name: "Sate Ayam", qty: 1, note: "Bumbu kacang banyak" },
    ],
  },
  {
    orderId: "#260401121",
    tableName: "Meja 11",
    time: "20:00",
    status: "SIAP" as OrderStatus,
    totalPrice: 110121,
    items: [
      { name: "Soto Ayam", qty: 1, note: "Tidak ada" },
      { name: "Lemon Tea", qty: 2, note: "Tidak ada" },
      { name: "Tahu Isi", qty: 3, note: "Minta cabe rawit" },
    ],
  },
];

const WaiterOrderListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus>("DIMASAK");
  const navigate = useNavigate();
  const { firstName, roleName } = useProfile();

  // State untuk Modal
  const [selectedOrder, setSelectedOrder] = useState<
    (typeof MOCK_ORDERS)[0] | null
  >(null);

  // STATE BARU UNTUK MENAMPUNG ID PESANAN YANG AKAN DISELESAIKAN
  const [orderToFinish, setOrderToFinish] = useState<string | null>(null);

  // Filter Data berdasarkan Search (Meja) dan Tab Status
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const matchStatus = order.status === activeTab;
      const matchSearch = order.tableName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [searchQuery, activeTab]);

  const handleConfirmFinish = () => {
    navigate("/waiter/dashboard");

    // Tutup modal
    setOrderToFinish(null);
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
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <WaiterOrderListCard
                  key={order.orderId}
                  orderId={order.orderId}
                  tableName={order.tableName}
                  time={order.time}
                  status={order.status}
                  items={order.items}
                  totalPrice={order.totalPrice}
                  onViewDetail={() => setSelectedOrder(order)}
                  onFinish={() => setOrderToFinish(order.orderId)}
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
    </div>
  );
};

export default WaiterOrderListPage;
