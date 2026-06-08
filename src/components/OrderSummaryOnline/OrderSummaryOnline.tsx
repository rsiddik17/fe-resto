import AlertInfo from "../AlertInfo/AlertInfo";

interface OrderSummaryOnlineProps {
  subTotal: number;
  taxRate?: number;
  discountAmount?: number;
  adminFee?: number;
  hideAlertInfo?: boolean;
  finalPayment?: number; // ✅ TAMBAHKAN - dari backend
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const OrderSummaryOnline = ({
  subTotal = 0,
  taxRate = 10,
  discountAmount = 0,
  adminFee = 0,
  hideAlertInfo = false,
  finalPayment, // ✅ TAMBAHKAN
}: OrderSummaryOnlineProps) => {
  // 🔥 PERBAIKAN: PAKAI RUMUS BACKEND (PPN setelah diskon)
  const afterDiscount = subTotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  
  // ✅ Jika ada finalPayment dari backend, pakai itu. Jika tidak, hitung manual
  const grandTotal = finalPayment !== undefined 
    ? finalPayment 
    : afterDiscount + taxAmount + adminFee;

  return (
    <div className="flex flex-col w-full gap-4 py-4">
      <div className="flex flex-col gap-2.5 text-base">
        <div className="flex justify-between items-center">
          <span className="text-xl">Total Pesanan</span>
          <span className="font-medium text-xl">
            {rupiahFormatter.format(subTotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xl">Diskon</span>
            <span className="font-medium text-xl text-red-500">
              -{rupiahFormatter.format(discountAmount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xl">PPN {taxRate}%</span>
          <span className="font-medium text-xl">
            {rupiahFormatter.format(taxAmount)}
          </span>
        </div>

        {adminFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xl">Biaya Admin</span>
            <span className="font-medium text-xl">
              {rupiahFormatter.format(adminFee)}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className="font-bold text-xl">Total Pembayaran</span>
        <span className="font-bold text-xl">
          {rupiahFormatter.format(grandTotal)}
        </span>
      </div>

      {!hideAlertInfo && (
        <AlertInfo
          className="mt-2"
          title="Informasi Pembayaran"
          description="Setelah konfirmasi pesanan, biaya admin akan ditambahkan pada nominal QRIS."
        />
      )}
    </div>
  );
};

export default OrderSummaryOnline;