import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/Card/OrderItemCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import QRCodeBox from "../../components/QRCodeBox/QRCodeBox";
import ExpiredModal from "../../components/Modal/ExpiredModal";
import SuccessIcon from "../../components/Icon/SuccessIcon";

import { useCartStore } from "../../store/useCartStore";
import { useOrderPayment } from "../../hooks/useOrderPayment";

const MobilePaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotalPrice, clearCart, tableNumber } = useCartStore();
  const [isExpired, setIsExpired] = useState(false);

  const subTotal = getTotalPrice();
  const taxRate = 10;
  const taxAmount = subTotal * (taxRate / 100);

  const checkoutData = location.state;
  const discountAmount = checkoutData?.discountAmount || 0;
  const backendOrderId = checkoutData?.orderId || "UNKNOWN";

  // Custom Hook
  const { adminFee, finalPayment } = useOrderPayment(
    backendOrderId,
    subTotal,
    taxAmount,
    discountAmount,
  );

  const handleSudahBayar = () => {
    navigate("/qr/order-success", {
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
    const rawNumber = tableNumber?.replace(/\D/g, "");
    clearCart();
    if (rawNumber) {
      navigate(`/qr/${rawNumber}`, { replace: true });
    }
  };

  if (items.length === 0 && !isExpired) return null;

  return (
    // pb-24 agar tidak tertutup tombol sticky
    <div className="min-h-screen bg-white pb-4 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-8 flex flex-col items-center">
        {/* --- HEADER STATUS --- */}
        <div className="w-12 h-12 md:w-18 md:h-18 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center mb-3">
          <SuccessIcon className="text-primary w-17 h-17" />
        </div>
        <h1 className="text-base md:text-[22px] lg:text-xl font-bold mb-1">Pesanan Berhasil Dibuat!</h1>
        <p className="text-gray-500 mb-6 text-[13px] md:text-lg lg:text-base">
          Silakan lakukan pembayaran via QRIS
        </p>

        {/* --- BLOK INFORMASI UTAMA (Background Ungu Muda) --- */}
        <div className="mx-2.5 bg-primary/12 rounded-md p-5 mb-6 flex flex-col gap-4">
          {/* Info Meja & ID */}
          <div className="flex flex-col gap-1.5 border-b border-[#E3D1EE] pb-2">
            <div className="flex justify-between text-[13.5px] md:text-base">
              <span className="text-gray-500">Nomor meja</span>
              <span className="font-bold text-primary">{tableNumber || "Meja --"}</span>
            </div>
            <div className="flex justify-between text-[13.5px] md:text-base">
              <span className="text-gray-500">ID Pesanan</span>
              <span className="font-bold text-primary">#{backendOrderId}</span>
            </div>
          </div>

          {/* DYNAMIC RENDER: QR Code */}
          <QRCodeBox
            finalPayment={finalPayment}
            onExpire={handlePaymentExpired}
          />
        </div>

        {/* --- STRUK / RINGKASAN PESANAN --- */}
        <div className="w-full text-left">
          <h3 className="font-bold text-base md:text-2xl lg:text-xl mb-2">
            Ringkasan Pesanan
          </h3>

          <div className="flex flex-col">
            {items.map((item) => (
              <OrderItemCard key={item.cartId} item={item} isReceiptMode />
            ))}
          </div>

          <OrderSummary
            subTotal={subTotal}
            discountAmount={discountAmount}
            adminFee={adminFee}
            hideAlertInfo={true} // Disembunyikan karena sudah di tahap akhir
          />
        </div>
      </main>

      {/* --- STICKY BOTTOM BAR --- */}
        <div className="w-full max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto mt-20 px-3">
          <Button
            onClick={handleSudahBayar}
            className="w-full md:max-w-2xl lg:max-w-3xl py-1.5 md:py-2.25 lg:py-2 rounded-xl font-semibold text-base md:text-lg lg:text-base"
          >
            Sudah Bayar
          </Button>
      </div>

      {/* MODAL KADALUARSA */}
      {isExpired && <ExpiredModal onClose={handleCloseExpiredModal} />}
    </div>
  );
};

export default MobilePaymentPage;
