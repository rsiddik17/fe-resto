import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Button from "../../components/ui/Button";
import { useMenus } from "../../hooks/useMenus";

// KOMPONEN PENDUKUNG
import MenuFilterBar from "../../components/Filter/MenuFilterBar";
import MenuTable from "../../components/Table/MenuTable";
import TablePagination from "../../components/Table/TablePagination";
import MenuActionModal from "../../components/Modal/MenuActionModal";
import Toast from "../../components/Toast/Toast";
import { Plus } from "lucide-react";

// API
import { menuAPI } from "../../api/menu.api";

const CashierMenuStockPage = () => {
  const navigate = useNavigate();

  const { data: menus = [], isLoading, isError, refetch } = useMenus();

  // States Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Max 6 menu

  // State Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false) 
  const [selectedMenu, setSelectedMenu] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // --- STATE TOAST ---
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "error",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "error" }), 4000);
  };

  // LOGIC FILTERING
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const menuStatus =
        menu.stock !== undefined && menu.stock <= 0 ? "Habis" : "Tersedia";
      const matchStatus =
        statusFilter === "Semua" || menuStatus === statusFilter;
      const matchCategory =
        categoryFilter === "Semua" ||
        menu.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchSearch = menu.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchStatus && matchCategory && matchSearch;
    });
  }, [menus, statusFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  // LOGIC PAGINATION
  const totalItems = filteredMenus.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMenus = filteredMenus.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleTriggerDelete = (id: string, name: string) => {
    setSelectedMenu({ id, name });
    setIsDeleteModalOpen(true); // Buka modal saat tombol hapus di tabel diklik
  };

  // FUNGSI SAAT TOMBOL "YA, HAPUS" DI MODAL DIKLIK
  const handleConfirmDelete = async () => {
    if (!selectedMenu) return;

    try {
      setIsDeleting(true);
      console.log("Memanggil API Hapus untuk ID:", selectedMenu.id);

      // Tembak API Hapus
      await menuAPI.deleteMenu(selectedMenu.id);

      triggerToast(`Menu "${selectedMenu.name}" berhasil dihapus!`, "success");

      // Refresh data tabel setelah sukses dihapus
      if (refetch) {
        refetch(); // Jika useMenus pakai React Query
      } else {
        window.location.reload(); // Fallback jika tidak ada fungsi refetch
      }

    } catch (error: any) {
      console.error("Gagal menghapus menu:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Terjadi kesalahan server saat menghapus";
      triggerToast(`Gagal: ${errorMsg}`, "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false); // Tutup modal
      setSelectedMenu(null);
    }
  };

  return (
    <>
      <div className="pt-7.5 pl-8 pr-6">
        <DashboardHeader
          title="Manajemen Menu & Stok"
          subtitle="Kelola daftar menu serta ketersediaan stok"
          userName="Rina"
          roleName="Kasir"
        />
      </div>

      <div className="pt-0 pb-6 px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white border border-gray-100 text-primary px-6 py-2 rounded-xs shadow-sm text-[13px]">
            Total Menu: {menus.length}
          </div>
          <Button
            onClick={() => navigate("/cashier/management-menu-stock/add-menu")}
            className="bg-primary flex gap-0.5 items-center hover:bg-[#5a0b64] text-white font-semibold px-4 py-2 rounded-xs shadow-sm text-[13px]"
          >
            <Plus size={15} strokeWidth={2.5} /> Tambah Menu
          </Button>
        </div>

        {/* 1. FILTER BAR SECTION (DI LUAR KOTAK TABEL) */}
        <div className="mb-3">
          <MenuFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
        </div>

        {/* 2. TABLE SECTION (KOTAK PUTIH MURNI UNTUK TABEL) */}
        <div className="rounded-sm shadow-sm mb-4">
          <MenuTable
            menus={currentMenus}
            isLoading={isLoading || isDeleting}
            isError={isError}
            onTriggerDelete={handleTriggerDelete}
          />
        </div>

        {/* 3. PAGINATION SECTION (DI LUAR KOTAK TABEL, PALING BAWAH) */}
        <div className="flex items-center gap-1.5">
          <TablePagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <MenuActionModal
        isOpen={isDeleteModalOpen}
        type="delete"
        menuName={selectedMenu?.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
};

export default CashierMenuStockPage;
