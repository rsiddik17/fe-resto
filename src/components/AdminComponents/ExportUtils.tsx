import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ========== PESANAN ==========
export const eksporKePDFPesanan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Total Pesanan", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);
  
  const totalPesanan = data.reduce((sum, item) => sum + item.total, 0);
  const totalSelesai = data.reduce((sum, item) => sum + item.selesai, 0);
  const totalCancel = data.reduce((sum, item) => sum + item.cancel, 0);
  
  autoTable(doc, {
    head: [["NO", "TANGGAL", "TOTAL PESANAN", "PESANAN SELESAI", "PESANAN CANCEL"]],
    body: [
      ...data.map((item, i) => [i + 1, item.tanggal, item.total, item.selesai, item.cancel]),
      ["", "Total", totalPesanan, totalSelesai, totalCancel]
    ],
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });

  doc.save(`Laporan_Total_Pesanan_${periode.replace(/\s/g, "_")}.pdf`);
};

export const eksporKeExcelPesanan = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "TANGGAL", "TOTAL PESANAN", "PESANAN SELESAI", "PESANAN CANCEL"];
  
  const totalPesanan = data.reduce((sum, item) => sum + item.total, 0);
  const totalSelesai = data.reduce((sum, item) => sum + item.selesai, 0);
  const totalCancel = data.reduce((sum, item) => sum + item.cancel, 0);
  
  const rows = data.map((item, i) => [i + 1, item.tanggal, item.total, item.selesai, item.cancel]);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN TOTAL PESANAN`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
    ["", "Total", totalPesanan, totalSelesai, totalCancel]
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Total Pesanan");
  XLSX.writeFile(workbook, `Laporan_Total_Pesanan_${periode.replace(/\s/g, "_")}.xlsx`);
};

// ========== PENDAPATAN ==========
export const eksporKePDFPendapatan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Total Pendapatan", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);
  
  const totalPesanan = data.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalPendapatan = data.reduce((sum, item) => sum + item.pendapatan, 0);

  autoTable(doc, {
    head: [["NO", "TANGGAL", "TOTAL PESANAN", "TOTAL PENDAPATAN"]],
    body: [
      ...data.map((item, i) => [i + 1, item.tanggal, item.totalPesanan, `Rp ${item.pendapatan.toLocaleString("id-ID")}`]),
      ["", "Total", totalPesanan, `Rp ${totalPendapatan.toLocaleString("id-ID")}`]
    ],
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });

  doc.save(`Laporan_Total_Pendapatan_${periode.replace(/\s/g, "_")}.pdf`);
};

export const eksporKeExcelPendapatan = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "TANGGAL", "TOTAL PESANAN", "TOTAL PENDAPATAN"];
  
  const totalPesanan = data.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalPendapatan = data.reduce((sum, item) => sum + item.pendapatan, 0);
  
  const rows = data.map((item, i) => [i + 1, item.tanggal, item.totalPesanan, `Rp ${item.pendapatan.toLocaleString("id-ID")}`]);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN TOTAL PENDAPATAN`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
    ["", "Total", totalPesanan, `Rp ${totalPendapatan.toLocaleString("id-ID")}`]
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Total Pendapatan");
  XLSX.writeFile(workbook, `Laporan_Total_Pendapatan_${periode.replace(/\s/g, "_")}.xlsx`);
};

// ========== MENU ==========
export const eksporKePDFMenu = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Menu Terlaris", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);

  autoTable(doc, {
    head: [["NO", "NAMA MENU", "HARGA", "KATEGORI", "TOTAL TERJUAL"]],
    body: data.map((item, i) => [i + 1, item.nama, `Rp ${item.harga.toLocaleString("id-ID")}`, item.kategori, item.total]),
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });

  doc.save(`Laporan_Menu_Terlaris_${periode.replace(/\s/g, "_")}.pdf`);
};

export const eksporKeExcelMenu = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "NAMA MENU", "HARGA", "KATEGORI", "TOTAL TERJUAL"];
  const rows = data.map((item, i) => [i + 1, item.nama, `Rp ${item.harga.toLocaleString("id-ID")}`, item.kategori, item.total]);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN MENU TERLARIS`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Menu Terlaris");
  XLSX.writeFile(workbook, `Laporan_Menu_Terlaris_${periode.replace(/\s/g, "_")}.xlsx`);
};