import { Minus, Plus, FileText } from "lucide-react";
import { type CartItem } from "../../store/useCartStore";
import Button from "../ui/Button";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: (cartId: string) => void;
  onDecrease: (cartId: string) => void;
  onEditNote: (cartId: string, currentNote: string) => void;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const CartItemCard = ({ item, onIncrease, onDecrease, onEditNote }: CartItemCardProps) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 flex gap-4">
      
      {/* Gambar Kiri */}
      <div className="w-22 h-22 bg-gray-200 rounded-sm shrink-0 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col justify-center">
        
        {/* Baris Atas: Nama & Harga */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-2xl leading-tight line-clamp-1">{item.name}</h3>
          <span className="font-bold text-primary text-xl whitespace-nowrap">
            {rupiahFormatter.format(item.price * item.qty)}
          </span>
        </div>

        {/* Baris Bawah: Catatan & Kontrol Qty */}
        <div className="flex justify-between items-end gap-2 mt-3">
          
          {/* Teks Catatan */}
         <div className="flex-1">
            <Button 
              onClick={() => onEditNote(item.cartId, item.notes)}
              className="flex items-center gap-1.5 bg-secondary/80 text-gray px-4 py-2.5 rounded-xs font-normal w-75 cursor-pointer text-left"
            >
              <FileText size={14} className="shrink-0" />
              <span className="text-xs truncate">
                {item.notes ? item.notes : "Tidak ada catatan"}
              </span>
            </Button>
          </div>
          {/* Kontrol + / - */}
          <div className="flex items-center gap-3 bg-secondary rounded-sm shrink-0">
            <Button 
              onClick={() => onDecrease(item.cartId)}
              variant="outline"
              size="icon"
            >
              <Minus size={14} strokeWidth={2.5} />
            </Button>
            <span className="font-bold w-4 text-center">{item.qty}</span>
            <Button 
              onClick={() => onIncrease(item.cartId)}
              variant="outline"
              size="icon"
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