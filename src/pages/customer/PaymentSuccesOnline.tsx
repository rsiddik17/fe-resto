import { useNavigate, useLocation } from "react-router";
import { Check, Clock, ArrowLeft, FileText } from "lucide-react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import Button from "../../components/ui/Button";
import OrderSummaryOnline from "../../components/OrderSummaryOnline/OrderSummaryOnline";

const PaymentSuccessOnline = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mengambil data dari state navigasi yang dikirim oleh PaymentPageOnline
  const {
    orderId = "260401205",
    finalPayment = 0,
    subTotal = 0,
    discountAmount = 0,
    adminFee = 0,
    purchasedItems = [], // Data item yang dibeli diambil dari sini
  } = location.state || {};

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header mode="online" />

      {/* Navigasi Back Bar */}
      <div className="bg-white p-5 flex rounded-2xl items-center gap-3 border-b border-gray-100 shadow-sm mb-3">
        <button onClick={() => navigate("/customer/menu")}>
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="text-xl font-bold text-black">Pembayaran</h1>
      </div>

      <main className="max-w-2xl mx-auto px-6 flex flex-col items-center">
        {/* Ikon Ceklis Ungu */}
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <Check size={32} strokeWidth={4} className="text-white" />
        </div>

        <h2 className="text-2xl font-bold text-black mb-1 font-sans">
          Terima Kasih!
        </h2>
        <p className="text-gray-400 mb-8">Pesanan anda berhasil</p>

        {/* Card ID & Total */}
        <div className="w-full bg-[#F9F5FB] rounded-2xl p-6 mb-4 border border-primary/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-sm">ID Pesanan</span>
            <span className="text-primary font-bold text-sm">#{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Total Pembayaran</span>
            <span className="text-primary font-bold text-sm">
              Rp{finalPayment.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Banner Pesanan Sedang Diproses */}
        <div className="w-full bg-[#EBF5EB] border border-[#D5EBD5] rounded-xl p-6 flex flex-col items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Clock size={24} className="text-[#689F38]" />
          </div>
          <h3 className="font-bold text-[#388E3C]">Pesanan Sedang Diproses</h3>
          <p className="text-xs text-[#4CAF50] text-center leading-relaxed">
            Pesanan Anda sedang diproses. Silakan tunggu, pesanan akan segera
            disiapkan.
          </p>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="w-full text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <FileText size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-lg text-black">Ringkasan Pesanan</h3>
          </div>

          <div className="text-gray-700 space-y-4 mb-4 pl-1">
            {purchasedItems.map((item: any) => (
              <div
                key={item.cartId}
                className="flex justify-between items-start text-base"
              >
                {/* Sisi Kiri: Nama dan Catatan */}
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-black">
                    {item.name} x{item.qty}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FileText size={13} className="shrink-0 opacity-70" />
                    <span>{item.notes || "Tidak ada"}</span>
                  </div>
                </div>

                {/* Sisi Kanan: Harga */}
                <span className="font-medium text-black">
                  Rp{(item.price * item.qty).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <OrderSummaryOnline
            subTotal={subTotal}
            discountAmount={discountAmount}
            adminFee={adminFee}
            hideAlertInfo={true}
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 w-full mt-10">
          <Button
            onClick={() => navigate("/customer/pesanan")}
            className="flex-1 py-4 rounded-full font-bold text-base bg-primary text-white shadow-md active:scale-95 transition-all"
          >
            Pantau Pesanan
          </Button>
          <Button className="flex-1 py-4 rounded-full font-bold text-base bg-primary text-white shadow-md active:scale-95 transition-all">
            Lihat Struk
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccessOnline;