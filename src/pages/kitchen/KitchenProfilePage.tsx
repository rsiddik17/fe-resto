import ProfileHeader from "../../components/Header/ProfileHeader";
import ProfileAvatar from "../../components/Profile/ProfileAvatar";
import ProfileDetailsCard from "../../components/Profile/ProfileDetailsCard";
import AccountStatusBar from "../../components/Profile/ProfileStatusBar";
import { useAuthStore } from "../../store/useAuthStore";

const KitchenProfilePage = () => {
  const { user } = useAuthStore();

  // Menggunakan data dari global store (jika login), 
  // atau fallback ke data "Mile Putri" sesuai desain jika data kosong
  const profileData = {
    fullname: user?.fullname || "Mile Putri",
    phone: user?.phone_number || "+62 81460877839",
    gender: user?.gender || "Perempuan",
    email: user?.email || "dapuritsresto@gmail.com",
    role: user?.role || "Dapur",
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex flex-col pb-12">
      
      <ProfileHeader 
        userName={profileData.fullname.split(' ')[0]} 
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
            <AccountStatusBar isActive={true} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default KitchenProfilePage;