import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Menu {
  id: number;
  nama: string;
  harga: number;
  kategori: string;
  total: number;
}

interface TabelMenuProps {
  onSortChange?: (sortedData: Menu[]) => void;
}

const DATA_MENU_LENGKAP: Menu[] = [
  { id: 1, nama: "Es Teler", harga: 20000, kategori: "Minuman", total: 56 },
  { id: 2, nama: "Mie Ayam Bakso", harga: 30000, kategori: "Makanan", total: 54 },
  { id: 3, nama: "Ayam Penyet", harga: 40000, kategori: "Makanan", total: 54 },
  { id: 4, nama: "Nasi Goreng Kambing", harga: 40000, kategori: "Makanan", total: 44 },
  { id: 5, nama: "Sate Ayam", harga: 40000, kategori: "Makanan", total: 43 },
  { id: 6, nama: "Sop Iga", harga: 50000, kategori: "Makanan", total: 42 },
  { id: 7, nama: "Lychee Tea", harga: 20000, kategori: "Minuman", total: 41 },
  { id: 8, nama: "Gado-gado", harga: 30000, kategori: "Makanan", total: 39 },
  { id: 9, nama: "Matcha Latte", harga: 30000, kategori: "Minuman", total: 38 },
  { id: 10, nama: "Lemon Tea", harga: 20000, kategori: "Minuman", total: 37 },
  { id: 11, nama: "Bakso Urat", harga: 30000, kategori: "Makanan", total: 36 },
  { id: 12, nama: "Le Mineral", harga: 5000, kategori: "Minuman", total: 34 },
  { id: 13, nama: "Jus Alpukat", harga: 20000, kategori: "Minuman", total: 32 },
  { id: 14, nama: "Dimsum", harga: 30000, kategori: "Makanan", total: 31 },
  { id: 15, nama: "Jus Mangga", harga: 20000, kategori: "Minuman", total: 30 },
  { id: 16, nama: "Nasi Bakar", harga: 30000, kategori: "Makanan", total: 28 },
  { id: 17, nama: "Nasi Goreng", harga: 30000, kategori: "Makanan", total: 26 },
  { id: 18, nama: "Es Jeruk", harga: 20000, kategori: "Minuman", total: 22 },
  { id: 19, nama: "Soto Ayam", harga: 40000, kategori: "Makanan", total: 21 },
  { id: 20, nama: "Nasi Liwet", harga: 30000, kategori: "Makanan", total: 20 },
  { id: 21, nama: "Kopi Susu", harga: 20000, kategori: "Minuman", total: 19 },
  { id: 22, nama: "Nasi Goreng Udang", harga: 40000, kategori: "Makanan", total: 18 },
  { id: 23, nama: "Nasi Kuning", harga: 30000, kategori: "Makanan", total: 18 },
  { id: 24, nama: "Milkshake Stroberi", harga: 20000, kategori: "Minuman", total: 17 },
  { id: 25, nama: "Nasi Kebuli", harga: 50000, kategori: "Makanan", total: 17 },
  { id: 26, nama: "Cireng Bumbu Rujak", harga: 20000, kategori: "Makanan", total: 16 },
  { id: 27, nama: "Roti Bakar Cokelat", harga: 20000, kategori: "Makanan", total: 15 },
  { id: 28, nama: "Es Kelapa Muda", harga: 20000, kategori: "Minuman", total: 14 },
  { id: 29, nama: "Pempek", harga: 40000, kategori: "Makanan", total: 12 },
  { id: 30, nama: "Jus Stroberi", harga: 20000, kategori: "Minuman", total: 10 },
  { id: 31, nama: "Kwetiau Goreng", harga: 30000, kategori: "Makanan", total: 9 },
  { id: 32, nama: "Capcay", harga: 30000, kategori: "Makanan", total: 8 },
  { id: 33, nama: "Jus Jambu", harga: 20000, kategori: "Minuman", total: 5 },
  { id: 34, nama: "Nasi Putih", harga: 10000, kategori: "Makanan", total: 3 },
  { id: 35, nama: "Es Kuwut", harga: 20000, kategori: "Minuman", total: 2 },
  { id: 36, nama: "Es Cincau", harga: 20000, kategori: "Minuman", total: 0 },
];

