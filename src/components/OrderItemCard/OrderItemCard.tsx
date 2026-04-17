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
    // py-4 untuk spasi atas-bawah
    // border-b untuk garis bawah, dan last:border-b-0 agar item paling bawah tidak punya garis
    // items-end agar Harga di kanan sejajar dengan teks Catatan di kiri
    <div className="py-2 mb-1 border-b border-gray/75 flex justify-between items-end gap-4">
      {/* SISI KIRI: Nama & Catatan */}
      <div className="flex-1 flex flex-col gap-1.5">
        <h3
          className={cn(
            "text-3xl leading-tight",
            // 2. LOGIKA KONDISIONAL UNTUK NAMA MENU
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
          // 3. LOGIKA KONDISIONAL UNTUK HARGA
          isReceiptMode ? "text-black" : "font-bold text-primary",
        )}
      >
        {rupiahFormatter.format(item.price * item.qty)}
      </span>
    </div>
  );
};

export default OrderItemCard;
