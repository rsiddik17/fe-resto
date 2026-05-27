import { useState } from "react";
import { cn } from "../../utils/utils";
import UserIcon from "../Icon/UserIcon";
import { MoreVertical } from "lucide-react";
import EditIcon from "../Icon/EditIcon";
import DeleteIcon from "../Icon/DeleteIcon";
import type { TableData } from "../../api/table.api";

interface TableCardProps {
  table: TableData;
  onClick: (table: TableData) => void;
  showOptions?: boolean; // Prop penentu apakah kasir/waiter
  onEdit?: (table: TableData) => void;
  onDelete?: (table: TableData) => void;
}

const TableCard = ({
  table,
  onClick,
  showOptions,
  onEdit,
  onDelete,
}: TableCardProps) => {
  const isTersedia = table.status === "AVAILABLE";
  const isTerisi = table.status === "OCCUPIED";
  const isKotor = table.status === "DIRTY";

  const getStatusText = () => {
    if (isTersedia) return "tersedia";
    if (isTerisi) return "terisi";
    return "kotor";
  };

  // Helper untuk membersihkan tulisan M01_i jadi M-01 (opsional jika dibutuhkan)
  const formatTableNumber = (raw: string) => {
    // Cari bagian angka dan akhiran (_i atau _o) mengabaikan huruf besar/kecil
    const match = raw.match(/M(\d+)(_i|_o)?/i);
    
    if (match) {
      const num = match[1]; // Tangkap angkanya saja (contoh: "01")
      let suffix = "";
      
      // Ubah akhiran menjadi teks lengkap
      if (match[2]) {
        suffix = match[2].toLowerCase() === "_i" ? "_indoor" : "_outdoor";
      }
      
      return `${num}${suffix}`; 
    }
    
    return raw; // Kembalikan string asli jika formatnya berbeda
  };

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
      <div className="relative flex items-start w-full">
        <span
          className={cn(
            "font-bold text-base leading-tight wrap-break-word w-full",
            isTersedia
              ? "text-lime"
              : isTerisi
                ? "text-white"
                : "text-gray-600",
          )}
        >
          Meja <br /> {formatTableNumber(table.table_number)}
        </span>

        <div className="absolute -top-1.5 right-0 flex items-start">
          {/* Badge Status */}
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[7.5px] mt-2 font-bold uppercase",
              showOptions && "ml-2",
              isTersedia
                ? "bg-lime text-white"
                : isTerisi
                  ? "bg-white px-3 text-primary"
                  : "bg-[#73736C] px-3 text-white",
            )}
          >
            {getStatusText()}
          </span>

          {showOptions && (
            <div className="relative flex items-center translate-x-1 translate-y-2">
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
                      <EditIcon className="w-4 h-4" />
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
                      <DeleteIcon className="w-4 h-4" />
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
