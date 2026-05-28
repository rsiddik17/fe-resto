import { useState, useEffect } from "react";
interface ChartData {
  label: string;
  value: number;
  displayValue?: string;
}

interface DashboardChartProps {
  title: string;
  data: ChartData[];
  barColorClass?: string;
  isRevenue?: boolean;
}

const DashboardChart = ({
  title,
  data,
  barColorClass = "bg-primary",
  isRevenue = false,
}: DashboardChartProps) => {
  const maxValue = 500;
  // Taruh di dalam komponen, setelah semua useState
  const [, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white rounded-xs p-3 md:p-5 px-3 md:px-6 shadow-sm border border-gray-100 flex-1 min-w-0 w-full">
      <h3 className="text-center font-bold text-gray-850 text-[13px] md:text-[14.5px] mb-4 md:mb-6 ">
        {title}
      </h3>

      {/* Area Utama Grafik */}
      <div className="flex h-48 gap-2 md:gap-5 items-end relative pb-6 pl-12 pr-2">
        {/* GARIS BANTU TITIK-TITIK (DOT BELAKANG DIAGRAM) */}
        <div className="absolute inset-0 left-12 bottom-6 pointer-events-none flex flex-col justify-between z-0">
          <div className="w-full border-b border-dotted border-gray-250"></div>
          <div className="w-full border-b border-dotted border-gray-250"></div>
          <div className="w-full border-b border-dotted border-gray-250"></div>
          <div className="w-full border-b border-dotted border-gray-250"></div>
          <div className="w-full border-b border-dotted border-gray-250"></div>
          <div className="w-full"></div> {/* Garis dasar kosong */}
        </div>

        {/* SUMBU Y - Sisi Kiri Abu-Abu */}
        <div className="absolute left-0 bottom-6 top-0 w-10 flex flex-col justify-between text-left text-[11px] text-black select-none leading-none z-10">
          <span>{isRevenue ? "Rp5 jt" : "500"}</span>
          <span>{isRevenue ? "Rp4 jt" : "400"}</span>
          <span>{isRevenue ? "Rp3 jt" : "300"}</span>
          <span>{isRevenue ? "Rp2 jt" : "200"}</span>
          <span>{isRevenue ? "Rp1 jt" : "100"}</span>
          <span className="-mb-0.75">0</span>
        </div>

        {/* MAP DATA BATANG DIAGRAM */}
        {data && data.length > 0 ? (
          data.map((item, idx) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative z-10"
              >
              
                {/* Tooltip Hover */}
                <div className="absolute -top-7 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-25 shadow-md">
                  {item.displayValue || item.value}
                </div>

                {/* Batang Flat UI */}
                <div
                  className={`w-full max-w-7 sm:max-w-8 rounded-t-[4px] transition-all duration-500 hover:opacity-95 ${barColorClass}`}
                  style={{ height: `${Math.min(100, percentage)}%` }}
                />

                {/* LABEL SUMBU X - SEKARANG HITAM PEKAT SESUAI PERMINTAAN */}
                <span className="absolute -bottom-6 text-[13px] text-black tracking-tight">
                  {item.label}
                </span>
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
            Tidak ada data grafik
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
