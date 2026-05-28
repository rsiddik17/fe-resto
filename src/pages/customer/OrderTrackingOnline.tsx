import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Check, UtensilsCrossed, Bike } from "lucide-react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { useEffect, useState } from "react";
import { useOrderStore } from "../../store/useOrderStore";
import { cn } from "../../utils/utils";

const OrderTrackingOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const { updateOrderStatus } = useOrderStore() as any;
  const [, setTick] = useState(0); // Membantu UI mereset tampilan saat state store berubah

  // Ambil status asli dari store secara real-time berdasarkan orderId agar transisinya kelihatan
  const { orders } = useOrderStore();
  const currentOrder =
    orders.find((o) => o.orderId === order?.orderId) || order;

  // Normalisasi status ke huruf kecil agar sinkron dengan store versi 10
  const s = (currentOrder?.status || "").toString().trim().toLowerCase();

  useEffect(() => {
    // Simulasi otomatis dinonaktifkan agar tidak merusak data default store Amalia.
    // Dengan begini, posisi bulatan pelacakan aman terkunci sesuai status asli menu!
  }, []);

  // TENTUKAN NYALA BULATAN & LEBAR GARIS SECARA DINAMIS
  const isDimasakActive =
    s === "dimasak" || s === "diantar" || s === "diterima" || s === "selesai";
  const isDiantarActive =
    s === "diantar" || s === "diterima" || s === "selesai";

  // Hitung lebar garis ungu secara presisi
  let progressWidth = "0%";
  if (s === "dimasak") progressWidth = "50%";
  if (s === "diantar" || s === "diterima" || s === "selesai")
    progressWidth = "100%";

  // Tentukan teks informasi banner bawah
  let bannerText = "Pesanan Anda sedang diproses sistem";
  if (s === "dimasak") {
    bannerText = "Pesanan Anda sedang dimasak";
  } else if (s === "diantar") {
    bannerText = "Pesanan Anda sedang diantar menuju lokasi Anda";
  } else if (s === "diterima" || s === "selesai") {
    bannerText = "Pesanan telah sampai! Selamat menikmati";
  }
  return (
    <div className="min-h-screen bg-white">
      <Header mode="online" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 hover:text-primary transition-colors"
        >
          <ArrowLeft size={24} className="text-black font-bold" />
          <h1 className="text-2xl font-extrabold text-black">Status Pesanan</h1>
        </button>
        <p className="text-gray-500 mb-12 text-sm">
          Pesanan Anda sedang diproses. Anda dapat memantau statusnya di halaman
          ini secara real-time.
        </p>
        {/* STEPPER TRACKING */}
        {/* STEPPER TRACKING */}
        <div className="relative max-w-4xl mx-auto mb-20 px-2 sm:px-4">
          {/* Progress Line */}
          <div className="absolute top-10 left-0 right-0 h-1 z-0 px-4 sm:px-8">
            <div className="absolute inset-0 bg-gray-200 rounded-full" />
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: progressWidth }}
            />
          </div>

          {/* ICONS STEPPER - pakai grid dengan 3 kolom */}
          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4">
            {/* Step 1: Pesanan Diterima */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-lg border-4 sm:border-[6px] border-white">
                <Check size={24} className="sm:w-9 sm:h-9" strokeWidth={4} />
              </div>
              <div className="mt-2 sm:mt-4">
                <h3 className="font-black text-gray-900 text-[11px] sm:text-[13px] leading-tight">
                  Pesanan Diterima
                </h3>
                <p className="text-[9px] sm:text-[12px] text-gray-400 mt-0.5 sm:mt-1 leading-tight">
                  Pembayaran berhasil dan pesanan telah diterima
                </p>
              </div>
            </div>

            {/* Step 2: Sedang Dimasak */}
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-lg border-4 sm:border-[6px] border-white transition-all duration-500",
                  isDimasakActive ? "bg-primary" : "bg-gray-200",
                )}
              >
                <UtensilsCrossed size={24} className="sm:w-8 sm:h-8" />
              </div>
              <div className="mt-2 sm:mt-4">
                <h3
                  className={cn(
                    "font-black text-[11px] sm:text-[13px] transition-colors duration-500 leading-tight",
                    isDimasakActive ? "text-gray-900" : "text-gray-300",
                  )}
                >
                  Sedang Dimasak
                </h3>
                <p className="text-[9px] sm:text-[12px] text-gray-400 mt-0.5 sm:mt-1 leading-tight">
                  Pesanan Anda sedang disiapkan oleh dapur
                </p>
              </div>
            </div>

            {/* Step 3: Sedang Diantar */}
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-lg border-4 sm:border-[6px] border-white transition-all duration-500",
                  isDiantarActive ? "bg-primary" : "bg-gray-200",
                )}
              >
                <Bike size={24} className="sm:w-8 sm:h-8" />
              </div>
              <div className="mt-2 sm:mt-4">
                <h3
                  className={cn(
                    "font-black text-[11px] sm:text-[13px] transition-colors duration-500 leading-tight",
                    isDiantarActive ? "text-gray-900" : "text-gray-300",
                  )}
                >
                  Sedang Diantar
                </h3>
                <p className="text-[9px] sm:text-[12px] text-gray-400 mt-0.5 sm:mt-1 leading-tight">
                  Pesanan sedang dikirim ke alamat tujuan
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* STATUS BADGE DINAMIS */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#F3E8F3] px-8 py-3 rounded-full flex items-center gap-2 border border-purple-100 shadow-sm">
            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            <p className="text-primary text-xs sm:text-sm font-black tracking-wide">
              Status saat ini: {bannerText}
            </p>
          </div>
        </div>
        {/* INFO BOX (ID & TANGGAL) */}
        <div className="max-w-2xl mx-auto bg-[#F3E8F3]/30 border border-primary/5 rounded-3xl p-6 mb-8 flex justify-around text-center">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              ID Pesanan
            </p>
            <p className="font-black text-gray-900 text-lg">
              #{currentOrder?.orderId || "-"}
            </p>
          </div>
          <div className="w-px bg-purple-100 h-10 self-center" />
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Tanggal & Jam
            </p>
            <p className="font-black text-gray-900 text-sm">
              {currentOrder?.date || "-"}
            </p>
          </div>
        </div>
        {/* DETAIL ALAMAT */}
        <div className="text-center max-w-xl mx-auto bg-gray-50/60 p-5 rounded-2xl border border-gray-100">
          <h4 className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mb-2">
            Detail Alamat Pengiriman
          </h4>
          <p className="text-gray-800 text-[13px] leading-relaxed font-medium">
            {currentOrder?.address || "Alamat tidak ditemukan"}
          </p>
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingOnline;
