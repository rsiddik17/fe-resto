import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { type MenuItem } from "../Card/MenuCard";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { cn } from "../../utils/utils";
import AddToCartIcon from "../Icon/AddToCartIcon";
import AddNotesIcon from "../Icon/AddNotesIcon";

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, qty: number, notes: string) => void;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const MenuItemModal = ({ item, onClose, onAdd }: MenuItemModalProps) => {
  const stock = item.stock || 0;
  const isOutOfStock = stock <= 0;

  const [qty, setQty] = useState(isOutOfStock ? 0 : 1);
  const [notes, setNotes] = useState("");


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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4"
      onClick={onClose} // Menutup modal jika klik area luar
    >
      <div
        className="bg-white w-full max-w-[88%] md:max-w-md lg:max-w-sm p-4 md:p-5.5 lg:p-4.5 rounded-2xl overflow-hidden shadow-sm flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup jika isinya diklik
      >
        {/* --- HEADER: GAMBAR & TOMBOL KEMBALI --- */}
        <div className="relative h-60 md:h-95 lg:h-70 w-full bg-gray/25 rounded-sm shrink-0">
          <img
            src={item.image}
            alt={item.name}
           className={cn(
              "w-full h-full object-cover transition-opacity rounded-sm",
              isOutOfStock ? "opacity-50 grayscale-30" : "opacity-100"
            )}
          />

            {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-sm">
                Habis
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-2 left-1 md:left-2 bg-white/90 backdrop-blur px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1.5 text-[13px] md:text-sm shadow-sm hover:bg-white transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>

        {/* --- BODY: INFO & KONTROL --- */}
        <div className="pt-4 md:pt-6 flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col items-start border-b border-gray/10">
            <div className="w-full flex justify-between gap-2 md:gap-4">
              <h2 className="text-md md:text-2xl lg:text-xl font-bold">{item.name}</h2>
              <span className="text-primary font-bold text-md md:text-xl lg:text-lg whitespace-nowrap">
                {rupiahFormatter.format(item.price)}
              </span>
            </div>
            <p className="text-[12.5px] md:text-sm lg:text-[13.5px] pr-4 md:pr-0 text-gray mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-sm md:text-lg lg:text-base self-start">Jumlah</span>
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={handleDec}
                disabled={qty <= 0}
                className="w-6 h-6 md:w-8 md:h-8 lg:w-7 lg:h-7 rounded-sm border-2 border-primary flex items-center justify-center text-primary disabled:opacity-40 disabled:border-gray-400 disabled:text-gray-400 transition-colors"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="font-bold text-md md:text-xl lg:text-lg w-6 text-center">{qty}</span>
              <button
                onClick={handleInc}
                disabled={qty >= stock}
                className="w-6 h-6 md:w-8 md:h-8 lg:w-7 lg:h-7 rounded-sm border-2 border-primary flex items-center justify-center text-primary disabled:opacity-40 disabled:border-gray-400 disabled:text-gray-400 transition-colors"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-sm md:text-lg lg:text-base">Stok</span>
            <span className="font-bold text-sm md:text-lg lg:text-base">{stock}</span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AddNotesIcon className="text-gray/50" />
            </div>
            <Input
              type="text"
              placeholder="Catatan (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-10 pr-4 py-2.75 md:py-3 lg:py-2.5 bg-gray/15 border-transparent focus:bg-white focus:border-primary text-xs md:text-sm rounded-md"
            />
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={qty === 0}
            className={cn(
              "w-full mt-2 py-1.5 md:py-3.5 lg:py-2.25 rounded-xl flex items-center justify-center gap-2 font-bold text-xs md:text-base lg:text-sm",
              qty === 0 && "opacity-50 cursor-not-allowed",
            )}
          >
            <AddToCartIcon /> + Tambah ke Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
