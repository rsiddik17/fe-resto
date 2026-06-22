import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DiscountItem } from "../Table/DiscountTable";
import { Calendar } from "lucide-react";
import { cn } from "../../utils/utils";

interface DiscountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "detail";
  discount?: DiscountItem | null;
  onSave?: (data: DiscountFormData) => void;
}

// 1. Skema Validasi Zod
const discountSchema = z.object({
  name: z.string().min(1, { message: "Nama diskon wajib diisi" }),
  code: z.string().min(1, { message: "Kode diskon wajib diisi" }),
  minPurchase: z.string().min(1, { message: "Min pembelian wajib diisi" }),
  discountAmount: z.string().min(1, { message: "Total diskon wajib diisi" }),
  startDate: z.string().min(1, { message: "Tgl mulai wajib diisi" }),
  endDate: z.string().min(1, { message: "Tgl berakhir wajib diisi" }),
});

export type DiscountFormData = z.infer<typeof discountSchema>;

// --- HELPER FORMAT RUPIAH SAAT MENGETIK ---
const formatCurrencyInput = (val: string) => {
  if (!val) return "";
  const numericVal = val.replace(/\D/g, ""); // Buang semua huruf/titik
  if (numericVal === "") return "";
  return new Intl.NumberFormat("id-ID").format(Number(numericVal));
};

// --- HELPER: "DD MMM" to "YYYY-MM-DD" ---
const parseIndonesianDateStringToISODate = (dateString: string) => {
  if (!dateString) return "";
  const cleanedDateStr = dateString.trim(); 
  const parts = cleanedDateStr.split(" "); // "30 Feb" -> ["30", "Feb"]
  if (parts.length !== 2) return "";

  const day = parts[0].padStart(2, "0");
  const monthMap: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
    Jul: "07", Ags: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
  };
  const month = monthMap[parts[1]] || "01";
  const year = new Date().getFullYear(); // Asumsi tahun saat ini

  return `${year}-${month}-${day}`;
};

const extractDatesFromRangeString = (rangeString: string) => {
  // Pecah string "30 Feb - 30 Ags"
  const dates = rangeString.split("-");
  if (dates.length !== 2) return { start: "", end: "" };

  return {
    start: parseIndonesianDateStringToISODate(dates[0]),
    end: parseIndonesianDateStringToISODate(dates[1]),
  };
};

