import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/Card/OrderItemCard";
import StatusBanner from "../../components/StatusBanner/StatusBanner";
import { useCartStore } from "../../store/useCartStore";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SuccessIcon from "../../components/Icon/SuccessIcon";

const KioskOrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart, tableNumber } = useCartStore();

  // Ambil data yang dikirim dari PaymentPage
  // Jika tidak ada data (misal user iseng ketik URL /success), kembalikan ke menu
  const orderData = location.state;

  // State untuk mengatur status PENDING -> CONFIRMED
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED">("PENDING");

  useEffect(() => {
    if (!orderData || items.length === 0) {
      navigate("/kiosk/home");
      return;
    }

    // SIMULASI WEBSOCKET: Menunggu kasir klik "Terima Pesanan" di sistem dapur (5 detik)
    const timer = setTimeout(() => {
      setStatus("CONFIRMED");
    }, 5000);

    return () => clearTimeout(timer);
  }, [orderData, items.length, navigate]);

  const handleSelesai = () => {
    clearCart(); // Kosongkan keranjang untuk pelanggan berikutnya!
    navigate("/kiosk/home");
  };

  const tableNo = tableNumber?.match(/\d+/)?.[0];

  // Hindari render error jika orderData kosong (saat redirect)
  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-white pb-8 relative flex flex-col">
      <Header showProfile />

      <main className="flex-1 w-full px-4 max-w-full md:max-w-185 lg:max-w-2xl mx-auto pt-6 md:pt-10 flex flex-col items-center">
        
        {/* --- HEADER STATUS --- */}
        <div className="w-14 h-14 md:w-18.75 md:h-18.75 bg-primary rounded-full flex items-center justify-center mb-5 shadow-md">
          <SuccessIcon className="text-primary w-40 h-40" />
        </div>
        <h1 className="text-lg md:text-[28px] lg:text-2xl font-bold mb-1">
          Terima Kasih!
        </h1>
        <p className="text-gray text-base md:text-2xl lg:text-xl mb-8 text-center">
          Pesanan anda berhasil
        </p>

        {/* --- BLOK INFORMASI UTAMA --- */}
        <div className="w-full bg-primary/12 rounded-md p-4 md:p-6 mb-4 shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-base md:text-xl lg:text-lg">
              <span className="text-gray">Nomor meja</span>
              <span className="font-bold text-primary">{tableNumber ? `Meja ${tableNo}` : "Meja --"}</span>
            </div>
            <div className="flex justify-between text-base md:text-xl lg:text-lg">
              <span className="text-gray">ID Pesanan</span>
              <span className="font-bold text-primary">#{orderData.orderId}</span>
            </div>
          </div>
        </div>

        {/* --- STATUS BANNER (Pending / Confirmed) --- */}
        <div className="w-full mb-8">
          <StatusBanner status={status} />
        </div>

        {/* --- STRUK / RINGKASAN PESANAN BAWAH --- */}
        <div className="w-full text-left">
          <h3 className="font-bold text-base md:text-xl mb-2">Ringkasan Pesanan</h3>
          
          <div className="flex flex-col">
            {items.map((item) => (
              <OrderItemCard key={item.cartId} item={item} isReceiptMode />
            ))}
          </div>

          {/* Kalkulasi Akhir */}
          <OrderSummary 
            subTotal={orderData.subTotal} 
            discountAmount={orderData.discountAmount} 
            adminFee={orderData.adminFee}
            hideAlertInfo={true} // Sembunyikan alert ungu
          />
        </div>

      </main>

      {/* --- STICKY BOTTOM BAR --- */}
        <div className="w-full max-w-78 md:max-w-150 mx-auto mt-1.5 md:mt-3">
          <Button 
            onClick={handleSelesai} 
            className="w-full py-2 md:py-3 lg:py-2.5 rounded-full font-bold text-[14.5px] md:text-xl lg:text-lg"
          >
            Selesai
          </Button>
      </div>

    </div>
  );
};

export default KioskOrderSuccessPage;