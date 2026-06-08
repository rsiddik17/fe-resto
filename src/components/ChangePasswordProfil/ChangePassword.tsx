import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const ChangePasswordForm = ({ onCancel }: { onCancel: () => void }) => {
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });

  const handleTogglePassword = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {[
        { label: "Kata Sandi Lama", id: "old" as const },
        { label: "Kata Sandi Baru", id: "new" as const },
        { label: "Konfirmasi Kata Sandi", id: "confirm" as const },
      ].map((item) => (
        <div key={item.id} className="space-y-1">
          <label className="text-xs font-black text-gray-400 uppercase ml-1">{item.label}</label>
          <div className="relative flex items-center ring-2 ring-primary/5 rounded-2xl">
            <div className="absolute left-4 text-primary">
              <Lock size={20} />
            </div>
            <input
              type={showPassword[item.id] ? "text" : "password"}
              placeholder={`Masukkan ${item.label.toLowerCase()}`}
              className="w-full pl-12 pr-12 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-primary outline-none transition-all"
            />
            <button 
              type="button"
              onClick={() => handleTogglePassword(item.id)}
              className="absolute right-4 text-gray-400 hover:text-primary transition-colors"
            >
              {showPassword[item.id] ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      ))}

      <div className="pt-4 space-y-3">
        <button className="w-full bg-primary text-secondary py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
          SIMPAN KATA SANDI
        </button>
        <button 
          onClick={onCancel}
          className="w-full text-gray-400 py-2 font-bold hover:text-red-500 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;