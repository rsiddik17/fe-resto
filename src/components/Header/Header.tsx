import { Link } from "react-router";

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  navLinks?: NavLink[];
}

const Header = ({ navLinks }: HeaderProps) => {
  return (
    <header className="bg-white h-27.5 py-3 px-2 md:px-4 flex items-center justify-between border-b border-gray/50">
      <div className="flex items-center">
        <img src="/images/logo.webp" alt="Logo" className="w-23.75 h-23.75" />
        <span className="ml-3 text-primary font-bold text-4xl">IT'S Resto</span>
      </div>

      {/* Navigasi (Hanya muncul jika navLinks dikirim) */}
      {navLinks && navLinks.length > 0 && (
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="text-gray-600 hover:text-primary font-medium transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;