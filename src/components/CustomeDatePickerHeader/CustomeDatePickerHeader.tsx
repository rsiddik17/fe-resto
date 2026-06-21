import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CustomDatePickerHeaderProps {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
}

const CustomDatePickerHeader = ({
  date,
  changeYear,
  changeMonth,
}: CustomDatePickerHeaderProps) => {
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center justify-between gap-2 px-3 pb-2">
      {/* PILL BULAN */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => {
            setOpenMonth((p) => !p);
            setOpenYear(false);
          }}
          className="flex items-center gap-1 px-3.5 py-1.5 border border-gray-200 rounded-xs bg-white font-medium text-sm text-gray-800"
        >
          {MONTHS[date.getMonth()]}
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {openMonth && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-30 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xs shadow-lg z-9999">
            {MONTHS.map((m, i) => (
              <div
                key={m}
                onClick={() => {
                  changeMonth(i);
                  setOpenMonth(false);
                }}
                className={`px-3 py-2 text-sm text-center cursor-pointer hover:bg-blue-500 hover:text-white ${
                  i === date.getMonth()
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PILL TAHUN */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => {
            setOpenYear((p) => !p);
            setOpenMonth(false);
          }}
          className="flex items-center gap-1 px-3.5 py-1.5 border border-gray-200 rounded-xs bg-white font-medium text-sm text-gray-800"
        >
          {date.getFullYear()}
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {openYear && (
          <div className="absolute top-[calc(100%+6px)] right-0 w-25 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xs shadow-lg z-9999">
            {years.map((y) => (
              <div
                key={y}
                onClick={() => {
                  changeYear(y);
                  setOpenYear(false);
                }}
                className={`px-3 py-2 text-sm text-center cursor-pointer hover:bg-blue-500 hover:text-white ${
                  y === date.getFullYear()
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
              >
                {y}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDatePickerHeader;