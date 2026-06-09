import { useState,  useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import FilterBulanan from "../../components/AdminComponents/FilterBulanan";
import TabelPesananBulanan from "../../components/AdminComponents/TabelPesananBulanan";
import TabelPendapatanBulanan from "../../components/AdminComponents/TabelPendapatanBulanan";
import LaporanTableMenuBulanan from "../../components/AdminComponents/LaporanTabelMenuBulanan";
import ReportIcon from "../../components/Icon/ReportIcon";

// ========== DATA BULANAN ==========
const DATA_PESANAN_BULANAN = [
  { id: 1, bulan: "Januari", totalPesanan: 5150, selesai: 5145, cancel: 5 },
  { id: 2, bulan: "Februari", totalPesanan: 5200, selesai: 5196, cancel: 4 },
  { id: 3, bulan: "Maret", totalPesanan: 5181, selesai: 5173, cancel: 8 },
  { id: 4, bulan: "April", totalPesanan: 5100, selesai: 5095, cancel: 5 },
  { id: 5, bulan: "Mei", totalPesanan: 5300, selesai: 5290, cancel: 10 },
  { id: 6, bulan: "Juni", totalPesanan: 5250, selesai: 5245, cancel: 5 },
  { id: 7, bulan: "Juli", totalPesanan: 5400, selesai: 5395, cancel: 5 },
  { id: 8, bulan: "Agustus", totalPesanan: 5350, selesai: 5345, cancel: 5 },
  { id: 9, bulan: "September", totalPesanan: 5200, selesai: 5195, cancel: 5 },
  { id: 10, bulan: "Oktober", totalPesanan: 5450, selesai: 5445, cancel: 5 },
  { id: 11, bulan: "November", totalPesanan: 5500, selesai: 5495, cancel: 5 },
  { id: 12, bulan: "Desember", totalPesanan: 5600, selesai: 5595, cancel: 5 },
];

const DATA_PENDAPATAN_BULANAN = [
  { id: 1, bulan: "Januari", totalPesanan: 5145, pendapatan: 38742150 },
  { id: 2, bulan: "Februari", totalPesanan: 5196, pendapatan: 39856320 },
  { id: 3, bulan: "Maret", totalPesanan: 5173, pendapatan: 41203875 },
  { id: 4, bulan: "April", totalPesanan: 5095, pendapatan: 39500000 },
  { id: 5, bulan: "Mei", totalPesanan: 5290, pendapatan: 41000000 },
  { id: 6, bulan: "Juni", totalPesanan: 5245, pendapatan: 40500000 },
  { id: 7, bulan: "Juli", totalPesanan: 5395, pendapatan: 42500000 },
  { id: 8, bulan: "Agustus", totalPesanan: 5345, pendapatan: 42000000 },
  { id: 9, bulan: "September", totalPesanan: 5195, pendapatan: 40800000 },
  { id: 10, bulan: "Oktober", totalPesanan: 5445, pendapatan: 43000000 },
  { id: 11, bulan: "November", totalPesanan: 5495, pendapatan: 43500000 },
  { id: 12, bulan: "Desember", totalPesanan: 5595, pendapatan: 44500000 },
];

const DATA_MENU_BULANAN = [
  { id: 1, nama: "Es Teler", harga: 20000, kategori: "Minuman", total: 210 },
  { id: 2, nama: "Mie Ayam Bakso", harga: 30000, kategori: "Makanan", total: 205 },
  { id: 3, nama: "Ayam Penyet", harga: 40000, kategori: "Makanan", total: 200 },
  { id: 4, nama: "Nasi Goreng Kambing", harga: 40000, kategori: "Makanan", total: 195 },
  { id: 5, nama: "Sate Ayam", harga: 40000, kategori: "Makanan", total: 190 },
  { id: 6, nama: "Sop Iga", harga: 50000, kategori: "Makanan", total: 185 },
  { id: 7, nama: "Lychee Tea", harga: 20000, kategori: "Minuman", total: 180 },
  { id: 8, nama: "Gado-gado", harga: 30000, kategori: "Makanan", total: 165 },
  { id: 9, nama: "Matcha Latte", harga: 30000, kategori: "Minuman", total: 160 },
  { id: 10, nama: "Lemon Tea", harga: 20000, kategori: "Minuman", total: 158 },
  { id: 11, nama: "Bakso Urat", harga: 30000, kategori: "Makanan", total: 151 },
  { id: 12, nama: "Le Mineral", harga: 5000, kategori: "Minuman", total: 150 },
  { id: 13, nama: "Jus Alpukat", harga: 20000, kategori: "Minuman", total: 148 },
  { id: 14, nama: "Dimsum", harga: 30000, kategori: "Makanan", total: 145 },
  { id: 15, nama: "Jus Mangga", harga: 20000, kategori: "Minuman", total: 143 },
  { id: 16, nama: "Nasi Bakar", harga: 30000, kategori: "Makanan", total: 140 },
  { id: 17, nama: "Nasi Goreng", harga: 30000, kategori: "Makanan", total: 138 },
  { id: 18, nama: "Es Jeruk", harga: 20000, kategori: "Minuman", total: 135 },
  { id: 19, nama: "Soto Ayam", harga: 40000, kategori: "Makanan", total: 133 },
  { id: 20, nama: "Nasi Liwet", harga: 30000, kategori: "Makanan", total: 130 },
  { id: 21, nama: "Kopi Susu", harga: 20000, kategori: "Minuman", total: 128 },
  { id: 22, nama: "Nasi Goreng Udang", harga: 40000, kategori: "Makanan", total: 125 },
  { id: 23, nama: "Nasi Kuning", harga: 30000, kategori: "Makanan", total: 123 },
  { id: 24, nama: "Milkshake Stroberi", harga: 20000, kategori: "Minuman", total: 120 },
  { id: 25, nama: "Nasi Kebuli", harga: 50000, kategori: "Makanan", total: 118 },
  { id: 26, nama: "Cireng Bumbu Rujak", harga: 20000, kategori: "Makanan", total: 115 },
  { id: 27, nama: "Roti Bakar Cokelat", harga: 20000, kategori: "Makanan", total: 112 },
  { id: 28, nama: "Es Kelapa Muda", harga: 20000, kategori: "Minuman", total: 110 },
  { id: 29, nama: "Pempek", harga: 40000, kategori: "Makanan", total: 108 },
  { id: 30, nama: "Jus Stroberi", harga: 20000, kategori: "Minuman", total: 105 },
  { id: 31, nama: "Kwetiau Goreng", harga: 30000, kategori: "Makanan", total: 100 },
  { id: 32, nama: "Capcay", harga: 30000, kategori: "Makanan", total: 95 },
  { id: 33, nama: "Jus Jambu", harga: 20000, kategori: "Minuman", total: 90 },
  { id: 34, nama: "Nasi Putih", harga: 10000, kategori: "Makanan", total: 85 },
  { id: 35, nama: "Es Kuwut", harga: 20000, kategori: "Minuman", total: 80 },
  { id: 36, nama: "Es Cincau", harga: 20000, kategori: "Minuman", total: 72 },
];

// ========== KOMPONEN ==========
const LaporanBulananPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Semua" | "Pesanan" | "Pendapatan" | "Menu">("Semua");
  const [selectedBulans, setSelectedBulans] = useState<string[]>(["Januari", "Februari", "Maret"]);
  const [tahun, setTahun] = useState("2026");
  const [showLaporan, setShowLaporan] = useState(false);

  const filteredPesanan = useMemo(() => {
    return DATA_PESANAN_BULANAN.filter((item) => selectedBulans.includes(item.bulan));
  }, [selectedBulans]);

  const filteredPendapatan = useMemo(() => {
    return DATA_PENDAPATAN_BULANAN.filter((item) => selectedBulans.includes(item.bulan));
  }, [selectedBulans]);

  const periodeText = useMemo(() => {
    if (selectedBulans.length === 0) return "Tidak ada bulan dipilih";
    if (selectedBulans.length === 12) return `Tahun ${tahun}`;
    if (selectedBulans.length === 1) return `Bulan ${selectedBulans[0]} ${tahun}`;
    return `Bulan ${selectedBulans[0]} - ${selectedBulans[selectedBulans.length - 1]} ${tahun}`;
  }, [selectedBulans, tahun]);

  const handleFilterChange = useCallback((bulanList: string[], thn: string) => {
    setSelectedBulans(bulanList);
    setTahun(thn);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-4 md:p-6">
        <AdminHeader title="Laporan" subtitle="Kelola dan lihat laporan harian, mingguan, atau bulanan" />

        <div className="w-full max-w-6xl mx-auto mt-4 space-y-6">
          {/* FILTER */}
          <div className="bg-white rounded-[20px] border border-gray-150 p-6 space-y-6 overflow-visible">
            <div className="space-y-3">
              <h3 className="text-[13.5px] font-extrabold text-black uppercase tracking-wider">Jenis Laporan</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button onClick={() => setActiveTab("Semua")} className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Semua" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  <span>Semua</span><span>Laporan</span>
                </button>
                <button onClick={() => setActiveTab("Pesanan")} className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Pesanan" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  <span>Total</span><span>Pesanan</span>
                </button>
                <button onClick={() => setActiveTab("Pendapatan")} className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Pendapatan" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  <span>Laporan</span><span>Pendapatan</span>
                </button>
                <button onClick={() => setActiveTab("Menu")} className={`py-3 px-4 rounded-xs border text-[13px] font-bold text-center transition-all cursor-pointer flex flex-col items-center ${activeTab === "Menu" ? "bg-purple-50 border-primary text-primary shadow-xs" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                  <span>Laporan</span><span>Menu</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[13.5px] font-bold text-gray-500 border-b border-gray-100 pb-3">
              <button onClick={() => navigate("/admin/report")} className="pb-1 cursor-pointer">Harian</button>
              <button onClick={() => navigate("/admin/report/weekly")} className="pb-1 cursor-pointer">Mingguan</button>
              <button onClick={() => navigate("/admin/report/monthly")} className="pb-1 cursor-pointer text-black border-b-[2.5px] border-primary font-extrabold">Bulanan</button>
            </div>

            <FilterBulanan onFilterChange={handleFilterChange} />

            <button onClick={() => setShowLaporan(true)} className="bg-primary hover:opacity-95 text-white text-[12.5px] font-bold px-5 py-2.5 rounded-xs shadow-md cursor-pointer flex items-center gap-2">
              <ReportIcon className="w-4 h-4" /> Tampilkan Laporan
            </button>
          </div>

          {/* TABEL LAPORAN */}
          {showLaporan && selectedBulans.length > 0 && (
            <div className="bg-white rounded-[20px] border border-gray-150 p-6">
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowLaporan(false)} className="text-[12px] font-bold text-black hover:text-black">Tutup</button>
              </div>

              <div className="space-y-12">
                {(activeTab === "Semua" || activeTab === "Pesanan") && filteredPesanan.length > 0 && (
                  <TabelPesananBulanan data={filteredPesanan} periode={periodeText} enablePagination={true} itemsPerPage={10} />
                )}

                {(activeTab === "Semua" || activeTab === "Pendapatan") && filteredPendapatan.length > 0 && (
                  <TabelPendapatanBulanan data={filteredPendapatan} periode={periodeText} enablePagination={true} itemsPerPage={10} />
                )}

                {(activeTab === "Semua" || activeTab === "Menu") && (
                  <LaporanTableMenuBulanan data={DATA_MENU_BULANAN} periode={periodeText} />
                )}
              </div>
            </div>
          )}

          {showLaporan && selectedBulans.length === 0 && (
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