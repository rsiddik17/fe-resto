import { ChevronDown, PackageOpen } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { cn } from "../../utils/utils";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { useEffect, useRef } from "react";

export interface MenuFormInputsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onCancel?: () => void;
  isDetailMode?: boolean;
}

const FormMenuInput = ({
  register,
  errors,
  onCancel,
  isDetailMode = false,
}: MenuFormInputsProps) => {

  // PERBAIKAN: Kotak form sekarang TETAP SAMA desainnya walaupun mode Detail
  // Semua styling background abu-abu dan placeholder disatukan di sini
  const inputClass = cn(
    "w-full text-[13.5px] rounded-sm outline-none py-2.5 px-4 border border-transparent placeholder:text-black/50",
    isDetailMode 
      ? "bg-[#D9D9D9]/60 cursor-default text-black" // Mode Detail: Warna sama, kursor mati, font agak tebal
      : "bg-[#FFFFFF]/50 border-[1.5px] border-primary focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary" // Mode Edit/Tambah: Bisa di-focus
  );

  // === FITUR AUTO RESIZE TEXTAREA ===
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Pisahkan ref dan onChange dari register bawaan RHF
  const { ref: rhfRef, onChange: rhfOnChange, ...restDesc } = register("description");

  // Fungsi untuk menyesuaikan tinggi
  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto"; // Reset dulu
    el.style.height = `${el.scrollHeight}px`; // Set sesuai tinggi konten
  };

  // Gunakan useEffect agar saat data API masuk (reset dipanggil parent), kotaknya otomatis melar
  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  });

  return (
    <div className="flex-1 flex flex-col gap-3 mt-7">
      
      {/* Nama Menu */}
      <div>
        <label htmlFor="menuName" className="block text-sm mb-1.5">Nama Menu</label>
        <Input 
          id="menuName"
          type="text" 
          placeholder={isDetailMode ? "-" : "Masukkan nama menu"}
          disabled={isDetailMode}
          className={cn(inputClass, errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500")}
          {...register("name")}
        />
        {errors.name && <span className="text-red-500 text-[12px] mt-1 block">{errors.name.message as string}</span>}
      </div>

      {/* Deskripsi Menu */}
      <div>
        <label htmlFor="menuDesc" className="block text-sm mb-1.5">Deskripsi Menu</label>
        <textarea 
          id="menuDesc"
          placeholder={isDetailMode ? "-" : "Masukkan deskripsi menu"}
          disabled={isDetailMode}
          className={cn(
            "resize-none overflow-hidden h-10.5", 
            inputClass, 
            errors.description && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
          {...restDesc}
          ref={(e) => {
            rhfRef(e); // Berikan ref ke React Hook Form
            textareaRef.current = e; // Berikan ref ke local state kita
          }}
          onChange={(e) => {
            adjustHeight(e.target); // Melar saat diketik user
            rhfOnChange(e); // Tetap jalankan fungsi bawaan RHF
          }}
        />
        {errors.description && <span className="text-red-500 text-[12px] mt-1 block">{errors.description.message as string}</span>}
      </div>

      {/* Kategori & Harga (Dibagi 2 kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 -translate-y-1">
        <div>
          <label htmlFor="menuCategory" className="block text-sm mb-1.5">Kategori</label>
          <div className="relative">
            <select 
              id="menuCategory"
              disabled={isDetailMode}
              className={cn(
                "w-full appearance-none pr-10", 
                inputClass,
                isDetailMode ? "text-black" : "text-black focus:text-black cursor-pointer",
                errors.category && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              {...register("category")}
            >
              <option value="" disabled hidden>Pilih kategori</option>
              <option value="FOOD">Makanan</option>
              <option value="DRINK">Minuman</option>
            </select>
            {/* Panah select dropdown tetap disembunyikan di mode Detail agar terlihat rapi */}
            {!isDetailMode && <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />}
          </div>
          {errors.category && <span className="text-red-500 text-[12px] mt-1 block">{errors.category.message as string}</span>}
        </div>

        <div>
          <label htmlFor="menuPrice" className="block text-sm mb-1.5">Harga</label>
          <Input 
            id="menuPrice"
            type="number" 
            placeholder={isDetailMode ? "-" : "Masukkan harga"}
            disabled={isDetailMode}
            className={cn(inputClass, errors.price && "border-red-500 focus:border-red-500 focus:ring-red-500")}
            {...register("price")}
          />
          {errors.price && <span className="text-red-500 text-[12px] mt-1 block">{errors.price.message as string}</span>}
        </div>
      </div>

      <hr className="border-[#DEDED9] mt-4" />

      {/* Stok */}
      <div className="mt-4">
        <label htmlFor="menuStock" className="flex items-center gap-2 mb-1.5 w-fit">
          <div className="bg-primary w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0">
            <PackageOpen size={16} strokeWidth={2.5} />
          </div>
          <span className="text-sm mt-0.5">Stok</span>
        </label>
        <Input 
          id="menuStock"
          type="number" 
          placeholder={isDetailMode ? "-" : "Masukkan stok"}
          disabled={isDetailMode}
          className={cn(inputClass, errors.stock && "border-red-500 focus:border-red-500 focus:ring-red-500")}
          {...register("stock")}
        />
        {errors.stock && <span className="text-red-500 text-[12px] mt-1 block">{errors.stock.message as string}</span>}
      </div>

      {/* Tombol Aksi */}
      {!isDetailMode && (
        <div className="flex items-center gap-4 mt-2 w-full">
          <Button 
            type="button" 
            onClick={onCancel}
            className="flex-1 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 font-bold py-2.5 rounded-sm text-sm md:text-sm lg:text-sm transition-colors"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            className="flex-1/5 bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-sm text-sm md:text-sm lg:text-sm shadow-sm transition-colors"
          >
            Simpan Menu
          </Button>
        </div>
      )}

    </div>
  );
};

export default FormMenuInput;