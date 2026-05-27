import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import TableCard from "../../components/Card/TableCard";
import ChangeTableStatusModal from "../../components/Modal/ChangeTableStatusModal";
import TableFilterTabs from "../../components/Table/TableFilterTabs";
import TableDetailModal from "../../components/Modal/TableDetailModal"; // <-- Import Modal Reusable
import TableActionConfirmModal from "../../components/Modal/TableActionConfirmModal";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";
import { useProfile } from "../../hooks/useProfile";

import { tableAPI, type TableData } from "../../api/table.api";

type TableType = "semua" | "tersedia" | "terisi" | "kotor";

const CashierTableManagementPage = () => {
  const { firstName, roleName } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<TableType>("semua");

  // State untuk data meja dari API
  const [tables, setTables] = useState<TableData[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // State Modal Ubah Status
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  // State Modal Reusable (Add/Edit/Detail)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailModalMode, setDetailModalMode] = useState<
    "add" | "edit" | "detail"
  >("detail");
  const [selectedDetailTable, setSelectedDetailTable] =
    useState<TableData | null>(null);

  // --- STATE MODAL KONFIRMASI (TERPUSAT) ---
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    actionType: "save" | "delete";
    payload?: any;
  }>({ isOpen: false, actionType: "save" });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // --- STATE TOAST ---
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

  // 1. HIT API MENGAMBIL DATA MEJA
  const fetchTables = async () => {
    try {
      setIsFetching(true);
      const response = await tableAPI.getAllTables();
      if (response.success && response.data) {
        const sorted = response.data.sort(
          (a: TableData, b: TableData) => a.id - b.id,
        );
        setTables(sorted);
      }
    } catch (error) {
      console.error("Gagal mengambil data meja:", error);
      triggerToast("Gagal memuat data meja", "error");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Logika Filter dan Search
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      let matchFilter = true;
      if (filter === "tersedia") matchFilter = table.status === "AVAILABLE";
      if (filter === "terisi") matchFilter = table.status === "OCCUPIED";
      if (filter === "kotor") matchFilter = table.status === "DIRTY";

      const matchSearch = table.table_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [tables, filter, searchQuery]);

  // Handle Ubah Status
  const handleStatusChange = async (
    newStatusText: "tersedia" | "terisi" | "kotor",
  ) => {
    if (!selectedTable) return;

    let backendStatus: "AVAILABLE" | "OCCUPIED" | "DIRTY" = "AVAILABLE";
    if (newStatusText === "terisi") backendStatus = "OCCUPIED";
    if (newStatusText === "kotor") backendStatus = "DIRTY";

    const currentTableId = selectedTable.id;

    // Optimistic Update
    setTables((prev) =>
      prev.map((t) =>
        t.id === currentTableId ? { ...t, status: backendStatus } : t,
      ),
    );
    setSelectedTable(null);

    try {
      const response = await tableAPI.updateTable(currentTableId, {
        status: backendStatus,
      });
      if (response.success) {
        triggerToast("Status meja berhasil diubah!", "success");
      } else {
        triggerToast("Gagal mengubah status", "error");
        fetchTables(); // Revert data jika gagal
      }
    } catch (error) {
      console.error("Gagal update status meja:", error);
      triggerToast("Terjadi kesalahan jaringan", "error");
      fetchTables();
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
  const handleTriggerSave = async (data: {
    table_number: string;
    capacity: number;
  }) => {
    if (detailModalMode === "add") {
      setLoadingMessage("Menambahkan meja...");
      setIsLoading(true);

      try {
        await tableAPI.createTable({
          table_number: data.table_number,
          capacity: data.capacity,
          status: "AVAILABLE",
        });
        triggerToast(
          `Meja ${data.table_number} berhasil ditambahkan!`,
          "success",
        );
        setIsDetailModalOpen(false);
        await fetchTables();
      } catch (error: any) {
        console.error("Gagal tambah meja:", error);
        const errMsg =
          error.response?.data?.message || "Gagal menambahkan meja";
        triggerToast(errMsg, "error");
      } finally {
        setIsLoading(false);
      }
    }
    // Jika mode "edit" (Ubah Meja), tampilkan modal konfirmasi terlebih dahulu
    else if (detailModalMode === "edit") {
      setConfirmConfig({ isOpen: true, actionType: "save", payload: data });
    }
  };

  // 2. TRIGGER KETIKA TOMBOL HAPUS DI KARTU MEJA DIKLIK
  const handleTriggerDelete = (table: TableData) => {
    setConfirmConfig({ isOpen: true, actionType: "delete", payload: table });
  };

  // 3. FUNGSI EKSEKUSI FINAL (Dijalankan saat user klik "Ya, Simpan" / "Ya, Hapus")
  const executeAction = async () => {
    // 1. Tutup modal konfirmasi dulu biar rapi
    setConfirmConfig({ ...confirmConfig, isOpen: false });

    // --- LOGIKA PESAN LOADING DINAMIS ---
    if (confirmConfig.actionType === "delete") {
      setLoadingMessage("Menghapus meja...");
    } else if (confirmConfig.actionType === "save") {
      setLoadingMessage("Menyimpan perubahan...");
    }

    setIsLoading(true);

    try {
      if (confirmConfig.actionType === "delete") {
        const tableToDelete = confirmConfig.payload as TableData;
        await tableAPI.deleteTable(tableToDelete.id);
        triggerToast(
          `Meja ${tableToDelete.table_number} berhasil dihapus!`,
          "success",
        );
      } else if (
        confirmConfig.actionType === "save" &&
        detailModalMode === "edit" &&
        selectedDetailTable
      ) {
        const dataToSave = confirmConfig.payload as {
          table_number: string;
          capacity: number;
        };

        await tableAPI.updateTable(selectedDetailTable.id, {
          table_number: dataToSave.table_number,
          capacity: dataToSave.capacity,
        });
        triggerToast(
          `Perubahan meja ${dataToSave.table_number} berhasil disimpan!`,
          "success",
        );
      }
      setIsDetailModalOpen(false);

      // Ambil ulang data segar dari backend setelah sukses update/delete/create
      await fetchTables();
    } catch (error: any) {
      console.error("Gagal mengeksekusi aksi:", error);
      const errMsg =
        error.response?.data?.message || "Terjadi kesalahan sistem";
      triggerToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER (Disesuaikan Kasir) */}
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0 shrink-0">
        <DashboardHeader
          title="Manajemen Meja"
          subtitle="Pantau dan ubah meja restoran secara langsung"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="pt-1 lg:pt-1 pb-4 lg:pb-4 px-4 lg:px-8 flex flex-col flex-1">
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
            className="w-full flex gap-0.5 items-center md:w-auto bg-primary text-sm md:text-[13px] lg:text-[13px] text-white font-bold py-2 px-4.5 rounded-sm shadow-sm hover:bg-primary-hover"
          >
            <Plus size={15} strokeWidth={2.5} /> Tambah Meja
          </Button>
        </div>

        {/* Card Putih Utama */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 md:px-4 md:py-5 flex flex-col flex-1 min-h-0">
          <TableFilterTabs filter={filter} setFilter={setFilter} />

          {/* Grid Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-48 text-primary">
                <span className="text-sm font-bold">Memuat meja...</span>
              </div>
            ) : filteredTables.length > 0 ? (
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
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-[15px]">
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
        onViewDetail={handleOpenDetailFromStatus}
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
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default CashierTableManagementPage;
