import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import CartItemCard from "../../components/CartItemCard/CartItemCard";
import { useCartStore } from "../../store/useCartStore";
import EditNoteModal from "../../components/EditNoteModal/EditNoteModal";
import { useState } from "react";

const CartPage = () => {
  const navigate = useNavigate();

  // Ambil state dan actions dari Zustand
  const { items, updateQty, getTotalItems, updateNote } = useCartStore();
  const totalItems = getTotalItems();

  const [editingNote, setEditingNote] = useState<{
    cartId: string;
    notes: string;
  } | null>(null);

  const handleBackToMenu = () => {
    navigate("/kiosk/menu");
  };

  const handleProceedToPayment = () => {
    // Nanti diarahkan ke halaman pembayaran
    // console.log("Lanjut bayar!");
    navigate("/kiosk/checkout");
  };

  const handleSaveNote = (newNote: string) => {
    if (editingNote) {
      updateNote(editingNote.cartId, newNote);
      setEditingNote(null); // Tutup modal
    }
  };

  return (
    <div className="min-h-screen bg-secondary/25 pb-14 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-0 pt-6">
        {/* --- JUDUL & TOMBOL KEMBALI --- */}
        <div className="mb-6">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 text-[28px] font-bold text-black hover:opacity-70 transition-opacity mb-1"
          >
            <ArrowLeft size={24} strokeWidth={3} /> Keranjang
          </button>
          {items.length > 0 && <p className="text-gray text-2xl ml-1">Meja-02</p>}
          {/* Nanti ini bisa dinamis dari state */}
        </div>

        {/* --- LIST ITEM KERANJANG --- */}
        {items.length > 0 ? (
          <>
            <Button
              onClick={handleBackToMenu}
              className="w-full py-3 rounded-full flex items-center justify-center gap-2 font-bold mb-6"
            >
              <Plus size={20} /> Tambah Menu
            </Button>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.cartId}
                  item={item}
                  onIncrease={(id) => updateQty(id, 1)}
                  onDecrease={(id) => updateQty(id, -1)}
                  onEditNote={(cartId, notes) =>
                    setEditingNote({ cartId, notes })
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center mt-10 md:mt-25">
            <img
              src="/images/keranjang-kosong.webp" // Pastikan kamu taruh gambar ilustrasinya di sini ya!
              alt="Keranjang Kosong"
              className="w-64 md:w-100 mb-8 opacity-90"
            />
            <p className="text-gray text-2xl mb-8 text-center">
              Keranjangmu masih kosong, yuk pilih menu!
            </p>
            <Button
              onClick={handleBackToMenu}
              className="px-8 w-full max-w-sm py-2.5 rounded-full flex justify-center items-center gap-2"
            >
              <Plus size={18} /> <span className="font-bold text-xl">Tambah Menu</span>
            </Button>
          </div>
        )}
      </main>

      {/* --- STICKY BOTTOM BAR --- */}
      {items.length > 0 && (
          <div className="w-full max-w-xl mx-auto">
            <Button
              onClick={handleProceedToPayment}
              className="w-full py-4 rounded-full font-bold text-lg"
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
      )}

      {/* RENDER MODAL EDIT CATATAN */}
      {editingNote && (
        <EditNoteModal
          initialNote={editingNote.notes}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
};

export default CartPage;
