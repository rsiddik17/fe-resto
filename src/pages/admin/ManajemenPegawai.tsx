import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import SortIcon from "../../components/Icon/SortIcon";
import { staffAPI } from "../../api/staff.api";
import {
  Search,
  Plus,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import FilterDropdown from "../../components/AdminComponents/FilterDropdown";
import ActionMenu from "../../components/AdminComponents/ActionMenu";
import DeleteEmployeeModal from "../../components/AdminComponents/DeleteEmployeeModal";

interface Pegawai {
  id: string;
  nama: string;
  email: string;
  noTelepon: string;
  role: string;
  status: boolean;
  gender: string;
}

const ManajemenPegawaiPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await staffAPI.getAllStaff();
        console.log("Data mentah dari API:", response.data);
        if (response && response.data) {
          const dataMapping = response.data.map((s: any) => ({
            id: s.id,
            nama: s.fullname,
            email: s.email,
            noTelepon: s.phone_number,
            role:
              s.role === "CASHIER"
                ? "Kasir"
                : s.role === "KITCHEN"
                  ? "Dapur"
                  : s.role === "WAITER"
                    ? "Pelayan"
                    : s.role === "KIOSK_SYSTEM"
                      ? "Kiosk Sistem"
                      : s.role === "ADMIN"
                        ? "Admin Role"
                        : s.role,
            status: s.is_active,
            gender: s.gender,
          }));

          setPegawaiList(dataMapping);
        }
      } catch (error) {
        console.error("Gagal ambil data staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Modal Hapus
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pegawaiTargetDelete, setPegawaiTargetDelete] =
    useState<Pegawai | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Sorting
  const [currentSortKey, setCurrentSortKey] = useState<
    "nama" | "email" | "noTelepon" | "role" | "status"
  >("nama");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const renderSortIcon = (
    key: "nama" | "email" | "noTelepon" | "role" | "status",
  ) => (
    <SortIcon
      isActiveAsc={currentSortKey === key && isAscending}
      isActiveDesc={currentSortKey === key && !isAscending}
      isInverse={true}
    />
  );

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (location.state?.showSuccessToast) {
      setToastMessage(
        location.state.message || "Berhasil memperbarui kata sandi",
      );
      setShowToast(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRole("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedRole !== "" || selectedStatus !== "";

  const handleSort = (
    key: "nama" | "email" | "noTelepon" | "role" | "status",
  ) => {
    if (currentSortKey === key) {
      setIsAscending(!isAscending);
    } else {
      setCurrentSortKey(key);
      setIsAscending(true);
    }
    setCurrentPage(1);
  };

  const handleToggleStatus = (id: string) => {
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

  // ✅ FIX: Handle change items per page
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  // Filter data
  const filteredPegawai = pegawaiList.filter((p) => {
    const matchSearch =
      searchQuery === "" ||
      p.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole =
      selectedRole === "" ||
      p.role.toLowerCase() === selectedRole.toLowerCase();
    const matchStatus =
      selectedStatus === "" ||
      (selectedStatus === "Aktif" ? p.status === true : p.status === false);
    return matchSearch && matchRole && matchStatus;
  });

  // Sorting data
  const sortedPegawai = [...filteredPegawai].sort((a, b) => {
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

  // Pagination
  const totalPages = Math.ceil(sortedPegawai.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPegawai.slice(indexOfFirstItem, indexOfLastItem);
  const startCount = indexOfFirstItem + 1;
  const endCount = Math.min(indexOfLastItem, sortedPegawai.length);

  // ✅ FIX: Sinkronisasi currentPage
  useEffect(() => {
    const maxPage = Math.ceil(sortedPegawai.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [sortedPegawai.length, itemsPerPage, currentPage]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
        <AdminSidebar onLogout={() => console.log("Admin Logout")} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pegawai...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6] relative">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-4 md:p-6">
        <AdminHeader
          title="Manajemen Pegawai"
          subtitle="Pantau data sistem dan aktivitas pegawai"
        />

        <div className="space-y-4 w-full max-w-7xl mx-auto">
          {/* BAR FILTER */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative bg-white rounded-xs border border-gray-200 px-3 py-1.5 shadow-sm flex items-center gap-2 w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Pegawai"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] text-gray-700 font-medium bg-transparent outline-none w-full"
                />
              </div>
              <FilterDropdown
                label="Role"
                selectedOption={selectedRole}
                options={[
                  "Kasir",
                  "Dapur",
                  "Pelayan",
                  "Kiosk Sistem",
                  "Admin Role",
                ]}
                onSelect={(val) => {
                  setSelectedRole(val);
                  setCurrentPage(1);
                }}
              />
              <FilterDropdown
                label="Status"
                selectedOption={selectedStatus}
                options={["Aktif", "Nonaktif"]}
                onSelect={(val) => {
                  setSelectedStatus(val);
                  setCurrentPage(1);
                }}
              />
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="bg-white rounded-xs border border-red-300 px-4 py-1.5 shadow-sm flex items-center gap-2 text-[13px] text-red-500 font-medium cursor-pointer hover:bg-red-50"
                >
                  <X size={14} /> Reset Filter
                </button>
              )}
            </div>
            <button
              onClick={() => navigate("/admin/employee-management/add")}
              className="bg-primary hover:opacity-95 text-white font-bold text-[13px] px-4 py-2 rounded-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} /> Tambah Pegawai
            </button>
          </div>

          {/* ========== SORTING MOBILE ========== */}
          <div className="md:hidden">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-500 block mb-2">
                Urutkan berdasarkan:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "nama", label: "Nama" },
                  { key: "email", label: "Email" },
                  { key: "role", label: "Role" },
                  { key: "status", label: "Status" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSort(option.key as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      currentSortKey === option.key
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                    {currentSortKey === option.key && (
                      <span className="ml-1">{isAscending ? "↑" : "↓"}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ========== DESKTOP TABLE ========== */}
          <div className="hidden md:block bg-white rounded-xs shadow-sm border border-gray-150">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-200">
                <thead>
                  <tr className="bg-primary text-[12px] font-bold text-white uppercase">
                    <th className="py-3.5 text-center w-16 rounded-tl-xs">NO</th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("nama")}>
                      <div className="flex items-center gap-1.5">Nama {renderSortIcon("nama")}</div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("email")}>
                      <div className="flex items-center gap-1.5">Email {renderSortIcon("email")}</div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("noTelepon")}>
                      <div className="flex items-center gap-1.5">No Telepon {renderSortIcon("noTelepon")}</div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => handleSort("role")}>
                      <div className="flex items-center gap-1.5">Role {renderSortIcon("role")}</div>
                    </th>
                    <th className="py-3.5 text-center w-28 cursor-pointer select-none group" onClick={() => handleSort("status")}>
                      <div className="flex items-center justify-center gap-1.5">Status {renderSortIcon("status")}</div>
                    </th>
                    <th className="py-3.5 text-center w-24 rounded-tr-xs">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 bg-white font-medium text-[13px]">
                  {currentItems.length > 0 ? (
                    currentItems.map((pegawai, index) => (
                      <tr key={pegawai.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 text-center text-gray-400">{indexOfFirstItem + index + 1}</td>
                        <td className="py-3 px-4 text-gray-800">{pegawai.nama}</td>
                        <td className="py-3 px-4 text-gray-500 break-all">{pegawai.email}</td>
                        <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{pegawai.noTelepon}</td>
                        <td className="py-3 px-4 text-gray-800">{pegawai.role}</td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(pegawai.id)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${pegawai.status ? "bg-green-400" : "bg-gray-300"}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${pegawai.status ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </td>
                        <td className="py-3 text-center relative">
                          <ActionMenu
                            onDetail={() => navigate(`/admin/employee-management/detail/${pegawai.id}`)}
                            onEditProfil={() => {
                              console.log("Mengirim data edit:", pegawai);
                              navigate(`/admin/employee-management/edit/${pegawai.id}`, {
                                state: { pegawaiData: pegawai },
                              });
                            }}
                            onUbahPassword={() => navigate(`/admin/employee-management/change-password/${pegawai.id}`)}
                            onHapus={() => {
                              setPegawaiTargetDelete(pegawai);
                              setIsDeleteOpen(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-100">
                      <td colSpan={7} className="py-8 text-center text-gray-400">Tidak ada data pegawai.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION DESKTOP */}
            <div className="flex items-center justify-between py-3 px-4 border-t border-gray-100 bg-white rounded-br-xs rounded-bl-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                  <span>Tampilkan</span>
                  <div className="relative z-50">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="border border-gray-300 rounded px-3 py-1.5 flex items-center gap-2 bg-white text-gray-700 min-w-22.5 justify-between"
                    >
                      {itemsPerPage} Data{" "}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-24 bg-white border rounded shadow-lg z-9999">
                        {[10, 15, 20, 25].map((n) => (
                          <button
                            key={n}
                            onClick={() => handleItemsPerPageChange(n)}
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-[12px]"
                          >
                            {n} Data
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[12px] text-gray-500">
                  Menampilkan {startCount}-{endCount} dari {sortedPegawai.length} data
                </span>
              </div>
              <div className="flex items-center gap-1 text-[12px] font-bold">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30"
                >
                  <ChevronLeft size={12} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded border ${currentPage === pageNum ? "bg-white text-primary border-primary" : "border-gray-200"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-7 h-7 border flex items-center justify-center rounded disabled:opacity-30"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* ========== MOBILE CARD VIEW ========== */}
          <div className="md:hidden space-y-3 pb-32">
            {currentItems.map((pegawai, index) => (
              <div key={pegawai.id} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-400 font-medium">#{startCount + index}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${pegawai.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {pegawai.status ? "Aktif" : "Nonaktif"}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(pegawai.id)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pegawai.status ? "bg-green-400" : "bg-gray-300"}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${pegawai.status ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-800 text-base">{pegawai.nama}</p>
                <p className="text-xs text-gray-500 mt-1 break-all">{pegawai.email}</p>
                <p className="text-xs text-gray-500 mt-1">{pegawai.noTelepon}</p>
                <p className="text-xs text-gray-600 mt-1">{pegawai.role}</p>

                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => navigate(`/admin/employee-management/detail/${pegawai.id}`)} className="py-1.5 text-center text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                      Detail
                    </button>
                    <button onClick={() => navigate(`/admin/employee-management/edit/${pegawai.id}`, { state: { pegawaiData: pegawai } })} className="py-1.5 text-center text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                      Edit Profil
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => navigate(`/admin/employee-management/change-password/${pegawai.id}`)} className="py-1.5 text-center text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                      Ubah Sandi
                    </button>
                    <button onClick={() => { setPegawaiTargetDelete(pegawai); setIsDeleteOpen(true); }} className="py-1.5 text-center text-xs font-medium bg-red-50 text-red-600 rounded-md">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {sortedPegawai.length === 0 && (
              <div className="text-center py-8 text-gray-400">Tidak ada data pegawai.</div>
            )}

            {/* PAGINATION MOBILE */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 pt-4 pb-8 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                    <span>Tampilkan</span>
                    <div className="relative z-50">
                      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 bg-white text-gray-700 text-[11px] min-w-17.5 justify-between">
                        {itemsPerPage} Data
                        <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute left-0 bottom-full mb-1 w-20 bg-white border rounded-md shadow-lg z-9999">
                          {[10, 15, 20].map((n) => (
                            <button
                              key={n}
                              onClick={() => handleItemsPerPageChange(n)}
                              className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-[11px]"
                            >
                              {n} Data
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">{startCount}-{endCount} dari {sortedPegawai.length}</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center disabled:opacity-30">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[11px] font-medium text-gray-600 px-2">{currentPage} / {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center disabled:opacity-30">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

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
              <div className="bg-green-100 p-1 rounded-full text-green-600">
                <CheckCircle2 size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[13.5px] font-bold text-gray-800">
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