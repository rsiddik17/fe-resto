import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import TableIcon from "../Icon/TableIcon";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TableData } from "../../api/table.api";

// 2. Buat Schema Zod untuk validasi
const tableSchema = z.object({
  table_number: z.string().min(1, { message: "Nomor meja wajib diisi" }),
  capacity: z
    .string()
    .min(1, { message: "Kapasitas meja wajib diisi" })
    .refine((val) => Number(val) > 0, {
      message: "Kapasitas harus lebih dari 0",
    }),
});

// Otomatis bikin tipe data dari schema Zod
type TableFormData = z.infer<typeof tableSchema>;

interface TableDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "detail";
  table?: TableData | null;
  onSave?: (data: { table_number: string; capacity: number }) => void;
}

const TableDetailModal = ({
  isOpen,
  onClose,
  mode,
  table,
  onSave,
}: TableDetailModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    mode: "onSubmit", // Error cuma muncul pas tombol simpan diklik
  });

  // Populate data kalau modenya edit / detail
  useEffect(() => {
    if (isOpen) {
      let displayTableNumber = table?.table_number || "";

      if (mode === "detail" && displayTableNumber) {
        const numOnly = displayTableNumber.replace(/\D/g, ""); // Ambil angkanya saja
        if (numOnly) {
          displayTableNumber = `Meja ${numOnly}`;
        }
      }

      setValue("table_number", displayTableNumber);
      setValue("capacity", table?.capacity ? String(table.capacity) : "");
    } else {
      reset(); // Bersihkan form saat modal ditutup
    }
  }, [isOpen, table, mode, setValue, reset]);

  if (!isOpen) return null;

  const isReadOnly = mode === "detail";
  const title =
    mode === "add"
      ? "Tambah Meja"
      : mode === "edit"
        ? "Edit Meja"
        : "Detail Meja";

  // Fungsi yang dipanggil saat form valid dan disubmit
  const onSubmit = (data: TableFormData) => {
    if (onSave) {
      onSave({
        table_number: data.table_number,
        capacity: Number(data.capacity),
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/3 backdrop-blur-[3px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Container Putih Modal */}
      <div
        className="bg-white w-full max-w-231 md:h-135 md:ml-auto md:mr-8 mt-25 rounded-md shadow-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center gap-2 mb-6 md:mb-8 shrink-0">
          <button
            onClick={onClose}
            className="text-black hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft
              className="w-4.5 h-4.5 hover:-translate-x-0.5 transition-transform"
              strokeWidth={3}
            />
          </button>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Layout Kiri-Kanan */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-6 flex-1"
        >
          {/* KIRI: Ilustrasi Meja Ungu (Persis desain) */}
          <div className="w-full md:w-80 h-55 md:h-75 bg-primary/25 rounded-md flex items-center justify-center shrink-0">
            <div className="w-28 h-28 bg-primary/25 rounded-full flex items-center justify-center">
              <TableIcon className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* KANAN: Form Input */}
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <label
                htmlFor="table_number"
                className="block text-[14.5px] mb-1.5"
              >
                Nomor Meja
              </label>
              <input
                id="table_number"
                type="text"
                disabled={isReadOnly}
                {...register("table_number")}
                placeholder="Masukkan nomor meja"
                className={`w-full text-[14.5px] px-3 py-2.75 rounded-sm border outline-none transition-colors ${
                  isReadOnly
                    ? "bg-[#EFEEEE]/70 border-transparent cursor-not-allowed text-black/80"
                    : "bg-[#FFFFFF] border-[1.5px] border-primary focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                }`}
              />
              {/* Teks Error Zod */}
              {errors.table_number && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.table_number.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="capacity" className="block text-[14.5px] mb-1.5">
                Kapasitas Meja
              </label>
              <input
                id="capacity"
                type="number"
                disabled={isReadOnly}
                {...register("capacity")}
                placeholder="Masukkan kapasitas meja"
                className={`w-full text-[14.5px] px-3 py-2.75 rounded-sm border outline-none transition-colors ${
                  isReadOnly
                    ? "bg-[#EFEEEE]/70 border-transparent cursor-not-allowed text-black/80"
                    : "bg-[#FFFFFF] border-[1.5px] border-primary focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                }`}
              />
              {/* Teks Error Zod */}
              {errors.capacity && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            {/* Tombol Action (Hanya muncul jika Add / Edit) */}
            {!isReadOnly && (
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-[0.8] bg-primary/25 text-primary font-bold text-sm py-3 rounded-sm hover:bg-primary/30 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-bold text-sm py-3 rounded-sm hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Simpan Meja
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableDetailModal;
