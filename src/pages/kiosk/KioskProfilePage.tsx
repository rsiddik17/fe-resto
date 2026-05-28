import { useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/useAuthStore";
import UserIconSingle from "../../components/Icon/UserIconSingle";
import InfoIcon from "../../components/Icon/InfoIcon";
import { useEffect, useState } from "react";
import { profileAPI } from "../../api/profile.api";
import LogoutIcon from "../../components/Icon/LogOutIcon";

const KioskProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const response = await profileAPI.getStaffProfile();

        if (response.success && response.data) {
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

  const isActive = user?.is_active ?? true;

  const formatGender = (gender?: string) => {
    if (gender === "MALE") return "Laki-laki";
    if (gender === "FEMALE") return "Perempuan";
    return "-";
  };

  const formatRole = (role?: string) => {
    if (role === "KIOSK_SYSTEM") return "Kiosk";
    if (role === "WAITER") return "Pelayan";
    if (role === "CASHIER") return "Kasir";
    if (role === "KITCHEN") return "Dapur";

    return role || "-";
  };

  const handleLogout = async () => {
    if (logout) await logout();
    navigate("/");
  };

  return (
    // Background sedikit abu-abu agar card putih terlihat jelas (bayangannya)
    <div className="min-h-screen bg-white pb-8">
      {/* 1. HEADER (Menggunakan prop showBackButton yang baru kita buat) */}
      <Header showBackButton={true} onBack={() => navigate(-1)} />

      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-6 md:pt-8">
        {/* --- JUDUL HALAMAN --- */}
        <div className="mb-4 md:mb-3">
          <h1 className="text-[22px] md:text-3xl lg:text-[28px] font-bold mb-1 md:mb-2">
            Profil saya
          </h1>
          <p className="text-gray-500 text-base md:text-[22px] lg:text-xl">
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
              <div className="w-24 h-24 md:w-36 md:h-36 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 md:mb-8">
                <UserIconSingle
                  className="w-12 h-12 md:w-20 md:h-20 text-primary"
                  strokeWidth={2.5}
                />
              </div>
              <h2 className="text-xl md:text-3xl font-bold">
                {user?.fullname || "KiosK Its Resto"}
              </h2>
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
                    {formatGender(user?.gender)}
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
                    {formatRole(user?.role)}
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
            className="w-full max-w-55 md:max-w-73 lg:max-w-65 py-3 md:py-4 lg:py-2.5 rounded-full flex items-center justify-center gap-3 font-bold text-base md:text-xl lg:text-lg"
          >
            <LogoutIcon
              className="w-6 h-6 md:w-8 md:h-8 -translate-x-4 text-white/50"
              strokeWidth={2.5}
            />{" "}
            Keluar
          </Button>
        </div>

        {/* --- CARD STATUS AKUN --- */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 md:p-6 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Titik Hijau */}
            <div
              className={`w-3 h-3 md:w-4 md:h-4 ml-8 rounded-full ${
                isActive ? "bg-[#8AC926]" : "bg-red-500"
              }`}
            ></div>
            <span className="font-bold text-base md:text-xl ml-6 text-black">
              {isActive ? "Status Akun Aktif" : "Status Akun Nonaktif"}
            </span>
          </div>
          {/* Ikon Info */}
          <div className="w-6 h-6 md:w-8 md:h-8 bg-black/75 rounded-full flex items-center justify-center">
            <InfoIcon
              className="text-white w-6 h-6 md:w-8 md:h-8"
              strokeWidth={3}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default KioskProfilePage;
