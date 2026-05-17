import { cn } from "../../utils/utils";

type TableType = "semua" | "tersedia" | "terisi" | "kotor";

interface TableFilterTabsProps {
  filter: TableType;
  setFilter: (val: TableType) => void;
}

const TableFilterTabs = ({ filter, setFilter }: TableFilterTabsProps) => {
  return (
    <div className="flex items-center gap-3 mb-4 shrink-0 overflow-x-auto scrollbar-hide pb-1">
      {/* Tab Semua */}
      <button
        onClick={() => setFilter("semua")}
        className={cn(
          "w-28 px-4 py-2 rounded-sm font-bold text-[13px] border-[1.5px] transition-all cursor-pointer",
          filter === "semua"
            ? "bg-primary text-white border-primary"
            : "bg-white text-primary border-primary",
        )}
      >
        Semua
      </button>

      {/* Tab Tersedia */}
      <button
        onClick={() => setFilter("tersedia")}
        className={cn(
          "flex items-center gap-1.5 w-28 px-4 py-2 rounded-sm font-bold text-[13px] border-[1.5px] transition-all cursor-pointer",
          filter === "tersedia"
            ? "bg-[#8AC926] text-white border-[#8AC926]"
            : "bg-white text-[#8AC926] border-[#8AC926]",
        )}
      >
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            filter === "tersedia" ? "bg-white" : "bg-lime",
          )}
        ></div>{" "}
        Tersedia
      </button>

      {/* Tab Terisi */}
      <button
        onClick={() => setFilter("terisi")}
        className={cn(
          "flex justify-center items-center gap-1.5 w-28 px-4 py-2 rounded-sm font-bold text-[13px] border-[1.5px] transition-all cursor-pointer",
          filter === "terisi"
            ? "bg-primary text-white border-primary"
            : "bg-white text-primary border-primary",
        )}
      >
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            filter === "terisi" ? "bg-white" : "bg-primary",
          )}
        ></div>{" "}
        Terisi
      </button>

      {/* Tab Kotor */}
      <button
        onClick={() => setFilter("kotor")}
        className={cn(
          "flex justify-center items-center gap-1.5 w-28 px-4 py-2 rounded-sm font-bold text-[13px] border-[1.5px] transition-all cursor-pointer",
          filter === "kotor"
            ? "bg-[#D9D9D9] text-gray-700 border-[#D9D9D9]"
            : "bg-white text-gray-400 border-gray-200",
        )}
      >
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            filter === "kotor" ? "bg-gray-400" : "bg-[#D9D9D9]",
          )}
        ></div>{" "}
        Kotor
      </button>
    </div>
  );
};

export default TableFilterTabs;
