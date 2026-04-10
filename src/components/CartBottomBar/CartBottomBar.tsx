import { ShoppingCart } from "lucide-react";
import Button from "../ui/Button";

interface CartBottomBarProps {
  totalItems: number;
  onViewCart: () => void;
}

const CartBottomBar = ({ totalItems, onViewCart }: CartBottomBarProps) => {

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 px-6 md:px-12 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Info Keranjang */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-primary p-3 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-white" size={24} />
            </div>
            {/* Badge Angka */}
            <div className="absolute -top-1 -right-1 bg-white text-primary border border-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {totalItems}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Keranjangmu</p>
            <p className="font-bold text-black">{totalItems} Terpilih</p>
          </div>
        </div>

        {/* Tombol Lihat Keranjang */}
        <Button onClick={onViewCart} className="px-8 py-3 rounded-xl font-bold">
          Lihat Keranjang
        </Button>

      </div>
    </div>
  );
};

export default CartBottomBar;