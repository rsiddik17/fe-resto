import { useState } from "react";
import { cn } from "../../utils/utils";
import UserIcon from "../Icon/UserIcon";
import { MoreVertical } from "lucide-react";
import EditIcon from "../Icon/EditIcon";
import DeleteIcon from "../Icon/DeleteIcon";

export interface TableItem {
  id: string;
  status: "tersedia" | "terisi" | "kotor";
  capacity: number;
}

interface TableCardProps {
  table: TableItem;
  onClick: (table: TableItem) => void;
  showOptions?: boolean; // Prop penentu apakah kasir/waiter
  onEdit?: (table: TableItem) => void;
  onDelete?: (table: TableItem) => void;
}

const TableCard = ({
  table,
  onClick,
  showOptions,
  onEdit,
  onDelete,
}: TableCardProps) => {
  const isTersedia = table.status === "tersedia";
  const isTerisi = table.status === "terisi";
  const isKotor = table.status === "kotor";

  // State lokal untuk Dropdown Titik Tiga
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      onClick={() => onClick(table)}
      className={cn(
        "relative rounded-sm pl-3.25 pr-2 pt-3 pb-5 flex flex-col justify-between h-35 border-[1.5px] transition-all shadow-sm cursor-pointer",
        isTersedia && "bg-white border-lime hover:shadow-md",
        isTerisi && "bg-primary border-primary opacity-95",
        isKotor && "bg-[#DEDED9] border-transparent opacity-80",
      )}
    >
      <div className="flex justify-between items-start">
        <span
          className={cn(
            "font-bold text-base",
            isTersedia
              ? "text-lime"
              : isTerisi
                ? "text-white"
                : "text-gray-600",
          )}
        >
          Meja <br /> {table.id}
        </span>

        <div className="flex items-center">
          {/* Badge Status */}
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[7.5px] mt-2 font-bold uppercase",
              showOptions && "-mt-px ml-2 mr-0.5",
              isTersedia
                ? "bg-lime text-white"
                : isTerisi
                  ? "bg-white px-3 text-primary"
                  : "bg-[#73736C] px-3 text-white",
            )}
          >
            {table.status}
          </span>

          {showOptions && (
            <div className="relative flex items-center -translate-y-px">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className={cn(
                  "p-0 rounded-full transition-colors",
                  isTerisi
                    ? "text-white/80 hover:text-white"
                    : "text-black/50 hover:text-black",
                )}
              >
                <MoreVertical size={16} strokeWidth={2.5} />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                    }}
                  />

                  <div className="absolute -right-2 top-full mt-1 w-25 bg-[#DEDED9] rounded-xs shadow-sm overflow-hidden text-left flex flex-col z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                        if (onEdit) onEdit(table);
                      }}
                      className="px-3 py-2.5 flex gap-2 items-center text-xs font-medium transition-colors text-left relative z-10 border border-b-gray-300 cursor-pointer"
                    >
                      <EditIcon className="w-4 h-4"/>
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                        if (onDelete) onDelete(table);
                      }}
                      className="px-3 py-2.5 flex gap-2 items-center text-xs font-medium text-red-500 transition-colors text-left relative z-10 cursor-pointer"
                    >
                      <DeleteIcon className="w-4 h-4"/>
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        {isKotor ? (
          <span className="text-[10px] italic font-medium text-gray-500">
            Sedang dibersihkan
          </span>
        ) : (
          <div
            className={cn(
              "flex items-center gap-1.5",
              isTerisi ? "text-white" : "text-gray/70",
            )}
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-[10.5px] font-medium">
              {isTerisi
                ? `${table.capacity} Orang`
                : `Kapasitas : ${table.capacity}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;
