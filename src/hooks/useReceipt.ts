import { jsPDF } from "jspdf";

// --- HELPER FORMATTER ---
export const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

// Format tanggal disesuaikan dengan desain struk (05 Apr 2026 • 13:10)
export const formatTimeStruk = (isoString: string) => {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} ${month} ${year} • ${time}`;
};

export const useReceipt = () => {
  const generateReceiptPDF = async (order: any) => {
    // Hitung tinggi kertas dinamis berdasarkan jumlah item
    const baseHeight = 110;
    const itemsHeight = order.items.reduce((acc: number) => acc + 11, 0);
    const totalHeight = baseHeight + itemsHeight;

    // Ukuran kertas thermal 80mm
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, totalHeight],
    });

    try {
      const img = new Image();
      // PERBAIKAN: Gunakan absolute URL & izinkan origin agar canvas tidak di-block
      img.crossOrigin = "Anonymous";
      img.src = `${window.location.origin}${import.meta.env.BASE_URL}images/new-logo.webp`;

      // Tunggu gambar ter-load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Convert WEBP ke PNG pakai Canvas HTML
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL("image/png");
        doc.addImage(pngDataUrl, "PNG", 25, 5, 30, 30);
      } else {
        throw new Error("Gagal membuat canvas");
      }
    } catch (e) {
      console.warn("Gagal meload logo gambar, menggunakan teks fallback.", e);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(114, 9, 183);
      doc.text("IT'S Resto", 40, 15, { align: "center" });
    }

    // 1. HEADER (Logo & Nama Resto)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(114, 9, 183); // Warna Ungu Primary
    doc.text("IT'S Resto", 40, 35, { align: "center" });

    // 2. INFO PESANAN
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150); // Abu-abu
    doc.setFont("helvetica", "normal");
    doc.text("ID Pesanan", 5, 45);
    doc.setTextColor(0, 0, 0); // Hitam
    doc.setFont("helvetica", "bold");
    doc.text(`#${order.orderId}`, 75, 45, { align: "right" });

    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("Tanggal", 5, 51);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(order.receiptTime, 75, 51, { align: "right" });

    // Garis putus-putus
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(5, 56, 75, 56);

    // 3. RINCIAN PEMBAYARAN
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("Rincian Pembayaran", 5, 62);

    doc.line(5, 65, 75, 65);
    doc.setLineDashPattern([], 0); // Reset garis solid

    let yPos = 72;

    // 4. LOOPING ITEM MENU
    order.items.forEach((item: any) => {
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.name} x${item.qty}`, 5, yPos);
      doc.text(rupiahFormatter.format(item.price), 75, yPos, {
        align: "right",
      });
      yPos += 5;

      // --- PERBAIKAN: SELALU TAMPILKAN GAMBAR IKON CATATAN MANUAL ---
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.2);
      // Kotak dokumen mini
      doc.rect(5, yPos - 3, 2.5, 3.5);
      // Garis teks di dalam dokumen mini
      doc.line(5.5, yPos - 2, 7, yPos - 2);
      doc.line(5.5, yPos - 1, 7, yPos - 1);

      // Teks Catatan
      doc.setFontSize(8.5);
      doc.setTextColor(150, 150, 150);
      const textCatatan = item.note ? item.note : "Tidak ada";
      doc.text(`Catatan: ${textCatatan}`, 9, yPos);

      doc.setFontSize(10);

      yPos += 4;
    });

    // Garis putus-putus sebelum total
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(5, yPos, 75, yPos);
    doc.setLineDashPattern([], 0);
    yPos += 7;

    // 5. TOTAL HARGA
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Total Pesanan", 5, yPos);
    doc.text(rupiahFormatter.format(order.subTotal), 75, yPos, {
      align: "right",
    });
    yPos += 6;

    doc.setFont("helvetica", "normal");
    doc.text("PPN 10%", 5, yPos);
    doc.text(rupiahFormatter.format(order.tax), 75, yPos, { align: "right" });
    yPos += 6;

    doc.text("Biaya Admin", 5, yPos);
    doc.text(rupiahFormatter.format(order.adminFee), 75, yPos, {
      align: "right",
    });
    yPos += 7;

    doc.setFont("helvetica", "bold");
    doc.text("Total Pembayaran", 5, yPos);
    doc.text(rupiahFormatter.format(order.grandTotal), 75, yPos, {
      align: "right",
    });

    // 6. AUTO DOWNLOAD
    doc.save(`Struk_ITSResto_${order.orderId}.pdf`);
  };

  return { generateReceiptPDF };
};
