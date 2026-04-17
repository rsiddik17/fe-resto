import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/OrderItemCard/OrderItemCard";
import StatusBanner from "../../components/StatusBanner/StatusBanner";
import { useCartStore } from "../../store/useCartStore";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SuccessIcon from "../../components/Icon/SuccessIcon";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCartStore();

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


  // Hindari render error jika orderData kosong (saat redirect)
  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-white pb-16 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto pt-10 flex flex-col items-center">
        
        {/* --- HEADER STATUS --- */}
        <div className="w-18.75 h-18.75 bg-primary rounded-full flex items-center justify-center mb-5 shadow-md">
          <SuccessIcon className="text-primary w-40 h-40" />
        </div>
        <h1 className="text-3xl font-bold mb-1">
          Terima Kasih!
        </h1>
        <p className="text-gray text-2xl mb-8 text-center">
          Pesanan anda berhasil
        </p>

        {/* --- BLOK INFORMASI UTAMA --- */}
        <div className="w-full bg-primary/12 rounded-md p-4 md:p-6 mb-4 shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xl">
              <span className="text-gray">Nomor meja</span>
              <span className="font-extrabold text-primary">Meja 02</span>
            </div>
            <div className="flex justify-between text-xl">
              <span className="text-gray">ID Pesanan</span>
              <span className="font-extrabold text-primary">#{orderData.orderId}</span>
            </div>
          </div>
        </div>

        {/* --- STATUS BANNER (Pending / Confirmed) --- */}
        <div className="w-full mb-8">
          <StatusBanner status={status} />
        </div>

        {/* --- STRUK / RINGKASAN PESANAN BAWAH --- */}
        <div className="w-full text-left">
          <h3 className="font-bold text-xl mb-2">Ringkasan Pesanan</h3>
          
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
        <div className="w-full max-w-xl mx-auto">
          <Button 
            onClick={handleSelesai} 
            disabled={status === "PENDING"} 
            className="w-full py-4 rounded-full font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selesai
          </Button>
      </div>

    </div>
  );
};

export default OrderSuccessPage;