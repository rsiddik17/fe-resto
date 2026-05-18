import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import Header from "../../components/HeaderOnline/HeaderOnline";
import EditNoteModal from "../../components/EditNoteModalOnline/EditNoteModalOnline";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import EmptyCartView from "../../components/EmptyTrack/EmptyTrack";
import NotesIcon from "../../components/Icon/Notes";

interface CartItem {
  cartId: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  notes?: string;
  checked?: boolean;
}

const CartPageOnline = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQty,
    updateNotes,
    removeItem,
    toggleChecked,
    toggleAllChecked,
  } = useCartStore();

  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  // State untuk mengontrol modal hapus
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleAllChecked(e.target.checked);
  };

  const selectedTotalPrice = items
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col pb-32">
      <Header mode="online" />
      <div className="bg-white border-b border-gray-100 shadow-sm mb-3 w-full">
        <div className="w-full py-3 px-4 md:px-12 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Keranjang</h1>
        </div>
      </div>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-12">
        {items.length > 0 ? (
          <>
            <div className="bg-white rounded-xs shadow-sm border border-gray-100 p-5 flex items-center gap-4 mb-4 mt-4">
              <input
                type="checkbox"
                className="w-5 h-5 accent-primary border-2 border-primary-100 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer "
                onChange={handleSelectAll}
                checked={items.length > 0 && items.every((i) => i.checked)}
              />
              <span className="text-sm font-semibold">Pilih Semua</span>
            </div>

            <div className="bg-white rounded-xs shadow-sm border border-gray-100 p-6 space-y-8">
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/customer/menu")}
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2"
                >
                  <Plus size={16} /> Tambah Menu
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex gap-4 items-center w-full"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-primary border-2 border-primary-100 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer "
                      checked={!!item.checked}
                      onChange={() => toggleChecked(item.cartId)}
                    />
                    <div className="flex-1 bg-white p-4 border border-gray-200 rounded-xs flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 shadow-sm">
                      <img
                        src={item.image}
                        className="w-20 h-20 rounded-xs object-cover"
                        alt={item.name}
                      />
                      <div className="flex-1 min-w-200px">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="font-bold text-primary whitespace-nowrap">
                            Rp{item.price.toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => setEditingItem(item)}
                          className="mt-2 text-md text-gray-400 bg-gray-100 w-full max-w-sm py-2 px-4 rounded-sm flex items-center gap-2"
                        >
                          <NotesIcon size={14} className="shrink-0" />
                          <span className="truncate">
                            {item.notes || "Tidak ada"}
                          </span>
                        </button>

                        <div className="flex justify-end mt-2">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={
                                () =>
                                  item.qty > 1
                                    ? updateQty(item.cartId, item.qty - 1)
                                    : setItemToDelete(item) // Trigger modal jika qty 1
                              }
                              className="w-8 h-8 flex items-center justify-center border-2 border-primary rounded-xs text-primary hover:bg-primary/5 transition-all"
                            >
                              <Minus size={16} strokeWidth={3} />
                            </button>
                            <span className="font-bold text-black text-sm w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(item.cartId, item.qty + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border-2 border-primary rounded-xs text-primary hover:bg-primary hover:text-white transition-all"
                            >
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <EmptyCartView onNavigate={() => navigate("/customer/menu")} />
        )}
      </main>
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 md:px-12 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {/* Menggunakan justify-end agar teks dan tombol berjejer di sisi kanan */}
          <div className="flex justify-end items-center gap-6 md:gap-10 w-full">
            {/* Bagian Info Harga - Rata Kanan */}
            <div className="flex flex-col text-right">
              <p className="text-[13px] font-medium text-black leading-tight">
                Total Pembayaran
              </p>
              <p className="text-xl font-extrabold text-primary leading-none">
                Rp{selectedTotalPrice.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Tombol Bayar */}
            <button
              disabled={!items.some((i) => i.checked)}
              onClick={() =>
                navigate("/customer/checkout", { state: { adminFee: 205 } })
              }
              className="bg-primary disabled:bg-gray-300 text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
            >
              Bayar Sekarang
              <ArrowLeft size={16} strokeWidth={3} className="rotate-180" />
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!itemToDelete}
        title="Hapus dari Keranjang?"
        description="Apakah anda yakin ingin menghapus item ini dari keranjang belanja anda?"
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            removeItem(itemToDelete.cartId);
            setItemToDelete(null);
          }
        }}
      />
      {/* Modal Edit Notes */}
      {editingItem && (
        <EditNoteModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(note) => {
            updateNotes(editingItem.cartId, note);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default CartPageOnline;
