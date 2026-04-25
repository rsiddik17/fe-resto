import Button from "../ui/Button";
import CartIcon from "../Icon/CartIcon";

interface CartBottomBarProps {
  totalItems: number;
  onViewCart: () => void;
}

const CartBottomBar = ({ totalItems, onViewCart }: CartBottomBarProps) => {

  return (
    <div className="fixed bottom-0 left-0 w-full h-20 md:h-26.25 bg-white border-t border-gray/50 px-6 md:px-8 z-50 shadow-sm">
      <div className="mx-auto h-full flex items-center justify-between">
        
        {/* Info Keranjang */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative">
            <div className="bg-primary p-2 md:p-3 rounded-full flex items-center justify-center">
              <CartIcon className="text-white" />
            </div>
            {/* Badge Angka */}
            <div className="absolute -top-1 -right-1 bg-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center">
              <div className="bg-primary text-white border border-primary w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
              {totalItems}
            </div>
            </div>
          </div>
          <div className="ml-2">
            <p className="text-sm md:text-base">Keranjangmu</p>
            <p className="text-sm md:text-base">{totalItems} Terpilih</p>
          </div>
        </div>

        {/* Tombol Lihat Keranjang */}
        <Button onClick={onViewCart} className="px-6 md:px-8 py-2 md:py-2.5 rounded-xl font-bold text-sm md:text-base">
          Lihat Keranjang
        </Button>

      </div>
    </div>
  );
};

export default CartBottomBar;