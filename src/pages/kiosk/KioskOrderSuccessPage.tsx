import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/Card/OrderItemCard";
import StatusBanner from "../../components/StatusBanner/StatusBanner";
import { useCartStore } from "../../store/useCartStore";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SuccessIcon from "../../components/Icon/SuccessIcon";
import { orderAPI } from "../../api/order.api";
import Loading from "../../components/Loading/Loading";
import AlertModal from "../../components/Modal/AlertModal";

const KioskOrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart, tableNumber } = useCartStore();

  // Ambil data yang dikirim dari PaymentPage
  // Jika tidak ada data (misal user iseng ketik URL /success), kembalikan ke menu
  const orderData = location.state;

  // State untuk mengatur status PENDING -> CONFIRMED
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED">("PENDING");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "PENDING" | "CANCELED";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "PENDING",
  });

  useEffect(() => {
    if (!orderData || items.length === 0) {
      navigate("/kiosk/home");
      return;
    }
  }, [orderData, items.length, navigate]);

  const handleSelesai = async () => {

    // if status is confirmed, clear cart and navigate to home
    if (status === "CONFIRMED") {
      clearCart();
      navigate("/kiosk/home");
      return;
    }

    // set loading state to true
    setIsLoading(true);

    try {

      // get order by id
      const response = await orderAPI.getOrderById(orderData.orderId);
      const currentStatus = response?.status || response?.data?.status;

      // if order status is pending, show banner alert
      if (currentStatus === "PENDING") {
        setIsLoading(false);
        setModal({
          isOpen: true,
          title: "Pesanan Belum Divalidasi",
          message: "Maaf, pesanan Anda belum divalidasi oleh kasir. Pastikan Anda sudah menyelesaikan transaksi pembayaran via QRIS.",
          type: "PENDING",
        });
        return;
      } else if (currentStatus === "CANCELED") {
        setIsLoading(false);
        setModal({
          isOpen: true,
          title: "Pesanan Dibatalkan",
          message: "Pesanan Anda telah dibatalkan, kunjungi kasir atau silahkan memesan kembali.",
          type: "CANCELED",
        });
        return;

      } else {
        // if order status is confirmed, set status to confirmed
        setStatus("CONFIRMED");
      };
      
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {

    // get modal type
    const currentModalType = modal.type;

    // close modal
    setModal((prev) => ({ ...prev, isOpen: false }));

    // if order canceled, clear cart and navigate to home
    if (currentModalType === "CANCELED") {
      clearCart();
      navigate("/kiosk/home");
    };
  };

  const tableNo = tableNumber?.match(/\d+/)?.[0];

  // Hindari render error jika orderData kosong (saat redirect)
  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-white pb-8 relative flex flex-col">
      <Loading show={isLoading} />
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

      {/* --- MODAL ALERT --- */}
      {modal.isOpen && (<AlertModal
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={handleModalClose}
      />)}

    </div>
  );
};

export default KioskOrderSuccessPage;