import UserIconSingle from "../Icon/UserIconSingle";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { staffAPI } from "../../api/staff.api";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

interface ProfileData {
  fullname: string;
  role: string;
}

const AdminHeader = ({
  title = "Dashboard Admin",
  subtitle = "Pantau data sistem dan aktivitas pengguna",
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await staffAPI.getProfile();
        const profileData = response.data || response;
        setProfile({
          fullname: profileData.fullname || "Admin",
          role: profileData.role || "ADMIN",
        });
      } catch (error) {
        console.error("Gagal ambil profil:", error);
        setProfile({ fullname: "Admin", role: "ADMIN" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        return role || "Admin Role";
    }
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  const displayName = profile?.fullname?.split(" ")[0] || "Admin";
  const displayRole = getRoleLabel(profile?.role || "ADMIN");

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-col w-full md:w-auto">
        <h1 className="text-[20px] md:text-[23px] font-bold text-gray-900 mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-black/50 text-sm md:text-[15px]">{subtitle}</p>
        )}
      </div>

      {/* ✅ PERBAIKAN: Teks lebih gelap dan tebal */}
      <button
        onClick={handleProfileClick}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-[18px] pl-4 pr-1.5 py-1.5 shadow-sm w-full md:w-auto justify-between md:justify-end cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {loading ? (
          <span className="text-[13px] text-gray-500">Loading...</span>
        ) : (
          <span className="text-[13px] md:text-[14px] font-semibold text-gray-900">
            {displayName} <span className="text-gray-400 font-normal">/</span> {displayRole}
          </span>
        )}
        <div className="w-8 h-8 md:w-8.5 md:h-8.5 bg-primary rounded-full flex items-center justify-center shadow-sm shrink-0">
          <UserIconSingle className="text-white w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
        </div>
      </button>
    </header>
  );
};

export default AdminHeader;