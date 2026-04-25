import type React from "react";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";

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
    <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-secondary/10 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow relative">
      {children}
    </div>
  );
};

// --- 2. SUB-COMPONENT: HEADER (GAMBAR) ---
interface HeaderProps {
  image: string;
  name: string;
  isOutOfStock?: boolean;
}

const Header = ({ image, name, isOutOfStock = false }: HeaderProps) => {
  return (
    <div className="w-full h-35 md:h-56.25 rounded-sm bg-gray/25 relative shrink-0 overflow-hidden">
      <img src={image} alt={name} loading="lazy" className={cn(
          "w-full h-full object-cover transition-opacity",
          isOutOfStock ? "opacity-50 grayscale-30" : "opacity-100"
        )} />

        {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className=" w-24 h-24 md:w-28 md:h-28 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-sm">
            Habis
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

// format rupiah
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const Body = ({ name, price, description }: BodyProps) => {
  const formattedPrice = rupiahFormatter.format(price);
  return (
    // flex-1 agar body mengambil sisa ruang kosong (membantu footer selalu di bawah)
    <div className="pt-2 pb-0 flex flex-col flex-1">
      <h3 className="font-bold text-sm md:text-lg text-black mb-2 line-clamp-1">{name}</h3>
      <p className="text-primary font-bold text-sm md:text-base mb-1">{formattedPrice}</p>
      <p className="text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed mb-3 flex-1">
        {description}
      </p>
    </div>
  );
};

// --- 4. SUB-COMPONENT: FOOTER (TOMBOL) ---
interface FooterProps {
  onAdd: () => void;
}

const Footer = ({ onAdd }: FooterProps) => {
  return (
    <div className="px-2 md:px-2.5 py-0 mt-auto">
      <Button
        onClick={onAdd}
        className="w-full py-1 md:py-2 rounded-full text-sm font-normal shadow-sm"
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
