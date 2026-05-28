import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import PaymentConfirmationModal from "../../components/Modal/PaymentConfirmationModal";
import PaymentBankSelector from "../../components/PaymentBankSelector/PaymentBankSelector";
import PaymentOrderDetailCard from "../../components/Card/PaymentOrderDetailCard"; // <--- Import Card Baru
import InfoIcon from "../../components/Icon/InfoIcon";
import Toast from "../../components/Toast/Toast";
import { useCartStore } from "../../store/useCartStore";
import { useProfile } from "../../hooks/useProfile";

// Import API
import { orderAPI } from "../../api/order.api";
import Loading from "../../components/Loading/Loading";

const CashierPaymentValidationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedOrder = location.state?.dataOrder;

  const { clearCart } = useCartStore();

  // State
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [otherBankName, setOtherBankName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE TOAST ---
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

  const handleConfirmValidation = async () => {
    if (!passedOrder?.id) {
      triggerToast("ID Pesanan tidak valid", "error");
      return;
    }

    // Tentukan nama bank final
    const finalBankName = selectedBank === "Lainnya" ? otherBankName : selectedBank;

    try {
      setIsSubmitting(true);
      
      // 1. Panggil API Validasi
      const response = await orderAPI.validatePayment(passedOrder.id, finalBankName);
      
      if (response.success) {
        setIsModalOpen(false);
        clearCart();
        
        triggerToast("Pembayaran berhasil divalidasi!", "success");

        // 2. Beri jeda agar Toast terlihat, lalu arahkan ke Order List
        setTimeout(() => {
          navigate("/cashier/order-list");
        }, 2000);
      } else {
        triggerToast(response.message || "Gagal memvalidasi", "error");
        setIsModalOpen(false);
      }

    } catch (error: any) {
      console.error("Error validasi pembayaran:", error);
      triggerToast(error.response?.data?.message || "Gagal memvalidasi pembayaran", "error");
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { firstName, roleName } = useProfile();

  if (!passedOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p>Data pesanan tidak ditemukan.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary underline">Kembali</button>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-6 mx-4 lg:mx-0">
        <DashboardHeader
          title="Daftar Pesanan"
          subtitle="Ringkasan data pesanan dan aktivitas restoran"
          userName={firstName}
          roleName={roleName}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-1 lg:pt-1 pb-0 lg:pb-0 px-4 lg:px-8">
        <div className="bg-white rounded-md shadow-sm border min-h-[83vh] border-gray-100 p-3 flex flex-col flex-1">
          {/* Tombol Kembali & Judul */}
          <div className="flex items-center gap-1 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-black hover:text-primary/80 transition-colors cursor-pointer group"
            >
              <ArrowLeft
                size={20}
                strokeWidth={2}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
            <h2 className="font-bold text-base md:text-lg">
              Validasi Pembayaran
            </h2>
          </div>

          {/* GRID 2 KOLOM KIRI (Order) & KANAN (Aksi) */}
          <div className="flex flex-col lg:flex-row gap-4 flex-1 items-stretch">
            {/* === KOLOM KIRI: COMPONENT CARD DETAIL ORDER === */}
            <div className="w-full lg:w-[50%] flex flex-col">
              {/* Panggil komponen di sini. Bersih banget! */}
              <PaymentOrderDetailCard passedOrder={passedOrder} />
            </div>

            {/* === KOLOM KANAN: BANK & AKSI === */}
            <div className="w-full lg:w-[50%] flex flex-col justify-between">
              <div>
                <PaymentBankSelector
                  selectedBank={selectedBank}
                  onSelectBank={setSelectedBank}
                  otherBankName={otherBankName}
                  onOtherBankNameChange={setOtherBankName}
                />
              </div>

              {/* Bagian Bawah Kanan: Info & Tombol Aksi (Terdorong ke bawah) */}
              <div className="flex flex-col gap-7 mt-4 md:mt-auto">
                <div className="bg-[#FF9100]/25 border-[1.35px] border-[#FF9100] rounded-sm py-2 px-7 flex items-start gap-3">
                  <div className="text-[#FF9100] mt-0.5 shrink-0">
                    <InfoIcon
                      className="bg-[#FF9100] text-white rounded-full w-5 h-5"
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="text-[#FF9100] text-xs leading-relaxed font-medium">
                    Silakan cek mutasi pembayaran pada sistem merchant QRIS
                    sebelum memvalidasi transaksi ini.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-[0.9] bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 w-full font-bold text-sm md:text-sm lg:text-sm py-3 rounded-sm transition-colors cursor-pointer"
                  >
                    Batalkan Pesanan
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    // Disabled jika belum pilih bank
                    disabled={
                      isSubmitting ||
                      !selectedBank ||
                      (selectedBank === "Lainnya" && !otherBankName)
                    }
                    className="flex-1 bg-primary w-full text-white font-bold text-sm md:text-sm lg:text-sm py-3 rounded-sm hover:bg-primary-hover transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Memproses..." : "Pembayaran Diterima"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmValidation}
      />

      <Toast show={toast.show} message={toast.message} type={toast.type} />
      <Loading show={isSubmitting} message="Memvalidasi..." />
    </>
  );
};

export default CashierPaymentValidationPage;
