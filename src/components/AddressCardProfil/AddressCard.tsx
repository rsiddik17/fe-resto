import { Edit3, Trash2, MapPin, Home, Building2 } from "lucide-react";

interface AddressCardProps {
  title: string;
  address: string;
  phone: string;
  isPrimary?: boolean;
  onEdit: () => void;
}

const AddressCard = ({ title, address, phone, isPrimary, onEdit }: AddressCardProps) => (
  <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${isPrimary ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 bg-white'}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2 text-left">
        <div className={`p-2 rounded-lg ${isPrimary ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
          {title === 'Rumah' ? <Home size={18} /> : <Building2 size={18} />}
        </div>
        <div>
          <h4 className="font-bold text-black flex items-center gap-2">
            {title}
            {isPrimary && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Utama</span>}
          </h4>
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <Edit3 size={18} />
        </button>
        <button className="p-2 hover:bg-red-50 rounded-full text-red-400 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
    
    <p className="text-sm text-gray-600 leading-relaxed mb-2 text-left">{address}</p>
    <p className="text-xs text-gray-400 font-medium text-left">{phone}</p>

    <button className="mt-4 flex items-center gap-2 text-primary font-bold text-sm group">
      <MapPin size={16} className="group-hover:animate-bounce" />
      Lihat di Peta
    </button>
  </div>
);

export default AddressCard;