import { useState } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import KitchenFilterTabs, { type OrderStatus } from "../../components/Filter/KitchenFilterTabs";
import KitchenOrderCard, { type OrderDetail } from "../../components/Card/KitchenOrderCard";
import OrderDetailModal from "../../components/Modal/OrderDetailModal";
import OrderActionConfirmModal from "../../components/Modal/OrderActionConfirmModal";

// --- MOCK DATA LENGKAP ---
const MOCK_ORDERS: OrderDetail[] = [
  // === PESANAN MASUK ===
  { id: "#ORD-124", type: "Delivery", time: "12:45", status: "MASUK", items: [{ qty: 1, name: "Nasi Goreng" }, { qty: 2, name: "Bakso Urat" }] },
  { id: "#ORD-125", type: "Dine in", table: "Meja 12", time: "12:50", status: "MASUK", items: [{ qty: 1, name: "Es Teler" }, { qty: 2, name: "Bakso Urat" }, { qty: 1, name: "Lychee Tea" }, { qty: 3, name: "Dimsum" }, { qty: 1, name: "Lemon Tea" }] },
  { id: "#ORD-126", type: "Dine in", table: "Meja 13", time: "12:55", status: "MASUK", items: [{ qty: 1, name: "Kwetiau Goreng" }, { qty: 2, name: "Nasi Goreng" }, { qty: 1, name: "Lychee Tea" }, { qty: 3, name: "Air Mineral" }, { qty: 1, name: "Lemon Tea" }, { qty: 1, name: "Roti Bakar" }, { qty: 1, name: "Matcha Latte" }, { qty: 2, name: "Es Jeruk" }, { qty: 2, name: "Es Cincau" }, { qty: 2, name: "Es Kelapa" }] },
  { id: "#ORD-127", type: "Delivery", time: "12:56", status: "MASUK", items: [{ qty: 1, name: "Nasi Goreng" }, { qty: 2, name: "Bakso Urat" }, { qty: 2, name: "Es Teler" }, { qty: 1, name: "Nasi Liwet" }] },
  { id: "#ORD-128", type: "Dine in", table: "Meja 02", time: "12:58", status: "MASUK", items: [{ qty: 1, name: "Kwetiau Goreng" }, { qty: 2, name: "Nasi Goreng" }, { qty: 3, name: "Lychee Tea" }, { qty: 3, name: "Air Mineral" }, { qty: 1, name: "Soto Ayam" }, { qty: 1, name: "Nasi Liwet" }] },
  { id: "#ORD-129", type: "Delivery", time: "13:00", status: "MASUK", items: [{ qty: 1, name: "Dimsum" }, { qty: 2, name: "Mie Ayam Bakso" }, { qty: 2, name: "Es Teler" }, { qty: 3, name: "Lemon Tea" }] },
  { id: "#ORD-130", type: "Dine in", table: "Meja 07", time: "13:03", status: "MASUK", items: [{ qty: 1, name: "Kwetiau Goreng" }, { qty: 2, name: "Nasi Goreng" }, { qty: 3, name: "Lychee Tea" }, { qty: 3, name: "Air Mineral" }, { qty: 1, name: "Soto Ayam" }, { qty: 1, name: "Nasi Liwet" }] },
  { id: "#ORD-131", type: "Delivery", time: "13:05", status: "MASUK", items: [{ qty: 1, name: "Nasi Goreng" }, { qty: 2, name: "Bakso Urat" }, { qty: 3, name: "Lemon Tea" }] },
  { id: "#ORD-132", type: "Dine in", table: "Meja 08", time: "13:07", status: "MASUK", items: [{ qty: 1, name: "Nasi Goreng Kambing", note: "Tidak Pedas" }, { qty: 2, name: "Es Teler" }, { qty: 1, name: "Ayam Penyet" }, { qty: 1, name: "Mie Ayam Bakso" }, { qty: 1, name: "Lemon Tea" }, { qty: 1, name: "Roti Bakar", note: "Bakar tipis" }, { qty: 1, name: "Nasi Bakar", note: "Bakar tipis" }, { qty: 2, name: "Es Jeruk", note: "Bakar tipis" }] },
  { id: "#ORD-133", type: "Delivery", time: "13:10", status: "MASUK", items: [{ qty: 1, name: "Dimsum" }, { qty: 2, name: "Mie Ayam Bakso" }, { qty: 2, name: "Es Teler" }] },
  { id: "#ORD-134", type: "Dine in", table: "Meja 04", time: "13:12", status: "MASUK", items: [{ qty: 1, name: "Kwetiau Goreng" }, { qty: 2, name: "Nasi Goreng" }, { qty: 3, name: "Lychee Tea" }, { qty: 3, name: "Air Mineral" }, { qty: 1, name: "Soto Ayam" }] },
  { id: "#ORD-135", type: "Dine in", table: "Meja 06", time: "13:20", status: "MASUK", items: [{ qty: 1, name: "Kwetiau Goreng" }, { qty: 2, name: "Nasi Goreng" }, { qty: 3, name: "Lychee Tea" }, { qty: 3, name: "Air Mineral" }] },

  // === MEMASAK ===
  { id: "#ORD-61", type: "Delivery", time: "10:49", status: "MEMASAK", items: [{ qty: 3, name: "Sop Iga" }, { qty: 1, name: "Bakso Urat" }, { qty: 4, name: "Le Mineral" }] },
  { id: "#ORD-60", type: "Dine in", table: "Meja 03", time: "10:55", status: "MEMASAK", items: [{ qty: 3, name: "Sop Iga" }, { qty: 1, name: "Bakso Urat" }, { qty: 4, name: "Le Mineral" }, { qty: 2, name: "Es Teler" }] },
  { id: "#ORD-59", type: "Dine in", table: "Meja 10", time: "11:00", status: "MEMASAK", items: [{ qty: 2, name: "Milkshake Stroberi" }, { qty: 2, name: "Cireng Bumbu Rujak" }, { qty: 2, name: "Roti Bakar" }] },
  { id: "#ORD-57", type: "Delivery", time: "11:20", status: "MEMASAK", items: [{ qty: 1, name: "Es Jeruk" }, { qty: 1, name: "Capcay" }, { qty: 2, name: "Dimsum" }, { qty: 2, name: "Kwetiau Goreng" }, { qty: 1, name: "Pempek" }, { qty: 2, name: "Es Kelapa Muda" }] },
  { id: "#ORD-56", type: "Dine in", table: "Meja 05", time: "11:25", status: "MEMASAK", items: [{ qty: 2, name: "Es Cincau" }, { qty: 1, name: "Kwetiau Goreng" }, { qty: 1, name: "Soto Ayam" }, { qty: 2, name: "Kopi Susu" }] },
  { id: "#ORD-55", type: "Dine in", table: "Meja 01", time: "11:30", status: "MEMASAK", items: [{ qty: 2, name: "Nasi Liwet" }, { qty: 2, name: "Lychee Tea" }] },
  { id: "#ORD-53", type: "Delivery", time: "11:45", status: "MEMASAK", items: [{ qty: 1, name: "Nasi Goreng" }, { qty: 2, name: "Bakso Urat" }, { qty: 3, name: "Dimsum" }] },
  { id: "#ORD-52", type: "Dine in", table: "Meja 15", time: "11:55", status: "MEMASAK", items: [{ qty: 1, name: "Es Teler" }, { qty: 2, name: "Bakso Urat" }, { qty: 1, name: "Lychee Tea" }, { qty: 1, name: "Lemon Tea" }] },
  { id: "#ORD-51", type: "Dine in", table: "Meja 16", time: "12:00", status: "MEMASAK", items: [{ qty: 1, name: "Kwetiau Goreng" }, { qty: 2, name: "Nasi Goreng" }, { qty: 1, name: "Lychee Tea" }, { qty: 3, name: "Air Mineral" }, { qty: 1, name: "Lemon Tea" }, { qty: 1, name: "Roti Bakar" }, { qty: 1, name: "Matcha Latte" }, { qty: 2, name: "Es Jeruk" }] },
  { id: "#ORD-58", type: "Delivery", time: "12:10", status: "MEMASAK", items: [{ qty: 1, name: "Es Jeruk" }, { qty: 1, name: "Capcay" }, { qty: 2, name: "Dimsum" }, { qty: 1, name: "Pempek" }] },
  { id: "#ORD-54", type: "Dine in", table: "Meja 13", time: "12:18", status: "MEMASAK", items: [{ qty: 2, name: "Milkshake Stroberi" }, { qty: 2, name: "Cireng Bumbu Rujak" }, { qty: 2, name: "Roti Bakar" }] },
  { id: "#ORD-50", type: "Delivery", time: "12:40", status: "MEMASAK", items: [{ qty: 1, name: "Nasi Goreng" }, { qty: 2, name: "Es Teler" }, { qty: 1, name: "Nasi Liwet" }] },

  // === SIAP SAJI ===
  { id: "#ORD-18", type: "Delivery", time: "08:25", status: "SIAP_SAJI", items: [{ qty: 1, name: "Es Teler" }, { qty: 2, name: "Mie Ayam Bakso" }, { qty: 2, name: "Nasi Bakar" }, { qty: 2, name: "Kwetiau Goreng" }, { qty: 3, name: "Es Kuwut" }] },
  { id: "#ORD-19", type: "Dine in", table: "Meja 08", time: "08:30", status: "SIAP_SAJI", items: [{ qty: 2, name: "Capcay" }, { qty: 2, name: "Nasi Bakar" }, { qty: 1, name: "Nasi Kuning" }, { qty: 4, name: "Lychee Tea" }, { qty: 1, name: "Matcha Latte" }, { qty: 1, name: "Le Mineral" }] },
  { id: "#ORD-20", type: "Delivery", time: "08:35", status: "SIAP_SAJI", items: [{ qty: 2, name: "Le Mineral" }, { qty: 1, name: "Gado-Gado" }, { qty: 1, name: "Nasi Goreng Udang" }, { qty: 1, name: "Jus Alpukat" }] },
  { id: "#ORD-21", type: "Dine in", table: "Meja 16", time: "08:40", status: "SIAP_SAJI", items: [{ qty: 1, name: "Nasi Kuning" }, { qty: 2, name: "Jus Jambu" }] },
  { id: "#ORD-22", type: "Delivery", time: "08:45", status: "SIAP_SAJI", items: [{ qty: 1, name: "Nasi Goreng Kambing" }, { qty: 1, name: "Sate Ayam" }, { qty: 1, name: "Bakso Urat" }, { qty: 2, name: "Lemon Tea" }] },
  { id: "#ORD-23", type: "Dine in", table: "Meja 17", time: "08:50", status: "SIAP_SAJI", items: [{ qty: 1, name: "Jus Stroberi" }, { qty: 2, name: "Jus Jambu" }] },
  { id: "#ORD-24", type: "Delivery", time: "08:57", status: "SIAP_SAJI", items: [{ qty: 1, name: "Dimsum" }, { qty: 2, name: "Cireng Bumbu Rujak" }, { qty: 2, name: "Pempek" }, { qty: 2, name: "Lemon Tea" }, { qty: 1, name: "Soto Ayam" }] },
  { id: "#ORD-25", type: "Delivery", time: "09:00", status: "SIAP_SAJI", items: [{ qty: 1, name: "Soto Ayam" }, { qty: 1, name: "Mie Ayam Bakso" }, { qty: 1, name: "Bakso Urat" }, { qty: 3, name: "Lemon Tea" }] },
  { id: "#ORD-26", type: "Dine in", table: "Meja 18", time: "09:06", status: "SIAP_SAJI", items: [{ qty: 1, name: "Roti Bakar Cokelat" }, { qty: 1, name: "Jus Alpukat" }] },
  { id: "#ORD-27", type: "Dine in", table: "Meja 09", time: "09:16", status: "SIAP_SAJI", items: [{ qty: 1, name: "Nasi Goreng Kambing" }, { qty: 1, name: "Jus Alpukat" }] },
  { id: "#ORD-28", type: "Delivery", time: "09:24", status: "SIAP_SAJI", items: [{ qty: 1, name: "Dimsum" }, { qty: 2, name: "Roti Bakar Cokelat" }, { qty: 2, name: "Pempek" }, { qty: 2, name: "Jus Mangga" }, { qty: 1, name: "Soto Ayam" }] },
  { id: "#ORD-29", type: "Dine in", table: "Meja 20", time: "09:30", status: "SIAP_SAJI", items: [{ qty: 1, name: "Roti Bakar Cokelat" }, { qty: 1, name: "Jus Alpukat" }] },
];