export default function TableMenu({ onSortChange }: TabelMenuProps) {
  const [menuPerPage, setMenuPerPage] = useState(10);
  const [isDropdownPageOpen, setIsDropdownPageOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"nama" | "harga" | "kategori" | "total" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownPageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSort = (field: "nama" | "harga" | "kategori" | "total") => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedData = [...DATA_MENU_LENGKAP].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "nama" || sortField === "kategori") {
      return sortOrder === "asc" ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
    }
    return sortOrder === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
  });

  useEffect(() => {
    if (onSortChange) onSortChange(sortedData);
  }, [sortedData, onSortChange]);

  const totalPages = Math.ceil(sortedData.length / menuPerPage);
  const indexOfLastItem = currentPage * menuPerPage;
  const indexOfFirstItem = indexOfLastItem - menuPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const renderSortIcon = (field: "nama" | "harga" | "kategori" | "total") => (
    <div className="flex flex-col text-gray-400">
      <ChevronUp size={11} className={sortField === field && sortOrder === "asc" ? "text-primary" : ""} />
      <ChevronDown size={11} className={sortField === field && sortOrder === "desc" ? "text-primary" : ""} />
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* TABEL - Overflow hanya di sini agar responsif */}
      <div className="border border-b-0 border-gray-150 rounded-t-xs bg-white overflow-x-auto">
        <table className="w-full min-w-175 text-left text-[12.5px]">
          <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-2.5 text-center w-14">NO</th>
              <th className="py-2.5 px-4 cursor-pointer select-none" onClick={() => handleSort("nama")}>
                <div className="flex items-center gap-1">NAMA MENU {renderSortIcon("nama")}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer select-none" onClick={() => handleSort("harga")}>
                <div className="flex items-center gap-1">HARGA {renderSortIcon("harga")}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer select-none" onClick={() => handleSort("kategori")}>
                <div className="flex items-center gap-1">KATEGORI {renderSortIcon("kategori")}</div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer select-none" onClick={() => handleSort("total")}>
                <div className="flex items-center gap-1">TOTAL TERJUAL {renderSortIcon("total")}</div>
              </th>
            </tr>
          </thead>
          <tbody className="font-medium text-gray-800 bg-white">
            {currentItems.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-150 last:border-b-0 hover:bg-gray-50/30 transition-colors">
                <td className="py-2.5 text-center text-gray-400 font-bold">{indexOfFirstItem + index + 1}</td>
                <td className="py-2.5 px-4 font-semibold text-black">{item.nama}</td>
                <td className="py-2.5 px-4">Rp {item.harga.toLocaleString("id-ID")}</td>
                <td className="py-2.5 px-4 text-gray-600">{item.kategori}</td>
                <td className="py-2.5 px-4 text-black">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION - Di luar overflow-x-auto agar dropdown tidak terpotong */}
      <div className="border border-gray-150 rounded-b-xs bg-white">
        <div className="flex flex-wrap items-center justify-between py-3.5 px-4 gap-4">
          <div className="flex items-center gap-2 text-[12.5px] font-bold text-gray-400">
            <span>Tampilkan</span>
            <div className="relative" ref={dropdownRef}>
              <button type="button" onClick={() => setIsDropdownPageOpen(!isDropdownPageOpen)}
                className="bg-white border border-purple-900/30 rounded-xs px-3 py-1 text-black font-extrabold flex items-center gap-1 text-[12px] shadow-2xs h-7">
                {menuPerPage} Menu
                <ChevronDown size={13} className={`transition-transform duration-200 ${isDropdownPageOpen ? "rotate-180" : ""}`} />
              </button>
              {isDropdownPageOpen && (
                <div className="absolute left-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-xs shadow-xl p-1 z-50">
                  {[10, 15, 20].map((num) => (
                    <button key={num} type="button" onClick={() => { setMenuPerPage(num); setIsDropdownPageOpen(false); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-1.5 text-[12px] font-bold rounded-xs transition-colors ${menuPerPage === num ? "bg-purple-50 text-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                      {num} Menu
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span>Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedData.length)} dari {sortedData.length} menu</span>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] font-bold">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-xs text-gray-500 disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 flex items-center justify-center border rounded-xs font-bold transition-all ${currentPage === page ? "border-primary text-primary bg-white" : "border-gray-300 text-gray-500 hover:border-gray-400 bg-white"}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-xs text-gray-500 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}