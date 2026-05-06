import { cn } from "../../utils/utils";
import Button from "../ui/Button";
import AllMenuIcon from "../Icon/AllMenuIcon";
import FoodIcon from "../Icon/FoodIcon";
import DrinkIcon from "../Icon/DrinkIcon";

type CategoryType = "semua" | "makanan" | "minuman";

interface CategoryFilterTabsProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const CategoryFilterTabs = ({ activeCategory, onCategoryChange }: CategoryFilterTabsProps) => {
  
  // Fungsi helper untuk style
  const getBtnStyle = (category: CategoryType) => 
    cn("flex flex-col items-center p-2 justify-center w-19 h-15 md:w-23 md:h-16 lg:w-22 lg:h-15 rounded-md lg:rounded-sm transition-colors shrink-0", 
        activeCategory === category ? "bg-primary/50 text-primary hover:text-white" : "bg-gray/25 text-white hover:bg-gray-400");


  return (
    <div className="flex items-center gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        onClick={() => onCategoryChange("semua")}
        className={getBtnStyle("semua")}
      >
        <AllMenuIcon className="w-6 h-6 shrink-0" />
        <span className="text-sm md:text-base font-normal">Semua</span>
      </Button>
      
      <Button
        onClick={() => onCategoryChange("makanan")}
        className={getBtnStyle("makanan")}
      >
        <FoodIcon className="w-6 h-6 shrink-0" />
        <span className="text-sm md:text-base font-normal">Makanan</span>
      </Button>
      
      <Button
        onClick={() => onCategoryChange("minuman")}
        className={getBtnStyle("minuman")}
      >
        <DrinkIcon className="w-6 h-6 shrink-0" />
        <span className="text-sm md:text-base font-normal">Minuman</span>
      </Button>
    </div>
  );
};

export default CategoryFilterTabs;