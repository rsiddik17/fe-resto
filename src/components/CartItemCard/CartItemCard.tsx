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
    <div className="bg-white rounded-sm shadow-sm border-2 border-gray/25 p-3 md:p-5 flex gap-3 md:gap-4">
      
      {/* Gambar Kiri */}
      <div className="w-23 h-23 md:w-25 md:h-25 bg-gray-200 rounded-sm shrink-0 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col justify-center">
        
        {/* Baris Atas: Nama & Harga */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm md:text-2xl leading-tight line-clamp-1 md:translate-y-2">{item.name}</h3>
          <span className="font-bold text-primary text-sm md:text-2xl whitespace-nowrap">
            {rupiahFormatter.format(item.price * item.qty)}
          </span>
        </div>

        {/* Baris Bawah: Catatan & Kontrol Qty */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-2 mt-2 md:mt-5">
          
          {/* Teks Catatan */}
         <div className="order-2 md:order-1 flex-1">
            <Button 
              onClick={() => onEditNote(item.cartId, item.notes)}
              className="flex items-center gap-1.5 bg-gray/15 text-gray px-3 py-1.5 md:px-4 md:py-2.5 rounded-xs font-normal w-full md:w-75 cursor-pointer text-left"
            >
              <NotesIcon className="shrink-0" />
              <span className="text-xs md:text-lg truncate">
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
              className="w-5 h-5 md:w-9 md:h-9"
            >
              <Minus size={14} strokeWidth={2.5} />
            </Button>

            <span className="font-bold w-4 text-center">{item.qty}</span>
            
            <Button 
              onClick={() => onIncrease(item.cartId)}
              variant="outline"
              size="icon"
              className="w-5 h-5 md:w-9 md:h-9"
            >
              <Plus size={14} strokeWidth={2.5} />
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CartItemCard;