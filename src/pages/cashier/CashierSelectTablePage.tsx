import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DashboardHeader from "../../components/Header/DashboardHeader";
import TableFilterTabs from "../../components/Table/TableFilterTabs";
import TableCard from "../../components/Card/TableCard";
import ConfirmTableModal from "../../components/Modal/ConfirmTableModal";
import { useProfile } from "../../hooks/useProfile";

import { tableAPI, type TableData } from "../../api/table.api";
import { useCartStore } from "../../store/useCartStore";

type FilterType = "semua" | "tersedia" | "terisi" | "kotor";

const CashierSelectTablePage = () => {
  const navigate = useNavigate();
  const { firstName, roleName } = useProfile();
  const { setTableInfo } = useCartStore();

  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("semua");

  // State untuk Modal Konfirmasi
  const [selectedTable, setSelectedTable] = useState<{
    id: number;
    table_number: string;
    capacity: number;
  } | null>(null);

  // HIT API SAAT KOMPONEN DIMUAT
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true);
        const response = await tableAPI.getAllTables();
        if (response.success && response.data) {
          const sorted = response.data.sort(
            (a: TableData, b: TableData) => a.id - b.id,
          );
          setTables(sorted);
        }
      } catch (error) {
        console.error("Gagal mengambil data meja:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTables();
  }, []);

  const filteredTables = tables.filter((t) => {
    if (filter === "semua") return true;
    if (filter === "tersedia") return t.status === "AVAILABLE";
    if (filter === "terisi") return t.status === "OCCUPIED";
    if (filter === "kotor") return t.status === "DIRTY";
    return true;
  });

  const handleTableClick = (table: TableData) => {
    // Hanya izinkan mengklik meja yang tersedia
    if (table.status === "AVAILABLE") {
      setSelectedTable({
        id: table.id,
        table_number: table.table_number,
        capacity: table.capacity,
      });
    }
  };

  const formatTableNumber = (raw: string) => {
    const num = raw.replace(/\D/g, "");
    return num || raw;
  };

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
          {isLoading ? (
            <div className="flex-1 flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="flex-1 flex justify-center items-center py-20 text-gray-500">
              Tidak ada meja yang cocok dengan filter saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-3.5 gap-y-3.75">
              {filteredTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onClick={handleTableClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panggil Modal Konfirmasi */}

      <ConfirmTableModal
        isOpen={selectedTable !== null}
        onClose={() => setSelectedTable(null)}
        tableNumber={
          selectedTable ? formatTableNumber(selectedTable.table_number) : ""
        }
        capacity={selectedTable?.capacity || 0}
        onConfirm={() => {
          if (selectedTable) {
            setTableInfo(selectedTable.id, selectedTable.table_number);
          }
          setSelectedTable(null);
          navigate("/cashier/order-list/create-order/select-menu");
        }}
      />
    </>
  );
};

export default CashierSelectTablePage;
