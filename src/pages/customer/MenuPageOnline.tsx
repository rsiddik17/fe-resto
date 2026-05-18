import { useMemo, useState } from "react";
import CategoryTabs from "../../components/CategoryTabsOnline/CategoryTabsOnline";
import MenuItemModal from "../../components/MenuItemModalOnline/MenuItemModalOnline";
import { useCartStore } from "../../store/useCartStore";
import SuccessModal from "../../components/SuccessModalOnline/SuccessModalOnline";
import { useNavigate } from "react-router";
import MenuCard, {
  type MenuItem,
} from "../../components/MenuCardOnline/MenuCardOnline";
import Header from "../../components/HeaderOnline/HeaderOnline";
import HeroSection from "../../components/HeroSectionOnline/HeroSectionOnline";
import { useMenus } from "../../hooks/useMenus";

const MenuPageOnline = () => {
  const navigate = useNavigate();
  
  // 1. Panggil hook useMenus paling atas
  const { data: menu = [], isLoading, isError } = useMenus();

  const [activeCategory, setActiveCategory] = useState<
    "semua" | "makanan" | "minuman"
  >("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [successItemName, setSuccessItemName] = useState<string | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.items || []);

  // --- LOGIKA FILTER REAL-TIME (Diletakkan di atas sebelum ada pengondisian return) ---
  const filteredMenu = useMemo(() => {
    const currentCart = Array.isArray(cart) ? cart : [];

    return menu
      .map((item) => {
        const itemInCart = currentCart.find(
          (c) => String(c.id) === String(item.id),
        );
        const qtyInCart = itemInCart ? itemInCart.qty : 0;
        const remainingStock = (item.stock || 0) - qtyInCart;

        return {
          ...item,
          stock: remainingStock < 0 ? 0 : remainingStock,
        };
      })
      .filter((item) => {
        const matchesCategory =
          activeCategory === "semua" || item.category === activeCategory;
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [activeCategory, searchQuery, cart, menu]);

  const handleConfirmAddToCart = (
    item: MenuItem,
    qty: number,
    notes: string,
  ) => {
    if (qty > 0) {
      addToCart(item, qty, notes);
      setSuccessItemName(item.name);
    }
    setSelectedItem(null);
  };

  // 2. PINDAHKAN PENGECEKAN LOADING DI SINI (Di bawah hook, sebelum return utama)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        <p className="ml-3 font-bold text-gray-700">Memuat Menu Lezat...</p>
      </div>
    );
  }

  // 3. PINDAHKAN PENGECEKAN ERROR DI SINI
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <p className="text-red-500 font-bold">Gagal memuat data menu dari server.</p>
        <p className="text-gray-400 text-xs mt-1">Pastikan API Backend dan database MySQL kamu sudah aktif.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header mode="online" />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-6 space-y-6">
        <HeroSection
          title="Pesan Menu<br />Favoritmu"
          subtitle="Pesan Makanan & Minuman Tanpa Ribet"
          imageBg="/images/banner-menu.webp"
          showSearch={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <section className="bg-white rounded-xs shadow-sm p-4 md:p-10 mb-9 min-h-400px">
          {filteredMenu.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {filteredMenu.map((item) => (
                <MenuCard key={item.id}>
                  <MenuCard.Header
                    image={item.image}
                    name={item.name}
                    stock={item.stock}
                  />
                  <MenuCard.Body
                    name={item.name}
                    price={item.price}
                    description={item.description}
                  />
                  <MenuCard.Footer
                    onAdd={() => setSelectedItem(item)}
                    disabled={item.stock === 0}
                  />
                </MenuCard>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <p className="text-gray-500 text-lg">Menu tidak ditemukan</p>
            </div>
          )}
        </section>
      </main>

      {/* MODALS */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={handleConfirmAddToCart}
          mode="online"
        />
      )}

      {successItemName && (
        <SuccessModal
          itemName={successItemName}
          onClose={() => setSuccessItemName(null)}
          onViewCart={() => navigate("/customer/keranjang")}
          mode="online"
        />
      )}
    </div>
  );
};

export default MenuPageOnline;