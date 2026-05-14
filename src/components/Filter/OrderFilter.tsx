import { cn } from "../../utils/utils";

interface OrderFilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const OrderFilter = ({ label, isActive, onClick }: OrderFilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-1 py-2 w-40 rounded-sm text-[13px] md:text-sm transition-all duration-200 border-[1.5px] cursor-pointer",
        isActive
          ? "bg-primary border-primary text-white shadow-md"
          : "bg-transparent border-primary text-primary hover:bg-primary/5"
      )}
    >
      {label}
    </button>
  );
};

export default OrderFilter;