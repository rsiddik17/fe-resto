import { cn } from "../../utils/utils";
import MenuTableAction from "./MenuTableAction"; 

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export interface MenuItemData {
  id: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  image: string;
}

interface MenuTableProps {
  menus: MenuItemData[];
  isLoading: boolean;
  isError: boolean;
  onTriggerDelete: (id: string, name: string) => void;
}

const MenuTable = ({ menus, isLoading, isError, onTriggerDelete }: MenuTableProps) => {
  return (
    // DI SINI KITA HAPUS overflow-y-auto AGAR TABEL TIDAK SCROLL DI DALAM
    <div className="w-full bg-white rounded-b-sm">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-primary text-white">
          <tr className="text-[14.5px] uppercase tracking-wider">
            <th className="py-2.5 px-6 font-bold w-[28%] rounded-tl-sm">MENU</th>
            <th className="py-2.5 px-6 font-bold w-[10%] text-center">KATEGORI</th>
            <th className="py-2.5 px-6 font-bold w-[15%] text-center">HARGA</th>
            <th className="py-2.5 px-6 font-bold w-[10%] text-center">STOK</th>
            <th className="py-2.5 px-6 font-bold w-[15%] text-center">STATUS</th>
            <th className="py-2.5 px-6 font-bold w-[10%] text-center rounded-tr-sm">AKSI</th>
          </tr>
        </thead>
        
        <tbody className="text-[14px] text-black">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-primary font-bold animate-pulse rounded-b-sm">Memuat menu...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-red-500 font-bold rounded-b-sm">Gagal memuat menu.</td>
            </tr>
          ) : menus.length > 0 ? (
            menus.map((menu, index) => {
              const isOutOfStock = menu.stock !== undefined && menu.stock <= 0;
              // Tambahkan rounded-bottom pada baris terakhir agar sudut kotak putihnya melengkung rapi
              const isLastItem = index === menus.length - 1;
              
              return (
                <tr key={menu.id} className={cn("group transition-colors", !isLastItem && "border-b border-gray-100")}>
                  
                  <td className={cn("py-3 px-5 flex items-center gap-3 transition-colors group-hover:bg-gray-50", isLastItem && "rounded-bl-sm")}>
                    <div className="w-13 h-13 rounded-sm overflow-hidden shrink-0 shadow-sm border border-gray-100">
                      <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-[14.5px]">{menu.name}</span>
                  </td>
                  
                  <td className="py-3 px-8 text-left capitalize transition-colors group-hover:bg-gray-50">{menu.category}</td>
                  <td className="py-3 px-6 text-center transition-colors group-hover:bg-gray-50">{rupiahFormatter.format(menu.price)}</td>
                  <td className="py-3 px-6 text-center transition-colors group-hover:bg-gray-50">{menu.stock || 0}</td>
                  
                  <td className="py-3 px-6 text-center transition-colors group-hover:bg-gray-50">
                    <span className={cn(
                      "text-white px-3 py-1.25 rounded-full text-[11px] font-bold uppercase tracking-wide",
                      isOutOfStock ? "bg-[#FC1111]" : "bg-[#8AC926]"
                    )}>
                      {isOutOfStock ? "HABIS" : "TERSEDIA"}
                    </span>
                  </td>
                  
                  <td className={cn("py-3 px-6 text-center transition-colors group-hover:bg-gray-50", isLastItem && "rounded-br-sm")}>
                    <MenuTableAction menuId={menu.id} onDelete={() => onTriggerDelete(menu.id, menu.name)} />
                  </td>

                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400 rounded-b-sm">Tidak ada menu yang ditemukan.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MenuTable;