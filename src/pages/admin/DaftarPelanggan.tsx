import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";

interface Pelanggan {
  id: number;
  nama: string;
  email: string;
  noTelepon: string;
  tanggalLahir: string;
  jenisKelamin: string;
  status: string;
  alamat: string;
}

const DATA_PELANGGAN_AWAL: Pelanggan[] = [
  {
    id: 1,
    nama: "Wawan Hermawan",
    email: "wawanhrmwn@gmail.com",
    noTelepon: "0814 0986 7821",
    tanggalLahir: "03/04/2002",
    jenisKelamin: "Laki-Laki",
    status: "Aktif",
    alamat: "Kota Bogor, Jawa Barat",
  },
  {
    id: 2,
    nama: "Mayla Zunaina",
    email: "maylaznn@gmail.com",
    noTelepon: "0812 9165 8921",
    tanggalLahir: "01/02/2005",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    alamat: "Kota Bogor, Jawa Barat",
  },
  {
    id: 3,
    nama: "Martha Lena",
    email: "marthalena@gmail.com",
    noTelepon: "0813 0906 5615",
    tanggalLahir: "03/04/2002",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    alamat: "Kota Bandung, Jawa Barat",
  },
  {
    id: 4,
    nama: "Dea Alisa",
    email: "deaalisa@gmail.com",
    noTelepon: "0814 9284 8767",
    tanggalLahir: "12/04/2003",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    alamat: "Kota Bekasi, Jawa Barat",
  },
  {
    id: 5,
    nama: "Amalia Nur",
    email: "nurlia@gmail.com",
    noTelepon: "0812 6765 1786",
    tanggalLahir: "13/05/2002",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    alamat: "Kota Bogor, Jawa Barat",
  },
  {
    id: 6,
    nama: "Istiazah",
    email: "zahtia@gmail.com",
    noTelepon: "0877 2354 7817",
    tanggalLahir: "11/04/2003",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    alamat: "Kota Depok, Jawa Barat",
  },
  {
    id: 7,
    nama: "Reza Tama",
    email: "tama124@gmail.com",
    noTelepon: "0813 0696 7020",
    tanggalLahir: "10/06/2006",
    jenisKelamin: "Laki-Laki",
    status: "Non Aktif",
    alamat: "Kota Cimahi, Jawa Barat",
  },
  {
    id: 8,
    nama: "Aldi Muhamad",
    email: "muhamad1@gmail.com",
    noTelepon: "0814 1254 7165",
    tanggalLahir: "25/04/2002",
    jenisKelamin: "Laki-Laki",
    status: "Aktif",
    alamat: "Kota Bogor, Jawa Barat",
  },
  {
    id: 9,
    nama: "Rehan Putra",
    email: "putrarhn@gmail.com",
    noTelepon: "0831 8645 7854",
    tanggalLahir: "27/05/2007",
    jenisKelamin: "Laki-Laki",
    status: "Non Aktif",
    alamat: "Kota Bogor, Jawa Barat",
  },
  {
    id: 10,
    nama: "Galang Putra",
    email: "galang23@gmail.com",
    noTelepon: "0814 4321 7865",
    tanggalLahir: "18/09/2005",
    jenisKelamin: "Laki-Laki",
    status: "Aktif",
    alamat: "Kota Bekasi, Jawa Barat",
  },
];

