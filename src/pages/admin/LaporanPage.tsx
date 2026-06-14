import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import LaporanTableMenu from "../../components/AdminComponents/LaporanTableMenu";
import LaporanTablePendapatan from "../../components/AdminComponents/LaporanTablePendapatan";
import LaporanTablePesanan from "../../components/AdminComponents/LaporanTablePesanan";
import ReportIcon from "../../components/Icon/ReportIcon";
import "react-datepicker/dist/react-datepicker.css";
import { adminReportsAPI } from "../../api/adminReports.api";
// DATA (sama seperti sebelumnya)
// const DATA_PESANAN_AWAL = [
//   { id: 1, tanggal: "05 Apr 2026", total: 135, selesai: 133, cancel: 2 },
//   { id: 2, tanggal: "04 Apr 2026", total: 151, selesai: 150, cancel: 1 },
//   { id: 3, tanggal: "03 Apr 2026", total: 155, selesai: 155, cancel: 0 },
//   { id: 4, tanggal: "02 Apr 2026", total: 135, selesai: 135, cancel: 0 },
//   { id: 5, tanggal: "01 Apr 2026", total: 144, selesai: 143, cancel: 1 },
//   { id: 6, tanggal: "31 Mar 2026", total: 155, selesai: 155, cancel: 0 },
//   { id: 7, tanggal: "30 Mar 2026", total: 162, selesai: 162, cancel: 0 },
// ];

// const DATA_PENDAPATAN_AWAL = [
//   { id: 1, tanggal: "05 Apr 2026", totalPesanan: 133, pendapatan: 3009876 },
//   { id: 2, tanggal: "04 Apr 2026", totalPesanan: 150, pendapatan: 5987000 },
//   { id: 3, tanggal: "03 Apr 2026", totalPesanan: 155, pendapatan: 6507984 },
//   { id: 4, tanggal: "02 Apr 2026", totalPesanan: 135, pendapatan: 4876234 },
//   { id: 5, tanggal: "01 Apr 2026", totalPesanan: 143, pendapatan: 5001100 },
//   { id: 6, tanggal: "31 Mar 2026", totalPesanan: 155, pendapatan: 6654000 },
//   { id: 7, tanggal: "30 Mar 2026", totalPesanan: 162, pendapatan: 7875000 },
// ];

const DATA_MENU_AWAL = [
  { id: 1, nama: "Es Teler", harga: 20000, kategori: "Minuman", total: 56 },
  {
    id: 2,
    nama: "Mie Ayam Bakso",
    harga: 30000,
    kategori: "Makanan",
    total: 54,
  },
  { id: 3, nama: "Ayam Penyet", harga: 40000, kategori: "Makanan", total: 54 },
  {
    id: 4,
    nama: "Nasi Goreng Kambing",
    harga: 40000,
    kategori: "Makanan",
    total: 44,
  },
  { id: 5, nama: "Sate Ayam", harga: 40000, kategori: "Makanan", total: 43 },
  { id: 6, nama: "Sop Iga", harga: 50000, kategori: "Makanan", total: 42 },
  { id: 7, nama: "Lychee Tea", harga: 20000, kategori: "Minuman", total: 41 },
  { id: 8, nama: "Gado-gado", harga: 30000, kategori: "Makanan", total: 39 },
  { id: 9, nama: "Matcha Latte", harga: 30000, kategori: "Minuman", total: 38 },
  { id: 10, nama: "Lemon Tea", harga: 20000, kategori: "Minuman", total: 37 },

  // --- HALAMAN 2 (Data 11 - 20) ---
  { id: 11, nama: "Bakso Urat", harga: 30000, kategori: "Makanan", total: 36 },
  { id: 12, nama: "Le Mineral", harga: 5000, kategori: "Minuman", total: 34 },
  { id: 13, nama: "Jus Alpukat", harga: 20000, kategori: "Minuman", total: 32 },
  { id: 14, nama: "Dimsum", harga: 30000, kategori: "Makanan", total: 31 },
  { id: 15, nama: "Jus Mangga", harga: 20000, kategori: "Minuman", total: 30 },
  { id: 16, nama: "Nasi Bakar", harga: 30000, kategori: "Makanan", total: 28 },
  { id: 17, nama: "Nasi Goreng", harga: 30000, kategori: "Makanan", total: 26 },
  { id: 18, nama: "Es Jeruk", harga: 20000, kategori: "Minuman", total: 22 },
  { id: 19, nama: "Soto Ayam", harga: 40000, kategori: "Makanan", total: 21 },
  { id: 20, nama: "Nasi Liwet", harga: 30000, kategori: "Makanan", total: 20 },

  // --- HALAMAN 3 (Data 21 - 30) ---
  { id: 21, nama: "Kopi Susu", harga: 20000, kategori: "Minuman", total: 19 },
  {
    id: 22,
    nama: "Nasi Goreng Udang",
    harga: 40000,
    kategori: "Makanan",
    total: 18,
  },
  { id: 23, nama: "Nasi Kuning", harga: 30000, kategori: "Makanan", total: 18 },
  {
    id: 24,
    nama: "Milkshake Stroberi",
    harga: 20000,
    kategori: "Minuman",
    total: 17,
  },
  { id: 25, nama: "Nasi Kebuli", harga: 50000, kategori: "Makanan", total: 17 },
  {
    id: 26,
    nama: "Cireng Bumbu Rujak",
    harga: 20000,
    kategori: "Makanan",
    total: 16,
  },
  {
    id: 27,
    nama: "Roti Bakar Cokelat",
    harga: 20000,
    kategori: "Makanan",
    total: 15,
  },
  {
    id: 28,
    nama: "Es Kelapa Muda",
    harga: 20000,
    kategori: "Minuman",
    total: 14,
  },
  { id: 29, nama: "Pempek", harga: 40000, kategori: "Makanan", total: 12 },
  {
    id: 30,
    nama: "Jus Stroberi",
    harga: 20000,
    kategori: "Minuman",
    total: 10,
  },

  // --- HALAMAN 4 (Data 31 - 36) ---
  {
    id: 31,
    nama: "Kwetiau Goreng",
    harga: 30000,
    kategori: "Makanan",
    total: 9,
  },
  { id: 32, nama: "Capcay", harga: 30000, kategori: "Makanan", total: 8 },
  { id: 33, nama: "Jus Jambu", harga: 20000, kategori: "Minuman", total: 5 },
  { id: 34, nama: "Nasi Putih", harga: 10000, kategori: "Makanan", total: 3 },
  { id: 35, nama: "Es Kuwut", harga: 20000, kategori: "Minuman", total: 2 },
  { id: 36, nama: "Es Cincau", harga: 20000, kategori: "Minuman", total: 0 },
];

