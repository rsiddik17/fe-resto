import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ConfirSandi from "../ConfirmationModal/ConfirmationModal";
import { customerAPI } from "../../api/onlinecustomer.api";

const ChangePwProf = ({ onCancel }: { onCancel: () => void }) => {
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState({ old: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({ old: "", new: "", confirm: "" });

  const [localToast, setLocalToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showLocalToast = (message: string, type: "success" | "error") => {
    setLocalToast({ show: true, message, type });
    setTimeout(
      () => setLocalToast({ show: false, message: "", type: "success" }),
      5000,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { old: "", new: "", confirm: "" };
    let isValid = true;

    if (!password.old) {
      newErrors.old = "Kata sandi lama wajib diisi";
      isValid = false;
    } else if (password.old.length < 8) {
      newErrors.old = "Kata sandi lama harus minimal 8 karakter!";
      isValid = false;
    }

    if (!password.new) {
      newErrors.new = "Kata sandi baru wajib diisi";
      isValid = false;
    } else if (password.new.length < 8) {
      newErrors.new = "Kata sandi baru harus minimal 8 karakter!";
      isValid = false;
    }

    if (!password.confirm) {
      newErrors.confirm = "Konfirmasi kata sandi wajib diisi";
      isValid = false;
    } else if (password.new !== password.confirm) {
      newErrors.confirm =
        "Konfirmasi kata sandi tidak cocok dengan kata sandi baru!";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        old_password: password.old,
        new_password: password.new,
        confirm_password: password.confirm,
      };

      console.log("Mengirim ke backend:", payload);
      const response = await customerAPI.updatePassword(payload);
      console.log("Response Sukses:", response);

      setIsModalOpen(false);

      // Tampilkan Toast Sukses
      showLocalToast("Perubahan berhasil disimpan", "success");

      // Reset Form
      setPassword({ old: "", new: "", confirm: "" });
      setTimeout(() => {
        onCancel(); // Kembali ke tab profil
      }, 1500);

    } catch (error: any) {
      console.error("Gagal update password:", error);
      setIsModalOpen(false); // Pastikan modal konfirmasi tertutup jika error

      // Mengambil error message dari backend dengan berbagai fallback alternatif struktur data
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Gagal memperbarui kata sandi";

      // Tampilkan Toast Error dari Backend (misal: "Password lama tidak sesuai")
      showLocalToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      id: "old" as const,
      label: "Kata Sandi Lama",
      placeholder: "Masukkan kata sandi lama",
    },
    {
      id: "new" as const,
      label: "Kata Sandi Baru",
      placeholder: "Masukkan kata sandi baru",
    },
    {
      id: "confirm" as const,
      label: "Konfirmasi Kata Sandi Baru",
      placeholder: "Masukkan kembali kata sandi baru",
    },
  ];

  return (
    <div className="w-full font-poppins text-left">
      {localToast.show && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 md:left-auto md:right-6 z-9999 ${
            localToast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white font-bold text-sm px-5 py-3 rounded-sm shadow-lg border ${
            localToast.type === "success" ? "border-green-300" : "border-red-300"
          } flex items-center gap-2 animate-in fade-in slide-in-from-top-8 duration-200`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          {localToast.message}
        </div>
      )}

      <h3 className="text-xl font-black text-black mb-8">Ubah Kata Sandi</h3>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="space-y-6 max-w-xl">
          {fields.map((item) => (
            <div key={item.id} className="space-y-3 flex flex-col">
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
                  className={`w-full p-4 bg-white border-[1.5px] rounded-xs font-medium outline-none text-sm pr-12 transition-all duration-200 ${
                    errors[item.id]
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((p) => ({ ...p, [item.id]: !p[item.id] }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword[item.id] ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
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

        <div className="flex justify-end gap-4 pt-12">
          <button
            type="button"
            onClick={onCancel}
            className="px-10 py-3 bg-white border-[1.5px] border-gray/50 text-black rounded-xs active:scale-95 transition-transform text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 bg-primary text-white rounded-xs shadow-lg active:scale-95 transition-all text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>

      <ConfirSandi
        isOpen={isModalOpen}
        title="Perbarui Kata Sandi?"
        description="Apakah anda yakin ingin mengubah kata sandi? Tindakan ini tidak dapat dibatalkan"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ChangePwProf;