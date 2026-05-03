import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardHeader from "../../components/Header/DashboardHeader";
import type { TableItem } from "../../components/Card/TableCard";
import TableFilterTabs from "../../components/Table/TableFilterTabs";
import TableCard from "../../components/Card/TableCard";
import ConfirmTableModal from "../../components/Modal/ConfirmTableModal";

// --- MOCK DATA MEJA ---

const MOCK_TABLES: TableItem[] = [
  { id: "01", status: "tersedia", capacity: 6 },
  { id: "02", status: "terisi", capacity: 4 },

  { id: "03", status: "tersedia", capacity: 10 },
  { id: "04", status: "kotor", capacity: 4 },

  { id: "05", status: "kotor", capacity: 6 },
  { id: "06", status: "kotor", capacity: 2 },

  { id: "07", status: "terisi", capacity: 8 },
  { id: "08", status: "terisi", capacity: 12 },

  { id: "09", status: "terisi", capacity: 2 },
  { id: "10", status: "tersedia", capacity: 4 },

  { id: "11", status: "tersedia", capacity: 8 },
  { id: "12", status: "tersedia", capacity: 4 },
];

type FilterType = "semua" | "tersedia" | "terisi" | "kotor";

const WaiterSelectTablePage = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterType>("semua");

  // State untuk Modal Konfirmasi

  const [selectedTable, setSelectedTable] = useState<{
    id: string;
    capacity: number;
  } | null>(null);

  const filteredTables = MOCK_TABLES.filter((t) =>
    filter === "semua" ? true : t.status === filter,
  );

  const handleTableClick = (table: TableItem) => {
    if (table.status === "tersedia") {
      setSelectedTable({ id: table.id, capacity: table.capacity });
    }
  };

  return (

    <>
      {/* 1. HEADER (Menggunakan wrapper kamu) */}

      <div className="pt-8 pl-7 pr-2.5">
        <DashboardHeader
          title="Pilih Meja"
          userName="Mila"
          roleName="Pelayan"
          showBack={true}
          onBack={() => navigate(-1)}
        />
      </div>

      {/* 2. MAIN CONTENT (Menggunakan wrapper kamu) */}

      <div className="pt-0 pb-6 px-7">
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 md:px-4 md:py-5">
          {/* TABS FILTER */}

          <TableFilterTabs filter={filter} setFilter={setFilter} />

          {/* GRID KARTU MEJA */}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredTables.map(
              (
                table, // <-- PERBAIKAN: Pakai kurung biasa () di sini
              ) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onClick={handleTableClick}
                />
              ),
            )}
          </div>
        </div>
      </div>

      {/* Panggil Modal Konfirmasi */}

      <ConfirmTableModal
        isOpen={selectedTable !== null}
        onClose={() => setSelectedTable(null)}
        tableNumber={selectedTable?.id || ""}
        capacity={selectedTable?.capacity || 0}
        onConfirm={() => {
          setSelectedTable(null);

          navigate("/waiter/create-order/select-menu"); // Kembali ke halaman pesanan untuk pilih menu
        }}
      />
    </>
  );
};

export default WaiterSelectTablePage;
