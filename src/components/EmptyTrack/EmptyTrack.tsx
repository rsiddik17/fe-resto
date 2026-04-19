import { Plus } from "lucide-react";

const EmptyCartView = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <img src="/images/keranjang-kosong.webp" alt="Kosong" className="w-64 h-auto mb-6 object-contain" />
    <p className="text-gray-500 text-lg font-medium mb-6">Keranjangmu masih kosong, yuk pilih menu!</p>
    <button onClick={onNavigate} className="bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-md">
      <Plus size={20} /> Tambah Menu
    </button>
  </div>
);

export default EmptyCartView;