import { cn } from "../../utils/utils";
import UserIcon from "../Icon/UserIcon";

export interface TableItem {
  id: string;
  status: "tersedia" | "terisi" | "kotor";
  capacity: number;
}

interface TableCardProps {
  table: TableItem;
  onClick: (table: TableItem) => void;
}

const TableCard = ({ table, onClick }: TableCardProps) => {
  const isTersedia = table.status === "tersedia";
  const isTerisi = table.status === "terisi";
  const isKotor = table.status === "kotor";

  return (
    <div
      onClick={() => onClick(table)}
      className={cn(
        "rounded-sm pl-3.25 pr-2 pt-3 pb-5 flex flex-col justify-between h-35 border-[1.5px] transition-all shadow-sm cursor-pointer",
        isTersedia && "bg-white border-lime hover:shadow-md",
        isTerisi && "bg-primary border-primary opacity-95",
        isKotor &&
          "bg-[#DEDED9] border-transparent opacity-80",
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
        {/* Badge Status */}
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[7.5px] mt-2 font-bold uppercase",
            isTersedia
              ? "bg-lime text-white"
              : isTerisi
                ? "bg-white px-3 text-primary"
                : "bg-[#73736C] px-3 text-white",
          )}
        >
          {table.status}
        </span>
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
              {isTerisi ? `${table.capacity} Orang` : `Kapasitas : ${table.capacity}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;
