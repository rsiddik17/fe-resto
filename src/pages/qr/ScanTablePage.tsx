import { useParams, useNavigate } from "react-router";
import TableInfoCard from "../../components/TableInfoCard/TableInfoCard";

// import { useCartStore } from "../../store/useCartStore"; // Nanti buka ini untuk simpan meja

const ScanTablePage = () => {
  const navigate = useNavigate();

  // 1. Tangkap parameter dari URL (contoh: /scan/03)
  const { tableId } = useParams();

  // 2. Cegah error TypeScript dan format angkanya jadi M-XX
  const rawNumber = tableId?.replace(/\D/g, "") || "00"; // Fallback ke "00" jika undefined
  const formattedTableId = `M-${rawNumber.padStart(2, "0")}`;

  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-b from-primary/0 to-primary/15 relative overflow-hidden px-4">
      {/* Logo di atas */}
      <div className="w-full flex justify-center z-10 pt-8 md:pt-14 pb-2">
        <img
          src="/images/logo.webp"
          alt="Logo IT'S RESTO"
          className="w-48 object-cover"
        />
      </div>
      <div className="flex-1 w-full flex items-start justify-center pb-10">
        <div className="w-full max-w-[90%]">
        <TableInfoCard
          tableNumber={formattedTableId}
          onLanjut={() => navigate("/scanqr/home")}
          onBatal={() => navigate("/")}
        />
        </div>
      </div>
    </div>
  );
};

export default ScanTablePage;
