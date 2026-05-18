import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirSandi from "../ConfirAlamat/ConfirAlamat";

const ChangePwProf = ({ onCancel }: { onCancel: () => void }) => {
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. State untuk menampung value teks password
  const [password, setPassword] = useState({ old: "", new: "", confirm: "" });
  
  // 2. State untuk menyimpan pesan error
  const [errors, setErrors] = useState({ old: "", new: "", confirm: "" });

  // 3. Fungsi validasi saat form di-submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { old: "", new: "", confirm: "" };
    let isValid = true;

    // Perbaikan Cek password lama (Wajib diisi & Minimal 8 karakter)
    if (!password.old) {
      newErrors.old = "Kata sandi lama wajib diisi";
      isValid = false;
    } else if (password.old.length < 8) {
      newErrors.old = "Kata sandi lama harus minimal 8 karakter!";
      isValid = false;
    }

    // Cek password baru (minimal 8 karakter)
    if (!password.new) {
      newErrors.new = "Kata sandi baru wajib diisi";
      isValid = false;
    } else if (password.new.length < 8) {
      newErrors.new = "Kata sandi baru minimal harus 8 karakter!";
      isValid = false;
    }

    // Cek konfirmasi password baru
    if (!password.confirm) {
      newErrors.confirm = "Konfirmasi kata sandi wajib diisi";
      isValid = false;
    } else if (password.new !== password.confirm) {
      newErrors.confirm = "Konfirmasi kata sandi tidak cocok!";
      isValid = false;
    }

    setErrors(newErrors);

    // Kalau semua kriteria aman, baru buka modal konfirmasi
    if (isValid) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 text-left font-poppins">
      <h3 className="text-xl font-black text-black mb-8">Ubah Kata Sandi</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {[
          { label: "Kata Sandi Lama", id: "old" as const },
          { label: "Kata Sandi Baru", id: "new" as const },
          { label: "Konfirmasi Kata Sandi Baru", id: "confirm" as const },
        ].map((item) => (
          <div key={item.id} className="space-y-2">
            <label className="text-black font-bold text-sm">
              {item.label}*
            </label>
            <div className="relative">
              <input
                type={showPassword[item.id] ? "text" : "password"}
                placeholder="Min 8 karakter"
                value={password[item.id]}
                onChange={(e) => setPassword({ ...password, [item.id]: e.target.value })}
                // Border otomatis merah kalau field tersebut ada error-nya
                className={`w-full p-4 bg-gray-50 border rounded-sm font-medium outline-none text-sm transition-colors ${
                  errors[item.id] ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => ({ ...p, [item.id]: !p[item.id] }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword[item.id] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Munculkan alert teks merah tepat di bawah field yang error */}
            {errors[item.id] && (
              <p className="text-red-500 text-xs font-bold mt-1 pl-1 animate-in fade-in duration-300">
                {errors[item.id]}
              </p>
            )}
          </div>
        ))}
        
        <div className="flex justify-end gap-4 pt-12">
          <button
            type="button"
            onClick={onCancel}
            className="px-10 py-3 bg-gray-200 text-gray-600 font-bold rounded-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-primary text-white font-bold rounded-xs shadow-lg"
          >
            Simpan
          </button>
        </div>
      </form>

      {/* PERBAIKAN: onConfirm diatur ulang agar tidak memaksa pindah halaman */}
      <ConfirSandi
        isOpen={isModalOpen}
        title="Perbarui Kata Sandi?"
        description="Apakah anda yakin ingin mengubah kata sandi akun anda? Tindakan ini tidak dapat dibatalkan"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false); // 1. Tutup modal konfirmasi
          setPassword({ old: "", new: "", confirm: "" }); // 2. Reset inputan form
          // onCancel() dihapus dari sini agar tab tidak melompat kembali ke edit profil secara otomatis
        }}
      />
    </div>
  );
};

export default ChangePwProf;