import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import CartItemCard from "../../components/Card/CartItemCard";
import { useCartStore } from "../../store/useCartStore";
import EditNoteModal from "../../components/Modal/EditNoteModal";
import { useEffect, useState } from "react";
import DeleteConfirmModal from "../../components/Modal/DeleteConfirmModal";

const KioskCartPage = () => {
  const navigate = useNavigate();

  // Ambil state dan actions dari Zustand
  const { items, updateQty, updateNote, removeItem, tableNumber, tableId } = useCartStore();
  // const totalItems = getTotalItems();

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [editingNote, setEditingNote] = useState<{
    cartId: string;
    notes: string;
  } | null>(null);

  // Jika tidak ada meja terpilih, kembalikan user ke home (Proteksi Keamanan)
  useEffect(() => {
    if (!tableId || !tableNumber) {
      console.warn("Meja belum terpilih, mengembalikan ke halaman awal.");
      navigate("/kiosk/home");
    }
  }, [tableId, tableNumber, navigate]);

  const handleBackToMenu = () => {
    navigate("/kiosk/menu");
  };

  const handleProceedToPayment = () => {
    // Nanti diarahkan ke halaman pembayaran
    navigate("/kiosk/checkout");
  };

  const handleSaveNote = (newNote: string) => {
    if (editingNote) {
      updateNote(editingNote.cartId, newNote);
      setEditingNote(null); // Tutup modal
    }
  };


  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete); // Hapus item dari Zustand Store
      setItemToDelete(null); // Tutup modal
    }
  };


  return (
    <div className="min-h-screen bg-secondary/25 pb-8 relative flex flex-col">
      <Header showProfile={true}  />

      <main className="flex-1 w-full px-4 max-w-full md:max-w-180 lg:max-w-4xl mx-auto pt-4 md:pt-6">
        {/* --- JUDUL & TOMBOL KEMBALI --- */}
        <div className="mb-6">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 text-base md:text-[28px] lg:text-[22px] font-bold text-black hover:opacity-70 transition-opacity mb-1"
          >
            <ArrowLeft className="w-4.5 h-4.5 md:w-6 md:h-6" size={24} strokeWidth={3} /> Keranjang
          </button>
          {items.length > 0 && <p className="text-gray text-base md:text-2xl lg:text-xl ml-1">{tableNumber || "Meja --"}</p>}
          {/* Nanti ini bisa dinamis dari state */}
        </div>

        {/* --- LIST ITEM KERANJANG --- */}
        {items.length > 0 ? (
          <>
            <Button
              onClick={handleBackToMenu}
              className="w-full py-2 md:py-3 lg:py-2.25 text-sm md:text-base rounded-full flex items-center justify-center gap-2 font-bold mb-6"
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
                  onDeletePrompt={(cartId) => setItemToDelete(cartId)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center mt-15 md:mt-25">
            <img
              src={`${import.meta.env.BASE_URL}images/keranjang-kosong.webp`} // Pastikan kamu taruh gambar ilustrasinya di sini ya!
              alt="Keranjang Kosong"
              className="w-60 md:w-100 lg:w-90 mb-8 opacity-90"
            />
            <p className="text-gray text-base md:text-[22px] lg:text-xl mb-6 text-center">
              Keranjangmu masih kosong, yuk pilih menu!
            </p>
            <Button
              onClick={handleBackToMenu}
              className="px-8 w-full max-w-100 py-2 md:py-2.5 lg:py-2 rounded-full flex justify-center items-center gap-2"
            >
              <Plus size={18} /> <span className="font-bold text-[14.5px] md:text-xl lg:text-lg">Tambah Menu</span>
            </Button>
          </div>
        )}
      </main>

      {/* --- STICKY BOTTOM BAR --- */}
      {items.length > 0 && (
          <div className="w-full max-w-81 md:max-w-150 mx-auto">
            <Button
              onClick={handleProceedToPayment}
              className="w-full mx-auto py-2 md:py-3 lg:py-2.25 rounded-full font-bold text-[14.5px] md:text-lg lg:text-base"
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

      {itemToDelete && (
        <DeleteConfirmModal 
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default KioskCartPage;
