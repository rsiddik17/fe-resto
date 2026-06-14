import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  eksporKePDFMenuMingguan,
  eksporKeExcelMenuMingguan,
} from "../../components/AdminComponents/ExportUtilsMingguan";
import ExportPdfIcon from "../Icon/ExportPdfIcon";
import SortIcon from "../Icon/SortIcon";

interface MenuMingguan {
  id: number;
  nama: string;
  harga: number;
  kategori: string;
  total: number;
}

export default function TabelMenuMingguan({
  data,
  periode,
}: {
  data: MenuMingguan[];
  periode: string;
}) {
  const [menuPerPage, setMenuPerPage] = useState(10);
  const [isDropdownPageOpen, setIsDropdownPageOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<
    "nama" | "harga" | "kategori" | "total" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownPageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (sortField === "nama" || sortField === "kategori") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const handleSort = (field: "nama" | "harga" | "kategori" | "total") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const renderSortIcon = (field: "nama" | "harga" | "kategori" | "total") => (
    <SortIcon
      isActiveAsc={sortField === field && sortOrder === "asc"}
      isActiveDesc={sortField === field && sortOrder === "desc"}
    />
  );

  const totalPages = Math.ceil(sortedData.length / menuPerPage);
  const currentItems = sortedData.slice(
    (currentPage - 1) * menuPerPage,
    currentPage * menuPerPage,
  );
  const startCount = (currentPage - 1) * menuPerPage + 1;
  const endCount = Math.min(currentPage * menuPerPage, sortedData.length);

  return (
    <div className="space-y-4">
      {/* HEADER: Judul & Ekspor - Responsif */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-[17px] font-extrabold text-black">
            Laporan Menu
          </h4>
          <p className="text-[12px] text-gray-400 font-medium">
            Periode: {periode}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => eksporKePDFMenuMingguan(sortedData, periode)}
            className="bg-primary text-white font-bold text-[11px] sm:text-[12.5px] px-3 py-1.5 sm:px-5 sm:py-2 rounded-xs flex items-center gap-1 shadow-md hover:bg-primary/90"
          >
            <ExportPdfIcon className="w-4 h-4" /> Ekspor PDF
          </button>
          <button
            onClick={() => eksporKeExcelMenuMingguan(sortedData, periode)}
            className="bg-primary text-white font-bold text-[11px] sm:text-[12.5px] px-3 py-1.5 sm:px-5 sm:py-2 rounded-xs flex items-center gap-1 shadow-md hover:bg-primary/90"
          >
            <ExportPdfIcon className="w-4 h-4" /> Ekspor Excel
          </button>
        </div>
      </div>

      {/* ========== SORTING MOBILE (Tombol Chip) ========== */}
      <div className="md:hidden">
        <div className="bg-white p-3 rounded-xs shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 block mb-2">
            Urutkan berdasarkan:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "nama", label: "Nama Menu" },
              { key: "harga", label: "Harga" },
              { key: "kategori", label: "Kategori" },
              { key: "total", label: "Total Terjual" },
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

      {/* ========== DESKTOP TABLE ========== */}
      <div className="hidden md:block border border-gray-150 rounded-xs bg-white overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full table-fixed text-left text-[12.5px] border-collapse overflow-visible">
            <thead className="bg-gray-200 text-gray-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-6 w-16 rounded-tl-xs">NO</th>
                {[
                  { l: "NAMA MENU", f: "nama" },
                  { l: "HARGA", f: "harga" },
                  { l: "KATEGORI", f: "kategori" },
                  { l: "TOTAL TERJUAL", f: "total" },
                ].map((c) => (
                  <th
                    key={c.f}
                    className={`py-3 px-4 cursor-pointer hover:bg-gray-200 ${
                      c.f === "total" ? "rounded-tr-xs" : "" // ← PAKAI c.f === "total"
                    }`}
                    onClick={() => handleSort(c.f as any)}
                  >
                    <div className="flex items-center gap-1">
                      {c.l} {renderSortIcon(c.f as any)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-medium text-gray-800">
              {currentItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6 text-gray-400 font-bold">
                    {(currentPage - 1) * menuPerPage + index + 1}
                  </td>
                  <td className="py-4 px-4 text-black truncate">{item.nama}</td>
                  <td className="py-4 px-4">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-4 truncate">{item.kategori}</td>
                  <td className="py-4 px-4  text-black">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION DESKTOP */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between py-3 px-4 border-t border-gray-150 bg-white  rounded-br-xs rounded-bl-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                <span>Tampilkan</span>
                <div className="relative z-50" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownPageOpen(!isDropdownPageOpen)}
                    className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 bg-white text-gray-700"
                  >
                    {menuPerPage} Menu{" "}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isDropdownPageOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isDropdownPageOpen && (
                    <div className="absolute left-0 top-full mt-1 w-24 bg-white text-primary  border-gray-200 rounded shadow-lg z-50">
                      {[10, 15, 20].map((n) => (
                        <button
                          key={n}
                          onClick={() => {
                            setMenuPerPage(n);
                            setCurrentPage(1);
                            setIsDropdownPageOpen(false);
                          }}
                          className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-[12px] font-bold"
                        >
                          {n} Menu
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[12px] font-bold text-gray-400">
                Menampilkan {startCount}-{endCount} dari {sortedData.length}{" "}
                menu
              </span>
            </div>

            <div className="flex items-center gap-1 text-[12px] font-bold">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30 "
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded border ${currentPage === p ? "bg-white text-primary border-primary" : "border-gray-200 "}`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========== MOBILE CARD VIEW ========== */}
      <div className="md:hidden space-y-3">
        <div className="bg-white rounded-xs border border-gray-100 overflow-x-auto">
          <div className="min-w-137.5">
            <table className="w-full">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th className="py-2 px-2 text-center text-[10px] rounded-tl-xs">
                    NO
                  </th>
                  <th className="py-2 px-2 text-left text-[10px]">Nama Menu</th>
                  <th className="py-2 px-2 text-right text-[10px]">Harga</th>
                  <th className="py-2 px-2 text-left text-[10px]">Kategori</th>
                  <th className="py-2 px-2 text-right text-[10px] rounded-tr-xs">
                    Total Terjual
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 px-2 text-center text-gray-400 text-[10px]">
                      {startCount + index}
                    </td>
                    <td className="py-2 px-2 text-gray-800 text-[10px] whitespace-nowrap">
                      {item.nama}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-800 text-[10px]">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-2 text-gray-800 text-[10px]">
                      {item.kategori}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-800  text-[10px]">
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION MOBILE */}
        {totalPages > 1 && (
          <div className="md:hidden flex flex-col gap-2 py-4">
            <div className="text-center text-[10px] text-gray-500">
              Menampilkan {startCount}-{endCount} dari {sortedData.length} menu
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