const DaftarPelangganPage = () => {
  const [pelangganList, setPelangganList] =
    useState<Pelanggan[]>(DATA_PELANGGAN_AWAL);
  const [currentSortKey, setCurrentSortKey] = useState<keyof Pelanggan>("nama");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const handleSort = (key: keyof Pelanggan) => {
    if (key === "id") return;
    let determineAsc = true;
    if (currentSortKey === key) {
      determineAsc = !isAscending;
    } else {
      setCurrentSortKey(key);
    }
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6">
        <div className="w-full mx-auto">
          <AdminHeader
            title="Daftar Pelanggan"
            subtitle="Pantau data pelanggan"
          />
        </div>

        <div className="w-full mx-auto mt-6">
          <div className="bg-white rounded-xs shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="py-3 px-4 text-center w-14 text-xs font-semibold">
                      NO
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold cursor-pointer "
                      onClick={() => handleSort("nama")}
                    >
                      <div className="flex items-center gap-1">
                        NAMA
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`${currentSortKey === "nama" && isAscending ? "text-white" : "text-white/40"}`}
                          />
                          <ChevronDown
                            size={10}
                            className={`${currentSortKey === "nama" && !isAscending ? "text-white" : "text-white/40"}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold cursor-pointer "
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-1">
                        EMAIL
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`${currentSortKey === "email" && isAscending ? "text-white" : "text-white/40"}`}
                          />
                          <ChevronDown
                            size={10}
                            className={`${currentSortKey === "email" && !isAscending ? "text-white" : "text-white/40"}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold cursor-pointer "
                      onClick={() => handleSort("noTelepon")}
                    >
                      <div className="flex items-center gap-1">
                        NO TELEPON
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`${currentSortKey === "noTelepon" && isAscending ? "text-white" : "text-white/40"}`}
                          />
                          <ChevronDown
                            size={10}
                            className={`${currentSortKey === "noTelepon" && !isAscending ? "text-white" : "text-white/40"}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold cursor-pointer "
                      onClick={() => handleSort("tanggalLahir")}
                    >
                      <div className="flex items-center gap-1">
                        TANGGAL LAHIR
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`${currentSortKey === "tanggalLahir" && isAscending ? "text-white" : "text-white/40"}`}
                          />
                          <ChevronDown
                            size={10}
                            className={`${currentSortKey === "tanggalLahir" && !isAscending ? "text-white" : "text-white/40"}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold cursor-pointer "
                      onClick={() => handleSort("jenisKelamin")}
                    >
                      <div className="flex items-center gap-1">
                        JENIS KELAMIN
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`${currentSortKey === "jenisKelamin" && isAscending ? "text-white" : "text-white/40"}`}
                          />
                          <ChevronDown
                            size={10}
                            className={`${currentSortKey === "jenisKelamin" && !isAscending ? "text-white" : "text-white/40"}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold cursor-pointer "
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        STATUS
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`${currentSortKey === "status" && isAscending ? "text-white" : "text-white/40"}`}
                          />
                          <ChevronDown
                            size={10}
                            className={`${currentSortKey === "status" && !isAscending ? "text-white" : "text-white/40"}`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold cursor-pointer "
                      onClick={() => handleSort("alamat")}
                    >
                      <div className="flex items-center gap-1">
                        ALAMAT
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`${currentSortKey === "alamat" && isAscending ? "text-white" : "text-white/40"}`}
                          />
                          <ChevronDown
                            size={10}
                            className={`${currentSortKey === "alamat" && !isAscending ? "text-white" : "text-white/40"}`}
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pelangganList.map((pelanggan, index) => (
                    <tr
                      key={pelanggan.id}
                      className="border-b border-gray-100  transition-colors"
                    >
                      <td className="py-2.5 px-4 text-center text-black font-normal">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-4 text-black font-normal">
                        {pelanggan.nama}
                      </td>
                      <td className="py-2.5 px-4 text-black font-normal">
                        {pelanggan.email}
                      </td>
                      <td className="py-2.5 px-4 text-black font-normal">
                        {pelanggan.noTelepon}
                      </td>
                      <td className="py-2.5 px-4 text-black font-normal">
                        {pelanggan.tanggalLahir}
                      </td>
                      <td className="py-2.5 px-4 text-black font-normal">
                        {pelanggan.jenisKelamin}
                      </td>
                      <td className="py-2.5 px-4 text-black font-normal">
                        {pelanggan.status === "Non Aktif"
                          ? "Tidak Aktif"
                          : pelanggan.status}
                      </td>
                      <td className="py-2.5 px-4 text-gray-600 text-xs">
                        {pelanggan.alamat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DaftarPelangganPage;
