import { useState } from "react";
import { ArrowLeft, Minus, Plus, FileText, ShoppingCart } from "lucide-react";
import { type MenuItem } from "../MenuCardOnline/MenuCardOnline";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";

interface MenuItemModalOnlineProps {
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, qty: number, notes: string) => void;
  mode?: "kiosk" | "online";
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const MenuItemModalOnline = ({
  item,
  onClose,
  onAdd,
  mode = "kiosk",
}: MenuItemModalOnlineProps) => {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  const stock = item.stock || 0;
  const isOnline = mode === "online";

  const handleInc = () => {
    if (qty < stock) setQty((prev) => prev + 1);
  };

  const handleDec = () => {
    if (qty > 0) setQty((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (qty > 0) {
      onAdd(item, qty, notes);
    }
  };

  return (
    <div
      className="fixed inset-0 z-150 flex items-center justify-center bg-black/10 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white w-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200",
          isOnline ? "max-w-85 rounded-xs p-5" : "max-w-md rounded-2xl p-5.5",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- HEADER: GAMBAR --- */}
        <div
          className={cn(
            "relative w-full bg-gray-100 shrink-0",
            isOnline
              ? " h-70 aspect-4/3 rounded-sm overflow-hidden mb-1"
              : "h-95 rounded-sm",
          )}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 left-2 bg-white/90 px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold text-black shadow-sm"
          >
            <ArrowLeft size={12} strokeWidth={3} /> Kembali
          </button>
        </div>

        {/* --- BODY --- */}
        <div
          className={cn(
            "flex flex-col",
            isOnline ? "pt-2 gap-2" : "pt-6 gap-4",
          )}
        >
          <div className="flex flex-col items-start border-b border-gray-100 pb-2">
            <div className="w-full flex justify-between items-baseline">
              <h2
                className={cn(
                  "font-bold text-black leading-tight",
                  isOnline ? "text-lg" : "text-2xl",
                )}
              >
                {item.name}
              </h2>
              <span
                className={cn(
                  "text-primary font-bold",
                  isOnline ? "text-sm" : "text-xl",
                )}
              >
                {rupiahFormatter.format(item.price)}
              </span>
            </div>
            <p
              className={cn(
                "text-gray-400 mt-0.5 leading-tight",
                isOnline ? "text-[10px]" : "text-sm",
              )}
            >
              {item.description}
            </p>
          </div>

          <div className="flex justify-between items-center h-8">
            <span
              className={cn(
                "font-bold text-black",
                isOnline ? "text-xs" : "text-lg",
              )}
            >
              Jumlah
            </span>
            <div className="flex items-center gap-4 bg-[#F3F4F6] p-1.5 rounded-full border border-gray-100">
              <button
                onClick={handleDec}
                disabled={qty <= 0}
                className="w-6 h-6 rounded-xs border-[1.5px] border-black flex items-center justify-center text-black disabled:opacity-20 transition-colors"
              >
                <Minus size={12} strokeWidth={4} />
              </button>
              <span className="font-bold text-sm w-4 text-center">{qty}</span>
              <button
                onClick={handleInc}
                disabled={qty >= stock}
                className="w-6 h-6 rounded-xs border-[1.5px] border-primary flex items-center justify-center text-primary disabled:opacity-20 transition-colors"
              >
                <Plus size={12} strokeWidth={4} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center h-6">
            <span
              className={cn("text-black", isOnline ? "text-xs" : "text-lg")}
            >
              Stok
            </span>
            <span
              className={cn(
                "font-bold text-primary",
                isOnline ? "text-xs" : "text-lg",
              )}
            >
              {stock}
            </span>
          </div>

          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <FileText size={12} />
            </div>
            <input
              type="text"
              placeholder="Catatan (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2 bg-gray-100 border-none outline-none rounded-[8px] placeholder:text-gray-400",
                isOnline ? "text-[11px]" : "text-sm",
              )}
            />
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={qty === 0}
            className={cn(
              "w-full mt-2 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs",
              qty === 0 && "opacity-50 cursor-not-allowed",
            )}
          >
            <ShoppingCart size={14} /> + Tambah ke Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModalOnline;
