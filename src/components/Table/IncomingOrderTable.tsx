import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/utils";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

// Tipe data untuk pesanan
export interface IncomingOrder {
  id: string;
  menu: string;
  table: string;
  status: string;
  total: number;
  method: string;
}

interface IncomingOrderTableProps {
  orders: IncomingOrder[];
}

const IncomingOrderTable = ({ orders }: IncomingOrderTableProps) => {
  const navigate = useNavigate();

  // Helper untuk warna badge metode pesanan
  const getMethodColor = (method: string) => {
    switch (method) {
      case "QR":
        return "bg-[#1AE91D]"; // Hijau
      case "KIOSK":
        return "bg-[#2196F3]"; // Biru
      case "ONLINE":
        return "bg-[#AD4EFA]"; // Ungu
      case "KASIR":
        return "bg-[#F35B28]"; // Orange
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Header Tabel */}
      <div className="flex justify-between items-center pl-7 pr-6 py-4 shrink-0">
        <h3 className="font-bold text-[17px]">Pesanan Masuk</h3>
        <button
          onClick={() => navigate("/cashier/order-list")}
          className="flex items-center text-primary text-[13px] font-normal hover:underline cursor-pointer"
        >
          Lihat semua <ChevronRight size={20} className="ml-0.5" />
        </button>
      </div>

      {/* Area Tabel */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-150">
          <thead>
            <tr className="bg-[#EFEEEE] border-gray-100 text-[#73736C] text-[11px] md:text-[12.5px] uppercase">
              <th className="py-2.5 pl-7 pr-1 font-bold tracking-wider w-[16%]">ORDER ID</th>
              <th className="py-2.5 px-4 font-bold tracking-wider w-[24%]">MENU</th>
              <th className="py-2.5 px-4 font-bold tracking-wider w-[10%]">MEJA</th>
              <th className="py-2.5 px-4 font-bold tracking-wider w-[15%]">STATUS</th>
              <th className="py-2.5 px-3 font-bold tracking-wider w-[10%]">TOTAL</th>
              <th className="py-2.5 pr-7 pl-1 font-bold tracking-wider w-[25%] text-center">METODE PESAN</th>
            </tr>
          </thead>
          <tbody className="text-[13px] md:text-[14px]">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-300 hover:bg-gray-50/50 text-[11px] md:text-[13px] transition-colors"
              >
                <td className="pt-0.5 pb-4 pl-7 pr-5 font-bold">{order.id}</td>
                <td className="pt-1.75 pb-4 pl-4">
                  <div className="wrap-break-word leading-tight">{order.menu}</div>
                </td>
                <td className="pt-1.75 pb-4 px-4 text-black">{order.table}</td>
                <td className="pt-1.75 pb-4 px-3">
                  <span className="bg-orange text-white px-2.5 py-0.75 rounded-full text-[12px] font-bold uppercase shadow-sm">
                    {order.status}
                  </span>
                </td>
                <td className="pt-1.75 pb-4 px-3 font-bold text-[13.5px]">
                  {rupiahFormatter.format(order.total)}
                </td>
                <td className="pt-1.75 pb-4 pr-7 pl-0 text-center">
                  <span
                    className={cn(
                      "text-white px-3 py-0.75 rounded-md text-[11.5px] font-bold text-center uppercase shadow-sm inline-block min-w-20",
                      getMethodColor(order.method)
                    )}
                  >
                    {order.method}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingOrderTable;