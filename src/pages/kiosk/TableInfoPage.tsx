import TableInfoCard from "../../components/TableInfoCard/TableInfoCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const TableInfoPage = () => {
  const [searchParams] = useSearchParams();
  const guests = searchParams.get("guests"); // Menangkap jumlah tamu dari halaman sebelumnya

  // State untuk menyimpan nomor meja (Nantinya ini dari API Backend)
  const [tableNumber, setTableNumber] = useState<string>("M-02");

  // Simulasi fetch data dari Backend penentuan meja otomatis
  useEffect(() => {
    // Di dunia nyata, kamu mungkin akan nembak API di sini:
    // axios.post('/api/assign-table', { guest_count: guests })
    // .then(res => setTableNumber(res.data.table_number))

    console.log(`Mencarikan meja untuk ${guests} tamu...`);
  }, [guests]);

  return (
    <div className="w-full h-screen flex flex-col bg-linear-to-b from-primary/0 to-primary/15 relative overflow-hidden">
      {/* Logo di atas */}
      <div className="absolute top-12 w-full flex justify-center z-10">
        <img
          src="/images/logo.webp"
          alt="Logo IT'S RESTO"
          className="w-70 object-cover"
        />
      </div>
      <div className="flex-1 w-full flex items-center justify-center mt-24">
        {/* Kirim nomor meja ke komponen Card */}
        <TableInfoCard tableNumber={tableNumber} />
      </div>
    </div>
  );
};

export default TableInfoPage;
