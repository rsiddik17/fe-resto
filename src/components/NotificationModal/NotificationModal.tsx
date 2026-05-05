import { ArrowLeft } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderStatus: string; // Ambil status dari store untuk membuat notif dinamis
}

const NotificationModal = ({ isOpen, onClose, orderStatus }: NotificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-4 bg-black/20">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xs overflow-hidden h-fit animate-in slide-in-from-right duration-300">
        
        {/* Header Notifikasi */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-50">
          <button onClick={onClose} className="text-primary">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-primary">Notifikasi</h2>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-black">Pembaruan Pesanan</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">4 BARU</span>
          </div>

          <div className="space-y-4">
            {/* Notif 1: Pesanan Sedang Diantar */}
            <div className={`p-4 rounded-xs border transition-all duration-500 ${orderStatus === 'Selesai' ? 'bg-[#F3E8F3] border-primary/20' : 'bg-white border-gray-100'}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-black">Pesanan Sedang Diantar</h4>
                <span className="text-[10px] text-gray-400">{orderStatus === 'Selesai' ? 'Sekarang' : '2 Menit Lalu'}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                Kabar baik! Kurir sedang dalam perjalanan menuju lokasi Anda.
              </p>
            </div>

            {/* Notif 2: Pesanan Sedang Disiapkan */}
            <div className="p-4 rounded-xs border border-gray-100 bg-white">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-black">Pesanan Sedang Disiapkan</h4>
                <span className="text-[10px] text-gray-400">25 Menit Lalu</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                Dapur telah menerima pesanan Anda. Hidangan Anda sedang disiapkan dengan sepenuh hati.
              </p>
            </div>

            {/* Notif 3: Pembayaran Terverifikasi */}
            <div className="p-4 rounded-xs border border-gray-100 bg-white">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-black">Pembayaran Terverifikasi</h4>
                <span className="text-[10px] text-gray-400">30 Menit Lalu</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                Pembayaran Anda untuk pesanan #ORD-20 telah berhasil diproses. Pesanan Anda segera disiapkan!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;