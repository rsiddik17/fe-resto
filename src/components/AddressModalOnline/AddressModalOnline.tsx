import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { addressAPI } from "../../api/address.api";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

interface Address {
  id: string;
  address_name: string;
  is_core_address: boolean;
}

const AddressModalOnline = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
}: AddressModalProps) => {
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getMyAddresses();
      console.log("Address API response:", response);
      const data = response.data || response;
      setAddressList(data);
    } catch (error) {
      console.error("Gagal ambil alamat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/10 px-4 backdrop-blur-[1px]">
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
          <h3 className="text-black text-lg mb-6">Ganti Alamat Pengiriman</h3>

          {loading ? (
            <div className="py-10 text-center text-gray-500">Memuat alamat...</div>
          ) : addressList.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Belum ada alamat. Silakan tambah alamat di halaman profil.
            </div>
          ) : (
            <div className="space-y-3 max-h-75 overflow-y-auto pr-1">
              {addressList.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => onSelect(addr.id)}
                  className={`cursor-pointer border rounded-xs p-5 transition-all grid grid-cols-[1fr_auto] items-start gap-4 ${
                    selectedId === addr.id
                      ? "bg-[#F3E8F3] border-primary/20"
                      : "bg-[#F3F4F6] border-transparent"
                  }`}
                >
                  <div className="flex flex-col">
                    {addr.is_core_address && (
                      <div className="mb-2">
                        <span className="bg-primary/10 text-primary text-[10px] px-3 py-0.5 rounded-full border border-primary/30 font-bold uppercase">
                          Utama
                        </span>
                      </div>
                    )}
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                      {addr.address_name}
                    </p>
                  </div>

                  <div
                    className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedId === addr.id
                        ? "border-primary bg-primary shadow-md"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {selectedId === addr.id && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-6 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#FFFFFF] hover:bg-black/5 text-black border-[1.5px] border-gray/50 rounded-xl text-sm"
            >
              Batal
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-primary text-white rounded-xl text-sm"
            >
              Pilih Alamat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModalOnline;