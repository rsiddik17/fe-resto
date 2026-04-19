import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Check, UtensilsCrossed, Bike } from "lucide-react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { useEffect } from "react";
import { useOrderStore } from "../../store/useOrderStore";
const OrderTrackingOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const { updateOrderStatus } = useOrderStore() as any;
  useEffect(() => {
    // Simulasi: Setelah 5 detik di halaman ini, pesanan otomatis SELESAI
    const timer = setTimeout(() => {
      if (order && order.status !== "Selesai") {
        updateOrderStatus(order.orderId, "Selesai");
        console.log("Status otomatis berubah jadi Selesai!");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [order, updateOrderStatus]);
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

        <p className="text-black mb-12">
          Pesanan Anda sedang diproses. Anda dapat memantau statusnya di halaman
          ini.
        </p>

        {/* STEPPER TRACKING - PERBAIKAN TOTAL DI SINI */}
        <div className="relative max-w-4xl mx-auto mb-20 px-4">
          {/* CONTAINER GARIS (Wrapper khusus garis agar z-index aman) */}
          <div className="absolute top-10 left-[15%] right-[15%] h-1 z-0">
            {/* Garis Abu-abu (Dasar) */}
            <div className="absolute inset-0 bg-gray-200 rounded-full" />

            {/* Garis Ungu (Progress) */}
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: order?.status === "Selesai" ? "100%" : "50%",
              }}
            />
          </div>

          {/* IKON-IKON STEPPER */}
          <div className="relative z-10 flex justify-between items-start">
            {/* Step 1 */}
            <div className="flex flex-col items-center w-32">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-lg border-[6px] border-white">
                <Check size={36} strokeWidth={4} />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-black text-[15px]">
                  Pesanan Diterima
                </h3>
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                  Pembayaran berhasil dan pesanan telah diterima
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center w-32">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg border-[6px] border-white transition-all duration-500 ${order?.status === "Dimasak" || order?.status === "Selesai" ? "bg-primary" : "bg-gray-200"}`}
              >
                <UtensilsCrossed size={32} />
              </div>
              <div className="mt-4 text-center">
                <h3
                  className={`font-bold text-[15px] ${order?.status === "Dimasak" || order?.status === "Selesai" ? "text-black" : "text-gray-300"}`}
                >
                  Sedang Dimasak
                </h3>
                <p className="text-[12px] text-gray-400 mt-1 leading-tight">
                  Pesanan Anda sedang dimasak
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center w-32">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg border-[6px] border-white transition-all duration-500 ${order?.status === "Selesai" ? "bg-primary" : "bg-gray-200"}`}
              >
                <Bike size={32} />
              </div>
              <div className="mt-4 text-center">
                <h3
                  className={`font-bold text-[15px] ${order?.status === "Selesai" ? "text-black" : "text-gray-300"}`}
                >
                  Sedang Diantar
                </h3>
                <p className="text-[12px] text-gray-400 mt-1 leading-tight">
                  Pesanan sedang dikirim ke alamat tujuan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#F3E8F3] px-8 py-3 rounded-full flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-primary rounded-full " />
            <p className="text-primary text-sm">
              Status saat ini: Pesanan anda sedang{" "}
              {order?.status?.toLowerCase() || "diproses"}
            </p>
          </div>
        </div>

        {/* INFO BOX (ID & TANGGAL) */}
        <div className="max-w-2xl mx-auto bg-[#F3E8F3]/50 rounded-3xl p-8 mb-8 flex justify-around text-center">
          <div>
            <p className="text-black text-xs font-medium mb-1 ">ID Pesanan</p>
            <p className="font-bold text-black text-xl">
              {order?.orderId || "-"}
            </p>
          </div>
          <div className="w-px bg-purple-200 h-12 self-center" />
          <div>
            <p className="text-black text-xs font-medium mb-1 ">
              Tanggal & Jam Pemesanan
            </p>
            <p className="font-bold text-black text-xl">{order?.date || "-"}</p>
          </div>
        </div>

        {/* DETAIL ALAMAT */}
        <div className="text-center max-w-xl mx-auto bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <h4 className=" text-black text-lg mb-2">Detail Alamat</h4>
          <p className="text-black text-[14px] leading-relaxed font-bold">
            {order?.address || "Alamat tidak ditemukan"}
          </p>
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingOnline;
