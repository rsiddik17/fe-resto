import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import UserIconSingle from "../Icon/UserIconSingle";

interface ProfileHeaderProps {
  userName: string;
  roleName: string;
  onBack?: () => void; // Opsional: jika ingin custom aksi back
}

const ProfileHeader = ({ userName, roleName, onBack }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Default: kembali ke halaman sebelumnya
    }
  };

  return (
    <header className="bg-white h-18 px-6 md:px-10 flex justify-between items-center shadow-sm shrink-0">
      {/* Tombol Kembali Kiri */}
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors cursor-pointer group"
      >
        <ArrowLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-lg md:text-xl">Kembali</span>
      </button>

      {/* Profil Pill Kanan */}
      <div className="flex items-center gap-3 bg-white rounded-full pl-4 pr-1 py-1">
        <span className="font-semibold text-base">
          {userName}/{roleName}
        </span>
        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
          <UserIconSingle className="text-white w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;