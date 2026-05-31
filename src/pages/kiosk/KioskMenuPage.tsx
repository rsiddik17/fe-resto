import { useMemo, useState } from "react";
import MenuCard, { type MenuItem } from "../../components/Card/MenuCard";
import CartBottomBar from "../../components/CartBottomBar/CartBottomBar";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import CategoryTabs from "../../components/Filter/CategoryFilterTabs";
import MenuItemModal from "../../components/Modal/MenuItemModal";
import { useCartStore } from "../../store/useCartStore";
import SuccessModal from "../../components/Modal/SuccessModal";
import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import WarningIcon from "../../components/Icon/WarningIcon";
import { useMenus } from "../../hooks/useMenus";
// import { useAuthStore } from "../../store/useAuthStore";
import { useProfile } from "../../hooks/useProfile";

const KioskMenuPage = () => {
  const navigate = useNavigate();
  // const { user } = useAuthStore();
  const { firstName } = useProfile();

  const { data: menus = [], isLoading, isError, refetch } = useMenus();

  const [activeCategory, setActiveCategory] = useState<
    "semua" | "makanan" | "minuman"
  >("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [successItemName, setSuccessItemName] = useState<string | null>(null);

  // AMBIL ACTIONS & STATE DARI ZUSTAND
  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Logika Filter
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
      // Masukkan ke Global Store
      addToCart(item, qty, notes);
      setSuccessItemName(item.name);
    }

    // Tutup modal
    setSelectedItem(null);
  };

  const handleGoToCart = () => {
    navigate("/kiosk/cart"); // Sesuaikan dengan route keranjang kamu
  };

  return (
    <div className="h-screen lg:min-h-screen lg:h-auto flex flex-col relative overflow-hidden lg:overflow-visible">
      {/* HEADER LOGO */}
      <Header
        showProfile={true}
        profileHref="/kiosk/profile"
        userName={firstName}
      />

      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6 overflow-hidden lg:overflow-visible">
        {/* HERO SECTION & PENCARIAN */}
        <HeroSection
          title="Pesan Menu<br />Favoritmu"
          subtitle="Pesan Makanan & Minuman Tanpa Ribet"
          imageBg={`${import.meta.env.BASE_URL}images/banner-menu.webp`}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* TABS KATEGORI */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* GRID MENU */}
        <div className="flex-1 overflow-y-auto lg:overflow-visible pb-28 -mx-3 lg:mx-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className="text-primary font-bold animate-pulse">
                Memuat menu...
              </span>
            </div>
          ) : isError ? (
            <div className="flex flex-col justify-center items-center h-48 gap-4 px-4 text-center mt-8">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-3xl">
                  <WarningIcon />
                </span>
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Gagal memuat menu. Silakan Coba lagi nanti.
              </p>
              <Button
                onClick={() => refetch()} // Panggil ulang fungsi fetch API
                className="px-8 py-2.5 rounded-sm font-bold shadow-sm"
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-2.5 md:mx-0">
              {filteredMenu.length > 0 ? (
                filteredMenu.map((item) => {
                  const isOutOfStock =
                    item.stock !== undefined && item.stock <= 0;

                  return (
                    // Pemanggilan Compound Component:
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
                <p className="text-gray-500 col-span-full text-center py-10">
                  Menu tidak ditemukan.
                </p>
              )}
            </div>
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

export default KioskMenuPage;
