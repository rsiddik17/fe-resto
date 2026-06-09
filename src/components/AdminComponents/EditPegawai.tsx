import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import ConfirAlamat from "../ConfirmationModal/ConfirmationModal";
import SelectDropdown from "../AdminComponents/SelectDropdown";
import { staffAPI } from "../../api/staff.api";

const ROLE_MAPPING: { [key: string]: string } = {
  Kasir: "CASHIER",
  Dapur: "KITCHEN",
  Pelayan: "WAITER",
  Kiosk: "KIOSK_SYSTEM",
  "Kiosk Sistem": "KIOSK_SYSTEM",
  "Admin Role": "ADMIN",
};

const EditPegawaiPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Form State
  const [nama, setNama] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Perempuan");
  const [role, setRole] = useState("Dapur");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const pegawaiData = location.state?.pegawaiData;
    
    if (pegawaiData) {
      setNama(pegawaiData.fullname || pegawaiData.nama || "");
      setEmail(pegawaiData.email || "");
      setNoTelepon(pegawaiData.phone_number || pegawaiData.noTelepon || "");
      setRole(pegawaiData.role || "Dapur");
      
      // Konversi gender dari API ke tampilan
      if (pegawaiData.gender === "MALE") {
        setJenisKelamin("Laki-Laki");
      } else if (pegawaiData.gender === "FEMALE") {
        setJenisKelamin("Perempuan");
      } else {
        setJenisKelamin(pegawaiData.jenisKelamin || "Perempuan");
      }
    } else {
      const storedData = localStorage.getItem("editPegawaiData");
      if (storedData) {
        const data = JSON.parse(storedData);
        setNama(data.nama || "");
        setEmail(data.email || "");
        setNoTelepon(data.noTelepon || "");
        setRole(data.role || "Dapur");
        setJenisKelamin(data.jenisKelamin || "Perempuan");
        localStorage.removeItem("editPegawaiData");
      } else {
        navigate("/admin/employee-management");
      }
    }
  }, [location, navigate, id]);

  const getMappedRole = (roleLabel: string): string => {
    return ROLE_MAPPING[roleLabel] || "WAITER";
  };

  const handleFinalSave = async () => {
    try {
      const payload = {
        fullname: nama,
        email: email,
        phone_number: noTelepon,
        role: getMappedRole(role),
        gender: jenisKelamin === "Laki-Laki" ? "MALE" : "FEMALE",
      };

      await staffAPI.updateStaff(id!, payload);
      navigate("/admin/employee-management");
    } catch (error: any) {
      console.error("Error update:", error.response?.data);
      alert(
        "Gagal update: " +
          (error.response?.data?.message || "Terjadi kesalahan"),
      );
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
          <button
            onClick={() => navigate("/admin/employee-management")}
            className="flex items-center gap-2 text-gray-800 font-extrabold text-[15px] hover:text-primary transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Edit Pegawai
          </button>

          <div className="bg-white rounded-[20px] shadow-xs border border-gray-150 p-6 md:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsConfirmOpen(true);
              }}
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
                    <label className="flex items-center gap-2 text-[13.5px] text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        checked={jenisKelamin === "Laki-Laki"}
                        onChange={() => setJenisKelamin("Laki-Laki")}
                        className="w-4 h-4 accent-primary"
                      />
                      Laki-Laki
                    </label>
                    <label className="flex items-center gap-2 text-[13.5px] text-gray-700 cursor-pointer">
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

              {/* BUTTON */}
              <div className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/admin/employee-management")}
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] text-black rounded-xs border border-gray/50 order-2 sm:order-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 text-[13.5px] bg-primary hover:bg-primary/90 text-white rounded-xs order-1 sm:order-2"
                >
                  Simpan Perubahan
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