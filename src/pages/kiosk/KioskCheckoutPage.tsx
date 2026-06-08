import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/Card/OrderItemCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import { useCartStore } from "../../store/useCartStore";
import DiscountModal from "../../components/Modal/DiscountModal";
import Loading from "../../components/Loading/Loading";
import Toast from "../../components/Toast/Toast";

import { orderAPI, type CreateOrderPayload } from "../../api/order.api";

const KioskCheckoutPage = () => {
  const navigate = useNavigate();  
  const { items, getTotalPrice, tableId, tableNumber } = useCartStore();
  const subTotal = getTotalPrice();

  // STATE HALAMAN CHECKOUT
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountId, setDiscountId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STATE TOAST ERROR
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "error",
  });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 4000);
  };

  // Proteksi: Jika keranjang kosong, paksa kembali ke Menu
  useEffect(() => {
    if (items.length === 0) {
      navigate("/kiosk/menu");
    }
  }, [items, navigate]);

  const handleBack = () => {
    navigate("/kiosk/cart"); 
  };

  // --- LOGIKA HIT API CREATE ORDER ---
  const handleConfirmOrder = async () => {
    if (!tableId) {
      triggerToast("Data meja tidak ditemukan. Silakan kembali ke awal.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      // 2. Siapkan Payload persis seperti JSON backend
      const payload: CreateOrderPayload = {
        source: "KIOSK",
        table_id: tableId,
        order_items: items.map((item) => ({
          menu_id: item.id,
          quantity: item.qty,
          notes: item.notes || "Tidak ada", // Pastikan tidak kosong sesuai struktur database
        })),
      };

      // Hanya masukkan discount_id ke dalam payload jika nilainya ada
      if (discountId) {
        payload.discount_id = discountId;
      }

      console.log("MENGIRIM DATA KE BACKEND:", payload);

      // 3. Tembak API!
      const response = await orderAPI.createOrder(payload);
      
      const backendOrderId = response.data.id; 
      // 4. Pindah ke halaman pembayaran dan bawa datanya
      navigate("/kiosk/payment", {
        state: { 
          discountAmount,
          orderId: backendOrderId // Bawa orderId asli ke halaman QRIS!
        }
      }); 

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Gagal menghubungi server.";
      triggerToast(`Pesanan Gagal: ${errorMsg}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tableNo = tableNumber?.match(/\d+/)?.[0];

  // Jangan render apa-apa selama useEffect sedang memproses redirect (kalau kosong)
  if (items.length === 0) return null; 

  return (
    <div className="min-h-screen bg-white pb-8 relative flex flex-col">
      <Header showProfile />
      <Loading show={isSubmitting} />

      <main className="flex-1 w-full px-4 max-w-full md:max-w-190 lg:max-w-4xl mx-auto pt-4 md:pt-6">
        
        {/* --- HEADER CHECKOUT --- */}
        <div className="border-b border-gray-100 pb-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-base md:text-[28px] lg:text-[22px] font-bold mb-1"
          >
            <ArrowLeft className="w-4.5 h-4.5 md:w-6 md:h-6" size={24} strokeWidth={3} /> Ringkasan Pesanan
          </button>
          
          <div className="mt-1">
            <p className="text-gray text-[15px] md:text-xl lg:text-lg mb-0.5 md:mb-2">Nomor meja</p>
            <p className="font-extrabold text-primary text-base md:text-2xl lg:text-xl">{tableNumber ? `Meja ${tableNo}` : "Meja --"}</p>
          </div>
        </div>

        {/* --- LIST ITEM (READ ONLY) --- */}
        <div className="flex flex-col mb-2">
          {items.map((item) => (
            <OrderItemCard key={item.cartId} item={item} />
          ))}
        </div>

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
                className="w-full py-1.75 md:py-2.5 lg:py-2.25 rounded-md font-bold border-2 border-primary text-primary text-sm md:text-base lg:text-[15px] flex items-center justify-center gap-2 hover:bg-primary/5"
              >
                <Plus className="w-4.5 h-4.5 md:w-6 md:h-6 lg:w-5 lg:h-5" size={20} strokeWidth={3} /> Tambah Diskon
              </Button>
            ) : (
              // TOMBOL BATALKAN DISKON
              <Button
                onClick={() => { setDiscountAmount(0); setDiscountId(null); }}
                variant="outline"
                className="w-full py-1.75 md:py-2.5 lg:py-2.25 rounded-md font-bold text-sm md:text-base border-2 border-gray-200 text-gray-400 hover:bg-gray-50"
              >
                Batalkan Diskon
              </Button>
            )
          }
        />

      </main>

      {/* --- STICKY BOTTOM BAR (TOMBOL KONFIRMASI) --- */}
        <div className="w-full max-w-78 md:max-w-150 mx-auto">
          <Button 
            onClick={handleConfirmOrder} 
            className="w-full mx-auto py-2 md:py-3 lg:py-2.5 rounded-full font-bold text-[14.5px] md:text-lg lg:text-base shadow-md"
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
          }}
          subTotal={subTotal}
        />
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
};

export default KioskCheckoutPage;