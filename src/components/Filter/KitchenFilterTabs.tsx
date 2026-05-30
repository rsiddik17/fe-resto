import { cn } from "../../utils/utils";

// Export tipe agar bisa dipakai di tempat lain
export type OrderStatus = "MASUK" | "MEMASAK" | "SIAP_SAJI";

interface KitchenFilterTabsProps {
  activeTab: OrderStatus;
  onTabChange: (tab: OrderStatus) => void;
}

const KitchenFilterTabs = ({ activeTab, onTabChange }: KitchenFilterTabsProps) => {
  const getTabStyle = (tabName: OrderStatus) => {
    const baseStyle = "px-8 py-2.5 w-full md:w-45 rounded-full font-bold text-[14px] transition-all cursor-pointer shadow-sm";
    if (tabName === "MASUK") return cn(baseStyle, activeTab === "MASUK" ? "bg-[#1890FF] text-white" : "bg-white text-[#1890FF] hover:bg-blue-50");
    if (tabName === "MEMASAK") return cn(baseStyle, activeTab === "MEMASAK" ? "bg-[#FF9100] text-white" : "bg-white text-[#FF9100] hover:bg-orange-50");
    if (tabName === "SIAP_SAJI") return cn(baseStyle, activeTab === "SIAP_SAJI" ? "bg-[#8AC926] text-white" : "bg-white text-[#8AC926] hover:bg-green-50");
  };

  return (
    <div className="flex items-center flex-col md:flex-row gap-4 mb-4 shrink-0">
      <button onClick={() => onTabChange("MASUK")} className={getTabStyle("MASUK")}>Pesanan Masuk</button>
      <button onClick={() => onTabChange("MEMASAK")} className={getTabStyle("MEMASAK")}>Memasak</button>
      <button onClick={() => onTabChange("SIAP_SAJI")} className={getTabStyle("SIAP_SAJI")}>Siap Saji</button>
    </div>
  );
};

export default KitchenFilterTabs;