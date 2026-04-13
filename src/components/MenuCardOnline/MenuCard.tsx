import type React from "react";
import Button from "../ui/Button";

// --- INTERFACES ---
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  stock?: number;
  image: string;
  category: "makanan" | "minuman";
}

// --- 1. COMPONENT UTAMA (WRAPPER) ---
interface MenuCardProps {
  children: React.ReactNode;
}

const MenuCard = ({ children }: MenuCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-secondary/10 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {children}
    </div>
  );
};

// --- 2. SUB-COMPONENT: HEADER (GAMBAR) ---
// Perbaikan: Samakan interface dengan parameter yang digunakan
interface HeaderProps {
  image: string;
  name: string;
  stock?: number; // Tambahkan stock di sini
}

const Header = ({ image, name, stock }: HeaderProps) => {
  const isOutOfStock = stock === 0;
  return (
    <div className="w-full h-48 rounded-xs bg-gray/25 relative shrink-0">
      {/* Perbaikan: Gunakan backtick (`) untuk template literals di className */}
      <img 
        src={image} 
        alt={name} 
        loading="lazy" 
        className={`w-full h-full object-cover transition-all duration-300 ${
          isOutOfStock ? 'grayscale opacity-60' : 'group-hover:scale-105'
        }`} 
      />
      
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
            <span className="text-white font-bold text-sm">Habis</span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3. SUB-COMPONENT: BODY (INFO TEKS) ---
interface BodyProps {
  name: string;
  price: number;
  description: string;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const Body = ({ name, price, description }: BodyProps) => {
  const formattedPrice = rupiahFormatter.format(price);
  return (
    <div className="pt-4 pb-0 flex flex-col flex-1">
      <h3 className="font-bold text-lg text-black mb-2 line-clamp-1">{name}</h3>
      <p className="text-primary font-bold text-base mb-1">{formattedPrice}</p>
      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3 flex-1">
        {description}
      </p>
    </div>
  );
};

// --- 4. SUB-COMPONENT: FOOTER (TOMBOL) ---
interface FooterProps {
  onAdd: () => void;
  disabled?: boolean; // Tambahan: prop disabled jika stok habis
}

const Footer = ({ onAdd, disabled }: FooterProps) => {
  return (
    <div className="px-2.5 py-0 mt-auto">
      <Button
        onClick={onAdd}
        disabled={disabled}
        className={`w-full py-2 rounded-full text-sm font-semibold ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Tambah
      </Button>
    </div>
  );
};

MenuCard.Header = Header;
MenuCard.Body = Body;
MenuCard.Footer = Footer;

export default MenuCard;