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
    <div className="w-full h-67.5 bg-cover bg-center rounded-md p-6 md:px-10 md:pb-3 mb-6 relative overflow-hidden">
      <img
        src={imageBg}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      <div className="absolute inset-0 bg-black/15"></div>

      <div className="relative ml-2 z-10 w-full max-w-lg">
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-2 leading-18 tracking-wide"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-white/95 text-sm md:text-[22px] mb-2.5">{subtitle}</p>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-500" size={20} />
          </div>

          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-105 pl-11 pr-4 py-2.5 rounded-xs border-none focus:ring-2 focus:ring-primary placeholder:text-gray-500 shadow-sm text-black"
          />
        </div>
        
      </div>
    </div>
  );
};

export default HeroSection;
