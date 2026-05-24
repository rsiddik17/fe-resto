import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import FilterDropdown from "../../components/AdminComponents/FilterDropdown";
import ActionMenu from "../../components/AdminComponents/ActionMenu";
import DeleteEmployeeModal from "../../components/AdminComponents/DeleteEmployeeModal";

interface Pegawai {
  id: number;
  nama: string;
  email: string;
  noTelepon: string;
  role: string;
  status: boolean;
}

const DATA_PEGAWAI_AWAL: Pegawai[] = [
  {
    id: 1,
    nama: "Rina Lusiana",
    email: "kasiritsresto@gmail.com",
    noTelepon: "081409807898",
    role: "Kasir",
    status: true,
  },
  {
    id: 2,
    nama: "Mile Putri",
    email: "dapuritsresto@gmail.com",
    noTelepon: "081460877839",
    role: "Dapur",
    status: true,
  },
  {
    id: 3,
    nama: "KiosK Its Resto",
    email: "kiosksistem@gmail.com",
    noTelepon: "081460877839",
    role: "Kiosk Sistem",
    status: true,
  },
  {
    id: 4,
    nama: "Mila Dewita",
    email: "pelayanitsresto@gmail.com",
    noTelepon: "081432145678",
    role: "Pelayan",
    status: true,
  },
  {
    id: 5,
    nama: "Roni Julian",
    email: "kasiritsresto@gmail.com",
    noTelepon: "081478654760",
    role: "Kasir",
    status: false,
  },
  {
    id: 6,
    nama: "Mike Febrian",
    email: "dapuritsresto@gmail.com",
    noTelepon: "081489087657",
    role: "Dapur",
    status: false,
  },
  {
    id: 7,
    nama: "Putra Pratama",
    email: "pelayanitsresto@gmail.com",
    noTelepon: "081400876754",
    role: "Pelayan",
    status: true,
  },
  {
    id: 8,
    nama: "Citra Sania",
    email: "adminitsresto@gmail.com",
    noTelepon: "081456876723",
    role: "Admin Role",
    status: true,
  },
];

const ManajemenPegawaiPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(DATA_PEGAWAI_AWAL);

  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // State Modal Hapus
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pegawaiTargetDelete, setPegawaiTargetDelete] = useState<Pegawai | null>(null);

  // State Toast Pop-up Sukses
  const [showToast, setShowToast] = useState(false);

  // State Sorting
  const [currentSortKey, setCurrentSortKey] = useState<
    "nama" | "email" | "noTelepon" | "role" | "status"
  >("nama");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  useEffect(() => {
    if (location.state?.showSuccessToast) {
      setShowToast(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Fungsi RESET semua filter
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRole("");
    setSelectedStatus("");
  };

  // Cek apakah ada filter yang aktif
  const hasActiveFilters = searchQuery !== "" || selectedRole !== "" || selectedStatus !== "";

  // Handle sort
  const handleSort = (key: "nama" | "email" | "noTelepon" | "role" | "status") => {
    if (currentSortKey === key) {
      setIsAscending(!isAscending);
    } else {
      setCurrentSortKey(key);
      setIsAscending(true);
    }
  };

  const handleToggleStatus = (id: number) => {
    setPegawaiList(
      pegawaiList.map((p) => (p.id === id ? { ...p, status: !p.status } : p)),
    );
  };

  const confirmDeletePegawai = () => {
    if (pegawaiTargetDelete) {
      setPegawaiList(
        pegawaiList.filter((p) => p.id !== pegawaiTargetDelete.id),
      );
      setIsDeleteOpen(false);
      setPegawaiTargetDelete(null);
    }
  };

  // Filter data
  const filteredPegawai = pegawaiList.filter((p) => {
    const matchSearch = searchQuery === "" || p.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = selectedRole === "" || p.role === selectedRole;
    const matchStatus =
      selectedStatus === "" ||
      (selectedStatus === "Aktif" ? p.status === true : p.status === false);
    return matchSearch && matchRole && matchStatus;
  });

  // Sorting data setelah filter
  const sortedAndFilteredPegawai = [...filteredPegawai].sort((a, b) => {
    if (currentSortKey === "status") {
      const valA = a.status ? 1 : 0;
      const valB = b.status ? 1 : 0;
      return isAscending ? valA - valB : valB - valA;
    }

    const valA = a[currentSortKey].toLowerCase();
    const valB = b[currentSortKey].toLowerCase();

    if (valA < valB) return isAscending ? -1 : 1;
    if (valA > valB) return isAscending ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6] relative">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6">
        <AdminHeader
          title="Manajemen Pegawai"
          subtitle="Pantau data sistem dan aktivitas pegawai"
        />

        <div className="space-y-4 w-full max-w-300 mx-auto relative">
          {/* BAR FILTER */}
          <div className="flex flex-wrap items-center justify-between gap-4 w-full z-30 relative">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative bg-white rounded-xs border border-gray-200 px-3 py-1.5 shadow-md flex items-center gap-2 w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Pegawai"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-[13px] text-gray-750 font-medium bg-transparent outline-none w-full"
                />
              </div>

              {/* Dropdown Role */}
              <FilterDropdown
                label="Role"
                selectedOption={selectedRole}
                options={["Kasir", "Dapur", "Pelayan", "Kiosk Sistem", "Admin Role"]}
                onSelect={setSelectedRole}
              />

              {/* Dropdown Status */}
              <FilterDropdown
                label="Status"
                selectedOption={selectedStatus}
                options={["Aktif", "Nonaktif"]}
                onSelect={setSelectedStatus}
              />

              {/* TOMBOL RESET */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="bg-white rounded-xs border border-red-300 px-4 py-1.5 shadow-md flex items-center gap-2 text-[13px] text-red-500 font-medium cursor-pointer hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                  Reset Filter
                </button>
              )}
            </div>

            <button
              onClick={() => navigate("/admin/manajemen-pegawai/tambah")}
              className="bg-primary hover:opacity-95 text-white font-bold text-[13px] px-4 py-2 rounded-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
              Tambah Pegawai
            </button>
          </div>

          {/* TABEL DATA */}
          <section className="bg-white rounded-xs shadow-xs border border-gray-150 overflow-visible w-full z-10 relative">
            <div className="overflow-x-auto w-full rounded-xs">
              <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-primary text-[12px] font-bold text-white uppercase">
                    <th className="py-3.5 text-center w-16">NO</th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("nama")}>
                      <div className="flex items-center gap-1.5">
                        <span>Nama</span>
                        <div className="flex flex-col -space-y-1">
                          <ChevronUp size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "nama" && isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                          <ChevronDown size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "nama" && !isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                        </div>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("email")}>
                      <div className="flex items-center gap-1.5">
                        <span>Email</span>
                        <div className="flex flex-col -space-y-1">
                          <ChevronUp size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "email" && isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                          <ChevronDown size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "email" && !isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                        </div>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("noTelepon")}>
                      <div className="flex items-center gap-1.5">
                        <span>No Telepon</span>
                        <div className="flex flex-col -space-y-1">
                          <ChevronUp size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "noTelepon" && isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                          <ChevronDown size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "noTelepon" && !isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                        </div>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("role")}>
                      <div className="flex items-center gap-1.5">
                        <span>Role</span>
                        <div className="flex flex-col -space-y-1">
                          <ChevronUp size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "role" && isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                          <ChevronDown size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "role" && !isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                        </div>
                      </div>
                    </th>
                    <th className="py-3.5 text-center w-28 cursor-pointer select-none group" onClick={() => handleSort("status")}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span>Status</span>
                        <div className="flex flex-col -space-y-1">
                          <ChevronUp size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "status" && isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                          <ChevronDown size={11} strokeWidth={3} className={`transition-all ${currentSortKey === "status" && !isAscending ? "text-white opacity-100" : "text-white opacity-30 group-hover:opacity-60"}`} />
                        </div>
                      </div>
                    </th>
                    <th className="py-3.5 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 bg-white font-medium text-[13.5px]">
                  {sortedAndFilteredPegawai.length > 0 ? (
                    sortedAndFilteredPegawai.map((pegawai, index) => (
                      <tr key={pegawai.id} className="border-b border-gray-150 last:border-0 hover:bg-gray-50/30 transition-colors">
                        <td className="py-3 text-center text-black font-normal">{index + 1}</td>
                        <td className="py-3 px-4 text-black font-normal">{pegawai.nama}</td>
                        <td className="py-3 px-4 text-black font-normal">{pegawai.email}</td>
                        <td className="py-3 px-4 text-black font-normal">{pegawai.noTelepon}</td>
                        <td className="py-3 px-4 text-black font-normal">{pegawai.role}</td>
                        <td className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(pegawai.id)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer mx-auto ${pegawai.status ? "bg-[#86EF4D]" : "bg-gray-200"}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform duration-200 ${pegawai.status ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </td>
                        <td className="py-3 text-center relative overflow-visible">
                          <ActionMenu
                            onDetail={() => navigate(`/admin/manajemen-pegawai/detail/${pegawai.id}`)}
                            onEditProfil={() => navigate(`/admin/manajemen-pegawai/edit/${pegawai.id}`)}
                            onUbahPassword={() => navigate(`/admin/manajemen-pegawai/ubah-sandi/${pegawai.id}`)}
                            onHapus={() => {
                              setPegawaiTargetDelete(pegawai);
                              setIsDeleteOpen(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                        Tidak ada data pegawai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* MODAL HAPUS */}
          <DeleteEmployeeModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setPegawaiTargetDelete(null);
            }}
            onConfirm={confirmDeletePegawai}
            title="Hapus Pegawai?"
            description={`Apakah anda yakin ingin menghapus Data pegawai ${pegawaiTargetDelete?.nama || ""}? Tindakan ini tidak dapat dibatalkan`}
          />

          {/* TOAST SUKSES */}
          {showToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-150 rounded-[14px] px-5 py-3 shadow-xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#86EF4D]/20 p-1 rounded-full text-[#5B9C34]">
                <CheckCircle2 size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[13.5px] font-bold text-gray-800 tracking-tight">
                Berhasil Perbarui Kata Sandi
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManajemenPegawaiPage;