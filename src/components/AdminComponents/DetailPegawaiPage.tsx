import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";

// Data Dummy awal untuk pencarian kecocokan ID Pegawai
const DATA_PEGAWAI_SOURCE = [
  { id: 1, nama: "Rina Lusiana", email: "kasiritsresto@gmail.com", noTelepon: "081409807898", jenisKelamin: "Perempuan", role: "Kasir", password: "kasiritsresto18" },
  { id: 2, nama: "Mile Putri", email: "dapuritsresto@gmail.com", noTelepon: "081460877839", jenisKelamin: "Perempuan", role: "Dapur", password: "dapuritsresto18" },
  { id: 3, nama: "KiosK Its Resto", email: "kiosksistem@gmail.com", noTelepon: "081460877839", jenisKelamin: "Laki-Laki", role: "Kiosk Sistem", password: "kioskresto18" },
  { id: 4, nama: "Mila Dewita", email: "pelayanitsresto@gmail.com", noTelepon: "081432145678", jenisKelamin: "Perempuan", role: "Pelayan", password: "pelayanitsresto18" },
  { id: 5, nama: "Roni Julian", email: "kasiritsresto@gmail.com", noTelepon: "081478654760", jenisKelamin: "Laki-Laki", role: "Kasir", password: "kasiritsresto99" },
  { id: 6, nama: "Mike Febrian", email: "dapuritsresto@gmail.com", noTelepon: "081489087657", jenisKelamin: "Laki-Laki", role: "Dapur", password: "dapuritsresto99" },
  { id: 7, nama: "Putra Pratama", email: "pelayanitsresto@gmail.com", noTelepon: "081400876754", jenisKelamin: "Laki-Laki", role: "Pelayan", password: "pelayanitsresto99" },
  { id: 8, nama: "Citra Sania", email: "adminitsresto@gmail.com", noTelepon: "081456876723", jenisKelamin: "Perempuan", role: "Admin Role", password: "adminitsresto18" },
];

const DetailPegawaiPage = () => {
  const { id } = useParams(); // Mengambil ID dari parameter URL browser
  const navigate = useNavigate();

  // Mencari data pegawai yang cocok berdasarkan parameter ID URL
  const pegawai = DATA_PEGAWAI_SOURCE.find((p) => p.id === Number(id)) || DATA_PEGAWAI_SOURCE[1]; // Fallback ke Mile Putri jika ID tidak ketemu

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6">
        <AdminHeader title="Manajemen Pegawai" subtitle="Pantau data sistem dan aktivitas pegawai" />

        <div className="w-full max-w-300 mx-auto space-y-4">
          
          {/* Tombol Back Navigasi Sesuai Mockup */}
          <button 
            onClick={() => navigate("/admin/manajemen-pegawai")}
            className="flex items-center gap-2 text-gray-800 font-extrabold text-[15px] hover:text-primary transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Detail Pegawai
          </button>

          {/* Container Card Informasi Utama (Flat UI Putih Bersih) */}
          <div className="bg-white rounded-[20px] shadow-xs border border-gray-150 p-6 md:p-8 md:py-10">
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              
              {/* Sektor Nama Lengkap */}
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">Nama Lengkap</span>
                <p className="text-[14px] font-semibold text-gray-700">{pegawai.nama}</p>
              </div>

              {/* Sektor Nomor Telepon */}
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">Nomor Telepon</span>
                <p className="text-[14px] font-semibold text-gray-700">{pegawai.noTelepon}</p>
              </div>

              {/* Sektor Jenis Kelamin */}
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">Jenis Kelamin</span>
                <p className="text-[14px] font-semibold text-gray-700">{pegawai.jenisKelamin}</p>
              </div>

              {/* Sektor Role Akses */}
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">Role Akses</span>
                <p className="text-[14px] font-semibold text-gray-700">{pegawai.role}</p>
              </div>

              {/* Sektor Email */}
              <div className="space-y-1 md:col-span-2">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">Email</span>
                <p className="text-[14px] font-semibold text-primary underline break-all">{pegawai.email}</p>
              </div>

              {/* Sektor Password */}
              <div className="space-y-1 md:col-span-2">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">Password</span>
                <p className="text-[14px] font-semibold text-gray-700 tracking-wide">{pegawai.password}</p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DetailPegawaiPage;