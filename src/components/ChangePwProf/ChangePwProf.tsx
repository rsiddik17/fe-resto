import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirSandi from "../ConfirmationModal/ConfirmationModal";

const ChangePwProf = ({ onCancel }: { onCancel: () => void }) => {
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
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
      newErrors.new = "Kata sandi baru harus minimal 8 karakter!";
      isValid = false;
    }

    // Cek konfirmasi password (wajib sama dengan password baru)
    if (!password.confirm) {
      newErrors.confirm = "Konfirmasi kata sandi wajib diisi";
      isValid = false;
    } else if (password.new !== password.confirm) {
      newErrors.confirm = "Konfirmasi kata sandi tidak cocok dengan kata sandi baru!";
      isValid = false;
    }

    setErrors(newErrors);

    // Jika semua validasi lolos, munculkan modal konfirmasi
    if (isValid) {
      setIsModalOpen(true);
    }
  };

  // Array konfigurasi field agar mapping code bersih
  const fields = [
    { id: "old" as const, label: "Kata Sandi Lama", placeholder: "Masukkan kata sandi lama" },
    { id: "new" as const, label: "Kata Sandi Baru", placeholder: "Masukkan kata sandi baru" },
    { id: "confirm" as const, label: "Konfirmasi Kata Sandi Baru", placeholder: "Masukkan kembali kata sandi baru" },
  ];

  return (
    <div className="w-full font-poppins text-left">
      {/* Judul Tab "Ubah Kata Sandi" agar persis seperti di screenshot desain kamu */}
      <h3 className="text-xl font-black text-black mb-8">Ubah Kata Sandi</h3>

      {/* FORM di-set w-full penuh agar container tombol di bawah bisa rata kanan mentok */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        
        {/* KELOMPOK INPUT: Di sini kita kunci max-w-xl agar field-nya tidak melar ke kanan */}
        <div className="space-y-6 max-w-xl">
          {fields.map((item) => (
            <div key={item.id} className="space-y-2 flex flex-col">
              <label className="text-black font-bold text-[16px]">
                {item.label}*
              </label>
              <div className="relative">
                <input
                  type={showPassword[item.id] ? "text" : "password"}
                  placeholder={item.placeholder}
                  value={password[item.id]}
                  onChange={(e) => {
                    setPassword((p) => ({ ...p, [item.id]: e.target.value }));
                    if (errors[item.id]) {
                      setErrors((err) => ({ ...err, [item.id]: "" }));
                    }
                  }}
                  className={`w-full p-4 bg-gray-50 border rounded-xs font-medium outline-none text-sm pr-12 transition-colors ${
                    errors[item.id] ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-primary/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => ({ ...p, [item.id]: !p[item.id] }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword[item.id] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors[item.id] && (
                <p className="text-red-500 text-xs font-bold mt-1 pl-1 animate-in fade-in duration-300">
                  {errors[item.id]}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {/* CONTAINER TOMBOL: Bebas dari max-w-xl, menggunakan w-full & justify-end 
            Sekarang posisinya otomatis bergeser rata kanan mengisi ruang kosong seperti desain!
        */}
        <div className="w-full flex justify-end gap-4 pt-12">
          <button
            type="button"
            onClick={onCancel}
            className="px-10 py-3 bg-gray-200 text-gray-600 font-bold rounded-xs active:scale-95 transition-transform text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-primary text-white font-bold rounded-xs shadow-lg active:scale-95 transition-all text-sm"
          >
            Simpan
          </button>
        </div>
      </form>

      {/* Modal konfirmasi */}
      <ConfirSandi
        isOpen={isModalOpen}
        title="Perbarui Kata Sandi?"
        description="Apakah anda yakin ingin mengubah kata sandi? Tindakan ini tidak dapat dibatalkan"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          setPassword({ old: "", new: "", confirm: "" });
          onCancel(); 
        }}
      />
    </div>
  );
};

export default ChangePwProf;
