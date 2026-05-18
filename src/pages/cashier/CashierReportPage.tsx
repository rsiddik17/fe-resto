import { useState, useMemo, useRef } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ReportSummaryCard from "../../components/Card/ReportSummaryCard";
import ReportTable from "../../components/Table/ReportTable";
import { Search, Download, FileSpreadsheet, Filter, ListOrdered, BadgeDollarSign, Calendar } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Toast from "../../components/Toast/Toast";

// --- MOCK DATA LAPORAN ---
const MOCK_REPORTS = [
  { id: 1, date: "05 Apr 2026", totalOrders: 135, completed: 130, canceled: 2, revenue: 3009876, isoDate: "2026-04-05" },
  { id: 2, date: "04 Apr 2026", totalOrders: 151, completed: 150, canceled: 1, revenue: 5987000, isoDate: "2026-04-04" },
  { id: 3, date: "03 Apr 2026", totalOrders: 155, completed: 155, canceled: 0, revenue: 6507984, isoDate: "2026-04-03" },
  { id: 4, date: "02 Apr 2026", totalOrders: 135, completed: 135, canceled: 0, revenue: 4876234, isoDate: "2026-04-02" },
  { id: 5, date: "01 Apr 2026", totalOrders: 144, completed: 143, canceled: 1, revenue: 5001100, isoDate: "2026-04-01" },
  { id: 6, date: "31 Mar 2026", totalOrders: 155, completed: 155, canceled: 0, revenue: 6654000, isoDate: "2026-03-31" },
  { id: 7, date: "30 Mar 2026", totalOrders: 162, completed: 162, canceled: 0, revenue: 7875000, isoDate: "2026-03-30" },
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
};

const CashierReportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- PERBAIKAN: Buat ref untuk memicu kalender secara paksa ---
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 4000); 
  };

  // --- PERBAIKAN LOGIC FILTER 1: KHUSUS TANGGAL (Untuk Summary Card) ---
  const dateFilteredReports = useMemo(() => {
    return MOCK_REPORTS.filter((report) => {
      let matchDate = true;
      if (startDate && endDate) {
        matchDate = report.isoDate >= startDate && report.isoDate <= endDate;
      } else if (startDate) {
        matchDate = report.isoDate >= startDate;
      } else if (endDate) {
        matchDate = report.isoDate <= endDate;
      }
      return matchDate;
    });
  }, [startDate, endDate]);

  // --- PERBAIKAN LOGIC FILTER 2: TANGGAL + SEARCH (Untuk Table) ---
  const tableFilteredReports = useMemo(() => {
    return dateFilteredReports.filter((report) => {
      return report.date.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, dateFilteredReports]);

  // --- KALKULASI SUMMARY CARD (Sekarang pakai dateFilteredReports, BUKAN yang ada search-nya) ---
  const totalSummaryPesanan = dateFilteredReports.reduce((acc, curr) => acc + curr.totalOrders, 0);
  const totalSummaryPendapatan = dateFilteredReports.reduce((acc, curr) => acc + curr.revenue, 0);

  // --- KONFIGURASI KOLOM TABEL (Bisa dipakai ulang) ---
  const orderColumns = [
    { header: "Tanggal", accessor: "date" },
    { header: "Total Pesanan", accessor: "totalOrders" },
    { header: "Pesanan Selesai", accessor: "completed" },
    { header: "Pesanan Cancel", accessor: "canceled" },
  ];

  const revenueColumns = [
    { header: "Tanggal", accessor: "date" },
    { header: "Total Pesanan", accessor: "totalOrders" },
    { header: "Total Pendapatan", accessor: "revenue", isCurrency: true },
  ];

  // --- HANDLER EXPORT ---
  const handleExportPDF = () => {
    if (tableFilteredReports.length === 0) {
      triggerToast("Tidak ada data untuk diekspor!");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Judul Dokumen
    doc.setFontSize(16);
    doc.text("Laporan Kasir IT'S Resto", 14, 15);
    
    // Rentang Tanggal (Opsional, biar laporannya jelas)
    doc.setFontSize(10);
    const dateText = (startDate || endDate) 
      ? `Periode: ${startDate || "-"} s/d ${endDate || "-"}`
      : "Periode: Semua Waktu";
    doc.text(dateText, 14, 22);

    // --- Tabel 1: Laporan Pesanan ---
    doc.setFontSize(12);
    doc.text("Laporan Total Pesanan", 14, 32);
    
    autoTable(doc, {
      startY: 36,
      head: [["Tanggal", "Total Pesanan", "Pesanan Selesai", "Pesanan Cancel"]],
      body: tableFilteredReports.map((row) => [
        row.date,
        row.totalOrders,
        row.completed,
        row.canceled,
      ]),
      headStyles: { fillColor: [121, 36, 142] }, // Warna ungu primary IT'S Resto
    });

    // --- Tabel 2: Laporan Pendapatan ---
    // Mengambil titik akhir koordinat Y dari tabel pertama agar tabel kedua tidak numpuk
    const finalY = (doc as any).lastAutoTable.finalY || 40; 
    
    doc.text("Laporan Total Pendapatan", 14, finalY + 12);
    
    autoTable(doc, {
      startY: finalY + 16,
      head: [["Tanggal", "Total Pesanan", "Total Pendapatan"]],
      body: tableFilteredReports.map((row) => [
        row.date,
        row.totalOrders,
        formatRupiah(row.revenue), // Pakai format rupiah untuk PDF biar cantik
      ]),
      headStyles: { fillColor: [121, 36, 142] },
    });

    // Download File
    doc.save("Laporan_Kasir_ITS_Resto.pdf");
  };

  const handleExportExcel = () => {
    if (tableFilteredReports.length === 0) {
      triggerToast("Tidak ada data untuk diekspor!");
      return;
    }

    // Buat Workbook Excel Baru
    const wb = XLSX.utils.book_new();

    // --- Sheet 1: Laporan Pesanan ---
    const pesananData = tableFilteredReports.map((row) => ({
      "Tanggal": row.date,
      "Total Pesanan": row.totalOrders,
      "Pesanan Selesai": row.completed,
      "Pesanan Cancel": row.canceled,
    }));
    const wsPesanan = XLSX.utils.json_to_sheet(pesananData);
    XLSX.utils.book_append_sheet(wb, wsPesanan, "Pesanan");

    // --- Sheet 2: Laporan Pendapatan ---
    const pendapatanData = tableFilteredReports.map((row) => ({
      "Tanggal": row.date,
      "Total Pesanan": row.totalOrders,
      "Total Pendapatan": row.revenue, // Biarkan angka murni agar bisa di-Sum di Excel
    }));
    const wsPendapatan = XLSX.utils.json_to_sheet(pendapatanData);
    XLSX.utils.book_append_sheet(wb, wsPendapatan, "Pendapatan");

    // Download File
    XLSX.writeFile(wb, "Laporan_Kasir_ITS_Resto.xlsx");
  };

  return (
    <>
      {/* 1. HEADER */}
      <div className="pt-7.5 pl-8 pr-6 shrink-0">
        <DashboardHeader
          title="Laporan"
          subtitle="Pantau laporan pendapatan dan pesanan"
          userName="Rina"
          roleName="Kasir"
        />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="pt-0 pb-6 px-8 flex flex-col flex-1">
        
        {/* --- ACTION BAR (Search & Export) --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative w-full lg:w-140">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black/50" />
            </div>
            <Input
              type="text"
              className="w-full pl-11 pr-4 py-2.5 text-[14px] rounded-sm border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-black/50 shadow-sm"
              placeholder="Cari laporan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button onClick={handleExportPDF} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary text-white font-bold py-2.5 px-5 rounded-sm shadow-sm hover:bg-primary-hover text-sm">
              <Download size={16} strokeWidth={2.5} /> Unduh Laporan
            </Button>
            <Button onClick={handleExportExcel} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary text-white font-bold py-2.5 px-5 rounded-sm shadow-sm hover:bg-primary-hover text-sm">
              <FileSpreadsheet size={16} strokeWidth={2.5} /> Ekspor Excel
            </Button>
          </div>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="mb-4">
          <div className="inline-flex flex-wrap items-center gap-3 bg-[#D9D9D9] px-1.5 py-1.25 rounded-sm">
            
            {/* Start Date */}
            <div className="flex items-center gap-2.5 pl-1.5">
              <span className="text-sm text-black/50">Start Date</span>
              {/* PERBAIKAN: Tambahkan onClick untuk trigger showPicker() */}
              <div 
                className="bg-white rounded-sm px-3 py-2 shadow-sm flex items-center gap-2 cursor-pointer"
                onClick={() => startDateRef.current?.showPicker()}
              >
                {/* Ikon di Kiri */}
                <Calendar className="w-4 h-4 text-black/50" strokeWidth={2.5} />
                
                {/* Teks Tanggal Custom */}
                <span className="text-sm text-black/50">
                  {startDate ? startDate.split('-').reverse().join('/') : "dd/mm/yyyy"}
                </span>

                {/* Input Asli (Sembunyikan 100% dengan sr-only) */}
                <input 
                  type="date" 
                  ref={startDateRef}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-black/50">End Date</span>
              {/* PERBAIKAN: Tambahkan onClick untuk trigger showPicker() */}
              <div 
                className="bg-white rounded-sm px-3 py-2 shadow-sm flex items-center gap-2 cursor-pointer"
                onClick={() => endDateRef.current?.showPicker()}
              >
                {/* Ikon di Kiri */}
                <Calendar className="w-4 h-4 text-black/50" strokeWidth={2.5} />
                
                {/* Teks Tanggal Custom */}
                <span className="text-sm text-black/50">
                  {endDate ? endDate.split('-').reverse().join('/') : "dd/mm/yyyy"}
                </span>

                {/* Input Asli (Sembunyikan 100% dengan sr-only) */}
                <input 
                  type="date" 
                  ref={endDateRef}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="sr-only"
                />
              </div>
            </div>

            <Button className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-8 rounded-sm shadow-sm hover:bg-primary-hover text-[13.5px]">
              <Filter size={16} strokeWidth={2.5} /> Filter
            </Button>
          </div>
        </div>

        {/* --- TAB HARIAN --- */}
        <div className="mb-6">
          <div className="inline-block bg-white border border-gray-200 px-6 py-2 rounded-sm text-[13.5px] text-black cursor-pointer">
            Harian
          </div>
        </div>

        {/* --- SUMMARY CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          <ReportSummaryCard 
            title="Total Pesanan" 
            value={totalSummaryPesanan.toLocaleString("id-ID")} 
            icon={<ListOrdered size={28} strokeWidth={2.5} />} 
          />
          <ReportSummaryCard 
            title="Total Pemasukan" 
            value={formatRupiah(totalSummaryPendapatan)} 
            icon={<BadgeDollarSign size={28} strokeWidth={2.5} />} 
          />
        </div>

        {/* --- TABLES --- */}
        <ReportTable 
          title="Laporan Total Pesanan" 
          columns={orderColumns} 
          data={tableFilteredReports} 
        />
        
        <ReportTable 
          title="Laporan Total Pendapatan" 
          columns={revenueColumns} 
          data={tableFilteredReports} 
        />

      </div>

      <Toast show={toast.show} message={toast.message} />
    </>
  );
};

export default CashierReportPage;