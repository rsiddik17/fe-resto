import UserIconSingle from "../Icon/UserIconSingle";
import { useState } from "react";
import NotificationModal, { type NotificationItem } from "../NotificationModal/NotificationModal";
import NotificationIcon from "../Icon/NotificationIcon";
import { useNavigate } from "react-router";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  userName: string;
  roleName: string; // Misal: "Pelayan" atau "Kasir"
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    table: "Meja 07",
    time: "12.07",
    orderId: "#26040299",
    items: "1x Ayam Penyet, 2x Matcha Latte, 1x Es Teler",
    type: "new",
    isRead: false,
  },
  {
    id: "2",
    table: "Meja 12",
    time: "11.59",
    orderId: "#26040298",
    items: "1x Ayam Penyet, 2x Lychee Tea",
    type: "new",
    isRead: false,
  },
  {
    id: "3",
    table: "Meja 06",
    time: "Dimasak",
    orderId: "#26040297",
    items: "1x Es Teler, 2x Ayam Penyet, 1x Bakso Urat",
    type: "process",
    isRead: false,
  },
  {
    id: "4",
    table: "Meja 06",
    time: "Dimasak",
    orderId: "#26040297",
    items: "1x Es Teler, 2x Ayam Penyet, 1x Bakso Urat",
    type: "process",
    isRead: false,
  },
];

const DashboardHeader = ({
  title,
  subtitle,
  userName,
  roleName,
}: DashboardHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navigate = useNavigate();

  // Fungsi untuk menandai notifikasi sudah dibaca
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        {/* Kiri: Judul & Subjudul */}
        <div>
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <p className="text-black/50 text-sm md:text-base">{subtitle}</p>
        </div>

        {/* Kanan: Notifikasi & Profil */}
        <div className="flex items-center gap-4">
          {/* Tombol Notifikasi (Bulat) */}
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <NotificationIcon />
            </button>

            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#F3F4F6] rounded-full"></span>
            )}
          </div>

          {/* Profil Pill */}
          <div onClick={() => navigate("/waiter/profile")} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg pl-3 pr-1.5 py-1.5 shadow-sm cursor-pointer">
            <span className="text-base">
              {userName}/{roleName}
            </span>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <UserIconSingle className="text-white w-5 h-5" strokeWidth={2} />
            </div>
          </div>
        </div>
      </header>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
};

export default DashboardHeader;