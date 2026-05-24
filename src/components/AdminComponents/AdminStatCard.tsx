import { type LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const AdminStatCard = ({ title, value, icon: Icon }: AdminStatCardProps) => {
  return (
    <div className="relative h-32.5 w-full select-none">
      {/* Sisi Ungu Gelap di Tepi Kiri Card */}
      <div className="absolute inset-0 bg-primary w-40 rounded-l-[18px]" />

      {/* Konten Utama Card Putih */}
      <div className="absolute inset-y-0 left-4.5 right-0 bg-white rounded-2xl shadow-sm pl-6 pr-6 flex flex-col justify-center border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-black/50 font-semibold text-[14px] md:text-[15px]">
            {title}
          </h3>
          
          {/* FIX UTAMA: Menggunakan warna ungu muda solid pekat sesuai mockup Figma kelompokmu */}
          <div className="bg-[#B992C1] w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs">
            {/* Ikon di dalamnya menggunakan warna ungu tua solid (text-primary atau custom hex) */}
            <Icon className="w-5 h-5 text-[#501350]" strokeWidth={2.5} />
          </div>
        </div>
        <p className="text-black font-extrabold text-[28px] tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminStatCard;