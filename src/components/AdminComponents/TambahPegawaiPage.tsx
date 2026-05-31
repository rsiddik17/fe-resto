import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import SelectDropdown from "../AdminComponents/SelectDropdown";
import { staffAPI } from "../../api/staff.api"; // Pastikan path-nya benar
const TambahPegawaiPage = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [role, setRole] = useState("Pilih Role");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    noTelepon?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "Pilih Role") {
      alert("Silakan pilih Role Akses terlebih dahulu!");
      return;
    }

    const roleMapping: { [key: string]: string } = {
      Kasir: "CASHIER",
      Dapur: "KITCHEN",
      Pelayan: "WAITER",
      Kiosk: "KIOSK_SYSTEM",
      "Admin Role": "ADMIN",
    };

    const newErrors: { password?: string; noTelepon?: string } = {};

    if (password.length < 8) {
      newErrors.password = "Password minimal harus 8 karakter";
    }
    if (noTelepon.length < 10) {
      newErrors.noTelepon = "Nomor telepon minimal 10 digit";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Berhenti di sini, tidak lanjut ke API
    }
    setErrors({});

    const payload = {
      email: email,
      password: password,
      fullname: nama,
      role: roleMapping[role] || role,
      gender: jenisKelamin === "Laki-Laki" ? "MALE" : "FEMALE",
      phone_number: noTelepon,
    };

    try {
      await staffAPI.createStaff(payload);
     
      navigate("/admin/manajemen-pegawai", {
        state: { showSuccessToast: true, refresh: true },
      });
    } catch (error) {
      console.error("Gagal menambah pegawai:", error);
      alert("Gagal menambahkan pegawai. Cek koneksi atau data input!");
    }
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
                    onChange={(e) => {
                      setNoTelepon(e.target.value);
                      if (errors.noTelepon)
                        setErrors({ ...errors, noTelepon: "" });
                    }}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>
              {errors.noTelepon && (
                <p className="text-red-500 text-[10px] font-bold mt-1">
                  {errors.noTelepon}
                </p>
              )}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: "" }); // Hilangkan error saat user mengetik
                    }}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 pr-12 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {errors.password}
                    </p>
                  )}
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
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] font-bold text-black rounded-xs border border-primary order-2 sm:order-1"
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
        </div>
      </main>
    </div>
  );
};

export default TambahPegawaiPage;
