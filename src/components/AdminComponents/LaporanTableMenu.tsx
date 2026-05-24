import { useState } from "react"; 
import { FileText, FileSpreadsheet } from "lucide-react";
import TabelMenu from "./TabelMenu";
import { eksporKePDFMenu, eksporKeExcelMenu } from "../AdminComponents/ExportUtils"

interface Props {
  data: any[];
  periode: string;
  // onClose: () => void;
}

export default function LaporanTableMenu({ data, periode }: Props) {
  const [sortedData, setSortedData] = useState(data);
  return (
    <div className="space-y-4 overflow-visible">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h4 className="text-[17px] font-extrabold text-black tracking-tight">
            Laporan Menu 
          </h4>
          <p className="text-[12px] text-gray-400 font-medium">
            Periode: {periode}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* <button
            type="button"
            onClick={onClose}
            className="text-[12.5px] font-bold text-gray-400 hover:text-black cursor-pointer transition-colors pr-1"
          >
            Tutup
          </button> */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => eksporKePDFMenu(sortedData, periode)}
              className="bg-primary text-white font-bold text-[12.5px] px-5 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileText size={14} /> Ekspor PDF
            </button>
            <button
              onClick={() => eksporKeExcelMenu(sortedData, periode)}
              className="bg-primary text-white font-bold text-[12.5px] px-5 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileSpreadsheet size={14} /> Ekspor Excel
            </button>
          </div>
        </div>
      </div>

      {/* Tabel asli kamu - TIDAK BERUBAH */}
      <TabelMenu onSortChange={(newSortedData) => setSortedData(newSortedData)} />
    </div>
  );
}