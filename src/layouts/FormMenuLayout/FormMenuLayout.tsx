import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface MenuFormContainerProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
}

const FormMenuLayout = ({ title, onBack, children }: MenuFormContainerProps) => {
  return (
    // PERBAIKAN 1: Hapus h-full dan overflow-hidden agar kontainer memanjang alami ke bawah
    <div className="bg-white rounded-md shadow-sm border border-gray-100 pt-4.5 px-4.5 pb-25 flex flex-col">
      
      {/* Header Form (Tombol Kembali & Judul) */}
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <button 
          onClick={onBack}
          // PERBAIKAN 2: Hapus hover:bg-gray-100, ubah pewarnaan langsung di teks/ikonnya
          className="text-black hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} strokeWidth={2.5} className="hover:-translate-x-0.5 transition-transform" />
        </button>
        <h2 className="text-[17px] md:text-[18px] font-bold text-black">{title}</h2>
      </div>

      {/* Area Konten (Form/Detail) */}
      {/* PERBAIKAN 3: Hapus overflow-y-auto dan custom-scrollbar agar tidak ada scroll internal */}
      <div className="flex-1">
        {children}
      </div>
      
    </div>
  );
};

export default FormMenuLayout;