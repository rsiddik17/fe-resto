import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/Card/OrderItemCard";
import { useCartStore } from "../../store/useCartStore";
import { useOrderPayment } from "../../hooks/useOrderPayment";
import QRCodeBox from "../../components/QRCodeBox/QRCodeBox";
import ExpiredModal from "../../components/Modal/ExpiredModal";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SuccessIcon from "../../components/Icon/SuccessIcon";

const KioskPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotalPrice, clearCart, tableNumber } = useCartStore();
  const [isExpired, setIsExpired] = useState(false);

  // Ambil Data Checkout
  const checkoutData = location.state;
  const discountAmount = checkoutData?.discountAmount || 0;
  const backendOrderId = checkoutData?.orderId || "UNKNOWN";

  // Kalkulasi Dasar
  const subTotal = getTotalPrice();

  const { adminFee, taxAmount, finalPayment } = useOrderPayment(
    backendOrderId,
    subTotal,
    discountAmount,
  );

  const handleSudahBayar = () => {
    navigate("/kiosk/order-success", {
      state: {
        orderId: backendOrderId,
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
    navigate("/kiosk/menu");
  };

  return (
    <div className="min-h-screen bg-white pb-8 relative flex flex-col">
      <Header showProfile />

      <main className="flex-1 w-full px-4 max-w-full md:max-w-182.5 lg:max-w-2xl mx-auto pt-6 md:pt-10 flex flex-col items-center">
        {/* --- HEADER STATUS (Icon Ceklis & Judul) --- */}
        <div className="w-14 h-14 md:w-18 md:h-18 bg-primary rounded-full flex items-center justify-center mb-6 shadow-md">
          <SuccessIcon className="text-primary w-36 h-36 md:w-40 md:h-40" />
        </div>
        <h1 className="text-lg md:text-[28px] lg:text-2xl font-bold mb-1">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-gray mb-6 text-base md:text-2xl lg:text-xl">
          Silakan lakukan pembayaran via QRIS
        </p>

        {/* --- BLOK INFORMASI UTAMA --- */}
        <div className="w-full bg-primary/12 rounded-md p-4 md:p-6 mb-8 flex flex-col gap-6 border border-[#E3D1EE]">
          {/* Info Meja & ID */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-base md:text-xl lg:text-lg">
              <span className="text-gray">Nomor meja</span>
              <span className="font-bold text-primary">
                {tableNumber || "Meja --"}
              </span>
            </div>
            <div className="flex justify-between text-base md:text-xl lg:text-lg">
              <span className="text-gray">ID Pesanan</span>
              <span className="font-bold text-primary">#{backendOrderId}</span>
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
          <h3 className="font-bold text-[17px] md:text-2xl lg:text-xl mb-2">
            Ringkasan Pesanan
          </h3>

          <div className="flex flex-col">
            {items.map((item) => (
              <OrderItemCard key={item.cartId} item={item} isReceiptMode />
            ))}
          </div>

          {/* Kalkulasi Akhir */}
          <OrderSummary
            subTotal={subTotal}
            discountAmount={discountAmount}
            adminFee={adminFee}
            hideAlertInfo={true}
          />
        </div>
      </main>

      {/* --- STICKY BOTTOM BAR --- */}
      <div className="w-full max-w-78 md:max-w-150 mx-auto mt-10">
        <Button
          onClick={handleSudahBayar}
          className="w-full py-2 md:py-3 lg:py-2.5 rounded-full font-bold text-[14.5px] md:text-xl lg:text-lg"
        >
          Sudah Bayar
        </Button>
      </div>

      {isExpired && <ExpiredModal onClose={handleCloseExpiredModal} />}
    </div>
  );
};

export default KioskPaymentPage;
