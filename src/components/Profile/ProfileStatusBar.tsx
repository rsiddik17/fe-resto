// src/components/Profile/AccountStatusBar.tsx
import InfoIcon from "../Icon/InfoIcon";

interface ProfileStatusBarProps {
  isActive?: boolean;
}

const ProfileStatusBar = ({ isActive = true }: ProfileStatusBarProps) => {
  return (
    <div className="bg-[#D9D9D9] rounded-md py-4 pl-6 pr-12 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-10 pl-5">
        <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-[#8AC926]' : 'bg-red-500'}`}></div>
        <span className="font-bold text-sm md:text-base">
          {isActive ? "Status Akun Aktif" : "Status Akun Nonaktif"}
        </span>
      </div>
      <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
        <InfoIcon className="text-white w-8 h-8" />
      </div>
    </div>
  );
};

export default ProfileStatusBar;