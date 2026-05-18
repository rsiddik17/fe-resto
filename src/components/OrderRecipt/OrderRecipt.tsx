import { Check, Download, ArrowLeft, FileText } from 'lucide-react';
import { Barcode } from '../Barcode/Barcode';
import Button from '../ui/Button';
import { useNavigate } from 'react-router';
import HeaderOnline from '../HeaderOnline/HeaderOnline';
// Import library untuk PDF saja (html2canvas dihapus karena memicu bug oklch)
import { jsPDF } from 'jspdf';

interface OrderReceiptProps {
  orderId: string;
  items: any[];
  subTotal: number;
  ppn: number;
  adminFee: number;
  totalPrice: number;
  onClose: () => void;
}

const OrderReceipt = ({ orderId, items, subTotal, ppn, adminFee, totalPrice, onClose }: OrderReceiptProps) => {
  const navigate = useNavigate();

  // Fungsi format rupiah agar rapat (Rp40.000)
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka || 0).replace(/\s/g, '');
  };

  // Mengambil waktu transaksi saat ini
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const time = now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    return `${date} • ${time.replace('.', ':')}`;
  };

  // Fungsi Utama: Menggambar PDF secara Native dengan Catatan Dinamis & Ukuran Pas
  const downloadPDF = () => {
    try {
      // 1. Hitung tinggi dinamis secara akurat (sekarang semua item dijamin punya baris catatan)
      const itemRowsHeight = items.length * 10; // Dialokasikan 10mm per item karena selalu ada catatan
      const pdfHeight = 120 + itemRowsHeight;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, pdfHeight]
      });

      // Set Font Default
      pdf.setFont('Helvetica', 'normal');

      // 2. HEADER STRUK
      pdf.setFontSize(11);
      pdf.setFont('Helvetica', 'bold');
      pdf.text("IT'S RESTO", 40, 10, { align: 'center' });
      
      pdf.setFontSize(7);
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(120, 120, 120);
      pdf.text("TOTAL PEMBAYARAN", 40, 15, { align: 'center' });

      // Garis Pembatas
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineDashPattern([1, 1], 0);
      pdf.line(5, 18, 75, 18);

      // 3. INFO TRANSAKSI
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont('Helvetica', 'normal');
      pdf.text("ID Pesanan", 5, 24);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(`#${orderId}`, 75, 24, { align: 'right' });

      pdf.setFont('Helvetica', 'normal');
      pdf.text("Tanggal", 5, 29);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(getCurrentDateTime(), 75, 29, { align: 'right' });

      // Garis Pembatas
      pdf.line(5, 33, 75, 33);

      // 4. RINCIAN ITEM
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(120, 120, 120);
      pdf.text("RINCIAN PEMBAYARAN", 5, 38);

      let currentY = 44;
      pdf.setTextColor(0, 0, 0);
      
      items.forEach((item) => {
        // Nama Item & Qty
        pdf.setFont('Helvetica', 'bold');
        const itemName = `${item.name || "Produk"} x${item.qty || item.quantity || 1}`;
        pdf.text(itemName, 5, currentY);
        
        // Harga Item
        const itemPrice = formatRupiah((item.price || 0) * (item.qty || item.quantity || 1));
        pdf.text(itemPrice, 75, currentY, { align: 'right' });
        
        // Logika Catatan PDF: Cek jika kosong / strip
        const rawNote = item.notes ? item.notes.trim() : '';
        const displayNote = (rawNote === '' || rawNote === '-') ? 'Tidak ada catatan' : rawNote;

        // Cetak tulisan catatan ke PDF
        currentY += 4;
        pdf.setFont('Helvetica', 'italic');
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Note: ${displayNote}`, 5, currentY);
        pdf.setFontSize(8); // Reset font size
        pdf.setTextColor(0, 0, 0);

        currentY += 6; 
      });

      // Garis Pembatas
      pdf.setLineDashPattern([1, 1], 0);
      pdf.line(5, currentY, 75, currentY);
      currentY += 5;

      // 5. RINGKASAN BIAYA
      pdf.setFont('Helvetica', 'bold');
      pdf.text("Total Pesanan", 5, currentY);
      pdf.text(formatRupiah(subTotal), 75, currentY, { align: 'right' });
      
      currentY += 5;
      pdf.setFont('Helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text("PPN 10%", 5, currentY);
      pdf.text(formatRupiah(ppn), 75, currentY, { align: 'right' });

      currentY += 5;
      pdf.text("Biaya Admin", 5, currentY);
      pdf.text(formatRupiah(adminFee), 75, currentY, { align: 'right' });

      currentY += 4;
      pdf.setLineDashPattern([], 0); 
      pdf.setDrawColor(240, 240, 240);
      pdf.line(5, currentY, 75, currentY);
      currentY += 6;

      // 6. GRAND TOTAL
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8.5);
      pdf.setFont('Helvetica', 'bold');
      pdf.text("Total Pembayaran", 5, currentY);
      pdf.setFontSize(10.5);
      pdf.text(formatRupiah(totalPrice), 75, currentY, { align: 'right' });

      currentY += 8;
      pdf.setFontSize(7.5);
      pdf.setFont('Helvetica', 'italic');
      pdf.setTextColor(150, 150, 150);
      pdf.text("Terima kasih telah memesan!", 40, currentY, { align: 'center' });

      // 7. DOWNLOAD FILE
      pdf.save(`struk-${orderId}.pdf`);

    } catch (error) {
      console.error("Gagal cetak PDF:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-white flex flex-col h-screen w-screen overflow-hidden">
      {/* 1. HEADER */}
      <div className="print:hidden shrink-0 bg-white border-b border-gray-100">
        <HeaderOnline mode="online" />
        <div className="px-4 md:px-8 py-2 flex items-center gap-3">
          <button onClick={onClose} className="hover:bg-gray-100 p-1.5 rounded-full shrink-0 transition-colors">
            <ArrowLeft size={18} className="text-black" />
          </button>
          <h1 className="text-xl font-bold text-black ">Pembayaran</h1>
        </div>
      </div>

      {/* 2. AREA KONTEN (Global Scroll) */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        <div className="flex flex-col md:flex-row min-h-full">
          
          {/* SISI KIRI: STRUK */}
          <div className="bg-primary w-full md:w-[42%] flex flex-col items-center py-6 md:py-10 px-4 shrink-0">
            <div 
              id="receipt-to-print"
              className="bg-white rounded-xs p-6 md:p-8 w-full max-w-[320px] shadow-xl flex flex-col text-black h-fit print:shadow-none"
            >
              <h2 className="text-center text-gray-400 font-medium text-[12px] mb-4 uppercase">Total Pembayaran</h2>
              
              <div className="w-full flex justify-center mb-6">
                <Barcode value={orderId} className="h-12 w-full opacity-90" />
              </div>

              <div className="space-y-2 mb-4 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">ID Pesanan</span>
                  <span className="text-black font-bold">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Tanggal</span>
                  <span className="text-black font-bold">{getCurrentDateTime()}</span>
                </div>
              </div>

              <div className="border-t border-dotted border-gray-300 mb-4" />
              <p className="text-gray-400 font-medium text-[11px] uppercase mb-3">Rincian Pembayaran</p>

              <div className="space-y-4 mb-6">
                {items.map((item, idx) => {
                  // Logika Catatan Layar: Cek jika kosong / strip
                  const rawNote = item.notes ? item.notes.trim() : '';
                  const hasNoNote = rawNote === '' || rawNote === '-';

                  return (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex flex-col pr-4">
                        <span className="text-black font-bold text-[13px] leading-tight">
                          {item.name || "Produk"} x{item.qty || item.quantity || 1}
                        </span>
                        
                        {/* Ikon selalu ada, teks berubah sesuai kondisi catatan */}
                        <div className="flex items-center gap-1 mt-1 text-gray-400">
                          <FileText size={12} className="shrink-0" />
                          <span className={`text-[10px] font-medium ${hasNoNote ? 'italic text-gray-400' : 'text-gray-500'}`}>
                            {hasNoNote ? 'Tidak ada catatan' : item.notes}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-black font-bold text-[13px]">
                        {formatRupiah((item.price || 0) * (item.qty || item.quantity || 1))}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-dotted border-gray-300 mb-4" />

              <div className="space-y-2 mb-4 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Pesanan</span>
                  <span className="font-bold">{formatRupiah(subTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="text-[11px]">PPN 10%</span>
                  <span className="font-medium">{formatRupiah(ppn)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="text-[11px]">Biaya Admin</span>
                  <span className="font-medium">{formatRupiah(adminFee)}</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold">Total Pembayaran</span>
                  <span className="text-black font-extrabold text-[18px] tracking-tighter">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SISI KANAN: STATUS & TOMBOL */}
          <div className="flex-1 bg-white p-8 md:p-12 flex flex-col items-center justify-start pt-12 md:pt-24 text-center print:hidden">
            <div className="bg-primary w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-5 shadow-lg text-white shrink-0">
              <Check size={32} strokeWidth={4} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-900 font-bold text-black mb-10 tracking-tight">
              Pembayaran Berhasil!
            </h2>

            <div className="w-full max-w-90 flex flex-col gap-3 px-2">
              <div className="flex flex-row gap-2.5">
                <Button 
                  onClick={() => navigate("/customer/pesanan")} 
                  className="flex-[1.4] py-3.5 rounded-full font-bold bg-primary text-white text-[11px] md:text-[13px] shadow-md transition-transform active:scale-95"
                >
                  <span className="whitespace-nowrap">Pantau Pesanan</span>
                </Button>
                
                <Button 
                  onClick={downloadPDF} 
                  className="flex-1 py-3.5 rounded-full font-bold bg-primary text-white text-[11px] md:text-[13px] flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
                >
                  <Download size={14} className="shrink-0" /> 
                  <span className="whitespace-nowrap">Unduh Struk</span>
                </Button>
              </div>

              <Button 
                onClick={() => navigate("/customer/home")} 
                className="w-full py-3.5 rounded-full font-bold bg-primary text-white text-[14px] shadow-md transition-all active:scale-95"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default OrderReceipt;