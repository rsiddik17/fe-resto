import { useQuery } from "@tanstack/react-query";
import { menuAPI } from "../api/menu.api";
import type { MenuItem } from "../components/Card/MenuCard";

export const useMenus = () => {
  return useQuery({
    queryKey: ["menus"], // Kunci unik untuk caching
    queryFn: async (): Promise<MenuItem[]> => {
      const responsePayload = await menuAPI.getAllMenu();
      const menuArray = responsePayload.data || responsePayload;

      if (!Array.isArray(menuArray)) {
        throw new Error("Format data dari server tidak sesuai.");
      }

      // Translasi Data (Mapping)
      return menuArray.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: parseInt(item.price, 10),
        description: item.description,
        category: item.category === "FOOD" ? "makanan" : "minuman",
        image: `${import.meta.env.VITE_BACKEND_URL}${item.image_path}`,
        stock: item.stock,
      }));
    },
  });
};