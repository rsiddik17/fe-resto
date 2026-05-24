import { useState, useEffect,  useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface PendapatanBulanan {
  id: number;
  bulan: string;
  totalPesanan: number;
  pendapatan: number;
}

interface TabelPendapatanBulananProps {
  data: PendapatanBulanan[];
  onSortChange?: (sortedData: PendapatanBulanan[]) => void;
}

export default function TabelPendapatanBulanan({ data, onSortChange }: TabelPendapatanBulananProps) { // ← tambah onSortChange
  const [sortField, setSortField] = useState<"bulan" | "totalPesanan" | "pendapatan" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

   const prevSortedDataRef = useRef<string>("");

  const handleSort = (field: "bulan" | "totalPesanan" | "pendapatan") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "bulan") {
      const bulanOrder = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const aIndex = bulanOrder.indexOf(a.bulan);
      const bIndex = bulanOrder.indexOf(b.bulan);
      return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex;
    }
    return sortOrder === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
  });

  useEffect(() => {
    if (onSortChange) {
      const sortedDataKey = JSON.stringify(sortedData);
      if (prevSortedDataRef.current !== sortedDataKey) {
        prevSortedDataRef.current = sortedDataKey;
        onSortChange(sortedData);
      }
    }
  }, [sortedData, onSortChange]);

  const totalPesanan = sortedData.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalPendapatan = sortedData.reduce((sum, item) => sum + item.pendapatan, 0);

  const renderSortIcon = (field: "bulan" | "totalPesanan" | "pendapatan") => (
    <div className="flex flex-col text-gray-400">
      <ChevronUp size={11} className={sortField === field && sortOrder === "asc" ? "text-primary" : ""} />
      <ChevronDown size={11} className={sortField === field && sortOrder === "desc" ? "text-primary" : ""} />
    </div>
  );

  return (
    <div className="border border-gray-150 rounded-xs overflow-hidden bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-175 text-left text-[12.5px]">
          <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-3 text-center w-14">NO</th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("bulan")}>
                <div className="flex items-center gap-1">BULAN {renderSortIcon("bulan")}</div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("totalPesanan")}>
                <div className="flex items-center gap-1">TOTAL PESANAN {renderSortIcon("totalPesanan")}</div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("pendapatan")}>
                <div className="flex items-center gap-1">TOTAL PENDAPATAN {renderSortIcon("pendapatan")}</div>
              </th>
            </tr>
          </thead>
          <tbody className="font-medium text-gray-800">
            {sortedData.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-150 last:border-b-0 hover:bg-gray-50/30">
                <td className="py-3 text-center text-gray-400 font-bold">{index + 1}</td>
                <td className="py-3 px-4">{item.bulan}</td>
                <td className="py-3 px-4">{item.totalPesanan.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4  text-black">Rp {item.pendapatan.toLocaleString("id-ID")}</td>
              </tr>
            ))}
            <tr className="bg-gray-50/60 font-bold text-black border-t border-gray-200">
              <td className="py-3 text-center"></td>
              <td className="py-3 px-4">Total</td>
              <td className="py-3 px-4">{totalPesanan.toLocaleString("id-ID")}</td>
              <td className="py-3 px-4">Rp {totalPendapatan.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}