const getDaysInMonth = (year: number, month: number) => {
  // bulan di JS dimulai dari 0 (Januari) hingga 11 (Desember)
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  // Mendapatkan indeks hari (0=Minggu, 1=Senin, ..., 6=Sabtu)
  return new Date(year, month, 1).getDay();
};

const LIST_BULAN = [
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

// const parseTanggalFigma = (tglStr: string) => {
//   const parts = tglStr.split(" ");
//   if (parts.length < 3) return new Date();
//   const day = parseInt(parts[0], 10);
//   const bulanMap: { [key: string]: number } = { Mar: 2, Apr: 3 };
//   const month = bulanMap[parts[1]] !== undefined ? bulanMap[parts[1]] : 0;
//   return new Date(parseInt(parts[2], 10), month, day);
// };

const LaporanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "Semua" | "Pesanan" | "Pendapatan" | "Menu"
  >("Semua");
  // const [rentangWaktu, setRentangWaktu] = useState("Harian");

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11 (Juni = 5)
  const currentDate = now.getDate();

  const [tanggalMulai, setTanggalMulai] = useState<number>(1);
  const [tanggalSelesai, setTanggalSelesai] = useState<number>(currentDate);
  const [showLaporan, setShowLaporan] = useState(false);
  const [bulanMulaiIdx, setBulanMulaiIdx] = useState(currentMonth);
  const [bulanSelesaiIdx, setBulanSelesaiIdx] = useState(currentMonth);
  const [loadingReport, setLoadingReport] = useState(false);

  // const [startDate, setStartDate] = useState<Date | null>(new Date());
  // const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [pesananData, setPesananData] = useState<any[]>([]);
  const [pendapatanData, setPendapatanData] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<any[]>(DATA_MENU_AWAL);

  // const [sortPesanan, setSortPesanan] = useState({ field: "", order: "asc" });
  // const [sortPendapatan, setSortPendapatan] = useState({
  //   field: "",
  //   order: "asc",
  // });

  const fetchReports = async () => {
    setLoadingReport(true);
    try {
      const startDate = `2026-${(bulanMulaiIdx + 1).toString().padStart(2, "0")}-${tanggalMulai.toString().padStart(2, "0")}`;
      const endDate = `2026-${(bulanSelesaiIdx + 1).toString().padStart(2, "0")}-${tanggalSelesai.toString().padStart(2, "0")}`;

      const getReportCategory = () => {
        if (activeTab === "Pesanan") return "orders";
        if (activeTab === "Pendapatan") return "revenue";
        if (activeTab === "Menu") return "menu";
        return "orders";
      };

      // ✅ JIKA TAB "SEMUA", PANGGIL 3 API SEKALIGUS
      if (activeTab === "Semua") {
        const [ordersRes, revenueRes, menuRes] = await Promise.all([
          adminReportsAPI.getReports({
            reportCategory: "orders",
            type: "daily",
            startDate,
            endDate,
            page: 1,
            limit: 100,
          }),
          adminReportsAPI.getReports({
            reportCategory: "revenue",
            type: "daily",
            startDate,
            endDate,
            page: 1,
            limit: 100,
          }),
          adminReportsAPI.getReports({
            reportCategory: "menu",
            type: "daily",
            startDate,
            endDate,
            page: 1,
            limit: 100,
          }),
        ]);

        // Proses orders
        const ordersData = (ordersRes.data || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            tanggal: item.label,
            total: item.total_pesanan,
            selesai: item.pesanan_selesai,
            cancel: item.pesanan_cancel,
          }),
        );
        setPesananData(ordersData);

        // Proses revenue
        const revenueData = (revenueRes.data || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            tanggal: item.label,
            totalPesanan: item.total_pesanan,
            pendapatan: item.total_pendapatan,
          }),
        );
        setPendapatanData(revenueData);

        // Proses menu
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
        // ✅ UNTUK TAB INDIVIDUAL (Pesanan, Pendapatan, Menu)
        const reportCategory = getReportCategory();
        const response = await adminReportsAPI.getReports({
          reportCategory: reportCategory,
          type: "daily",
          startDate: startDate,
          endDate: endDate,
          page: 1,
          limit: 100,
        });

        const reportData = response.data || [];

        if (reportCategory === "orders") {
          const formattedData = reportData.map((item: any, index: number) => ({
            id: index + 1,
            tanggal: item.label,
            total: item.total_pesanan,
            selesai: item.pesanan_selesai,
            cancel: item.pesanan_cancel,
          }));
          setPesananData(formattedData);
          setPendapatanData([]);
          setMenuData([]);
        } else if (reportCategory === "revenue") {
          const formattedData = reportData.map((item: any, index: number) => ({
            id: index + 1,
            tanggal: item.label,
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
      console.error("Gagal ambil laporan:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleTampilkanLaporan = () => {
    fetchReports();
    setShowLaporan(true);
  };

  const handlePrevBulanMulai = () =>
    setBulanMulaiIdx((prev) => (prev === 0 ? 11 : prev - 1));
  const handleNextBulanMulai = () =>
    setBulanMulaiIdx((prev) => (prev === 11 ? 0 : prev + 1));
  const handlePrevBulanSelesai = () =>
    setBulanSelesaiIdx((prev) => (prev === 0 ? 11 : prev - 1));
  const handleNextBulanSelesai = () =>
    setBulanSelesaiIdx((prev) => (prev === 11 ? 0 : prev + 1));
  const periodeText = `${tanggalMulai} ${LIST_BULAN[bulanMulaiIdx]} - ${tanggalSelesai} ${LIST_BULAN[bulanSelesaiIdx]} 2026`;

  // FUNGSI INI ADALAH KOMPONEN KALENDER RAPI YANG BISA KAMU PAKAI
  const renderCalendar = (
    bulanIdx: number,
    selectedDate: number,
    setTanggal: (tgl: number) => void,
    handlePrev: () => void,
    handleNext: () => void,
  ) => (
    <div className="bg-white-50/70 border border-gray-200 rounded-2xl p-4 w-full sm:w-64 h-65 flex flex-col">
      <div className="flex items-center justify-between font-extrabold text-[13px] text-black mb-3">
        <ChevronLeft
          size={14}
          className="cursor-pointer hover:text-black"
          onClick={handlePrev}
        />
        <span>{LIST_BULAN[bulanIdx]} 2026</span>
        <ChevronRight
          size={14}
          className="cursor-pointer hover:text-black"
          onClick={handleNext}
        />
      </div>
      <div className="grid grid-cols-7 gap-1 text-[11px] font-bold text-gray-400 mb-1 text-center">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-[11px] font-bold text-gray-800">
        {Array.from({ length: getFirstDayOfMonth(2026, bulanIdx) }).map(
          (_, i) => (
            <div key={`empty-${i}`} />
          ),
        )}
        {Array.from({ length: getDaysInMonth(2026, bulanIdx) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setTanggal(i + 1)}
            className={`py-1 rounded-lg text-center ${selectedDate === i + 1 ? "bg-primary text-white font-bold" : "hover:bg-gray-200/50"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-4 md:p-6">
        <AdminHeader
          title="Laporan"
          subtitle="Kelola dan lihat laporan harian, mingguan, atau bulanan"
        />
        <div className="w-full max-w-6xl mx-auto mt-4 space-y-6">
          {/* ========== KOTAK PUTIH 1: FILTER ========== */}
          <div className="bg-white rounded-[20px] border border-gray-150 p-6 space-y-6 overflow-visible">
            {/* Jenis Laporan */}
            <div className="space-y-3">
              <h3 className="text-[13.5px] font-extrabold text-black uppercase tracking-wider">
                Jenis Laporan
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveTab("Semua")}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${
                    activeTab === "Semua"
                      ? "bg-purple-50 border-primary text-primary shadow-xs"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Semua</span>
                  <span>Laporan</span>
                </button>

                <button
                  onClick={() => setActiveTab("Pesanan")}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${
                    activeTab === "Pesanan"
                      ? "bg-purple-50 border-primary text-primary shadow-xs"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Total</span>
                  <span>Pesanan</span>
                </button>

                <button
                  onClick={() => setActiveTab("Pendapatan")}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${
                    activeTab === "Pendapatan"
                      ? "bg-purple-50 border-primary text-primary shadow-xs"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Laporan</span>
                  <span>Pendapatan</span>
                </button>

                <button
                  onClick={() => setActiveTab("Menu")}
                  className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${
                    activeTab === "Menu"
                      ? "bg-purple-50 border-primary text-primary shadow-xs"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Laporan</span>
                  <span>Menu</span>
                </button>
              </div>
            </div>

            {/* Rentang Waktu */}
            <div className="flex items-center gap-6 text-[13.5px] font-bold text-gray-500 border-b border-gray-100 pb-3">
              <button
                onClick={() => navigate("/admin/report")}
                className="pb-1 cursor-pointer text-black border-b-[2.5px] border-primary font-extrabold"
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
                className="pb-1 cursor-pointer"
              >
                Bulanan
              </button>
            </div>

            {/* Filter Tanggal */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Tanggal Mulai */}
              <div className="space-y-1 w-full sm:w-auto">
                <span className="text-[11.5px] text-black-400 font-bold block">
                  Tanggal Mulai
                </span>
                {renderCalendar(
                  bulanMulaiIdx,
                  tanggalMulai,
                  setTanggalMulai,
                  handlePrevBulanMulai,
                  handleNextBulanMulai,
                )}
              </div>

              {/* Tanggal Selesai */}
              <div className="space-y-1 w-full sm:w-auto">
                <span className="text-[11.5px] text-black-400 font-bold block">
                  Tanggal Selesai
                </span>
                {renderCalendar(
                  bulanSelesaiIdx,
                  tanggalSelesai,
                  setTanggalSelesai,
                  handlePrevBulanSelesai,
                  handleNextBulanSelesai,
                )}
              </div>
            </div>

            {/* Tombol Tampilkan Laporan */}
            <button
              onClick={handleTampilkanLaporan}
              disabled={loadingReport}
              className="bg-primary hover:opacity-95 text-white text-[12.5px] font-bold px-5 py-2.5 rounded-xs shadow-md cursor-pointer flex items-center gap-2"
            >
              <ReportIcon className="w-4 h-4" />
              {loadingReport ? "Memuat..." : "Tampilkan Laporan"}
            </button>
          </div>

          {/* ========== KOTAK PUTIH 2: TABEL LAPORAN ========== */}
          {showLaporan && (
            <div className="bg-white rounded-[20px] border border-gray-150 p-6">
              {/* 🔥 TOMBOL TUTUP 1 DI SINI 🔥 */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowLaporan(false)}
                  className="text-[12px] font-bold text-black hover:text-black"
                >
                  Tutup
                </button>
              </div>

              <div className="space-y-12">
                {(activeTab === "Semua" || activeTab === "Pesanan") && (
                  <LaporanTablePesanan
                    data={pesananData}
                    periode={periodeText}
                    //  enablePagination={true}
                    //   itemsPerPage={10}
                  />
                )}
                {(activeTab === "Semua" || activeTab === "Pendapatan") && (
                  <LaporanTablePendapatan
                    data={pendapatanData}
                    periode={periodeText}
                    //  enablePagination={true}
                    //   itemsPerPage={10}
                  />
                )}
                {(activeTab === "Semua" || activeTab === "Menu") && (
                  <LaporanTableMenu
                    data={menuData}
                    periode={periodeText}
                    //  enablePagination={true}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LaporanPage;
