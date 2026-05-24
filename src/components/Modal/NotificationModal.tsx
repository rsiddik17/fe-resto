import { useState } from "react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";
import ReceiptIcon from "../Icon/ReceiptIcon";

// 1. Ekspor tipe data agar bisa dipakai di tempat lain
export interface NotificationItem {
  id: string;
  title: string;
  table: string;
  time: string;
  orderId: string;
  items: string;
  isRead: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
}

const NotificationModal = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}: NotificationModalProps) => {
  // STATE BARU: Untuk mengontrol apakah semua notifikasi ditampilkan
  const [showAll, setShowAll] = useState(false);

  // Jika tidak open, jangan render apa-apa
  if (!isOpen) return null;

  // LOGIKA SCROLL: Tampilkan 3 saja di awal. Jika "Lihat Semua" diklik, tampilkan semua.
  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose} // Tutup modal jika klik background gelap
    >
      <div
        // Ukuran Fixed sesuai instruksi: w = 503px, h = 612px
        className="bg-white rounded-md mx-4 md:mx-0 p-4.5 shadow-sm flex flex-col relative animate-in zoom-in-95 duration-200 w-100 h-126.5 md:w-100 md:h-121"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area dalam diklik
      >
        {/* Header Modal - 18px Semibold */}
        <h2 className="text-base font-medium mb-4 shrink-0">
          Notifikasi Masuk
        </h2>

        {notifications.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-black/50 text-sm">
            Belum ada notifikasi
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col gap-3 custom-scrollbar",
              showAll ? "overflow-y-auto" : "overflow-hidden",
            )}
          >
            {displayedNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                // Tinggi fixed 135px
                className={cn(
                  "w-full min-h-25 rounded-sm py-3 pl-2 pr-4 flex gap-4 cursor-pointer transition-all duration-300 shrink-0 border",
                  // Logika pewarnaan BG Card:
                  notif.isRead
                    ? "bg-white border-[1.5px] border-gray-200" // Sudah dibaca: Putih + Border
                    : "bg-[#EAE0F0]  border-[1.5px] border-transparent", // Belum dibaca (Baru): Ungu muda
                )}
              >
                {/* Ikon Kiri (PERBAIKAN: Warna TETAP menyesuaikan status tipe, tidak peduli isRead) */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-sm flex items-center justify-center self-center shrink-0 bg-primary/20 text-primary",
                  )}
                >
                  <ReceiptIcon strokeWidth={2.5} />
                </div>

                {/* Konten Kanan */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-primary text-[13px] md:text-[14.75px] truncate">
                        {notif.title}
                      </h3>
                      <h3 className="font-bold text-black text-[14.5px] truncate pr-2">
                        {notif.table}
                      </h3>
                    </div>
                    <span className="font-medium text-black text-xs shrink-0">
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-[12.5px] mb-0.5 truncate">
                    ID {notif.orderId}
                  </p>

                  <p className="text-[12.5px] line-clamp-2 leading-tight">
                    {notif.items}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tombol Lihat Semua (Hanya muncul jika item > 3 dan belum di-expand) */}
        <div className="flex justify-center mt-5 shrink-0">
          <Button
            onClick={() => setShowAll(!showAll)}
            className={cn(
              "px-8 py-2 font-semibold text-[14px] md:text-[14.5px] lg:text-[13px] shadow-sm cursor-pointer",
            )}
          >
            {showAll && notifications.length > 3
              ? "Tampilkan Sedikit"
              : "Lihat Semua"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
