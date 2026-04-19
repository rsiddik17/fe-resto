import AlertInfo from "../AlertInfo/AlertInfo";

interface OrderSummaryOnlineProps {
  subTotal: number;
  taxRate?: number; // Persentase PPN (default: 10)
  discountAmount?: number; // Nominal diskon
  adminFee?: number; 
  hideAlertInfo?: boolean;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const OrderSummaryOnline = ({ subTotal, taxRate = 10, discountAmount = 0, adminFee = 0, hideAlertInfo = false }: OrderSummaryOnlineProps) => {
  
  // Kalkulasi Angka (Ditempatkan di sini agar komponen luar tidak pusing menghitung PPN)
  const taxAmount = subTotal * (taxRate / 100);
  const grandTotal = subTotal + taxAmount - discountAmount + adminFee;

  return (
    <div className="flex flex-col w-full gap-4 py-4">
      
      {/* --- RINCIAN BIAYA --- */}
      <div className="flex flex-col gap-2.5 text-base">
        
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-xl">Total Pesanan</span>
          <span className="font-medium text-xl">{rupiahFormatter.format(subTotal)}</span>
        </div>

        {/* PPN */}
        <div className="flex justify-between items-center">
          <span className="text-xl">PPN {taxRate}%</span>
          <span className="font-medium text-xl">{rupiahFormatter.format(taxAmount)}</span>
        </div>

        {/* Diskon (Hanya muncul jika ada diskon) */}
        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xl">Diskon</span>
            <span className="font-medium text-xl"> {/* Beri warna beda agar mencolok */}
              -{rupiahFormatter.format(discountAmount)}
            </span>
          </div>
        )}

        {adminFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-lg">Biaya Admin</span>
            <span className="font-bold text-lg">Rp{adminFee}</span>
          </div>
        )}

      </div>

      {/* --- TOTAL AKHIR --- */}
      <div className="flex justify-between items-center mt-1">
        <span className="font-bold text-xl">Total Pembayaran</span>
        <span className="font-bold text-xl">
          {rupiahFormatter.format(grandTotal)}
        </span>
      </div>

      {/* --- ALERT INFO --- */}
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