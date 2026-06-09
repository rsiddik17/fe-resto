import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  headers: { label: string; key: string; sortable?: boolean }[];
  data: any[];
  onSort?: (field: string) => void;
  sortState?: { field: string; order: "asc" | "desc" };
}

export const TabelLaporan = ({ headers, data, onSort, sortState }: Props) => {
  return (
    <table className="w-full bg-white border border-gray-150 rounded-xl text-[13px] shadow-2xs">
      <thead className="bg-gray-100 uppercase font-bold text-gray-500 text-[11px]">
        <tr>
          {headers.map((h) => (
            <th key={h.key} className="py-3 px-4 cursor-pointer" onClick={() => h.sortable && onSort?.(h.key)}>
              <div className="flex items-center">
                {h.label}
                {h.sortable && (
                  <div className="flex flex-col ml-1">
                    <ChevronUp size={10} className={sortState?.field === h.key && sortState.order === "asc" ? "text-primary" : "opacity-30"} />
                    <ChevronDown size={10} className={sortState?.field === h.key && sortState.order === "desc" ? "text-primary" : "opacity-30"} />
                  </div>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={item.id} className="border-t hover:bg-gray-50/50">
            <td className="py-3 text-center">{i + 1}</td>
            {headers.slice(1).map((h) => (
              <td key={h.key} className="py-3 px-4">{item[h.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};