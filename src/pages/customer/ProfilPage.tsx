import { useState, useEffect } from "react";
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
import ConfirAlamat from "../../components/ConfirmationModal/ConfirmationModal";
import { useAuthStore } from "../../store/useAuthStore";
import LogoutIcon from "../../components/Icon/LogOutIcon";
import { customerAPI } from "../../api/onlinecustomer.api";
import { addressAPI } from "../../api/address.api";

interface CustomerProfile {
  email: string;
  fullname: string;
  phone_number: string;
  gender: string | null;
  date_of_birth: string | null;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<"Profil" | "Alamat" | "Sandi">(
    "Profil",
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [addressView, setAddressView] = useState<"list" | "form">("list");
  const [loading, setLoading] = useState(true);

  const [localToast, setLocalToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showLocalToast = (message: string, type: "success" | "error") => {
    setLocalToast({ show: true, message, type });
    setTimeout(
      () => setLocalToast({ show: false, message: "", type: "success" }),
      4000,
    );
  };

  // State untuk alamat
  const [addressList, setAddressList] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // State untuk data profil
  const [profile, setProfile] = useState<CustomerProfile>({
    email: "",
    fullname: "",
    phone_number: "",
    gender: null,
    date_of_birth: null,
  });

  // State untuk form edit profil
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isOpenJk, setIsOpenJk] = useState(false);

  // State untuk form alamat
  const [addressForm, setAddressForm] = useState({
    address_name: "",
    latitude: -6.510626,
    longitude: 106.809559,
    mark_as: "HOME" as "HOME" | "OFFICE",
    is_core_address: false,
  });

  // State untuk Modal
  const [modal, setModal] = useState({
    deleteAddress: false,
    confirmAddress: false,
    logout: false,
  });

  const toggleModal = (key: keyof typeof modal, value: boolean) =>
    setModal((prev) => ({ ...prev, [key]: value }));

  // Ambil data profil dari API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await customerAPI.getProfile();
        console.log("Profile data:", response);

        const profileData = response.data || response;
        setProfile(profileData);
        setFullname(profileData.fullname || "");
        setPhoneNumber(profileData.phone_number || "");
        setGender(
          profileData.gender === "MALE"
            ? "Laki-laki"
            : profileData.gender === "FEMALE"
              ? "Perempuan"
              : "",
        );
        setDateOfBirth(
          profileData.date_of_birth
            ? new Date(profileData.date_of_birth)
            : null,
        );
      } catch (error) {
        console.error("Gagal ambil profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Ambil daftar alamat
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressAPI.getMyAddresses();
      console.log("Alamat dari API:", response);
      const data = response.data || response;
      setAddressList(data);
    } catch (error) {
      console.error("Gagal ambil alamat:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Alamat") {
      fetchAddresses();
    }
  }, [activeTab]);

  // Hapus alamat
  const handleDeleteAddress = (id: string) => {
    setAddressToDelete(id);
    toggleModal("deleteAddress", true);
  };

  // Simpan perubahan profil
  const handleSaveProfile = async () => {
    try {
      const payload = {
        fullname: fullname,
        phone_number: phoneNumber,
        gender:
          gender === "Laki-laki"
            ? "MALE"
            : gender === "Perempuan"
              ? "FEMALE"
              : null,
        date_of_birth: dateOfBirth
          ? dateOfBirth.toISOString().split("T")[0]
          : null,
      };

      console.log("Payload yang dikirim:", payload);

      const response = await customerAPI.updateProfile(payload);
      console.log("Response:", response);

      setProfile({
        ...profile,
        fullname,
        phone_number: phoneNumber,
        gender:
          gender === "Laki-laki"
            ? "MALE"
            : gender === "Perempuan"
              ? "FEMALE"
              : null,
        date_of_birth: dateOfBirth
          ? dateOfBirth.toISOString().split("T")[0]
          : null,
      });

      setIsEditingProfile(false);
      showLocalToast("Perubahan berhasil disimpan", "success");
    } catch (error: any) {
      console.error("Gagal update profil:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui profil";
      showLocalToast(errorMessage, "error");
      alert(
        "Gagal memperbarui profil: " +
          JSON.stringify(error.response?.data?.message),
      );
    }
  };

  // Batalkan edit profil
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setFullname(profile.fullname || "");
    setPhoneNumber(profile.phone_number || "");
    setGender(
      profile.gender === "MALE"
        ? "Laki-laki"
        : profile.gender === "FEMALE"
          ? "Perempuan"
          : "",
    );
    setDateOfBirth(
      profile.date_of_birth ? new Date(profile.date_of_birth) : null,
    );
  };

