import { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import AdminStatCard from "../../components/AdminComponents/AdminStatCard";
import DashboardChart from "../../components/AdminComponents/DashboardChart";
import "react-datepicker/dist/react-datepicker.css";
import {
  ClipboardList,
  Briefcase,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import { adminDashboardAPI } from "../../api/adminDashboard.api";

interface DashboardData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
  };
  chartData: Array<{
    label: string;
    total_orders: number;
    total_revenue: number;
  }>;
  topMenus: Array<{
    rank: number;
    menu_id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    total_sold: number;
  }>;
}

interface ChartDataItem {
  label: string;
  value: number;
  displayValue?: string;
}

const AdminDashboardPage = () => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  const formatCurrency = (value: number) => {
    return `Rp${value.toLocaleString("id-ID")}`;
  };

  const fetchDashboard = async () => {
  setLoading(true);
  try {
    const response = await adminDashboardAPI.getDashboard({
      startDate: startDate,
      endDate: endDate,
    });
    console.log("Dashboard Response:", response);

    if (response.success) {
      setDashboardData(response.data);
    }
  } catch (error) {
    console.error("Gagal ambil dashboard:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateFilter = () => {
    fetchDashboard();
  };

  const showDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  const chartDataPesanan: ChartDataItem[] =
    dashboardData?.chartData?.map((item) => ({
      label: item.label,
      value: item.total_orders,
    })) || [];

  const chartDataPendapatan: ChartDataItem[] =
    dashboardData?.chartData?.map((item) => ({
      label: item.label,
      value: item.total_revenue,
      displayValue: formatCurrency(item.total_revenue),
    })) || [];

  const topMenus = dashboardData?.topMenus || [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

     <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-4 md:p-6 pt-14 md:pt-6">
        <div className="w-full">
          <AdminHeader
            title="Dashboard Admin"
            subtitle="Pantau data sistem dan aktivitas pengguna"
          />
        </div>

        <div className="space-y-5 w-full max-w-300 mx-auto">
          {/* BAR FILTER - DESKTOP */}
          <div className="hidden md:flex bg-white rounded-xs p-2.5 px-3 md:px-4 shadow-md border border-gray-100 flex-wrap items-center gap-3 md:gap-4 w-full md:w-fit">
            <div className="flex items-center gap-2">
              <span className="text-[11px] md:text-[13px] text-gray-500 font-medium">
                Start Date
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white rounded-xs border border-gray-200 px-2 md:px-3 py-1.5 text-[11px] md:text-[13px] text-gray-700 font-medium cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] md:text-[13px] text-gray-500 font-medium">
                End Date
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white rounded-xs border border-gray-200 px-2 md:px-3 py-1.5 text-[11px] md:text-[13px] text-gray-700 font-medium cursor-pointer"
              />
            </div>

            <button
              onClick={handleUpdateFilter}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-[11px] md:text-[13px] px-3 md:px-5 py-1.5 rounded-xs shadow-md flex items-center gap-1 disabled:opacity-50"
            >
              <SlidersHorizontal size={13} strokeWidth={2.5} />
              {loading ? "Memuat..." : "Perbarui"}
            </button>
          </div>

          {/* BAR FILTER - MOBILE */}
          <div className="block md:hidden bg-white rounded-xs p-4 shadow-md border border-gray-100 space-y-4">
            <div className="flex flex-row gap-3">
              <div className="flex-1">
                <span className="text-[11px] text-gray-500 font-medium block mb-1">
                  Start Date
                </span>
                <div
                  onClick={() => showDatePicker(startDateRef)}
                  className="bg-white rounded-xs border border-gray-200 px-3 py-2 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700 font-medium flex-1 truncate">
                    {startDate.split("-").reverse().join("/")}
                  </span>
                  <input
                    type="date"
                    ref={startDateRef}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-gray-500 font-medium block mb-1">
                  End Date
                </span>
                <div
                  onClick={() => showDatePicker(endDateRef)}
                  className="bg-white rounded-xs border border-gray-200 px-3 py-2 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700 font-medium flex-1 truncate">
                    {endDate.split("-").reverse().join("/")}
                  </span>
                  <input
                    type="date"
                    ref={endDateRef}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleUpdateFilter}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-[13px] px-4 py-2.5 rounded-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <SlidersHorizontal size={14} strokeWidth={2.5} />
              {loading ? "Memuat..." : "Perbarui"}
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
            <AdminStatCard
              title="Total Pesanan"
              value={dashboardData?.summary.totalOrders.toLocaleString() || "0"}
              icon={ClipboardList}
            />
            <AdminStatCard
              title="Total Pemasukan"
              value={formatCurrency(dashboardData?.summary.totalRevenue || 0)}
              icon={Briefcase}
            />
          </div>

          {/* DIAGRAM */}
          <div className="flex flex-col lg:flex-row gap-3 md:gap-5">
            <DashboardChart
              title="Grafik Total Pesanan"
              data={chartDataPesanan}
              barColorClass="bg-[#86EF4D]"
              isRevenue={false}
            />
            <DashboardChart
              title="Grafik Pendapatan"
              data={chartDataPendapatan}
              barColorClass="bg-[#EAB308]"
              isRevenue={true}
            />
          </div>

          {/* TABEL MENU TERLARIS */}
          <section className="bg-white rounded-xs shadow-sm border border-gray-100 overflow-hidden w-full">
            <div className="bg-primary py-2 md:py-3 px-3 md:px-5">
              <h2 className="font-bold text-white text-[13px] md:text-[15px]">
                Menu Sering Dipesan
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-125">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="py-3 text-center w-12 text-[14px] font-bold text-black">
                      NO
                    </th>
                    <th className="py-3 pl-10 text-[14px] font-bold text-black">
                      Nama Produk
                    </th>
                    <th className="py-3 text-center text-[14px] font-bold text-black">
                      Harga
                    </th>
                    <th className="py-3 text-center text-[14px] font-bold text-black">
                      Kategori
                    </th>
                    <th className="py-3 text-center pr-10 text-[14px] font-bold text-black">
                      Total Terjual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-400"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : topMenus.length > 0 ? (
                    topMenus.map((menu, index) => (
                      <tr
                        key={menu.menu_id}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="py-3 text-center text-gray-500 font-semibold text-[13px]">
                          {index + 1}
                        </td>
                        <td className="py-3 pl-10">
                          <span className="text-black font-medium text-[14px]">
                            {menu.name}
                          </span>
                        </td>
                        <td className="py-3 text-center text-black text-[13px]">
                          {formatCurrency(menu.price)}
                        </td>
                        <td className="py-3 text-center text-black text-[13px] capitalize">
                          {menu.category === "FOOD" ? "Makanan" : "Minuman"}
                        </td>
                        <td className="py-3 text-center pr-10 text-black text-[13px]">
                          ⭐ {menu.total_sold} Terjual
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-400"
                      >
                        Tidak ada data menu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
