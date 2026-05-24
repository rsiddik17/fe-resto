import { useState } from "react";
import { ChevronDown } from "lucide-react";

const LIST_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const LIST_TAHUN = ["2025", "2026"];

interface FilterBulananProps {
  onFilterChange: (bulanTerpilih: string[], tahun: string) => void;
}

export default function FilterBulanan({ onFilterChange }: FilterBulananProps) {
  const [selectedBulans, setSelectedBulans] = useState<string[]>(["Januari", "Februari", "Maret"]);
  const [tahun, setTahun] = useState("2026");
  const [isBulanOpen, setIsBulanOpen] = useState(false);
  const [isTahunOpen, setIsTahunOpen] = useState(false);

  const handleBulanToggle = (bulan: string) => {
    let newSelected;
    if (selectedBulans.includes(bulan)) {
      newSelected = selectedBulans.filter(b => b !== bulan);
    } else {
      newSelected = [...selectedBulans, bulan];
    }
    setSelectedBulans(newSelected);
    onFilterChange(newSelected, tahun);
  };

  const handlePilihSemuaToggle = () => {
    if (selectedBulans.length === 12) {
      setSelectedBulans([]);
      onFilterChange([], tahun);
    } else {
      setSelectedBulans([...LIST_BULAN]);
      onFilterChange([...LIST_BULAN], tahun);
    }
  };

  const handleTahunPilih = (t: string) => {
    setTahun(t);
    setIsTahunOpen(false);
    onFilterChange(selectedBulans, t);
  };

  // Format tampilan bulan yang dipilih
  const getDisplayText = () => {
    if (selectedBulans.length === 0) return "Pilih Bulan";
    if (selectedBulans.length === 12) return "Semua Bulan";
    if (selectedBulans.length === 1) return selectedBulans[0];
    return `${selectedBulans[0]} - ${selectedBulans[selectedBulans.length - 1]}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start overflow-visible">
      {/* Pilih Bulan */}
      <div className="space-y-1 relative overflow-visible">
        <span className="text-[11.5px] text-gray-400 font-bold block">Pilih Bulan</span>
        <div className="relative">
          <button
            onClick={() => {
              setIsBulanOpen(!isBulanOpen);
              setIsTahunOpen(false);
            }}
            className="bg-white border border-gray-200 rounded-xs px-4 py-2 text-[13px] font-medium flex items-center gap-2 w-48 justify-between"
          >
            {getDisplayText()}
            <ChevronDown size={16} className={isBulanOpen ? "rotate-180" : ""} />
          </button>
          
          {isBulanOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xs shadow-lg z-[100] p-3">
              {/* Daftar bulan + Pilih Semua - LANGSUNG NYATU, TANPA GARIS */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {LIST_BULAN.map((bulan) => (
                  <label key={bulan} className="flex items-center justify-between text-[13px] cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <span>{bulan}</span>
                    <input
                      type="checkbox"
                      checked={selectedBulans.includes(bulan)}
                      onChange={() => handleBulanToggle(bulan)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </label>
                ))}
                {/* Pilih Semua LANGSUNG DI BAWAH DESEMBER, TANPA GARIS */}
                <label className="flex items-center justify-between text-[13px] font-bold text-primary cursor-pointer hover:bg-purple-50 p-1 rounded mt-1">
                  <span>Pilih Semua</span>
                  <input
                    type="checkbox"
                    checked={selectedBulans.length === 12}
                    onChange={handlePilihSemuaToggle}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pilih Tahun */}
      <div className="space-y-1 relative overflow-visible">
        <span className="text-[11.5px] text-gray-400 font-bold block">Pilih Tahun</span>
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
            <div className="absolute left-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-xs shadow-lg z-100">
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