const KitchenOrderListPage = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("MASUK");
  
  // STATE BARU: Mengubah MOCK data menjadi state dinamis agar bisa pindah antar tab
  const [ordersList, setOrdersList] = useState<OrderDetail[]>(MOCK_ORDERS);

  // STATES UNTUK MODAL DETAIL
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null);

  // STATES UNTUK MODAL KONFIRMASI AKSI (Mulai Masak / Selesai)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedOrderAction, setSelectedOrderAction] = useState<OrderDetail | null>(null);
  
  // LOGIKA SORTING WAKTU TERAWAL (ASCENDING) DULUAN (Sekarang memfilter dari ordersList state)
  const filteredOrders = ordersList
    .filter((o) => o.status === activeTab)
    .sort((a, b) => a.time.localeCompare(b.time));

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
  const handleConfirmAction = () => {
    if (selectedOrderAction) {
      // Tentukan status selanjutnya
      const nextStatus: OrderStatus = selectedOrderAction.status === "MASUK" ? "MEMASAK" : "SIAP_SAJI";
      
      // Update state order dengan merubah status order yang dipilih
      setOrdersList((prevOrders) => 
        prevOrders.map((order) => 
          order.id === selectedOrderAction.id 
            ? { ...order, status: nextStatus } 
            : order
        )
      );
      
      // Tutup modal
      setIsActionModalOpen(false);
      setSelectedOrderAction(null);
    }
  };

  return (
    <>
      <div className="pt-7.5 pl-8 pr-6 shrink-0">
        <DashboardHeader
          title="Daftar Pesanan"
          subtitle="Pantau pesanan dan status masakan"
          userName="Mile"
          roleName="kitchen"
        />
      </div>

      <div className="pt-0 pb-6 px-8 flex-1 flex flex-col">
        
        {/* COMPONENT BUTTON TABS */}
        <KitchenFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start pr-2">
            
            {/* RENDER LIST KITCHEN ORDER CARD */}
            {filteredOrders.map((order) => (
              <KitchenOrderCard 
                key={order.id} 
                order={order}
                onDetailClick={() => handleOpenDetail(order)}
                onActionClick={() => handleOpenAction(order)}
              />
            ))}

          </div>
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
    </>
  );
};

export default KitchenOrderListPage;