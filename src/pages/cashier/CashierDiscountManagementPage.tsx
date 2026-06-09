import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import DiscountTable, {
  type DiscountItem,
} from "../../components/Table/DiscountTable";
import DiscountDetailModal, {
  type DiscountFormData,
} from "../../components/Modal/DiscountDetailModal";
import DiscountActionConfirmModal from "../../components/Modal/DiscountActionConfirmModal";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";
import { useProfile } from "../../hooks/useProfile";
import { discountAPI } from "../../api/discount.api";

// --- HELPER: YYYY-MM-DD to DD MMM ---
// Mengubah "2026-05-15" menjadi "15 Mei"
const formatDateToIndonesian = (dateString: string) => {
  if (!dateString) return "";
  const cleanDate = dateString.split("T")[0]; // Tangani format ISO (cth: 2026-05-24T00:00:00.000Z)
  const [, monthStr, day] = cleanDate.split("-");
  const monthIndex = parseInt(monthStr, 10) - 1;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${parseInt(day, 10)} ${months[monthIndex]}`;
};

// Menggabungkan startDate dan endDate menjadi "5 Mei - 18 Mei" (Bukan s/d)
const formatDateRange = (start: string, end: string) => {
  return `${formatDateToIndonesian(start)} - ${formatDateToIndonesian(end)}`;
};

// HELPER: Menentukan status Aktif / Habis berdasarkan tanggal
const determineDiscountStatus = (endDateString: string) => {
  if (!endDateString) return "AKTIF";
  const cleanDate = endDateString.split("T")[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endParts = cleanDate.split("-");
  const endDate = new Date(
    Number(endParts[0]),
    Number(endParts[1]) - 1,
    Number(endParts[2]),
  );

  return endDate >= today ? "AKTIF" : "HABIS";
};

const CashierDiscountManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);

  // --- STATE MODAL DETAIL ---
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailModalMode, setDetailModalMode] = useState<
    "add" | "edit" | "detail"
  >("add");
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountItem | null>(
    null,
  );

  // --- STATE MODAL KONFIRMASI (TERPUSAT) ---
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    actionType: "save" | "delete";
    payload?: any;
  }>({ isOpen: false, actionType: "save" });

  // --- STATE LOADING ---
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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

  // --- 1. FETCH API DISKON ---
  const fetchDiscounts = async () => {
    try {
      setIsFetching(true);
      const response = await discountAPI.getAllDiscounts();

      if (response.data) {
        // Mapping data Backend ke format Tabel UI
        const formattedDiscounts: DiscountItem[] = response.data.map(
          (d: any) => ({
            id: d.id,
            name: d.discount_name,
            code: d.discount_code,
            minPurchase: Number(d.min_purches),
            discount: Number(d.value),
            date: formatDateRange(d.start_date, d.end_date),
            status: determineDiscountStatus(d.end_date), // Asumsikan status dari tanggal
          }),
        );

        setDiscounts(formattedDiscounts);
      }
    } catch (error) {
      console.error("Gagal menarik data diskon:", error);
      triggerToast("Gagal memuat daftar diskon", "error");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();

    const intervalId = setInterval(fetchDiscounts, 8000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Logika Filter Search
  const filteredDiscounts = useMemo(() => {
    return discounts.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, discounts]);

  // --- HANDLER MODAL DETAIL ---
  const handleOpenDetail = (id: number) => {
    const item = discounts.find((d) => d.id === id);
    if (item) {
      setSelectedDiscount(item);
      setDetailModalMode("detail");
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenEdit = (id: number) => {
    const item = discounts.find((d) => d.id === id);
    if (item) {
      setSelectedDiscount(item);
      setDetailModalMode("edit");
      setIsDetailModalOpen(true);
    }
  };

  // --- TRIGGER AKSI (Menuju Konfirmasi Dulu) ---
  const handleTriggerSave = async (data: DiscountFormData) => {
    if (detailModalMode === "add") {
      // JIKA ADD: Langsung tembak API tanpa lewat modal konfirmasi
      setLoadingMessage("Menambahkan diskon baru...");
      setIsLoading(true);

      try {
        await discountAPI.createDiscount({
          discount_code: data.code.toUpperCase(),
          discount_name: data.name,
          value: Number(data.discountAmount),
          min_purches: Number(data.minPurchase),
          start_date: data.startDate,
          end_date: data.endDate,
        });

        triggerToast(`Promo "${data.name}" berhasil ditambahkan!`, "success");
        setIsDetailModalOpen(false);
        fetchDiscounts(); // Refresh data
      } catch (error: any) {
        console.error("Gagal membuat diskon:", error);
        triggerToast(
          error.response?.data?.message || "Gagal membuat diskon",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // JIKA EDIT: Buka modal konfirmasi terlebih dahulu
      setConfirmConfig({ isOpen: true, actionType: "save", payload: data });
    }
  };

  const handleTriggerDelete = (id: number) => {
    const item = discounts.find((d) => d.id === id);
    if (item)
      setConfirmConfig({ isOpen: true, actionType: "delete", payload: item });
  };

  // --- EKSEKUSI FINAL ---
  const executeAction = async () => {
    setConfirmConfig({ ...confirmConfig, isOpen: false });

    // Set Loading Message
    if (confirmConfig.actionType === "delete") {
      setLoadingMessage("Menghapus promo diskon...");
    } else {
      setLoadingMessage("Menyimpan perubahan...");
    }

    setIsLoading(true);

    try {
      if (confirmConfig.actionType === "delete") {
        const itemToDelete = confirmConfig.payload as DiscountItem;
        await discountAPI.deleteDiscount(itemToDelete.id);

        triggerToast(
          `Promo "${itemToDelete.name}" berhasil dihapus!`,
          "success",
        );
      } else if (confirmConfig.actionType === "save" && selectedDiscount) {
        const formData = confirmConfig.payload as DiscountFormData;

        await discountAPI.updateDiscount(selectedDiscount.id, {
          discount_code: formData.code.toUpperCase(),
          discount_name: formData.name,
          value: Number(formData.discountAmount),
          min_purches: Number(formData.minPurchase),
          start_date: formData.startDate,
          end_date: formData.endDate,
        });

        triggerToast(
          `Perubahan promo "${formData.name}" berhasil disimpan!`,
          "success",
        );
        setIsDetailModalOpen(false);
      }

      fetchDiscounts(); // Refresh data
    } catch (error: any) {
      console.error("Gagal mengeksekusi aksi:", error);
      triggerToast(
        error.response?.data?.message || "Terjadi kesalahan",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { firstName, roleName } = useProfile();

  return (
    <>
      {/* 1. HEADER */}
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0 shrink-0">
        <DashboardHeader
          title="Promo Diskon"
          subtitle="Kelola semua promo dan diskon untuk pelanggan"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="pt-1 lg:pt-1 pb-6 lg:pb-6 px-4 lg:px-8 flex flex-col flex-1">
        {/* Search Bar & Tambah Diskon */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-3 shrink-0">
          <div className="relative w-full md:w-112.5">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black/50" />
            </div>
            <Input
              type="text"
              className="w-full pl-11 pr-4 py-2 text-[14px] rounded-sm border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-black/50 shadow-sm"
              placeholder="Cari Promo Diskon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Tombol Tambah Diskon */}
          <Button
            onClick={() => {
              setSelectedDiscount(null);
              setDetailModalMode("add");
              setIsDetailModalOpen(true);
            }}
            className="w-full flex gap-0.5 items-center justify-center md:w-auto bg-primary text-sm md:text-[13px] lg:text-[13px] text-white font-bold py-2 px-4.5 rounded-sm shadow-sm hover:bg-primary-hover"
          >
            <Plus size={15} strokeWidth={2.5} /> Tambah Diskon
          </Button>
        </div>

        {/* 3. TABLE CONTAINER */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-8 relative">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center h-64 text-primary absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20">
              <span className="text-sm font-bold">Memuat promo diskon...</span>
            </div>
          ) : (
            <DiscountTable
              discounts={filteredDiscounts}
              onDetail={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleTriggerDelete}
            />
          )}
        </div>
      </div>

      {/* MODAL FORM (Add/Edit/Detail) */}
      <DiscountDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        mode={detailModalMode}
        discount={selectedDiscount}
        onSave={handleTriggerSave}
      />

      {/* MODAL KONFIRMASI */}
      <DiscountActionConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={executeAction}
        actionType={confirmConfig.actionType}
        itemName={
          confirmConfig.actionType === "delete"
            ? confirmConfig.payload?.name
            : ""
        }
      />

      {/* LOADING */}
      <Loading show={isLoading} message={loadingMessage} />

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
};

export default CashierDiscountManagementPage;
