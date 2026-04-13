// import { Search } from "lucide-react";
// import Input from "../ui/Input";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageBg: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
}

const HeroSectionOnline = ({
  title,
  subtitle,
  imageBg,
  
}: HeroSectionProps) => {
  return (
    <div className="w-full bg-cover bg-center rounded-md p-6 md:px-10 md:pb-15 mb-6 relative overflow-hidden">
      <img
        src={imageBg}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-1"
      />
      
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative ml-2 z-10 w-full max-w-md">
        {/* Menggunakan dangerouslySetInnerHTML agar tag <br/> di title bisa dirender jika ada */}
        <h1
          className="text-3xl md:text-4xl font-bold text-white mb-2 leading-14"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-white/90 text-sm md:text-xl mb-2">{subtitle}</p>


      </div>
    </div>
  );
};

export default HeroSectionOnline;
