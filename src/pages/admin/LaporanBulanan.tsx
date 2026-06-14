import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import FilterBulanan from "../../components/AdminComponents/FilterBulanan";
import TabelPesananBulanan from "../../components/AdminComponents/TabelPesananBulanan";
import TabelPendapatanBulanan from "../../components/AdminComponents/TabelPendapatanBulanan";
import LaporanTableMenuBulanan from "../../components/AdminComponents/LaporanTabelMenuBulanan";
import ReportIcon from "../../components/Icon/ReportIcon";
import { adminReportsAPI } from "../../api/adminReports.api";

const DATA_MENU_FALLBACK: any[] = [];

const LaporanBulananPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "Semua" | "Pesanan" | "Pendapatan" | "Menu"
  >("Semua");

  // Fungsi untuk mendapatkan bulan sekarang
  const getLastTwoMonths = () => {
    const bulanNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const currentMonthIndex = new Date().getMonth();
    const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    return [bulanNames[lastMonthIndex], bulanNames[currentMonthIndex]];
    // return [bulanNames[new Date().getMonth()]];
  };

  const [selectedBulans, setSelectedBulans] = useState<string[]>(getLastTwoMonths);
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());

  // State untuk loading dan data
  const [loadingReport, setLoadingReport] = useState(false);
  const [pesananData, setPesananData] = useState<any[]>([]);
  const [pendapatanData, setPendapatanData] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<any[]>(DATA_MENU_FALLBACK);

  // State untuk menandai apakah laporan sudah ditampilkan
  const [isLaporanDitampilkan, setIsLaporanDitampilkan] = useState(false);

  const getMonthNumber = (namaBulan: string): number => {
    const bulanMap: { [key: string]: number } = {
      Januari: 1,
      Februari: 2,
      Maret: 3,
      April: 4,
      Mei: 5,
      Juni: 6,
      Juli: 7,
      Agustus: 8,
      September: 9,
      Oktober: 10,
      November: 11,
      Desember: 12,
    };
    return bulanMap[namaBulan] || 1;
  };

  const fetchReports = async (bulanList: string[], tahunValue: string) => {
    if (bulanList.length === 0) {
      console.warn("Tidak ada bulan dipilih");
      return;
    }

    if (!tahunValue || tahunValue === "") {
      console.warn("Belum ada tahun dipilih");
      return;
    }

    setLoadingReport(true);
    try {
      const months = bulanList.map((b) => getMonthNumber(b));
      const yearNum = parseInt(tahunValue);

      if (isNaN(yearNum)) {
        console.error("Tahun tidak valid:", tahunValue);
        return;
      }

      console.log("📅 Fetching dengan filter:", {
        months,
        year: yearNum,
        bulanList,
      });

      // UNTUK TAB "SEMUA", PANGGIL 3 API SEKALIGUS
      if (activeTab === "Semua") {
        const [ordersRes, revenueRes, menuRes] = await Promise.all([
          adminReportsAPI.getReports({
            reportCategory: "orders",
            type: "monthly",
            months: months,
            year: yearNum,
            page: 1,
            limit: 100,
          }),
          adminReportsAPI.getReports({
            reportCategory: "revenue",
            type: "monthly",
            months: months,
            year: yearNum,
            page: 1,
            limit: 100,
          }),
          adminReportsAPI.getReports({
            reportCategory: "menu",
            type: "monthly",
            months: months,
            year: yearNum,
            page: 1,
            limit: 100,
          }),
        ]);

        const ordersData = (ordersRes.data || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            bulan: item.bulan || item.label,
            totalPesanan: item.total_pesanan,
            selesai: item.pesanan_selesai,
            cancel: item.pesanan_cancel,
          }),
        );
        setPesananData(ordersData);

        const revenueData = (revenueRes.data || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            bulan: item.bulan || item.label,
            totalPesanan: item.total_pesanan,
            pendapatan: item.total_pendapatan,
          }),
        );
        setPendapatanData(revenueData);

        const menuDataMapped = (menuRes.data || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            nama: item.nama_menu,
            harga: item.harga,
            kategori: item.kategori === "FOOD" ? "Makanan" : "Minuman",
            total: item.total,
          }),
        );
        setMenuData(menuDataMapped);
      } else {
        const reportCategory =
          activeTab === "Pesanan"
            ? "orders"
            : activeTab === "Pendapatan"
              ? "revenue"
              : "menu";

        const response = await adminReportsAPI.getReports({
          reportCategory: reportCategory,
          type: "monthly",
          months: months,
          year: yearNum,
          page: 1,
          limit: 100,
        });

        const reportData = response.data || [];

        if (reportCategory === "orders") {
          const formattedData = reportData.map((item: any, index: number) => ({
            id: index + 1,
            bulan: item.bulan || item.label,
            totalPesanan: item.total_pesanan,
            selesai: item.pesanan_selesai,
            cancel: item.pesanan_cancel,
          }));
          setPesananData(formattedData);
          setPendapatanData([]);
          setMenuData([]);
        } else if (reportCategory === "revenue") {
          const formattedData = reportData.map((item: any, index: number) => ({
            id: index + 1,
            bulan: item.bulan || item.label,
            totalPesanan: item.total_pesanan,
            pendapatan: item.total_pendapatan,
          }));
          setPesananData([]);
          setPendapatanData(formattedData);
          setMenuData([]);
        } else if (reportCategory === "menu") {
          const formattedData = reportData.map((item: any, index: number) => ({
            id: index + 1,
            nama: item.nama_menu,
            harga: item.harga,
            kategori: item.kategori === "FOOD" ? "Makanan" : "Minuman",
            total: item.total,
          }));
          setPesananData([]);
          setPendapatanData([]);
          setMenuData(formattedData);
        }
      }
    } catch (error) {
      console.error("Gagal ambil laporan bulanan:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleFilterChange = useCallback((bulanList: string[], thn: string) => {
    console.log("📅 Filter berubah:", { bulanList, thn });
    setSelectedBulans(bulanList);
    setTahun(thn);
    setIsLaporanDitampilkan(false);
    setPesananData([]);
    setPendapatanData([]);
    setMenuData([]);
  }, []);

  const handleTampilkanLaporan = async () => {
    console.log("📅 Menampilkan laporan dengan filter:", {
      bulan: selectedBulans,
      tahun,
    });

    if (selectedBulans.length === 0) {
      alert("Silakan pilih minimal 1 bulan terlebih dahulu!");
      return;
    }

    if (!tahun || tahun === "") {
      alert("Silakan pilih tahun terlebih dahulu!");
      return;
    }

    await fetchReports(selectedBulans, tahun);
    setIsLaporanDitampilkan(true);
  };

  const periodeText = useMemo(() => {
    if (selectedBulans.length === 0) return "Tidak ada bulan dipilih";
    if (selectedBulans.length === 12) return `Tahun ${tahun}`;
    if (selectedBulans.length === 1)
      return `Bulan ${selectedBulans[0]} ${tahun}`;
    return `Bulan ${selectedBulans[0]} - ${selectedBulans[selectedBulans.length - 1]} ${tahun}`;
  }, [selectedBulans, tahun]);

  const isLoading = loadingReport && !isLaporanDitampilkan;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-4 md:p-6">
        <AdminHeader
          title="Laporan"
          subtitle="Kelola dan lihat laporan harian, mingguan, atau bulanan"
        />

        <div className="w-full max-w-6xl mx-auto mt-4 space-y-6">
          {/* FILTER SECTION */}
          <div className="bg-white rounded-[20px] border border-gray-150 p-6 space-y-6 overflow-visible">
            <div className="space-y-3">
              <h3 className="text-[13.5px] font-extrabold text-black uppercase tracking-wider">
                Jenis Laporan
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setActiveTab("Semua");
                    setIsLaporanDitampilkan(false);
                  }}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Semua" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>Semua</span>
                  <span>Laporan</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Pesanan");
                    setIsLaporanDitampilkan(false);
                  }}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Pesanan" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>Laporan</span>
                  <span>Pesanan</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Pendapatan");
                    setIsLaporanDitampilkan(false);
                  }}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Pendapatan" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>Laporan</span>
                  <span>Pendapatan</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Menu");
                    setIsLaporanDitampilkan(false);
                  }}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Menu" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>Laporan</span>
                  <span>Menu</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[13.5px] font-bold text-gray-500 border-b border-gray-100 pb-3">
              <button
                onClick={() => navigate("/admin/report")}
                className="pb-1 cursor-pointer"
              >
                Harian
              </button>
              <button
                onClick={() => navigate("/admin/report/weekly")}
                className="pb-1 cursor-pointer"
              >
                Mingguan
              </button>
              <button
                onClick={() => navigate("/admin/report/monthly")}
                className="pb-1 cursor-pointer text-black border-b-[2.5px] border-primary font-extrabold"
              >
                Bulanan
              </button>
            </div>

            <FilterBulanan
              defaultBulans={selectedBulans}
              defaultTahun={tahun}
              onFilterChange={handleFilterChange}
            />

            <button
              onClick={handleTampilkanLaporan}
              disabled={loadingReport}
              className="bg-primary hover:opacity-95 text-white text-[12.5px] font-bold px-5 py-2.5 rounded-xs shadow-md cursor-pointer flex items-center gap-2"
            >
              <ReportIcon className="w-4 h-4" />
              {loadingReport ? "Memuat..." : "Tampilkan Laporan"}
            </button>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <div className="bg-white rounded-[20px] border border-gray-150 p-6 text-center">
              <div className="flex justify-center items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500">Sedang memuat data...</span>
              </div>
            </div>
          )}

          {/* TABEL LAPORAN - SELALU TAMPIL (seperti mingguan) */}
          {isLaporanDitampilkan && selectedBulans.length > 0 && (
            <div className="bg-white rounded-[20px] border border-gray-150 p-6">
              <div className="space-y-12">
                {/* LAPORAN PESANAN */}
                {(activeTab === "Semua" || activeTab === "Pesanan") && (
                  <TabelPesananBulanan
                    data={pesananData}
                    periode={periodeText}
                    enablePagination={true}
                    itemsPerPage={10}
                  />
                )}

                {/* LAPORAN PENDAPATAN */}
                {(activeTab === "Semua" || activeTab === "Pendapatan") && (
                  <TabelPendapatanBulanan
                    data={pendapatanData}
                    periode={periodeText}
                    enablePagination={true}
                    itemsPerPage={10}
                  />
                )}

                {/* LAPORAN MENU */}
                {(activeTab === "Semua" || activeTab === "Menu") && (
                  <LaporanTableMenuBulanan
                    data={menuData}
                    periode={periodeText}
                  />
                )}
              </div>
            </div>
          )}

          {/* PERINGATAN - Belum pilih filter */}
          {isLaporanDitampilkan && selectedBulans.length === 0 && (
            <div className="bg-white rounded-[20px] border border-gray-150 p-6 text-center text-gray-400">
              Silakan pilih minimal 1 bulan untuk menampilkan laporan
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LaporanBulananPage;
