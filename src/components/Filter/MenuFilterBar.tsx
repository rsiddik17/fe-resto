import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Input from "../ui/Input";
import { cn } from "../../utils/utils";

// --- Sub-komponen Dropdown (Hanya dipakai di file ini) ---
interface CustomDropdownProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

const CustomDropdown = ({ label, options, value, onChange }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false); // State untuk mendeteksi apakah user sudah pernah memilih
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // PERBAIKAN LOGIC: 
  // Jika belum pernah dipilih (awal masuk) DAN nilainya "Semua" atau kosong, tampilkan label bawaan ("Status" / "Kategori").
  // Tapi kalau user sudah mengklik opsi, maka selalu tampilkan opsi yang dipilih tersebut.
  const activeLabel = (!isTouched && (value === "Semua" || value === ""))
    ? label
    : (options.find((o) => o.value === value)?.label || label);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-2 bg-white border border-gray-200 pl-5 pr-4 py-2.5 text-[13px] text-primary shadow-sm min-w-25 hover:border-primary transition-colors cursor-pointer",
          isOpen ? "rounded-t-sm rounded-b-none border-b-gray-100" : "rounded-sm"
        )}
      >
        {activeLabel}
        {isOpen ? <ChevronUp size={16} className="text-black" /> : <ChevronDown size={16} className="text-black" />}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-0 w-full bg-white rounded-b-sm shadow-lg border border-gray-200 border-t-0 z-20 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setIsTouched(true); // Tandai bahwa user sudah melakukan klik manual
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-[13px] transition-colors cursor-pointer border-b border-gray-100 last:border-b-0",
                value === opt.value ? "text-primary bg-primary/5" : "text-primary hover:text-primary hover:bg-gray-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Komponen Utama MenuFilterBar ---
interface MenuFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
}

const MenuFilterBar = ({
  searchQuery, onSearchChange,
  statusFilter, onStatusChange,
  categoryFilter, onCategoryChange
}: MenuFilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-5 w-full">
      {/* Search Bar - Kiri */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-gray-400" />
        </div>
        <Input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-sm border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 text-black shadow-sm"
          placeholder="Cari menu"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* Dropdowns - Kanan */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <CustomDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusChange}
          options={[
            { label: "Semua", value: "Semua" },
            { label: "Tersedia", value: "Tersedia" },
            { label: "Habis", value: "Habis" },
          ]}
        />
        <CustomDropdown
          label="Kategori"
          value={categoryFilter}
          onChange={onCategoryChange}
          options={[
            { label: "Makanan", value: "Makanan" },
            { label: "Minuman", value: "Minuman" },
          ]}
        />
      </div>
    </div>
  );
};

export default MenuFilterBar;