import Button from "../ui/Button";

export type OrderStatus = "DIMASAK" | "SIAP";

export interface OrderItemDetail {
  name: string;
  qty: number;
  note: string;
}

export interface WaiterOrderListCardProps {
  orderId: string;
  tableName: string;
  time: string;
  status: OrderStatus;
  items: OrderItemDetail[];
  totalPrice: number;
  onViewDetail: () => void;
  onFinish?: () => void;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const WaiterOrderListCard = ({
  orderId,
  tableName,
  time,
  status,
  items,
  totalPrice,
  onViewDetail,
  onFinish,
}: WaiterOrderListCardProps) => {
  // Tentukan warna badge berdasarkan status
  const isDimasak = status === "DIMASAK";
  const badgeColor = isDimasak ? "bg-orange" : "bg-lime"; // Orange & Hijau

  // Batasi item yang tampil hanya 2
  const visibleItems = items.slice(0, 2);
  const hiddenItemsCount = items.length - 2;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 border-l-11 border-l-primary relative overflow-hidden flex flex-col w-full py-5 px-3.5">
      
      {/* Badge Status (Pojok Kanan Atas) */}
      <div className={`absolute top-0 right-0 ${badgeColor} text-white px-3 py-0.5 rounded-bl-md font-extrabold text-[10px]`}>
        {status}
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <p className="text-gray-400 text-xs md:text-sm font-bold mb-1.5">{orderId}</p>
          <h3 className="font-bold text-base md:text-[17px]">{tableName}</h3>
        </div>
        <span className="text-gray-400 text-xs md:text-[13px] mt-5">{time}</span>
      </div>

      {/* Detail Pesanan Preview */}
      <div className="mb-2">
        <p className="text-[13px] md:text-[13.5px] mb-1">Detail Pesanan:</p>
        <ul className="text-[13px] md:text-[13.5px] flex flex-col gap-0.5">
          {visibleItems.map((item, idx) => (
            <li key={idx}>
              {item.name} x{item.qty}
            </li>
          ))}
        </ul>
        {hiddenItemsCount > 0 && (
          <p className="text-primary text-xs md:text-[12.5px] mt-1.5">
            +{hiddenItemsCount} item lainnya
          </p>
        )}
      </div>

      {/* Total Tagihan */}
      <div className="flex justify-between items-center border-t border-gray-500 pt-2 mt-auto mb-3 mr-3">
        <span className="text-black text-[13px] md:text-sm">Total Tagihan</span>
        <span className="text-black text-[13px] md:text-sm font-medium">{rupiahFormatter.format(totalPrice)}</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 md:gap-3 mr-3">
        <Button 
          variant="outline" 
          onClick={onViewDetail}
          className="flex-1 py-2 md:py-2.5 text-xs md:text-[13px] font-normal border-primary text-primary hover:bg-primary/5 rounded-sm"
        >
          Lihat Detail
        </Button>
        <Button 
          onClick={onFinish}
          className="flex-1 py-2 md:py-2.5 text-xs md:text-[13px] font-normal bg-primary text-white rounded-sm shadow-sm"
        >
          Selesai
        </Button>
      </div>
    </div>
  );
};

export default WaiterOrderListCard;