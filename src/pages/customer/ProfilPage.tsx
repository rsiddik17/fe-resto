import { useState } from "react";
import { Edit3, Calendar, MapPin, Home, Building2 } from "lucide-react";
import Header from "../../components/HeaderOnline/HeaderOnline";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"Profile Saya" | "Alamat">("Profile Saya");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [addressView, setAddressView] = useState<"list" | "form">("list");

  // Data dummy
  const [userData, setUserData] = useState({
    name: "Wawan Hermawan",
    email: "wawanhrmwn@gmail.com",
    phone: "+62 114 0986 7821",
    gender: "Laki-laki",
    birthDate: "03/04/2002",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header mode="online" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* BANNER USER - Responsif: Stack di mobile, Row di desktop */}
        <div className="bg-[#F3E8F3] rounded-[20px] p-6 sm:p-8 mb-6 sm:mb-8 relative flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-primary rounded-full flex items-center justify-center text-white text-2xl sm:text-4xl font-bold shadow-lg">
            WH
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-3xl font-black text-black truncate">{userData.name}</h2>
            <p className="text-gray-600 text-sm sm:text-lg truncate">{userData.email}</p>
          </div>
          
          {activeTab === "Profile Saya" && !isEditingProfile && (
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="mt-2 sm:mt-0 sm:absolute sm:bottom-8 sm:right-8 bg-primary text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-xs font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all text-sm sm:text-base"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>

        {/* TABS MENU - Scrollable di layar sangat kecil */}
        <div className="flex gap-6 sm:gap-8 border-b border-gray-100 mb-6 sm:mb-8 overflow-x-auto no-scrollbar">
          {["Profile Saya", "Alamat"].map((tab: any) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setAddressView("list");
              }}
              className={`pb-3 sm:pb-4 text-[15px] sm:text-lg font-bold whitespace-nowrap transition-all ${
                activeTab === tab ? "text-primary border-b-4 border-primary" : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* AREA KONTEN DINAMIS */}
        <div className="w-full">
          {activeTab === "Profile Saya" ? (
            /* --- SECTION PROFILE --- */
            <div className="max-w-5xl animate-in fade-in duration-500">
              <h3 className="text-lg sm:text-xl font-black text-black mb-4 sm:mb-6">
                {isEditingProfile ? "Edit Data Diri" : "Data Diri"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-6">
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold text-sm sm:text-base">Nama Lengkap</label>
                  <input disabled={!isEditingProfile} className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-xs text-sm" defaultValue={userData.name} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold text-sm sm:text-base">Jenis Kelamin</label>
                  <select disabled={!isEditingProfile} className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-xs text-sm" defaultValue={userData.gender}>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold text-sm sm:text-base">No Telepon</label>
                  <input disabled={!isEditingProfile} className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-xs text-sm" defaultValue={userData.phone} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-bold text-sm sm:text-base">Tanggal Lahir</label>
                  <div className="relative">
                    <input disabled={!isEditingProfile} className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-xs text-sm pl-11" defaultValue={userData.birthDate} />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>
              {isEditingProfile && (
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 sm:mt-12">
                  <button onClick={() => setIsEditingProfile(false)} className="w-full sm:w-auto px-10 py-3 bg-gray-200 text-gray-600 font-bold rounded-xs">Batal</button>
                  <button onClick={() => setIsEditingProfile(false)} className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-xs shadow-lg">Simpan</button>
                </div>
              )}
            </div>
          ) : (
            /* --- SECTION ALAMAT --- */
            <div className="animate-in fade-in duration-500">
              {addressView === "list" ? (
                /* SUB-VIEW: DAFTAR ALAMAT */
                <div className="space-y-6">
                  <h3 className="text-lg sm:text-xl font-black text-black">Alamat Pengiriman</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Card Alamat */}
                    <div className="border-l-4 border-primary bg-gray-50 p-5 sm:p-6 rounded-xs relative">
                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className="flex items-center gap-2">
                          <Home size={18} className="text-primary" />
                          <span className="font-bold text-black sm:text-lg">Rumah</span>
                        </div>
                        <span className="border border-primary text-primary px-3 py-0.5 rounded-full text-[10px] font-bold">UTAMA</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed font-medium">
                        Puri Nirwana 3, Jl. Edelweiss II, Blok CC, RW.No. 29, Karadenan, Kec. Cibinong, Kabupaten Bogor...
                      </p>
                      <div className="flex gap-4">
                        <button onClick={() => setAddressView("form")} className="text-primary font-bold text-xs sm:text-sm">Edit</button>
                        <button className="text-gray-400 font-bold text-xs sm:text-sm">Hapus</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center sm:justify-end mt-6">
                    <button onClick={() => setAddressView("form")} className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xs font-bold shadow-lg">+ Tambah Alamat</button>
                  </div>
                </div>
              ) : (
                /* SUB-VIEW: FORM ALAMAT DENGAN PETA */
                <div className="max-w-5xl space-y-5 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black text-black">Tambah Alamat Pengiriman</h3>
                  <div>
                    <label className="text-gray-700 font-bold block mb-2 text-sm sm:text-base">Alamat Lengkap</label>
                    <textarea className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-xs h-24 text-sm" placeholder="Masukkan alamat lengkap" />
                  </div>
                  {/* PETA SENSITIF LAYAR */}
                  <div className="w-full h-60 sm:h-80 bg-gray-100 rounded-xs relative overflow-hidden border border-gray-100 flex items-center justify-center">
                     <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-6.510626,106.809559&zoom=15&size=800x400&key=MAP_KEY')] bg-cover bg-center opacity-60" />
                     <MapPin className="text-red-600 relative z-10" size={36} />
                     <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                        <button className="w-8 h-8 bg-white shadow rounded-xs font-bold">+</button>
                        <button className="w-8 h-8 bg-white shadow rounded-xs font-bold">-</button>
                     </div>
                  </div>
                  {/* LATITUDE & LONGITUDE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-bold text-sm">Latitude</label>
                      <input disabled className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xs font-mono text-xs" value="-6.510626" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-gray-700 font-bold text-sm">Longitude</label>
                      <input disabled className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xs font-mono text-xs" value="106.809559" />
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
                    <button onClick={() => setAddressView("list")} className="w-full sm:w-auto px-10 py-3 bg-gray-200 text-gray-600 font-bold rounded-xs">Batal</button>
                    <button onClick={() => setAddressView("list")} className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-xs shadow-lg">Simpan</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;