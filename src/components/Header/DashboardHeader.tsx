import UserIconSingle from "../Icon/UserIconSingle";
import { useState } from "react";
import WaiterNotificationModal, {
  type WaiterNotificationItem,
} from "../Modal/WaiterNotificationModal";
import NotificationIcon from "../Icon/NotificationIcon";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import CashierNotificationModal, { type CashierNotificationItem } from "../Modal/CashierNotificationModal";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  roleName?: string; // Misal: "Pelayan" atau "Kasir"
  showBack?: boolean;
  onBack?: () => void;
}

// --- MOCK DATA: Waiter Notifications ---
const initialWaiterNotifications: WaiterNotificationItem[] = [
  { id: "1", table: "Meja 07", time: "12.07", orderId: "#26040299", items: "1x Ayam Penyet, 2x Matcha Latte, 1x Es Teler", type: "new", isRead: false },
  { id: "2", table: "Meja 12", time: "11.59", orderId: "#26040298", items: "1x Ayam Penyet, 2x Lychee Tea", type: "new", isRead: false },
  { id: "3", table: "Meja 06", time: "Dimasak", orderId: "#26040297", items: "1x Es Teler, 2x Ayam Penyet, 1x Bakso Urat", type: "process", isRead: false },
  { id: "4", table: "Meja 04", time: "Dimasak", orderId: "#26040297", items: "1x Ayam Penyet, 1x Bakso Borax", type: "process", isRead: false },
];

// --- MOCK DATA: Cashier Notifications (TAMBAHKAN isRead: false) ---
const initialCashierNotifications: CashierNotificationItem[] = [
  { id: "1", table: "Meja 01", time: "14.20", orderId: "#ORD-16", items: "Nasi Goreng Batagor, Matcha Latte", method: "QR", isRead: false },
  { id: "2", table: "Meja 04", time: "16.11", orderId: "#ORD-15", items: "Ikan Bakar, Mie Ayam Bakso", method: "KIOSK", isRead: false },
  { id: "3", table: "Meja 06", time: "19.47", orderId: "#ORD-14", items: "Mie Ayam Bakso, Lemon Tea", method: "ONLINE", isRead: false },
  { id: "4", table: "Meja 02", time: "20.01", orderId: "#ORD-12", items: "Ayam Penyet, Es Teler", method: "KASIR", isRead: false },
  { id: "5", table: "Meja 03", time: "22.01", orderId: "#ORD-13", items: "Ayam Bakar, Es Gobak", method: "KASIR", isRead: false },
];

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

  const [waiterNotifs, setWaiterNotifs] = useState<WaiterNotificationItem[]>(initialWaiterNotifications);
  const [cashierNotifs, setCashierNotifs] = useState<CashierNotificationItem[]>(initialCashierNotifications);

  // Asumsi semua notif kasir yang baru belum dibaca (bisa disesuaikan nanti dengan API)
  const unreadWaiterCount = waiterNotifs.filter((n) => !n.isRead).length;
  const unreadCashierCount = cashierNotifs.filter((n) => !n.isRead).length;

  const isCashier = roleName?.toLowerCase() === "kasir";
  const unreadCount = isCashier ? unreadCashierCount : unreadWaiterCount;

  // Fungsi untuk menandai notifikasi sudah dibaca
  const handleMarkAsRead = (id: string) => {
    if (isCashier) {
      setCashierNotifs((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
    } else {
      setWaiterNotifs((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
    }
  };

  const handleBackClick = () => {
    if (onBack) onBack();
    else navigate(-1); // Default kembali ke halaman sebelumnya
  };

  const handleProfileClick = () => {
    // Tambahkan logika pengecekan untuk Dapur
    const role = roleName?.toLowerCase();
    if (role === "cashier") navigate("/cashier/profile");
    else if (role === "kitchen") navigate("/kitchen/profile");
    else navigate("/waiter/profile");
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Kiri: Judul & Subjudul */}
        <div className="flex flex-col">
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
            <h1 className="text-[23px] font-bold mb-1">{title}</h1>
          </div>

          {subtitle && (
            <p className="text-black/50 text-sm md:text-[15px]">{subtitle}</p>
          )}
        </div>

        {/* Kanan: Notifikasi & Profil */}
        {userName && roleName && (
          <div className="flex items-center gap-3.5">
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
              <span className="text-[15px]">
                {userName}/{roleName}
              </span>
              <div className="w-8.5 h-8.5 bg-primary rounded-full flex items-center justify-center">
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
        isCashier ? (
          <CashierNotificationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            notifications={cashierNotifs} 
            onMarkAsRead={handleMarkAsRead} 
          />
        ) : (
          <WaiterNotificationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            notifications={waiterNotifs}
            onMarkAsRead={handleMarkAsRead}
          />
        )
      )}
    </>
  );
};

export default DashboardHeader;