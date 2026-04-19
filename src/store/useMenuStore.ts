import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type MenuItem } from "../components/MenuCardOnline/MenuCardOnline";

interface MenuStore {
  menu: MenuItem[];
  // Fungsi untuk memotong stok saat pembayaran berhasil
  reduceStock: (soldItems: { id: string; qty: number }[]) => void;
  // Fungsi tambahan untuk reset stok jika kamu ingin mulai dari awal lagi (untuk demo)
  resetMenu: () => void;
}

// Master Data Menu IT'S Resto
const initialMenu: MenuItem[] = [
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
    id: "12",
    name: "Sate Ayam",
    price: 40000,
    description: "Sate ayam dengan bumbu kacang khas",
    category: "makanan",
    image: "/images/sate.jpg",
    stock: 20,
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
    name: "Sop Iga",
    price: 65000,
    description: "Sop iga sapi dengan kuah kaldu gurih",
    category: "makanan",
    image: "/images/sop iga.jpg",
    stock: 19,
  },
  {
    id: "5",
    name: "Es Teh Manis",
    price: 8000,
    description: "Teh manis segar dengan es batu",
    category: "minuman",
    image: "/images/esteh.jpg",
    stock: 100,
  },
  {
    id: "11",
    name: "Gado-gado",
    price: 30000,
    description: "Sayuran segar dengan saus kacang",
    category: "makanan",
    image: "/images/gadogado.jpg",
    stock: 0,
  },
  {
    id: "6",
    name: "Lychee Tea",
    price: 20000,
    description: "Perpaduan teh berkualitas dengan buah lychee segar",
    category: "minuman",
    image: "/images/lychee.jpg",
    stock: 15,
  },
  {
    id: "7",
    name: "Matcha Latte",
    price: 30000,
    description: "Matcha lembut dengan susu creamy pilihan",
    category: "minuman",
    image: "/images/matcha.jpg",
    stock: 8,
  },
  {
    id: "8",
    name: "Es Jeruk",
    price: 20000,
    description: "Jeruk segar...",
    category: "minuman",
    image: "/images/esjeruk.jpg",
    stock: 20,
  },
  {
    id: "9",
    name: "Mie Ayam Bakso",
    price: 30000,
    description: "Mie ayam kenyal dengan bakso sapi asli",
    category: "makanan",
    image: "/images/mieayam.jpg",
    stock: 12,
  },
  {
    id: "10",
    name: "Ayam Penyet",
    price: 40000,
    description: "Ayam goreng penyet dengan sambal korek pedas",
    category: "makanan",
    image: "/images/ayampenyet.jpg",
    stock: 5,
  },
];

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menu: initialMenu,

      // Logika pengurangan stok permanen
      reduceStock: (soldItems) => {
        set((state) => ({
          menu: state.menu.map((m) => {
            const sold = soldItems.find((s) => s.id === m.id);
            // Jika menu terjual, kurangi stoknya (minimal 0)
            return sold ? { ...m, stock: Math.max(0, m.stock - sold.qty) } : m;
          }),
        }));
      },

      // Untuk mengembalikan stok ke angka awal (Initial Menu)
      resetMenu: () => set({ menu: initialMenu }),
    }),
    {
      name: "its-resto-menu-data", // Nama kunci di Local Storage
    },
  ),
);

export default useMenuStore;
