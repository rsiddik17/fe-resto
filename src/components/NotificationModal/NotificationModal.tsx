import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "../../store/useOrderStore";
import { cn } from "../../utils/utils";
import { useEffect } from "react";

const NotificationModal = ({ onClose }: { onClose: () => void }) => {
  const { orders, hasSeenNotifications, setNotificationsRead } =
    useOrderStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificationsRead();
    }, 3000);
    return () => clearTimeout(timer);
  }, [setNotificationsRead]);

  const orderNotifications = (orders || []).map((order, index) => {
    const s = (order.status || "").toString().trim().toLowerCase();
    const menuName = order.items[0]?.name || "Menu";

    let title = "Pembayaran Terverifikasi";
    let desc = `Pembayaran ${menuName} berhasil diproses. Segera disiapkan!`;
    let timeDisplay = "Baru Saja";

    if (s === "dimasak") {
      title = "Pesanan Sedang Disiapkan";
      desc = `Dapur sudah menerima pesanan ${menuName}. Sedang disiapkan sepenuh hati.`;
      timeDisplay = "5 Menit Lalu";
    } else if (s === "diantar") {
      title = "Pesanan Sedang Diantar";
      desc = `Kabar baik! ${menuName} sedang dalam perjalanan ke lokasi Anda.`;
      timeDisplay = "20 Menit Lalu";
    } else if (s === "diterima" || s === "selesai") {
      title = "Pesanan Telah Sampai";
      desc = `${menuName} Anda sudah sampai. Terima kasih sudah memesan!`;
      timeDisplay = "50 Menit Lalu";
    }

    return {
      id: `order-${order.orderId}-${index}`,
      title,
      description: desc,
      time: timeDisplay,
      isNew: index === 0 && !hasSeenNotifications,
    };
  });

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

  return (
    <>
      <div className="fixed inset-0 z-9998 bg-black/10 backdrop-blur-[2px] p-4 " onClick={onClose} />
      {/* UPDATE: Posisi menggunakan right responsif agar rapi di mobile (right-4) maupun desktop (lg:right-32) */}
      <div
        className="fixed top-16 right-7 md:right-24 lg:right-32 z-9999 w-[calc(100%-32px)] max-w-70 sm:w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-gray-50 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3.5 flex items-center gap-3 border-b border-gray-50 bg-white">
          <button
            onClick={onClose}
            className="text-primary p-1.5 hover:bg-gray-50 rounded-full"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </button>
          <h2 className="text-[12px] font-black text-primary uppercase">
            Notifikasi
          </h2>
        </div>

        <div className="px-4 py-2 flex justify-between items-center bg-gray-50/40 border-b border-gray-50">
          <span className="font-bold text-gray-400 text-[9px] uppercase tracking-widest">
            Pembaruan Pesanan
          </span>
          <div className="bg-primary/10 px-2 py-0.5 rounded-full">
            <span className="text-primary text-[9px] font-black uppercase">
              {hasSeenNotifications ? "0" : "1"} BARU
            </span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-90 p-3 space-y-2.5 custom-scrollbar bg-white">
          {allNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "p-3.5 border rounded-[18px] transition-all duration-500",
                notif.isNew
                  ? "bg-[#F3E8F3] border-purple-100 shadow-sm"
                  : "bg-white border-gray-100",
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
          ))}
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
