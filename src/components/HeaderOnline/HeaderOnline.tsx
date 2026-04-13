// HeaderOnline.tsx
import { Bell, ShoppingCart, User } from "lucide-react";
import { NavLink } from "react-router";
// import MenuPageOnline from "../../pages/customer/MenuPageOnline";

const HeaderOnline = () => {
  const menuItems = [
    { name: "Beranda", path: "/customer/home" },
    { name: "Menu", path: "/customer/menu" },
    { name: "Pesanan", path: "/customer/orders" },
  ];
  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-12">
        <img src="/images/logo.webp" alt="Logo" className="h-10" />
        <span className="ml-3 text-primary font-bold text-xl whitespace-nowrap">
          IT'S Resto
        </span>
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end // Penting agar '/' tidak selalu dianggap aktif
              className={({ isActive }) =>
                `relative pb-1 text-sm font-medium transition-colors ${
                  isActive ? "text-black" : "text-gray-500 hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Action Icons - Sesuai Gambar Beranda Online */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 bg-primary text-white rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-2.5 bg-primary text-white rounded-full relative">
          <ShoppingCart size={20} />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
            0
          </span>
        </button>
        <button className="p-2.5 bg-primary text-white rounded-full">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default HeaderOnline;
