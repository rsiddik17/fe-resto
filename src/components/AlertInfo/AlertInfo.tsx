import { Info } from "lucide-react";
import { cn } from "../../utils/utils";

interface AlertInfoProps {
  title: string;
  description: string;
  className?: string;
}

const AlertInfo = ({ title, description, className }: AlertInfoProps) => {
  return (
    <div className={cn("bg-primary/12 border-2 border-primary rounded-md px-4 py-2.5 flex items-start gap-3", className)}>
      {/* Ikon Info Bulat */}
      <div className="mt-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
        <Info size={14} className="text-white" strokeWidth={3} />
      </div>
      
      {/* Teks Informasi */}
      <div className="flex flex-col gap-1 text-primary">
        <h4 className="font-extrabold text-sm">{title}</h4>
        <p className="text-xs leading-relaxed opacity-90">{description}</p>
      </div>
    </div>
  );
};

export default AlertInfo;