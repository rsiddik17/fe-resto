import { LayoutGrid, UtensilsCrossed, Martini } from "lucide-react";
import { cn } from "../../utils/utils";
import Button from "../ui/Button";

type CategoryType = "semua" | "makanan" | "minuman";

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  
  // Fungsi helper untuk style
  const getBtnStyle = (category: CategoryType) => 
    cn("flex flex-col items-center p-2 justify-center w-26 h-18 rounded-md transition-colors shrink-0", 
        activeCategory === category ? "bg-[#A779C2] text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300");

  return (
    <div className="flex items-center gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        onClick={() => onCategoryChange("semua")}
        className={getBtnStyle("semua")}
      >
        <LayoutGrid size={32} />
        <span className="text-sm font-semibold mt-1">Semua</span>
      </Button>
      
      <Button
        onClick={() => onCategoryChange("makanan")}
        className={getBtnStyle("makanan")}
      >
        <UtensilsCrossed size={32} />
        <span className="text-sm font-semibold mt-1">Makanan</span>
      </Button>
      
      <Button
        onClick={() => onCategoryChange("minuman")}
        className={getBtnStyle("minuman")}
      >
        <Martini size={32} />
        <span className="text-sm font-semibold mt-1">Minuman</span>
      </Button>
    </div>
  );
};

export default CategoryTabs;