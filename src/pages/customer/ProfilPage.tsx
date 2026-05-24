import { useState } from "react";
import {
  Edit3,
  Calendar,
  Home,
  Building2,
  Lock,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";
import Header from "../../components/HeaderOnline/HeaderOnline";
import MapSection from "../../components/MapSection/MapSection";
import LogoutModal from "../../components/LogoutModal/LogoutModal";
import ChangePwProf from "../../components/ChangePwProf/ChangePwProf";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import ConfirAlamat from "../../components/ConfirAlamat/ConfirAlamat";
import { useAuthStore } from "../../store/useAuthStore";
import LogoutIcon from "../../components/Icon/LogOutIcon";

const ProfilePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<"Profil" | "Alamat" | "Sandi">(
    "Profil",
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [addressView, setAddressView] = useState<"list" | "form">("list");
  const [startDate, setStartDate] = useState(new Date(2002, 3, 3));

  // State untuk menangani nilai Custom Dropdown Jenis Kelamin
  const [gender, setGender] = useState("Laki-laki");
  const [isOpenJk, setIsOpenJk] = useState(false);

  // State untuk Modal dikelompokkan dalam satu object agar hemat baris
  const [modal, setModal] = useState({
    deleteAddress: false,
    confirmAddress: false,
    logout: false,
  });
  const toggleModal = (key: keyof typeof modal, value: boolean) =>
    setModal((prev) => ({ ...prev, [key]: value }));

  const handleOpenGoogleMaps = (address: string) => {
    window.open(
      `http://maps.google.com/?q=${encodeURIComponent(address)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header mode="online" />
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-6 space-y-6">
        {/* BANNER USER */}
        <div className="bg-[#F3E8F3] rounded-[20px] p-8 mb-8 relative flex flex-col md:flex-row items-center gap-8 border border-primary/5 shadow-sm text-center md:text-left">
          <div className="w-24 h-24 bg-[#B197B1] rounded-full flex items-center justify-center text-white text-4xl font-black font-poppins">
            WH
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-black mb-1 font-poppins">
              Wawan Hermawan
            </h2>
            <p className="text-gray-600 font-medium font-poppins">
              wawanhrmwn@gmail.com
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {!isEditingProfile && activeTab !== "Sandi" && (
              <>
                <button
                  onClick={() => {
                    setActiveTab("Profil");
                    setIsEditingProfile(true);
                  }}
                  className="bg-primary text-white px-6 py-2.5 rounded-xs font-bold flex items-center gap-2 shadow-lg text-sm font-poppins"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button
                  onClick={() => setActiveTab("Sandi")}
                  className="bg-primary text-white px-6 py-2.5 rounded-xs font-bold flex items-center gap-2 shadow-lg text-sm font-poppins"
                >
                  <Lock size={16} /> Ubah Kata Sandi
                </button>
              </>
            )}
          </div>
        </div>

        <section className="bg-white rounded-xs shadow-sm p-6 md:p-10 min-h-500px">
          <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab("Profil");
                setIsEditingProfile(false);
              }}
              className={`pb-4 text-lg  transition-all font-poppins ${activeTab === "Profil" || activeTab === "Sandi" ? "text-primary border-b-4 border-primary" : "text-gray-400"}`}
            >
              Profile Saya
            </button>
            <button
              onClick={() => {
                setActiveTab("Alamat");
                setAddressView("list");
              }}
              className={`pb-4 text-lg  transition-all font-poppins ${activeTab === "Alamat" ? "text-primary border-b-4 border-primary" : "text-gray-400"}`}
            >
              Alamat
            </button>
          </div>

          <div className="w-full text-left">
            {activeTab === "Profil" && (
              <div className="max-w-5xl animate-in fade-in duration-500">
                <h3 className="text-lg font-black text-black mb-8 font-poppins">
                  {isEditingProfile ? "Edit Data Diri" : "Data Diri"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-poppins">
                  <div className="space-y-2">
                    <label className="text-black font-bold text-sm">
                      Nama Lengkap
                    </label>
                    <input
                      disabled={!isEditingProfile}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xs font-medium outline-none text-gray-700 disabled:text-black"
                      defaultValue="Wawan Hermawan"
                    />
                  </div>

                  {/* DI SINI BAGIAN YANG DIGANTI KE CUSTOM DROPDOWN (100% AMAN DI MOBILE) */}
                  <div className="space-y-2 relative">
                    <label className="text-black font-bold text-sm">
                      Jenis Kelamin
                    </label>
                    <div className="relative w-full">
                      <button
                        type="button"
                        disabled={!isEditingProfile}
                        onClick={() => setIsOpenJk(!isOpenJk)}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xs font-medium text-left outline-none text-gray-700 disabled:text-black text-sm flex justify-between items-center h-13.5]"
                      >
                        <span>{gender}</span>
                        {isEditingProfile && (
                          <ChevronDown
                            className={`text-primary transition-transform duration-200 ${isOpenJk ? "rotate-180" : ""}`}
                            size={20}
                          />
                        )}
                      </button>

                      {isEditingProfile && isOpenJk && (
                        <>
                          {/* Latar belakang transparan penutup otomatis jika klik di luar dropdown */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpenJk(false)}
                          />

                          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xs shadow-xl z-50 overflow-hidden divide-y divide-gray-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            {["Laki-laki", "Perempuan"].map((option) => (
                              <li
                                key={option}
                                onClick={() => {
                                  setGender(option);
                                  setIsOpenJk(false);
                                }}
                                className={`p-4 text-sm cursor-pointer transition-colors text-left hover:bg-primary/5 ${
                                  gender === option
                                    ? "text-primary font-bold bg-primary/5"
                                    : "text-gray-700"
                                }`}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-black font-bold text-sm">
                      No Telepon
                    </label>
                    <input
                      disabled={!isEditingProfile}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xs font-medium outline-none text-gray-700 disabled:text-black"
                      defaultValue="+62 114 0986 7821"
                    />
                  </div>

                  {/* Tanggal Lahir */}
                  <div className="space-y-2">
                    <label className="text-black font-bold text-sm">
                      Tanggal Lahir
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        disabled={!isEditingProfile}
                        dateFormat="dd/MM/yyyy"
                        onKeyDown={(e) => e.preventDefault()}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xs font-medium pl-14 outline-none text-gray-700 disabled:text-black caret-transparent cursor-pointer"
                      />
                      <Calendar
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={22}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-16 font-poppins">
                  {isEditingProfile ? (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="px-10 py-3 bg-gray-200 text-gray-600 font-bold rounded-xs active:scale-95 transition-transform text-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="px-10 py-3 bg-primary text-white font-bold rounded-xs active:scale-95 transition-transform text-sm"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleModal("logout", true)}
                      className="bg-primary text-white px-6 py-2.5 rounded-xs font-bold flex items-center gap-2 shadow-lg text-sm font-poppins"
                    >
                      <LogoutIcon size={16} /> Keluar
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Alamat" && (
              <div className="animate-in fade-in duration-500 font-poppins">
                {addressView === "list" ? (
                  <>
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black text-black">
                        Alamat Pengiriman
                      </h3>
                      <button
                        onClick={() => setAddressView("form")}
                        className="bg-primary text-white px-6 py-2.5 rounded-xs font-bold text-sm flex items-center gap-2 shadow-lg"
                      >
                        <Plus size={18} /> Tambah Alamat
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="border-l-4 border-primary p-6 rounded-xs bg-white shadow-sm relative">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                              <Home size={20} />
                            </div>
                            <span className="font-bold text-lg">Rumah</span>
                          </div>
                          <span className="border-2 border-primary/30 text-primary px-5 py-1 rounded-full text-xs font-black bg-primary/5 uppercase">
                            UTAMA
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Puri Nirwana 3, Cibinong, Bogor
                        </p>
                        <button
                          onClick={() => handleOpenGoogleMaps("Puri Nirwana 3")}
                          className="text-primary font-bold text-sm underline mb-4 inline-block"
                        >
                          Lihat di Peta
                        </button>
                        <div className="flex gap-6 border-t pt-4">
                          <button
                            onClick={() => setAddressView("form")}
                            className="text-primary font-bold text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleModal("deleteAddress", true)}
                            className="font-bold text-sm hover:text-red-500 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                      <div className="border-l-4 border-primary p-6 rounded-xs bg-white shadow-sm relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Building2 size={20} />
                          </div>
                          <span className="font-bold text-lg">Kantor</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          Gedung Sentra Sudirman Lt.12, Jakarta Selatan
                        </p>
                        <button
                          onClick={() =>
                            handleOpenGoogleMaps("Gedung Sentra Sudirman")
                          }
                          className="text-primary font-bold text-sm underline mb-4 inline-block"
                        >
                          Lihat di Peta
                        </button>
                        <div className="flex gap-6 border-t pt-4">
                          <button
                            onClick={() => setAddressView("form")}
                            className="text-primary font-bold text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleModal("deleteAddress", true)}
                            className="text-gray-300 font-bold text-sm hover:text-red-500 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="max-w-5xl space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <h3 className="text-xl font-black text-black">
                      Tambah Alamat Pengiriman
                    </h3>
                    <MapSection />
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-primary rounded-xs shadow-sm"
                      />
                      <span className="font-bold text-sm text-black">
                        Jadikan alamat utama
                      </span>
                    </div>
                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        onClick={() => setAddressView("list")}
                        className="px-10 py-3 bg-gray-200 text-gray-600 font-bold rounded-xs"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => toggleModal("confirmAddress", true)}
                        className="px-10 py-3 bg-primary text-white font-bold rounded-xs shadow-lg active:scale-95 transition-all text-sm"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "Sandi" && (
              <ChangePwProf onCancel={() => setActiveTab("Profil")} />
            )}
          </div>
        </section>
      </main>

      <DeleteConfirmationModal
        isOpen={modal.deleteAddress}
        title="Hapus Alamat?"
        description="Apakah anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan"
        onClose={() => toggleModal("deleteAddress", false)}
        onConfirm={() => toggleModal("deleteAddress", false)}
      />
      <ConfirAlamat
        isOpen={modal.confirmAddress}
        title="Perbarui Alamat?"
        description="Apakah anda yakin ingin mengubah alamat? Tindakan ini tidak dapat dibatalkan"
        onCancel={() => toggleModal("confirmAddress", false)}
        onConfirm={() => {
          toggleModal("confirmAddress", false);
          setAddressView("list");
        }}
      />
      <LogoutModal
        isOpen={modal.logout}
        onClose={() => toggleModal("logout", false)}
        onConfirm={() => {
          logout();
          toggleModal("logout", false);
          navigate("/", { replace: true });
        }}
      />
    </div>
  );
};

export default ProfilePage;
