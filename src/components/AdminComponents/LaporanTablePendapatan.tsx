import { useState } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import TabelPendapatan from "./TabelPendapatan";
import {
  eksporKePDFPendapatan,
  eksporKeExcelPendapatan,
} from "../AdminComponents/ExportUtils";

interface Props {
  data: any[];
  periode: string;
  // onClose: () => void;
  enablePagination?: boolean; // 🆕
  itemsPerPage?: number; // 🆕
}

export default function LaporanTablePendapatan({
  data,
  periode,
  // onClose,
  enablePagination = false,
  itemsPerPage = 10,
}: Props) {
  const [sortedData, setSortedData] = useState(data); 
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h4 className="text-[17px] font-extrabold text-black tracking-tight">
            Laporan Total Pendapatan
          </h4>
          <p className="text-[12px] text-gray-400 font-medium">
            Periode: {periode}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* <button onClick={onClose} className="text-[12.5px] font-bold text-gray-400 hover:text-black">
            Tutup
          </button> */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => eksporKePDFPendapatan(sortedData, periode)}
              className="bg-primary text-white font-bold text-[12.5px] px-5 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileText size={14} /> Ekspor PDF
            </button>
            <button
              onClick={() => eksporKeExcelPendapatan(sortedData, periode)}
              className="bg-primary text-white font-bold text-[12.5px] px-5 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileSpreadsheet size={14} /> Ekspor Excel
            </button>
          </div>
        </div>
        
      </div>

      <TabelPendapatan
        data={data}
        enablePagination={enablePagination}
        itemsPerPage={itemsPerPage}
        onSortChange={(newSortedData) => setSortedData(newSortedData)}
      />
    </div>
  );
}
