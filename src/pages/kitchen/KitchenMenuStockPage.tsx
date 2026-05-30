import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import { useMenus } from "../../hooks/useMenus";
import MenuFilterBar from "../../components/Filter/MenuFilterBar";
import KitchenMenuTable from "../../components/Table/KitchenMenuTable";
import TablePagination from "../../components/Table/TablePagination";
import type { MenuItemData } from "../../components/Table/MenuTable";

// IMPORT MODAL & TOAST
import EditStockModal from "../../components/Modal/EditStockModal";
import SuccessActionModal from "../../components/Modal/SuccessActionModal";
import Toast from "../../components/Toast/Toast"; // <-- TAMBAHAN IMPORT TOAST

// IMPORT API
import { menuAPI } from "../../api/menu.api";
import { useProfile } from "../../hooks/useProfile";

const KitchenMenuStockPage = () => {
  const { data: menus = [], isLoading, isError, refetch } = useMenus();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- STATE MODAL EDIT ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItemData | null>(null);

  // --- STATE MODAL SUCCESS ---
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --- STATE TOAST ---
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "error",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

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

  const totalItems = filteredMenus.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMenus = filteredMenus.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleTriggerEdit = (menu: MenuItemData) => {
    setSelectedMenu(menu);
    setIsEditModalOpen(true);
  };

  // --- LOGIKA SIMPAN EDIT STOK ---
  const handleSaveStock = async (newStock: number) => {
    if (!selectedMenu) return;

    try {
      setIsSavingEdit(true);

      const formData = new FormData();
      formData.append("name", selectedMenu.name);
      formData.append("stock", String(newStock));

      await menuAPI.updateMenu(selectedMenu.id, formData);

      if (refetch) refetch();

      setIsEditModalOpen(false);

      // Buka modal sukses besar (sesuai desain Figma)
      setSuccessMessage(`${selectedMenu.name} berhasil diperbarui`);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Terjadi kesalahan saat mengupdate stok.";
      triggerToast(`Gagal: ${errorMsg}`, "error");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const { firstName, roleName } = useProfile();

  return (
    <>
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0">
        <DashboardHeader
          title="Manajemen Menu & Stok"
          subtitle="Kelola daftar menu serta ketersediaan stok"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-6 lg:pb-6 px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white border border-gray-100 text-primary px-6 py-2 rounded-xs shadow-sm text-[13px]">
            Total Menu: {menus.length}
          </div>
        </div>

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

        <div className="rounded-sm shadow-sm mb-4">
          <KitchenMenuTable
            menus={currentMenus}
            isLoading={isLoading}
            isError={isError}
            onTriggerEdit={handleTriggerEdit}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <TablePagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* RENDER MODAL EDIT */}
      <EditStockModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveStock}
        menu={
          selectedMenu
            ? { name: selectedMenu.name, stock: selectedMenu.stock || 0 }
            : null
        }
        isLoading={isSavingEdit}
      />

      {/* RENDER MODAL SUCCESS (Besar di tengah) */}
      <SuccessActionModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Stok menu berhasil diedit!"
        message={successMessage}
      />

      {/* RENDER TOAST (Pojok kanan atas, hanya muncul kalau error/kebutuhan lain) */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
};

export default KitchenMenuStockPage;
