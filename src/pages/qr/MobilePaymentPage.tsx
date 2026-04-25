import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/OrderItemCard/OrderItemCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import QRCodeBox from "../../components/QRCodeBox/QRCodeBox";
import ExpiredModal from "../../components/ExpiredModal/ExpiredModal";
import SuccessIcon from "../../components/Icon/SuccessIcon";

import { useCartStore } from "../../store/useCartStore";
import { useOrderPayment } from "../../hooks/useOrderPayment";

const MobilePaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isExpired, setIsExpired] = useState(false);

  const subTotal = getTotalPrice();
  const taxRate = 10;
  const taxAmount = subTotal * (taxRate / 100);

  const checkoutData = location.state;
  const discountAmount = checkoutData?.discountAmount || 0;

  // Custom Hook
  const { orderId, adminFee, finalPayment } = useOrderPayment(
    subTotal,
    taxAmount,
    discountAmount,
  );

  const handleSudahBayar = () => {
    // Pindah ke Success Page versi Mobile
    navigate("/qr/order-success", {
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
    navigate("/qr/menu"); // Sesuai desain, kembali ke Menu
  };

  if (items.length === 0 && !isExpired) return null;

  return (
    // pb-24 agar tidak tertutup tombol sticky
    <div className="min-h-screen bg-white pb-12 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-6 pt-8 flex flex-col items-center">
        {/* --- HEADER STATUS --- */}
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-3">
          <SuccessIcon className="text-primary w-18 h-18" />
        </div>
        <h1 className="text-md font-bold mb-1">Pesanan Berhasil Dibuat!</h1>
        <p className="text-gray-500 mb-6 text-xs">
          Silakan lakukan pembayaran via QRIS
        </p>

        {/* --- BLOK INFORMASI UTAMA (Background Ungu Muda) --- */}
        <div className="w-full bg-primary/12 rounded-md p-5 mb-8 flex flex-col gap-4">
          {/* Info Meja & ID */}
          <div className="flex flex-col gap-1.5 border-b border-[#E3D1EE] pb-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Nomor meja</span>
              <span className="font-bold text-primary">Meja-03</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ID Pesanan</span>
              <span className="font-bold text-primary">#{orderId}</span>
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
          <h3 className="font-bold text-sm mb-3">
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
        <div className="w-full max-w-sm mx-auto mt-20">
          <Button
            onClick={handleSudahBayar}
            className="w-full py-2 rounded-xl font-bold text-base"
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
