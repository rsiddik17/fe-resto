import { cn } from "../../utils/utils";
import DiscountTableAction from "./DiscountTableAction";

export interface DiscountItem {
  id: number;
  name: string;
  code: string;
  minPurchase: number;
  discount: number;
  date: string;
  status: string;
}

interface DiscountTableProps {
  discounts: DiscountItem[];
  onDetail?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};


const DiscountTable = ({ discounts, onDetail, onEdit, onDelete }: DiscountTableProps) => {

  return (
    <div className="w-full bg-white rounded-sm">
      <table className="w-full text-left border-collapse min-w-225">
        {/* Header Tabel */}
        <thead className="bg-primary text-white sticky top-0 z-10">
          <tr>
            <th className="py-4 px-5 text-[13.5px] font-bold uppercase tracking-wide rounded-tl-sm">
              Nama Diskon
            </th>
            <th className="py-4 px-4 text-[13.5px] font-bold uppercase tracking-wide text-center">
              Kode <br /> Diskon
            </th>
            <th className="py-4 px-4 text-[13.5px] font-bold uppercase tracking-wide text-center">
              Minimal <br /> Pembelian
            </th>
            <th className="py-4 px-4 text-[13.5px] font-bold uppercase tracking-wide text-center">
              Total <br /> Diskon
            </th>
            <th className="py-4 px-4 text-[13.5px] font-bold uppercase tracking-wide text-center">
              Masa Berlaku
            </th>
            <th className="py-4 px-4 text-[13.5px] font-bold uppercase tracking-wide text-center">
              Status
            </th>
            <th className="py-4 px-5 text-[13.5px] font-bold uppercase tracking-wide text-center rounded-tr-sm">
              Aksi
            </th>
          </tr>
        </thead>

        {/* Body Tabel */}
        <tbody className="text-[13.5px]">
          {discounts.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {/* Nama */}
              <td className="py-4.5 px-5 text-black">{item.name}</td>

              {/* Kode Diskon (Badge Ungu) */}
              <td className="py-4.5 px-4 w-16 text-center">
                <span className="bg-primary block text-white px-3 py-0.75 rounded-full text-[11px] font-bold tracking-wide">
                  {item.code}
                </span>
              </td>

              {/* Min Pembelian */}
              <td className="py-4.5 px-4 text-center font-bold text-black">
                {formatRupiah(item.minPurchase)}
              </td>

              {/* Total Diskon */}
              <td className="py-4.5 px-4 text-center font-bold text-black">
                {formatRupiah(item.discount)}
              </td>

              {/* Masa Berlaku */}
              <td className="py-4.5 px-4 text-center text-[13px] text-black/80">
                {item.date}
              </td>

              {/* Status (Badge Dinamis) */}
              <td className="py-4.5 px-4 w-26.5 text-center">
                <span
                  className={cn(
                    "px-3 py-0.75 block rounded-full text-[10.5px] font-bold tracking-wide text-white",
                    item.status === "AKTIF" ? "bg-[#8AC926]" : "bg-[#FC1111]"
                  )}
                >
                  {item.status}
                </span>
              </td>

              {/* Aksi (Titik Tiga) */}
              <td className="py-4.5 px-5 text-center">
                <DiscountTableAction 
                  item={item} 
                  onDetail={onDetail} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State jika data kosong */}
      {discounts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
          Diskon tidak ditemukan.
        </div>
      )}
    </div>
  );
};

export default DiscountTable;