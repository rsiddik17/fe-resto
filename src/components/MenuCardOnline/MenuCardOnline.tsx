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

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

// --- 1. COMPONENT UTAMA (WRAPPER) ---
interface MenuCardOnlineProps {
  children: React.ReactNode;
}

const MenuCardOnline = ({ children }: MenuCardOnlineProps) => {
  return (
    <div className="bg-white rounded-xs px-3 py-4 shadow-sm border border-secondary/10 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group">
      {children}
    </div>
  );
};

// --- 2. SUB-COMPONENT: HEADER (GAMBAR) ---
interface HeaderProps {
  image: string;
  name: string;
  stock?: number;
}

const HeaderOnline = ({ image, name, stock }: HeaderProps) => {
  // Logika stok: Jika stock undefined dianggap ada (untuk kiosk), jika 0 baru muncul Habis
  const isOutOfStock = stock === 0;

  return (
    <div className="w-full aspect-5/4 rounded-xs bg-gray/25 relative shrink-0 overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        loading="lazy" 
        className={`w-full h-full object-cover transition-all duration-300 ${isOutOfStock ? 'grayscale opacity-60' : 'group-hover:scale-105'}`} 
      />
      
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-in fade-in duration-300">
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

const Body = ({ name, price, description }: BodyProps) => {
  return (
    <div className="pt-4 pb-0 flex flex-col flex-1">
      <h3 className="font-bold text-lg text-black mb-1 line-clamp-1">{name}</h3>
      <p className="text-primary font-bold text-base mb-1">{rupiahFormatter.format(price)}</p>
      <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed mb-4 flex-1">
        {description}
      </p>
    </div>
  );
};

// --- 4. SUB-COMPONENT: FOOTER (TOMBOL) ---
interface FooterProps {
  onAdd: () => void;
  disabled?: boolean;
}

const Footer = ({ onAdd, disabled }: FooterProps) => {
  return (
    <div className="px-2 py-0 mt-auto">
      <Button
        onClick={onAdd}
        disabled={disabled}
        className={`w-full py-2 rounded-full text-sm font-semibold transition-all ${
          disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-none' 
            : 'hover:brightness-90'
        }`}
      >
        {disabled ? 'Habis' : 'Tambah'}
      </Button>
    </div>
  );
};

MenuCardOnline.Header = HeaderOnline;
MenuCardOnline.Body = Body;
MenuCardOnline.Footer = Footer;

export default MenuCardOnline;