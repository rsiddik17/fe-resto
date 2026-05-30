import { useEffect, useState } from "react";
import { cn } from "../../utils/utils";
import { tableAPI, type TableData } from "../../api/table.api";

const TableStatusBoard = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await tableAPI.getAllTables();
        if (response.success && response.data) {
          // Sort meja berdasarkan ID atau nomor agar berurutan
          const sortedTables = response.data.sort(
            (a: TableData, b: TableData) => a.id - b.id,
          );
          setTables(sortedTables);
        }
      } catch (error) {
        console.error("Gagal mengambil status meja:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();

    // Polling tiap 15 detik agar status meja di dashboard kasir/pelayan selalu update otomatis
    const interval = setInterval(fetchTables, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk mengekstrak angka "M01_i" menjadi "M-01"
  const formatTableNumber = (rawNumber: string) => {
    const num = rawNumber.replace(/\D/g, ""); // Ambil angkanya saja
    return num ? `M-${num}` : rawNumber; // Jika bukan format angka, kembalikan teks aslinya
  };

  return (
    <div className="bg-white w-full rounded-md shadow-sm border border-secondary px-4 py-5 overflow-hidden">
      <h3 className="font-bold text-lg mb-2.5">Status Meja</h3>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-gray-600">
        <div className="flex items-center gap-1.5 ">
          <div className="w-3 h-3 rounded-full bg-[#D9D9D9]"></div>{" "}
          <p className="text-[15px]">Kotor</p>
        </div>
        <div className="flex items-center gap-1.5 ">
          <div className="w-3 h-3 rounded-full bg-primary"></div>{" "}
          <p className="text-[15px]">Terisi</p>
        </div>
        <div className="flex items-center gap-1.5 ">
          <div className="w-3 h-3 rounded-full border-2 border-lime"></div>{" "}
          <p className="text-[15px]">Tersedia</p>
        </div>
      </div>

      {/* Grid Meja */}
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {tables.map((table) => (
            <div
              key={table.id}
              className={cn(
                "aspect-square p-px rounded-sm text-center flex items-center justify-center text-base md:text-xl lg:text-base",
                table.status === "OCCUPIED" && "bg-primary text-white",
                table.status === "DIRTY" && "bg-[#D9D9D9] text-white",
                table.status === "AVAILABLE" &&
                  "bg-white border-2 border-lime text-lime",
              )}
              title={`Kapasitas: ${table.capacity} Orang`}
            >
              {formatTableNumber(table.table_number)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableStatusBoard;
