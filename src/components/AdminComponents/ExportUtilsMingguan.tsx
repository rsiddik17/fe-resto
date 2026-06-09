// utils/exportUtilsMingguan.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ========== PESANAN MINGGUAN ==========
export const eksporKePDFPesananMingguan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Total Pesanan (Mingguan)", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);
  
  const totalPesanan = data.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalSelesai = data.reduce((sum, item) => sum + item.selesai, 0);
  const totalCancel = data.reduce((sum, item) => sum + item.cancel, 0);
  
  autoTable(doc, {
    head: [["NO", "MINGGU", "TOTAL PESANAN", "PESANAN SELESAI", "PESANAN CANCEL"]],
    body: [
      ...data.map((item, i) => [i + 1, item.minggu, item.totalPesanan, item.selesai, item.cancel]),
      ["", "Total", totalPesanan, totalSelesai, totalCancel]
    ],
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });
  
  doc.save(`Laporan_Pesanan_Mingguan_${periode.replace(/\s/g, "_")}.pdf`);
};

export const eksporKeExcelPesananMingguan = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "MINGGU", "TOTAL PESANAN", "PESANAN SELESAI", "PESANAN CANCEL"];
  
  const totalPesanan = data.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalSelesai = data.reduce((sum, item) => sum + item.selesai, 0);
  const totalCancel = data.reduce((sum, item) => sum + item.cancel, 0);
  
  const rows = data.map((item, i) => [i + 1, item.minggu, item.totalPesanan, item.selesai, item.cancel]);
  
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN TOTAL PESANAN (MINGGUAN)`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
    ["", "Total", totalPesanan, totalSelesai, totalCancel]
  ]);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pesanan Mingguan");
  XLSX.writeFile(workbook, `Laporan_Pesanan_Mingguan_${periode.replace(/\s/g, "_")}.xlsx`);
};

// ========== PENDAPATAN MINGGUAN ==========
export const eksporKePDFPendapatanMingguan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Total Pendapatan (Mingguan)", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);
  
  const totalPesanan = data.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalPendapatan = data.reduce((sum, item) => sum + item.pendapatan, 0);
  
  autoTable(doc, {
    head: [["NO", "MINGGU", "TOTAL PESANAN", "TOTAL PENDAPATAN"]],
    body: [
      ...data.map((item, i) => [i + 1, item.minggu, item.totalPesanan, `Rp ${item.pendapatan.toLocaleString("id-ID")}`]),
      ["", "Total", totalPesanan, `Rp ${totalPendapatan.toLocaleString("id-ID")}`]
    ],
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });
  
  doc.save(`Laporan_Pendapatan_Mingguan_${periode.replace(/\s/g, "_")}.pdf`);
};

export const eksporKeExcelPendapatanMingguan = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "MINGGU", "TOTAL PESANAN", "TOTAL PENDAPATAN"];
  
  const totalPesanan = data.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalPendapatan = data.reduce((sum, item) => sum + item.pendapatan, 0);
  
  const rows = data.map((item, i) => [i + 1, item.minggu, item.totalPesanan, `Rp ${item.pendapatan.toLocaleString("id-ID")}`]);
  
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN TOTAL PENDAPATAN (MINGGUAN)`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
    ["", "Total", totalPesanan, `Rp ${totalPendapatan.toLocaleString("id-ID")}`]
  ]);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pendapatan Mingguan");
  XLSX.writeFile(workbook, `Laporan_Pendapatan_Mingguan_${periode.replace(/\s/g, "_")}.xlsx`);
};

// ========== MENU MINGGUAN ==========
export const eksporKePDFMenuMingguan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Menu Terlaris (Mingguan)", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);
  
  autoTable(doc, {
    head: [["NO", "NAMA MENU", "HARGA", "KATEGORI", "TOTAL TERJUAL"]],
    body: data.map((item, i) => [i + 1, item.nama, `Rp ${item.harga.toLocaleString("id-ID")}`, item.kategori, item.total]),
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });
  
  doc.save(`Laporan_Menu_Mingguan_${periode.replace(/\s/g, "_")}.pdf`);
};

export const eksporKeExcelMenuMingguan = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "NAMA MENU", "HARGA", "KATEGORI", "TOTAL TERJUAL"];
  const rows = data.map((item, i) => [i + 1, item.nama, `Rp ${item.harga.toLocaleString("id-ID")}`, item.kategori, item.total]);
  
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN MENU TERLARIS (MINGGUAN)`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
  ]);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Menu Mingguan");
  XLSX.writeFile(workbook, `Laporan_Menu_Mingguan_${periode.replace(/\s/g, "_")}.xlsx`);
};