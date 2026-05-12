import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/utils";

interface TablePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // LOGIKA PAGINATION BARU (Persis seperti gambarmu)
  const getPaginationNumbers = () => {
    // Jika total halaman 5 atau kurang, tampilkan semua angka (misal: 1 2 3)
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // SKENARIO 1: Selama berada di halaman 1 sampai 5
    // Tampilkan murni: 1 2 3 4 5
    if (currentPage <= 5) {
      return [1, 2, 3, 4, 5];
    }

    // SKENARIO 2: Berada di akhir (misal page 6 dari total 6)
    // Tampilkan: 1 ... 5 6
    if (currentPage === totalPages) {
      return [1, "...", totalPages - 1, totalPages];
    }

    // SKENARIO 3: Berada di tengah setelah 5 (misal page 6 dari total 10)
    // Tampilkan: 1 ... 5 6 7
    return [1, "...", currentPage - 1, currentPage, currentPage + 1];
  };

  return (
    <div className="flex justify-between items-start w-full">
      {/* Teks Keterangan - Kiri (BAGIAN INI TIDAK DISENTUH) */}
      <span className="text-[12.5px] text-black/50">
        Menampilkan{" "}
        <span className="font-bold text-black/50">
          {startIndex}-{endIndex}
        </span>{" "}
        dari <span className="font-bold text-black/50">{totalItems}</span> menu
      </span>

      {/* Kontrol Angka & Panah - Kanan */}
      {totalPages > 1 && (
        // PERBAIKAN: Ubah gap-1 menjadi gap-0.5 agar lebih rapat
        <div className="flex items-center gap-0.5">
          {/* Panah Kiri */}
          {currentPage > 1 && (
            <button
              onClick={() => onPageChange(currentPage - 1)}
              // PERBAIKAN: Hilangkan mr-1 agar panah lebih dekat ke angka
              className="p-0.5 text-primary hover:bg-primary/5 rounded-sm transition-colors cursor-pointer"
            >
              {/* PERBAIKAN: Perkecil size ikon dari 22 ke 18 */}
              <ChevronLeft size={18} strokeWidth={4} />
            </button>
          )}

          {/* Angka & Titik-Titik */}
          {getPaginationNumbers().map((num, idx) => (
            <button
              key={idx}
              onClick={() => typeof num === "number" && onPageChange(num)}
              disabled={num === "..."}
              className={cn(
                // PERBAIKAN: Perkecil kotak (w-7 h-7) dan font (text-[14px]), ubah border radius ke rounded-md
                "w-7 h-7 flex items-center justify-center rounded-sm text-[14px] transition-all",
                num === currentPage
                  ? "bg-primary text-white font-normal shadow-sm" // Active
                  : num === "..."
                    ? "text-gray-400 font-bold cursor-default tracking-widest pb-1.5" // Titik-titik
                    : // PERBAIKAN: Ubah warna text inactive jadi hitam pekat (text-black) seperti di desain
                      "text-black font-medium hover:bg-gray-100 cursor-pointer", // Inactive
              )}
            >
              {num}
            </button>
          ))}

          {/* Panah Kanan */}
          {currentPage < totalPages && (
            <button
              onClick={() => onPageChange(currentPage + 1)}
              // PERBAIKAN: Hilangkan ml-1 agar panah lebih dekat ke angka
              className="p-0.5 text-primary hover:bg-primary/5 rounded-sm transition-colors cursor-pointer"
            >
              {/* PERBAIKAN: Perkecil size ikon dari 22 ke 18 */}
              <ChevronRight size={18} strokeWidth={4} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TablePagination;
