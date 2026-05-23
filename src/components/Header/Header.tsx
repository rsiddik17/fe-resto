import { Link, useNavigate } from "react-router";
import UserIconSingle from "../Icon/UserIconSingle";

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  navLinks?: NavLink[];

  // Props untuk Tombol Profil (Gambar 1)
  showProfile?: boolean;
  userName?: string;
  profileHref?: string;

  // Props untuk Tombol Kembali (Gambar 2 - Halaman Profil)
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header = ({
  navLinks,
  showProfile = false,
  userName = "KiosK",
  profileHref = "/kiosk/profile",
  showBackButton = false,
  onBack,
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white h-17.5 md:h-27.5 lg:h-20 py-3 px-2 md:px-4 flex items-center justify-between border-b border-gray/50">
      <div className="flex items-center">
        <img
          src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
          alt="Logo"
          className="w-18.5 h-18.5 md:w-23.75 md:h-23.75 lg:w-21.75 lg:h-21.75"
        />
        <span className="ml-0 md:ml-1 text-primary font-bold text-xl md:text-3xl lg:text-2xl">
          IT'S Resto
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* 1. Navigasi Teks (Jika ada) */}
        {navLinks && navLinks.length > 0 && (
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

        {/* 2. Tombol Profil (Gambar 1) */}
        {showProfile && !showBackButton && (
          <button
            onClick={() => navigate(profileHref)}
            // Padding pr-1.5 dibikin tipis agar ikon ungunya menempel ke dinding kanan border
            className="flex items-center gap-3 md:gap-4 border border-gray-300 rounded-lg pl-4 md:pl-5 pr-1 md:pr-2 py-1 md:py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-black font-medium text-sm md:text-xl lg:text-lg">
              {userName}
            </span>
            <div className="bg-primary rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 flex items-center justify-center">
              <UserIconSingle
                className="text-white w-5 h-5 md:w-6 md:h-6"
                strokeWidth={2}
              />
            </div>
          </button>
        )}

        {/* 3. Tombol Kembali (Gambar 2 - Khusus Halaman Profil) */}
        {showBackButton && (
          <button
            onClick={onBack || (() => navigate(-1))}
            className="bg-secondary px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-xl lg:text-base transition-colors cursor-pointer"
          >
            Kembali
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;