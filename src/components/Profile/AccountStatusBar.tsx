// src/components/Profile/AccountStatusBar.tsx
import InfoIcon from "../Icon/InfoIcon";

interface AccountStatusBarProps {
  isActive?: boolean;
}

const AccountStatusBar = ({ isActive = true }: AccountStatusBarProps) => {
  return (
    <div className="bg-[#D9D9D9] rounded-md py-4 pl-4 pr-12 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-6 pl-4">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-[#8AC926]' : 'bg-red-500'}`}></div>
        <span className="font-bold text-base md:text-lg">
          {isActive ? "Status Akun Aktif" : "Status Akun Nonaktif"}
        </span>
      </div>
      <div className="w-7 h-7 bg-[#374151] rounded-full flex items-center justify-center">
        <InfoIcon className="text-white w-6 h-6" />
      </div>
    </div>
  );
};

export default AccountStatusBar;