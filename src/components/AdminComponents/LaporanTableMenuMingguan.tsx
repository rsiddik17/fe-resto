import TabelMenuMingguan from "./TabelMenuMingguan";

interface Props {
  data: any[];
  periode: string;

}

export default function LaporanTableMenuMingguan({ 
  data, 
  periode, 
  
}: Props) {
  return (
    <div className="space-y-4">
      <TabelMenuMingguan
        data={data}
        periode={periode}
       
      />
    </div>
  );
}