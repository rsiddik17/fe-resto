import { useNavigate } from "react-router";
import { LogOut } from "lucide-react"; // Import icon dari lucide
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/useAuthStore";
import UserIconSingle from "../../components/Icon/UserIconSingle";
import InfoIcon from "../../components/Icon/InfoIcon";
import { useEffect, useState } from "react";
import { authAPI } from "../../api/auth.api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const responseData = await authAPI.getProfile();

        setUser(responseData.data);
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Hit API hanya jika data user belum ada di Zustand
    if (!user) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  return (
    // Background sedikit abu-abu agar card putih terlihat jelas (bayangannya)
    <div className="min-h-screen bg-white pb-16">
      {/* 1. HEADER (Menggunakan prop showBackButton yang baru kita buat) */}
      <Header showBackButton={true} onBack={() => navigate(-1)} />

      <main className="max-w-3xl mx-auto px-4 md:px-2 pt-6 md:pt-6">
        {/* --- JUDUL HALAMAN --- */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-[32px] font-bold mb-1 md:mb-2">
            Profil saya
          </h1>
          <p className="text-gray-500 text-sm md:text-2xl">
            Informasi akun pengguna untuk mengakses sistem
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* --- AVATAR & NAMA --- */}
            <div className="flex flex-col items-center mb-8 md:mb-12">
              {/* Lingkaran Avatar */}
              <div className="w-24 h-24 md:w-34 md:h-34 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 md:mb-8">
                <UserIconSingle
                  className="w-12 h-12 md:w-20 md:h-20 text-primary"
                  strokeWidth={2.5}
                />
              </div>
              <h2 className="text-xl md:text-3xl font-bold">{user?.fullname || "KiosK Its Resto"}</h2>
            </div>

            {/* --- CARD INFORMASI AKUN --- */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-14 mb-8 md:mb-10 max-w-2xl mx-auto">
              {/* Menggunakan Grid 2 Kolom di Kiosk, 1 Kolom di HP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-4">
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-gray-500 text-xs md:text-base">
                    Nama Lengkap
                  </span>
                  <span className="font-bold text-base md:text-xl text-black">
                    {user?.fullname || "-"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-gray-500 text-xs md:text-base">
                    Nomor Telepon
                  </span>
                  <span className="font-bold text-base md:text-xl text-black">
                    {user?.phone_number || "-"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-gray-500 text-xs md:text-base">
                    Jenis Kelamin
                  </span>
                  <span className="font-bold text-base md:text-xl text-black">
                    {user?.gender || "Laki-laki"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-gray-500 text-xs md:text-base">
                    Email
                  </span>
                  <span className="font-bold text-base md:text-xl text-black">
                    {user?.email || "-"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-gray-500 text-xs md:text-sm">
                    Peran Pengguna
                  </span>
                  <span className="font-bold text-base md:text-xl text-black">
                    {user?.role?.replace("_", " ") || "-"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- TOMBOL KELUAR --- */}
        <div className="flex justify-center mb-8 md:mb-12">
          <Button
            onClick={handleLogout}
            className="w-full max-w-[280px] py-3.5 md:py-4 rounded-full flex items-center justify-center gap-3 font-bold text-base md:text-xl"
          >
            <LogOut
              className="w-5 h-5 md:w-6 md:h-6 -translate-x-4"
              strokeWidth={2.5}
            />{" "}
            Keluar
          </Button>
        </div>

        {/* --- CARD STATUS AKUN --- */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 md:p-6 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Titik Hijau */}
            <div className="w-3 h-3 md:w-4 md:h-4 ml-8 bg-[#8AC926] rounded-full"></div>
            <span className="font-bold text-lg md:text-xl ml-6 text-black">
              Status Akun Aktif
            </span>
          </div>
          {/* Ikon Info */}
          <div className="w-6 h-6 md:w-8 md:h-8 bg-black/75 rounded-full flex items-center justify-center">
            <InfoIcon
              className="text-white w-3 h-3 md:w-8 md:h-8"
              strokeWidth={3}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
