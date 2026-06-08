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
    description: "Jeruk segar dengan rasa manis dan asam yang menyegarkan",
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
  {
    id: "13",
    name: "Lemon Tea",
    price: 20000,
    description: "Lemon tea segar dengan rasa asam manis",
    category: "minuman",
    image: "/images/lemontea.jpg",
    stock: 35,
  },
  {
    id: "14",
    name: "Bakso urat",
    price: 30000,
    description: "Bakso sapi urat yang lembut kuah kaldu gurih",
    category: "makanan",
    image: "/images/baksourat.jpg",
    stock: 25,
  },
  {
    id: "15",
    name: "Le Mineral",
    price: 5000,
    description: "Air Mineral Segar",
    category: "minuman",
    image: "/images/airmenaral.jpg",
    stock: 50,
  },
  {
    id: "16",
    name: "Nasi Bakar",
    price: 30000,
    description: "Nasi bakar dengan citarasa yang khas",
    category: "makanan",
    image: "/images/nasibakar.jpg",
    stock: 15,
  },
  {
    id: "17",
    name: "Nasi Goreng",
    price: 30000,
    description: "Nasi goreng dengan bumbu khas dan gurih",
    category: "makanan",
    image: "/images/nasigoreng.jpg",
    stock: 15,
  },
  {
    id: "17",
    name: "Soto Ayam",
    price: 40000,
    description: "Soto ayam dengan kuah gurih dan aroma rempah",
    category: "makanan",
    image: "/images/sotoayam.jpg",
    stock: 25,
  },
  {
    id: "18",
    name: "Nasi Liwet",
    price: 30000,
    description: "Hidangan nasi gurih khas dengan lauk perlengkap",
    category: "makanan",
    image: "/images/nasiliwet.jpg",
    stock: 15,
  },
  {
    id: "19",
    name: "Kopi Susu",
    price: 20000,
    description: "Kopi susu creamy dengan sentuhan manis lembut",
    category: "minuman",
    image: "/images/kopisusu.jpg",
    stock: 45,
  },
  {
    id: "20",
    name: "Nasi Goreng Udang",
    price: 40000,
    description: "Nasi goreng dengan udang segar dan bumbu khas",
    category: "makanan",
    image: "/images/nasgorudang.jpg",
    stock: 15,
  },
  {
    id: "21",
    name: "Nasi Kuning",
    price: 30000,
    description: "Nasi berbumbu kunyit dengan rasa gurih khas",
    category: "makanan",
    image: "/images/nasikuning.jpg",
    stock: 15,
  },
  {
    id: "22",
    name: "Milkshake Stroberi",
    price: 20000,
    description: "Minuman susu creamy dengan rasa stoberi manis",
    category: "minuman",
    image: "/images/kopisusu.jpg",
    stock: 45,
  },
  {
    id: "23",
    name: "Nasi Kebuli",
    price: 50000,
    description: "Nasi rempah dengan rasa gurih aroma rempah yang kuat",
    category: "makanan",
    image: "/images/nasikebuli.jpg",
    stock: 10,
  },
  {
    id: "24",
    name: "Cireng Bumbu Rujak",
    price: 20000,
    description: "Cireng krispi dengan bumbu rujak asam manis",
    category: "makanan",
    image: "/images/cirengbumburujak.jpg",
    stock: 30,
  },
  {
    id: "25",
    name: "Roti Bakar Cokelat",
    price: 20000,
    description: "Roti bakar lembut dengan selai cokelat",
    category: "makanan",
    image: "/images/rotibakar.jpg",
    stock: 20,
  },
  {
    id: "26",
    name: "Es Kelapa Muda",
    price: 20000,
    description: "Es kelapa muda yang lembut dan menyegarkan",
    category: "minuman",
    image: "/images/cirengbumburujak.jpg",
    stock: 30,
  },
  {
    id: "27",
    name: "Pempek",
    price: 40000,
    description: "Pempek ikan tenggeri asli dan kuah cuko",
    category: "makanan",
    image: "/images/cirengbumburujak.jpg",
    stock: 40,
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
