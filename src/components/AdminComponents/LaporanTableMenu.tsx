import TabelMenu from "./TabelMenu";

interface Props {
  data: any[];
  periode: string;
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export default function LaporanTableMenu({ 
  data, 
  periode, 
  enablePagination = true,
  itemsPerPage = 10 
}: Props) {
  return (
    <div className="space-y-4">
    

      <TabelMenu
        data={data}
        periode={periode}
        enablePagination={enablePagination}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}