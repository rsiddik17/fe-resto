import { useState, useRef } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import AdminStatCard from "../../components/AdminComponents/AdminStatCard";
import DashboardChart from "../../components/AdminComponents/DashboardChart";
import { useMenus } from "../../hooks/useMenus";
import {
  ClipboardList,
  Briefcase,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";

const MOCK_DATA_SOURCE = {
  "2026-04-10_2026-04-16": {
    pesanan: [
      { label: "10", value: 200 },
      { label: "11", value: 250 },
      { label: "12", value: 300 },
      { label: "13", value: 350 },
      { label: "14", value: 400 },
      { label: "15", value: 450 },
      { label: "16", value: 500 },
    ],
    pendapatan: [
      { label: "10", value: 240, displayValue: "Rp2.4 jt" },
      { label: "11", value: 300, displayValue: "Rp3.0 jt" },
      { label: "12", value: 350, displayValue: "Rp3.5 jt" },
      { label: "13", value: 370, displayValue: "Rp3.7 jt" },
      { label: "14", value: 440, displayValue: "Rp4.4 jt" },
      { label: "15", value: 460, displayValue: "Rp4.6 jt" },
      { label: "16", value: 480, displayValue: "Rp4.8 jt" },
    ],
    totalPesanan: "1.033",
    totalPemasukan: "Rp39.911.194",
  },
};

const AdminDashboardPage = () => {
  const { data: menuList, isLoading } = useMenus();
  const [startDate, setStartDate] = useState("2026-04-10");
  const [endDate, setEndDate] = useState("2026-04-16");
  const [currentData] = useState(MOCK_DATA_SOURCE["2026-04-10_2026-04-16"]);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const handleUpdateFilter = () => {
    // FIX: Format disamakan menggunakan underscore "_" agar sesuai dengan properti MOCK_DATA_SOURCE
    const formatKey = `${startDate}_${endDate}`;

    if (formatKey in MOCK_DATA_SOURCE) {
      setCurrentData(
        MOCK_DATA_SOURCE[formatKey as keyof typeof MOCK_DATA_SOURCE],
      );
    } else {
      setCurrentData(MOCK_DATA_SOURCE["default"]);
    }
  };

  // Daftar menu yang diinginkan
  const targetMenuNames = [
    "es teler",
    "mie ayam bakso",
    "ayam penyet",
    "nasi goreng kambing",
    "sate ayam",
  ];
  // Angka statis sesuai desain referensi Anda
  const angkaStatik = ["150", "120", "108", "100", "98"];

  const filteredMenus = menuList
    ?.filter((menu) =>
      targetMenuNames.some((target) =>
        menu.name.toLowerCase().includes(target),
      ),
    )
    .sort(
      (a, b) =>
        targetMenuNames.indexOf(
          targetMenuNames.find((t) => a.name.toLowerCase().includes(t))!,
        ) -
        targetMenuNames.indexOf(
          targetMenuNames.find((t) => b.name.toLowerCase().includes(t))!,
        ),
    );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6">
        <AdminHeader
          title="Dashboard Admin"
          adminName="Citra"
          roleName="Admin Role"
        />

        <div className="space-y-5 w-full max-w-300 mx-auto">
          {/* BAR FILTER */}
          <div className="bg-white rounded-xs p-2.5 px-4 shadow-md border border-gray-100 flex flex-wrap items-center gap-4 w-fit">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                Start Date
              </span>
              <div
                className="bg-white rounded-xs border border-gray-200 px-3 py-1.5 shadow-md flex items-center gap-2 cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => startDateRef.current?.showPicker()}
              >
                <Calendar size={14} className="text-gray-400" />
                <span className="text-[13px] text-gray-700 font-medium">
                  {startDate.split("-").reverse().join("/")}
                </span>
                <input
                  type="date"
                  ref={startDateRef}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                End Date
              </span>
              <div
                className="bg-white rounded-xs border border-gray-200 px-3 py-1.5  flex items-center shadow-md gap-2 cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => endDateRef.current?.showPicker()}
              >
                <Calendar size={14} className="text-gray-400" />
                <span className="text-[13px] text-gray-700 font-medium">
                  {endDate.split("-").reverse().join("/")}
                </span>
                <input
                  type="date"
                  ref={endDateRef}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateFilter}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-[13px] px-5 py-1.5 rounded-xs shadow-md shadow-purple-900/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <SlidersHorizontal size={13} strokeWidth={2.5} />
              Perbarui
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdminStatCard
              title="Total Pesanan"
              value={currentData.totalPesanan}
              icon={ClipboardList}
            />
            <AdminStatCard
              title="Total Pemasukan"
              value={currentData.totalPemasukan}
              icon={Briefcase}
            />
          </div>

          {/* DIAGRAM */}
          <div className="flex flex-col lg:flex-row gap-5">
            <DashboardChart
              title="Grafik Total Pesanan"
              data={currentData.pesanan}
              barColorClass="bg-[#86EF4D]"
              isRevenue={false}
            />
            <DashboardChart
              title="Grafik Pendapatan"
              data={currentData.pendapatan}
              barColorClass="bg-[#EAB308]"
              isRevenue={true}
            />
          </div>

          {/* TABEL MENU */}
          {/* TABEL MENU SERING DIPESAN - UKURAN KECIL */}
          {/* TABEL MENU SERING DIPESAN */}
          <section className="bg-white rounded-xs shadow-sm border border-gray-100 overflow-hidden w-full">
            <div className="bg-primary py-1.5 px-4 ">
              <h2 className="font-bold text-white text-[12px]">
                Menu Sering Dipesan
              </h2>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="py-1.5 text-center w-10 text-[12px] text-black">
                      NO
                    </th>
                    <th className="py-1.5 pl-8 text-[12px] text-black">
                      Nama Produk
                    </th>
                    <th className="py-1.5 text-center text-[12px] text-black">
                      Harga
                    </th>
                    <th className="py-1.5 text-center text-[12px] text-black">
                      Kategori
                    </th>
                    <th className="py-1.5 text-center pr-8 text-[12px] text-black">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-5 text-center text-gray-400 text-[10px]"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredMenus && filteredMenus.length > 0 ? (
                    filteredMenus.map((menu, index) => (
                      <tr
                        key={menu.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50"
                      >
                        <td className="py-1.5 text-center text-gray-400 font-semibold text-[11px]">
                          {index + 1}
                        </td>
                        <td className="py-1.5 pl-8">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={menu.image}
                              alt={menu.name}
                              className="w-7 h-7 object-cover rounded-full border border-gray-100"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/100x100?text=Food";
                              }}
                            />
                            <span className="text-black font-medium text-[11px]">
                              {menu.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-1.5 text-center text-black text-[10px]">
                          Rp{menu.price.toLocaleString()}
                        </td>
                        <td className="py-1.5 text-center text-black text-[10px] capitalize">
                          {menu.category}
                        </td>
                        <td className="py-1.5 text-center pr-8 text-black text-[10px] ">
                          ⭐ {angkaStatik[index] || menu.stock} Terjual
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-5 text-center text-gray-400 text-[10px]"
                      >
                        Menu tidak ditemukan.
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
