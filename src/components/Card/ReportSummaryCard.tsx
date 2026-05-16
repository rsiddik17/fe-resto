import { type ReactNode } from "react";

interface ReportSummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

const ReportSummaryCard = ({ title, value, icon }: ReportSummaryCardProps) => {
  return (
    <div className="relative flex w-full">
      {/* Layer Ungu (Di belakang, rounded khusus kiri) */}
      <div className="absolute inset-y-0 left-0 w-12 bg-primary rounded-l-sm" />

      <div className="relative flex-1 ml-6 bg-white rounded-md shadow-sm h-35 flex items-center justify-between pl-4 pr-8">
        
        {/* Bagian Kiri: Teks */}
        <div className="pl-1">
          {/* PERBAIKAN: Ubah mb-4 menjadi mb-7 agar jarak Title dan Value makin jauh */}
          <p className="text-[15px] font-bold text-black/50 -translate-y-3">{title}</p>
          <h3 className="text-[28px] md:text-[32px] leading-none font-bold tracking-tight mt-3">
            {value}
          </h3>
        </div>

        {/* Bagian Kanan: Ikon */}
        <div className="w-14 h-14 md:w-15 md:h-15 rounded-full bg-primary/50 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>

      </div>
    </div>
  );
};

export default ReportSummaryCard;