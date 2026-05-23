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
    <div className="w-full h-60 md:h-65 bg-cover bg-center rounded-md px-4 py-6 md:px-10 md:pb-3 mb-5 relative overflow-hidden">
      <img
        src={imageBg}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      <div className="absolute inset-0 bg-black/15"></div>

      <div className="relative ml-0 md:ml-2 mt-6 md:mt-0 lg:mt-10 z-10 w-full max-w-lg">
        <h1
          className="text-3xl md:text-5xl lg:text-4xl font-bold text-white mb-2 leading-10 md:leading-16 lg:leading-10 tracking-wide"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-white/95 text-sm md:text-[22px] lg:text-xl mb-6 md:mb-2.5">{subtitle}</p>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-500" size={20} />
          </div>

          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="md:w-105 lg:w-160 pl-11 pr-4 md:py-2.5 rounded-xs border focus:ring-2 focus:ring-primary placeholder:text-gray-500 shadow-sm text-black"
          />
        </div>
        
      </div>
    </div>
  );
};

export default HeroSection;
