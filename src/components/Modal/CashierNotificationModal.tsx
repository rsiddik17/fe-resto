import { useState } from "react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";
import ReceiptIcon from "../Icon/ReceiptIcon";

export interface CashierNotificationItem {
  id: string;
  table: string;
  time: string;
  orderId: string;
  items: string;
  method: "QR" | "KIOSK" | "ONLINE" | "KASIR";
  isRead: boolean;
}

interface CashierNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CashierNotificationItem[];
  onMarkAsRead: (id: string) => void;
}

const CashierNotificationModal = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}: CashierNotificationModalProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!isOpen) return null;

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        // Ukuran Fixed disamakan dengan WaiterNotificationModal
        className="bg-white rounded-md p-4.5 shadow-sm flex flex-col relative animate-in zoom-in-95 duration-200 w-100 h-143"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold mb-4 shrink-0">Pesanan Masuk</h2>

        <div
          className={cn(
            "flex flex-col gap-3 custom-scrollbar",
            showAll ? "overflow-y-auto" : "overflow-hidden",
          )}
        >
          {displayedNotifications.map((notif) => {
            // Tentukan warna utama berdasarkan metode pesanan
            let badgeColorClass = "bg-primary";
            let iconBgClass = "bg-primary/15";
            let iconTextClass = "text-primary";

            if (notif.method === "QR") {
              badgeColorClass = "bg-[#1AE91D]";
              iconBgClass = "bg-[#8AC926]/15";
              iconTextClass = "text-[#8AC926]";
            } else if (notif.method === "KIOSK") {
              badgeColorClass = "bg-[#2196F3]";
              iconBgClass = "bg-[#2196F3]/15";
              iconTextClass = "text-[#2196F3]";
            } else if (notif.method === "KASIR") {
              badgeColorClass = "bg-[#F35B28]";
              iconBgClass = "bg-[#F35B28]/15";
              iconTextClass = "text-[#F35B28]";
            }

            return (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={cn(
                  "w-full h-25 rounded-xs py-3 pl-2 pr-4 flex gap-4 cursor-pointer transition-all duration-300 shrink-0 border",
                  notif.isRead
                    ? "bg-white border-[1.5px] border-gray-200" // Sudah dibaca
                    : "bg-primary/15  border-[1.5px] border-transparent", // Belum dibaca (warna dasar ungu muda seperti waiter)
                )}
              >
                {/* Ikon Kiri (Warna pastel menyesuaikan Metode Pesanan) */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-sm flex items-center justify-center self-center shrink-0",
                    iconBgClass,
                    iconTextClass,
                  )}
                >
                  <ReceiptIcon strokeWidth={2.5} />
                </div>

                {/* Konten Kanan */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-black text-[14.5px] truncate pr-2">
                      {notif.table}
                    </h3>
                    <span className="font-semibold text-black text-xs shrink-0 mt-0.5">
                      {notif.time}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-[#73736C] text-[13px] mb-0.5 truncate">
                      {notif.orderId}
                    </p>

                    <p className="text-[12.5px] line-clamp-2 leading-tight">
                      {notif.items}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-semibold">
                      Metode Pesanan:
                    </span>
                    <span
                      className={cn(
                        "text-white px-1.5 py-0.75 rounded-xs font-semibold text-[8px] uppercase tracking-wider",
                        badgeColorClass,
                      )}
                    >
                      {notif.method}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-5 shrink-0">
          <Button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-2 font-semibold text-[13px] shadow-sm cursor-pointer"
          >
            {showAll && notifications.length > 4
              ? "Tampilkan Sedikit"
              : "Lihat Semua"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CashierNotificationModal;
