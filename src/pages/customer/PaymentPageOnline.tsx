import { useNavigate, useLocation } from "react-router";
import { Check, ArrowLeft, FileText } from "lucide-react";
import Button from "../../components/ui/Button";
import { useCartStore } from "../../store/useCartStore";
import QRCodeOnline from "../../components/QRCodeOnline/QRCodeOnline";
import { useState } from "react";
import OrderSummaryOnline from "../../components/OrderSummaryOnline/OrderSummaryOnline";
import ExpiredModalFinal from "../../components/ExpiredModalFinal/ExpiredModalFinal";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { useOrderStore } from "../../store/useOrderStore";
// import { useMenuStore } from "../../store/useMenuStore";
// import { orderAPI } from "../../api/order.api";

const PaymentPageOnline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { reduceStock } = useMenuStore();
  const { items, clearCart } = useCartStore();
  const [isExpired, setIsExpired] = useState(false);
  const { addOrder } = useOrderStore();
  const { removeCheckedItems } = useCartStore();

  const {
    orderId = "260401205",
    finalPayment = 0,
    subTotal = 0,
    discountAmount = 0,
    adminFee = 0,
    address = "",
  } = location.state || {};
  console.log(" PaymentPage - finalPayment:", finalPayment);
  console.log(" PaymentPage - subTotal:", subTotal);
  console.log(" PaymentPage - discountAmount:", discountAmount);

  const handlePaymentSuccess = async () => {
    // ← tambah async
    const selectedItems = items.filter((i) => i.checked);

    try {
      // 2. Potong stok di database master
      // reduceStock(selectedItems.map((i) => ({ id: i.id, qty: i.qty })));

      // 3. Simpan ke riwayat pesanan
      addOrder({
        orderId,
        address,
        items: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          notes: item.notes,
          image: item.image,
        })),
        finalPayment: Number(finalPayment),
        status: "proses",
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

      // 4. Bersihkan keranjang dan pindah halaman
      removeCheckedItems();
      navigate("/customer/payment-success", {
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
    } catch (error: any) {
      console.error("Gagal validasi pembayaran:", error);
      alert(error.response?.data?.message || "Pembayaran gagal divalidasi");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header mode="online" />

      <div className="bg-white border-b border-gray-100 shadow-sm mb-3 w-full">
        <div className="w-full py-3 px-4 md:px-12 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Pembayaran</h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-12 mt-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Check size={32} strokeWidth={4} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black">
            Pesanan Berhasil Dibuat!
          </h2>
          <p className="text-gray-400">Silakan lakukan pembayaran via QRIS</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[#F9F5FB] rounded-xl p-5 border border-primary/10">
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-gray-400 text-sm">ID Pesanan</span>
              <span className="text-primary font-bold">#{orderId}</span>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <QRCodeOnline
                finalPayment={Number(finalPayment) || 0}
                onExpire={() => setIsExpired(true)}
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-full text-white">
                <FileText size={16} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-xl">Ringkasan Pesanan</h3>
            </div>

            <div className="text-gray-600 space-y-3 mb-4">
              {items
                .filter((item) => item.checked)
                .map((item) => (
                  <div
                    key={item.cartId}
                    className="flex justify-between items-start"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-black">
                        {item.name} x{item.qty}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <FileText size={13} className="shrink-0 opacity-70" />
                        <span>{item.notes || "Tidak ada"}</span>
                      </div>
                    </div>
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
              finalPayment={finalPayment}
              hideAlertInfo={true}
            />

            <Button
              onClick={handlePaymentSuccess}
              className="w-full py-3 rounded-full text-lg font-bold shadow-lg mt-8 bg-primary text-white active:scale-95 transition-all"
            >
              Sudah Bayar
            </Button>
          </div>
        </div>
      </main>

      {isExpired && (
        <ExpiredModalFinal
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
