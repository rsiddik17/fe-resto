import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react"; // Import icon search bawaan lucide

// Komponen Reusable yang sudah kita buat
import Header from "../../components/Header/Header";
import CategoryTabs from "../../components/CategoryTabs/CategoryTabs";
import MenuCard, { type MenuItem } from "../../components/MenuCard/MenuCard";
import CartBottomBar from "../../components/CartBottomBar/CartBottomBar";
import MenuItemModal from "../../components/MenuItemModal/MenuItemModal";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

// Global State
import { useCartStore } from "../../store/useCartStore";
import Input from "../../components/ui/Input";

// --- MOCK DATA (Sama seperti kiosk, nanti diganti API) ---
const mockMenu: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Kambing",
    price: 40000,
    description: "Nasi goreng dengan daging kambing empuk",
    category: "makanan",
    image: "/images/nasgor.jpg",
    stock: 15,
  },
  {
    id: "2",
    name: "Roti Bakar Cokelat", // Disesuaikan dengan desain gambar
    price: 20000,
    description: "Roti Bakar lembut dengan selai cokelat",
    category: "makanan",
    image: "/images/sate.jpg", // Ganti path gambarnya nanti ya
    stock: 24,
  },
  {
    id: "3",
    name: "Es Teler",
    price: 20000,
    description: "Minuman segar dengan campuran buah dan sirup",
    category: "minuman",
    image: "/images/esteler.jpg",
    stock: 46,
  },
  {
    id: "4",
    name: "Lychee Tea", // Disesuaikan dengan desain gambar
    price: 20000,
    description: "Perpaduan teh dan leci yang manis dan menyegarkan",
    category: "minuman",
    image: "/images/esteh.jpg", // Ganti path gambarnya nanti
    stock: 100,
  },
  {
    id: "5",
    name: "Le Mineral", // Disesuaikan dengan desain gambar
    price: 5000,
    description: "Air Mineral Segar",
    category: "minuman",
    image: "/images/sopiga.jpg", // Ganti path gambarnya nanti
    stock: 50,
  },
  {
    id: "6",
    name: "Nasi Goreng Ayam",
    price: 40000,
    description: "Ayam",
    category: "makanan",
    image: "/images/banner-menu.webp",
    stock: 0,
  }, // <-- UBAH JADI 0
];

const MobileMenuPage = () => {
  const navigate = useNavigate();

  // States
  const [activeCategory, setActiveCategory] = useState<
    "semua" | "makanan" | "minuman"
  >("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [successItemName, setSuccessItemName] = useState<string | null>(null);

  // Zustand Actions
  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Logika Filter (Sama persis kayak kiosk)
  const filteredMenu = useMemo(() => {
    return mockMenu.filter((item) => {
      const matchesCategory =
        activeCategory === "semua" || item.category === activeCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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

  const handleGoToCart = () => {
    // Karena ini halaman HP, kita arahkan ke rute keranjang mobile nantinya
    navigate("/qr/cart");
  };

  return (
    // Background sedikit abu-abu agar card putihnya lebih menonjol
    <div className="min-h-screen pb-28 relative">
      <div className="sticky bg-white top-0 z-30 pb-0">
        {/* 1. HEADER */}
        <Header />
        
        <div className=" max-w-md mx-auto px-4 pt-4">
          <div className="relative mb-5">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              className="w-full pl-11 pr-4 py-3 rounded-xs border focus:ring-2 focus:ring-primary placeholder:text-gray-500 shadow-md text-black"
              placeholder="Cari menu"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-1">
        {/* 4. GRID MENU (Khusus Mobile kita pakai grid-cols-2) */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => {
              const isOutOfStock = item.stock !== undefined && item.stock <= 0;

              return (
                <MenuCard key={item.id}>
                  <MenuCard.Header
                    image={item.image}
                    name={item.name}
                    isOutOfStock={isOutOfStock}
                  />
                  <MenuCard.Body
                    name={item.name}
                    price={item.price}
                    description={item.description}
                  />
                  <MenuCard.Footer onAdd={() => setSelectedItem(item)} />
                </MenuCard>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-2 text-center py-10 text-sm">
              Menu tidak ditemukan.
            </p>
          )}
        </div>
      </main>

      {/* 5. BOTTOM CART BAR */}
      <CartBottomBar totalItems={totalItems} onViewCart={handleGoToCart} />

      {/* 6. MODALS */}
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

export default MobileMenuPage;
