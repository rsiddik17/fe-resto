import { type LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const AdminStatCard = ({ title, value, icon: Icon }: AdminStatCardProps) => {
  // Taruh di dalam komponen, setelah semua useState
  return (
    <div className="relative h-28 md:h-32.5 w-full select-none">
      {/* Sisi Ungu Gelap di Tepi Kiri Card */}
      <div className="absolute inset-0 bg-primary w-10 md:w-40 rounded-l-[18px]" />

      {/* Konten Utama Card Putih */}
      <div className="absolute inset-y-0 left-3 md:left-4.5 right-0 bg-white rounded-2xl shadow-sm pl-3 md:pl-6 pr-3 md:pr-6 flex flex-col justify-center border border-gray-100">
        <div className="flex justify-between items-center mb-1 md:mb-2">
          <h3 className="text-black/50 font-semibold text-[14px] md:text-[15px] pr-2">
            {title}
          </h3>

          {/* FIX UTAMA: Menggunakan warna ungu muda solid pekat sesuai mockup Figma kelompokmu */}
          <div className="bg-[#B992C1] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs">
            {/* Ikon di dalamnya menggunakan warna ungu tua solid (text-primary atau custom hex) */}
            <Icon
              className="w-4 h-4 md:w-5 md:h-5 text-[#501350]"
              strokeWidth={2.5}
            />
          </div>
        </div>
        <p className="text-black font-extrabold text-[20px] md:text-[28px] tracking-tight ">
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminStatCard;
