import UserIconSingle from "../Icon/UserIconSingle";
import { useNavigate } from "react-router";
interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  adminName?: string;
  roleName?: string;
}

const AdminHeader = ({
  title = "Dashboard Admin",
  subtitle = "Pantau data sistem dan aktivitas pengguna",
  adminName = "Citra",
  roleName = "Admin Role",
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate("/admin/profil"); // 👈 ARAHKAN KE HALAMAN PROFIL
  };
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      {/* Bagian Kiri: Judul & Subjudul */}
      <div className="flex flex-col w-full md:w-auto">
        <h1 className="text-[20px] md:text-[23px] font-bold text-gray-900 mb-1 ">{title}</h1>
        {subtitle && (
          <p className="text-black/50 text-sm md:text-[15px]">{subtitle}</p>
        )}
      </div>

      {/* Bagian Kanan: Pill Profil Admin */}
      <button
        onClick={handleProfileClick} // 👈 TAMBAHKAN ONCLICK
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-[18px] pl-4 pr-1.5 py-1.5 shadow-sm w-full md:w-auto justify-between md:justify-end cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="text-[13px] md:text-[14px]  text-gray-700">
          {adminName}/{roleName}
        </span>
        <div className="w-8 h-8 md:w-8.5 md:h-8.5 bg-primary rounded-full flex items-center justify-center shadow-sm shrink-0">
          <UserIconSingle className="text-white w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
        </div>
      </button>
    </header>
  );
};

export default AdminHeader;
