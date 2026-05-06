import { type CartItem } from "../../store/useCartStore";
import NotesIcon from "../Icon/NotesIcon";

interface WaiterReceiptItemCardProps {
  item: CartItem;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const WaiterReceiptItemCard = ({ item }: WaiterReceiptItemCardProps) => {
  return (
    <div className="py-0.5 flex justify-between items-start">
      {/* KIRI: Nama & Catatan */}
      <div className="flex-1 flex flex-col gap-0.5">
        <h3 className="text-[13px] text-black font-medium leading-tight">
          {item.name} x{item.qty}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500">
          <NotesIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] line-clamp-1">
            {item.notes ? item.notes : "Tidak ada"}
          </span>
        </div>
      </div>

      {/* KANAN: Harga */}
      <span className="text-[13px] text-black shrink-0 font-medium">
        {rupiahFormatter.format(item.price * item.qty)}
      </span>
    </div>
  );
};

export default WaiterReceiptItemCard;