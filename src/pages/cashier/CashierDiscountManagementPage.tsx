import { useState, useMemo } from "react";
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

// --- MOCK DATA DISKON ---
const MOCK_DISCOUNTS: DiscountItem[] = [
  {
    id: 1,
    name: "Diskon Pelajar",
    code: "PJR35",
    minPurchase: 35000,
    discount: 7000,
    date: "30 Feb - 30 Ags",
    status: "AKTIF",
  },
  {
    id: 2,
    name: "Diskon Akhir Pekan",
    code: "PKN160",
    minPurchase: 160000,
    discount: 35000,
    date: "25 Jan - 10 Okt",
    status: "AKTIF",
  },
  {
    id: 3,
    name: "Diskon Makan Siang",
    code: "MKS60",
    minPurchase: 65000,
    discount: 15000,
    date: "5 Apr - 5 Jun",
    status: "AKTIF",
  },
  {
    id: 4,
    name: "Diskon Ramadhan",
    code: "RMDN95",
    minPurchase: 95000,
    discount: 30000,
    date: "19 Feb - 25 Mar",
    status: "HABIS",
  },
  {
    id: 5,
    name: "Diskon Keluarga",
    code: "KLG350",
    minPurchase: 350000,
    discount: 50000,
    date: "25 Apr - 14 Nov",
    status: "AKTIF",
  },
  {
    id: 6,
    name: "Diskon Hari Senin",
    code: "SEN150",
    minPurchase: 150000,
    discount: 40000,
    date: "4 Feb - 30 Mei",
    status: "AKTIF",
  },
  {
    id: 7,
    name: "Diskon Member",
    code: "MBR170",
    minPurchase: 170000,
    discount: 45000,
    date: "1 Apr - 15 Apr",
    status: "HABIS",
  },
];

// --- HELPER: YYYY-MM-DD to DD MMM ---
// Mengubah "2026-05-15" menjadi "15 Mei"
const formatDateToIndonesian = (dateString: string) => {
  if (!dateString) return "";
  // Trik split string untuk mencegah pergeseran timezone Date JS
  const [, monthStr, day] = dateString.split("-");
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
  // Hapus angka 0 di depan hari (misal "05" jadi "5")
  return `${parseInt(day, 10)} ${months[monthIndex]}`;
};

// Menggabungkan startDate dan endDate menjadi "5 Mei - 18 Mei" (Bukan s/d)
const formatDateRange = (start: string, end: string) => {
  return `${formatDateToIndonesian(start)} - ${formatDateToIndonesian(end)}`;
};

// HELPER: Menentukan status Aktif / Habis berdasarkan tanggal
const determineDiscountStatus = (endDateString: string) => {
  if (!endDateString) return "AKTIF";
  const today = new Date();
  // Hilangkan jam/menit/detik untuk perbandingan adil
  today.setHours(0, 0, 0, 0);

  // Karena input dari form adalah YYYY-MM-DD, kita pakai itu
  const endParts = endDateString.split("-");
  const endDate = new Date(
    Number(endParts[0]),
    Number(endParts[1]) - 1,
    Number(endParts[2]),
  );

  return endDate >= today ? "AKTIF" : "HABIS";
};

const CashierDiscountManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [discounts, setDiscounts] = useState<DiscountItem[]>(MOCK_DISCOUNTS);

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
  const [loadingMessage, setLoadingMessage] = useState("");

  // --- STATE TOAST ---
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

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
  const handleTriggerSave = (data: DiscountFormData) => {
    setConfirmConfig({ isOpen: true, actionType: "save", payload: data });
  };

  const handleTriggerDelete = (id: number) => {
    const item = discounts.find((d) => d.id === id);
    if (item)
      setConfirmConfig({ isOpen: true, actionType: "delete", payload: item });
  };

  // --- EKSEKUSI FINAL ---
  const executeAction = () => {
    setConfirmConfig({ ...confirmConfig, isOpen: false });

    // Set Loading Message
    if (confirmConfig.actionType === "delete") {
      setLoadingMessage("Menghapus promo diskon...");
    } else {
      setLoadingMessage(
        detailModalMode === "add"
          ? "Menambahkan diskon baru..."
          : "Menyimpan perubahan...",
      );
    }

    setIsLoading(true);

    setTimeout(() => {
      if (confirmConfig.actionType === "delete") {
        const itemToDelete = confirmConfig.payload as DiscountItem;
        setDiscounts(discounts.filter((d) => d.id !== itemToDelete.id));

        triggerToast(`Promo "${itemToDelete.name}" berhasil dihapus!`, "success");
      } else if (confirmConfig.actionType === "save") {
        const formData = confirmConfig.payload as DiscountFormData;

        // --- PERBAIKAN: Format ke "DD MMM - DD MMM" ---
        const formattedDate = formatDateRange(
          formData.startDate,
          formData.endDate,
        );
        // --- PERBAIKAN: Tentukan status dinamis ---
        const computedStatus = determineDiscountStatus(formData.endDate);

        if (detailModalMode === "add") {
          const newDiscount: DiscountItem = {
            id: Date.now(),
            name: formData.name,
            code: formData.code.toUpperCase(),
            minPurchase: Number(formData.minPurchase),
            discount: Number(formData.discountAmount),
            date: formattedDate,
            status: computedStatus,
          };
          setDiscounts([...discounts, newDiscount]);

          triggerToast(`Promo "${formData.name}" berhasil ditambahkan!`, "success");
        } else if (detailModalMode === "edit" && selectedDiscount) {
          setDiscounts((prev) =>
            prev.map((d) =>
              d.id === selectedDiscount.id
                ? {
                    ...d,
                    name: formData.name,
                    code: formData.code.toUpperCase(),
                    minPurchase: Number(formData.minPurchase),
                    discount: Number(formData.discountAmount),
                    date: formattedDate,
                    status: computedStatus,
                  }
                : d,
            ),
          );
          triggerToast(`Perubahan promo "${formData.name}" berhasil disimpan!`, "success");
        }
        setIsDetailModalOpen(false); // Tutup form
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* 1. HEADER */}
      <div className="pt-7.5 pl-8 pr-6 shrink-0">
        <DashboardHeader
          title="Promo Diskon"
          subtitle="Kelola semua promo dan diskon untuk pelanggan"
          userName="Rina"
          roleName="Kasir"
        />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="pt-0 pb-6 px-8 flex flex-col flex-1">
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
            className="w-full flex gap-0.5 items-center justify-center md:w-auto bg-primary text-sm text-white font-bold py-2 px-4.5 rounded-sm shadow-sm hover:bg-primary-hover"
          >
            <Plus size={15} strokeWidth={2.5} /> Tambah Diskon
          </Button>
        </div>

        {/* 3. TABLE CONTAINER */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-8">
          <DiscountTable
            discounts={filteredDiscounts}
            onDetail={handleOpenDetail}
            onEdit={handleOpenEdit}
            onDelete={handleTriggerDelete}
          />
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