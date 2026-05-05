import { Check, Download, ArrowLeft, FileText } from 'lucide-react';
import { Barcode } from '../Barcode/Barcode';
import Button from '../ui/Button';
import { useNavigate } from 'react-router';
import HeaderOnline from '../HeaderOnline/HeaderOnline';

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

  // Perbaikan: month menggunakan 'short' (huruf kecil) agar tidak error
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
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex flex-col pr-4">
                      <span className="text-black font-bold text-[13px] leading-tight">
                        {item.name || "Produk"} x{item.qty || item.quantity || 1}
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-gray-400">
                        <FileText size={12} />
                        <span className="text-[10px] font-medium">{item.notes || 'ok'}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-black font-bold text-[13px]">
                      {formatRupiah((item.price || 0) * (item.qty || item.quantity || 1))}
                    </span>
                  </div>
                ))}
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
              {/* Baris Pertama: Berdampingan (Pantau & Unduh) */}
              <div className="flex flex-row gap-2.5">
                <Button 
                  onClick={() => navigate("/customer/pesanan")} 
                  className="flex-[1.4] py-3.5 rounded-full font-bold bg-primary text-white text-[11px] md:text-[13px] shadow-md transition-transform active:scale-95"
                >
                  <span className="whitespace-nowrap">Pantau Pesanan</span>
                </Button>
                
                <Button 
                  onClick={() => window.print()} 
                  className="flex-1 py-3.5 rounded-full font-bold bg-primary text-white text-[11px] md:text-[13px] flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
                >
                  <Download size={14} className="shrink-0" /> 
                  <span className="whitespace-nowrap">Unduh Struk</span>
                </Button>
              </div>

              {/* Baris Kedua: Full Width Beranda */}
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
        @media print {
          body * { visibility: hidden !important; }
          #receipt-to-print, #receipt-to-print * { visibility: visible !important; }
          #receipt-to-print { 
            position: absolute !important; left: 0 !important; top: 0 !important; 
            width: 100% !important; max-width: none !important; box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderReceipt;