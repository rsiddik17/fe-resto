import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import TableCard, { type TableItem } from "../../components/Card/TableCard";
import ChangeTableStatusModal from "../../components/Modal/ChangeTableStatusModal";
import TableFilterTabs from "../../components/Table/TableFilterTabs";
import TableDetailModal from "../../components/Modal/TableDetailModal"; // <-- Import Modal Reusable
import TableActionConfirmModal from "../../components/Modal/TableActionConfirmModal";
import Loading from "../../components/Loading/Loading";

type TableType = "semua" | "tersedia" | "terisi" | "kotor";

// --- MOCK DATA MEJA (24 Meja) ---
const MOCK_TABLES: TableItem[] = Array.from({ length: 24 }).map((_, i) => {
  const id = String(i + 1).padStart(2, "0");
  let status: TableItem["status"] = "tersedia";
  if ([2, 7, 8, 9, 16, 17, 23, 24].includes(i + 1)) status = "terisi";
  if ([4, 5, 6, 14, 15, 19, 20, 22].includes(i + 1)) status = "kotor";
  const capacity = [2, 4, 6, 8, 10, 12][Math.floor(Math.random() * 6)];

  return { id, status, capacity };
});

const CashierTableManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<TableType>("semua");

  // State untuk data meja
  const [tables, setTables] = useState<TableItem[]>(MOCK_TABLES);

  // State Modal Ubah Status
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);

  // State Modal Reusable (Add/Edit/Detail)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailModalMode, setDetailModalMode] = useState<
    "add" | "edit" | "detail"
  >("detail");
  const [selectedDetailTable, setSelectedDetailTable] =
    useState<TableItem | null>(null);

  // --- STATE MODAL KONFIRMASI (TERPUSAT) ---
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    actionType: "save" | "delete";
    payload?: any; 
  }>({ isOpen: false, actionType: "save" });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

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
        prev.map((t) =>
          t.id === selectedTable.id ? { ...t, status: newStatus } : t,
        ),
      );
      setSelectedTable(null);
    }
  };

  // Saat tombol "Lihat detail meja" di modal status diklik
  const handleOpenDetailFromStatus = () => {
    if (selectedTable) {
      setSelectedDetailTable(selectedTable);
      setDetailModalMode("detail");
      setIsDetailModalOpen(true);
      setSelectedTable(null); // Tutup modal status
    }
  };

  // 1. TRIGGER KETIKA TOMBOL SIMPAN DI MODAL DETAIL DIKLIK
  const handleTriggerSave = (data: { id: string; capacity: number }) => {
    setConfirmConfig({ isOpen: true, actionType: "save", payload: data });
  };

  // 2. TRIGGER KETIKA TOMBOL HAPUS DI KARTU MEJA DIKLIK
  const handleTriggerDelete = (table: TableItem) => {
    setConfirmConfig({ isOpen: true, actionType: "delete", payload: table });
  };

  // 3. FUNGSI EKSEKUSI FINAL (Dijalankan saat user klik "Ya, Simpan" / "Ya, Hapus")
  const executeAction = () => {
    // 1. Tutup modal konfirmasi dulu biar rapi
    setConfirmConfig({ ...confirmConfig, isOpen: false });

    // --- LOGIKA PESAN LOADING DINAMIS ---
    if (confirmConfig.actionType === "delete") {
      setLoadingMessage("Menghapus meja...");
    } else if (confirmConfig.actionType === "save") {
      if (detailModalMode === "add") {
        setLoadingMessage("Menambahkan meja...");
      } else {
        setLoadingMessage("Menyimpan perubahan...");
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      if (confirmConfig.actionType === "delete") {
        // Logic Hapus
        const tableToDelete = confirmConfig.payload as TableItem;
        setTables(tables.filter((t) => t.id !== tableToDelete.id));
      } else if (confirmConfig.actionType === "save") {
        // Logic Simpan
        const dataToSave = confirmConfig.payload as {
          id: string;
          capacity: number;
        };
        if (detailModalMode === "add") {
          setTables([
            ...tables,
            {
              id: dataToSave.id,
              capacity: dataToSave.capacity,
              status: "tersedia",
            },
          ]);
        } else if (detailModalMode === "edit" && selectedDetailTable) {
          setTables((prev) =>
            prev.map((t) =>
              t.id === selectedDetailTable.id
                ? { ...t, id: dataToSave.id, capacity: dataToSave.capacity }
                : t,
            ),
          );
        }
        setIsDetailModalOpen(false); // Tutup form detail setelah disave
      }

      // Tutup modal konfirmasi
      setIsLoading(false);
    }, 1000); // Waktu loading 1 detik
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER (Disesuaikan Kasir) */}
      <div className="pt-7.5 pl-8 pr-6 shrink-0">
        <DashboardHeader
          title="Manajemen Meja"
          subtitle="Pantau dan ubah meja restoran secara langsung"
          userName="Rina" // <-- Kasir
          roleName="Kasir" // <-- Kasir
        />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="pt-0 pb-4 px-8 flex flex-col flex-1">
        {/* Search Bar & Tambah Meja */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-3 shrink-0">
          <div className="relative w-full md:w-112.5">
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
            />
          </div>

          {/* Tombol Tambah Meja (Khusus Kasir) */}
          <Button
            onClick={() => {
              setDetailModalMode("add");
              setSelectedDetailTable(null);
              setIsDetailModalOpen(true);
            }}
            className="w-full flex gap-0.5 items-center md:w-auto bg-primary text-sm text-white font-bold py-2 px-4.5 rounded-sm shadow-sm hover:bg-primary-hover"
          >
            <Plus size={15} strokeWidth={2.5} /> Tambah Meja
          </Button>
        </div>

        {/* Card Putih Utama */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 md:px-4 md:py-5 flex flex-col flex-1 min-h-0">
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
                    showOptions={true} // <-- FITUR KASIR MUNCUL!
                    onEdit={(t) => {
                      setSelectedDetailTable(t);
                      setDetailModalMode("edit");
                      setIsDetailModalOpen(true);
                    }}
                    onDelete={handleTriggerDelete}
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

      {/* MODAL UBAH STATUS (Dari klik Card) */}
      <ChangeTableStatusModal
        isOpen={!!selectedTable}
        onClose={() => setSelectedTable(null)}
        table={selectedTable}
        onStatusChange={handleStatusChange}
        onViewDetail={handleOpenDetailFromStatus} // <-- Tidak redirect lagi, tapi buka modal detail
      />

      {/* MODAL ADD / EDIT / DETAIL REUSABLE */}
      <TableDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        mode={detailModalMode}
        table={selectedDetailTable}
        onSave={handleTriggerSave}
      />

      <TableActionConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={executeAction}
        actionType={confirmConfig.actionType}
      />

      <Loading show={isLoading} message={loadingMessage} />
    </div>
  );
};

export default CashierTableManagementPage;
