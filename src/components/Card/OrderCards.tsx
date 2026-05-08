import ProcessingIcon from "../Icon/ProcessingIcon";

// --- KARTU PESANAN SIAP SAJI ---
interface ReadyOrderCardProps {
  orderId: string;
  tableName: string;
  time: string;
  items: string[];
}

export const ReadyOrderCard = ({ orderId, tableName, time, items }: ReadyOrderCardProps) => {
  return (
    <div className="relative border-2 border-primary rounded-md p-3.5 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      {/* Badge SIAP (Nempel di pojok kanan atas) */}
      <div className="absolute top-0 right-0 bg-primary text-white px-3 py-0.5 rounded-bl-md font-bold text-[12px] tracking-wider">
        SIAP
      </div>

      <div className="flex justify-between items-start mb-1 mt-0.5">
        <div>
          <p className="text-primary text-[11px] font-bold mb-0.5">#{orderId}</p>
          <h3 className="text-primary font-bold text-[17px]">{tableName}</h3>
        </div>
        <span className="text-black/25 font-bold text-[12.5px] mt-4.5">{time}</span>
      </div>

      <ul className="text-[15px] flex flex-col gap-0.5 mt-1 mb-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

// --- KARTU PESANAN DIPROSES ---
interface ProcessingOrderCardProps {
  orderId: string;
  tableName: string;
  itemsString: string;
}

export const ProcessingOrderCard = ({ orderId, tableName, itemsString }: ProcessingOrderCardProps) => {
  return (
    <div className="bg-white rounded-md px-3 py-1.5 flex items-center gap-3 shadow-sm border border-gray-100">
      {/* Ikon Kiri */}
      <div className="bg-[#6C0D78]/50 p-2 rounded-md shrink-0 flex items-center justify-center">
        <ProcessingIcon className="text-primary w-7 h-7" />
      </div>

      {/* Info Tengah */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base">{tableName}</h3>
        <p className="text-black/25 text-sm truncate mt-0.5">{itemsString}</p>
      </div>

      {/* Status Kanan */}
      <div className="flex items-center shrink-0 gap-2 md:gap-3">
        <p className="text-black/25 text-[10px] md:text-xs font-bold">#{orderId}</p>
        <span className="bg-orange text-white px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-xs font-bold">
          Dimasak
        </span>
      </div>
    </div>
  );
};