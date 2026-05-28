import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import SortIcon from "../Icon/SortIcon";
import {
  eksporKePDFPesanan,
  eksporKeExcelPesanan,
} from "../AdminComponents/ExportUtils";
import ExportIcon from "../Icon/ExportIcon";

interface Pesanan {
  id: number;
  tanggal: string;
  total: number;
  selesai: number;
  cancel: number;
}

interface TablePesananProps {
  data: Pesanan[];
  periode: string;
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export default function TabelPesanan({
  data,
  periode,
  enablePagination = true,
  itemsPerPage = 10,
}: TablePesananProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState<"tanggal" | "total" | "selesai" | "cancel" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field: "tanggal" | "total" | "selesai" | "cancel") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
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

  const renderSortIcon = (field: "tanggal" | "total" | "selesai" | "cancel") => (
    <SortIcon
      isActiveAsc={sortField === field && sortOrder === "asc"}
      isActiveDesc={sortField === field && sortOrder === "desc"}
    />
  );

  const totalPesanan = sortedData.reduce((sum, item) => sum + item.total, 0);
  const totalSelesai = sortedData.reduce((sum, item) => sum + item.selesai, 0);
  const totalCancel = sortedData.reduce((sum, item) => sum + item.cancel, 0);

  const totalPages = enablePagination ? Math.ceil(sortedData.length / itemsPerPageState) : 1;
  const indexOfLastItem = enablePagination ? currentPage * itemsPerPageState : sortedData.length;
  const indexOfFirstItem = enablePagination ? indexOfLastItem - itemsPerPageState : 0;
  const currentItems = enablePagination ? sortedData.slice(indexOfFirstItem, indexOfLastItem) : sortedData;
  const startCount = indexOfFirstItem + 1;
  const endCount = Math.min(indexOfLastItem, sortedData.length);

  return (
    <div className="space-y-4">
      {/* HEADER - Responsif (SAMA SEPERTI MENU & PENDAPATAN) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-[17px] font-extrabold text-black">Laporan Total Pesanan</h4>
          <p className="text-[12px] text-gray-400 font-medium">Periode: {periode}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => eksporKePDFPesanan(sortedData, periode)} className="bg-primary text-white font-bold text-[11px] sm:text-[12.5px] px-3 py-1.5 sm:px-5 sm:py-2 rounded-xs flex items-center gap-1 shadow-md hover:bg-primary/90">
            <ExportIcon size={10} /> Ekspor PDF
          </button>
          <button onClick={() => eksporKeExcelPesanan(sortedData, periode)} className="bg-primary text-white font-bold text-[11px] sm:text-[12.5px] px-3 py-1.5 sm:px-5 sm:py-2 rounded-xs flex items-center gap-1 shadow-md hover:bg-primary/90">
            <ExportIcon size={10} /> Ekspor Excel
          </button>
        </div>
      </div>

      {/* ========== SORTING MOBILE (Tombol Chip) ========== */}
      <div className="md:hidden">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs text-black-500 font-bold block mb-2">
            Urutkan berdasarkan:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "tanggal", label: "Tanggal" },
              { key: "total", label: "Total Pesanan" },
              { key: "selesai", label: "Pesanan Selesai" },
              { key: "cancel", label: "Pesanan Cancel" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleSort(option.key as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  sortField === option.key
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
                {sortField === option.key && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========== DESKTOP TABLE ========== */}
      <div className="hidden md:block border border-gray-150 rounded-xs overflow-hidden bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-150 text-left text-[12.5px]">
            <thead className="bg-gray-200 text-gray-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 text-center w-14">NO</th>
                <th className="py-3 px-4 cursor-pointer select-none " onClick={() => handleSort("tanggal")}>
                  <div className="flex items-center gap-1">TANGGAL {renderSortIcon("tanggal")}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort("total")}>
                  <div className="flex items-center gap-1">TOTAL PESANAN {renderSortIcon("total")}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort("selesai")}>
                  <div className="flex items-center gap-1">PESANAN SELESAI {renderSortIcon("selesai")}</div>
                </th>
                <th className="py-3 px-4 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort("cancel")}>
                  <div className="flex items-center gap-1">PESANAN CANCEL {renderSortIcon("cancel")}</div>
                </th>
              </tr>
            </thead>
            <tbody className="font-medium text-gray-800">
              {currentItems.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-center text-gray-400 font-bold">{indexOfFirstItem + index + 1}</td>
                  <td className="py-3 px-4">{item.tanggal}</td>
                  <td className="py-3 px-4">{item.total.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4">{item.selesai.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4">{item.cancel}</td>
                </tr>
              ))}
              {/* BARIS TOTAL - SELALU TAMPIL */}
              <tr className="bg-gray-100 font-bold text-black border-t border-gray-200">
                <td className="py-3 text-center"></td>
                <td className="py-3 px-4">Total </td>
                <td className="py-3 px-4">{totalPesanan.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4">{totalSelesai.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4">{totalCancel}</td>
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
                <div className="relative z-50" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="border border-gray-300 rounded px-2 py-1 flex items-center gap-2 hover:bg-gray-50">
                    {itemsPerPageState} Data <ChevronDown size={12} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-50">
                      {[5, 10, 15, 20].map(n => (
                        <button key={n} onClick={() => { setItemsPerPageState(n); setCurrentPage(1); setIsDropdownOpen(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-[12px] font-bold">
                          {n} Data
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[12px] font-bold text-gray-400">
                Menampilkan {startCount}-{endCount} dari {sortedData.length} data
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)} className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30"><ChevronLeft size={14}/></button>
              {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 rounded border ${currentPage === p ? "bg-white text-primary border-primary" : "border-gray-200"}`}>{p}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p+1)} className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30"><ChevronRight size={14}/></button>
            </div>
          </div>
        )}
      </div>

      {/* ========== MOBILE CARD VIEW ========== */}
      <div className="md:hidden space-y-3">
        {currentItems.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-black-400 font-medium">#{indexOfFirstItem + index + 1}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-black-400 font-bold">Tanggal</span>
                <span className="font-medium text-black-800">{item.tanggal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400 font-bold">Total Pesanan</span>
                <span className="font-medium text-black-800">{item.total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400 font-bold">Pesanan Selesai</span>
                <span className="font-medium text-black-600">{item.selesai.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400 font-bold">Pesanan Cancel</span>
                <span className="font-medium text-red-500">{item.cancel}</span>
              </div>
            </div>
          </div>
        ))}

        {/* TOTAL RINGKASAN MOBILE */}
        <div className="bg-gray-100 rounded-lg border border-gray-200 p-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-black-600">Total</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-black-500">Total Pesanan:</span>
            <span className="font-medium">{totalPesanan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-black-500">Pesanan Selesai:</span>
            <span className="font-medium text-green-600">{totalSelesai.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-black-500">Pesanan Cancel:</span>
            <span className="font-medium text-red-500">{totalCancel}</span>
          </div>
        </div>

        {/* PAGINATION MOBILE */}
        {enablePagination && totalPages > 1 && (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                <span>Tampilkan</span>
                <div className="relative z-50" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="border border-gray-300 rounded px-2 py-0.5 flex items-center gap-1 hover:bg-gray-50 text-[11px]">
                    {itemsPerPageState} Data <ChevronDown size={10} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 bottom-full mb-1 w-20 bg-white border border-gray-200 rounded shadow-lg">
                      {[5, 10, 15, 20].map(n => (
                        <button key={n} onClick={() => { setItemsPerPageState(n); setCurrentPage(1); setIsDropdownOpen(false); }} className="block w-full px-2 py-1.5 text-left hover:bg-gray-100 text-[11px] font-bold">
                          {n} Data
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400">
                {startCount}-{endCount} dari {sortedData.length}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)} className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30">
                <ChevronLeft size={14}/>
              </button>
              <span className="text-[11px] font-bold text-gray-600 px-2">
                {currentPage} / {totalPages}
              </span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p+1)} className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30">
                <ChevronRight size={14}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}