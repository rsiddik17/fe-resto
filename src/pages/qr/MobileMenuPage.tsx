import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react"; // Import icon search bawaan lucide

// Komponen Reusable yang sudah kita buat
import Header from "../../components/Header/Header";
import CategoryTabs from "../../components/Filter/CategoryFilterTabs";
import MenuCard, { type MenuItem } from "../../components/Card/MenuCard";
import CartBottomBar from "../../components/CartBottomBar/CartBottomBar";
import MenuItemModal from "../../components/Modal/MenuItemModal";
import SuccessModal from "../../components/Modal/SuccessModal";

// Global State
import { useCartStore } from "../../store/useCartStore";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import WarningIcon from "../../components/Icon/WarningIcon";
import { useMenus } from "../../hooks/useMenus";

const MobileMenuPage = () => {
  const navigate = useNavigate();

  const { data: menus = [], isLoading, isError, refetch } = useMenus();

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
    return menus.filter((item) => {
      const matchesCategory =
        activeCategory === "semua" || item.category === activeCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, menus]);

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
    navigate("/qr/cart");
  };

  return (
    // Background sedikit abu-abu agar card putihnya lebih menonjol
    <div className="min-h-screen pb-28 relative">
      <div className="sticky bg-white top-0 z-30 pb-0">
        {/* 1. HEADER */}
        <Header />

        <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-4">
          <div className="relative mb-5">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              className="w-full pl-12 pr-4 py-2.25 md:py-2.5 text-base rounded-xs border focus:ring-2 focus:ring-primary placeholder:text-gray-500 shadow-md text-black"
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

      <main className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <span className="text-primary font-bold animate-pulse text-lg">
              Memuat menu...
            </span>
          </div>
        ) : isError ? (
          <div className="flex flex-col justify-center items-center h-48 gap-4 px-4 text-center mt-4">
            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
              <span className="text-2xl"><WarningIcon/></span>
            </div>
            <p className="text-gray-600 font-medium">Gagal memuat menu. Silakan Coba lagi nanti.</p>
            <Button
              onClick={() => refetch()}
              className="px-6 py-2 rounded-sm font-bold shadow-sm"
            >
              Coba Lagi
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item) => {
                const isOutOfStock =
                  item.stock !== undefined && item.stock <= 0;

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
        )}
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