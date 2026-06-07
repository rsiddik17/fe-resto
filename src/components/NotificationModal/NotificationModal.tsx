import { ArrowLeft } from "lucide-react";
import { cn } from "../../utils/utils";
import { useEffect, useState } from "react";
import { notificationAPI } from "../../api/notification.api";

// Interface untuk data notifikasi dari API (sesuaikan dengan response)
interface Notification {
  id: string;
  order_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NotificationModal = ({ onClose }: { onClose: () => void }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);

  // Ambil notifikasi dari API
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationAPI.getNotifications();
      console.log("Response notifikasi:", response);
      
      if (response.success) {
        // ✅ LANGSUNG PAKAI response.data, tanpa filter
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Gagal ambil notifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark semua notifikasi sebagai sudah dibaca
  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter((n) => !n.is_read);
    for (const notif of unreadNotifs) {
      try {
        await notificationAPI.markAsRead(notif.id);
      } catch (error) {
        console.error("Gagal mark as read:", error);
      }
    }
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  };

  // Format waktu
  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "Baru Saja";
    if (diffMinutes < 60) return `${diffMinutes} Menit Lalu`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} Jam Lalu`;
    return `${Math.floor(diffMinutes / 1440)} Hari Lalu`;
  };

  // Fetch notifikasi saat modal dibuka
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Auto mark as read setelah 3 detik
  useEffect(() => {
    if (notifications.length > 0 && !hasMarkedRead) {
      const timer = setTimeout(() => {
        markAllAsRead();
        setHasMarkedRead(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications, hasMarkedRead]);

  // Konversi data
  const orderNotifications = notifications.map((notif) => ({
    id: notif.id,
    title: notif.title,
    description: notif.message,
    time: formatTime(notif.created_at),
    isNew: !notif.is_read,
  }));

  const allNotifications = [
    ...orderNotifications,
    {
      id: "promo-1",
      title: "Promo IT'S RESTO",
      description: "Dapatkan diskon ongkir Rp10.000 untuk pesanan berikutnya!",
      time: "1 Jam Lalu",
      isNew: false,
    },
  ];

  const hasUnread = notifications.some((n) => !n.is_read);

  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0 z-9998 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
        <div className="fixed top-16 right-7 md:right-24 lg:right-32 z-9999 w-[calc(100%-32px)] max-w-70 sm:w-80 bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-500 text-sm">Memuat notifikasi...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-9998 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="fixed top-16 right-7 md:right-24 lg:right-32 z-9999 w-[calc(100%-32px)] max-w-70 sm:w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-gray-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3.5 flex items-center gap-3 border-b border-gray-50 bg-white">
          <button onClick={onClose} className="text-primary p-1.5 hover:bg-gray-50 rounded-full">
            <ArrowLeft size={16} strokeWidth={3} />
          </button>
          <h2 className="text-[12px] font-black text-primary uppercase">Notifikasi</h2>
        </div>

        <div className="px-4 py-2 flex justify-between items-center bg-gray-50/40 border-b border-gray-50">
          <span className="font-bold text-gray-400 text-[9px] uppercase tracking-widest">
            Pembaruan Pesanan
          </span>
          <div className="bg-primary/10 px-2 py-0.5 rounded-full">
            <span className="text-primary text-[9px] font-black uppercase">
              {hasUnread ? notifications.filter((n) => !n.is_read).length : "0"} BARU
            </span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-90 p-3 space-y-2.5 custom-scrollbar bg-white">
          {allNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">Belum ada notifikasi</div>
          ) : (
            allNotifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "p-3.5 border rounded-[18px] transition-all duration-500",
                  notif.isNew
                    ? "bg-[#F3E8F3] border-purple-100 shadow-sm"
                    : "bg-white border-gray-100"
                )}
              >
                <div className="flex justify-between items-start mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="font-bold text-gray-900 text-[11px] leading-tight truncate">
                      {notif.title}
                    </h4>
                    {notif.isNew && (
                      <span className="shrink-0 w-1 h-1 bg-primary rounded-full"></span>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap ml-2">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-snug font-medium">
                  {notif.description}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="h-4 bg-white"></div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F3E8F3; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default NotificationModal;