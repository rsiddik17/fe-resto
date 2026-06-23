import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { useCartStore } from "../../store/useCartStore";
import MenuCard, {
  type MenuItem,
} from "../../components/MenuCardOnline/MenuCardOnline";
import SuccessModal from "../../components/SuccessModalOnline/SuccessModalOnline";
import MenuItemModal from "../../components/MenuItemModalOnline/MenuItemModalOnline";
import Button from "../../components/ui/Button";
import { Banknote, MapPin, Mail, Phone } from "lucide-react";
import HeroSection from "../../components/HeroSectionOnline/HeroSectionOnline";
import Header from "../../components/HeaderOnline/HeaderOnline";
import { useMenus } from "../../hooks/useMenus";
import AllMenuIcon from "../../components/Icon/AllFoodDrink";
import Keranjang from "../../components/Icon/Keranjang";

const steps = [
  {
    icon: AllMenuIcon,
    title: "Pilih Menu",
    desc: "Pilih makanan dan minuman favorit Anda dari menu yang tersedia",
  },
  {
    icon: Keranjang,
    title: "Tambah ke Keranjang",
    desc: "Pilih jumlah dan tambahkan catatan khusus jika diperlukan",
  },
  {
    icon: Banknote,
    title: "Lanjut ke Pembayaran",
    desc: "Selesaikan pembayaran dan pesanan Anda akan segera Kami proses",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  // Ambil data asli dari backend
  const { data: menu = [], isLoading } = useMenus();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [successItemName, setSuccessItemName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.items || []);

  const recommendationMenu = useMemo(() => {
    const currentCart = Array.isArray(cart) ? cart : [];

    const targetKeywords = [
      "mie",
      "penyet",
      "jeruk",
      "teler",
      "lychee",
      "matcha",
      "sate",
      "soto",
      "mangga",
    ];

    // Filter nama menu yang mengandung salah satu kata kunci di atas
    const filteredRecommendations = menu.filter((item) => {
      const itemNameLower = (item.name || "").toLowerCase();
      return targetKeywords.some((keyword) => itemNameLower.includes(keyword));
    });

    // Filter lapis kedua berdasarkan keyword ketikan user di Hero Section (jika ada)
    const finalSearched = filteredRecommendations.filter((item) =>
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return finalSearched.slice(0, 6).map((item) => {
      const itemInCart = currentCart.find(
        (c) => String(c.id) === String(item.id),
      );
      const remainingStock = (item.stock || 0) - (itemInCart?.qty || 0);

      return {
        ...item,
        image: item.image,
        stock: Math.max(0, remainingStock),
      };
    });
  }, [cart, searchQuery, menu]);

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

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // LOADING INDICATOR
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header mode="online" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6 space-y-6">
        <HeroSection
          title="Pesan Menu<br />Favoritmu"
          subtitle="Pesan Makanan & Minuman Tanpa Ribet"
          imageBg="/images/banner-menu.webp"
          showSearch={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
        />

        {/* SECTION REKOMENDASI MENU */}
        <section className="bg-white rounded-xs shadow-sm p-4 md:p-6 lg:p-10 mb-9">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-6">
            Rekomendasi Menu
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {recommendationMenu.length > 0 ? (
              recommendationMenu.map((item) => (
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
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">
                Menu tidak ditemukan
              </div>
            )}
          </div>
          <div className="flex justify-center mt-12">
            <Button
              onClick={() => navigate("/customer/menu")}
              className="bg-primary/50! px-10 py-2.5 rounded-sm text-primary font-bold shadow-sm"
            >
              Lihat Semua Menu
            </Button>
          </div>
        </section>

        {/* Section Cara Pesan */}
        <section className="bg-white rounded-xs shadow-sm p-12 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Cara Pesan</h2>
          <p className="text-gray-500 mb-16">
            Pesan Menu Favoritmu dalam 3 Langkah
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
                  <s.icon size={40} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 bg-primary/50 text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-lg text-primary">{s.title}</h3>
                </div>
                <p className="text-sm text-gray-400 max-w-65">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section Lokasi & Jam Operasional */}
        <section className="bg-white rounded-xs shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="p-6 border border-gray-100 rounded-xs shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-5">
                Lokasi & Kontak Kami
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="text-white fill-primary shrink-0"
                    size={18}
                  />
                  <p className="text-[13px] text-black leading-relaxed">
                    Jl. Pajajaran No. 25 <br /> Baranangsiang, Kec. Bogor Timur{" "}
                    <br /> Kota Bogor, Jawa Barat 16143
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail
                    className="text-white fill-primary shrink-0"
                    size={18}
                  />
                  <p className="text-[13px] text-black font-medium">
                    itsresto@gmail.com
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone
                    className="text-white fill-primary shrink-0"
                    size={18}
                  />
                  <p className="text-[13px] text-black font-medium">
                    0825-7865-9876
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border border-gray-150 rounded-xs shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-5">
                Jam Operasional
              </h3>
              {[
                { d: "Senin - Kamis", t: "09:00-22:00" },
                { d: "Jumat", t: "09:30-22:30" },
                { d: "Sabtu", t: "10:00-23:00" },
                { d: "Minggu", t: "10:00-22:00" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-3 border-b border-gray-150 last:border-0 text-[13px]"
                >
                  <span className="text-black">{item.d}</span>
                  <span className="font-medium text-primary">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
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
      <footer className="text-center py-8 border-t border-gray-100 text-gray-400 text-sm">
        <p>© 2026 IT'S Resto. All rights reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;
