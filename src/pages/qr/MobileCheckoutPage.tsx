import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/OrderItemCard/OrderItemCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import DiscountModal from "../../components/DiscountModal/DiscountModal";
import { useCartStore } from "../../store/useCartStore";

const MobileCheckoutPage = () => {
  const navigate = useNavigate();

  // Ambil data keranjang dari Zustand
  const { items, getTotalPrice } = useCartStore();
  const subTotal = getTotalPrice();

  // STATE HALAMAN CHECKOUT
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Proteksi: Jika keranjang kosong, paksa kembali ke Menu Mobile
  useEffect(() => {
    if (items.length === 0) {
      navigate("/qr/menu");
    }
  }, [items, navigate]);

  const handleBack = () => {
    navigate("/qr/cart"); // Kembali ke keranjang mobile
  };

  const handleConfirmOrder = () => {
    // Kalkulasi final
    const taxRate = 10;
    const taxAmount = subTotal * (taxRate / 100);
    const grandTotal = subTotal + taxAmount - discountAmount;

    const payload = {
      table_number: "Meja 03", // Nanti dinamis
      sub_total: subTotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      items: items.map((item) => ({
        menu_id: item.id,
        name: item.name,
        qty: item.qty,
        notes: item.notes,
        price: item.price,
      })),
    };

    console.log("MENGIRIM DATA KE BACKEND (MOBILE):", payload);

    // Arahkan ke rute pembayaran mobile
    navigate("/qr/payment", {
      state: { discountAmount },
    });
  };

  if (items.length === 0) return null;

  return (
    // pb-28 agar konten paling bawah tidak tertutup oleh tombol sticky
    <div className="min-h-screen bg-white pb-12  relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-4">
        {/* --- HEADER CHECKOUT --- */}
        <div className="border-b border-gray-200 pb-2 mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xl font-bold mb-2"
          >
            <ArrowLeft size={24} strokeWidth={2.5} /> Ringkasan Pesanan
          </button>

          <div className="mt-1">
            <p className="text-gray-500">Nomor meja</p>
            <p className="font-bold text-primary">Meja 03</p>
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
                className="w-full py-2.5 rounded-lg text-sm font-bold border-2 border-primary text-primary flex items-center justify-center gap-2 hover:bg-primary/5 mt-2"
              >
                <Plus size={18} strokeWidth={3} /> Tambah Diskon
              </Button>
            ) : (
              // TOMBOL BATALKAN DISKON
              <Button
                onClick={() => setDiscountAmount(0)}
                variant="outline"
                className="w-full py-2.5 rounded-lg text-sm font-bold border border-gray-300 text-gray-500 hover:bg-gray-50 mt-2"
              >
                Batalkan Diskon
              </Button>
            )
          }
        />
      </main>

      {/* --- STICKY BOTTOM BAR (TOMBOL KONFIRMASI) --- */}
        <div className="w-full max-w-sm mx-auto">
          <Button
            onClick={handleConfirmOrder}
            className="w-full py-1.5 rounded-xl font-bold text-base"
          >
            Konfirmasi Pesanan
          </Button>
      </div>

      {/* RENDER MODAL DISKON */}
      {isModalOpen && (
        <DiscountModal
          onClose={() => setIsModalOpen(false)}
          onApply={(amount) => setDiscountAmount(amount)}
          subTotal={subTotal}
        />
      )}
    </div>
  );
};

export default MobileCheckoutPage;
