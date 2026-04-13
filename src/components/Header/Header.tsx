import { Link, NavLink, useNavigate } from "react-router";
import { Bell, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  navLinks?: NavLink[];
  mode?: "kiosk" | "online";
}

const Header = ({ navLinks, mode = "kiosk" }: HeaderProps) => {
  const navigate = useNavigate()
  const isOnline = mode === "online";
  const onlineMenuItems = [
    { name: "Beranda", path: "/customer/home" },
    { name: "Menu", path: "/customer/menu" },
    { name: "Pesanan", path: "/customer/orders" },
  ];
  const totalItems = useCartStore((state) => state.getTotalItems());
  return (
    <header className="bg-white py-3 px-6 md:px-12 flex items-center justify-between border-b border-gray/50 sticky top-0 z-100">
      {/* <div className={isOnline 
        ? "max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between" 
        : "py-3 px-6 md:px-12 flex items-center justify-between"}
      ></div> */}
      <div className="flex items-center">
        <img
          src="/images/logo.webp"
          alt="Logo"
          width="54"
          height="60"
          className="h-12"
        />
        <span className="ml-3 text-primary font-bold text-xl">IT'S Resto</span>

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
                      <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Navigasi (Hanya muncul jika navLinks dikirim) */}

      {!isOnline && navLinks && navLinks.length > 0 && (
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {isOnline ? (
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-primary text-white rounded-full transition-all active:scale-95">
            <Bell size={20} />
          </button>
          <button
            onClick={() => navigate("/customer/cart")}
            className="p-2.5 bg-primary text-white rounded-full relative transition-all active:scale-95"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold animate-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
            
          </button>
          <button className="p-2.5 bg-primary text-white rounded-full transition-all active:scale-95">
            <User size={20} />
          </button>
        </div>
      ) : (
        navLinks &&
        navLinks.length > 0 && (
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )
      )}
    </header>
  );
};

export default Header;
