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
    <header className="bg-white h-18 pl-6 pr-8 flex justify-between items-center shadow-sm shrink-0">
      {/* Tombol Kembali Kiri */}
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors cursor-pointer group"
      >
        <ArrowLeft size={24} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-base md:text-lg">Kembali</span>
      </button>

      {/* Profil Pill Kanan */}
      <div className="flex items-center gap-2 bg-white rounded-full pl-4 pr-1 py-1">
        <span className="font-semibold text-sm">
          {userName}/{roleName}
        </span>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <UserIconSingle className="text-white w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;