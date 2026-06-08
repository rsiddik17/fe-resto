import { useState, useEffect } from "react";
import ProfileHeader from "../../components/Header/ProfileHeader";
import ProfileAvatar from "../../components/Profile/ProfileAvatar";
import ProfileDetailsCard from "../../components/Profile/ProfileDetailsCard";
import AccountStatusBar from "../../components/Profile/ProfileStatusBar";
import { useAuthStore } from "../../store/useAuthStore";
import { staffAPI } from "../../api/staff.api";

interface ProfileData {
  id: string;
  fullname: string;
  phone_number: string;
  gender: string;
  email: string;
  role: string;
  is_active: boolean;
}

const AdminProfilePage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await staffAPI.getProfile();
        console.log("Profile data:", response);
        
        // Sesuaikan dengan struktur response dari API
        const profileData = response.data || response;
        setProfile(profileData);
      } catch (err: any) {
        console.error("Gagal mengambil profil:", err);
        setError(err.response?.data?.message || "Gagal mengambil data profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Mapping gender dari API (MALE/FEMALE) ke tampilan Indonesia
  const getGenderLabel = (gender: string) => {
    if (gender === "MALE") return "Laki-Laki";
    if (gender === "FEMALE") return "Perempuan";
    return gender || "-";
  };

  // Mapping role dari API ke tampilan Indonesia
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Admin";
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

  // Tampilkan loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  // Tampilkan error
  if (error) {
    return (
      <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Gunakan data dari API jika ada, fallback ke data dari auth store atau default
  const profileData = {
    fullname: profile?.fullname || user?.fullname || "Citra Sania",
    phone: profile?.phone_number || user?.phone_number || "+62 145 687 672",
    gender: getGenderLabel(profile?.gender || user?.gender || ""),
    email: profile?.email || user?.email || "adminitsresto@gmail.com",
    role: getRoleLabel(profile?.role || user?.role || ""),
    is_active: profile?.is_active ?? user?.is_active ?? true,
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex flex-col pb-12">
      <ProfileHeader
        userName={profileData.fullname.split(" ")[0]}
        roleName={profileData.role}
      />

      <main className="flex-1 px-6 md:px-8 pt-8 max-w-350 mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-1.5 leading-tight">
            Profil saya
          </h1>
          <p className="text-[#73736C] text-sm md:text-[16px]">
            Informasi akun pengguna untuk mengakses sistem
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-between items-start">
          {/* Komponen Kiri */}
          <ProfileAvatar name={profileData.fullname} />

          {/* Komponen Kanan */}
          <div className="w-full md:w-[55%] flex flex-col -mt-4 gap-5">
            <ProfileDetailsCard {...profileData} />
            <AccountStatusBar isActive={profileData.is_active} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfilePage;