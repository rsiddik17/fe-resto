import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/Card/OrderItemCard";
import StatusBanner from "../../components/StatusBanner/StatusBanner";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SuccessIcon from "../../components/Icon/SuccessIcon";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { orderAPI } from "../../api/order.api";
import Loading from "../../components/Loading/Loading";
import AlertModal from "../../components/Modal/AlertModal";

const MobileOrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart, tableNumber, tableId } = useCartStore();
  const { logout } = useAuthStore();

  const orderData = location.state;
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
    // Proteksi: Jika tidak ada data order, kembalikan ke menu
    if (!orderData || items.length === 0) {
      const targetUrl = tableId ? `/qr/${btoa(tableId.toString())}` : "/";
      navigate(targetUrl, { replace: true });
      return;
    }

<<<<<<< HEAD
  }, [orderData, items.length, navigate, tableNumber]);

  const handleSelesai = async () => {
    const rawNumber = tableNumber?.replace(/\D/g, "");

    // if status is confirmed, clear cart and navigate to home
    if (status === "CONFIRMED") {
      clearCart();
      await logout();
      if (rawNumber) {
        navigate(`/qr/${rawNumber}`, { replace: true });
      }
      return;
    };

    // loading true
    setIsLoading(true);

    try {
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
    };
=======
    // SIMULASI: Menunggu kasir klik "Terima Pesanan" (5 detik)
    const timer = setTimeout(() => {
      setStatus("CONFIRMED");
    }, 5000);

    return () => clearTimeout(timer);
  }, [orderData, items.length, navigate, tableId]);

  const handleSelesai = async () => {
   const targetUrl = tableId ? `/qr/${btoa(tableId.toString())}` : "/";

    clearCart(); 
    await logout(); // Logout Guest
    
    navigate(targetUrl, { replace: true });
>>>>>>> main
  };

  const handleModalClose = async () => {

    // get modal type and table number
    const currentModalType = modal.type;
    const rawNumber = tableNumber?.replace(/\D/g, "");

    // close modal
    setModal((prev) => ({ ...prev, isOpen: false }));

    // if order canceled, clear cart and logout
    if (currentModalType === "CANCELED") {
      clearCart();
      await logout();
      if (rawNumber) {
        navigate(`/qr/${rawNumber}`, { replace: true });
      }
    }
  }

  const tableNo = tableNumber?.match(/\d+/)?.[0];

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-white pb-4 relative flex flex-col">
      <Loading show={isLoading} />
      <Header />

      <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-10 flex flex-col items-center">
        {/* --- HEADER STATUS --- */}
        <div className="w-10 h-10 md:w-18 md:h-18 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center mb-3 shadow-sm">
          <SuccessIcon className="text-primary w-14 h-14" />
        </div>
        <h1 className="text-base md:text-xl font-bold mb-1 text-black">
          Terima Kasih!
        </h1>
        <p className="text-gray-500 text-[15px] md:text-lg mb-8 text-center">
          Pesanan Anda Berhasil
        </p>

        {/* --- BLOK INFORMASI (Ungu Muda) --- */}
        <div className="w-full bg-primary/12 rounded-md p-4 md:p-6 mb-8 shadow-sm border border-[#E3D1EE]">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-500">Nomor meja</span>
              <span className="font-bold text-primary">
                {tableNumber ? `Meja ${tableNo}` : "Meja --"}
              </span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-500">ID Pesanan</span>
              <span className="font-bold text-primary">
                #{orderData.orderId}
              </span>
            </div>
          </div>
        </div>

        {/* --- STATUS BANNER (Pending / Confirmed) --- */}
        <div className="w-full mb-6">
          <StatusBanner status={status} />
        </div>

        {/* --- STRUK / RINGKASAN PESANAN --- */}
        <div className="w-full text-left">
          <h3 className="font-bold text-base md:text-2xl lg:text-xl mb-3 text-black">
            Ringkasan Pesanan
          </h3>

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
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto px-3 mt-8">
        <Button
          onClick={handleSelesai}
          className="w-full md:max-w-2xl lg:max-w-3xl py-1.5 md:py-2.25 lg:py-2 rounded-xl font-semibold text-base md:text-lg lg:text-base"
        >
          Selesai
        </Button>
      </div>

      {/* modal alert */}
      {modal.isOpen && (
        <AlertModal
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={handleModalClose}
        />
      )}

    </div>
  );
};

export default MobileOrderSuccessPage;
