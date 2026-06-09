import TabelMenu from "./TabelMenu";

interface Props {
  data: any[];
  periode: string;
 
}

export default function LaporanTableMenu({ 
  data, 
  periode, 
 
}: Props) {
  return (
    <div className="space-y-4">
    

      <TabelMenu
        data={data}
        periode={periode}
       
      />
    </div>
  );
}