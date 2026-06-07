import { useState } from "react";
import { useNavigate } from "react-router";
// import { FileText, FileSpreadsheet } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import FilterMingguan from "../../components/AdminComponents/FilterMingguan";
import TabelPesananMingguan from "../../components/AdminComponents/TabelPesananMingguan";
import TabelPendapatanMingguan from "../../components/AdminComponents/TabelPendapatanMingguan";
import ReportIcon from "../../components/Icon/ReportIcon";
import TabelMenuMingguan from "../../components/AdminComponents/TabelMenuMingguan";

// DATA DUMMY MINGGUAN
const DATA_PESANAN_MINGGUAN = [
  { id: 1, minggu: "Minggu 1", totalPesanan: 980, selesai: 975, cancel: 5 },
  { id: 2, minggu: "Minggu 2", totalPesanan: 1050, selesai: 1050, cancel: 0 },
  { id: 3, minggu: "Minggu 3", totalPesanan: 1100, selesai: 1098, cancel: 2 },
  { id: 4, minggu: "Minggu 4", totalPesanan: 1020, selesai: 1019, cancel: 1 },
  { id: 5, minggu: "Minggu 5", totalPesanan: 1031, selesai: 1031, cancel: 0 },
];

const DATA_PENDAPATAN_MINGGUAN = [
  { id: 1, minggu: "Minggu 1", totalPesanan: 975, pendapatan: 38742150 },
  { id: 2, minggu: "Minggu 2", totalPesanan: 1050, pendapatan: 39856320 },
  { id: 3, minggu: "Minggu 3", totalPesanan: 1098, pendapatan: 41203875 },
  { id: 4, minggu: "Minggu 4", totalPesanan: 1019, pendapatan: 38965440 },
  { id: 5, minggu: "Minggu 5", totalPesanan: 1031, pendapatan: 39978000 },
];

const DATA_MENU_MINGGUAN = [
  { id: 1, nama: "Es Teler", harga: 20000, kategori: "Minuman", total: 210 },
  {
    id: 2,
    nama: "Mie Ayam Bakso",
    harga: 30000,
    kategori: "Makanan",
    total: 205,
  },
  { id: 3, nama: "Ayam Penyet", harga: 40000, kategori: "Makanan", total: 200 },
  {
    id: 4,
    nama: "Nasi Goreng Kambing",
    harga: 40000,
    kategori: "Makanan",
    total: 195,
  },
  { id: 5, nama: "Sate Ayam", harga: 40000, kategori: "Makanan", total: 190 },
  { id: 6, nama: "Sop Iga", harga: 50000, kategori: "Makanan", total: 185 },
  { id: 7, nama: "Lychee Tea", harga: 20000, kategori: "Minuman", total: 180 },
  { id: 8, nama: "Gado-gado", harga: 30000, kategori: "Makanan", total: 165 },
  {
    id: 9,
    nama: "Matcha Latte",
    harga: 30000,
    kategori: "Minuman",
    total: 160,
  },
  { id: 10, nama: "Lemon Tea", harga: 20000, kategori: "Minuman", total: 158 },
  { id: 11, nama: "Bakso Urat", harga: 30000, kategori: "Makanan", total: 151 },
  { id: 12, nama: "Le Mineral", harga: 5000, kategori: "Minuman", total: 150 },
  {
    id: 13,
    nama: "Jus Alpukat",
    harga: 20000,
    kategori: "Minuman",
    total: 148,
  },
  { id: 14, nama: "Dimsum", harga: 30000, kategori: "Makanan", total: 145 },
  { id: 15, nama: "Jus Mangga", harga: 20000, kategori: "Minuman", total: 143 },
  { id: 16, nama: "Nasi Bakar", harga: 30000, kategori: "Makanan", total: 140 },
  {
    id: 17,
    nama: "Nasi Goreng",
    harga: 30000,
    kategori: "Makanan",
    total: 138,
  },
  { id: 18, nama: "Es Jeruk", harga: 20000, kategori: "Minuman", total: 135 },
  { id: 19, nama: "Soto Ayam", harga: 40000, kategori: "Makanan", total: 133 },
  { id: 20, nama: "Nasi Liwet", harga: 30000, kategori: "Makanan", total: 130 },
  { id: 21, nama: "Kopi Susu", harga: 20000, kategori: "Minuman", total: 128 },
  {
    id: 22,
    nama: "Nasi Goreng Udang",
    harga: 40000,
    kategori: "Makanan",
    total: 125,
  },
  {
    id: 23,
    nama: "Nasi Kuning",
    harga: 30000,
    kategori: "Makanan",
    total: 123,
  },
  {
    id: 24,
    nama: "Milkshake Stroberi",
    harga: 20000,
    kategori: "Minuman",
    total: 120,
  },
  {
    id: 25,
    nama: "Nasi Kebuli",
    harga: 50000,
    kategori: "Makanan",
    total: 118,
  },
  {
    id: 26,
    nama: "Cireng Bumbu Rujak",
    harga: 20000,
    kategori: "Makanan",
    total: 115,
  },
  {
    id: 27,
    nama: "Roti Bakar Cokelat",
    harga: 20000,
    kategori: "Makanan",
    total: 112,
  },
  {
    id: 28,
    nama: "Es Kelapa Muda",
    harga: 20000,
    kategori: "Minuman",
    total: 110,
  },
  { id: 29, nama: "Pempek", harga: 40000, kategori: "Makanan", total: 108 },
  {
    id: 30,
    nama: "Jus Stroberi",
    harga: 20000,
    kategori: "Minuman",
    total: 105,
  },
  {
    id: 31,
    nama: "Kwetiau Goreng",
    harga: 30000,
    kategori: "Makanan",
    total: 100,
  },
  { id: 32, nama: "Capcay", harga: 30000, kategori: "Makanan", total: 95 },
  { id: 33, nama: "Jus Jambu", harga: 20000, kategori: "Minuman", total: 90 },
  { id: 34, nama: "Nasi Putih", harga: 10000, kategori: "Makanan", total: 85 },
  { id: 35, nama: "Es Kuwut", harga: 20000, kategori: "Minuman", total: 80 },
  { id: 36, nama: "Es Cincau", harga: 20000, kategori: "Minuman", total: 72 },
];

const LaporanMingguanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "Semua" | "Pesanan" | "Pendapatan" | "Menu"
  >("Semua");
  const [bulan, setBulan] = useState("Maret");
  const [tahun, setTahun] = useState("2026");
  const [showLaporan, setShowLaporan] = useState(false);

  // 🆕 State untuk menyimpan data yang sudah di-sort
  const [sortedPesanan, setSortedPesanan] = useState(DATA_PESANAN_MINGGUAN);
  const [sortedPendapatan, setSortedPendapatan] = useState(
    DATA_PENDAPATAN_MINGGUAN,
  );

  const periodeText = `Minggu 1 - Minggu 5 Bulan ${bulan} ${tahun}`;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-4 md:p-6">
        <AdminHeader
          title="Laporan"
          subtitle="Kelola dan lihat laporan harian, mingguan, atau bulanan"
        />

        <div className="w-full max-w-6xl mx-auto mt-4 space-y-6">
          {/* KOTAK PUTIH 1: FILTER */}
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
                className="pb-1 cursor-pointer"
              >
                Harian
              </button>
              <button
                onClick={() => navigate("/admin/report/weekly")}
                className="pb-1 cursor-pointer text-black border-b-[2.5px] border-primary font-extrabold"
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

            {/* Filter Mingguan */}
            <FilterMingguan
              onFilterChange={(b, t) => {
                setBulan(b);
                setTahun(t);
              }}
            />

            <button
              onClick={() => setShowLaporan(true)}
              className="bg-primary hover:opacity-95 text-white text-[12.5px] font-bold px-5 py-2.5 rounded-xs shadow-md cursor-pointer flex items-center gap-2"
            >
              <ReportIcon size={16} />
              Tampilkan Laporan
            </button>
          </div>

          {/* KOTAK PUTIH 2: TABEL LAPORAN */}
          {showLaporan && (
            <div className="bg-white rounded-[20px] border border-gray-150 p-6 space-y-6 overflow-visible">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowLaporan(false)}
                  className="text-[12px] font-bold text-black hover:text-black"
                >
                  Tutup
                </button>
              </div>

              <div className="space-y-12">
                {/* LAPORAN PESANAN */}
                {(activeTab === "Semua" || activeTab === "Pesanan") && (
                  <TabelPesananMingguan
                    data={DATA_PESANAN_MINGGUAN}
                    periode={periodeText}
                    enablePagination={true}
                    itemsPerPage={10}
                  />
                )}

                {/* LAPORAN PENDAPATAN */}
                {(activeTab === "Semua" || activeTab === "Pendapatan") && (
                  <TabelPendapatanMingguan
                    data={DATA_PENDAPATAN_MINGGUAN}
                    periode={periodeText}
                    enablePagination={true}
                    itemsPerPage={10}
                  />
                )}
                {/* LAPORAN MENU */}
                {(activeTab === "Semua" || activeTab === "Menu") && (
                  <TabelMenuMingguan
                    data={DATA_MENU_MINGGUAN}
                    periode={periodeText}
                    enablePagination={true}
                    itemsPerPage={10}
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

export default LaporanMingguanPage;
