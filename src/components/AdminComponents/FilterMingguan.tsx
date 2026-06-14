import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const LIST_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const LIST_TAHUN = ["2025", "2026"];

interface FilterMingguanProps {
  onFilterChange: (bulan: string, tahun: string) => void;
  defaultBulan?: string;
  defaultTahun?: string;
}

export default function FilterMingguan({ onFilterChange, defaultBulan, defaultTahun }: FilterMingguanProps) {
  // ✅ LANGSUNG PAKAI defaultBulan/defaultTahun dari props
  const [bulan, setBulan] = useState(defaultBulan || "Maret");
  const [tahun, setTahun] = useState(defaultTahun || "2026");
  const [isBulanOpen, setIsBulanOpen] = useState(false);
  const [isTahunOpen, setIsTahunOpen] = useState(false);

  // Update jika props berubah (misal parent ganti bulan)
  useEffect(() => {
    if (defaultBulan && defaultBulan !== bulan) setBulan(defaultBulan);
  }, [defaultBulan]);

  useEffect(() => {
    if (defaultTahun && defaultTahun !== tahun) setTahun(defaultTahun);
  }, [defaultTahun]);

  const handleBulanPilih = (b: string) => {
    setBulan(b);
    setIsBulanOpen(false);
    onFilterChange(b, tahun);
  };

  const handleTahunPilih = (t: string) => {
    setTahun(t);
    setIsTahunOpen(false);
    onFilterChange(bulan, t);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start overflow-visible">
      <div className="space-y-1 relative overflow-visible">
        <span className="text-[11.5px] text-gray-400 font-bold block">Bulan</span>
        <div className="relative">
          <button
            onClick={() => {
              setIsBulanOpen(!isBulanOpen);
              setIsTahunOpen(false);
            }}
            className="bg-white border border-gray-200 rounded-xs px-4 py-2 text-[13px] font-medium flex items-center gap-2 w-36 justify-between"
          >
            {bulan} <ChevronDown size={16} className={isBulanOpen ? "rotate-180" : ""} />
          </button>
          {isBulanOpen && (
            <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xs shadow-lg z-50 max-h-60 overflow-y-auto">
              {LIST_BULAN.map((b) => (
                <button
                  key={b}
                  onClick={() => handleBulanPilih(b)}
                  className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50"
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 relative overflow-visible">
        <span className="text-[11.5px] text-gray-400 font-bold block">Tahun</span>
        <div className="relative">
          <button
            onClick={() => {
              setIsTahunOpen(!isTahunOpen);
              setIsBulanOpen(false);
            }}
            className="bg-white border border-gray-200 rounded-xs px-4 py-2 text-[13px] font-medium flex items-center gap-2 w-28 justify-between"
          >
            {tahun} <ChevronDown size={16} className={isTahunOpen ? "rotate-180" : ""} />
          </button>
          {isTahunOpen && (
            <div className="absolute left-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-xs shadow-lg z-50">
              {LIST_TAHUN.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTahunPilih(t)}
                  className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}