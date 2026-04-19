import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

interface Address {
  id: string;
  detail: string;
  isMain: boolean;
}

const AddressModalOnline = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
}: AddressModalProps) => {
  const [view, setView] = useState<"list" | "add">("list");

  // --- STATE DAFTAR ALAMAT DENGAN LOCALSTORAGE ---
  const [addressList, setAddressList] = useState<Address[]>(() => {
    const saved = localStorage.getItem("user_addresses");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            detail:
              "Jl. Sholeh Iskandar No.Km.02, RT.01/RW.010, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16162",
            isMain: true,
          },
          {
            id: "2",
            detail:
              "Gedung Sentra Sudirman Lt.12, Jl. Jenderal Sudirman, Jakarta Selatan 12190",
            isMain: false,
          },
        ];
  });

  // Simpan ke LocalStorage tiap kali list berubah
  useEffect(() => {
    localStorage.setItem("user_addresses", JSON.stringify(addressList));
  }, [addressList]);

  // Hanya menyimpan detail alamat saja
  const [newAddressDetail, setNewAddressDetail] = useState("");

  const handleSave = () => {
    if (newAddressDetail.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        detail: newAddressDetail,
        isMain: false,
      };
      setAddressList([...addressList, newEntry]);
      setView("list");
      setNewAddressDetail("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/10 px-4 backdrop-blur-[1px]">
      <div className="bg-white w-full max-w-md rounded-xs overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black z-10"
        >
          <div className="bg-gray-100 rounded-full p-1">
            <X size={16} />
          </div>
        </button>

        <div className="p-8">
          {view === "list" ? (
            <div className="space-y-5">
              <h3 className="text-black text-lg mb-6">
                Ganti Alamat Pengiriman
              </h3>
              <div className="space-y-3 max-h-75 overflow-y-auto pr-1">
                {addressList.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => onSelect(addr.id)}
                    // Grid membagi: kiri (alamat) dan kanan (radio button) agar tidak nempel
                    className={`cursor-pointer border rounded-xs p-5 transition-all grid grid-cols-[1fr_auto] items-start gap-4 ${
                      selectedId === addr.id
                        ? "bg-[#F3E8F3] border-primary/20"
                        : "bg-[#F3F4F6] border-transparent"
                    }`}
                  >
                    {/* KOLOM KIRI: Label Utama & Detail Alamat */}
                    <div className="flex flex-col">
                      {addr.isMain && (
                        <div className="mb-2">
                          <span className="bg-primary/10 text-primary text-[10px] px-3 py-0.5 rounded-full border border-primary/30 font-bold uppercase">
                            Utama
                          </span>
                        </div>
                      )}
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                        {addr.detail}
                      </p>
                    </div>

                    {/* KOLOM KANAN: Radio Button sejajar baris pertama teks */}
                    <div
                      className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white mt-1 ${
                        selectedId === addr.id ? "border-primary" : "border-gray-300"
                      }`}
                    >
                      {selectedId === addr.id && (
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setView("add")}
                className="w-full flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 transition-all mt-4"
              >
                <Plus size={18} /> Tambah Alamat
              </button>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#E5E7EB] text-gray-600 font-bold rounded-xl text-sm transition-all active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md shadow-primary/20 transition-all active:scale-95"
                >
                  Pilih Alamat
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg mb-6">Tambah Alamat Pengiriman</h3>

              <div className="space-y-1.5">
                <label className="text-[12px] text-black ml-1 font-bold">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={4}
                  value={newAddressDetail}
                  onChange={(e) => setNewAddressDetail(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, atau gedung"
                  className="w-full bg-[#EDEDED] border-none rounded-xs px-4 py-3 text-[12px] outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-8">
                <button
                  onClick={() => setView("list")}
                  className="flex-1 py-3 bg-[#E5E7EB] text-gray-600 font-bold rounded-xl text-sm active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md shadow-primary/20 active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressModalOnline;