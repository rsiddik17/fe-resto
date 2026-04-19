import { type CartItem } from "../../store/useCartStore"; // Pastikan path ini sesuai dengan foldermu
import { cn } from "../../utils/utils";
import NotesIcon from "../Icon/NotesIcon";

interface OrderItemCardProps {
  item: CartItem;
  isReceiptMode?: boolean;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const OrderItemCard = ({ item, isReceiptMode = false }: OrderItemCardProps) => {
  return (
    <div className="py-2 mb-1 border-b border-gray/75 flex justify-between items-end gap-4">
      {/* SISI KIRI: Nama & Catatan */}
      <div className="flex-1 flex flex-col gap-1.5">
        <h3
          className={cn(
            "text-3xl leading-tight",
            isReceiptMode ? "text-black" : "font-bold text-black",
          )}
        >
          {item.name} <span>x{item.qty}</span>
        </h3>

        <div className="flex items-center gap-2 text-gray">
          <NotesIcon className="shrink-0" />
          <span className="text-xl line-clamp-1">
            {item.notes ? item.notes : "Tidak ada"}
          </span>
        </div>
      </div>

      {/* SISI KANAN: Total Harga per Item */}
      <span
        className={cn(
          "text-2xl shrink-0",
          isReceiptMode ? "text-black" : "font-bold text-primary",
        )}
      >
        {rupiahFormatter.format(item.price * item.qty)}
      </span>
    </div>
  );
};

export default OrderItemCard;
