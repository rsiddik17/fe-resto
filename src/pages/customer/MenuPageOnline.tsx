import { useMemo, useState } from "react";
import CategoryTabs from "../../components/CategoryTabs/CategoryTabs";
import MenuItemModal from "../../components/MenuItemModal/MenuItemModal";
import { useCartStore } from "../../store/useCartStore";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import { useNavigate } from "react-router";
import MenuCard, { type MenuItem } from "../../components/MenuCard/MenuCard";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";

// --- MOCK DATA ---
const mockMenu: MenuItem[] = [
  { id: "1", name: "Nasi Goreng Kambing", price: 40000, description: "Nasi goreng dengan daging kambing empuk", category: "makanan", image: "/images/nasgor.jpg", stock: 15 },
  { id: "12", name: "Sate Ayam", price: 40000, description: "Sate ayam dengan bumbu kacang khas", category: "makanan", image: "/images/sate.jpg", stock: 20 },
  { id: "3", name: "Es Teler", price: 20000, description: "Minuman segar dengan campuran buah dan sirup", category: "minuman", image: "/images/esteler.jpg", stock: 46 },
  { id: "4", name: "Sop Iga", price: 65000, description: "Sop iga sapi dengan kuah kaldu gurih", category: "makanan", image: "/images/sop iga.jpg", stock: 19 },
  { id: "5", name: "Es Teh Manis", price: 8000, description: "Teh manis segar dengan es batu", category: "minuman", image: "/images/esteh.jpg", stock: 100 },
  { id: "11", name: "Gado-gado", price: 30000, description: "Sayuran segar dengan saus kacang", category: "makanan", image: "/images/gadogado.jpg", stock: 0 },
];

const MenuPageOnline = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<"semua" | "makanan" | "minuman">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [successItemName, setSuccessItemName] = useState<string | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.items || []);

  // --- LOGIKA FILTER REAL-TIME ---
  const filteredMenu = useMemo(() => {
    const currentCart = Array.isArray(cart) ? cart : [];

    return mockMenu.map((item) => {
      const itemInCart = currentCart.find((c) => String(c.id) === String(item.id));
      const qtyInCart = itemInCart ? itemInCart.qty : 0;
      const remainingStock = (item.stock || 0) - qtyInCart;

      return {
        ...item,
        stock: remainingStock < 0 ? 0 : remainingStock,
      };
    }).filter((item) => {
      const matchesCategory = activeCategory === "semua" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, cart]);

  const handleConfirmAddToCart = (item: MenuItem, qty: number, notes: string) => {
    if (qty > 0) {
      addToCart(item, qty, notes);
      setSuccessItemName(item.name);
    }
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header mode="online" />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-6 space-y-6">
        {/* HERO SECTION: Selalu tampil */}
        <HeroSection
          title="Pesan Menu<br />Favoritmu"
          subtitle="Pesan Makanan & Minuman Tanpa Ribet"
          imageBg="/images/banner-menu.webp"
          showSearch={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* CATEGORY TABS: Tetap muncul di bawah Hero */}
        <CategoryTabs 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />

        {/* AREA MENU: Isinya berubah otomatis */}
        <section className="bg-white rounded-xs shadow-sm p-4 md:p-10 mb-9 min-h-[400px]">
          {filteredMenu.length > 0 ? (
            <>
              {/* Judul Hasil Pencarian hanya muncul jika ada datanya */}
              {searchQuery && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-black">Hasil Pencarian: "{searchQuery}"</h2>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {filteredMenu.map((item) => (
                  <MenuCard key={item.id}>
                    <MenuCard.Header image={item.image} name={item.name} stock={item.stock} />
                    <MenuCard.Body name={item.name} price={item.price} description={item.description} />
                    <MenuCard.Footer onAdd={() => setSelectedItem(item)} disabled={item.stock === 0} />
                  </MenuCard>
                ))}
              </div>
            </>
          ) : (
            /* Tampilan Bersih Jika Tidak Ditemukan */
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
          onViewCart={() => navigate("/customer/cart")} 
          mode="online" 
        />
      )}
    </div>
  );
};

export default MenuPageOnline;