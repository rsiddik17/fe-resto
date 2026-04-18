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
    <div className="bg-white rounded-sm shadow-sm border-2 border-gray/25 p-5 flex gap-4">
      
      {/* Gambar Kiri */}
      <div className="w-25 h-25 bg-gray-200 rounded-sm shrink-0 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col justify-center">
        
        {/* Baris Atas: Nama & Harga */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-2xl leading-tight line-clamp-1 translate-y-2">{item.name}</h3>
          <span className="font-bold text-primary text-2xl whitespace-nowrap">
            {rupiahFormatter.format(item.price * item.qty)}
          </span>
        </div>

        {/* Baris Bawah: Catatan & Kontrol Qty */}
        <div className="flex justify-between items-end gap-2 mt-5">
          
          {/* Teks Catatan */}
         <div className="flex-1">
            <Button 
              onClick={() => onEditNote(item.cartId, item.notes)}
              className="flex items-center gap-1.5 bg-gray/15 text-gray px-4 py-2.5 rounded-xs font-normal w-75 cursor-pointer text-left"
            >
              <NotesIcon className="shrink-0" />
              <span className="text-lg truncate">
                {item.notes ? item.notes : "Tidak ada catatan"}
              </span>
            </Button>
          </div>
          {/* Kontrol + / - */}
          <div className="flex items-center gap-3 bg-secondary rounded-sm shrink-0">
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
              className="w-9 h-9"
            >
              <Minus size={14} strokeWidth={2.5} />
            </Button>
            <span className="font-bold w-4 text-center">{item.qty}</span>
            <Button 
              onClick={() => onIncrease(item.cartId)}
              variant="outline"
              size="icon"
              className="w-9 h-9"
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