  // Handle perubahan dari MapSection
  const handleAddressChange = (
    address: string,
    lat: number,
    lng: number,
    tag: "Rumah" | "Kantor",
  ) => {
    console.log("handleAddressChange dipanggil dengan tag:", tag);
    console.log("addressForm sebelum:", addressForm);
    setAddressForm({
      ...addressForm,
      address_name: address,
      latitude: lat,
      longitude: lng,
      mark_as: tag === "Rumah" ? "HOME" : "OFFICE",
    });
  };

  // Simpan alamat (CREATE atau UPDATE)
  const handleSaveAddress = async () => {
    console.log(" handleSaveAddress dipanggil");
    console.log(" editingAddress:", editingAddress);
    console.log(" addressForm:", addressForm);

    // if (editingAddress && !editingAddress.id) {
    //   showToast("ID alamat tidak ditemukan", "error");
    //   return;
    // }
    try {
      if (editingAddress) {
        await addressAPI.updateAddress(editingAddress.id, addressForm);
        showLocalToast("Perubahan berhasil disimpan", "success");
      } else {
        await addressAPI.createAddress(addressForm);
      }
      await fetchAddresses();
      setAddressView("list");
      setEditingAddress(null);
      // Reset form
      setAddressForm({
        address_name: "",
        latitude: -6.510626,
        longitude: 106.809559,
        mark_as: "HOME",
        is_core_address: false,
      });
    } catch (error) {
      console.error(" ERROR:", error);
     showLocalToast("Gagal menyimpan alamat", "error");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleOpenGoogleMaps = (address: string) => {
    window.open(
      `http://maps.google.com/?q=${encodeURIComponent(address)}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header mode="online" />
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {localToast.show && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 md:left-auto md:right-6 z-9999 ${localToast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white font-bold text-sm px-5 py-3 rounded-sm shadow-lg border ${localToast.type === "success" ? "border-green-300" : "border-red-300"} flex items-center gap-2 animate-in fade-in slide-in-from-top-8 duration-200`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          {localToast.message}
        </div>
      )}
      <Header mode="online" />
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-6 space-y-6">
        {/* BANNER USER */}
        <div className="bg-[#F3E8F3] rounded-[20px] p-8 mb-8 relative flex flex-col md:flex-row items-center gap-8 border border-primary/5 shadow-sm text-center md:text-left">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-black font-poppins">
            {getInitials(profile.fullname || "User")}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-black mb-1 font-poppins">
              {profile.fullname || "Pengguna"}
            </h2>
            <p className="text-gray-600 font-medium font-poppins">
              {profile.email || "-"}
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
              className={`pb-4 text-lg transition-all font-poppins ${activeTab === "Profil" || activeTab === "Sandi" ? "text-primary border-b-4 border-primary" : "text-black"}`}
            >
              Profile Saya
            </button>
            <button
              onClick={() => {
                setActiveTab("Alamat");
                setAddressView("list");
              }}
              className={`pb-4 text-lg transition-all font-poppins ${activeTab === "Alamat" ? "text-primary border-b-4 border-primary" : "text-black"}`}
            >
              Alamat
            </button>
          </div>

          <div className="w-full text-left">
            {/* TAB PROFIL */}
            {activeTab === "Profil" && (
              <div className="max-w-5xl animate-in fade-in duration-500">
                <h3 className="text-lg font-black text-black mb-8 font-poppins">
                  {isEditingProfile ? "Edit Data Diri" : "Data Diri"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 font-poppins">
                  <div className="space-y-3 flex flex-col">
                    <label className="text-black font-bold text-[16px]">
                      Nama Lengkap
                    </label>
                    <input
                      disabled={!isEditingProfile}
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full p-4 bg-white border-[1.5px] border-primary rounded-xs font-medium outline-none text-black disabled:text-black disabled:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-3 flex flex-col">
                    <label className="text-black font-bold text-[16px]">
                      Jenis Kelamin
                    </label>
                    <div className="relative w-full">
                      <button
                        type="button"
                        disabled={!isEditingProfile}
                        onClick={() => setIsOpenJk(!isOpenJk)}
                        className="w-full p-4 bg-white border-[1.5px] border-primary rounded-xs font-medium text-left outline-none text-black disabled:text-black disabled:bg-gray-50 text-sm flex justify-between items-center transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <span>{gender || "Pilih Jenis Kelamin"}</span>
                        {isEditingProfile && (
                          <ChevronDown
                            className={`text-black transition-transform duration-200 ${isOpenJk ? "rotate-180" : ""}`}
                            size={20}
                          />
                        )}
                      </button>

                      {isEditingProfile && isOpenJk && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpenJk(false)}
                          />
                          <ul className="absolute left-0 right-0 mt-1 bg-white border border-primary-100 rounded-xs shadow-xl z-50 overflow-hidden divide-y divide-gray-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            {["Laki-laki", "Perempuan"].map((option) => (
                              <li
                                key={option}
                                onClick={() => {
                                  setGender(option);
                                  setIsOpenJk(false);
                                }}
                                className={`p-4 text-sm cursor-pointer transition-colors text-left hover:bg-primary/5 ${
                                  gender === option
                                    ? "text-black font-bold bg-primary/5"
                                    : "text-black"
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

                  <div className="space-y-3 flex flex-col">
                    <label className="text-black font-bold text-[16px]">
                      No Telepon
                    </label>
                    <input
                      disabled={!isEditingProfile}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-4 bg-white border-[1.5px] border-primary rounded-xs font-medium outline-none text-black disabled:text-black disabled:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-3 flex flex-col">
                    <label className="text-black font-bold text-[16px]">
                      Tanggal Lahir
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={dateOfBirth}
                        onChange={(date: Date | null) => setDateOfBirth(date)}
                        disabled={!isEditingProfile}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        onKeyDown={(e) => e.preventDefault()}
                        className="w-full p-4 bg-white border-[1.5px] border-primary rounded-xs font-medium pl-14 outline-none text-black disabled:text-black disabled:bg-gray-50 caret-transparent cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                        onClick={handleCancelEdit}
                        className="px-10 py-3 bg-white border-[1.5px] border-gray-300 rounded-xs active:scale-95 transition-transform text-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-10 py-3 bg-primary text-white rounded-xs text-sm"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleModal("logout", true)}
                      className="bg-primary text-white px-6 py-2.5 rounded-xs font-bold flex items-center gap-2 shadow-lg text-sm font-poppins"
                    >
                      <LogoutIcon width={18} height={16} /> Keluar
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB ALAMAT */}
            {activeTab === "Alamat" && (
              <div className="animate-in fade-in duration-500 font-poppins">
                {addressView === "list" ? (
                  <>
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black text-black">
                        Alamat Pengiriman
                      </h3>
                      <button
                        onClick={() => {
                          setAddressView("form");
                          setEditingAddress(null);
                          // Reset form ke default
                          setAddressForm({
                            address_name: "",
                            latitude: -6.510626,
                            longitude: 106.809559,
                            mark_as: "HOME",
                            is_core_address: false,
                          });
                        }}
                        className="bg-primary text-white px-3 sm:px-6 py-2.5 rounded-xs font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 shadow-lg"
                      >
                        <Plus size={16} className="sm:w-4.5 sm:h-4.5" />
                        <span className="hidden sm:inline">Tambah Alamat</span>
                        <span className="sm:hidden">Tambah</span>
                      </button>
                    </div>

                    {loadingAddresses ? (
                      <div className="text-center py-10">Memuat alamat...</div>
                    ) : addressList.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        Belum ada alamat. Silakan tambah alamat.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {addressList.map((addr) => (
                          <div
                            key={addr.id}
                            className="border-l-4 border-primary p-6 rounded-xs bg-white shadow-sm relative"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full text-primary">
                                  {addr.mark_as === "HOME" ? (
                                    <Home size={20} />
                                  ) : (
                                    <Building2 size={20} />
                                  )}
                                </div>
                                <span className="font-bold text-lg">
                                  {addr.mark_as === "HOME" ? "Rumah" : "Kantor"}
                                </span>
                              </div>
                              {addr.is_core_address && (
                                <span className="border-2 border-primary/30 text-primary px-5 py-1 rounded-full text-xs font-black bg-primary/5 uppercase">
                                  UTAMA
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              {addr.address_name}
                            </p>
                            <button
                              onClick={() =>
                                handleOpenGoogleMaps(addr.address_name)
                              }
                              className="text-primary font-bold text-sm underline mb-4 inline-block"
                            >
                              Lihat di Peta
                            </button>
                            <div className="flex gap-6 border-t pt-4">
                              <button
                                onClick={() => {
                                  console.log("Data alamat yang diedit:", addr);
                                  console.log("mark_as value:", addr.mark_as);
                                  setEditingAddress(addr);
                                  // Set form dengan data yang akan diedit
                                  setAddressForm({
                                    address_name: addr.address_name,
                                    latitude: addr.latitude,
                                    longitude: addr.longitude,
                                    mark_as:
                                      addr.mark_as === "OFFICE"
                                        ? "OFFICE"
                                        : "HOME",
                                    is_core_address: addr.is_core_address,
                                  });
                                  setAddressView("form");
                                }}
                                className="text-primary font-bold text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="font-bold text-sm "
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="max-w-5xl space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <h3 className="text-xl font-black text-black">
                      {editingAddress
                        ? "Edit Alamat Pengiriman"
                        : "Tambah Alamat Pengiriman"}
                    </h3>

                    {/* MAP SECTION dengan props */}
                    <MapSection
                      initialAddress={addressForm.address_name}
                      initialLat={addressForm.latitude}
                      initialLng={addressForm.longitude}
                      initialTag={
                        addressForm.mark_as === "HOME" ? "Rumah" : "Kantor"
                      }
                      onAddressChange={handleAddressChange}
                    />

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addressForm.is_core_address}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            is_core_address: e.target.checked,
                          })
                        }
                        className="w-5 h-5 accent-primary rounded-xs shadow-sm"
                      />
                      <span className="font-bold text-sm text-black">
                        Jadikan alamat utama
                      </span>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        onClick={() => {
                          setAddressView("list");
                          setEditingAddress(null);
                          // Reset form
                          setAddressForm({
                            address_name: "",
                            latitude: -6.510626,
                            longitude: 106.809559,
                            mark_as: "HOME",
                            is_core_address: false,
                          });
                        }}
                        className="px-10 py-3 bg-white border-[1.5px] border-gray-300 rounded-xs active:scale-95 transition-transform text-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => toggleModal("confirmAddress", true)}
                        className="px-10 py-3 bg-primary text-white rounded-xs text-sm"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB SANDI */}
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
        onClose={() => {
          toggleModal("deleteAddress", false);
          setAddressToDelete(null);
        }}
        onConfirm={async () => {
          if (addressToDelete) {
            try {
              await addressAPI.deleteAddress(addressToDelete);
              await fetchAddresses();
            } catch (error) {
              console.error("Gagal hapus alamat:", error);
              alert("Gagal menghapus alamat");
            }
          }
          toggleModal("deleteAddress", false);
          setAddressToDelete(null);
        }}
      />
      <ConfirAlamat
        isOpen={modal.confirmAddress}
        title={editingAddress ? "Edit Alamat?" : "Tambah Alamat?"}
        description={`Apakah anda yakin ingin ${editingAddress ? "mengubah" : "menambahkan"} alamat ini?`}
        onCancel={() => toggleModal("confirmAddress", false)}
        onConfirm={() => {
          handleSaveAddress(); // ← PANGGIL FUNGSI SAVE
          toggleModal("confirmAddress", false);
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
