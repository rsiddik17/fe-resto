import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import TableCard, { type TableItem } from "../../components/Card/TableCard";
import ChangeTableStatusModal from "../../components/Modal/ChangeTableStatusModal";
import TableFilterTabs from "../../components/Table/TableFilterTabs";

type TableType = "semua" | "tersedia" | "terisi" | "kotor";

// --- MOCK DATA MEJA (24 Meja) ---
const MOCK_TABLES: TableItem[] = Array.from({ length: 24 }).map((_, i) => {
  const id = String(i + 1).padStart(2, "0");
  let status: TableItem["status"] = "tersedia";
  if ([2, 7, 8, 9, 16, 17, 23, 24].includes(i + 1)) status = "terisi";
  if ([4, 5, 6, 14, 15, 19, 20, 22].includes(i + 1)) status = "kotor";
  let capacity = [2, 4, 6, 8, 10, 12][Math.floor(Math.random() * 6)];
  
  return { id, status, capacity };
});

const WaiterTableManagementPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<TableType>("semua");
  
  // State untuk data meja dan modal
  const [tables, setTables] = useState<TableItem[]>(MOCK_TABLES);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);

  // Logika Filter dan Search
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchFilter = filter === "semua" ? true : table.status === filter;
      const matchSearch = table.id.includes(searchQuery);
      return matchFilter && matchSearch;
    });
  }, [tables, filter, searchQuery]);

  // Handle Ubah Status
  const handleStatusChange = (newStatus: TableItem["status"]) => {
    if (selectedTable) {
      setTables((prev) =>
        prev.map((t) => (t.id === selectedTable.id ? { ...t, status: newStatus } : t))
      );
      setSelectedTable(null); // Tutup modal setelah ubah status
    }
  };

  // Navigasi ke Detail
  const handleGoToDetail = () => {
    if (selectedTable) {
      // Bawa data meja ke halaman detail
      navigate(`/waiter/table-management/${selectedTable.id}`, { state: { table: selectedTable } });
      setSelectedTable(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HEADER (Menggunakan wrapper permintaanmu) */}
      <div className="pt-7.5 pl-8 pr-6 shrink-0">
        <DashboardHeader
          title="Manajemen Meja"
          subtitle="Pantau dan ubah meja restoran secara langsung"
          userName="Mila"
          roleName="Pelayan"
        />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="pt-0 pb-4 px-8 flex flex-col flex-1">
        
        {/* Search Bar */}
        <div className="relative mb-3 shrink-0 max-w-110">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-black/50" />
          </div>
          <Input
            type="text"
            className="w-full pl-11 pr-4 py-2 text-[14px] rounded-sm border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-black/50 shadow-sm"
            placeholder="Cari nomor meja"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Card Putih Utama */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 md:px-4 md:py-5 flex flex-col flex-1 min-h-0">
          
          {/* Tab Filter */}
          <TableFilterTabs filter={filter} setFilter={setFilter} />

          {/* Grid Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredTables.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-3.5 gap-y-3.75">
                {filteredTables.map((table) => (
                  <TableCard 
                    key={table.id} 
                    table={table} 
                    onClick={() => setSelectedTable(table)} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
                Tidak ada meja yang cocok.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL UBAH STATUS */}
      <ChangeTableStatusModal
        isOpen={!!selectedTable}
        onClose={() => setSelectedTable(null)}
        table={selectedTable}
        onStatusChange={handleStatusChange}
        onViewDetail={handleGoToDetail}
      />
    </div>
  );
};

export default WaiterTableManagementPage;