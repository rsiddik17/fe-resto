import { type LucideIcon } from "lucide-react";
import { type ComponentType, type SVGProps } from "react";

type CustomIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface StatCardCashierProps {
  title: string;
  value: string | React.ReactNode;
  Icon: LucideIcon | CustomIcon;
}

const StatCardCashier = ({
  title,
  value,
  Icon,
}: StatCardCashierProps) => {
  return (
    <div className="relative h-32.5 w-full">
      
      {/* Layer Ungu */}
      <div className="absolute inset-0 bg-primary max-w-30 rounded-l-[18px] rounded-r-[18px]" />

      {/* Card Putih */}
      <div className="absolute inset-y-0 left-4.5 right-0 bg-white rounded-2xl shadow-md pl-3 pr-2.5 flex flex-col justify-center gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-black/50 font-bold text-[14px] md:text-[15px]">
            {title}
          </h3>

          <div className="bg-primary/50 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            <Icon
              className="text-primary w-5 h-5"
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Value */}
        <div className="text-[26px] font-bold text-black mb-2">
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCardCashier;