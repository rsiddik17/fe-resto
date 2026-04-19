import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { useCartStore } from "../../store/useCartStore";
import MenuCard, { type MenuItem } from "../../components/MenuCardOnline/MenuCardOnline";
import SuccessModal from "../../components/SuccessModalOnline/SuccessModalOnline";
import MenuItemModal from "../../components/MenuItemModalOnline/MenuItemModalOnline";
import Button from "../../components/ui/Button";
import { Utensils, ShoppingCart, Banknote, MapPin, Mail, Phone } from "lucide-react";
import HeroSection from "../../components/HeroSectionOnline/HeroSectionOnline";
import Header from "../../components/HeaderOnline/HeaderOnline";
// Import data asli dari store
import { useMenuStore } from "../../store/useMenuStore";


const steps = [
  { icon: Utensils, title: "Pilih Menu", desc: "Pilih makanan dan minuman favorit Anda dari menu yang tersedia" },
  { icon: ShoppingCart, title: "Tambah ke Keranjang", desc: "Pilih jumlah dan tambahkan catatan khusus jika diperlukan" },
  { icon: Banknote, title: "Lanjut ke Pembayaran", desc: "Selesaikan pembayaran dan pesanan Anda akan segera Kami proses" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  // const { resetMenu } = useMenuStore();
  const { menu } = useMenuStore(); // Mengambil master data menu
  // useEffect(() => {
  //   resetMenu(); 
  // }, [resetMenu]);
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [successItemName, setSuccessItemName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.items || []);

  const recommendationMenu = useMemo(() => {
    const currentCart = Array.isArray(cart) ? cart : [];

    // Tentukan ID menu yang ingin ditampilkan di Beranda
    // Sesuaikan ID ini dengan yang ada di useMenuStore.ts kamu
    const recommendationIds = ["3", "6", "7", "8", "9", "10"]; 

    return menu
      .filter((item) => recommendationIds.includes(item.id)) // Filter hanya ID rekomendasi
      .map((item) => {
        const itemInCart = currentCart.find((c) => String(c.id) === String(item.id));
        const remainingStock = (item.stock || 0) - (itemInCart?.qty || 0);
        return { ...item, stock: Math.max(0, remainingStock) };
      })
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [cart, searchQuery, menu]);

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
        <HeroSection 
          title="Pesan Menu<br />Favoritmu" 
          subtitle="Pesan Makanan & Minuman Tanpa Ribet" 
          imageBg="/images/banner-menu.webp" 
          showSearch={true} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />

        <section className="bg-white rounded-xs shadow-sm p-6 md:p-10 mb-9">
          <h2 className="text-2xl font-bold text-primary mb-6">Rekomendasi Menu</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {recommendationMenu.length > 0 ? (
              recommendationMenu.map((item) => (
                <MenuCard key={item.id}>
                  <MenuCard.Header image={item.image} name={item.name} stock={item.stock} />
                  <MenuCard.Body 
                    name={item.name} 
                    price={item.price} 
                    description={item.description} // Deskripsi otomatis muncul dari master data
                  />
                  <MenuCard.Footer onAdd={() => setSelectedItem(item)} disabled={item.stock === 0} />
                </MenuCard>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">Menu tidak ditemukan</div>
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
          <p className="text-gray-500 mb-16">Pesan Menu Favoritmu dalam 3 Langkah</p>
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
              <h3 className="text-lg font-bold text-primary mb-5">Lokasi & Kontak Kami</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-white fill-primary shrink-0" size={18} />
                  <p className="text-[13px] text-black leading-relaxed">
                    Jl. Pajajaran No. 25 <br /> Baranangsiang, Kec. Bogor Timur <br /> Kota Bogor, Jawa Barat 16143
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-white fill-primary shrink-0" size={18} />
                  <p className="text-[13px] text-black font-medium">itsresto@gmail.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-white fill-primary shrink-0" size={18} />
                  <p className="text-[13px] text-black font-medium">0825-7865-9876</p>
                </div>
              </div>
            </div>
            <div className="p-6 border border-gray-100 rounded-xs shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-5">Jam Operasional</h3>
              {[
                { d: "Senin - Kamis", t: "09:00-22:00" }, 
                { d: "Jumat", t: "09:30-22:30" },
                { d: "Sabtu", t: "10:00-23:00" }, 
                { d: "Minggu", t: "10:00-22:00" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between py-3 border-b border-gray-150 last:border-0 text-[13px]">
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
          onViewCart={() => navigate("/customer/keranjang")} 
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