import TabelMenuMingguan from "./TabelMenuMingguan";

interface Props {
  data: any[];
  periode: string;
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export default function LaporanTableMenuMingguan({ 
  data, 
  periode, 
  enablePagination = true,
  itemsPerPage = 10 
}: Props) {
  return (
    <div className="space-y-4">
      <TabelMenuMingguan
        data={data}
        periode={periode}
        enablePagination={enablePagination}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}