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
  const [, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xs p-3 md:p-5 px-3 md:px-6 shadow-sm border border-gray-100 flex-1 min-w-0 w-full">
        <h3 className="text-center font-bold text-gray-850 text-[13px] md:text-[14.5px] mb-4 md:mb-6">
          {title}
        </h3>
        <div className="flex h-48 items-center justify-center text-gray-400 text-sm">
          Tidak ada data
        </div>
      </div>
    );
  }

  // Cari nilai maksimum dari data
  const maxValue = Math.max(...data.map(item => item.value));
  const safeMaxValue = maxValue === 0 ? 1 : maxValue;

  // Format angka
  const formatRupiah = (num: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Buat skala Y (6 titik: 0, 20%, 40%, 60%, 80%, 100%)
  const getYScales = (max: number) => {
    const scales = [];
    for (let i = 5; i >= 0; i--) {
      const value = (max * i) / 5;
      scales.push(Math.round(value));
    }
    return scales;
  };

  const yScales = getYScales(safeMaxValue);

  return (
  <div className="bg-white rounded-xs p-3 md:p-5 px-3 md:px-6 shadow-sm border border-gray-100 flex-1 min-w-0 w-full">
    <h3 className="text-center font-bold text-gray-850 text-[13px] md:text-[14.5px] mb-4 md:mb-6">
      {title}
    </h3>

    {/* Container grafik - PERBAIKAN: kurangi space kiri */}
    <div className="relative h-56 pb-8">
      
      {/* Garis bantu */}
      <div className="absolute inset-0 left-16 right-0 top-0 bottom-8 pointer-events-none">
        <div className="flex flex-col justify-between h-full">
          {yScales.map((_, idx) => (
            <div key={idx} className="border-b border-dotted border-gray-300 w-full"></div>
          ))}
        </div>
      </div>

      {/* Sumbu Y - lebih ramping */}
      <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-right text-[10px] md:text-[11px] text-black pr-2">
        {yScales.map((scale, idx) => (
          <span key={idx} className="leading-none">
            {isRevenue ? formatRupiah(scale) : formatNumber(scale)}
          </span>
        ))}
      </div>

      {/* Area batang - mulai dari left-16 */}
      <div className="absolute left-16 right-0 top-0 bottom-8">
        <div className="flex items-end justify-around h-full gap-1 md:gap-2">
          {data.map((item, idx) => {
            let percentage = (item.value / safeMaxValue) * 100;
            percentage = Math.min(100, Math.max(0, percentage));
            const barHeight = percentage === 0 ? '2px' : `${percentage}%`;
            
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end group relative h-full"
              >
                <div className="absolute -top-7 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-25 shadow-md pointer-events-none">
                  {item.displayValue || (isRevenue ? formatRupiah(item.value) : formatNumber(item.value))}
                </div>

                <div
                  className={`w-full max-w-8 rounded-t-[4px] transition-all duration-500 hover:opacity-90 ${barColorClass}`}
                  style={{ height: barHeight, minHeight: '2px' }}
                />

                <span className="absolute -bottom-6 text-[12px] md:text-[13px] text-black text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};

export default DashboardChart;