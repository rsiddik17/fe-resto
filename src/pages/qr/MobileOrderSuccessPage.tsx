import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/OrderItemCard/OrderItemCard";
import StatusBanner from "../../components/StatusBanner/StatusBanner";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SuccessIcon from "../../components/Icon/SuccessIcon";

import { useCartStore } from "../../store/useCartStore";

const MobileOrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCartStore();

  const orderData = location.state;
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED">("PENDING");

  useEffect(() => {
    // Proteksi: Jika tidak ada data order, kembalikan ke menu
    if (!orderData || items.length === 0) {
      navigate("/qr/menu");
      return;
    }

    // SIMULASI: Menunggu kasir klik "Terima Pesanan" (5 detik)
    const timer = setTimeout(() => {
      setStatus("CONFIRMED");
    }, 5000);

    return () => clearTimeout(timer);
  }, [orderData, items.length, navigate]);

  const handleSelesai = () => {
    clearCart(); // Kosongkan keranjang
    navigate("/qr/menu"); // Kembali ke menu utama HP
  };

  if (!orderData) return null;

  return (
    // pb-24 agar tombol sticky tidak menutupi ringkasan harga
    <div className="min-h-screen bg-white pb-12 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-10 flex flex-col items-center">
        
        {/* --- HEADER STATUS --- */}
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-3 shadow-sm">
          <SuccessIcon className="text-primary w-14 h-14" />
        </div>
        <h1 className="text-sm font-bold mb-1 text-black">Terima Kasih!</h1>
        <p className="text-gray-500 text-sm mb-10 text-center">
          Pesanan Anda Berhasil
        </p>

        {/* --- BLOK INFORMASI (Ungu Muda) --- */}
        <div className="w-full bg-primary/12 rounded-md p-4 md:p-6 mb-8 shadow-sm border border-[#E3D1EE]">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Nomor meja</span>
              <span className="font-bold text-primary">Meja-03</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">ID Pesanan</span>
              <span className="font-bold text-primary">#{orderData.orderId}</span>
            </div>
          </div>
        </div>

        {/* --- STATUS BANNER (Pending / Confirmed) --- */}
        <div className="w-full mb-6">
          <StatusBanner status={status} />
        </div>

        {/* --- STRUK / RINGKASAN PESANAN --- */}
        <div className="w-full text-left">
          <h3 className="font-bold text-base mb-3 text-black">Ringkasan Pesanan</h3>
          
          <div className="flex flex-col border-b border-gray-100 pb-2">
            {items.map((item) => (
              <OrderItemCard key={item.cartId} item={item} isReceiptMode />
            ))}
          </div>

          <OrderSummary 
            subTotal={orderData.subTotal} 
            discountAmount={orderData.discountAmount} 
            adminFee={orderData.adminFee}
            hideAlertInfo={true} // Sembunyikan alert ungu
          />
        </div>

      </main>

      {/* --- STICKY BOTTOM BAR --- */}
        <div className="w-full max-w-sm mx-auto">
          <Button 
            onClick={handleSelesai} 
            className="w-full py-2 rounded-xl font-bold text-base"
          >
            Selesai
          </Button>
        </div>

    </div>
  );
};

export default MobileOrderSuccessPage;