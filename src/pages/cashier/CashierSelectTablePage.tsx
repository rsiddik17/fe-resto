import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardHeader from "../../components/Header/DashboardHeader";
import type { TableItem } from "../../components/Card/TableCard";
import TableFilterTabs from "../../components/Table/TableFilterTabs";
import TableCard from "../../components/Card/TableCard";
import ConfirmTableModal from "../../components/Modal/ConfirmTableModal";
import { useProfile } from "../../hooks/useProfile";

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

const CashierSelectTablePage = () => {
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

  const { firstName, roleName } = useProfile();

  return (
    <>
      {/* 1. HEADER (Menggunakan wrapper kamu) */}

      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0">
        <DashboardHeader
          title="Pilih Meja"
          userName={firstName}
          roleName={roleName}
          showBack={true}
          onBack={() => navigate(-1)}
        />
      </div>

      {/* 2. MAIN CONTENT (Menggunakan wrapper kamu) */}

      <div className="pt-1 lg:pt-1 pb-0 lg:pb-0 px-4 lg:px-8">
        <div className="bg-white rounded-t-md shadow-sm border min-h-screen border-gray-100 p-3 md:px-4 md:py-5">
          {/* TABS FILTER */}

          <TableFilterTabs filter={filter} setFilter={setFilter} />

          {/* GRID KARTU MEJA */}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-3.5 gap-y-3.75">
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onClick={handleTableClick}
              />
            ))}
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

          navigate("/cashier/order-list/create-order/select-menu");
        }}
      />
    </>
  );
};

export default CashierSelectTablePage;
