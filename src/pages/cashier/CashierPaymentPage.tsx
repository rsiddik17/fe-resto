import { useNavigate, useLocation } from "react-router";
import { Check } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Button from "../../components/ui/Button";
import WaiterQRCodeBox from "../../components/QRCodeBox/WaiterQRCodeBox";
import WaiterReceiptItemCard from "../../components/Card/WaiterReceiptItemCard";
import { useCartStore } from "../../store/useCartStore";
import { useState } from "react";
import ExpiredModal from "../../components/Modal/ExpiredModal";
import { useOrderPayment } from "../../hooks/useOrderPayment";
import { useProfile } from "../../hooks/useProfile";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const formatTableNumber = (raw?: string) => {
  if (!raw) return "Tanpa Meja";
  if (raw.toLowerCase().includes("meja") || raw.toLowerCase().includes("tanpa")) {
    return raw; 
  }
   const match = raw.match(/\d+/);
  if (match) {
    return `Meja ${match[0]}`;
  }
  return `Meja ${raw}`;
};

const CashierPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, roleName } = useProfile();

  const [isExpiredOpen, setIsExpiredOpen] = useState(false);

  // Ambil state dari halaman sebelumnya, fallback default
  const tableNumber = formatTableNumber(location.state?.tableNumber);

  const orderId = location.state?.orderId || "UNKNOWN";
  const discountAmount = location.state?.discountAmount || 0;

  // Data dari Store
  const { items, getTotalPrice } = useCartStore();
  const subTotal = getTotalPrice();
  const taxRate = 10;

  const { adminFee, taxAmount, finalPayment } = useOrderPayment(
    orderId,
    subTotal,
    discountAmount,
    taxRate,
  );

  const handleValidatePayment = () => {
    navigate("/cashier/order-list/payment-validation", {
      state: { orderId: orderId, tableNumber: tableNumber },
    });
  };


  return (
    <>
      <div className="pt-14 lg:pt-7 lg:pl-8 lg:pr-7 mx-4 lg:mx-0">
        <DashboardHeader
          title="" // Di desain tidak ada title khusus, kosongkan
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-0 lg:pb-0 px-4 lg:px-8 flex flex-col">
        {/* KARTU PUTIH UTAMA (Bungkus 2 Kolom) */}
        <div className="bg-white rounded-t-sm shadow-sm border border-gray-100 p-3 flex flex-col md:flex-row gap-3 items-start">
          {/* --- KOLOM KIRI: QRIS AREA (Background Ungu Muda) --- */}
          <div className="w-full md:w-[50%] bg-[#F4ECF9] rounded-md p-3 mt-2 flex flex-col shrink-0">
            {/* Info Meja & ID */}
            <div className="flex flex-col gap-2 mt-2 mb-2.5">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-black/50">Nomor meja</span>
                <span className="font-bold text-primary">{tableNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-black/50">ID Pesanan</span>
                <span className="font-bold text-primary">#{orderId}</span>
              </div>
            </div>

            {/* QR Component */}
            <WaiterQRCodeBox
              finalPayment={finalPayment}
              onExpire={() => setIsExpiredOpen(true)}
            />
          </div>

          {/* --- KOLOM KANAN: RINGKASAN PESANAN --- */}
          <div className="w-full md:w-[50%] py-4 px-1">
            {/* Header Success */}
            <div className="flex flex-col items-center text-center shrink-0 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Check className="text-white w-8 h-8" strokeWidth={3} />
              </div>
              <h2 className="text-lg font-bold mb-1">
                Pesanan Berhasil Dibuat!
              </h2>
              <p className="text-gray-500 text-[15px]">
                Silakan lakukan pembayaran via QRIS
              </p>
            </div>

            {/* Title Ringkasan */}
            <h3 className="font-bold text-[15px] text-black shrink-0">
              Ringkasan Pesanan
            </h3>

            {/* Area List Item (Bisa di-scroll jika item banyak) */}
            <div className="flex flex-col">
              {items.map((item) => (
                <WaiterReceiptItemCard key={item.cartId} item={item} />
              ))}
            </div>

            {/* Area Subtotal & Button (Selalu fixed di bawah) */}
            <div className="shrink-0 flex flex-col text-[13px] mt-1">
              <div className="flex justify-between">
                <span>Total Pesanan</span>
                <span>{rupiahFormatter.format(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN {taxRate}%</span>
                <span>{rupiahFormatter.format(taxAmount)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span>-{rupiahFormatter.format(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between mb-1">
                <span>Biaya Admin</span>
                <span>Rp{adminFee}</span>
              </div>

              {/* Total Pembayaran Akhir */}
              <div className="flex justify-between items-center pt-1 mb-4 border-t border-gray-100">
                <span className="font-bold text-sm">Total Pembayaran</span>
                <span className="font-bold text-sm">
                  {rupiahFormatter.format(finalPayment)}
                </span>
              </div>

              {/* Tombol Validasi Pembayaran (Khusus Kasir) */}
              <div className="flex justify-center">
                <Button
                  onClick={handleValidatePayment}
                  className="w-full max-w-85 py-2 text-[14px] md:text-[14px] lg:text-[14px] font-bold rounded-full shadow-sm"
                >
                  Validasi Pembayaran
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpiredOpen && (
        <ExpiredModal onClose={() => navigate("/cashier/dashboard")} />
      )}
    </>
  );
};

export default CashierPaymentPage;
