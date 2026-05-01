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
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 md:px-8 md:pt-8 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
        
        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-sm md:text-base font-medium">Nama Lengkap</span>
          <span className="font-bold text-lg md:text-xl text-black capitalize">{fullname}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-sm md:text-base font-medium">Nomor Telepon</span>
          <span className="font-bold text-lg md:text-xl text-black">{phone}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-sm md:text-base font-medium">Jenis Kelamin</span>
          <span className="font-bold text-lg md:text-xl text-black capitalize">{gender}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-sm md:text-base font-medium">Email</span>
          <span className="font-bold text-lg md:text-xl text-black">{email}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-sm md:text-base font-medium">Peran Pengguna</span>
          <span className="font-bold text-lg md:text-xl text-black capitalize">{role}</span>
        </div>

      </div>
    </div>
  );
};

export default ProfileDetailsCard;