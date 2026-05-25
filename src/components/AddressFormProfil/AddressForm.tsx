import { MapPin, X } from "lucide-react";
import { useState } from "react";

interface AddressFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const AddressForm = ({ onCancel, onSave }: AddressFormProps) => {
  const [selectedTag, setSelectedTag] = useState("Rumah");

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 text-left">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-black">Ubah Alamat</h3>
      </div>

      <div className="space-y-6">
        {/* INPUT PENCARIAN & PETA */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-black font-bold text-sm">Cari Alamat / Jalan</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Ketik alamat (Contoh: Gatot Subroto)"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <MapPin className="absolute right-4 top-4 text-gray-400" size={20} />
            </div>
          </div>

          {/* VISUAL PETA (Nanti dipasang Leaflet di sini) */}
          <div className="w-full h-56 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
             <MapPin size={40} className="text-primary group-hover:scale-110 transition-transform mb-2" />
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peta akan muncul di sini</p>
          </div>

          {/* GRID LAT/LONG */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-gray-400 font-bold text-[10px] uppercase ml-1 tracking-widest">Latitude</label>
              <input disabled className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-mono text-gray-400" value="-6.597" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 font-bold text-[10px] uppercase ml-1 tracking-widest">Longitude</label>
              <input disabled className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-mono text-gray-400" value="106.806" />
            </div>
          </div>
        </div>

        {/* TANDA SEBAGAI */}
        <div className="space-y-2">
          <label className="text-black font-bold text-sm ">Tandai Sebagai</label>
          <div className="flex gap-4">
            {['Rumah', 'Kantor'].map((tag) => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`flex-1 py-3.5 rounded-full font-bold transition-all border-2 ${
                  selectedTag === tag 
                  ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                  : 'border-gray-100 text-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <input type="checkbox" className="w-5 h-5 accent-primary rounded-md cursor-pointer" />
          <span className="font-bold text-sm text-black">Jadikan alamat utama</span>
        </div>

        {/* BUTTON ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button onClick={onSave} className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
            Simpan Alamat
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;