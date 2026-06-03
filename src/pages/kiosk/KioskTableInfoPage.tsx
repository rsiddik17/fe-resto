import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import TableInfoCard from "../../components/Card/TableInfoCard";
import Loading from "../../components/Loading/Loading";
import Button from "../../components/ui/Button";

import { tableAPI } from "../../api/table.api";
import { useCartStore } from "../../store/useCartStore";
import { isAxiosError } from "axios";

const KioskTableInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const guestsParam = location.state?.guests;

  const { setTableInfo } = useCartStore();

  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [tableId, setTableId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<{
    main: string;
    sub?: string;
  } | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchAndAssignTable = async () => {
      // Jika sudah pernah nge-fetch, langsung BERHENTI! (Mencegah double hit React Strict Mode)
      if (hasFetched.current) return;
      hasFetched.current = true;

      // Validasi jumlah tamu
      const guestCount = parseInt(guestsParam || "0", 10);

      if (guestCount <= 0) {
        setErrorMsg({ main: "Jumlah tamu tidak valid." });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // 1. Tembak API Auto Assign dari Backend
        const response = await tableAPI.autoAssignTable({ guest: guestCount });

        if (response.success && response.data) {
          const { table_number, table_id } = response.data;

          setTableNumber(table_number);
          setTableId(table_id);
        }
      } catch (err: any) {
        console.error("Gagal auto-assign meja:", err);
        
        // Tangkap pesan error spesifik dari backend (FULL_HOUSE atau NO_SUITABLE_TABLE)
        if (isAxiosError(err) && err.response) {
           const backendMessage = err.response.data.message;

           setErrorMsg({
             main: "Ups! Meja Tidak Tersedia",
             sub: backendMessage || "Maaf, saat ini tidak ada meja yang bisa digunakan.",
           });
        } else {
           setErrorMsg({
             main: "Terjadi kesalahan jaringan.",
             sub: "Gagal terhubung ke server. Silakan coba lagi.",
           });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAssignTable();
  }, [guestsParam]);

  const handleCancel = async () => {
    if (tableId) {
      try {
        setIsLoading(true);
        await tableAPI.updateTable(tableId, { status: "AVAILABLE" });
      } catch (error) {
        console.error("Gagal merilis meja:", error);
      } finally {
        setIsLoading(false);
        navigate("/kiosk/home");
      }
    } else {
      navigate("/kiosk/home");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-b from-primary/0 to-primary/15 relative overflow-y-auto">
      <Loading show={isLoading} />
      {/* Logo di atas */}
      <div className="w-full flex justify-center z-10 relative -translate-y-2">
        <img
          src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
          alt="Logo IT'S RESTO"
          className="w-40 md:w-65 lg:w-50 object-cover"
        />
      </div>
      <div className="w-full flex items-center justify-center -mt-4 md:-mt-8 lg:-mt-6 mb-6 z-20 relative px-5">
        {/* Kirim nomor meja ke komponen Card */}
        {errorMsg && !isLoading && (
          <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-md shadow-sm text-center flex flex-col items-center">
            <h2 className="text-lg md:text-2xl lg:text-xl font-bold text-red-500 mb-2 md:mb-4 lg:mb-3">Ups!</h2>
            <p className="text-black/60 text-sm md:text-[17px] lg:text-base mb-4 md:mb-6">{errorMsg.main}</p>

            {errorMsg.sub && (
              <p className="text-black/50 text-[13px] md:text-[15px] mb-6 md:mb-8 leading-relaxed px-2">
                {errorMsg.sub}
              </p>
            )}
            <Button
              onClick={() => navigate("/kiosk/home")}
              className="w-full py-2 md:py-3 lg:py-2.5 text-[14px] md:text-base lg:text-[15px]"
            >
              Kembali ke Awal
            </Button>
          </div>
        )}

        {/* JIKA MEJA BERHASIL DITEMUKAN */}
        {tableNumber && tableId !== null && !isLoading && (
          <TableInfoCard
            tableNumber={tableNumber}
            onLanjut={() => {
               setTableInfo(tableId, tableNumber);
               navigate(`/kiosk/menu`);
            }}
            onBatal={handleCancel}
            isKioskMode={true}
          />
        )}
      </div>
    </div>
  );
};

export default KioskTableInfoPage;
