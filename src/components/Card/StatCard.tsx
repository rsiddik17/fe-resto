import { type LucideIcon } from "lucide-react";

import { type ComponentType, type SVGProps } from "react";
type CustomIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  Icon: LucideIcon | CustomIcon;
}

const StatCard = ({ title, value, Icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm flex overflow-hidden h-32.5">
      {/* Garis Aksen Kiri (Ungu) */}
      <div className="w-2.5 bg-primary shrink-0"></div>
      
      {/* Konten Kartu */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Baris Atas: Judul & Ikon */}
        <div className="flex justify-between items-start mt-1 mb-1">
          <h3 className="text-black/50 font-bold text-sm md:text-base">{title}</h3>
          <div className="bg-[#6C0D78]/50 w-8 h-8 p-1.5 rounded-full flex items-center justify-center shrink-0">
            {/* Ikon Lucide */}
            <Icon size={20} className="text-primary w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>

        {/* Baris Bawah: Angka/Nilai */}
        <div className="text-3xl font-bold mb-2">
          {value}
        </div>
        
      </div>
    </div>
  );
};

export default StatCard;