import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Button from "../../components/ui/Button";
import { useCartStore } from "../../store/useCartStore";
import MenuCard from "../../components/Card/MenuCard";
import CategoryFilterTabs from "../../components/Filter/CategoryFilterTabs";
import WaiterCartItemCard from "../../components/Card/WaiterCartItemCard";
import EditNoteModal from "../../components/Modal/EditNoteModal";
import DiscountModal from "../../components/Modal/DiscountModal";
import WaiterOrderSummary from "../../components/OrderSummary/WaiterOrderSummary";
import Input from "../../components/ui/Input";
import DeleteConfirmModal from "../../components/Modal/DeleteConfirmModal";
import { useMenus } from "../../hooks/useMenus";
import WarningIcon from "../../components/Icon/WarningIcon";
import { useProfile } from "../../hooks/useProfile";

const CashierSelectMenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tangkap nomor meja dari halaman Pilih Meja, fallback "Meja 10"
  const tableNumber = location.state?.tableNumber
    ? `Meja ${location.state.tableNumber}`
    : "Meja 10";

  const { data: menus = [], isLoading, isError, refetch } = useMenus();

  // Zustand Store
  const { items, getTotalPrice, addToCart, updateQty, removeItem, updateNote } =
    useCartStore();
  const subTotal = getTotalPrice();

  // State Halaman
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "semua" | "makanan" | "minuman"
  >("semua");

  // State Modals
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Filter Menu: Berdasarkan kategori DAN hasil pencarian (search)
  const filteredMenu = menus.filter((item) => {
    const matchCategory =
      activeCategory === "semua" ? true : item.category === activeCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleConfirmOrder = () => {
    if (items.length === 0) return; // Proteksi ganda

    // PERBAIKAN: Arahkan ke rute payment milik Kasir
    navigate("/cashier/order-list/create-order/payment-order", {
      state: {
        tableNumber: location.state?.tableNumber || "10",
        discountAmount: discountAmount,
        orderId: `#${Math.floor(100000000 + Math.random() * 900000000)}`, // Mock Order ID
      },
    });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const { firstName, roleName } = useProfile();

  return (
    <>
      {/* 1. HEADER (Sesuai Wrapper Permintaan) */}
      <div className="pt-16 lg:pt-7 lg:pl-8 lg:pr-7 mx-4 lg:mx-0">
        <DashboardHeader
          title="Pilih Menu"
          showBack={true}
          onBack={() => navigate(-1)}
          userName={firstName}
          roleName={roleName}
        />
      </div>

      {/* 2. MAIN CONTENT (Sesuai Wrapper Permintaan) */}
      <div className="pt-1 lg:pt-1 pb-0 lg:pb-0 px-4 lg:px-8 min-h-0">
        {/* Layout 2 Kolom Kiri/Kanan dengan proporsi fixed 55% dan 45% */}
        <div className="flex flex-col md:flex-row gap-4 h-screen md:h-full min-h-0 w-full">
          {/* --- KOLOM KIRI: MENU (55%) --- */}
          <div className="w-full md:w-[55%] bg-white rounded-t-md shadow-sm border border-gray-100 p-4 pb-0 md:p-5 md:pb-0 flex flex-col h-full min-h-0">
            {/* Search */}
            <div className="relative mb-4 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-black/50 w-4.5 h-4.5" />
              </div>
              <Input
                type="text"
                placeholder="Cari menu pesanan"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 py-2 text-[14.5px] border-gray-200 shadow-sm placeholder:text-black/50"
              />
            </div>

            {/* Category Tabs */}
            <div className="shrink-0 mb-1">
              <CategoryFilterTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Menu Grid (Discroll, 2 Kolom) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pb-4 -mx-1.5 px-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <span className="text-primary font-bold animate-pulse text-lg">
                    Memuat menu...
                  </span>
                </div>
              ) : isError ? (
                <div className="flex flex-col justify-center items-center h-48 gap-4 px-4 text-center mt-4">
                  <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">
                      <WarningIcon />
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Gagal memuat menu. Silakan Coba lagi nanti.
                  </p>
                  <Button
                    onClick={() => refetch()}
                    className="px-6 py-2 rounded-sm font-bold shadow-sm"
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : (
                <>
                  {filteredMenu.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredMenu.map((item) => (
                        <MenuCard key={item.id}>
                          <MenuCard.Header
                            image={item.image}
                            name={item.name}
                            isOutOfStock={item.stock === 0}
                          />
                          <MenuCard.Body
                            name={item.name}
                            price={item.price}
                            description={item.description}
                          />
                          {item.stock === 0 ? (
                            <div className="px-1.5 md:px-2 py-0 mt-auto">
                              <Button
                                disabled
                                className="w-full py-1 md:py-1.5 rounded-full text-sm font-normal shadow-none cursor-not-allowed border-none"
                              >
                                Habis
                              </Button>
                            </div>
                          ) : (
                            <MenuCard.Footer
                              onAdd={() => addToCart(item, 1, "")}
                            />
                          )}
                        </MenuCard>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 text-sm mt-10">
                      Menu tidak ditemukan
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* --- KOLOM KANAN: CART (45%) --- */}
          <div className="w-full md:w-[45%] bg-white rounded-t-md shadow-sm border border-gray-100 p-4 flex flex-col h-full min-h-0">
            {/* Header Cart */}
            <div className="flex justify-between items-center shrink-0 border-b border-gray-100 mb-1">
              <h2 className="font-bold text-[19px]">Pesanan</h2>
              <span className="font-bold text-primary text-[14px] px-3 py-1 rounded-md">
                {tableNumber}
              </span>
            </div>

            {/* List Cart Items (Bisa discroll, Kosong = Bersih tidak ada elemen) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-0.5">
              <div className="flex flex-col gap-19">
                <div className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <WaiterCartItemCard
                      key={item.cartId}
                      item={item}
                      onIncrease={(id) => updateQty(id, 1)}
                      onDecrease={(id) => updateQty(id, -1)}
                      onDeletePrompt={(id) => setItemToDelete(id)}
                      onEditNote={(cartId) => {
                        setSelectedCartItemId(cartId);
                        setIsNoteOpen(true);
                      }}
                    />
                  ))}
                </div>

                {items.length > 0 && (
                  <div className="mt-8 pt-2 pb-2">
                    <WaiterOrderSummary
                      items={items}
                      subTotal={subTotal}
                      discountAmount={discountAmount}
                      onAddDiscount={() => setIsDiscountOpen(true)}
                      onRemoveDiscount={() => setDiscountAmount(0)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 flex justify-center border-t border-gray-100">
              <Button
                onClick={handleConfirmOrder}
                disabled={items.length === 0}
                className="w-full max-w-80 py-2 text-[14px] md:text-[14px] lg:text-[14px] font-bold rounded-lg shadow-sm disabled:bg-gray/50 disabled:cursor-not-allowed transition-all"
              >
                Konfirmasi Pesanan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {isDiscountOpen && (
        <DiscountModal
          onClose={() => setIsDiscountOpen(false)}
          onApply={(amount) => {
            setDiscountAmount(amount);
            setIsDiscountOpen(false);
          }}
          subTotal={subTotal}
        />
      )}

      {isNoteOpen && (
        <EditNoteModal
          initialNote={
            items.find((i) => i.cartId === selectedCartItemId)?.notes || ""
          }
          onClose={() => {
            setIsNoteOpen(false);
            setSelectedCartItemId(null);
          }}
          onSave={(newNote) => {
            if (updateNote && selectedCartItemId)
              updateNote(selectedCartItemId, newNote);
            setIsNoteOpen(false);
            setSelectedCartItemId(null);
          }}
          mode="create"
        />
      )}

      {/* RENDER MODAL HAPUS ITEM (BARU) */}
      {itemToDelete && (
        <DeleteConfirmModal
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default CashierSelectMenuPage;
