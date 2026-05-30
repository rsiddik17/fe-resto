import { useNavigate } from "react-router";
import { LayoutGrid, Plus } from "lucide-react";

import DashboardHeader from "../../components/Header/DashboardHeader";
import StatCardCashier from "../../components/Card/StatCardCashier";
import TableStatusBoard from "../../components/Table/TableStatusBoard";
import TotalOrderIcon from "../../components/Icon/TotalOrderIcon";
import IncomingOrderTable, {
  type IncomingOrder,
} from "../../components/Table/IncomingOrderTable";
import StockIcon from "../../components/Icon/StockIcon";
import MoneyIcon from "../../components/Icon/MoneyIcon";
import { useProfile } from "../../hooks/useProfile";
import { tableAPI, type TableData } from "../../api/table.api";
import { useEffect, useState } from "react";
import { orderAPI } from "../../api/order.api";

// --- HELPER FORMATTER ---
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const formatTableNumber = (raw?: string) => {
  if (!raw) return "Takeaway";
  if (
    raw.toLowerCase().includes("takeaway") ||
    raw.toLowerCase().includes("tanpa")
  ) {
    return "Takeaway";
  }
  // Hanya ambil angkanya saja untuk di Dashboard (Misal "M01_i" jadi "Meja 01")
  const match = raw.match(/M(\d+)/i);
  if (match) return `Meja ${match[1]}`;
  return `Meja ${raw}`;
};

const CashierDashboardPage = () => {
  const navigate = useNavigate();
  const { firstName, roleName } = useProfile();

  // STATE UNTUK STATISTIK MEJA
  const [totalTables, setTotalTables] = useState<number>(0);
  const [occupiedTables, setOccupiedTables] = useState<number>(0);

  // STATE STATISTIK LAPORAN (Order & Sales)
  const [totalOrderToday, setTotalOrderToday] = useState<number>(0);
  const [totalSalesToday, setTotalSalesToday] = useState<number>(0);

  // STATE PESANAN MASUK
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>([]);

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

      const todayDate = new Date().toISOString().split("T")[0];

      // 2. Hit API Laporan (Pemasukan & Total Order)
      const reportRes = await orderAPI.getReportOrders(todayDate);
      if (reportRes.success && reportRes.data) {
        setTotalOrderToday(reportRes.data.summary.totalOrder || 0);
        setTotalSalesToday(reportRes.data.summary.totalSales || 0);
      }

      // 3. PERBAIKAN: Hit API Pesanan secara paralel dengan status spesifik
      // agar tidak memicu Error 400 Bad Request dari backend
      const [validatedRes, cookingRes] = await Promise.all([
        orderAPI
          .getOrdersByStatus("VALIDATED")
          .catch(() => ({ success: false, data: [] })),
        orderAPI
          .getOrdersByStatus("COOKING")
          .catch(() => ({ success: false, data: [] })),
      ]);

      // Gabungkan data pesanan masuk yang berstatus VALIDATED dan COOKING
      const activeOrders = [
        ...(validatedRes.success && validatedRes.data ? validatedRes.data : []),
        ...(cookingRes.success && cookingRes.data ? cookingRes.data : []),
      ];

      if (activeOrders.length > 0) {
        const mappedOrders: IncomingOrder[] = activeOrders
          // Urutkan dari pesanan yang paling baru masuk (Descending)
          .sort(
            (a: any, b: any) =>
              new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime(),
          )
          .map((o: any) => {
            // Gabungkan item menjadi string (Cth: "Es Jeruk x1, Jus Alpukat x1")
            const menuString =
              o.items
                ?.map((item: any) => `${item.menu_name} x${item.quantity}`)
                .join(", ") || "-";

            return {
              id: `#${o.order_id}`,
              menu: menuString,
              table: formatTableNumber(o.table_number),
              status: "DIMASAK", // Set default text status sesuai UI figma pesanan masuk
              total: Number(o.grand_total_amount || 0),
              method: o.source === "QR_SCAN" ? "QR" : o.source,
            };
          });

        setIncomingOrders(mappedOrders);
      } else {
        setIncomingOrders([]); // Kosongkan state jika tidak ada pesanan aktif
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Polling setiap 5 detik agar data meja & orderan selalu ter-update (Realtime)
    const intervalId = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* 1. HEADER */}
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0">
        <DashboardHeader
          title="Dashboard Kasir"
          subtitle="Ringkasan data pesanan dan aktivitas restoran"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      {/* 2. MAIN CONTENT (Scrollable keseluruhan) */}
      <div className="pt-1 lg:pt-1 pb-6 lg:pb-6 px-4 lg:px-8">
        {/* ROW 1: 3 Stat Cards */}
        <div className="flex flex-col lg:flex-row gap-4.5 mb-5">
          <div className="flex-1 flex flex-col md:flex-row gap-4.5 w-full">
            <div className="flex-1">
              <StatCardCashier
                title="Total Order Hari Ini"
                value={totalOrderToday.toString()}
                Icon={TotalOrderIcon}
              />
            </div>
            <div className="flex-1">
              <StatCardCashier
                title="Pemasukkan Hari Ini"
                value={rupiahFormatter.format(totalSalesToday)}
                Icon={MoneyIcon}
              />
            </div>
          </div>
          <div className="w-full lg:w-auto flex-[0.423] lg:max-w-82.5 shrink-0">
            <StatCardCashier
              title="Meja Terisi"
              value={
                <span>
                  {occupiedTables}
                  <span className="text-gray/75 text-2xl font-bold">
                    /{totalTables}
                  </span>
                </span>
              }
              Icon={LayoutGrid}
            />
          </div>
        </div>

        {/* ROW 2: Pesanan Masuk (Kiri) & Aksi Cepat + Status (Kanan) */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* --- KOLOM KIRI (Tabel Pesanan Masuk) --- */}
          <div className="flex-1">
            <IncomingOrderTable orders={incomingOrders} />
          </div>

          {/* --- KOLOM KANAN (Aksi Cepat & Status Meja) --- */}
          <div className="w-full flex-[0.423] lg:w-67.5 flex flex-col gap-4">
            {/* AKSI CEPAT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 pt-3.5 pb-5">
              <h3 className="font-bold text-lg mb-2">Aksi Cepat</h3>

              <div className="flex flex-col gap-3.5">
                <button
                  onClick={() => navigate("/cashier/order-list")}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-md px-3 py-2 transition-all shadow-sm cursor-pointer"
                >
                  <div className="bg-primary w-7.5 h-7.5 rounded-full flex items-center justify-center text-white shrink-0 transition-transform">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                  <span className="font-extrabold text-[15px]">
                    Buat Pesanan
                  </span>
                </button>

                <button
                  onClick={() => navigate("/cashier/management-menu-stock")}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-md px-3 py-2 transition-all shadow-sm cursor-pointer"
                >
                  <div className="bg-primary w-7.5 h-7.5 rounded-full flex items-center justify-center text-white shrink-0 transition-transform">
                    <StockIcon
                      className="w-5 h-5 md:w-5.5 md:h-5.5"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="font-extrabold text-[15px] text-black">
                    Lihat Stok
                  </span>
                </button>
              </div>
            </div>

            {/* STATUS MEJA */}
            {/* Memanggil komponen buatanmu sebelumnya */}
            <TableStatusBoard />
          </div>
        </div>
      </div>
    </>
  );
};

export default CashierDashboardPage;
