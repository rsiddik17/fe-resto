import { cn } from "../../utils/utils";
import InfoIcon from "../Icon/InfoIcon";

interface AlertInfoProps {
  title: string;
  description: string;
  className?: string;
}

const AlertInfo = ({ title, description, className }: AlertInfoProps) => {
  return (
    <div className={cn("bg-primary/12 border-2 border-primary rounded-md px-3 md:px-4 py-2 md:py-2.5 flex items-start gap-2 md:gap-3", className)}>
      {/* Ikon Info Bulat */}
      <div className="mt-0.5 w-5 h-5 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
        <InfoIcon className="text-white" />
      </div>
      
      {/* Teks Informasi */}
      <div className="flex flex-col gap-0.5 md:gap-3 text-primary">
        <h4 className="font-bold text-base md:text-2xl">{title}</h4>
        <p className="text-xs md:text-xl leading-relaxed opacity-90">{description}</p>
      </div>
    </div>
  );
};

export default AlertInfo;