import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import CartItemCard from "../../components/CartItemCard/CartItemCard";
import EditNoteModal from "../../components/EditNoteModal/EditNoteModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import { useCartStore } from "../../store/useCartStore";

const MobileCartPage = () => {
  const navigate = useNavigate();

  // Ambil state dan actions dari Zustand
  const { items, updateQty, updateNote, removeItem } = useCartStore();

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<{ cartId: string; notes: string } | null>(null);

  const handleBackToMenu = () => {
    navigate("/qr/menu");
  };

  const handleProceedToPayment = () => {
    navigate("/qr/checkout"); // Sesuaikan rute checkout mobile nanti
  };

  const handleSaveNote = (newNote: string) => {
    if (editingNote) {
      updateNote(editingNote.cartId, newNote);
      setEditingNote(null);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/25 pb-12 relative flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6">
        {/* --- JUDUL & INFO MEJA --- */}
        <div className="mb-5">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 text-xl font-bold text-black mb-1"
          >
            <ArrowLeft size={24} strokeWidth={2.5} /> Keranjang
          </button>
          <p className="text-gray-500 text-base ml-0">Meja-03</p>
        </div>

        {items.length > 0 ? (
          <>
            {/* TOMBOL TAMBAH MENU (State Terisi) */}
            <Button
              onClick={handleBackToMenu}
              className="w-full py-1.5 text-md rounded-xl flex items-center justify-center gap-2 font-bold mb-4"
            >
              <Plus size={20} /> Tambah Menu
            </Button>

            {/* LIST CART ITEM */}
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <CartItemCard
                  key={item.cartId}
                  item={item}
                  onIncrease={(id) => updateQty(id, 1)}
                  onDecrease={(id) => updateQty(id, -1)}
                  onEditNote={(cartId, notes) => setEditingNote({ cartId, notes })}
                  onDeletePrompt={(cartId) => setItemToDelete(cartId)}
                />
              ))}
            </div>
          </>
        ) : (
          /* --- STATE KOSONG --- */
          <div className="flex-1 flex flex-col items-center justify-center mt-24">
            <img
              src={`${import.meta.env.BASE_URL}images/keranjang-kosong.webp`}
              alt="Keranjang Kosong"
              className="w-80 mb-16"
            />
            <p className="text-gray-500 text-center text-base mb-57">
              Keranjangmu masih kosong, yuk pilih menu!
            </p>
            <Button
              onClick={handleBackToMenu}
              className="w-full max-w-sm py-1 rounded-xl flex justify-center items-center gap-2 font-bold"
            >
              <Plus size={18} /> Tambah Menu
            </Button>
          </div>
        )}
      </main>

      {/* --- STICKY BOTTOM BAR --- */}
      {items.length > 0 && (
          <div className="w-full max-w-sm mx-auto">
            <Button
              onClick={handleProceedToPayment}
              className="w-full max-w-sm py-1.5 rounded-xl font-bold text-base"
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
      )}

      {/* --- MODALS --- */}
      {editingNote && (
        <EditNoteModal
          initialNote={editingNote.notes}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveNote}
        />
      )}

      {itemToDelete && (
        <DeleteConfirmModal 
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default MobileCartPage;