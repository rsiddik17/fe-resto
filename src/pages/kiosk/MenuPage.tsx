import { useMemo, useState } from "react";
import MenuCard, { type MenuItem } from "../../components/MenuCard/MenuCard";
import CartBottomBar from "../../components/CartBottomBar/CartBottomBar";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import CategoryTabs from "../../components/CategoryTabs/CategoryTabs";
import MenuItemModal from "../../components/MenuItemModal/MenuItemModal";
import { useCartStore } from "../../store/useCartStore";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import { useNavigate } from "react-router";

// --- MOCK DATA (Nanti diganti dengan data dari API) ---
const mockMenu: MenuItem[] = [
  { id: "1", name: "Nasi Goreng Kambing", price: 40000, description: "Nasi goreng dengan daging kambing empuk", category: "makanan", image: "/images/nasgor.jpg", stock: 15 },
  { id: "2", name: "Sate Ayam", price: 40000, description: "Sate ayam dengan bumbu kacang khas", category: "makanan", image: "/images/sate.jpg", stock: 24 },
  { id: "3", name: "Es Teler", price: 20000, description: "Minuman segar dengan campuran buah dan sirup", category: "minuman", image: "/images/esteler.jpg", stock: 46 },
  { id: "4", name: "Sop Iga", price: 65000, description: "Sop iga sapi dengan kuah kaldu gurih", category: "makanan", image: "/images/sopiga.jpg", stock: 10 },
  { id: "5", name: "Es Teh Manis", price: 8000, description: "Teh manis segar dengan es batu", category: "minuman", image: "/images/esteh.jpg", stock: 100 },
];

const MenuPage = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<"semua" | "makanan" | "minuman">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [successItemName, setSuccessItemName] = useState<string | null>(null);

  // AMBIL ACTIONS & STATE DARI ZUSTAND
  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Logika Filter
  const filteredMenu = useMemo(() => {
    return mockMenu.filter((item) => {
      const matchesCategory = activeCategory === "semua" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);


  const handleConfirmAddToCart = (item: MenuItem, qty: number, notes: string) => {
    if (qty > 0) {
      // Masukkan ke Global Store
      addToCart(item, qty, notes);
      setSuccessItemName(item.name);
    }
    
    // Tutup modal
    setSelectedItem(null);
  };

  const handleGoToCart = () => {
    // Aksi ketika tombol "Lihat Keranjang" di modal sukses atau bottom bar ditekan
    navigate("/kiosk/keranjang"); // Sesuaikan dengan route keranjang kamu
  };

  return (
    <div className="min-h-screen bg-secondary/25 pb-28 relative">
      
      {/* HEADER LOGO */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-10 pt-6">
        
        {/* HERO SECTION & PENCARIAN */}
        <HeroSection 
          title="Pesan Menu<br />Favoritmu"
          subtitle="Pesan Makanan & Minuman Tanpa Ribet"
          imageBg="/images/banner-menu.webp"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* TABS KATEGORI */}
        <CategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* GRID MENU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              
              // Pemanggilan Compound Component:
              <MenuCard key={item.id}>
                
                <MenuCard.Header 
                  image={item.image} 
                  name={item.name} 
                />
                
                <MenuCard.Body 
                  name={item.name} 
                  price={item.price} 
                  description={item.description} 
                />
                
                <MenuCard.Footer 
                  onAdd={() => setSelectedItem(item)} 
                />

              </MenuCard>

            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-10">
              Menu tidak ditemukan.
            </p>
          )}
        </div>

      </main>

      {/* BOTTOM CART BAR */}
      <CartBottomBar totalItems={totalItems} onViewCart={handleGoToCart} />

      {selectedItem && (
        <MenuItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onAdd={handleConfirmAddToCart} 
        />
      )}


      {successItemName && (
        <SuccessModal 
          itemName={successItemName}
          onClose={() => setSuccessItemName(null)} 
          onViewCart={handleGoToCart}              
        />
      )}
      
    </div>
  );
};

export default MenuPage;