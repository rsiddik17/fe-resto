export interface DailySaleItem {
  id: number;
  orderId: string;
  time: string;
  foods: string;
  drinks: string;
  bank: string;
  total: number;
  date: string;
}

type SortKey = "orderId" | "time" | "foods" | "drinks" | "bank" | "total";
type SortDirection = "asc" | "desc";

interface ReportTableProps {
  data: DailySaleItem[];
  sortConfig: { key: SortKey; direction: SortDirection } | null;
  onSort: (key: SortKey) => void;
}

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// --- KOMPONEN SVG CUSTOM UNTUK SORTING ---
const SortIcon = ({ activeDirection }: { activeDirection: "asc" | "desc" | null }) => {
  const isAsc = activeDirection === "asc";
  const isDesc = activeDirection === "desc";

  return (
    <div className="inline-flex flex-col items-center justify-center ml-1.5 -translate-y-0.5">
      <svg width="13" height="17" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Segitiga Atas (ASC) */}
        <path 
          d="M5 2L9 7H1L5 2Z" 
          fill={isAsc ? "#000000" : "transparent"} 
          stroke={isAsc ? "#000000" : "#9CA3AF"} 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />
        {/* Segitiga Bawah (DESC) */}
        <path 
          d="M5 14L1 9H9L5 14Z" 
          fill={isDesc ? "#000000" : "transparent"} 
          stroke={isDesc ? "#000000" : "#9CA3AF"} 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const ReportTable = ({ data, sortConfig, onSort }: ReportTableProps) => {
  
  const getDirection = (key: SortKey) => {
    return sortConfig?.key === key ? sortConfig.direction : null;
  };

  return (
    <div className="mb-6">
      {/* Container Tabel dengan Max Height untuk batas ~10 Baris (Tinggi 1 baris ~55px) */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-150">
          <table className="w-full text-left border-collapse min-w-200">
            {/* STICKY HEADER agar saat di-scroll ke bawah, header tidak hilang */}
            <thead className="bg-[#D9D9D9] text-black/50 text-[12.5px] uppercase sticky top-0 z-10 shadow-sm">
              <tr>
                <th rowSpan={2} className="px-4 py-1 font-bold text-center w-12 border-r border-white">
                  NO
                </th>
                <th 
                  rowSpan={2} 
                  onClick={() => onSort("orderId")}
                  className="px-4 py-1 font-bold border-r border-white cursor-pointer hover:bg-black/5 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center">
                    ID PESANAN <SortIcon activeDirection={getDirection("orderId")}  />
                  </div>
                </th>
                <th 
                  rowSpan={2} 
                  onClick={() => onSort("time")}
                  className="px-4 py-1 font-bold border-r border-white cursor-pointer hover:bg-black/5 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center">
                    JAM PEMESANAN <SortIcon activeDirection={getDirection("time")} />
                  </div>
                </th>
                <th colSpan={2} className="px-4 py-1 font-bold text-center border-b border-r border-white">
                  PESANAN
                </th>
                <th 
                  rowSpan={2} 
                  onClick={() => onSort("bank")}
                  className="px-4 py-1 font-bold border-r border-white cursor-pointer hover:bg-black/5 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center">
                    NAMA BANK <SortIcon activeDirection={getDirection("bank")} />
                  </div>
                </th>
                <th 
                  rowSpan={2} 
                  onClick={() => onSort("total")}
                  className="px-4 py-1 font-bold cursor-pointer hover:bg-black/5 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center">
                    TOTAL <SortIcon activeDirection={getDirection("total")} />
                  </div>
                </th>
              </tr>
              <tr className="bg-[#D9D9D9]">
                <th 
                  onClick={() => onSort("foods")}
                  className="px-4 py-1.25 font-bold border-r border-white cursor-pointer hover:bg-black/5 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center">
                    MAKANAN <SortIcon activeDirection={getDirection("foods")} />
                  </div>
                </th>
                <th 
                  onClick={() => onSort("drinks")}
                  className="px-4 py-1.25 font-bold border-r border-white cursor-pointer hover:bg-black/5 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center">
                    MINUMAN <SortIcon activeDirection={getDirection("drinks")} />
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="text-[13.5px] text-black">
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={row.id} className="border-b-[1.5px] border-[#DEDED9] hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.orderId}</td>
                    <td className="px-4 py-3">{row.time}</td>
                    <td className="px-4 py-3 max-w-50 leading-relaxed">
                      {row.foods ? row.foods.split(',').map((item, i) => <div key={i}>{item.trim()}</div>) : "-"}
                    </td>
                    <td className="px-4 py-3 max-w-50 leading-relaxed">
                      {row.drinks ? row.drinks.split(',').map((item, i) => <div key={i}>{item.trim()}</div>) : "-"}
                    </td>
                    <td className="px-4 py-3">{row.bank}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{formatRupiah(row.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 font-medium">
                    Tidak ada data penjualan untuk tanggal ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportTable;