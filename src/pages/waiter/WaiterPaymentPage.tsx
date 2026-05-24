import { useNavigate, useLocation } from "react-router";
import { Check } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Button from "../../components/ui/Button";
import WaiterQRCodeBox from "../../components/QRCodeBox/WaiterQRCodeBox";
import WaiterReceiptItemCard from "../../components/Card/WaiterReceiptItemCard";
import { useCartStore } from "../../store/useCartStore";
import { useEffect, useState } from "react";
import ExpiredModal from "../../components/Modal/ExpiredModal";
import { useAuthStore } from "../../store/useAuthStore";
import { profileAPI } from "../../api/profile.api";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const WaiterPaymentPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const location = useLocation();

  const [isExpiredOpen, setIsExpiredOpen] = useState(false);

  // Ambil state dari halaman sebelumnya, fallback default
  const tableNumber = location.state?.tableNumber
    ? `Meja ${location.state.tableNumber}`
    : "Meja 10";
  const orderId = location.state?.orderId || "#260412992";
  const discountAmount = location.state?.discountAmount || 15000; // Contoh Mock Diskon
  const adminFee = 92; // Sesuai desain Figma
  const taxRate = 10;

  // Data dari Store
  const { items, getTotalPrice, clearCart } = useCartStore();
  const subTotal = getTotalPrice();
  const taxAmount = subTotal * (taxRate / 100);
  const grandTotal = subTotal + taxAmount - discountAmount + adminFee;

  const handleFinishPayment = () => {
    clearCart(); // Kosongkan keranjang
    navigate("/waiter/dashboard"); // Kembali ke dashboard
  };

  useEffect(() => {
    if (!user) {
      const fetchProfile = async () => {
        try {
          const response = await profileAPI.getStaffProfile();
          if (response.success && response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Gagal mengambil data profil:", error);
        }
      };
      fetchProfile();
    }
  }, [user, setUser]);

  // Ekstrak nama depan untuk header
  const firstName = user?.fullname ? user.fullname.split(" ")[0] : "Memuat...";
  const roleName = user?.role === "WAITER" ? "Pelayan" : "Pelayan";

  return (
    <>
      <div className="pt-14 lg:pt-7 lg:pl-8 lg:pr-7 mx-4 lg:mx-0 shrink-0">
        <DashboardHeader
          title="" // Di desain tidak ada title khusus, kosongkan atau isi spasi
          userName={firstName}
          roleName={roleName}
        />
      </div>

      <div className="pt-1 lg:pt-1 pb-0 lg:pb-0 px-4 lg:px-8 flex flex-col">
        {/* KARTU PUTIH UTAMA (Bungkus 2 Kolom) */}
        <div className="bg-white rounded-t-sm shadow-sm border border-gray-100 p-3 flex flex-col md:flex-row gap-3 items-start">
          {/* --- KOLOM KIRI: QRIS AREA (Background Ungu Muda) --- */}
          <div className="w-full md:w-[50%] bg-[#F4ECF9] rounded-md p-3 mt-2 flex flex-col shrink-0">
            {/* Info Meja & ID */}
            <div className="flex flex-col gap-1 mt-2 mb-2.5">
              <div className="flex justify-between items-center text-[14.5px]">
                <span className="text-black/50">Nomor meja</span>
                <span className="font-bold text-primary">{tableNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[14.5px]">
                <span className="text-black/50">ID Pesanan</span>
                <span className="font-bold text-primary">{orderId}</span>
              </div>
            </div>

            {/* QR Component */}
            <WaiterQRCodeBox
              finalPayment={grandTotal}
              onExpire={() => setIsExpiredOpen(true)}
            />
          </div>

          {/* --- KOLOM KANAN: RINGKASAN PESANAN --- */}
          <div className="w-full md:w-[50%] py-4 px-1">
            {/* Header Success */}
            <div className="flex flex-col items-center text-center shrink-0 mb-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Check className="text-white w-8 h-8" strokeWidth={3} />
              </div>
              <h2 className="text-[18.5px] font-bold mb-1">
                Pesanan Berhasil Dibuat!
              </h2>
              <p className="text-black/50 text-[16.5px]">
                Silakan lakukan pembayaran via QRIS
              </p>
            </div>

            {/* Title Ringkasan */}
            <h3 className="font-bold text-[16.5px] text-black shrink-0">
              Ringkasan Pesanan
            </h3>

            {/* Area List Item (Bisa di-scroll jika item banyak) */}
            <div className="flex flex-col">
              {items.map((item) => (
                <WaiterReceiptItemCard key={item.cartId} item={item} />
              ))}
            </div>

            {/* Area Subtotal & Button (Selalu fixed di bawah) */}
            <div className="shrink-0 flex flex-col text-[16px] mt-1">
              <div className="flex justify-between">
                <span>Total Pesanan</span>
                <span>{rupiahFormatter.format(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN {taxRate}%</span>
                <span>{rupiahFormatter.format(taxAmount)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span>-{rupiahFormatter.format(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between mb-1">
                <span>Biaya Admin</span>
                <span>Rp{adminFee}</span>
              </div>

              {/* Total Pembayaran Akhir */}
              <div className="flex justify-between items-center pt-1 mb-4 border-t border-gray-100">
                <span className="font-bold text-[17px]">Total Pembayaran</span>
                <span className="font-bold text-[17px]">
                  {rupiahFormatter.format(grandTotal)}
                </span>
              </div>

              {/* Tombol Sudah Bayar */}
              <div className="flex justify-center">
                <Button
                  onClick={handleFinishPayment}
                  className="w-full max-w-85 py-2 text-[15px] md:text-[15px] lg:text-[15px] font-bold rounded-full shadow-sm"
                >
                  Sudah Bayar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpiredOpen && (
        <ExpiredModal onClose={() => navigate("/waiter/dashboard")} />
      )}
    </>
  );
};

export default WaiterPaymentPage;
