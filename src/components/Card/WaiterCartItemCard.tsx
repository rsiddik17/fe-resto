import { Minus, Plus } from "lucide-react";
import { type CartItem } from "../../store/useCartStore";
import Button from "../ui/Button";
import NotesIcon from "../Icon/NotesIcon";

interface WaiterCartItemCardProps {
  item: CartItem;
  onIncrease: (cartId: string) => void;
  onDecrease: (cartId: string) => void;
  onEditNote: (cartId: string) => void;
  onDeletePrompt: (cartId: string) => void;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const WaiterCartItemCard = ({ item, onIncrease, onDecrease, onEditNote, onDeletePrompt }: WaiterCartItemCardProps) => {
  return (
    // 1. Ubah wrapper utama jadi flex-col agar bisa atas-bawah
    <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
      
      {/* --- BARIS ATAS: Gambar, Info (Nama & Qty), Harga --- */}
      <div className="flex gap-3 items-center w-full">
        
        {/* Gambar Kiri (Ukuran tetap) */}
        <div className="w-18.5 h-17.5 bg-gray-100 rounded-md shrink-0 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* Tengah: Nama & Kontrol Qty */}
        <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
          <h3 className="font-bold text-[14px] leading-tight line-clamp-1 text-black">
            {item.name}
          </h3>

          {/* Kontrol + / - (Ukuran dan style tetap, ditambahkan w-fit) */}
          <div className="flex items-center gap-2 bg-secondary rounded-sm w-fit p-0.5">
            <Button 
              onClick={() => {
                if (item.qty === 1) onDeletePrompt(item.cartId); // Panggil modal
                else onDecrease(item.cartId);
              }}
              variant="outline"
              size="icon"
              // PENYESUAIAN UKURAN DESKTOP: w-9 h-9 jadi w-7 h-7
              className="w-5.5 h-5.5 border-2 rounded-xs"
            >
              <Minus size={14} strokeWidth={2.5} />
            </Button>

            {/* PENYESUAIAN UKURAN DESKTOP: text-lg jadi text-[13px] */}
            <span className="font-bold w-4 text-[13px] text-center">{item.qty}</span>
            
            <Button 
              onClick={() => onIncrease(item.cartId)}
              variant="outline"
              size="icon"
              className="w-5.5 h-5.5 border-2 rounded-xs"
            >
              <Plus size={14} strokeWidth={2.5} />
            </Button>
          </div>

        </div>

        {/* Kanan: Harga */}
        <div className="shrink-0">
          <span className="font-bold text-primary text-[14px] whitespace-nowrap">
            {rupiahFormatter.format(item.price * item.qty)}
          </span>
        </div>

      </div>

      {/* --- BARIS BAWAH: Catatan --- */}
      <div className="w-full">
        <Button 
          onClick={() => onEditNote(item.cartId)}
          variant="outline"
          // Hapus max-w-[140px] agar full, tambahkan justify-start agar icon/teks di kiri
          className="flex items-center justify-start gap-1.5 bg-gray/15 text-gray-500 px-2.5 py-1.5 rounded-sm font-normal w-full border-gray-200 cursor-pointer text-left hover:bg-gray/20 transition-colors"
        >
          <NotesIcon className="shrink-0 w-3.5 h-3.5" />
          <span className="text-[11px] truncate">
            {item.notes ? item.notes : "Tidak ada"}
          </span>
        </Button>
      </div>

    </div>
  );
};

export default WaiterCartItemCard;