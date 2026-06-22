import { Minus, Plus } from "lucide-react";
import { type CartItem } from "../../store/useCartStore";
import Button from "../ui/Button";
import NotesIcon from "../Icon/NotesIcon";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: (cartId: string) => void;
  onDecrease: (cartId: string) => void;
  onEditNote: (cartId: string, currentNote: string) => void;
  onDeletePrompt: (cartId: string) => void;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const CartItemCard = ({ item, onIncrease, onDecrease, onEditNote, onDeletePrompt }: CartItemCardProps) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray/25 p-3 md:p-4.5 flex gap-4 md:gap-5">
      
      {/* Gambar Kiri */}
      <div className="w-21 h-21 md:w-25 md:h-25 lg:w-23 lg:h-23 bg-gray-200 rounded-sm shrink-0 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col justify-center">
        
        {/* Baris Atas: Nama & Harga */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm md:text-2xl lg:text-xl leading-tight line-clamp-1 md:translate-y-2">{item.name}</h3>
          <span className="font-bold text-primary text-sm md:text-[22px] lg:text-xl whitespace-nowrap">
            {rupiahFormatter.format(item.price * item.qty)}
          </span>
        </div>

        {/* Baris Bawah: Catatan & Kontrol Qty */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-2 mt-2 md:mt-5">
          
          {/* Teks Catatan */}
         <div className="order-2 md:order-1 flex-1 min-w-0 w-full">
            <Button 
              onClick={() => onEditNote(item.cartId, item.notes)}
              className="flex items-center gap-1.5 bg-white text-gray px-3 py-1.25 md:px-4 md:py-2.5 lg:py-2 rounded-xs font-normal w-full md:w-90 lg:w-100 cursor-pointer text-left border-[1.5px] border-primary/75 hover:bg-gray/5"
            >
              <NotesIcon className="shrink-0" />
              <span className="text-[13px] md:text-lg lg:text-base flex-1 truncate">
                {item.notes ? item.notes : "Tidak ada catatan"}
              </span>
            </Button>
          </div>

          {/* Kontrol + / - */}
          <div className="order-1 md:order-2 w-fit ml-auto flex items-center justify-end gap-2 md:gap-3 bg-secondary rounded-sm shrink-0">
            <Button 
              onClick={() => {
                if (item.qty === 1) {
                  onDeletePrompt(item.cartId); // Munculkan modal
                } else {
                  onDecrease(item.cartId); // Kurangi biasa
                }
              }}
              variant="outline"
              size="icon"
              className="w-5 h-5 md:w-9 md:h-9 lg:w-8 lg:h-8 border-2"
            >
              <Minus size={16} strokeWidth={2.5} />
            </Button>

            <span className="font-bold w-4 text-sm md:text-lg lg:text-base text-center">{item.qty}</span>
            
            <Button 
              onClick={() => onIncrease(item.cartId)}
              variant="outline"
              size="icon"
              disabled={item.qty >= (item.stock || 0)}
              className="w-5 h-5 md:w-9 md:h-9 lg:w-8 lg:h-8 border-2"
            >
              <Plus size={16} strokeWidth={2.5} />
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CartItemCard;