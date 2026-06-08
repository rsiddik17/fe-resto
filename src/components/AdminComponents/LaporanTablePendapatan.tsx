import TabelPendapatan from "./TabelPendapatan";


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
  
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
         
      </div>

      <TabelPendapatan
        data={data}
        periode={periode}
        enablePagination={enablePagination}
        itemsPerPage={itemsPerPage}
        
      />
    </div>
  );
}
