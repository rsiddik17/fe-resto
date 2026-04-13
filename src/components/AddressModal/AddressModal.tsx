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
  name: string;
  phone: string;
  detail: string;
  isMain: boolean;
}

const AddressModal = ({ isOpen, onClose, selectedId, onSelect }: AddressModalProps) => {
  const [view, setView] = useState<"list" | "add">("list");

  // --- STATE DAFTAR ALAMAT DENGAN LOCALSTORAGE ---
  const [addressList, setAddressList] = useState<Address[]>(() => {
    const saved = localStorage.getItem("user_addresses");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        name: "Wawan Hermawan",
        phone: "+62 114 0986 7821",
        detail: "Jl. Sholeh Iskandar No.Km.02, RT.01/RW.010, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16162",
        isMain: true,
      },
      {
        id: "2",
        name: "Wawan Hermawan",
        phone: "+62 114 0986 7821",
        detail: "Gedung Sentra Sudirman Lt.12, Jl. Jenderal Sudirman, Jakarta Selatan 12190",
        isMain: false,
      }
    ];
  });

  // Simpan ke LocalStorage tiap kali list berubah
  useEffect(() => {
    localStorage.setItem("user_addresses", JSON.stringify(addressList));
  }, [addressList]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    zipCode: "",
    detail: "",
    isMain: false
  });

  const handleSave = () => {
    if (formData.name && formData.detail) {
      const newEntry = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        detail: `${formData.detail}, ${formData.city} ${formData.zipCode}`,
        isMain: formData.isMain
      };
      setAddressList([...addressList, newEntry]);
      setView("list");
      setFormData({ name: "", phone: "", city: "", zipCode: "", detail: "", isMain: false });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]">
      <div className="bg-white w-full max-w-md rounded-xs overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black z-10">
          <div className="bg-gray-100 rounded-full p-1"><X size={16} /></div>
        </button>

        <div className="p-8">
          {view === "list" ? (
            <div className="space-y-5">
              <h3 className="text-black text-lg mb-6 ">Ganti Alamat Pengiriman</h3>
              <div className="space-y-3 max-h-75 overflow-y-auto pr-1">
                {addressList.map((addr) => (
                  <div 
                    key={addr.id} 
                    onClick={() => onSelect(addr.id)} 
                    className={`cursor-pointer border rounded-xs p-4 transition-all ${selectedId === addr.id ? 'bg-[#F3E8F3] border-primary/20' : 'bg-[#F3F4F6] border-transparent'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black text-sm">{addr.name}</span>
                          {addr.isMain && <span className="bg-primary/10 text-primary text-[10px] px-3 py-0.5 rounded-full border border-primary/30">Utama</span>}
                        </div>
                        <p className="text-[11px] text-black font-semibold">{addr.phone}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${selectedId === addr.id ? 'border-primary' : 'border-gray-300'} flex items-center justify-center bg-white`}>
                        {selectedId === addr.id && <div className="w-3.5 3.5 bg-primary rounded-full "></div>}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-2 pr-6">{addr.detail}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setView("add")} className="w-full flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary/5 transition-all mt-4">
                <Plus size={18} /> Tambah Alamat
              </button>
              <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="flex-1 py-3 bg-[#E5E7EB] text-gray-600 font-bold rounded-xl text-sm transition-all active:scale-95">Batal</button>
                <button onClick={onClose} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md shadow-primary/20 transition-all active:scale-95">Pilih Alamat</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg mb-6 ">Tambah Alamat Pengiriman</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] text-black ml-1">Nama Penerima</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Mira" className="w-full bg-[#EDEDED] border-none rounded-xs px-4 py-3 text-[12px] outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] text-black ml-1">No Telepon</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+62 xxx xxxx xxxx" className="w-full bg-[#EDEDED] border-none rounded-xs px-4 py-3 text-[12px] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] text-black ml-1">Kota</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Contoh: Jakarta" className="w-full bg-[#EDEDED] border-none rounded-xs px-4 py-3 text-[12px] outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] text-black ml-1">Kode Pos</label>
                  <input type="text" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} placeholder="1xxxx" className="w-full bg-[#EDEDED] border-none rounded-xs px-4 py-3 text-[12px] outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-black ml-1">Alamat Lengkap</label>
                <textarea rows={4} value={formData.detail} onChange={(e) => setFormData({...formData, detail: e.target.value})} placeholder="Nama jalan, nomor rumah, atau gedung" className="w-full bg-[#EDEDED] border-none rounded-xs px-4 py-3 text-[12px] outline-none resize-none"></textarea>
              </div>
              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input type="checkbox" checked={formData.isMain} onChange={(e) => setFormData({...formData, isMain: e.target.checked})} className="w-5 h-5 accent-primary rounded-md" />
                <span className="text-[12px] text-black font-semibold">Jadikan Alamat Utama</span>
              </label>
              <div className="flex gap-3 pt-8">
                <button onClick={() => setView("list")} className="flex-1 py-3 bg-[#E5E7EB] text-gray-600 font-bold rounded-xl text-sm active:scale-95">Batal</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md shadow-primary/20 active:scale-95">Simpan</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressModal;