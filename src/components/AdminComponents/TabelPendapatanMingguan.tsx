import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import SortIcon from "../Icon/SortIcon";
import {
  eksporKePDFPendapatanMingguan,
  eksporKeExcelPendapatanMingguan,
} from "../../components/AdminComponents/ExportUtilsMingguan";
import ExportPdfIcon from "../Icon/ExportPdfIcon";

interface PendapatanMingguan {
  id: number;
  minggu: string;
  totalPesanan: number;
  pendapatan: number;
}

interface TabelPendapatanMingguanProps {
  data: PendapatanMingguan[];
  periode: string;
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export default function TabelPendapatanMingguan({
  data,
  periode,
  enablePagination = true,
  itemsPerPage = 10,
}: TabelPendapatanMingguanProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState<
    "minggu" | "totalPesanan" | "pendapatan" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field: "minggu" | "totalPesanan" | "pendapatan") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
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

  const renderSortIcon = (field: "minggu" | "totalPesanan" | "pendapatan") => (
    <SortIcon
      isActiveAsc={sortField === field && sortOrder === "asc"}
      isActiveDesc={sortField === field && sortOrder === "desc"}
    />
  );

  const totalPesanan = sortedData.reduce(
    (sum, item) => sum + item.totalPesanan,
    0,
  );
  const totalPendapatan = sortedData.reduce(
    (sum, item) => sum + item.pendapatan,
    0,
  );

  const totalPages = enablePagination
    ? Math.ceil(sortedData.length / itemsPerPageState)
    : 1;
  const indexOfLastItem = enablePagination
    ? currentPage * itemsPerPageState
    : sortedData.length;
  const indexOfFirstItem = enablePagination
    ? indexOfLastItem - itemsPerPageState
    : 0;
  const currentItems = enablePagination
    ? sortedData.slice(indexOfFirstItem, indexOfLastItem)
    : sortedData;
  const startCount = indexOfFirstItem + 1;
  const endCount = Math.min(indexOfLastItem, sortedData.length);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-[17px] font-extrabold text-black">
            Laporan Total Pendapatan
          </h4>
          <p className="text-[12px] text-gray-400 font-medium">
            Periode: {periode}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => eksporKePDFPendapatanMingguan(sortedData, periode)}
            className="bg-primary text-white font-bold text-[11px] sm:text-[12.5px] px-3 py-1.5 sm:px-5 sm:py-2 rounded-xs flex items-center gap-1 shadow-md hover:bg-primary/90"
          >
            <ExportPdfIcon className="w-4 h-4" /> Ekspor PDF
          </button>
          <button
            onClick={() => eksporKeExcelPendapatanMingguan(sortedData, periode)}
            className="bg-primary text-white font-bold text-[11px] sm:text-[12.5px] px-3 py-1.5 sm:px-5 sm:py-2 rounded-xs flex items-center gap-1 shadow-md hover:bg-primary/90"
          >
            <ExportPdfIcon className="w-4 h-4" /> Ekspor Excel
          </button>
        </div>
      </div>

      {/* SORTING MOBILE */}
      <div className="md:hidden">
        <div className="bg-white p-3 rounded-xs shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-black-500 block mb-2">
            Urutkan berdasarkan:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "minggu", label: "Minggu" },
              { key: "totalPesanan", label: "Total Pesanan" },
              { key: "pendapatan", label: "Pendapatan" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleSort(option.key as any)}
                className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-all ${
                  sortField === option.key
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white-100 border text-gray-800 hover:bg-gray-200"
                }`}
              >
                {option.label}
                {sortField === option.key && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block border border-gray-150 rounded-xs overflow-hidden bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-125 text-left text-[12.5px]">
            <thead className="bg-gray-200 text-gray-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 text-center w-14">NO</th>
                <th
                  className="py-3 px-4 cursor-pointer "
                  onClick={() => handleSort("minggu")}
                >
                  <div className="flex items-center gap-1">
                    MINGGU {renderSortIcon("minggu")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer "
                  onClick={() => handleSort("totalPesanan")}
                >
                  <div className="flex items-center gap-1">
                    TOTAL PESANAN {renderSortIcon("totalPesanan")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer "
                  onClick={() => handleSort("pendapatan")}
                >
                  <div className="flex items-center gap-1">
                    TOTAL PENDAPATAN {renderSortIcon("pendapatan")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-medium text-gray-800">
              {currentItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 text-center text-gray-400 font-bold">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-3 px-4">{item.minggu}</td>
                  <td className="py-3 px-4">
                    {item.totalPesanan.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 ">
                    Rp {item.pendapatan.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold text-black border-t border-gray-200">
                <td className="py-3 text-center rounded-bl-xs"></td>
                <td className="py-3 px-4">Total </td>
                <td className="py-3 px-4">
                  {totalPesanan.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4 rounded-br-xs">
                  Rp {totalPendapatan.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAGINATION DESKTOP */}
        {enablePagination && totalPages > 1 && (
          <div className="flex items-center justify-between py-3 px-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                <span>Tampilkan</span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-2 bg-white text-gray-700"
                  >
                    {itemsPerPageState} Data{" "}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      {[10, 20].map((n) => (
                        <button
                          key={n}
                          onClick={() => {
                            setItemsPerPageState(n);
                            setCurrentPage(1);
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-[12px]"
                        >
                          {n} Data
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[12px] text-gray-500">
                Menampilkan {startCount}-{endCount} dari {sortedData.length}{" "}
                data
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="w-7 h-7 border rounded-md disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-md border ${currentPage === p ? "bg-primary text-white border-primary" : "border-gray-200"}`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-7 h-7 border rounded-md disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-3">
        <div className="bg-white rounded-xs border border-gray-100 overflow-x-auto">
          <div className="min-w-125">
            <table className="w-full">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="py-2 px-2 text-center text-[10px] rounded-tl-xs">
                    NO
                  </th>
                  <th className="py-2 px-2 text-left text-[10px]">Minggu</th>
                  <th className="py-2 px-2 text-right text-[10px]">
                    Total Pesanan
                  </th>
                  <th className="py-2 px-2 text-right text-[10px] rounded-tr-xs">
                    Total Pendapatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 px-2 text-center text-gray-400 text-[10px]">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-2 px-2 text-gray-800 text-[10px] whitespace-nowrap">
                      {item.minggu}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-800 text-[10px]">
                      {item.totalPesanan.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-800  text-[10px]">
                      Rp {item.pendapatan.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-2 text-center"></td>
                  <td className="py-2 px-2 text-gray-800 text-[10px]">Total</td>
                  <td className="py-2 px-2 text-right text-gray-800 text-[10px]">
                    {totalPesanan.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-800 text-[10px]">
                    Rp {totalPendapatan.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {enablePagination && totalPages > 1 && (
          <div className="md:hidden flex flex-col gap-2 py-4">
            <div className="text-center text-[10px] text-gray-500">
              Menampilkan {startCount}-{endCount} dari {sortedData.length} data
            </div>
            <div className="flex items-center justify-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30 text-xs"
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded border text-xs ${currentPage === pageNum ? "bg-primary text-white border-primary" : "border-gray-200"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30 text-xs"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
