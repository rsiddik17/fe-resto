import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import SortIcon from "../../components/Icon/SortIcon";
import { customerAPI } from "../../api/customer.api";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface Pelanggan {
  id: string;
  nama: string;
  email: string;
  noTelepon: string;
  tanggalLahir: string;
  jenisKelamin: string;
  status: string;
  alamat: string;
}

const DaftarPelangganPage = () => {
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sorting
  const [currentSortKey, setCurrentSortKey] = useState<keyof Pelanggan>("nama");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await customerAPI.getAllCustomers();

        if (response && response.data) {
          const dataMapping = response.data.map((c: any) => ({
            id: c.id,
            nama: c.fullname,
            email: c.email,
            noTelepon: c.phone_number,
            tanggalLahir: c.date_of_birth
              ? new Date(c.date_of_birth).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "-",
            jenisKelamin:
              c.gender === "MALE"
                ? "Laki-laki"
                : c.gender === "FEMALE"
                  ? "Perempuan"
                  : "Belum Diatur",
            status: c.is_validated ? "Aktif" : "Tidak Aktif",
            alamat: c.address_name || "-",
          }));

          setPelangganList(dataMapping);
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key: keyof Pelanggan) => {
    if (key === "id") return;
    if (currentSortKey === key) {
      setIsAscending(!isAscending);
    } else {
      setCurrentSortKey(key);
      setIsAscending(true);
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (key: keyof Pelanggan) => (
    <div className="inline-block ml-0.5">
      <SortIcon
        isActiveAsc={currentSortKey === key && isAscending}
        isActiveDesc={currentSortKey === key && !isAscending}
        isInverse={true}
      />
    </div>
  );

  // Sorting data
  const sortedPelanggan = [...pelangganList].sort((a, b) => {
    const valA = String(a[currentSortKey]).toLowerCase();
    const valB = String(b[currentSortKey]).toLowerCase();
    if (valA < valB) return isAscending ? -1 : 1;
    if (valA > valB) return isAscending ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPelanggan.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPelanggan.slice(indexOfFirstItem, indexOfLastItem);
  const startCount = indexOfFirstItem + 1;
  const endCount = Math.min(indexOfLastItem, sortedPelanggan.length);

  // ✅ FIX: Sinkronisasi currentPage agar tidak melebihi totalPages
  useEffect(() => {
    const maxPage = Math.ceil(sortedPelanggan.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [sortedPelanggan.length, itemsPerPage, currentPage]);

  // ✅ FIX: Reset ke halaman 1 saat itemsPerPage berubah
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
        <AdminSidebar onLogout={() => console.log("Admin Logout")} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pelanggan...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto">
          <AdminHeader
            title="Daftar Pelanggan"
            subtitle="Pantau data pelanggan"
          />

          {/* ========== SORTING MOBILE ========== */}
          <div className="md:hidden mt-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <span className="text-xs font-bold text-gray-500 block mb-2">
                Urutkan berdasarkan:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "nama", label: "Nama" },
                  { key: "email", label: "Email" },
                  { key: "status", label: "Status" },
                  { key: "noTelepon", label: "No Telp" },
                  { key: "tanggalLahir", label: "Tgl Lahir" },
                  { key: "jenisKelamin", label: "JK" },
                  { key: "alamat", label: "Alamat" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSort(option.key as keyof Pelanggan)}
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
          <div className="hidden md:block bg-white rounded-xs shadow-sm border border-gray-150 mt-4">
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left text-[10px]">
                <thead>
                  <tr className="bg-primary font-bold text-white uppercase text-[9px]">
                    <th className="py-2 text-center w-10 rounded-tl-xs">NO</th>
                    <th
                      className="py-2 px-1.5 cursor-pointer select-none group whitespace-nowrap"
                      onClick={() => handleSort("nama")}
                    >
                      <div className="flex items-center gap-0.5">
                        Nama {renderSortIcon("nama")}
                      </div>
                    </th>
                    <th
                      className="py-2 px-1.5 cursor-pointer select-none group whitespace-nowrap"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-0.5">
                        Email {renderSortIcon("email")}
                      </div>
                    </th>
                    <th
                      className="py-2 px-1.5 cursor-pointer select-none group whitespace-nowrap"
                      onClick={() => handleSort("noTelepon")}
                    >
                      <div className="flex items-center gap-0.5">
                        No Telp {renderSortIcon("noTelepon")}
                      </div>
                    </th>
                    <th
                      className="py-2 px-1.5 cursor-pointer select-none group whitespace-nowrap"
                      onClick={() => handleSort("tanggalLahir")}
                    >
                      <div className="flex items-center gap-0.5">
                        Tgl Lahir {renderSortIcon("tanggalLahir")}
                      </div>
                    </th>
                    <th
                      className="py-2 px-1.5 cursor-pointer select-none group whitespace-nowrap"
                      onClick={() => handleSort("jenisKelamin")}
                    >
                      <div className="flex items-center gap-0.5">
                        JK {renderSortIcon("jenisKelamin")}
                      </div>
                    </th>
                    <th
                      className="py-2 px-1.5 cursor-pointer select-none group whitespace-nowrap"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-0.5">
                        Status {renderSortIcon("status")}
                      </div>
                    </th>
                    <th
                      className="py-2 px-1.5 cursor-pointer select-none group whitespace-nowrap rounded-tr-xs"
                      onClick={() => handleSort("alamat")}
                    >
                      <div className="flex items-center gap-0.5">
                        Alamat {renderSortIcon("alamat")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 bg-white font-medium text-[10px]">
                  {currentItems.length > 0 ? (
                    currentItems.map((pelanggan, index) => (
                      <tr
                        key={pelanggan.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 text-center text-gray-400">
                          {startCount + index}
                        </td>
                        <td className="py-2 px-1.5 text-gray-800 whitespace-nowrap">
                          {pelanggan.nama}
                        </td>
                        <td className="py-2 px-1.5 text-gray-500 break-all">
                          {pelanggan.email}
                        </td>
                        <td className="py-2 px-1.5 text-gray-500 whitespace-nowrap">
                          {pelanggan.noTelepon}
                        </td>
                        <td className="py-2 px-1.5 text-gray-500 whitespace-nowrap">
                          {pelanggan.tanggalLahir}
                        </td>
                        <td className="py-2 px-1.5 text-gray-500 whitespace-nowrap">
                          {pelanggan.jenisKelamin}
                        </td>
                        <td className="py-2 px-1.5">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium ${
                              pelanggan.status === "Aktif"
                                ? "text-gray"
                                : "text-gray"
                            }`}
                          >
                            {pelanggan.status === "Tidak Aktif"
                              ? "Nonaktif"
                              : pelanggan.status}
                          </span>
                        </td>
                        <td className="py-2 px-1.5 text-gray-500 break-all">
                          {pelanggan.alamat}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-100">
                      <td
                        colSpan={8}
                        className="py-8 text-center text-gray-400"
                      >
                        Tidak ada data pelanggan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION DESKTOP */}
            <div className="flex items-center justify-between py-2 px-3 border-t border-gray-100 bg-white rounded-br-xs rounded-bl-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <span>Tampilkan</span>
                  <div className="relative z-50">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="border border-gray-300 rounded px-2 py-1 flex items-center gap-1 bg-white text-gray-700 text-[10px] min-w-17.5 justify-between"
                    >
                      {itemsPerPage} Data{" "}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-9999">
                        {[10, 15, 20].map((n) => (
                          <button
                            key={n}
                            onClick={() => handleItemsPerPageChange(n)}
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-[11px] font-medium"
                          >
                            {n} Data
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">
                  Menampilkan {startCount}-{endCount} dari{" "}
                  {sortedPelanggan.length} data
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="w-6 h-6 flex items-center justify-center border rounded disabled:opacity-30"
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
                      className={`w-6 h-6 rounded border ${currentPage === pageNum ? "bg-white text-primary border-primary" : "border-gray-200"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-6 h-6 border flex items-center justify-center rounded disabled:opacity-30"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* ========== MOBILE CARD VIEW ========== */}
          <div className="md:hidden space-y-3 mt-4 pb-32">
            <div className="min-w-187.5">
              <table className="w-full bg-white rounded-xs border border-gray-100">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-2 px-2 text-center text-[10px] rounded-tl-xs">
                      NO
                    </th>
                    <th className="py-2 px-2 text-left text-[10px]">Nama</th>
                    <th className="py-2 px-2 text-left text-[10px]">Email</th>
                    <th className="py-2 px-2 text-left text-[10px]">No Telp</th>
                    <th className="py-2 px-2 text-left text-[10px]">
                      Tgl Lahir
                    </th>
                    <th className="py-2 px-2 text-left text-[10px]">JK</th>
                    <th className="py-2 px-2 text-center text-[10px]">
                      Status
                    </th>
                    <th className="py-2 px-2 text-left text-[10px] rounded-tr-xs">
                      Alamat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pelanggan, index) => (
                    <tr key={pelanggan.id} className="border-b border-gray-100">
                      <td className="py-2 px-2 text-center text-gray-400 text-[10px]">
                        {startCount + index}
                      </td>
                      <td className="py-2 px-2 text-gray-800 text-[10px] whitespace-nowrap">
                        {pelanggan.nama}
                      </td>
                      <td className="py-2 px-2 text-gray-500 text-[10px] break-all">
                        {pelanggan.email}
                      </td>
                      <td className="py-2 px-2 text-gray-500 text-[10px] whitespace-nowrap">
                        {pelanggan.noTelepon}
                      </td>
                      <td className="py-2 px-2 text-gray-500 text-[10px] whitespace-nowrap">
                        {pelanggan.tanggalLahir}
                      </td>
                      <td className="py-2 px-2 text-gray-500 text-[10px] whitespace-nowrap">
                        {pelanggan.jenisKelamin}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[9px] font-medium ${pelanggan.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {pelanggan.status === "Tidak Aktif"
                            ? "Nonaktif"
                            : pelanggan.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-gray-500 text-[10px] break-all">
                        {pelanggan.alamat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedPelanggan.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Tidak ada data pelanggan.
              </div>
            )}

            {/* PAGINATION MOBILE */}
            {totalPages > 1 && (
              <div className="md:hidden flex flex-col gap-2 py-4">
                <div className="text-center text-[10px] text-gray-500">
                  Menampilkan {startCount}-{endCount} dari{" "}
                  {sortedPelanggan.length} data
                </div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30 text-xs"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded border text-xs ${currentPage === pageNum ? "bg-primary text-white border-primary" : "border-gray-200"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-7 h-7 flex items-center justify-center border rounded disabled:opacity-30 text-xs"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DaftarPelangganPage;
