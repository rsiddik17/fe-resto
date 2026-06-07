import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import TableInfoCard from "../../components/Card/TableInfoCard";
import Loading from "../../components/Loading/Loading";
import Button from "../../components/ui/Button";

// Import API & Store
import { tableAPI, type TableData } from "../../api/table.api";
import { authAPI } from "../../api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";

const formatTableNumber = (raw?: string) => {
  if (!raw) return "Takeaway";
  if (
    raw.toLowerCase().includes("takeaway") ||
    raw.toLowerCase().includes("tanpa")
  ) {
    return "Takeaway";
  }
  const match = raw.match(/\d+/);
  if (match) {
    return `Meja ${match[0]}`; // Mengubah "M02_o" menjadi "Meja 02"
  }
  return `Meja ${raw}`;
};

const MobileTableInfoPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { setTableInfo } = useCartStore();
  const { setAuth, logout } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [errorMsg, setErrorMsg] = useState<{
    main: string;
    sub?: string;
  } | null>(null);

  let parsedTableId = 0;
  try {
    if (tableId) {
      const decodedString = atob(tableId);
      parsedTableId = parseInt(decodedString, 10);
    }
  } catch (error) {
    parsedTableId = 0;
    console.error(error);
  }

  useEffect(() => {
    const validateTable = async () => {
      try {
        setIsLoading(true);

        const loginPayload = { tableId: parsedTableId };
        const loginResponse = await authAPI.guestLogin(loginPayload);

        if (loginResponse.success && loginResponse.data?.token) {
          setAuth(loginResponse.data.token, "GUEST");
        } else {
          throw new Error(
            loginResponse.message || "Gagal melakukan login Guest.",
          );
        }

        // Hit API untuk ambil semua meja
        const response = await tableAPI.getAllTables();
        const tables: TableData[] = response.data;

        // Cari meja yang sesuai dengan hasil scan QR
        const foundTable = tables.find((t) => t.id === parsedTableId);

        if (foundTable) {
          if (foundTable.status === "OCCUPIED") {
            setErrorMsg({
              main: "Meja Sedang Digunakan",
              sub: `Maaf, meja nomor ${formatTableNumber(foundTable.table_number)} saat ini sedang digunakan. Silakan pindah ke meja yang kosong dan scan ulang QR Code.`,
            });
          } else {
            // Jika meja tersedia, masukkan ke state
            setTableData(foundTable);
          }
        } else {
          // Jika meja tidak ditemukan di database
          setErrorMsg({
            main: "Meja Tidak Ditemukan",
            sub: `Meja tidak terdaftar di sistem. Pastikan Anda men-scan QR Code yang valid.`,
          });
        }
      } catch (err: any) {
        console.error("Gagal memvalidasi meja:", err);

        const backendMsg = err.response?.data?.message;

        setErrorMsg({
          main: "Sesi Pemesanan Tidak Valid",
          sub:
            backendMsg ||
            "Gagal terhubung ke server. Silakan muat ulang halaman ini.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (parsedTableId > 0) {
      validateTable();
    } else {
      setIsLoading(false);
      setErrorMsg({
        main: "URL Tidak Valid",
        sub: "ID meja tidak ditemukan dalam URL. Pastikan Anda men-scan QR Code dengan benar.",
      });
    }
  }, [parsedTableId, setAuth]);

  const handleLanjut = () => {
    if (tableData) {
      // Simpan ID asli dari database dan nomor meja ke Zustand
      setTableInfo(tableData.id, tableData.table_number);
      navigate("/qr/menu");
    }
  };

  const handleCancel = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-b from-primary/0 to-primary/15 relative overflow-hidden pb-4 md:pb-8 px-4">
      <Loading show={isLoading} />

      <div className="w-full flex justify-center z-10 pt-4 md:pt-8">
        <img
          src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
          alt="Logo IT'S RESTO"
          className="w-43 md:w-50 object-cover"
        />
      </div>
      <div className="flex-1 w-full flex items-start justify-center">
        <div className="w-full max-w-[93%] flex justify-center">
          {errorMsg && !isLoading && (
            <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-md shadow-sm text-center flex flex-col items-center">
              <h2 className="text-lg md:text-2xl lg:text-xl font-bold text-red-500 mb-2 md:mb-4 lg:mb-3">
                Ups!
              </h2>
              <p className="text-black/60 text-sm md:text-[17px] lg:text-base mb-4 md:mb-6">
                {errorMsg.main}
              </p>

              {errorMsg.sub && (
                <p className="text-black/50 text-[13px] md:text-[15px] mb-6 md:mb-8 leading-relaxed px-2">
                  {errorMsg.sub}
                </p>
              )}
              <Button
                onClick={handleCancel}
                className="w-full py-2 md:py-3 lg:py-2.5 text-[14px] md:text-base lg:text-[15px]"
              >
                Kembali ke Awal
              </Button>
            </div>
          )}

          {tableData && !isLoading && !errorMsg && (
            <TableInfoCard
              tableNumber={tableData.table_number}
              onLanjut={handleLanjut}
              onBatal={handleCancel}
              isKioskMode={false} // Beritahu card bahwa ini bukan penentuan otomatis
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileTableInfoPage;
