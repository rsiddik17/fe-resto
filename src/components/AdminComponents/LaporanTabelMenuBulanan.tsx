import TabelMenuBulanan from "./TabelMenuBulanan";

interface Props {
  data: any[];
  periode: string;
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export default function LaporanTableMenuBulanan({ 
  data, 
  periode, 
  enablePagination = true,
  itemsPerPage = 10 
}: Props) {
  return (
    <TabelMenuBulanan
      data={data}
      periode={periode}
      enablePagination={enablePagination}
      itemsPerPage={itemsPerPage}
    />
  );
}