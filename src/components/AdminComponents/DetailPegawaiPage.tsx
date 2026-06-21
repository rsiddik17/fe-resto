import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import { staffAPI } from "../../api/staff.api";
import { useState, useEffect } from "react";

interface PegawaiDetail {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  role: string;
  gender?: string;
  is_active: boolean;
  created_at: string;
}

const DetailPegawaiPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pegawai, setPegawai] = useState<PegawaiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchDetailPegawai = async () => {
      if (!id) {
        setError("ID pegawai tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await staffAPI.getAllStaff();
        console.log("All staff data:", response);

        const staffList = response.data || response;
        const foundStaff = staffList.find((s: any) => s.id === id);

        if (foundStaff) {
          setPegawai(foundStaff);
        } else {
          setError("Data pegawai tidak ditemukan");
        }
      } catch (err: any) {
        console.error("Gagal ambil detail pegawai:", err);
        setError(err.response?.data?.message || "Gagal mengambil data pegawai");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailPegawai();
  }, [id]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Admin Role";
      case "CASHIER":
        return "Kasir";
      case "KITCHEN":
        return "Dapur";
      case "WAITER":
        return "Pelayan";
      case "KIOSK_SYSTEM":
        return "Kiosk Sistem";
      default:
        return role || "-";
    }
  };

  // const isMale = () => pegawai?.gender === "MALE";
  // const isFemale = () => pegawai?.gender === "FEMALE";

  if (loading) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
        <AdminSidebar onLogout={() => console.log("Admin Logout")} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pegawai...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !pegawai) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
        <AdminSidebar onLogout={() => console.log("Admin Logout")} />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center text-red-500">
            <p className="mb-4">{error || "Data tidak ditemukan"}</p>
            <button
              onClick={() => navigate("/admin/employee-management")}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Kembali ke Daftar Pegawai
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className=" flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6 pt-14 md:pt-6">
        <AdminHeader
          title="Manajemen Pegawai"
          subtitle="Pantau data sistem dan aktivitas pegawai"
        />

        <div className="w-full max-w-300 mx-auto space-y-4">
          {/* Tombol Back */}
          <button
            onClick={() => navigate("/admin/employee-management")}
            className="flex items-center gap-2 text-gray-800 font-extrabold text-[15px] hover:text-primary transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Detail Pegawai
          </button>

          {/* Container Form Read-Only */}
          <div className="bg-white rounded-xs shadow-xs border border-gray-150 p-6 md:p-8">
            {/* Grid 2 kolom untuk 4 field pertama */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={pegawai.fullname}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-500 outline-none cursor-default"
                />
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={pegawai.phone_number || "-"}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-500 outline-none cursor-default"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-2">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider block">
                  Jenis Kelamin
                </label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-[13.5px] text-gray-700 cursor-not-allowed">
                    <input
                      type="radio"
                      name="gender"
                      checked={pegawai?.gender === "MALE"}
                      disabled
                      className="w-4 h-4 accent-primary cursor-not-allowed"
                    />
                    Laki-Laki
                  </label>
                  <label className="flex items-center gap-2 text-[13.5px] text-gray-700 cursor-not-allowed">
                    <input
                      type="radio"
                      name="gender"
                      checked={pegawai?.gender === "FEMALE"}
                      disabled
                      className="w-4 h-4 accent-primary cursor-not-allowed"
                    />
                    Perempuan
                  </label>
                </div>
              </div>

              {/* Role Akses */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Role Akses
                </label>
                <input
                  type="text"
                  value={getRoleLabel(pegawai.role)}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-500 outline-none cursor-default"
                />
              </div>
            </div>

            {/* Full width untuk Email dan Password */}
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={pegawai.email}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xs px-4 py-3 text-[13.5px] font-semibold text-gray-500 outline-none cursor-default"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPegawaiPage;
