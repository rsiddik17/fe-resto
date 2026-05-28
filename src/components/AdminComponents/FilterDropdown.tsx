import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  selectedOption: string;
  options: string[];
  onSelect: (option: string) => void;
  className?: string;
}

const FilterDropdown = ({ label, selectedOption, options, onSelect,  }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-xs border border-gray-200 px-4 py-1.5 shadow-md flex items-center gap-2 text-[13px] text-primary font-bold cursor-pointer hover:bg-gray-50/50"
      >
        {isOpen ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-primary" />}
        {/* PERUBAHAN DI SINI */}
        {selectedOption ? `${label}: ${selectedOption}` : label}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 bg-white border border-gray-150 rounded-xs shadow-lg py-1 z-50">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 cursor-pointer ${
                selectedOption === option 
                  ? "text-primary bg-purple-50/40" 
                  : "text-gray-700 font-medium"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;