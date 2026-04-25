import { cn } from "../../utils/utils";
import Button from "../ui/Button";
import AllMenuIcon from "../Icon/AllMenuIcon";
import FoodIcon from "../Icon/FoodIcon";
import DrinkIcon from "../Icon/DrinkIcon";

type CategoryType = "semua" | "makanan" | "minuman";

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  
  // Fungsi helper untuk style
  const getBtnStyle = (category: CategoryType) => 
    cn("flex flex-col items-center p-2 justify-center w-21 h-17 md:w-25 md:h-17 rounded-md transition-colors shrink-0", 
        activeCategory === category ? "bg-primary/50 text-primary" : "bg-gray/25 text-white hover:bg-gray-400");

  return (
    <div className="flex items-center gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        onClick={() => onCategoryChange("semua")}
        className={getBtnStyle("semua")}
      >
        <AllMenuIcon className="w-7.25 h-7.25 shrink-0" />
        <span className="text-sm md:text-lg font-semibold">Semua</span>
      </Button>
      
      <Button
        onClick={() => onCategoryChange("makanan")}
        className={getBtnStyle("makanan")}
      >
        <FoodIcon className="w-7.25 h-7.25 shrink-0" />
        <span className="text-sm md:text-lg font-semibold">Makanan</span>
      </Button>
      
      <Button
        onClick={() => onCategoryChange("minuman")}
        className={getBtnStyle("minuman")}
      >
        <DrinkIcon className="w-7.25 h-7.25 shrink-0" />
        <span className="text-sm md:text-lg font-semibold">Minuman</span>
      </Button>
    </div>
  );
};

export default CategoryTabs;