const DiscountDetailModal = ({
  isOpen,
  onClose,
  mode,
  discount,
  onSave,
}: DiscountDetailModalProps) => {
  // 2. Setup React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    mode: "onSubmit",
  });

  const startDateVal = watch("startDate");
  const endDateVal = watch("endDate");

  // State khusus untuk input format Rupiah
  const [minPurchaseUI, setMinPurchaseUI] = useState("");
  const [discountAmountUI, setDiscountAmountUI] = useState("");

  // --- PERBAIKAN: useRef untuk memicu kalender ---
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  // Helper kecil buat ubah "2026-05-15" jadi "15/05/2026" (Sesuai desain mock-mu)
  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const isReadOnly = mode === "detail";
  const title =
    mode === "add" ? "Tambah Diskon" : mode === "edit" ? "Edit Diskon" : "Detail Diskon";
  const subtitle = "Kelola penawaran spesial untuk pelanggan Anda";

  // 3. Populate Data saat Edit/Detail
  useEffect(() => {
    if (isOpen) {
      setValue("name", discount?.name || "");
      setValue("code", discount?.code || "");
      // Populate untuk data UI (berformat titik)
      if (discount?.minPurchase) {
        const formattedMin = formatCurrencyInput(String(discount.minPurchase));
        setMinPurchaseUI(formattedMin);
        setValue("minPurchase", formattedMin);
      } else {
        setMinPurchaseUI("");
        setValue("minPurchase", "");
      }

      if (discount?.discount) {
        const formattedDisc = formatCurrencyInput(String(discount.discount));
        setDiscountAmountUI(formattedDisc);
        setValue("discountAmount", formattedDisc);
      } else {
        setDiscountAmountUI("");
        setValue("discountAmount", "");
      }
      
      // --- PERBAIKAN: Isi Tanggal berdasarkan hasil Extract data dummy ---
      if (mode !== "add" && discount?.date) {
        const { start, end } = extractDatesFromRangeString(discount.date);
        setValue("startDate", start); 
        setValue("endDate", end);
      } else {
        setValue("startDate", ""); 
        setValue("endDate", "");
      }
    } else {
      reset();
      setMinPurchaseUI("");
      setDiscountAmountUI("");
    }
  }, [isOpen, discount, setValue, reset, mode]);

  if (!isOpen) return null;

  // --- HANDLER FORMAT INPUT RUPIAH ---
  const handleMinPurchaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setMinPurchaseUI(formatted);
    setValue("minPurchase", formatted); // Update nilai aslinya di RHF
  };

  const handleDiscountAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setDiscountAmountUI(formatted);
    setValue("discountAmount", formatted); // Update nilai aslinya di RHF
  };

  const onSubmit = (data: DiscountFormData) => {
    if (onSave) {
      // --- PERBAIKAN: "Bersihkan" titik sebelum dikirim ke luar (ke BE) ---
      const cleanData: DiscountFormData = {
        ...data,
        minPurchase: data.minPurchase.replace(/\D/g, ""), // Hilangkan titik ("50.000" -> "50000")
        discountAmount: data.discountAmount.replace(/\D/g, ""),
      };
      
      onSave(cleanData);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl md:mt-12 rounded-sm shadow-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal (Background Ungu sesuai gambar) */}
        <div className="bg-primary px-6 pt-3 pb-5 text-white">
          <h2 className="text-lg font-bold mb-0.5">{title}</h2>
          <p className="text-[11.5px] text-white">{subtitle}</p>
        </div>

        {/* Body Modal (Form) */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-5 flex flex-col gap-5">
          
          {/* Baris 1: Nama & Kode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-20">
            <div>
              <label htmlFor="name" className="block text-[13px] uppercase text-black mb-1.5">
                NAMA DISKON
              </label>
              <input
                id="name"
                type="text"
                disabled={isReadOnly}
                {...register("name")}
                className={`w-full text-[14.5px] px-3.5 py-2.5 rounded-xs outline-none transition-colors border ${
                  isReadOnly ? "bg-[#DEDED9]/50 border-transparent cursor-not-allowed" : errors.name ? "bg-white border-red-500 focus:ring-1 focus:ring-red-500" : "bg-[#FFFFFF] border-[1.5px] border-primary focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                }`}
              />
              {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="code" className="block text-[13px] uppercase text-black mb-1.5">
                KODE DISKON
              </label>
              <input
                id="code"
                type="text"
                disabled={isReadOnly}
                {...register("code")}
                className={`w-full text-[14.5px] px-3.5 py-2.5 rounded-xs outline-none transition-colors border uppercase ${
                  isReadOnly ? "bg-[#DEDED9]/50 border-transparent cursor-not-allowed" : errors.code ? "bg-white border-red-500 focus:ring-1 focus:ring-red-500" : "bg-[#FFFFFF] border-[1.5px] border-primary focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                }`}
              />
              {errors.code && <p className="text-red-500 text-[11px] mt-1">{errors.code.message}</p>}
            </div>
          </div>

          {/* Baris 2: Minimal & Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-20">
            <div>
              <label htmlFor="minPurchase" className="block text-[13px] uppercase text-black mb-1.5">
                MINIMAL PEMBELIAN (RP.)
              </label>
              <input
                id="minPurchase"
                type="text"
                disabled={isReadOnly}
                value={minPurchaseUI}
                onChange={handleMinPurchaseChange}
                className={`w-full text-[14.5px] px-3.5 py-2.5 rounded-xs outline-none transition-colors border ${
                  isReadOnly ? "bg-[#DEDED9]/50 border-transparent cursor-not-allowed" : errors.minPurchase ? "bg-white border-red-500 focus:ring-1 focus:ring-red-500" : "bg-[#FFFFFF] border-[1.5px] border-primary focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                }`}
              />
              <input type="hidden" {...register("minPurchase")} />
              {errors.minPurchase && <p className="text-red-500 text-[11px] mt-1">{errors.minPurchase.message}</p>}
            </div>

            <div>
              <label htmlFor="discountAmount" className="block text-[13px] uppercase text-black mb-1.5">
                TOTAL DISKON (RP.)
              </label>
              <input
                id="discountAmount"
                type="text"
                disabled={isReadOnly}
                value={discountAmountUI}
                onChange={handleDiscountAmountChange}
                className={`w-full text-[14.5px] px-3.5 py-2.5 rounded-xs outline-none transition-colors border ${
                  isReadOnly ? "bg-[#DEDED9]/50 border-transparent cursor-not-allowed" : errors.discountAmount ? "bg-white border-red-500 focus:ring-1 focus:ring-red-500" : "bg-[#FFFFFF] border-[1.5px] border-primary focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                }`}
              />
              <input type="hidden" {...register("discountAmount")} />
              {errors.discountAmount && <p className="text-red-500 text-[11px] mt-1">{errors.discountAmount.message}</p>}
            </div>
          </div>

          {/* Baris 3: Masa Berlaku (Tanggal) */}
          <div>
            <label className="block text-[13px] uppercase text-black mb-1.5">
              MASA BERLAKU
            </label>
            <div className={`w-full flex items-center justify-between rounded-xs border px-4 py-2 transition-colors ${
               isReadOnly ? "bg-[#DEDED9]/50 border-transparent" : (errors.startDate || errors.endDate) ? "bg-white border-red-500" : "bg-[#FFFFFF] border-[1.5px] border-primary"
            }`}>
              <div className="flex flex-col flex-1 cursor-pointer" onClick={() => {
                  if (!isReadOnly && startDateRef.current) {
                    startDateRef.current.showPicker();
                  }
                }}>
                <span className="text-[11px] font-medium mb-1">Mulai</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" strokeWidth={2.5} /> {/* Icon Kiri */}
                  <span className={cn("text-[13px]", startDateVal ? "text-black" : "text-black/60 font-medium")}>
                    {startDateVal ? formatDateDisplay(startDateVal) : "Tanggal Mulai"}
                  </span>
                </div>
                <input 
                  type="date" 
                  disabled={isReadOnly}
                  {...register("startDate")}
                  className="sr-only"
                  ref={(e) => {
                    register("startDate").ref(e);
                    startDateRef.current = e;
                  }}
                />
              </div>
              <div className="flex flex-col flex-1 text-right items-end cursor-pointer" onClick={() => {
                  if (!isReadOnly && endDateRef.current) {
                    endDateRef.current.showPicker();
                  }
                }}>
                <span className="text-[11px] font-medium mb-1">Berakhir</span>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[13px]", endDateVal ? "text-black" : "text-black/60 font-medium")}>
                    {endDateVal ? formatDateDisplay(endDateVal) : "Tanggal Berakhir"}
                  </span>
                  <Calendar className="w-4 h-4 text-primary" strokeWidth={2.5} /> {/* Icon Kanan */}
                </div>
                <input 
                  type="date" 
                  disabled={isReadOnly}
                  className="sr-only"
                  {...register("endDate")}
                  ref={(e) => {
                    register("endDate").ref(e);
                    endDateRef.current = e;
                  }}
                />
              </div>
            </div>
            {(errors.startDate || errors.endDate) && <p className="text-red-500 text-[11px] mt-1">Lengkapi kedua tanggal masa berlaku</p>}
          </div>

          {/* Tombol Action (Batal / Simpan - Hilang kalau mode Detail) */}
          {!isReadOnly && (
            <div className="flex items-center justify-between md:justify-end gap-3 md:mt-12">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-2 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 font-bold text-[13.5px] rounded-sm transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-12 py-2 bg-primary border-[1.5px] border-primary text-white font-bold text-[13.5px] rounded-sm hover:bg-primary-hover transition-colors cursor-pointer"
              >
                Simpan
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DiscountDetailModal;