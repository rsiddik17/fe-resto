import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { Bell, User, Menu, X } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useOrderStore } from "../../store/useOrderStore"; // Tambahkan import store pesanan
import Keranjang from "../Icon/Keranjang";
import NotificationModal from "../NotificationModal/NotificationModal";

const HeaderOnline = ({ navLinks, mode = "online" }: any) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOnline = mode === "online";
  const [isNotifOpen, setIsNotifOpen] = useState(false); // State notifikasi sudah ada di sini
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Ambil status pesanan terbaru dari store untuk dikirim ke modal notifikasi
  const { orders } = useOrderStore() as any;
  const latestStatus = orders[0]?.status || "Proses";

  const onlineMenuItems = [
    { name: "Beranda", path: "/customer/home" },
    { name: "Menu", path: "/customer/menu" },
    { name: "Pesanan", path: "/customer/pesanan" },
  ];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: any) => {
      if (e.matches) {
        setIsMenuOpen(false);
      }
    };
    media.addEventListener("change", handleChange);
    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <header className="bg-white py-3 px-4 md:px-12 flex items-center justify-between border-b border-gray-100 sticky top-0 z-110 w-full">
      {/* Kiri: Logo & Nav Desktop */}
      <div className="flex items-center shrink-0">
        <img
          src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
          alt="Logo"
          className="h-10 md:h-14 w-auto"
        />
        <span className="ml-2 text-primary font-bold text-sm md:text-lg">
          IT'S Resto
        </span>

        {isOnline && (
          <nav className="hidden md:flex items-center gap-8 ml-10">
            {onlineMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `relative pb-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-black font-bold"
                      : "text-gray-500 hover:text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-4.5 left-0 w-full h-0.5 bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Kanan: Icons & Hamburger */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {isOnline && (
          <>
            {/* BUTTON BELL: Ditambahkan onClick untuk buka notif */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all relative"
            >
              <Bell size={18} />
              {/* Dot merah tanda ada notif baru masuk */}
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <button
              onClick={() => navigate("/customer/keranjang")}
              className="p-2 bg-primary text-white rounded-full relative hover:bg-primary/90 transition-all"
            >
              <Keranjang size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/customer/profil")}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all"
            >
              <User size={18} />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 bg-secondary text-primary rounded-full border border-primary/20"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </>
        )}
      </div>

      {/* MODAL NOTIFIKASI: Diletakkan di sini agar bisa muncul overlay */}
      {isNotifOpen && (
        <NotificationModal
          onClose={() => setIsNotifOpen(false)}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isOnline && isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-[-1] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-5 flex flex-col gap-4 md:hidden shadow-2xl animate-in slide-in-from-top duration-300">
            {onlineMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-bold py-3 px-4 rounded-xl ${isActive ? "bg-secondary text-primary" : "text-gray-600 active:bg-gray-50"}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </>
      )}
    </header>
  );
};

export default HeaderOnline;
