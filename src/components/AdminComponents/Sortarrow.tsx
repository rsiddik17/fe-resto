// ============================================================
// SortArrow.tsx — ikon arah sort yang dipakai semua tabel
// ============================================================

import { ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  field: string;
  sort: { field: string; order: "asc" | "desc" };
};

const SortArrow = ({ field, sort }: Props) => (
  <div className="flex flex-col text-gray-400 ml-1">
    <ChevronUp
      size={10}
      className={
        sort.field === field && sort.order === "asc"
          ? "text-primary font-black"
          : "opacity-40"
      }
    />
    <ChevronDown
      size={10}
      className={
        sort.field === field && sort.order === "desc"
          ? "text-primary font-black"
          : "opacity-40"
      }
    />
  </div>
);

export default SortArrow;