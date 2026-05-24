import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface PesananMingguan {
  id: number;
  minggu: string;
  totalPesanan: number;
  selesai: number;
  cancel: number;
}

interface TabelPesananMingguanProps {
  data: PesananMingguan[];
  onSortChange?: (sortedData: PesananMingguan[]) => void;
}

export default function TabelPesananMingguan({ data, onSortChange }: TabelPesananMingguanProps) {
  const [sortField, setSortField] = useState<"minggu" | "totalPesanan" | "selesai" | "cancel" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: "minggu" | "totalPesanan" | "selesai" | "cancel") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "minggu") {
      return sortOrder === "asc"
        ? a.minggu.localeCompare(b.minggu)
        : b.minggu.localeCompare(a.minggu);
    }
    return sortOrder === "asc"
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });

  // Kirim data yang sudah di-sort ke parent
  useEffect(() => {
    if (onSortChange) {
      onSortChange(sortedData);
    }
  }, [sortedData, onSortChange]);

  const totalPesanan = sortedData.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalSelesai = sortedData.reduce((sum, item) => sum + item.selesai, 0);
  const totalCancel = sortedData.reduce((sum, item) => sum + item.cancel, 0);

  const renderSortIcon = (field: "minggu" | "totalPesanan" | "selesai" | "cancel") => (
    <div className="flex flex-col text-gray-400">
      <ChevronUp size={11} className={sortField === field && sortOrder === "asc" ? "text-primary" : ""} />
      <ChevronDown size={11} className={sortField === field && sortOrder === "desc" ? "text-primary" : ""} />
    </div>
  );

  return (
    <div className="border border-gray-150 rounded-xs  overflow-hidden bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-175 text-left text-[12.5px]">
          <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-3 text-center w-14">NO</th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("minggu")}>
                <div className="flex items-center gap-1">MINGGU {renderSortIcon("minggu")}</div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("totalPesanan")}>
                <div className="flex items-center gap-1">TOTAL PESANAN {renderSortIcon("totalPesanan")}</div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("selesai")}>
                <div className="flex items-center gap-1">PESANAN SELESAI {renderSortIcon("selesai")}</div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("cancel")}>
                <div className="flex items-center gap-1">PESANAN CANCEL {renderSortIcon("cancel")}</div>
              </th>
            </tr>
          </thead>
          <tbody className="font-medium text-gray-800">
            {sortedData.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-150 last:border-b-0 hover:bg-gray-50/30">
                <td className="py-3 text-center text-gray-400 font-bold">{index + 1}</td>
                <td className="py-3 px-4">{item.minggu}</td>
                <td className="py-3 px-4 font-semibold text-black">{item.totalPesanan.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4">{item.selesai.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4 ">{item.cancel}</td>
              </tr>
            ))}
            <tr className="bg-gray-50/60 font-bold text-black border-t border-gray-200">
              <td className="py-3 text-center"></td>
              <td className="py-3 px-4">Total</td>
              <td className="py-3 px-4">{totalPesanan.toLocaleString("id-ID")}</td>
              <td className="py-3 px-4">{totalSelesai.toLocaleString("id-ID")}</td>
              <td className="py-3 px-4 ">{totalCancel}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}