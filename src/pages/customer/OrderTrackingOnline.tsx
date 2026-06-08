import { useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, UtensilsCrossed, Bike } from "lucide-react";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { useEffect, useState } from "react";
import { cn } from "../../utils/utils";
import { orderAPI } from "../../api/order.api";

interface Order {
  orderId: string;
  address: string;
  items: any[];
  finalPayment: number;
  subTotal: number;
  discountAmount: number;
  adminFee: number;
  status: "pending" | "proses" | "dimasak" | "diantar" | "diterima" | "selesai";
  date: string;
}

// Helper function untuk ambil alamat dari object atau string
const getAddressString = (address: any): string => {
  if (!address) return "Alamat tidak tersedia";
  if (typeof address === "string") return address;
  return address.detail || address.address_name || "Alamat tidak tersedia";
};

const OrderTrackingOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil order dari state dengan berbagai kemungkinan struktur
  const orderFromState = location.state?.order || location.state;
  const orderId = orderFromState?.orderId || orderFromState?.id || id;

  const fetchOrderDetail = async () => {
    // Jika sudah punya data lengkap dari state, pakai langsung
    if (orderFromState && orderFromState.orderId) {
      const mappedOrder: Order = {
        orderId: orderFromState.orderId,
        // 🔥 PERBAIKAN: pakai orderFromState, bukan orderData
        address: getAddressString(orderFromState.address),
        items: orderFromState.items || [],
        finalPayment:
          orderFromState.finalPayment || orderFromState.grand_total_amount || 0,
        subTotal: orderFromState.subTotal || orderFromState.total_amount || 0,
        discountAmount:
          orderFromState.discountAmount || orderFromState.discount_amount || 0,
        adminFee: orderFromState.adminFee || 0,
        status: (orderFromState.status || "").toLowerCase(),
        date: orderFromState.date || new Date().toLocaleString("id-ID"),
      };
      setCurrentOrder(mappedOrder);
      setLoading(false);
      return;
    }

    if (!orderId) {
      setError("ID Pesanan tidak ditemukan");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await orderAPI.getMyOrderById(orderId);
      const orderData = response.data || response.order || response;

      const mappedOrder: Order = {
        orderId: orderData.id || orderData.orderId,
        // 🔥 PERBAIKAN: gunakan helper function
        address: getAddressString(orderData.address),
        items: (orderData.order_items || []).map((item: any) => ({
          name: item.menu?.name || item.name,
          qty: item.quantity,
          price: Number(item.sub_total || item.price || 0),
          notes: item.notes || "",
        })),
        finalPayment: Number(
          orderData.grand_total_amount || orderData.finalPayment || 0,
        ),
        subTotal: Number(orderData.total_amount || orderData.subTotal || 0),
        discountAmount: Number(
          orderData.discount_amount || orderData.discountAmount || 0,
        ),
        adminFee: 0,
        status: (orderData.status || "").toLowerCase(),
        date: orderData.created_at
          ? new Date(orderData.created_at).toLocaleString("id-ID")
          : orderData.date || new Date().toLocaleString("id-ID"),
      };

      setCurrentOrder(mappedOrder);
    } catch (err: any) {
      console.error("Gagal mengambil detail pesanan:", err);
      setError(err.message || "Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();

    const interval = setInterval(() => {
      if (orderId && currentOrder?.status !== "selesai" && !orderFromState) {
        fetchOrderDetail();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Status tracking logic
  const status = (currentOrder?.status || "").toString().trim().toLowerCase();

  const isDimasakActive =
    status === "proses" ||
    status === "dimasak" ||
    status === "diantar" ||
    status === "diterima" ||
    status === "selesai";
  const isDiantarActive =
    status === "diantar" || status === "diterima" || status === "selesai";

  let progressWidth = "0%";
if (status === "pending") progressWidth = "0%";  // atau "10%" kalau mau sedikit
if (status === "proses") progressWidth = "25%";
if (status === "dimasak") progressWidth = "50%";
if (status === "diantar") progressWidth = "75%";
if (status === "diterima" || status === "selesai") progressWidth = "100%";

  let bannerText = "Pesanan Anda sedang diproses sistem";
  if (status === "pending") bannerText = "Menunggu konfirmasi pembayaran";
  else if (status === "proses" || status === "dimasak")
    bannerText = "Pesanan Anda sedang dimasak";
  else if (status === "diantar")
    bannerText = "Pesanan Anda sedang diantar menuju lokasi Anda";
  else if (status === "diterima" || status === "selesai")
    bannerText = "Pesanan telah sampai! Selamat menikmati";

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header mode="online" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Memuat detail pesanan...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-white">
        <Header mode="online" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 hover:text-primary transition-colors"
          >
            <ArrowLeft size={24} className="text-black font-bold" />
            <h1 className="text-2xl font-extrabold text-black">
              Status Pesanan
            </h1>
          </button>
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">
              {error || "Pesanan tidak ditemukan"}
            </p>
            <button
              onClick={fetchOrderDetail}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
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
        <div className="relative max-w-4xl mx-auto mb-20 px-2 sm:px-4">
          <div className="absolute top-10 left-0 right-0 h-1 z-0 px-4 sm:px-8">
            <div className="absolute inset-0 bg-gray-200 rounded-full" />
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: progressWidth }}
            />
          </div>

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

        {/* INFO BOX */}
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
