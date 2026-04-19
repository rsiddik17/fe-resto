import { useNavigate, useLocation } from "react-router";
import { Check, ArrowLeft, FileText } from "lucide-react";
import Button from "../../components/ui/Button";
import { useCartStore } from "../../store/useCartStore";
import QRCodeOnline from "../../components/QRCodeOnline/QRCodeOnline";
import { useState } from "react";
import OrderSummaryOnline from "../../components/OrderSummaryOnline/OrderSummaryOnline";
import ExpiredModalOnline from "../../components/ExpiredModalOnline/ExpiredModalOnline";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { useOrderStore } from "../../store/useOrderStore";
import { useMenuStore } from "../../store/useMenuStore";
const PaymentPageOnline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reduceStock } = useMenuStore();
  const { items, clearCart } = useCartStore();
  const [isExpired, setIsExpired] = useState(false);
  const { addOrder } = useOrderStore();
  const { removeCheckedItems } = useCartStore();

  // Memastikan data memiliki nilai default angka agar toLocaleString tidak error
  const {
    orderId = "260401205",
    finalPayment = 0,
    subTotal = 0,
    discountAmount = 0,
    adminFee = 0,
    address = "",
  } = location.state || {};

  const handlePaymentSuccess = () => {
    const selectedItems = items.filter((i) => i.checked);

    // 1. Potong stok di database master
    reduceStock(selectedItems.map((i) => ({ id: i.id, qty: i.qty })));

    // 2. Simpan ke riwayat pesanan dengan data yang sudah "dikunci"
    addOrder({
      orderId,
      address,
      // Gunakan map agar data seperti gambar dan nama tersimpan permanen di riwayat
      items: selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        notes: item.notes,
        image: item.image, // Sangat penting agar modal detail tidak kosong gambarnya
      })),
      finalPayment: Number(finalPayment),
      status: "Dimasak",
      date: new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      subTotal: Number(subTotal),
      discountAmount: Number(discountAmount),
      adminFee: Number(adminFee),
    });

    // 3. Bersihkan keranjang dan pindah halaman
    removeCheckedItems();
    navigate("/customer/pembayaran-berhasil", {
      state: {
        orderId,
        finalPayment,
        subTotal,
        discountAmount,
        adminFee,
        address,
        purchasedItems: selectedItems,

        
      },
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header mode="online" />

      <div className="bg-white p-5 flex rounded-2xl items-center gap-3 border-b border-gray-100 shadow-sm mb-3">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-gray-50 p-1 rounded-full"
        >
          <ArrowLeft size={22} className="text-black font-bold" />
        </button>
        <h1 className="text-xl font-bold text-black">Pembayaran</h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 shadow-md">
            <Check size={30} strokeWidth={4} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black">
            Pesanan Berhasil Dibuat!
          </h2>
          <p className="text-gray-400">Silakan lakukan pembayaran via QRIS</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 bg-[#F9F5FB] rounded-xl p-6 border border-primary/10">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-gray-400 text-sm">ID Pesanan</span>
              <span className="text-primary font-bold">#{orderId}</span>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              {/* Mengirim nilai default 0 agar QRCodeOnline tidak crash */}
              <QRCodeOnline
                finalPayment={finalPayment || 0}
                onExpire={() => setIsExpired(true)}
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-full text-white">
                <FileText size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-xl">Ringkasan Pesanan</h3>
            </div>

            <div className="text-gray-600 space-y-4">
              {" "}
              {/* Pakai space-y-4 supaya antar menu ada jarak */}
              {items
                .filter((item) => item.checked)
                .map((item) => (
                  <div
                    key={item.cartId}
                    className="flex justify-between items-start"
                  >
                    {/* Sisi Kiri: Nama dan Catatan dibungkus div flex-col */}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-black">
                        {item.name} x{item.qty}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <FileText size={13} className="shrink-0 opacity-70" />
                        <span>{item.notes || "Tidak ada"}</span>
                      </div>
                    </div>

                    {/* Sisi Kanan: Harga tetap di pojok kanan */}
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

            <Button
              onClick={handlePaymentSuccess}
              className="w-full py-4 rounded-full text-lg font-bold shadow-lg mt-6 bg-primary text-white active:scale-95 transition-all"
            >
              Sudah Bayar
            </Button>
          </div>
        </div>
      </main>

      {isExpired && (
        <ExpiredModalOnline
          onClose={() => {
            clearCart();
            navigate("/customer/menu");
          }}
        />
      )}
    </div>
  );
};

export default PaymentPageOnline;
