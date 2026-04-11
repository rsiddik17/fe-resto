import AlertInfo from "../AlertInfo/AlertInfo";

interface OrderSummaryProps {
  subTotal: number;
  taxRate?: number; // Persentase PPN (default: 10)
  discountAmount?: number; // Nominal diskon
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const OrderSummary = ({ subTotal, taxRate = 10, discountAmount = 0 }: OrderSummaryProps) => {
  
  // Kalkulasi Angka (Ditempatkan di sini agar komponen luar tidak pusing menghitung PPN)
  const taxAmount = subTotal * (taxRate / 100);
  const grandTotal = subTotal + taxAmount - discountAmount;

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

      </div>

      {/* --- TOTAL AKHIR --- */}
      <div className="flex justify-between items-center mt-1">
        <span className="font-bold text-xl">Total Pembayaran</span>
        <span className="font-bold text-xl">
          {rupiahFormatter.format(grandTotal)}
        </span>
      </div>

      {/* --- ALERT INFO --- */}
      <AlertInfo 
        className="mt-2"
        title="Informasi Pembayaran"
        description="Setelah konfirmasi pesanan, biaya admin akan ditambahkan pada nominal QRIS."
      />

    </div>
  );
};

export default OrderSummary;