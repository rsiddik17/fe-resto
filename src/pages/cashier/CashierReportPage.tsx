import { useState, useMemo, useRef, useEffect } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Button from "../../components/ui/Button";
import StatCardCashier from "../../components/Card/StatCardCashier";
import ReportTable, {
  type DailySaleItem,
} from "../../components/Table/ReportTable";
import { Calendar, ListOrdered, BadgeDollarSign } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Toast from "../../components/Toast/Toast";
import ExportPdfIcon from "../../components/Icon/ExportPdfIcon";
import { useProfile } from "../../hooks/useProfile";
import { orderAPI } from "../../api/order.api";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

type SortKey = "orderId" | "time" | "foods" | "drinks" | "bank" | "total";
type SortDirection = "asc" | "desc";

const CashierReportPage = () => {
  const { firstName, roleName } = useProfile();

  // --- STATE ---
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // STATE DATA API
  const [salesData, setSalesData] = useState<DailySaleItem[]>([]);
  const [summaryData, setSummaryData] = useState({
    totalOrder: 0,
    totalSales: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // State Sorting (Default null, ketika diklik baru ASC)
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);

  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  // --- 1. FETCH DATA API LAPORAN ---
  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getReportOrders(selectedDate);
      
      if (response.success && response.data) {
        // Ambil summary dari backend
        setSummaryData({
          totalOrder: response.data.summary?.totalOrder || 0,
          totalSales: response.data.summary?.totalSales || 0,
        });

        // Map transaksi ke format UI (DailySaleItem)
        const mappedTransactions: DailySaleItem[] = response.data.transactions.map((t: any) => {
          // Bentuk string Makanan ("1x Nasi Goreng, 2x Sate")
          const foodsString = t.order_items?.foods
            ?.map((f: any) => `${f.quantity}x ${f.name}`)
            .join(", ") || "";

          // Bentuk string Minuman ("2x Jus Mangga")
          const drinksString = t.order_items?.drinks
            ?.map((d: any) => `${d.quantity}x ${d.name}`)
            .join(", ") || "";

          // Ambil jam ("14:30")
          const timeString = new Date(t.create_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            id: t.order_id,
            orderId: `#${t.order_id}`,
            time: timeString,
            foods: foodsString,
            drinks: drinksString,
            bank: t.payment_method || "-",
            total: Number(t.grand_total_amount || 0),
            date: selectedDate, 
          };
        });

        setSalesData(mappedTransactions);
      } else {
        setSalesData([]);
        setSummaryData({ totalOrder: 0, totalSales: 0 });
      }
    } catch (error) {
      console.error("Gagal menarik data laporan:", error);
      triggerToast("Gagal memuat laporan. Silakan coba lagi.");
      setSalesData([]);
      setSummaryData({ totalOrder: 0, totalSales: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Jalankan fetch tiap kali selectedDate berubah
  useEffect(() => {
    fetchReportData();
  }, [selectedDate]);


  // --- 2. LOGIC SORTING TINGKAT PAGE ---
  const sortedSales = useMemo(() => {
    const sortableItems = [...salesData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [salesData, sortConfig]);

  // --- HANDLER SORTING KLIK ---
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc"; // Default kalau baru di-klik
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- HANDLER EXPORT PDF ---
  const handleExportPDF = () => {
    if (sortedSales.length === 0) {
      triggerToast("Tidak ada data untuk diekspor!");
      return;
    }

    const doc = new jsPDF("l", "mm", "a4"); // Landscape karena nested header cukup memakan ruang horizontal
    doc.setFontSize(16);
    doc.text("Laporan Penjualan Harian IT'S Resto", 14, 15);

    doc.setFontSize(11);
    doc.text(
      `Tanggal: ${selectedDate ? selectedDate.split("-").reverse().join("/") : "Semua"}`,
      14,
      22,
    );

    autoTable(doc, {
      startY: 28,
      head: [
        [
          { content: "NO", rowSpan: 2, styles: { halign: "center" } },
          { content: "ID PESANAN", rowSpan: 2 },
          { content: "JAM PEMESANAN", rowSpan: 2 },
          { content: "PESANAN", colSpan: 2, styles: { halign: "center" } },
          { content: "NAMA BANK", rowSpan: 2 },
          { content: "TOTAL", rowSpan: 2 },
        ],
        ["MAKANAN", "MINUMAN"],
      ],
      // Ekspor array yang sudah di-Sort
      body: sortedSales.map((row, index) => [
        index + 1,
        row.orderId,
        row.time,
        row.foods,
        row.drinks,
        row.bank,
        formatRupiah(row.total),
      ]),
      headStyles: { fillColor: [121, 36, 142], textColor: 255 },
      theme: "grid",
      styles: { fontSize: 9 },
    });

    doc.save(`Laporan_Harian_${selectedDate || "Semua"}.pdf`);
  };

  // --- HANDLER EXPORT EXCEL ---
  const handleExportExcel = () => {
    if (sortedSales.length === 0) {
      triggerToast("Tidak ada data untuk diekspor!");
      return;
    }

    const wb = XLSX.utils.book_new();
    const excelData = sortedSales.map((row, index) => ({
      NO: index + 1,
      "ID PESANAN": row.orderId,
      "JAM PEMESANAN": row.time,
      MAKANAN: row.foods,
      MINUMAN: row.drinks,
      "NAMA BANK": row.bank,
      TOTAL: row.total,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Harian");
    XLSX.writeFile(wb, `Laporan_Harian_${selectedDate || "Semua"}.xlsx`);
  };

  return (
    <>
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0 shrink-0">
        <DashboardHeader
          title="Laporan"
          subtitle="Pantau laporan pendapatan dan pesanan"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-6 lg:pb-6 px-4 lg:px-8 flex flex-col flex-1">
        {/* --- START DATE FILTER --- */}
        <div className="mb-5">
          <label className="block text-[14.5px] font-medium text-black mb-2">
            Start Date
          </label>
          <div
            className="bg-white border border-gray-200 rounded-md px-4 py-2 w-fit shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => dateInputRef.current?.showPicker()}
          >
            <Calendar className="w-5 h-5 text-black" strokeWidth={2} />
            <span className="text-[14.5px] font-medium text-black min-w-25">
              {selectedDate
                ? selectedDate.split("-").reverse().join("/")
                : "Pilih Tanggal"}
            </span>
            <input
              type="date"
              ref={dateInputRef}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="sr-only"
            />
          </div>
        </div>

        {/* --- SUMMARY CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 w-full lg:max-w-4xl">
          <StatCardCashier
            title="Total Pesanan"
            value={summaryData.totalOrder.toLocaleString("id-ID")}
            Icon={ListOrdered}
          />
          <StatCardCashier
            title="Total Pemasukan"
            value={formatRupiah(summaryData.totalSales)}
            Icon={BadgeDollarSign}
          />
        </div>

        {/* --- SECTION TITLE & EXPORT BUTTONS --- */}
        <h2 className="text-xl md:text-[22px] font-bold mb-4">
          Laporan Penjualan Harian
        </h2>
        <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-4 mb-4">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button
              onClick={handleExportPDF}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1 bg-primary text-white font-semibold py-2.25 px-6 rounded-sm shadow-sm hover:bg-primary-hover text-[13.5px] md:text-[14px] lg:text-[14px]"
            >
              <ExportPdfIcon className="w-6 h-6 text-white" /> Ekspor PDF
            </Button>
            <Button
              onClick={handleExportExcel}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1 bg-primary text-white font-semibold py-2.25 px-6 rounded-sm shadow-sm hover:bg-primary-hover text-[13.5px] md:text-[14px] lg:text-[14px]"
            >
              <ExportPdfIcon className="w-6 h-6 text-white" /> Ekspor Excel
            </Button>
          </div>
        </div>

        {/* --- CUSTOM NESTED TABLE --- */}
        <ReportTable
          data={sortedSales}
          sortConfig={sortConfig}
          onSort={handleSort}
          isLoading={isLoading}
        />
      </div>

      <Toast show={toast.show} message={toast.message} />
    </>
  );
};

export default CashierReportPage;
