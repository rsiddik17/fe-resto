import { useState } from "react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Button from "../../components/ui/Button";
import CategoryTabs from "../../components/CategoryFilterTabs/CategoryFilterTabs";
import MenuCard from "../../components/Card/MenuCard";
import CreateOrderIcon from "../../components/Icon/CreateOrderIcon";
import { useNavigate } from "react-router";
import CreateOrderModal from "../../components/Modal/CreateOrderModal";
import { useMenus } from "../../hooks/useMenus";
import WarningIcon from "../../components/Icon/WarningIcon";

const WaiterCreateOrderPage = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: menus = [], isLoading, isError, refetch } = useMenus();

  const [activeCategory, setActiveCategory] = useState<
    "semua" | "makanan" | "minuman"
  >("semua");

  const filteredMenu = menus.filter((item) =>
    activeCategory === "semua" ? true : item.category === activeCategory,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="pt-7.5 pl-8 pr-6">
        <DashboardHeader
          title="Buat Pesanan"
          subtitle="Mulai pesanan baru untuk pelanggan"
          userName="Mila"
          roleName="Pelayan"
        />
      </div>

      <div className="pt-0 pb-0 px-8 flex flex-col flex-1 min-h-0">
        {/* 2. TOMBOL BUAT PESANAN (Persis seperti gambar, putih rounded outline) */}
        <div className="mb-4">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white w-62.5 text-primary text-center border-none shadow-sm rounded-md px-6 py-2.5 font-bold flex justify-center items-center gap-1 hover:bg-gray-50 transition-colors"
          >
            {/* Icon Plus Ungu */}
            <CreateOrderIcon className="w-6.5 h-6.5" strokeWidth={3} />
            Buat Pesanan
          </Button>
        </div>

        {/* 3. KONTEN PUTIH UTAMA */}
        <div className="bg-white rounded-t-md shadow-sm border border-gray-100 p-4 md:p-6 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {/* Tab Kategori */}
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <span className="text-primary font-bold animate-pulse text-lg">
                  Memuat menu...
                </span>
              </div>
            ) : isError ? (
              <div className="flex flex-col justify-center items-center h-48 gap-4 px-4 text-center mt-4">
                <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">
                    <WarningIcon />
                  </span>
                </div>
                <p className="text-gray-600 font-medium">
                  Gagal memuat menu. Silakan Coba lagi nanti.
                </p>
                <Button
                  onClick={() => refetch()}
                  className="px-6 py-2 rounded-sm font-bold shadow-sm"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
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
            )}
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
