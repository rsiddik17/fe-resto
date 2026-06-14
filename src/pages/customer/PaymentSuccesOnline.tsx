import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Check, Clock, ArrowLeft, FileText } from "lucide-react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import Button from "../../components/ui/Button";
import OrderSummaryOnline from "../../components/OrderSummaryOnline/OrderSummaryOnline";
import OrderReceipt from "../../components/OrderRecipt/OrderRecipt";
import { orderAPI } from "../../api/order.api";
import Loading from "../../components/Loading/Loading";
import AlertModal from "../../components/Modal/AlertModal";
const PaymentSuccessOnline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showReceipt, setShowReceipt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State diubah: default-nya FALSE (berarti "Sedang Diproses" dulu)
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [, setOrderDetail] = useState(null);

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

  // Mengambil data dari navigasi sebelumnya
  const {
    orderId = "",
    finalPayment = 0,
    subTotal = 0,
    discountAmount = 0,
    adminFee = 0,
    customerName = "Pelanggan",
    purchasedItems = [],
  } = location.state || {};

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (orderId && orderId !== "260401205") {
        if (!orderId) return;

        try {
          const response = await orderAPI.getMyOrderById(orderId);
          const orderData = response.data || response;
          setOrderDetail(orderData);

          const currentStatus = orderData?.status;

          if (
            currentStatus !== "PENDING" &&
            currentStatus !== "CANCELED" &&
            currentStatus !== "VALIDATED"
          ) {
            // ✅ JANGAN LUPA VALIDATED JUGA
            setIsConfirmed(true);
          }
        } catch (error) {
          console.error("Gagal ambil detail pesanan:", error);
        }
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleStruk = async () => {
    setIsLoading(true);

    if (isConfirmed) {
      setShowReceipt(true);
      return;
    }

    try {
      const response = await orderAPI.getMyOrderById(orderId);
      const currentStatus = response?.status || response?.data?.status;

      if (currentStatus === "PENDING") {
        setIsLoading(false);
        setModal({
          isOpen: true,
          title: "Pesanan Belum Divalidasi",
          message:
            "Maaf, pesanan Anda belum divalidasi oleh kasir. Pastikan Anda sudah menyelesaikan transaksi pembayaran via QRIS.",
          type: "PENDING",
        });
        return;
      } else if (currentStatus === "CANCELED") {
        setIsLoading(false);
        setModal({
          isOpen: true,
          title: "Pesanan Dibatalkan",
          message:
            "Pesanan Anda telah dibatalkan, kunjungi kasir atau silahkan memesan kembali.",
          type: "CANCELED",
        });
        return;
      } else {
        setIsConfirmed(true);
        setShowReceipt(true);
      }
    } catch (error) {
      console.error("Gagal ambil detail pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    const currentModalType = modal.type;
    setModal((prev) => ({ ...prev, isOpen: false }));

    if (currentModalType === "CANCELED") {
      navigate("/customer/orders");
    }
  };

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      <Loading show={isLoading} />
      <Header mode="online" />

      <div className="bg-white border-b border-gray-100 shadow-sm mb-3 w-full">
        <div className="w-full py-3 px-4 md:px-12 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Pembayaran</h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <Check size={32} strokeWidth={4} className="text-white" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-1 font-sans">
          Terima Kasih!
        </h2>
        <p className="text-gray-400 mb-8">Pesanan anda berhasil</p>

        <div className="w-full bg-[#F9F5FB] rounded-2xl p-6 mb-4 border border-primary/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-sm">ID Pesanan</span>
            <span className="text-primary font-bold text-sm">#{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Total Pembayaran</span>
            <span className="text-primary font-bold text-sm">
              Rp{Number(finalPayment).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* LOGIKA PERBAIKAN: Jika isConfirmed masih false, tampilkan "Diproses" */}
        {!isConfirmed ? (
          <div className="w-full bg-[#FFF9E6] border border-[#FFE0B2] rounded-xl p-6 mb-8 text-center flex flex-col items-center gap-2 transition-all duration-500 ease-in-out">
            <Clock size={24} className="text-[#388E3C] animate-pulse" />
            <h3 className="font-bold text-[#388E3C]">
              Pesanan Sedang Diproses
            </h3>
            <p className="text-xs text-[#4CAF50]">
              Pesanan Anda sedang diproses. Silakan tunggu.
            </p>
          </div>
        ) : (
          <div className="w-full bg-[#EBF5EB] border border-[#D5EBD5] rounded-xl p-6 mb-8 text-center flex flex-col items-center gap-2 transition-all duration-500 ease-in-out">
            {/* Lingkaran Ceklis Hijau Toko Kiosk */}
            <div className="w-10 h-10 bg-[#388E3C] rounded-full flex items-center justify-center shadow-sm">
              <Check size={20} strokeWidth={4} className="text-white" />
            </div>
            <h3 className="font-bold text-[#388E3C]">Pesanan Dikonfirmasi</h3>
            <p className="text-xs text-[#4CAF50]">
              Silakan tunggu di meja anda. Pesanan akan segera diantarkan.
            </p>
          </div>
        )}

        <div className="w-full text-left">
          <div className="flex items-center gap-2 mb-4 font-bold">
            <FileText size={18} className="text-primary" />
            <h3>Ringkasan Pesanan</h3>
          </div>

          <div className="space-y-4 mb-4">
            {purchasedItems.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <p className="font-medium text-black">
                    {item.name} x{item.qty || item.quantity}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    Catatan: {item.notes || "-"}
                  </p>
                </div>
                <p className="font-medium">
                  Rp
                  {(
                    (item.price || 0) * (item.qty || item.quantity || 1)
                  ).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          <OrderSummaryOnline
            subTotal={subTotal}
            taxRate={10}
            discountAmount={discountAmount}
            adminFee={adminFee}
            finalPayment={finalPayment}
            hideAlertInfo={true}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-10 px-4">
          <Button
            onClick={() => navigate("/customer/orders")}
            className="w-full sm:flex-1 py-4 rounded-full font-bold bg-primary text-white text-sm md:text-base"
          >
            Pantau Pesanan
          </Button>
          <Button
            onClick={handleStruk}
            className="w-full sm:flex-1 py-4 rounded-full font-bold bg-primary text-white text-sm md:text-base"
          >
            Lihat Struk
          </Button>
        </div>
      </main>

      {showReceipt && (
        <OrderReceipt
          orderId={orderId}
          customerName={customerName}
          items={purchasedItems}
          subTotal={subTotal}
          discountAmount={discountAmount}
          adminFee={adminFee}
          totalPrice={finalPayment}
          onClose={() => setShowReceipt(false)}
        />
      )}

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

export default PaymentSuccessOnline;
