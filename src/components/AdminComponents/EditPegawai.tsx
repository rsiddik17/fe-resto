import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import ConfirAlamat from "../ConfirmationModal/ConfirmationModal";
import SelectDropdown from "../AdminComponents/SelectDropDown";
// Data master disinkronkan untuk dicocokkan berdasarkan ID URL
const DATA_PEGAWAI_MASTER = [
  {
    id: 1,
    nama: "Rina Lusiana",
    email: "kasiritsresto@gmail.com",
    noTelepon: "081409807898",
    role: "Kasir",
  },
  {
    id: 2,
    nama: "Mile Putri",
    email: "dapuritsresto@gmail.com",
    noTelepon: "081460877839",
    role: "Dapur",
  },
  {
    id: 3,
    nama: "KiosK Its Resto",
    email: "kiosksistem@gmail.com",
    noTelepon: "081460877839",
    role: "Kiosk Sistem",
  },
  {
    id: 4,
    nama: "Mila Dewita",
    email: "pelayanitsresto@gmail.com",
    noTelepon: "081432145678",
    role: "Pelayan",
  },
  {
    id: 5,
    nama: "Roni Julian",
    email: "kasiritsresto@gmail.com",
    noTelepon: "081478654760",
    role: "Kasir",
  },
  {
    id: 6,
    nama: "Mike Febrian",
    email: "dapuritsresto@gmail.com",
    noTelepon: "081489087657",
    role: "Dapur",
  },
  {
    id: 7,
    nama: "Putra Pratama",
    email: "pelayanitsresto@gmail.com",
    noTelepon: "081400876754",
    role: "Pelayan",
  },
  {
    id: 8,
    nama: "Citra Sania",
    email: "adminitsresto@gmail.com",
    noTelepon: "081456876723",
    role: "Admin Role",
  },
];

const EditPegawaiPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Menangkap ID orang yang mau diedit dari rute url browser
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Taruh di dalam komponen, setelah semua useState

  // Form State dinamis
  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Perempuan");
  const [role, setRole] = useState("Dapur");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("itresto12345");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Otomatis cari dan set data form sesuai ID pegawai saat halaman dibuka
  useEffect(() => {
    if (id) {
      const target = DATA_PEGAWAI_MASTER.find((p) => p.id === parseInt(id));
      if (target) {
        setNama(target.nama);
        setNoTelepon(target.noTelepon);
        setRole(target.role === "Kiosk Sistem" ? "Kiosk" : target.role);
        setEmail(target.email);
      }
    }
  }, [id]);

  const handleTriggerConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleFinalSave = () => {
    setIsConfirmOpen(false);
    navigate("/admin/manajemen-pegawai");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6">
        <AdminHeader
          title="Manajemen Pegawai"
          subtitle="Pantau data sistem dan aktivitas pegawai"
        />

        <div className="w-full max-w-300 mx-auto space-y-4">
          <button
            onClick={() => navigate("/admin/manajemen-pegawai")}
            className="flex items-center gap-2 text-gray-800 font-extrabold text-[15px] hover:text-primary transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Edit Pegawai
          </button>

          <div className="bg-white rounded-[20px] shadow-xs border border-gray-150 p-6 md:p-8">
            <form
              onSubmit={handleTriggerConfirm}
              className="space-y-6 max-w-4xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                    Nama Lengkap<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                    Nomor Telepon<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={noTelepon}
                    onChange={(e) => setNoTelepon(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider block">
                    Jenis Kelamin<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-[13.5px]  text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        checked={jenisKelamin === "Laki-Laki"}
                        onChange={() => setJenisKelamin("Laki-Laki")}
                        className="w-4 h-4 accent-primary"
                      />
                      Laki-Laki
                    </label>
                    <label className="flex items-center gap-2 text-[13.5px] font-bold text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        checked={jenisKelamin === "Perempuan"}
                        onChange={() => setJenisKelamin("Perempuan")}
                        className="w-4 h-4 accent-primary"
                      />
                      Perempuan
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                 
                  </label>
                  <SelectDropdown
                    label="Role Akses"
                    value={role}
                    options={[
                      "Kiosk",
                      "Kasir",
                      "Pelayan",
                      "Dapur",
                      "Admin Role",
                    ]}
                    onChange={setRole}
                    placeholder="Pilih Role Akses"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Email<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Password<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 pr-12 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* BUTTON - RESPONSIF: STACK DI MOBILE, SAMPING DI DESKTOP */}
              <div className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/admin/manajemen-pegawai")}
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] font-bold text-black rounded-xs border border-primary  order-2 sm:order-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] font-bold bg-primary hover:bg-primary/90 text-white rounded-xs transition shadow-md cursor-pointer order-1 sm:order-2"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>

          <ConfirAlamat
            isOpen={isConfirmOpen}
            onCancel={() => setIsConfirmOpen(false)}
            onConfirm={handleFinalSave}
            title="Simpan Perubahan?"
            description="Apakah anda yakin ingin mengubah data pegawai? Tindakan ini tidak dapat dibatalkan"
          />
        </div>
      </main>
    </div>
  );
};

export default EditPegawaiPage;
