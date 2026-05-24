import ProfileHeader from "../../components/Header/ProfileHeader";
import ProfileAvatar from "../../components/Profile/ProfileAvatar";
import ProfileDetailsCard from "../../components/Profile/ProfileDetailsCard";
import AccountStatusBar from "../../components/Profile/ProfileStatusBar";
import { useAuthStore } from "../../store/useAuthStore";
import { profileAPI } from "../../api/profile.api";
import { useEffect, useState } from "react";

const WaiterProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // 1. HIT API SAAT HALAMAN DIMUAT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await profileAPI.getStaffProfile();

        if (response.success && response.data) {
          // Simpan data dari API ke Zustand agar bisa dipakai di tempat lain (seperti Header)
          setUser(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  const formatRole = (role?: string) => {
    if (role === "WAITER") return "Pelayan";
    if (role === "CASHIER") return "Kasir";
    if (role === "KITCHEN") return "Dapur";
    return role || "Pelayan";
  };

  const formatGender = (gender?: string) => {
    if (gender === "MALE") return "Laki-laki";
    if (gender === "FEMALE") return "Perempuan";
    return gender || "Perempuan";
  };

  const profileData = {
    fullname: user?.fullname || "Mila Dewita",
    phone: user?.phone_number || "+62 81432145678",
    gender: formatGender(user?.gender),
    email: user?.email || "pelayanitsresto@gmail.com",
    role: formatRole(user?.role),
    isActive: user?.is_active ?? true, // <-- Ambil status aktif dari Backend
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex flex-col pb-12">
      <ProfileHeader
        userName={profileData.fullname.split(" ")[0]}
        roleName={profileData.role}
      />

      <main className="flex-1 px-4 lg:px-8 pt-4 md:pt-6 max-w-350 mx-auto w-full">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-1.5 leading-tight">
            Profil saya
          </h1>
          <p className="text-[#73736C] text-sm md:text-[16px]">
            Informasi akun pengguna untuk mengakses sistem
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-between items-start">
            {/* Komponen Kiri */}
            <ProfileAvatar name={profileData.fullname} />

            {/* Komponen Kanan */}
            <div className="w-full md:w-[55%] flex flex-col -mt-4 gap-5">
              <ProfileDetailsCard {...profileData} />
              <AccountStatusBar isActive={profileData.isActive} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WaiterProfilePage;
