// src/components/Profile/ProfileAvatar.tsx
import UserIconSingle from "../Icon/UserIconSingle";

interface ProfileAvatarProps {
  name: string;
}

const ProfileAvatar = ({ name }: ProfileAvatarProps) => {
  return (
    <div className="w-full md:w-[35%] flex flex-col items-center pt-4 shrink-0">
      <div className="w-38 h-38 md:w-42 md:h-42 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
        <UserIconSingle className="w-24 h-24 md:w-32 md:h-32 text-primary" strokeWidth={2} />
      </div>
      <h2 className="text-xl md:text-[22px] font-bold capitalize text-center">
        {name}
      </h2>
    </div>
  );
};

export default ProfileAvatar;