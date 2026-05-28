import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import SelectDropdown from "../AdminComponents/SelectDropDown";

const TambahPegawaiPage = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [role, setRole] = useState("Pilih Role");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "Pilih Role") {
      alert("Silakan pilih Role Akses terlebih dahulu!");
      return;
    }
    // Logika simpan data ke database / state management
    console.log({ nama, noTelepon, jenisKelamin, role, email, password });
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
          {/* Tombol Back Navigasi */}
          <button
            onClick={() => navigate("/admin/manajemen-pegawai")}
            className="flex items-center gap-2 text-gray-800 font-extrabold text-[15px] hover:text-primary transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Tambah Pegawai Baru
          </button>

          {/* Container Form Utama */}
          <div className="bg-white rounded-xs shadow-xs border border-gray-150 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
              {/* Baris 1: Nama & Nomor Telepon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                    Nama Lengkap<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap"
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
                    placeholder="08xxxxxx"
                    value={noTelepon}
                    onChange={(e) => setNoTelepon(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Baris 2: Jenis Kelamin & Role Akses */}
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
                        required
                        checked={jenisKelamin === "Laki-Laki"}
                        onChange={() => setJenisKelamin("Laki-Laki")}
                        className="w-4 h-4 accent-primary"
                      />
                      Laki-Laki
                    </label>
                    <label className="flex items-center gap-2 text-[13.5px]  text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        required
                        checked={jenisKelamin === "Perempuan"}
                        onChange={() => setJenisKelamin("Perempuan")}
                        className="w-4 h-4 accent-primary"
                      />
                      Perempuan
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider"></label>
                  <SelectDropdown
                    label="Role Akses"
                    value={role === "Pilih Role" ? "" : role}
                    options={[
                      "Kiosk",
                      "Kasir",
                      "Pelayan",
                      "Dapur",
                      "Admin Role",
                    ]}
                    onChange={(val) => setRole(val)}
                    placeholder="Pilih Role Akses"
                    required
                  />
                </div>
              </div>

              {/* Baris 3: Email */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Email<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Baris 4: Password Intip Sesuai Mockup */}
              <div className="space-y-1.5 relative">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Password<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan kata sandi"
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

              {/* Tombol Aksi Kelola */}
              {/* Tombol Aksi Kelola - RESPONSIF: STACK DI MOBILE, SAMPING DI DESKTOP */}
              <div className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/admin/manajemen-pegawai")}
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] font-semibold text-black rounded-xs border border-primary order-2 sm:order-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] font-semibold bg-primary hover:bg-primary/90 text-white rounded-xs transition shadow-md cursor-pointer order-1 sm:order-2"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TambahPegawaiPage;
