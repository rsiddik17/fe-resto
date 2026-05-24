import { useState } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import TabelMenuBulanan from "./TabelMenuBulanan";
import { eksporKePDFMenuBulanan, eksporKeExcelMenuBulanan } from "../../components/AdminComponents/ExportUtilsBulanan"

interface Props {
  data: any[];
  periode: string;
}

export default function LaporanTableMenuBulanan({ data, periode }: Props) {
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => eksporKePDFMenuBulanan(sortedData, periode)}
            className="bg-primary text-white font-bold text-[12.5px] px-5 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileText size={12} /> Ekspor PDF
          </button>
          <button
            onClick={() => eksporKeExcelMenuBulanan(sortedData, periode)}
           className="bg-primary text-white font-bold text-[12.5px] px-5 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileSpreadsheet size={12} /> Ekspor Excel
          </button>
        </div>
      </div>
      <TabelMenuBulanan data={data} onSortChange={(newSortedData) => setSortedData(newSortedData)} />
    </div>
  );
}