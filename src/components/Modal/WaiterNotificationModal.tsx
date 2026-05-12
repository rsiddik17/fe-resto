import { useState } from "react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";
import ReceiptIcon from "../Icon/ReceiptIcon";

// 1. Ekspor tipe data agar bisa dipakai di tempat lain
export interface WaiterNotificationItem {
  id: string;
  table: string;
  time: string;
  orderId: string;
  items: string;
  type: "new" | "process";
  isRead: boolean;
}

interface WaiterNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: WaiterNotificationItem[];
  onMarkAsRead: (id: string) => void;
}

const WaiterNotificationModal = ({ isOpen, onClose, notifications, onMarkAsRead }: WaiterNotificationModalProps) => {
  // STATE BARU: Untuk mengontrol apakah semua notifikasi ditampilkan
  const [showAll, setShowAll] = useState(false);

  // Jika tidak open, jangan render apa-apa
  if (!isOpen) return null;

  // LOGIKA SCROLL: Tampilkan 3 saja di awal. Jika "Lihat Semua" diklik, tampilkan semua.
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/1 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose} // Tutup modal jika klik background gelap
    >
      <div 
        // Ukuran Fixed sesuai instruksi: w = 503px, h = 612px
        className="bg-white rounded-md p-4.5 shadow-sm flex flex-col relative animate-in zoom-in-95 duration-200 w-100 h-116"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area dalam diklik
      >
        {/* Header Modal - 18px Semibold */}
        <h2 className="text-base font-semibold mb-4 shrink-0">
          Pesanan Masuk
        </h2>

        {/* List Notifikasi (Bisa di-scroll HANYA JIKA showAll aktif) */}
        <div className={cn(
          "flex flex-col gap-3 custom-scrollbar",
          showAll ? "overflow-y-auto" : "overflow-hidden"
        )}>
          {displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              // Tinggi fixed 135px
              className={cn(
                "w-full h-25 rounded-sm py-3 pl-2 pr-4 flex gap-4 cursor-pointer transition-all duration-300 shrink-0 border",
                // Logika pewarnaan BG Card:
                notif.isRead 
                  ? "bg-white border-[1.5px] border-gray-200" // Sudah dibaca: Putih + Border
                  : notif.type === "new" 
                    ? "bg-[#EAE0F0]  border-[1.5px] border-transparent" // Belum dibaca (Baru): Ungu muda
                    : "bg-[#FCECD8]   border-[1.5px] border-transparent" // Belum dibaca (Dimasak): Orange muda
              )}
            >
              {/* Ikon Kiri (PERBAIKAN: Warna TETAP menyesuaikan status tipe, tidak peduli isRead) */}
              <div className={cn(
                "w-10 h-10 rounded-sm flex items-center justify-center self-center shrink-0",
                notif.type === "new" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-[#FF9F1C]/20 text-[#FF9F1C]"
              )}>
                <ReceiptIcon strokeWidth={2.5} />
              </div>

              {/* Konten Kanan */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-black text-[14.5px] truncate pr-2">
                    {notif.table}
                  </h3>
                  <span className="font-semibold text-black text-xs shrink-0">
                    {notif.time}
                  </span>
                </div>
                
                <p className="text-gray-500 text-[12.5px] mb-1.5 truncate">
                  ID {notif.orderId}
                </p>
                
                <p className="text-xs line-clamp-2 leading-tight">
                  {notif.items}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Lihat Semua (Hanya muncul jika item > 3 dan belum di-expand) */}
          <div className="flex justify-center mt-6 shrink-0">
            <Button 
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-2 font-semibold text-[13px] shadow-sm cursor-pointer"
            >
              {showAll && notifications.length > 3 ? "Tampilkan Sedikit" : "Lihat Semua"}
            </Button>
          </div>
      </div>
    </div>
  );
};

export default WaiterNotificationModal;