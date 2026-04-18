import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import OrderItemCard from "../../components/OrderItemCard/OrderItemCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import { useCartStore } from "../../store/useCartStore";
import DiscountModal from "../../components/DiscountModal/DiscountModal";

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Ambil data keranjang dari Zustand
  const { items, getTotalPrice } = useCartStore();
  const subTotal = getTotalPrice();

  // STATE HALAMAN CHECKOUT
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Proteksi: Jika keranjang kosong, paksa kembali ke Menu
  useEffect(() => {
    if (items.length === 0) {
      navigate("/kiosk/menu");
    }
  }, [items, navigate]);

  const handleBack = () => {
    navigate("/kiosk/keranjang"); // Kembali ke halaman keranjang untuk edit
  };

  const handleConfirmOrder = () => {
    // --- DI SINI NANTI TEMPAT MENEMBAK API ---
    // Kalkulasi final sebelum dikirim ke backend
    const taxRate = 10;
    const taxAmount = subTotal * (taxRate / 100);
    const grandTotal = subTotal + taxAmount - discountAmount;

    // Menyiapkan Payload (Data yang dikirim ke Backend)
    const payload = {
      table_number: "Meja 02",
      sub_total: subTotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      items: items.map((item) => ({
        menu_id: item.id,
        name: item.name,
        qty: item.qty,
        notes: item.notes,
        price: item.price
      })),
    };

    console.log("MENGIRIM DATA KE BACKEND:", payload);
    
    // Simulasi sukses bayar, pindah ke halaman Sukses
    // alert("Berhasil! Silakan cek console untuk melihat Payload API-nya.");
    navigate("/kiosk/pembayaran", {
      state: { discountAmount }
    }); 
  };

  // Jangan render apa-apa selama useEffect sedang memproses redirect (kalau kosong)
  if (items.length === 0) return null; 

  return (
    <div className="min-h-screen bg-white pb-16 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-0 pt-6">
        
        {/* --- HEADER CHECKOUT --- */}
        <div className="border-b border-gray-100 pb-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-3xl font-bold mb-1"
          >
            <ArrowLeft size={24} strokeWidth={3} /> Ringkasan Pesanan
          </button>
          
          <div className="mt-1">
            <p className="text-gray text-xl mb-2">Nomor meja</p>
            <p className="font-extrabold text-primary text-2xl">Meja 02</p>
          </div>
        </div>

        {/* --- LIST ITEM (READ ONLY) --- */}
        <div className="flex flex-col mb-2">
          {items.map((item) => (
            <OrderItemCard key={item.cartId} item={item} />
          ))}
        </div>

        {/* --- RINGKASAN HARGA (SUBTOTAL & PPN) --- */}
        {/* Kita melempar subTotal dari Zustand dan discountAmount dari Local State */}
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
                className="w-full py-3 rounded-md font-bold border-2 border-primary text-primary flex items-center justify-center gap-2 hover:bg-primary/5"
              >
                <Plus size={20} strokeWidth={3} /> Tambah Diskon
              </Button>
            ) : (
              // TOMBOL BATALKAN DISKON
              <Button
                onClick={() => setDiscountAmount(0)}
                variant="outline"
                className="w-full py-3 rounded-lg font-bold text-lg border-2 border-gray-200 text-gray-400 hover:bg-gray-50"
              >
                Batalkan Diskon
              </Button>
            )
          }
        />

      </main>

      {/* --- STICKY BOTTOM BAR (TOMBOL KONFIRMASI) --- */}
        <div className="w-full max-w-xl mx-auto">
          <Button 
            onClick={handleConfirmOrder} 
            className="w-full py-4 rounded-full font-bold text-lg shadow-md"
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

export default CheckoutPage;