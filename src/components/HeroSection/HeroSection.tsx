import { Search } from "lucide-react";
import Input from "../ui/Input";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageBg: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
}

const HeroSection = ({
  title,
  subtitle,
  imageBg,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Cari menu",
}: HeroSectionProps) => {
  return (
    <div className="w-full bg-cover bg-center rounded-md p-6 md:px-10 md:pb-3 mb-6 relative overflow-hidden">
      <img
        src={imageBg}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative ml-2 z-10 w-full max-w-md">
        {/* Menggunakan dangerouslySetInnerHTML agar tag <br/> di title bisa dirender jika ada */}
        <h1
          className="text-3xl md:text-4xl font-bold text-white mb-2 leading-14"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-white/90 text-sm md:text-xl mb-2">{subtitle}</p>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-97 pl-11 pr-4 py-2.5 rounded-xs border-none focus:ring-2 focus:ring-primary shadow-sm text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
