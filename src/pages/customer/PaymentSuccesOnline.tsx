import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Check, Clock, ArrowLeft, FileText } from "lucide-react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import Button from "../../components/ui/Button";
import OrderSummaryOnline from "../../components/OrderSummaryOnline/OrderSummaryOnline";
import OrderReceipt from "../../components/OrderRecipt/OrderRecipt";

const PaymentSuccessOnline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showReceipt, setShowReceipt] = useState(false);

  // Mengambil data dari navigasi sebelumnya
  const {
    orderId = "260401205",
    finalPayment = 0,
    subTotal = 0,
    discountAmount = 0,
    purchasedItems = [],
  } = location.state || {};

  // 1. Biaya admin dipaksa ke 205 sesuai permintaanmu
  const adminFee = 205;

  // 2. Hitung PPN 10% dari subtotal
  const calculatedPPN = subTotal * 0.1;

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      {/* Header & Nav tetap ada di background saat struk belum muncul */}
      <Header mode="online" />

      <div className="bg-white p-5 flex items-center gap-3 border-b border-gray-100 shadow-sm mb-3">
        <button onClick={() => navigate("/customer/menu")}>
          <ArrowLeft size={22} className="text-black" />
        </button>
        <h1 className="text-xl font-bold text-black">Pembayaran</h1>
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
              Rp{finalPayment.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="w-full bg-[#EBF5EB] border border-[#D5EBD5] rounded-xl p-6 flex flex-col items-center gap-2 mb-8 text-center">
          <Clock size={24} className="text-[#689F38]" />
          <h3 className="font-bold text-[#388E3C]">Pesanan Sedang Diproses</h3>
          <p className="text-xs text-[#4CAF50]">
            Pesanan Anda sedang diproses. Silakan tunggu.
          </p>
        </div>

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
            discountAmount={discountAmount}
            adminFee={adminFee}
            hideAlertInfo={true}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-10 px-4">
          <Button
            onClick={() => navigate("/customer/pesanan")}
            className="w-full sm:flex-1 py-4 rounded-full font-bold bg-primary text-white text-sm md:text-base"
          >
            Pantau Pesanan
          </Button>
          <Button
            onClick={() => setShowReceipt(true)}
            className="w-full sm:flex-1 py-4 rounded-full font-bold bg-primary text-white text-sm md:text-base"
          >
            Lihat Struk
          </Button>
        </div>
      </main>

      {/* 3. OVERLAY STRUK: 
        Muncul hanya saat showReceipt true. 
        Karena kita pakai OrderReceipt yang sudah aku perbaiki sebelumnya, 
        dia akan otomatis nutupin Navbar & Header dengan background blur.
      */}
      {showReceipt && (
        <OrderReceipt
          orderId={orderId}
          items={purchasedItems}
          subTotal={subTotal}
          ppn={subTotal * 0.1}
          adminFee={205}
          totalPrice={finalPayment} // <--- PASTIKAN ini variabel yang nilainya 22.205
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default PaymentSuccessOnline;
