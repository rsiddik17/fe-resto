import { useNavigate, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import DashboardHeader from "../../components/Header/DashboardHeader";
import TableIcon from "../../components/Icon/TableIcon"; // Pastikan path benar
import { type TableItem } from "../../components/Card/TableCard";

const WaiterTableDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tangkap data meja yang dikirim dari halaman sebelumnya
  const table = location.state?.table as TableItem;

  // Fallback jika diakses tanpa data
  if (!table) {
    return (
      <div className="p-8">Data meja tidak ditemukan. <button onClick={() => navigate(-1)} className="text-primary underline">Kembali</button></div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      
      {/* HEADER UTAMA */}
      <div className="pt-7.5 pl-8 pr-6 shrink-0">
        <DashboardHeader
          title="Manajemen Meja"
          subtitle="Pantau dan ubah meja restoran secara langsung"
        />
      </div>

      {/* KONTEN UTAMA */}
      <div className="pt-0 pb-6 pl-8 pr-12 flex flex-col flex-1 min-h-0">
        
        {/* Card Putih Besar */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 md:px-5 md:py-4 flex flex-col flex-1">
          
          {/* Header Internal Card (Tombol Kembali & Judul) */}
          <div className="flex items-center gap-2 mb-9 shrink-0">
            <button 
              onClick={() => navigate(-1)}
              className="text-black hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={3} />
            </button>
            <h2 className="text-lg font-bold">Detail Meja</h2>
          </div>

          {/* Layout 2 Kolom Kiri-Kanan */}
          <div className="flex gap-4 md:gap-5 flex-1">
            
            {/* KOLOM KIRI: Kotak Ungu Ikon Meja */}
            <div className="w-85 h-75 bg-primary/25 rounded-xs flex items-center justify-center shrink-0">
              {/* Lingkaran Ungu Tua */}
              <div className="w-28 h-28 bg-primary/25 rounded-full flex items-center justify-center">
                <TableIcon className="w-16 h-16 text-primary" />
              </div>
            </div>

            {/* KOLOM KANAN: Form Detail (Read Only) */}
            <div className="flex-1 max-w-150 flex flex-col gap-2">
              
              {/* Nomor Meja */}
              <div>
                <label className="block text-[15px] mb-1">
                  Nomor Meja
                </label>
                <div className="w-full bg-[#D9D9D9]/50 text-[15px] p-3 rounded-md border border-transparent outline-none cursor-not-allowed">
                  Meja {table.id}
                </div>
              </div>

              {/* Kapasitas Meja */}
              <div>
                <label className="block text-[15px] mb-1">
                  Kapasitas Meja
                </label>
                <div className="w-full bg-[#D9D9D9]/50 text-[15px] p-3 rounded-md border border-transparent outline-none cursor-not-allowed">
                  {table.capacity}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default WaiterTableDetailPage;