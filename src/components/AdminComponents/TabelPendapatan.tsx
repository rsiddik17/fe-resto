import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

interface Pendapatan {
  id: number;
  tanggal: string;
  totalPesanan: number;
  pendapatan: number;
}

interface TablePendapatanProps {
  data: Pendapatan[];
  enablePagination?: boolean;
  itemsPerPage?: number;
  onSortChange?: (sortedData: Pendapatan[]) => void;
}

export default function TabelPendapatan({ 
  data, 
  enablePagination = false, 
  itemsPerPage = 10 ,
   onSortChange 
}: TablePendapatanProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"tanggal" | "totalPesanan" | "pendapatan" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: "tanggal" | "totalPesanan" | "pendapatan") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "tanggal") {
      return sortOrder === "asc"
        ? new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
        : new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
    }
    return sortOrder === "asc"
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });

  useEffect(() => {
    if (onSortChange) {
      onSortChange(sortedData);
    }
  }, [sortedData, onSortChange]);

  const totalPesanan = sortedData.reduce((sum, item) => sum + item.totalPesanan, 0);
  const totalPendapatan = sortedData.reduce((sum, item) => sum + item.pendapatan, 0);

  const totalPages = enablePagination ? Math.ceil(sortedData.length / itemsPerPage) : 1;
  const indexOfLastItem = enablePagination ? currentPage * itemsPerPage : sortedData.length;
  const indexOfFirstItem = enablePagination ? indexOfLastItem - itemsPerPage : 0;
  const currentItems = enablePagination 
    ? sortedData.slice(indexOfFirstItem, indexOfLastItem)
    : sortedData;

  return (
    <div className="border border-gray-150 rounded-xs overflow-hidden bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-175 text-left text-[12.5px]">
          <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-3 text-center w-14">NO</th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("tanggal")}>
                <div className="flex items-center gap-1">
                  TANGGAL
                  <div className="flex flex-col text-gray-400">
                    <ChevronUp size={11} className={sortField === "tanggal" && sortOrder === "asc" ? "text-primary" : ""} />
                    <ChevronDown size={11} className={sortField === "tanggal" && sortOrder === "desc" ? "text-primary" : ""} />
                  </div>
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("totalPesanan")}>
                <div className="flex items-center gap-1">
                  TOTAL PESANAN
                  <div className="flex flex-col text-gray-400">
                    <ChevronUp size={11} className={sortField === "totalPesanan" && sortOrder === "asc" ? "text-primary" : ""} />
                    <ChevronDown size={11} className={sortField === "totalPesanan" && sortOrder === "desc" ? "text-primary" : ""} />
                  </div>
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("pendapatan")}>
                <div className="flex items-center gap-1">
                  TOTAL PENDAPATAN
                  <div className="flex flex-col text-gray-400">
                    <ChevronUp size={11} className={sortField === "pendapatan" && sortOrder === "asc" ? "text-primary" : ""} />
                    <ChevronDown size={11} className={sortField === "pendapatan" && sortOrder === "desc" ? "text-primary" : ""} />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="font-medium text-gray-800">
            {currentItems.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-150 last:border-b-0 hover:bg-gray-50/30">
                <td className="py-3 text-center text-gray-400 font-bold">
                  {enablePagination ? indexOfFirstItem + index + 1 : index + 1}
                </td>
                <td className="py-3 px-4">{item.tanggal}</td>
                <td className="py-3 px-4">{item.totalPesanan.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4 font-bold text-black">Rp {item.pendapatan.toLocaleString("id-ID")}</td>
              </tr>
            ))}
            {!enablePagination && (
              <tr className="bg-gray-50/60 font-bold text-black border-t border-gray-200">
                <td className="py-3 text-center"></td>
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4">{totalPesanan.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4 text-black">Rp {totalPendapatan.toLocaleString("id-ID")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* HANYA tampilkan pagination jika enablePagination=true */}
      {enablePagination && (
        <div className="flex flex-wrap items-center justify-between py-3.5 px-4 gap-4 border-t border-gray-100 bg-white">
          <span className="text-[12.5px] font-bold text-gray-400">
            Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedData.length)} dari {sortedData.length} data
          </span>
          <div className="flex items-center gap-1.5 text-[12px] font-bold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-md text-gray-400 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center border rounded-md font-bold transition-all ${
                  currentPage === page
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-400 hover:text-black bg-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-md text-gray-400 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}