import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirSandi from "../ConfirSandi/ConfirSandi"; // Import modal[cite: 5]

const ChangePwProf = ({ onCancel }: { onCancel: () => void }) => {
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <h3 className="text-xl font-black text-black mb-8">Ubah Kata Sandi</h3>
      
      {/* FORM INPUT TETAP ADA DI SINI[cite: 5] */}
      <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="space-y-6">
        {[
          { label: "Kata Sandi Lama", id: "old" as const },
          { label: "Kata Sandi Baru", id: "new" as const },
          { label: "Konfirmasi Kata Sandi Baru", id: "confirm" as const }
        ].map((item) => (
          <div key={item.id} className="space-y-2">
            <label className="text-black font-bold text-sm">{item.label}*</label>
            <div className="relative">
              <input 
                type={showPassword[item.id] ? "text" : "password"} 
                placeholder="Min 8 karakter"
                className="w-full p-4 bg-gray-100 border-none rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/20 text-sm" 
              />
              <button type="button" onClick={() => setShowPassword(p => ({...p, [item.id]: !p[item.id]}))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword[item.id] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-4 pt-12">
          <button type="button" onClick={onCancel} className="px-14 py-3.5 bg-gray-200 text-gray-600 font-bold rounded-xl">Batal</button>
          <button type="submit" className="px-14 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg">Simpan</button>
        </div>
      </form>

      {/* MODAL KONFIRMASI[cite: 5] */}
      <ConfirSandi 
        isOpen={isModalOpen}
        title="Perbarui Kata Sandi?"
        description="Apakah anda yakin ingin mengubah kata sandi akun anda? Tindakan ini tidak dapat dibatalkan"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          onCancel(); // Kembali ke tampilan profil setelah simpan[cite: 5]
        }}
      />
    </div>
  );
};

export default ChangePwProf;