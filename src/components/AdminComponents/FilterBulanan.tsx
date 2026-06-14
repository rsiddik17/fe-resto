import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const LIST_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const getYearList = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear.toString(), (currentYear + 1).toString()];
};

interface FilterBulananProps {
  onFilterChange: (bulanTerpilih: string[], tahun: string) => void;
  defaultBulans?: string[];
  defaultTahun?: string;
}

export default function FilterBulanan({ 
  onFilterChange, 
  defaultBulans = [], 
  defaultTahun = new Date().getFullYear().toString() 
}: FilterBulananProps) {
  
  const [selectedBulans, setSelectedBulans] = useState<string[]>(defaultBulans);
  const [tahun, setTahun] = useState(defaultTahun);
  const [isBulanOpen, setIsBulanOpen] = useState(false);
  const [isTahunOpen, setIsTahunOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const LIST_TAHUN = getYearList();

  // Sinkronkan dengan props dari parent
  useEffect(() => {
    if (JSON.stringify(defaultBulans) !== JSON.stringify(selectedBulans)) {
      setSelectedBulans(defaultBulans);
    }
  }, [defaultBulans]);

  useEffect(() => {
    if (defaultTahun !== tahun) {
      setTahun(defaultTahun);
    }
  }, [defaultTahun]);

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBulanOpen(false);
        setIsTahunOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

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
    const newSelected = selectedBulans.length === 12 ? [] : [...LIST_BULAN];
    setSelectedBulans(newSelected);
    onFilterChange(newSelected, tahun);
  };

  const handleTahunPilih = (t: string) => {
    setTahun(t);
    setIsTahunOpen(false);
    onFilterChange(selectedBulans, t);
  };

  const getDisplayText = () => {
    if (selectedBulans.length === 0) return "Pilih Bulan";
    if (selectedBulans.length === 12) return "Semua Bulan";
    if (selectedBulans.length === 1) return selectedBulans[0];
    
    const sortedSelected = [...selectedBulans].sort((a, b) => LIST_BULAN.indexOf(a) - LIST_BULAN.indexOf(b));
    return `${sortedSelected[0]} - ${sortedSelected[sortedSelected.length - 1]}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start overflow-visible" ref={dropdownRef}>
      <div className="space-y-1 relative overflow-visible">
        <span className="text-[11.5px] text-gray-400 font-bold block">Pilih Bulan</span>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsBulanOpen(!isBulanOpen);
              setIsTahunOpen(false);
            }}
            className="bg-white border border-gray-200 rounded-xs px-4 py-2 text-[13px] font-medium flex items-center gap-2 w-48 justify-between text-gray-800"
          >
            {getDisplayText()}
            <ChevronDown size={16} className={isBulanOpen ? "rotate-180" : ""} />
          </button>
          
          {isBulanOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xs shadow-lg z-100 p-3">
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                {LIST_BULAN.map((bulan) => (
                  <label key={bulan} className="flex items-center justify-between text-[13px] cursor-pointer hover:bg-gray-50 p-1 rounded text-gray-800">
                    <span>{bulan}</span>
                    <input
                      type="checkbox"
                      checked={selectedBulans.includes(bulan)}
                      onChange={() => handleBulanToggle(bulan)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </label>
                ))}
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

      <div className="space-y-1 relative overflow-visible">
        <span className="text-[11.5px] text-gray-400 font-bold block">Pilih Tahun</span>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsTahunOpen(!isTahunOpen);
              setIsBulanOpen(false);
            }}
            className="bg-white border border-gray-200 rounded-xs px-4 py-2 text-[13px] font-medium flex items-center gap-2 w-28 justify-between text-gray-800"
          >
            {tahun} <ChevronDown size={16} className={isTahunOpen ? "rotate-180" : ""} />
          </button>
          {isTahunOpen && (
            <div className="absolute left-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-xs shadow-lg z-100">
              {LIST_TAHUN.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTahunPilih(t)}
                  className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 text-gray-800 font-semibold"
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