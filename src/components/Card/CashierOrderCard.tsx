import { cn } from "../../utils/utils";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export interface OrderItem {
  name: string;
  qty: number;
  note?: string;
}

export interface BadgeInfo {
  text: string;
  colorClass: string;
}

interface CashierOrderCardProps {
  orderId: string;
  rawOrderId: string;
  time: string;
  title?: string; // Untuk tulisan "Meja 02" (Jika ada)
  leftBadges: BadgeInfo[]; // Badge di kiri (ONLINE, Delivery, KIOSK)
  rightBadges: BadgeInfo[]; // Badge di kanan (Siap Saji, Dimasak, Dine in)
  items: OrderItem[];
  total: number;
  isAwaitingValidation?: boolean; // Menampilkan tombol "Validasi Pembayaran"
  onViewDetail: () => void;
  onValidate?: (rawId: string) => void;
}

const CashierOrderCard = ({
  orderId,
  rawOrderId,
  time,
  title,
  leftBadges,
  rightBadges,
  items,
  total,
  isAwaitingValidation = false,
  onViewDetail,
  onValidate,
}: CashierOrderCardProps) => {
  // Ambil maksimal 2 item untuk ditampilkan di card
  const displayedItems = items.slice(0, 2);
  const remainingItemsCount = items.length - 2;

  const typeBadge = rightBadges.find(
    (badge) => badge.text.toLowerCase() === "dine in",
  );
  const statusBadge = rightBadges.find(
    (badge) => badge.text.toLowerCase() !== "dine in",
  );

  return (
    <div className="relative w-full h-full flex transition-all">
      <div className="absolute top-0 bottom-0 left-0 bg-primary w-12 rounded-l-md shadow-sm" />

      {/* LAYER ATAS (Card Putih) - Digeser ke kanan pakai margin-left, ditambahkan h-full */}
      <div className="relative ml-3.5 w-full h-full bg-white rounded-md shadow-sm border border-gray-100 flex flex-col p-3.5">
        <div className="flex justify-between items-start mb-0.5">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-black/50 text-sm md:text-[14.5px] tracking-wide mb-2">
              {orderId}
            </span>
            {title ? (
              <h3 className="font-bold text-[16px] md:text-[17px] text-black leading-none mb-2">
                {title}
              </h3>
            ) : null}

            {leftBadges.length > 0 && (
              <div className="flex flex-col items-start gap-3.5 mb-1">
                {leftBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "text-white text-center w-18 px-3.5 py-0.75 rounded-full text-[10px] md:text-[10.5px] font-bold",
                      badge.colorClass,
                    )}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Waktu & Badge Kanan (Dine in, Siap Saji, dll) */}
          <div className="flex flex-col items-end gap-2 mt-0.5">
            <div className="flex items-center gap-1.75">
              <span className="text-black/50 text-[13.5px]">{time}</span>
              {typeBadge && (
                <span
                  className={cn(
                    "text-white px-3.5 py-0.5 rounded-full text-[10px] md:text-[10.5px] font-bold",
                    typeBadge.colorClass,
                  )}
                >
                  {typeBadge.text}
                </span>
              )}
            </div>

            {statusBadge && (
              <span
                className={cn(
                  "text-white w-full text-center px-4 py-0.75 rounded-full text-[10px] md:text-[10.5px] font-bold",
                  statusBadge.colorClass,
                )}
              >
                {statusBadge.text}
              </span>
            )}
          </div>
        </div>

        <div className="text-[14px] md:text-[15.5px] text-black mb-2 mt-1">
          Detail Pesanan
        </div>

        {/* BOX LIST ITEM (Sesuai Desain: Ungu Muda) */}
        <div className="bg-primary/15 rounded-sm px-2.5 py-1.5 flex flex-col gap-1.5">
          {displayedItems.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[14px] md:text-[15.5px]">
                {item.name} x{item.qty}
              </span>
              {/* Garis Kiri untuk Catatan */}
              <div className="border-l-2 border-primary pl-1 ml-0.5">
                <span className="text-black/50 text-[12px] md:text-[13px]">
                  Catatan: {item.note || "Tidak ada"}
                </span>
              </div>
            </div>
          ))}
          {remainingItemsCount > 0 && (
            <div className="text-primary text-[12px] md:text-[12px] mt-0.5">
              +{remainingItemsCount} item lainnya
            </div>
          )}
        </div>

        {/* TOTAL & BUTTONS (Nempel di bawah pakai mt-auto) */}
        <div className="mt-auto pt-1.5">
          {/* Garis Bawah Total Tagihan */}
          <div className="flex justify-between items-center mb-2.5 border-b-2 border-[#DEDED9] pb-1">
            <span className="text-[14px] md:text-[15px]">Total Tagihan</span>
            <span className="font-bold text-[14px] md:text-[15px]">
              {rupiahFormatter.format(total)}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={onViewDetail}
              className={cn(
                "border-2 border-primary text-primary font-bold text-[13px] md:text-[15px] py-2.25 rounded-sm hover:bg-primary/5 transition-colors cursor-pointer",
                isAwaitingValidation ? "flex-1" : "px-8 md:px-10",
              )}
            >
              Lihat Detail
            </button>

            {/* Hanya Muncul Jika Filter = Menunggu Validasi */}
            {isAwaitingValidation && (
              <button
                onClick={() => onValidate && onValidate(rawOrderId)}
                className="flex-1/5 bg-primary text-white font-bold text-[13px] md:text-[15px] py-2.5 rounded-sm hover:bg-[#5a0b64] transition-colors shadow-sm cursor-pointer"
              >
                Validasi Pembayaran
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierOrderCard;
