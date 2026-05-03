import { useState } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Button from "../../components/ui/Button";
import CategoryTabs from "../../components/CategoryFilterTabs/CategoryFilterTabs";
import MenuCard, { type MenuItem } from "../../components/Card/MenuCard";
import CreateOrderIcon from "../../components/Icon/CreateOrderIcon";
import { useNavigate } from "react-router";
import CreateOrderModal from "../../components/Modal/CreateOrderModal";

// Mock Data
const MOCK_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Kambing",
    price: 40000,
    description: "Nasi goreng dengan daging kambing empuk",
    image: "/images/nasgor.jpg",
    category: "makanan",
  },
  {
    id: "2",
    name: "Sate Ayam",
    price: 40000,
    description: "Sate ayam dengan bumbu kacang khas",
    image: "/images/sate.jpg",
    category: "makanan",
  },
  {
    id: "3",
    name: "Es Teler",
    price: 20000,
    description: "Minuman segar dengan campuran buah dan sirup",
    image: "/images/esteler.jpg",
    category: "minuman",
  },
  {
    id: "4",
    name: "Sop Iga",
    price: 50000,
    description: "Sop iga lembut yang dipadukan dengan kaldu",
    image: "/images/sopiga.jpg",
    category: "makanan",
  },
  {
    id: "5",
    name: "Matcha Latte",
    price: 30000,
    description: "Matcha lembut dengan rasa teh",
    image: "/images/matcha.jpg",
    category: "minuman",
  },
  {
    id: "6",
    name: "Lemon Tea",
    price: 20000,
    description: "Lemon tea segar dengan rasa asam manis",
    image: "/images/lemontea.jpg",
    category: "minuman",
  },
  {
    id: "7",
    name: "Lychee Tea",
    price: 20000,
    description: "Perpaduan teh dan leci yang segar",
    image: "/images/lychee.jpg",
    category: "minuman",
  },
  {
    id: "8",
    name: "Gado-gado",
    price: 30000,
    description: "Sayuran segar dengan siraman bumbu kacang",
    image: "/images/gado.jpg",
    category: "makanan",
    stock: 0,
  },
];

const WaiterCreateOrderPage = () => {
  const [activeCategory, setActiveCategory] = useState<
    "semua" | "makanan" | "minuman"
  >("semua");

  // Filter menu berdasarkan kategori aktif
  const filteredMenu = MOCK_MENU.filter((item) =>
    activeCategory === "semua" ? true : item.category === activeCategory,
  );

  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="pt-8 pl-7 pr-2.5">
        <DashboardHeader
          title="Buat Pesanan"
          subtitle="Mulai pesanan baru untuk pelanggan"
          userName="Mila"
          roleName="Pelayan"
        />
      </div>

      <div className="pt-0 pb-6 px-7 flex flex-col flex-1 min-h-0">
        {/* 2. TOMBOL BUAT PESANAN (Persis seperti gambar, putih rounded outline) */}
        <div className="mb-4">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white w-62.5 text-primary text-center border-none shadow-sm rounded-md px-6 py-2.5 font-bold flex justify-center items-center gap-1 hover:bg-gray-50 transition-colors"
          >
            {/* Icon Plus Ungu */}
            <CreateOrderIcon className="w-6 h-6" strokeWidth={3} />
            Buat Pesanan
          </Button>
        </div>

        {/* 3. KONTEN PUTIH UTAMA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {/* Tab Kategori */}
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Grid Menu (4 Kolom di Desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
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
                <MenuCard.Footer
                  onAdd={() => console.log(`Tambah: ${item.name}`)}
                />
              </MenuCard>
            ))}
          </div>
        </div>
      </div>

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelectTable={() => {
          setIsCreateModalOpen(false);
          navigate("/waiter/create-order/select-table"); // Navigasi ke halaman Pilih Meja
        }}
      />
    </div>
  );
};

export default WaiterCreateOrderPage;
