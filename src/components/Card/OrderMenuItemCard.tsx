import { Edit2, Trash2, Check } from "lucide-react";
import { cn } from "../../utils/utils";

interface SubstituteItem {
  id: string;
  name: string;
  price: number;
}

interface OrderMenuItemProps {
  item: any;
  uniqueKey: string;
  isDropdownActive: boolean;
  isLoadingSubs: boolean;
  substitutes: SubstituteItem[];
  rupiahFormatter: (val: number) => string;
  onOpenNotes: (e: React.MouseEvent) => void;
  onToggleDropdown: (e: React.MouseEvent) => void;
  onSelectSubstitute: (subMenu: SubstituteItem) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

const OrderMenuItemCard = ({
  item,
  uniqueKey,
  isDropdownActive,
  isLoadingSubs,
  substitutes,
  rupiahFormatter,
  onOpenNotes,
  onToggleDropdown,
  onSelectSubstitute,
  onDeleteClick,
}: OrderMenuItemProps) => {
  return (
    <div
      key={uniqueKey}
      className="relative border-2 border-primary/50 rounded-sm p-2.5 flex justify-between items-center bg-white shadow-sm transition-colors"
    >
      <div className="flex flex-col gap-1 w-full">
        <span className="font-medium text-[14px] md:text-[15px] text-black">
          {item.menu_name} x{item.quantity}
        </span>
        <div className="flex justify-between items-center w-full">
          {/* Klik catatan */}
          <div
            className="border-l-2 border-primary pl-2 cursor-pointer px-1 transition-colors"
            onClick={onOpenNotes}
          >
            <span className="text-black/50 text-[13px] md:text-[13.5px] hover:bg-primary/5 block w-70 bg-white border-[1.5px] py-1 px-2 border-primary rounded-[6px]">
              Catatan: {item.notes || "Tidak ada"}
            </span>
          </div>
          <span className="text-[14px] md:text-[15px] pr-4 text-black">
            {rupiahFormatter(Number(item.sub_total))}
          </span>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex items-center gap-2 shrink-0 border-l-2 border-primary pl-3 md:pl-4 py-1 relative">
        <button
          onClick={onToggleDropdown}
          className={cn(
            "w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md transition-colors cursor-pointer",
            isDropdownActive
              ? "bg-primary text-white"
              : "bg-primary/25 hover:bg-primary text-primary hover:text-white",
          )}
        >
          <Edit2 size={16} strokeWidth={2.5} className="md:w-5 md:h-5" />
        </button>
        <button
          onClick={onDeleteClick}
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition-colors cursor-pointer"
        >
          <Trash2 size={18} strokeWidth={2.5} className="md:w-5.5 md:h-5.5" />
        </button>

        {/* DROPDOWN MENU PENGGANTI */}
        {isDropdownActive && (
          <div
            className="absolute top-full right-0 md:right-11.5 mt-2 w-64 md:w-66 bg-white border border-primary/20 rounded-md shadow-sm z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-primary/20 bg-primary/20">
              <h4 className="text-primary text-[15px]">Pilih Menu Pengganti</h4>
            </div>
            <div className="flex flex-col max-h-48 overflow-y-auto custom-scrollbar">
              {isLoadingSubs ? (
                <div className="p-4 text-center text-sm text-primary font-medium">
                  Mencari menu...
                </div>
              ) : substitutes.length > 0 ? (
                substitutes.map((subMenu) => (
                  <button
                    key={subMenu.id}
                    onClick={() => onSelectSubstitute(subMenu)}
                    className="group flex justify-between items-center px-4 py-2 hover:bg-primary/10 transition-colors text-left border-b border-primary/10 last:border-b-0 cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-primary font-bold text-[14px]">
                        {subMenu.name}
                      </span>
                      <span className="text-black/60 text-[12.5px]">
                        {rupiahFormatter(subMenu.price)}
                      </span>
                    </div>
                    <div
                      className="
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-200
                      w-7 h-7 rounded-full bg-primary
                      flex items-center justify-center
                      "
                    >
                      <Check size={14} className="text-white stroke-5" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center flex flex-col items-center">
                  <p className="text-primary text-[13px] font-medium leading-relaxed">
                    Menu tidak tersedia, Tidak ada menu pengganti yang sesuai
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderMenuItemCard;
