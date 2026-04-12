import { useNavigate, useLocation } from "react-router";
import { Check } from "lucide-react";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/OrderItemCard/OrderItemCard";
import { useCartStore } from "../../store/useCartStore";
import { useOrderPayment } from "../../hooks/useOrderPayment";
import QRCodeBox from "../../components/QRCodeBox/QRCodeBox";
import ExpiredModal from "../../components/ExpiredModal/ExpiredModal";
import { useState } from "react";
import OrderSummary from "../../components/OrderSummary/OrderSummary";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isExpired, setIsExpired] = useState(false);

  const subTotal = getTotalPrice();
  const taxRate = 10;
  const taxAmount = subTotal * (taxRate / 100);
  const checkoutData = location.state;
  const discountAmount = checkoutData?.discountAmount || 0;

  // Memanggil Custom Hook kita
  const { orderId, adminFee, finalPayment } = useOrderPayment(
    subTotal,
    taxAmount,
    discountAmount,
  );

  const handleSudahBayar = () => {
    // KITA PINDAH KE SUCCESS PAGE SAMBIL MEMBAWA DATA
    navigate("/kiosk/pesanan-berhasil", {
      state: {
        orderId,
        adminFee,
        subTotal,
        taxAmount,
        discountAmount,
        finalPayment,
      },
    });
  };

  const handlePaymentExpired = () => {
    setIsExpired(true);
  };

  const handleCloseExpiredModal = () => {
    clearCart();
    navigate("/kiosk/home");
  };

  // Helper formatter

  return (
    <div className="min-h-screen bg-white pb-16 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto pt-10 flex flex-col items-center">
        {/* --- HEADER STATUS (Icon Ceklis & Judul) --- */}
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 shadow-md">
          <Check size={30} strokeWidth={4} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Pesanan Berhasil Dibuat!</h1>
        <p className="text-gray mb-6 text-xl">
          Silakan lakukan pembayaran via QRIS
        </p>

        {/* --- BLOK INFORMASI UTAMA --- */}
        <div className="w-full bg-primary/12 rounded-md p-4 md:p-6 mb-8 flex flex-col gap-6 border border-[#E3D1EE]">
          {/* Info Meja & ID */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-lg">
              <span className="text-gray">Nomor meja</span>
              <span className="font-bold text-primary">Meja 02</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray">ID Pesanan</span>
              <span className="font-bold text-primary">#{orderId}</span>
            </div>
          </div>

          {/* DYNAMIC RENDER: QR Code ATAU Status Banner */}
          <QRCodeBox
            finalPayment={finalPayment}
            onExpire={handlePaymentExpired}
          />
        </div>

        {/* --- STRUK / RINGKASAN PESANAN BAWAH --- */}
        <div className="w-full text-left">
          <h3 className="font-bold text-xl mb-2">Ringkasan Pesanan</h3>

          <div className="flex flex-col">
            {items.map((item) => (
              <OrderItemCard key={item.cartId} item={item} />
            ))}
          </div>

          {/* Kalkulasi Akhir */}
          <OrderSummary
            subTotal={subTotal}
            discountAmount={discountAmount}
            adminFee={adminFee}
            hideAlertInfo={true} // Sembunyikan alert ungu karena user sudah di halaman QRIS
          />
        </div>
      </main>

      {/* --- STICKY BOTTOM BAR --- */}
      <div className="w-full max-w-xl mx-auto mt-10">
        <Button
          onClick={handleSudahBayar}
          className="w-full py-4 rounded-full font-bold text-lg"
        >
          Sudah Bayar
        </Button>
      </div>

      {isExpired && <ExpiredModal onClose={handleCloseExpiredModal} />}
    </div>
  );
};

export default PaymentPage;
