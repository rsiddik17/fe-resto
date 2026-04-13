import { useMemo, useState } from "react";
import CategoryTabs from "../../components/CategoryTabs/CategoryTabs";
import MenuItemModal from "../../components/MenuItemModal/MenuItemModal";
import { useCartStore } from "../../store/useCartStore";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import { useNavigate } from "react-router";
import {  X } from "lucide-react";
import MenuCard, {
  type MenuItem,
} from "../../components/MenuCard/MenuCard";
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

  // --- LOGIKA FILTER & SISA STOK OTOMATIS ---
 const filteredMenu = useMemo(() => {
  // Pastikan cart adalah array, jika tidak buat array kosong
  const currentCart = Array.isArray(cart) ? cart : [];

  return mockMenu.map((item) => {
    // Cari item di cart. Pastikan membandingkan item.id (bukan c.id jika di store berbeda)
    const itemInCart = currentCart.find((c) => String(c.id) === String(item.id));
    
    // Gunakan 0 jika item tidak ada di keranjang
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
    <div className={`min-h-screen transition-colors duration-300 ${searchQuery ? "bg-white" : "bg-secondary"}`}>
      <Header mode="online" />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-6 space-y-6">
        {searchQuery ? (
          /* --- MODE 1: TAMPILAN PENCARIAN --- */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="mt-4">
              <h2 className="text-xl font-bold text-black">Hasil Pencarian</h2>
            </div>
            <div className="relative group w-full">
              <input
                type="text"
                placeholder="Cari menu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-6 py-3 rounded-full border border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm bg-white text-black"
              />
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-primary cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 py-4">
              {filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <MenuCard key={item.id}>
                    <MenuCard.Header image={item.image} name={item.name} stock={item.stock} />
                    <MenuCard.Body name={item.name} price={item.price} description={item.description} />
                    <MenuCard.Footer onAdd={() => setSelectedItem(item)} disabled={item.stock === 0} />
                  </MenuCard>
                ))
              ) : (
                <p className="text-gray-500 col-span-full py-10 text-center">Menu tidak ditemukan</p>
              )}
            </div>
          </div>
        ) : (
          /* --- MODE 2: TAMPILAN AWAL --- */
          <>
            <HeroSection
              title="Pesan Menu<br />Favoritmu"
              subtitle="Pesan Makanan & Minuman Tanpa Ribet"
              imageBg="/images/banner-menu.webp"
              showSearch={true}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

            <section className="bg-white rounded-xs shadow-sm p-4 md:p-10 mb-9">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 ">
                {filteredMenu.map((item) => (
                  <MenuCard key={item.id}>
                    <MenuCard.Header image={item.image} name={item.name} stock={item.stock} />
                    <MenuCard.Body name={item.name} price={item.price} description={item.description} />
                    <MenuCard.Footer onAdd={() => setSelectedItem(item)} disabled={item.stock === 0} />
                  </MenuCard>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {selectedItem && (
        <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={handleConfirmAddToCart} mode="online" />
      )}

      {successItemName && (
        <SuccessModal itemName={successItemName} onClose={() => setSuccessItemName(null)} onViewCart={() => navigate("/customer/cart")} mode="online" />
      )}
    </div>
  );
};

export default MenuPageOnline;