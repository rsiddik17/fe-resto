// utils/exportUtilsBulanan.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const pancingDownloadMobile = (blobData: Blob, namaFile: string) => {
  const url = window.URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = url;
  link.download = namaFile;

  // Daftarkan ke body halaman agar dianggap sah oleh browser mobile
  document.body.appendChild(link);
  link.click();

  // Bersihkan kembali dari dokumen DOM
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// ========== PESANAN BULANAN ==========
export const eksporKePDFPesananBulanan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Total Pesanan (Bulanan)", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);

  autoTable(doc, {
    head: [
      ["NO", "BULAN", "TOTAL PESANAN", "PESANAN SELESAI", "PESANAN CANCEL"],
    ],
    body: data.map((item, i) => [
      i + 1,
      item.bulan,
      item.totalPesanan,
      item.selesai,
      item.cancel,
    ]),
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });

  const pdfBlob = doc.output("blob");
  const namaFile = `Laporan_Pesanan_Bulanan_${periode.replace(/\s/g, "_")}.pdf`;
  pancingDownloadMobile(pdfBlob, namaFile);
};

export const eksporKeExcelPesananBulanan = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = [
    "NO",
    "BULAN",
    "TOTAL PESANAN",
    "PESANAN SELESAI",
    "PESANAN CANCEL",
  ];
  const rows = data.map((item, i) => [
    i + 1,
    item.bulan,
    item.totalPesanan,
    item.selesai,
    item.cancel,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN TOTAL PESANAN (BULANAN)`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Pesanan Bulanan");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const namaFile = `Laporan_Pesanan_Bulanan_${periode.replace(/\s/g, "_")}.xlsx`;
  pancingDownloadMobile(excelBlob, namaFile);
};

// ========== PENDAPATAN BULANAN ==========
export const eksporKePDFPendapatanBulanan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Total Pendapatan (Bulanan)", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);

  autoTable(doc, {
    head: [["NO", "BULAN", "TOTAL PESANAN", "TOTAL PENDAPATAN"]],
    body: data.map((item, i) => [
      i + 1,
      item.bulan,
      item.totalPesanan,
      `Rp ${item.pendapatan.toLocaleString("id-ID")}`,
    ]),
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });

  const pdfBlob = doc.output("blob");
  const namaFile = `Laporan_Pendapatan_Bulanan_${periode.replace(/\s/g, "_")}.pdf`;
  pancingDownloadMobile(pdfBlob, namaFile);
};

export const eksporKeExcelPendapatanBulanan = (
  data: any[],
  periode: string,
) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "BULAN", "TOTAL PESANAN", "TOTAL PENDAPATAN"];
  const rows = data.map((item, i) => [
    i + 1,
    item.bulan,
    item.totalPesanan,
    `Rp ${item.pendapatan.toLocaleString("id-ID")}`,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN TOTAL PENDAPATAN (BULANAN)`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Pendapatan Bulanan");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const namaFile = `Laporan_Pendapatan_Bulanan_${periode.replace(/\s/g, "_")}.xlsx`;
  pancingDownloadMobile(excelBlob, namaFile);
};

// ========== MENU BULANAN ==========
export const eksporKePDFMenuBulanan = (data: any[], periode: string) => {
  const doc = new jsPDF();
  doc.text("IT'S RESTO - Laporan Menu Terlaris (Bulanan)", 14, 15);
  doc.setFontSize(10);
  doc.text(`Periode: ${periode}`, 14, 22);

  autoTable(doc, {
    head: [["NO", "NAMA MENU", "HARGA", "KATEGORI", "TOTAL TERJUAL"]],
    body: data.map((item, i) => [
      i + 1,
      item.nama,
      `Rp ${item.harga.toLocaleString("id-ID")}`,
      item.kategori,
      item.total,
    ]),
    startY: 28,
    theme: "grid",
    headStyles: { fillColor: [110, 16, 126] },
  });

  const pdfBlob = doc.output("blob");
  const namaFile = `Laporan_Menu_Bulanan_${periode.replace(/\s/g, "_")}.pdf`;
  pancingDownloadMobile(pdfBlob, namaFile);
};

export const eksporKeExcelMenuBulanan = (data: any[], periode: string) => {
  const workbook = XLSX.utils.book_new();
  const headers = ["NO", "NAMA MENU", "HARGA", "KATEGORI", "TOTAL TERJUAL"];
  const rows = data.map((item, i) => [
    i + 1,
    item.nama,
    `Rp ${item.harga.toLocaleString("id-ID")}`,
    item.kategori,
    item.total,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [`IT'S RESTO - LAPORAN MENU TERLARIS (BULANAN)`],
    [`Periode: ${periode}`],
    [],
    headers,
    ...rows,
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Menu Bulanan");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const namaFile = `Laporan_Menu_Bulanan_${periode.replace(/\s/g, "_")}.xlsx`;
  pancingDownloadMobile(excelBlob, namaFile);
};
