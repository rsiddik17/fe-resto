import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import ChangeTableStatusModal from "../../components/Modal/ChangeTableStatusModal";
import TableFilterTabs from "../../components/Table/TableFilterTabs";
import { useProfile } from "../../hooks/useProfile";

import { tableAPI, type TableData } from "../../api/table.api";
// --- PERBAIKAN 1: Import orderAPI untuk mengecek status pesanan meja ---
import { orderAPI } from "../../api/order.api";
import TableCard from "../../components/Card/TableCard";
import Toast from "../../components/Toast/Toast";

type TableType = "semua" | "tersedia" | "terisi" | "kotor";

const WaiterTableManagementPage = () => {
  const navigate = useNavigate();
  const { firstName, roleName } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<TableType>("semua");

  // State untuk data meja dan modal
  const [tables, setTables] = useState<TableData[]>([]);
  // --- PERBAIKAN 2: State untuk menampung pesanan yang sedang aktif ---
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

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
      setIsLoading(true);
      const response = await tableAPI.getAllTables();
      if (response.success && response.data) {
        // Urutkan meja berdasarkan ID agar berurutan
        const sorted = response.data.sort(
          (a: TableData, b: TableData) => a.id - b.id,
        );
        setTables(sorted);
      }
    } catch (error) {
      console.error("Gagal mengambil data meja:", error);
      triggerToast("Gagal mengambil data meja", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- PERBAIKAN 3: Fungsi untuk menarik daftar pesanan yang belum selesai ---
  const fetchActiveOrders = async () => {
    try {
      const statuses = ["PENDING", "VALIDATED", "COOKING", "READY"];
      const responses = await Promise.all(
        statuses.map((status) => orderAPI.getOrdersByStatus(status).catch(() => ({ success: false, data: [] })))
      );

      let combinedData: any[] = [];
      responses.forEach((res) => {
        if (res.success && res.data) combinedData = [...combinedData, ...res.data];
      });

      setActiveOrders(combinedData);
    } catch (error) {
      console.error("Gagal mengambil daftar pesanan aktif:", error);
    }
  };

  // --- PERBAIKAN 4: Menarik semua data dan setup Auto-Refresh (Polling) ---
  const loadAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchTables(), fetchActiveOrders()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllData();
    // Auto refresh setiap 8 detik agar data selalu valid
    const intervalId = setInterval(() => {
      fetchTables();
      fetchActiveOrders();
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  // Logika Filter dan Search
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      let matchFilter = true;
      if (filter === "tersedia") matchFilter = table.status === "AVAILABLE";
      if (filter === "terisi") matchFilter = table.status === "OCCUPIED";
      if (filter === "kotor") matchFilter = table.status === "DIRTY";

      // Pencarian berdasarkan nomor meja atau ekstrak angka (misal "01")
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

    // Cek apakah ada order aktif di meja yang sedang di-klik
    const isTableHasActiveOrder = activeOrders.some((order) => order.table_number === selectedTable.table_number);

    // Tolak perubahan ke "tersedia" atau "kotor" jika pesanan belum selesai
    if (isTableHasActiveOrder && (newStatusText === "tersedia" || newStatusText === "kotor")) {
      setSelectedTable(null); // Tutup modal langsung
      triggerToast(`Meja ${selectedTable.table_number} tidak dapat diubah karena pesanan belum selesai.`, "error");
      return; // Berhenti di sini, jangan hit API update meja
    }

    // Map teks bahasa Indonesia dari Modal kembali ke ENUM Backend
    let backendStatus: "AVAILABLE" | "OCCUPIED" | "DIRTY" = "AVAILABLE";
    if (newStatusText === "terisi") backendStatus = "OCCUPIED";
    if (newStatusText === "kotor") backendStatus = "DIRTY";

    // Optimistic Update UI (Biar kerasa responsif buat user)
    setTables((prev) =>
      prev.map((t) =>
        t.id === selectedTable.id ? { ...t, status: backendStatus } : t,
      ),
    );
    setSelectedTable(null); // Tutup modal

    try {
      const response = await tableAPI.updateTable(selectedTable.id, {
        status: backendStatus,
      });

      if (response.success) {
        triggerToast("Status meja berhasil diubah", "success");
      } else {
        // Revert jika gagal (bisa dihilangkan kalau yakin API selalu aman)
        triggerToast("Gagal mengubah status meja", "error");
        fetchTables();
      }
    } catch (error) {
      console.error("Gagal update meja:", error);
      triggerToast("Terjadi kesalahan jaringan", "error");
      fetchTables();
    }
  };

  // Navigasi ke Detail
  const handleGoToDetail = () => {
    if (selectedTable) {
      // Bawa data meja ke halaman detail
      navigate(`/waiter/table-management/${selectedTable.id}`, {
        state: { table: selectedTable },
      });
      setSelectedTable(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER (Menggunakan wrapper permintaanmu) */}
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
            {isLoading ? (
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

      {/* MODAL UBAH STATUS */}
      <ChangeTableStatusModal
        isOpen={!!selectedTable}
        onClose={() => setSelectedTable(null)}
        table={selectedTable}
        onStatusChange={handleStatusChange}
        onViewDetail={handleGoToDetail}
      />

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default WaiterTableManagementPage;
