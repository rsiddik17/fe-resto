import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import SortIcon from "../../components/Icon/SortIcon";
import { customerAPI } from "../../api/customer.api";

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
  const [currentSortKey, setCurrentSortKey] = useState<keyof Pelanggan>("nama");
  const [isAscending, setIsAscending] = useState<boolean>(true);

 useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await customerAPI.getAllCustomers();
        
        // Pastikan response.data ada isinya
        if (response && response.data) {
          const dataMapping = response.data.map((c: any) => ({
            id: c.id,
            nama: c.fullname,
            email: c.email,
            noTelepon: c.phone_number,
            tanggalLahir: "-", // Data belum ada di API
            jenisKelamin: c.gender || "Belum Diatur",
            status: c.is_validated ? "Aktif" : "Non Aktif",
            alamat: "-", // Data belum ada di API
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
    let determineAsc = true;
    if (currentSortKey === key) {
      determineAsc = !isAscending;
    }
    setCurrentSortKey(key);
    setIsAscending(determineAsc);

    const sortedData = [...pelangganList].sort((a, b) => {
      const valA = String(a[key]).toLowerCase();
      const valB = String(b[key]).toLowerCase();
      if (valA < valB) return determineAsc ? -1 : 1;
      if (valA > valB) return determineAsc ? 1 : -1;
      return 0;
    });
    setPelangganList(sortedData);
  };

  const renderSortIcon = (key: keyof Pelanggan) => (
    <div className="inline-block ml-1">
      <SortIcon
        isActiveAsc={currentSortKey === key && isAscending}
        isActiveDesc={currentSortKey === key && !isAscending}
        isInverse={true}
      />
    </div>
  );

  if (loading) return <div>Memuat data...</div>;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6">
        <div className="w-full mx-auto">
          <AdminHeader title="Daftar Pelanggan" subtitle="Pantau data pelanggan" />
        </div>

        {/* MOBILE SORTING */}
        <div className="md:hidden mt-4 mb-2">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <span className="text-xs font-medium text-gray-500 block mb-2">Urutkan berdasarkan:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "nama", label: "Nama" },
                { key: "email", label: "Email" },
                { key: "status", label: "Status" },
                { key: "noTelepon", label: "No Telepon" },
                { key: "tanggalLahir", label: "Tanggal Lahir" },
                { key: "jenisKelamin", label: "Jenis Kelamin" },
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
                  {currentSortKey === option.key && <span className="ml-1">{isAscending ? "↑" : "↓"}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block w-full mx-auto mt-6">
          <div className="bg-white rounded-xs shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="py-3 px-4 text-center w-12 text-xs font-semibold">NO</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold cursor-pointer hover:bg-primary/80 transition-colors min-w-35" onClick={() => handleSort("nama")}>
                      <div className="flex items-center gap-1">NAMA {renderSortIcon("nama")}</div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold cursor-pointer hover:bg-primary/80 transition-colors min-w-45" onClick={() => handleSort("email")}>
                      <div className="flex items-center gap-1">EMAIL {renderSortIcon("email")}</div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap" onClick={() => handleSort("noTelepon")}>
                      <div className="flex items-center gap-1">NO TELEPON {renderSortIcon("noTelepon")}</div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap" onClick={() => handleSort("tanggalLahir")}>
                      <div className="flex items-center gap-1">TANGGAL LAHIR {renderSortIcon("tanggalLahir")}</div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap" onClick={() => handleSort("jenisKelamin")}>
                      <div className="flex items-center gap-1">JENIS KELAMIN {renderSortIcon("jenisKelamin")}</div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold cursor-pointer hover:bg-primary/80 transition-colors w-24" onClick={() => handleSort("status")}>
                      <div className="flex items-center gap-1">STATUS {renderSortIcon("status")}</div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold cursor-pointer hover:bg-primary/80 transition-colors min-w-45" onClick={() => handleSort("alamat")}>
                      <div className="flex items-center gap-1">ALAMAT {renderSortIcon("alamat")}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pelangganList.map((pelanggan, index) => (
                    <tr key={pelanggan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-4 text-center text-gray-500 text-xs">{index + 1}</td>
                      <td className="py-2.5 px-4 text-black-800 font-medium text-xs whitespace-nowrap">{pelanggan.nama}</td>
                      <td className="py-2.5 px-4 text-black-500 text-xs truncate max-w-45">{pelanggan.email}</td>
                      <td className="py-2.5 px-4 text-black-500 text-xs whitespace-nowrap">{pelanggan.noTelepon}</td>
                      <td className="py-2.5 px-4 text-black-500 text-xs whitespace-nowrap">{pelanggan.tanggalLahir}</td>
                      <td className="py-2.5 px-4 text-black-500 text-xs whitespace-nowrap">{pelanggan.jenisKelamin}</td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[12px] font-medium whitespace-nowrap ${
                          pelanggan.status === "Aktif" ? " text-balck-700 font-normal"  : " text-red-black font-normal"
                        }`}>
                          {pelanggan.status === "Non Aktif" ? "Tidak Aktif" : pelanggan.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-black-500 text-xs truncate max-w-45">{pelanggan.alamat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden w-full mx-auto mt-4">
          <div className="space-y-3 pb-20">
            {pelangganList.map((pelanggan, index) => (
              <div key={pelanggan.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-black-400 font-medium">#{index + 1}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    pelanggan.status === "Aktif" ? "text-balck-700 font-normal" : "text-balck-700 font-normal"
                  }`}>
                    {pelanggan.status === "Non Aktif" ? "Tidak Aktif" : pelanggan.status}
                  </span>
                </div>
                <p className="font-semibold text-black-800 text-sm">{pelanggan.nama}</p>
                <p className="text-xs text-black-500 mt-0.5 break-all">{pelanggan.email}</p>
                <p className="text-xs text-black-500 mt-1">{pelanggan.noTelepon}</p>
                <div className="mt-3 pt-2 border-t border-gray-100 grid grid-cols-2 gap-1 text-[10px]">
                  <span className="text-black-400">Lahir:</span>
                  <span className="text-black-600">{pelanggan.tanggalLahir}</span>
                  <span className="text-black-400">JK:</span>
                  <span className="text-black-600">{pelanggan.jenisKelamin}</span>
                  <span className="text-black-400">Alamat:</span>
                  <span className="text-black-600 truncate">{pelanggan.alamat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DaftarPelangganPage;