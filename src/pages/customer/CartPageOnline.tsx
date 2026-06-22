import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import Header from "../../components/HeaderOnline/HeaderOnline";
import EditNoteModal from "../../components/EditNoteModalOnline/EditNoteModalOnline";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import EmptyCartView from "../../components/EmptyTrack/EmptyTrack";
import NotesIcon from "../../components/Icon/Notes";
import Toast from "../../components/Toast/Toast";

interface CartItem {
  cartId: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  notes?: string;
  checked?: boolean;
  stock?: number;
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
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "error" });

  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "error" }),
      4000,
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleAllChecked(e.target.checked);
  };

  const selectedTotalPrice = items
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleDecrement = (item: CartItem) => {
    if (item.qty > 1) {
      updateQty(item.cartId, -1);
    } else {
      setItemToDelete(item);
    }
  };

  const handleIncrement = (item: CartItem) => {
    const currentStock = item.stock || 0;
    const currentQty = item.qty || 0;

    if (currentQty >= currentStock) {
      showToast(
        `Stok ${item.name} tidak mencukupi (tersisa ${currentStock})`,
        "error",
      );
      return;
    }

    updateQty(item.cartId, 1);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col pb-28">
      <div className="relative z-[9999]">
        <Toast show={toast.show} message={toast.message} type={toast.type} />
      </div>

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
                className="w-5 h-5 accent-primary border-2 border-primary-100 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                onChange={handleSelectAll}
                checked={items.length > 0 && items.every((i) => i.checked)}
              />
              <span className="text-sm font-semibold">Pilih Semua</span>
            </div>

            <div className="bg-white rounded-xs shadow-sm border border-gray-100 p-6 space-y-8">
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/customer/menu")}
                  className="bg-primary text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm flex items-center gap-1"
                >
                  <Plus size={14} /> Tambah Menu
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
                      className="w-5 h-5 accent-primary border-2 border-primary-100 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      checked={!!item.checked}
                      onChange={() => toggleChecked(item.cartId)}
                    />

                    <div className="flex-1 bg-white p-3 md:p-4 border border-gray-200 rounded-xs flex gap-3 md:gap-6 shadow-sm">
                      <img
                        src={item.image}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xs object-cover"
                        alt={item.name}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 flex-wrap md:flex-nowrap">
                          <h3 className="font-bold text-sm md:text-base wrap-break-words flex-1">
                            {item.name}
                          </h3>
                          <p className="font-bold text-primary text-sm md:text-base whitespace-nowrap">
                            Rp{item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Catatan - style seperti kiosk */}
                        <button
                          onClick={() => setEditingItem(item)}
                          className="mt-2 text-xs text-gray-400 bg-white py-1.5 md:py-2 px-3 rounded-xs inline-flex items-center border-2 border-primary/75 gap-2 min-w-35 max-w-50 md:min-w-auto md:max-w-none md:w-88"
                        >
                          <NotesIcon size={12} className="shrink-0" />
                          <span className="truncate text-xs">
                            {item.notes || "Tidak ada"}
                          </span>
                        </button>

                        <div className="flex justify-end mt-3">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border border-primary rounded-xs text-primary"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="font-bold text-black text-sm w-6 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border border-primary rounded-xs text-primary"
                            >
                              <Plus size={14} strokeWidth={3} />
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-4 md:py-3 px-3 md:px-6 z-50">
          <div className="flex justify-end items-center gap-4 w-full">
            {/* Section total pembayaran */}
            <div className="text-right">
              <p className="text-[10px] md:text-[13px] font-medium text-black">
                Total Pembayaran
              </p>
              <p className="text-sm md:text-xl font-extrabold text-primary">
                Rp{selectedTotalPrice.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Tombol bayar */}
            <button
              disabled={!items.some((i) => i.checked)}
              onClick={() =>
                navigate("/customer/checkout", { state: { adminFee: 205 } })
              }
              className="bg-primary disabled:bg-gray-300 text-white px-4 py-2 md:px-8 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-md flex items-center gap-1"
            >
              Bayar Sekarang
              <ArrowLeft size={14} strokeWidth={3} className="rotate-180" />
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
