// src/components/Profile/ProfileDetailsCard.tsx
interface ProfileDetailsProps {
  fullname: string;
  phone: string;
  gender: string;
  email: string;
  role: string;
}

const ProfileDetailsCard = ({ fullname, phone, gender, email, role }: ProfileDetailsProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 md:pl-10 md:pr-8 md:pt-10 md:pb-25">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
        
        <div className="flex flex-col gap-3 wrap-break-word">
          <span className="text-gray-500 text-xs md:text-sm font-medium">Nama Lengkap</span>
          <span className="font-bold text-[15px] md:text-[17px]">{fullname}</span>
        </div>

        <div className="flex flex-col gap-3 wrap-break-word">
          <span className="text-gray-500 text-xs md:text-sm font-medium">Nomor Telepon</span>
          <span className="font-bold text-[15px] md:text-[17px]">{phone}</span>
        </div>

        <div className="flex flex-col gap-3 wrap-break-word">
          <span className="text-gray-500 text-xs md:text-sm font-medium">Jenis Kelamin</span>
          <span className="font-bold text-[15px] md:text-[17px]">{gender}</span>
        </div>

        <div className="flex flex-col gap-3 wrap-break-word">
          <span className="text-gray-500 text-xs md:text-sm font-medium">Email</span>
          <span className="font-bold text-[15px] md:text-[17px] ">{email}</span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-gray-500 text-xs md:text-sm font-medium">Peran Pengguna</span>
          <span className="font-bold text-[15px] md:text-[17px]">{role}</span>
        </div>

      </div>
    </div>
  );
};

export default ProfileDetailsCard;