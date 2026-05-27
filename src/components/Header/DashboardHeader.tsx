import UserIconSingle from "../Icon/UserIconSingle";
import { useEffect, useState } from "react";
import NotificationModal, {
  type NotificationItem,
} from "../Modal/NotificationModal";
import NotificationIcon from "../Icon/NotificationIcon";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { notificationAPI } from "../../api/notification.api";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  roleName?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const DashboardHeader = ({
  title,
  subtitle,
  userName,
  roleName,
  showBack = false,
  onBack,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // STATE DINAMIS DARI API
  const [Notifs, setNotifs] = useState<NotificationItem[]>([]);

  // 1. HIT API MENGAMBIL DATA NOTIFIKASI
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications();

        if (response.success && response.data) {
          // Mapping data dari backend ke format UI
          const formattedNotifs: NotificationItem[] = response.data.map(
            (item: any) => {
              const timeString = new Date(item.created_at).toLocaleTimeString(
                "id-ID",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              let notifTitle = item.title;
              if (!notifTitle) {
                const role = roleName?.toLowerCase();
                if (role === "kasir" || role === "cashier") {
                  notifTitle = "Validasi Pembayaran";
                } else if (role === "dapur" || role === "kitchen") {
                  notifTitle = "Pesanan Masuk";
                } else {
                  notifTitle = "Pesanan Siap Diantar"; // Default untuk Waiter/Kitchen
                }
              }

              return {
                id: item.id,
                title: notifTitle, // Menambahkan Title dinamis
                table: (() => {
                  if (!item.table_number) return "Pemberitahuan";

                  // Cek apakah string mengandung kata takeaway atau tanpa meja
                  const isTakeaway =
                    item.table_number.toLowerCase().includes("takeaway") ||
                    item.table_number.toLowerCase().includes("tanpa");

                  if (isTakeaway) {
                    return item.table_number;
                  } else {
                    // Ekstrak hanya angka (contoh: "M01_i" -> "01")
                    const numOnly = item.table_number.replace(/\D/g, "");
                    return numOnly
                      ? `Meja ${numOnly}`
                      : `Meja ${item.table_number}`;
                  }
                })(),
                time: timeString,
                orderId: item.order_id ? `#${item.order_id}` : "-",
                items: item.message,
                isRead: item.is_read,
              };
            },
          );

          setNotifs(formattedNotifs);
        }
      } catch (error) {
        console.error("Gagal mengambil data notifikasi:", error);
      }
    };

    // Panggil saat komponen dirender pertama kali
    fetchNotifications();

    // Opsional: Lakukan polling setiap 15 detik untuk mendapat notif baru secara real-time
    const intervalId = setInterval(fetchNotifications, 15000);
    return () => clearInterval(intervalId);
  }, [roleName]);

  // Hitung jumlah notifikasi yang belum dibaca
  const unreadCount = Notifs.filter((n) => !n.isRead).length;

  // Fungsi untuk menandai notifikasi sudah dibaca
  const handleMarkAsRead = async (id: string) => {
    try {
      // Optimistic update: Ubah state UI lebih dulu agar terasa cepat bagi user
      setNotifs((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif,
        ),
      );

      // Hit API
      await notificationAPI.markAsRead(id);
    } catch (error) {
      console.error("Gagal menandai notifikasi telah dibaca:", error);
    }
  };

  const handleBackClick = () => {
    if (onBack) onBack();
    else navigate(-1); // Default kembali ke halaman sebelumnya
  };

  const handleProfileClick = () => {
    // Tambahkan logika pengecekan untuk Dapur
    const role = roleName?.toLowerCase();
    if (role === "kasir") navigate("/cashier/profile");
    else if (role === "dapur") navigate("/kitchen/profile");
    else navigate("/waiter/profile");
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Kiri: Judul & Subjudul */}
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={handleBackClick}
                className="hover:text-primary transition-colors cursor-pointer group mt-0.5"
              >
                <ArrowLeft
                  size={24}
                  strokeWidth={2}
                  className="group-hover:-translate-x-0.5 -translate-y-1 transition-transform"
                />
              </button>
            )}
            <h1 className="text-[22px] font-bold mb-0.5">{title}</h1>
          </div>

          {subtitle && (
            <p className="text-black/50 text-sm md:text-[14.5px]">{subtitle}</p>
          )}
        </div>

        {/* Kanan: Notifikasi & Profil */}
        {userName && roleName && (
          <div className="flex w-full justify-between md:justify-end lg:justify-end items-center gap-3.5">
            {/* Tombol Notifikasi (Bulat) */}
            <div className="relative">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-8.5 h-8.5 bg-primary rounded-full flex items-center justify-center text-white shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <NotificationIcon className="w-5 h-5" />
              </button>

              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#F3F4F6] rounded-full"></span>
              )}
            </div>

            {/* Profil Pill */}
            <div
              onClick={handleProfileClick}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-[18px] pl-3 pr-1.5 py-1.5 shadow-sm cursor-pointer"
            >
              <span className="text-[14.75px]">
                {userName}/{roleName}
              </span>
              <div className="w-8.25 h-8.25 bg-primary rounded-full flex items-center justify-center">
                <UserIconSingle
                  className="text-white w-5 h-5"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* RENDER MODAL SESUAI ROLE */}
      {userName && roleName && (
        <NotificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          notifications={Notifs}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </>
  );
};

export default DashboardHeader;
