import TabelPesanan from "./TabelPesanan";

interface Props {
  data: any[];
  periode: string;
  enablePagination?: boolean;
  itemsPerPage?: number;
}

export default function LaporanTablePesanan({
  data,
  periode,
  enablePagination = true,
  itemsPerPage = 10,
}: Props) {
  return (
    <TabelPesanan
      data={data}
      periode={periode}
      enablePagination={enablePagination}
      itemsPerPage={itemsPerPage}
    />
  );
}