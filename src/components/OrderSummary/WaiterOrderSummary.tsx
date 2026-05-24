import { Plus } from "lucide-react";
import { type CartItem } from "../../store/useCartStore";
import Button from "../ui/Button";

interface WaiterOrderSummaryProps {
  items: CartItem[];
  subTotal: number;
  taxRate?: number;
  discountAmount?: number;
  onAddDiscount: () => void;
  onRemoveDiscount: () => void;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const WaiterOrderSummary = ({
  items,
  subTotal,
  taxRate = 10,
  discountAmount = 0,
  onAddDiscount,
  onRemoveDiscount,
}: WaiterOrderSummaryProps) => {

  const discountedSubtotal = Math.max(0, subTotal - discountAmount);

  const taxAmount = discountedSubtotal * (taxRate / 100);

  const grandTotal = discountedSubtotal + taxAmount;

  return (
    <div className="bg-white border-[1.5px] border-gray-200 rounded-sm p-3 shadow-sm flex flex-col gap-2 animate-in fade-in duration-300">
      <h3 className="font-extrabold text-[15px]">Ringkasan Pesanan</h3>

      {/* Rincian Item Keranjang */}
      <div className="flex flex-col gap-1.5 text-[13px] text-black font-medium">
        {items.map((item) => (
          <div key={item.cartId} className="flex justify-between items-center">
            <span className="line-clamp-1 pr-2">
              {item.name} x{item.qty}
            </span>
            <span className="shrink-0">
              {rupiahFormatter.format(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Rincian Biaya */}
      <div className="flex flex-col gap-1 text-[13px] text-black font-medium ">
        <div className="flex justify-between items-center">
          <span>Total Pesanan</span>
          <span>{rupiahFormatter.format(subTotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>PPN {taxRate}%</span>
          <span>{rupiahFormatter.format(taxAmount)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span>Diskon</span>
            <span>-{rupiahFormatter.format(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Tombol Diskon di Dalam Kotak */}
      <div className="mt-2">
        {discountAmount > 0 ? (
          <Button
            variant="outline"
            onClick={onRemoveDiscount}
            className="w-full py-1.25 text-[14px] md:text-[14px] lg:text-[14px] font-bold border-[1.5px] border-gray-300 text-gray-500 hover:bg-gray-50 rounded-md"
          >
            Batalkan Diskon
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onAddDiscount}
            className="w-full py-1.25 text-[14px] md:text-[14px] lg:text-[14px] font-bold border-2 border-primary text-primary hover:bg-primary/5 rounded-md flex justify-center items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" strokeWidth={3} /> Tambah Diskon
          </Button>
        )}
      </div>

      {/* Total Akhir */}
      <div className="flex justify-between items-center">
        <span className="font-extrabold text-[14.5px] text-black">
          Total Pembayaran
        </span>
        <span className="font-extrabold text-[14.5px] text-black">
          {rupiahFormatter.format(grandTotal)}
        </span>
      </div>
    </div>
  );
};

export default WaiterOrderSummary;
