import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import SelectDropdown from "../AdminComponents/SelectDropdown";
import { staffAPI } from "../../api/staff.api";
import { z } from "zod";

// ✅ Zod Schema
const staffSchema = z.object({
  fullname: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone_number: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh angka")
    .trim(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.string().min(1, "Role akses wajib dipilih"),
  gender: z.enum(["MALE", "FEMALE"]),
});

const TambahPegawaiPage = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [role, setRole] = useState("Pilih Role");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Error state
  const [fieldErrors, setFieldErrors] = useState<{
    fullname?: string;
    email?: string;
    phone_number?: string;
    password?: string;
    role?: string;
    gender?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const roleMapping: { [key: string]: string } = {
    Kasir: "CASHIER",
    Dapur: "KITCHEN",
    Pelayan: "WAITER",
    Kiosk: "KIOSK_SYSTEM",
    "Admin Role": "ADMIN",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    // ✅ Validasi dengan Zod
    try {
      const validatedData = staffSchema.parse({
        fullname: nama,
        email: email,
        phone_number: noTelepon,
        password: password,
        role: role === "Pilih Role" ? "" : role,
        gender: jenisKelamin === "Laki-Laki" ? "MALE" : "FEMALE",
      });

      const payload = {
        email: validatedData.email,
        password: validatedData.password,
        fullname: validatedData.fullname,
        role: roleMapping[role] || role,
        gender: validatedData.gender,
        phone_number: validatedData.phone_number,
      };

      console.log("📤 Payload yang dikirim:", payload);

      await staffAPI.createStaff(payload);
      navigate("/admin/employee-management");
    } catch (error: any) {
      // 🔥 LIHAT RESPONSE LENGKAP DARI BE
      console.log("🔴 FULL ERROR:", error);
      console.log("🔴 RESPONSE DATA:", error.response?.data);
      console.log("🔴 STATUS:", error.response?.status);
      console.log("🔴 RESPONSE LENGKAP:", error.response);

      // ✅ Zod validation error
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.issues.forEach((err) => {
          const path = err.path[0];
          errors[path] = err.message;
        });
        setFieldErrors(errors);
        return;
      }

      // ✅ Error dari backend
      const backendError = error?.response?.data;

      if (backendError) {
        // 🔥 Cek apakah ada field-specific errors
        if (backendError.errors) {
          const fieldErrors: any = {};
          Object.keys(backendError.errors).forEach((key) => {
            const fieldMap: { [key: string]: string } = {
              email: "email",
              phone: "phone_number",
              phone_number: "phone_number",
              fullname: "fullname",
              role: "role",
              gender: "gender",
            };
            const mappedKey = fieldMap[key] || key;
            fieldErrors[mappedKey] = Array.isArray(backendError.errors[key])
              ? backendError.errors[key][0]
              : backendError.errors[key];
          });
          setFieldErrors(fieldErrors);
          return;
        }

        // 🔥 Cek message langsung
        const msg = backendError.message?.toLowerCase() || "";
        if (msg.includes("email") || msg.includes("already") || msg.includes("terdaftar")) {
          setFieldErrors({ email: backendError.message });
        } else if (msg.includes("phone") || msg.includes("telepon") || msg.includes("nomor")) {
          setFieldErrors({ phone_number: backendError.message });
        } else {
          setGeneralError(backendError.message);
        }
      } else {
        setGeneralError("Gagal menambahkan pegawai. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className=" flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6 pt-14 md:pt-6">
        
        <AdminHeader
          title="Manajemen Pegawai"
          subtitle="Pantau data sistem dan aktivitas pegawai"
        />

        <div className="w-full max-w-300 mx-auto space-y-4">
          <button
            onClick={() => navigate("/admin/employee-management")}
            className="flex items-center gap-2 text-gray-800 font-extrabold text-[15px] hover:text-primary transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Tambah Pegawai Baru
          </button>

          <div className="bg-white rounded-xs shadow-xs border border-gray-150 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
              {/* ✅ General Error */}
              {generalError && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xs text-sm font-medium">
                  {generalError}
                </div>
              )}

              {/* Nama & No Telepon */}
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
                    onChange={(e) => {
                      setNama(e.target.value);
                      if (fieldErrors.fullname)
                        setFieldErrors({ ...fieldErrors, fullname: undefined });
                    }}
                    className={`w-full bg-white/60 border ${
                      fieldErrors.fullname ? "border-red-500" : "border-gray-200"
                    } rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all`}
                  />
                  {fieldErrors.fullname && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {fieldErrors.fullname}
                    </p>
                  )}
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
                      if (fieldErrors.phone_number)
                        setFieldErrors({ ...fieldErrors, phone_number: undefined });
                    }}
                    className={`w-full bg-white/60 border ${
                      fieldErrors.phone_number ? "border-red-500" : "border-gray-200"
                    } rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all`}
                  />
                  {fieldErrors.phone_number && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {fieldErrors.phone_number}
                    </p>
                  )}
                </div>
              </div>

              {/* Jenis Kelamin & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider block">
                    Jenis Kelamin<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-[13.5px] text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        required
                        checked={jenisKelamin === "Laki-Laki"}
                        onChange={() => {
                          setJenisKelamin("Laki-Laki");
                          if (fieldErrors.gender)
                            setFieldErrors({ ...fieldErrors, gender: undefined });
                        }}
                        className="w-4 h-4 accent-primary"
                      />
                      Laki-Laki
                    </label>
                    <label className="flex items-center gap-2 text-[13.5px] text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        required
                        checked={jenisKelamin === "Perempuan"}
                        onChange={() => {
                          setJenisKelamin("Perempuan");
                          if (fieldErrors.gender)
                            setFieldErrors({ ...fieldErrors, gender: undefined });
                        }}
                        className="w-4 h-4 accent-primary"
                      />
                      Perempuan
                    </label>
                  </div>
                  {fieldErrors.gender && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {fieldErrors.gender}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <SelectDropdown
                    label="Role Akses"
                    value={role === "Pilih Role" ? "" : role}
                    options={["Kiosk", "Kasir", "Pelayan", "Dapur", "Admin Role"]}
                    onChange={(val) => {
                      setRole(val);
                      if (fieldErrors.role)
                        setFieldErrors({ ...fieldErrors, role: undefined });
                    }}
                    placeholder="Pilih Role Akses"
                    required
                  />
                  {fieldErrors.role && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {fieldErrors.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Email<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email)
                      setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  className={`w-full bg-white/60 border ${
                    fieldErrors.email ? "border-red-500" : "border-gray-200"
                  } rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all`}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
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
                      if (fieldErrors.password)
                        setFieldErrors({ ...fieldErrors, password: undefined });
                    }}
                    className={`w-full bg-white/60 border ${
                      fieldErrors.password ? "border-red-500" : "border-gray-200"
                    } rounded-xs px-4 py-3 pr-12 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all`}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {fieldErrors.password}
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

              {/* Tombol Aksi */}
              <div className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/admin/employee-management")}
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] text-black rounded-xs border border-gray/50 hover:bg-black/5 order-2 sm:order-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] bg-primary text-white rounded-xs transition order-1 sm:order-2"
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