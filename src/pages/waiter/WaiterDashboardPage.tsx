import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import DashboardHeader from "../../components/Header/DashboardHeader";
import {
  ProcessingOrderCard,
  ReadyOrderCard,
} from "../../components/Card/OrderCards";
import TableStatusBoard from "../../components/Table/TableStatusBoard";
import TableManagementIcon from "../../components/Icon/TableManagementIcon";
import InfoCircleIcon from "../../components/Icon/InfoCircleIcon";
import ProcessingIcon from "../../components/Icon/ProcessingIcon";
import DeliveryIcon from "../../components/Icon/DeliveryIcon";
import AddOrderIcon from "../../components/Icon/AddOrderIcon";
import StatCardCashier from "../../components/Card/StatCardCashier";
import { useProfile } from "../../hooks/useProfile";
import { tableAPI, type TableData } from "../../api/table.api";
import { useEffect, useState } from "react";
import { orderAPI } from "../../api/order.api";

const formatTableNumber = (raw?: string) => {
  if (!raw) return "Takeaway";
  if (
    raw.toLowerCase().includes("takeaway") ||
    raw.toLowerCase().includes("tanpa")
  ) {
    return "Takeaway";
  }
  const match = raw.match(/M(\d+)/i);
  if (match) return `Meja ${match[1]}`;
  return `Meja ${raw}`;
};

// --- HELPER FORMATTER WAKTU ---
const formatTime = (isoString: string) => {
  if (!isoString) return "--:--";
  return new Date(isoString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const WaiterDashboardPage = () => {
  const navigate = useNavigate();
  const { firstName, roleName } = useProfile();

  // STATE UNTUK STATISTIK MEJA
  const [totalTables, setTotalTables] = useState<number>(0);
  const [occupiedTables, setOccupiedTables] = useState<number>(0);

  const [cookingOrders, setCookingOrders] = useState<any[]>([]);
  const [readyOrders, setReadyOrders] = useState<any[]>([]);

  // FUNGSI FETCH SEMUA DATA DASHBOARD
  const fetchDashboardData = async () => {
    try {
      // 1. Hit API Meja
      const tableRes = await tableAPI.getAllTables();
      if (tableRes.success && tableRes.data) {
        const tables: TableData[] = tableRes.data;
        setTotalTables(tables.length);
        setOccupiedTables(tables.filter((t) => t.status === "OCCUPIED").length);
      }

      // 2. Hit API Order Paralel (Kirim Status Spesifik agar tidak error 400)
      const [valRes, cookRes, readyRes] = await Promise.all([
        orderAPI.getOrdersByStatus("VALIDATED").catch(() => ({ success: false, data: [] })),
        orderAPI.getOrdersByStatus("COOKING").catch(() => ({ success: false, data: [] })),
        orderAPI.getOrdersByStatus("READY").catch(() => ({ success: false, data: [] })),
      ]);

      // Gabungkan VALIDATED dan COOKING untuk tab Sedang Diproses
      const processOrders = [
        ...(valRes.success && valRes.data ? valRes.data : []),
        ...(cookRes.success && cookRes.data ? cookRes.data : [])
      ];

      // READY untuk Pesanan Siap Saji
      const doneOrders = readyRes.success && readyRes.data ? readyRes.data : [];

      setCookingOrders(processOrders);
      setReadyOrders(doneOrders);

    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Polling setiap 5 detik agar data selalu ter-update secara Realtime
    const intervalId = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-3 mx-4 lg:mx-0">
        {/* 1. HEADER */}
        <DashboardHeader
          title="Dashboard Pelayan"
          subtitle="Pantau aktivitas pesanan dan layanan meja"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-6 lg:pb-6 px-4 lg:px-8">
        {/* 2. KARTU STATISTIK (Grid 3 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          <StatCardCashier
            title="Sedang Diproses"
            value={cookingOrders.length.toString()}
            Icon={ProcessingIcon}
          />
          <StatCardCashier
            title="Pesanan Harus Antar"
            value={readyOrders.length.toString()}
            Icon={DeliveryIcon}
          />
          <StatCardCashier
            title="Meja Terisi"
            value={
              <>
                {occupiedTables}
                <span className="text-gray/75 text-2xl font-bold">
                  /{totalTables}
                </span>
              </>
            }
            Icon={TableManagementIcon}
          />
        </div>

        {/* 3. AREA BAWAH (2 KOLOM di Layar Besar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5.5">
          {/* KOLOM KIRI: Daftar Pesanan (Ambil 2 porsi grid) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* --- SECTION: PESANAN SIAP SAJI --- */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <InfoCircleIcon className="text-primary w-6 h-6" />
                  <h2 className="font-bold text-base md:text-[17px]">
                    Pesanan Siap Saji
                  </h2>
                </div>
                <Link
                  to="/waiter/order-list"
                  className="text-primary text-[13.5px] md:text-sm hover:underline flex items-center"
                >
                  Lihat semua{" "}
                  <ChevronRight size={18} className="ml-1" strokeWidth={2.5} />
                </Link>
              </div>

              {/* Grid Kartu Siap Saji */}
              {readyOrders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {readyOrders.map((order) => {
                    const mappedItems =
                      order.items?.map(
                        (i: any) => `${i.quantity}x ${i.menu_name}`,
                      ) || [];

                    return (
                      <ReadyOrderCard
                        key={order.order_id}
                        orderId={order.order_id}
                        tableName={formatTableNumber(order.table_number)}
                        time={formatTime(order.timeStamp)}
                        items={mappedItems}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-white border border-gray-100 border-dashed rounded-md text-gray-400 text-sm">
                  Tidak ada pesanan siap antar.
                </div>
              )}
            </div>

            {/* --- SECTION: PESANAN DIPROSES --- */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-white rounded-full p-1 flex items-center justify-center">
                    <ProcessingIcon className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="font-bold text-base md:text-[17px]">
                    Pesanan Diproses
                  </h2>
                </div>
                <Link
                  to="/waiter/order-list"
                  className="text-primary text-[13.5px] md:text-sm hover:underline flex items-center"
                >
                  Lihat semua{" "}
                  <ChevronRight size={18} className="ml-1" strokeWidth={2.5} />
                </Link>
              </div>

              {/* List Pesanan Diproses (Tumpuk bawah) */}
              {cookingOrders.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {cookingOrders.map((order) => {
                    const itemsString =
                      order.items
                        ?.map((i: any) => `${i.quantity}x ${i.menu_name}`)
                        .join(", ") || "Tidak ada item";

                    return (
                      <ProcessingOrderCard
                        key={order.order_id}
                        orderId={order.order_id}
                        tableName={formatTableNumber(order.table_number)}
                        itemsString={itemsString}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-white border border-gray-100 border-dashed rounded-md text-gray-400 text-sm">
                  Tidak ada pesanan yang sedang dimasak.
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Status Meja & Tombol Buat Pesanan (Ambil 1 porsi grid) */}
          <div className="lg:col-span-1 flex flex-col gap-5 mt-5.5 lg:mt-10.5">
            <Button
              variant="outline"
              onClick={() => navigate("/waiter/create-order")}
              className="w-full bg-white border-2 border-white text-primary font-bold text-[17px] lg:text-[17.5px] py-2.5 rounded-md shadow-sm hover:bg-gray-50 transition-all flex justify-center items-center gap-2"
            >
              <AddOrderIcon className="bg-primary text-white rounded-full w-6.5 h-6.5" />{" "}
              Buat Pesanan
            </Button>

            <TableStatusBoard />
          </div>
        </div>
      </div>
    </>
  );
};

export default WaiterDashboardPage;
