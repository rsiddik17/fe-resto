import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/Card/OrderItemCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import DiscountModal from "../../components/Modal/DiscountModal";
import { useCartStore } from "../../store/useCartStore";

import { orderAPI, type CreateOrderPayload } from "../../api/order.api";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";

const MobileCheckoutPage = () => {
  const navigate = useNavigate();

  // Ambil data keranjang dari Zustand
  const { items, getTotalPrice, tableId, tableNumber } = useCartStore();
  const subTotal = getTotalPrice();

  // STATE HALAMAN CHECKOUT
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountId, setDiscountId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "error",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };
  
  // Proteksi: Jika keranjang kosong, paksa kembali ke Menu Mobile
  useEffect(() => {
    if (items.length === 0) {
      navigate("/qr/menu");
    }
  }, [items, navigate]);

  const handleBack = () => {
    navigate("/qr/cart"); // Kembali ke keranjang mobile
  };

  const handleConfirmOrder = async () => {
    if (!tableId) {
      triggerToast("Data meja tidak valid. Silakan scan ulang QR Code.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateOrderPayload = {
        source: "QR_SCAN",
        table_id: tableId,
        order_items: items.map((item) => ({
          menu_id: item.id,
          quantity: item.qty,
          notes: item.notes || "Tidak ada",
        })),
      };

      // Hanya masukkan discount_id ke dalam payload jika nilainya ada
      if (discountId) {
        payload.discount_id = discountId;
      }

      console.log("MENGIRIM DATA KE BACKEND (MOBILE):", payload);

      const response = await orderAPI.createOrder(payload);
      const backendOrderId = response.data.id;

      navigate("/qr/payment", {
        state: { 
          discountAmount,
          orderId: backendOrderId
        },
      });

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Gagal menghubungi server.";
      triggerToast(`Pesanan Gagal: ${errorMsg}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tableNo = tableNumber?.match(/\d+/)?.[0];

  if (items.length === 0) return null;

  return (
    // pb-28 agar konten paling bawah tidak tertutup oleh tombol sticky
    <div className="min-h-screen bg-white pb-4  relative flex flex-col">
      <Header />
      <Loading show={isSubmitting} />

      <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-4">
        {/* --- HEADER CHECKOUT --- */}
        <div className="border-b border-gray-200 pb-2 mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-lg font-bold md:text-2xl mb-2"
          >
            <ArrowLeft size={24} strokeWidth={2.5} /> Ringkasan Pesanan
          </button>

          <div className="mt-1 md:text-lg">
            <p className="text-gray-500">Nomor meja</p>
            <p className="font-bold text-primary">{tableNumber ? `Meja ${tableNo}` : "Meja --"}</p>
          </div>
        </div>

        {/* --- LIST ITEM (READ ONLY) --- */}
        <div className="flex flex-col mb-2">
          {items.map((item) => (
            <OrderItemCard key={item.cartId} item={item} />
          ))}
        </div>

        {/* --- RINGKASAN HARGA (SUBTOTAL & PPN) --- */}
        <OrderSummary
          subTotal={subTotal}
          taxRate={10}
          discountAmount={discountAmount}
          discountActionNode={
            discountAmount === 0 ? (
              // TOMBOL TAMBAH DISKON
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="w-full py-2 rounded-md text-sm font-bold border-2 border-primary text-primary flex items-center justify-center gap-2 hover:bg-primary/5 mt-2"
              >
                <Plus size={18} strokeWidth={3} /> Tambah Diskon
              </Button>
            ) : (
              // TOMBOL BATALKAN DISKON
              <Button
                onClick={() => { setDiscountAmount(0); setDiscountId(null); }}
                variant="outline"
                className="w-full py-2.5 rounded-lg text-sm font-bold border-[1.5px] border-gray-300 text-gray-500 hover:bg-gray-50 mt-2"
              >
                Batalkan Diskon
              </Button>
            )
          }
        />
      </main>

      {/* --- STICKY BOTTOM BAR (TOMBOL KONFIRMASI) --- */}
        <div className="w-full max-w-102 md:max-w-2xl lg:max-w-3xl mx-auto px-3 mt-4">
          <Button
            onClick={handleConfirmOrder}
            className="w-full py-1.75 md:py-2.25 lg:py-2 rounded-xl font-semibold text-base md:text-lg lg:text-base"
          >
            {isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
          </Button>
      </div>

      {/* RENDER MODAL DISKON */}
      {isModalOpen && (
        <DiscountModal
          onClose={() => setIsModalOpen(false)}
          onApply={(amount, id) => {
            setDiscountAmount(amount);
            setDiscountId(id);
            setIsModalOpen(false);
          }}
          subTotal={subTotal}
        />
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default MobileCheckoutPage;
