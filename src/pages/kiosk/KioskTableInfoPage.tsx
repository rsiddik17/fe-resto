import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import TableInfoCard from "../../components/Card/TableInfoCard";
import Loading from "../../components/Loading/Loading";
import Button from "../../components/ui/Button";

import { tableAPI } from "../../api/table.api";
import { useCartStore } from "../../store/useCartStore";

interface TableData {
  id: number;
  table_number: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED";
}

const KioskTableInfoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const guestsParam = searchParams.get("guests");

  const { setTableInfo } = useCartStore();

  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [tableId, setTableId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<{
    main: string;
    sub?: string;
  } | null>(null);

  useEffect(() => {
    const fetchAndAssignTable = async () => {
      // Validasi jumlah tamu
      const guestCount = parseInt(guestsParam || "0", 10);

      if (guestCount <= 0) {
        setErrorMsg({ main: "Jumlah tamu tidak valid." });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Hit API
        const response = await tableAPI.getAllTables();
        const tables: TableData[] = response.data;

        // 1. Filter semua meja yang statusnya AVAILABLE
        const availableTables = tables.filter((t) => t.status === "AVAILABLE");

        // 2. CARI MEJA: Syaratnya kapasitasnya >= jumlah tamu
        // Urutkan dari kapasitas terkecil yang muat
        const suitableTable = availableTables
          .filter((t) => t.capacity >= guestCount)
          .sort((a, b) => a.capacity - b.capacity)[0];

        if (suitableTable) {
          setTableNumber(suitableTable.table_number);
          setTableId(suitableTable.id);
        } else {
          // LOGIKA BARU: Jika meja tidak cukup, cek apakah masih ada meja kosong lain
          if (availableTables.length > 0) {
            // Cari kapasitas terbesar dari meja yang tersisa
            const maxCapacity = Math.max(
              ...availableTables.map((t) => t.capacity),
            );

            setErrorMsg({
              main: `Maaf, tidak ada meja kosong yang muat untuk ${guestCount} orang.`,
              sub: `Kapasitas meja terbesar yang tersedia saat ini maksimal untuk ${maxCapacity} orang. Silakan ulangi masukkan jumlah tamu atau kembali nanti.`,
            });
          } else {
            // Jika availableTables.length === 0, berarti full house
            setErrorMsg({
              main: "Maaf, saat ini semua meja sedang penuh.",
              sub: "Silakan tunggu beberapa saat lagi hingga ada pelanggan yang selesai.",
            });
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data meja:", err);
        setErrorMsg({
          main: "Terjadi kesalahan jaringan.",
          sub: "Gagal terhubung ke server. Silakan coba lagi.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAssignTable();
  }, [guestsParam]);

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
        {tableNumber && !isLoading && (
          <TableInfoCard
            tableNumber={tableNumber}
            onLanjut={() => {
               setTableInfo(tableId, tableNumber);
               navigate(`/kiosk/menu`);
            }}
            onBatal={() => navigate(`/kiosk/home`)}
            isKioskMode={true}
          />
        )}
      </div>
    </div>
  );
};

export default KioskTableInfoPage;
