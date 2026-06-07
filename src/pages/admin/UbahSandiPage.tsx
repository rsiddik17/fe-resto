import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import ConfirAlamat from "../../components/ConfirmationModal/ConfirmationModal";
import { staffAPI } from "../../api/staff.api";

const UbahSandiPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Input Form
  // const [sandiLama, setSandiLama] = useState("");
  const [sandiBaru, setSandiBaru] = useState("");
  const [konfirmasiSandi, setKonfirmasiSandi] = useState("");

  // State Mata Intip Input Password
  // const [showLama, setShowLama] = useState(false);
  const [showBaru, setShowBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const handleTriggerConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sandiBaru.length < 8) {
      alert("Kata sandi baru minimal 8 karakter");
      return;
    }
    
    if (sandiBaru !== konfirmasiSandi) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    
    setIsConfirmOpen(true);
  };

  // ✅ Tambahkan async di sini
  const handleFinalSave = async () => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        new_password: sandiBaru,
        confirm_password: konfirmasiSandi,
      };
      
      console.log("Mengirim ke backend:", payload);
      const response = await staffAPI.updateStaffPassword(id!, payload);
      console.log("Response:", response);
      
      setIsConfirmOpen(false);
      navigate("/admin/employee-management", { 
        state: { showSuccessToast: true, message: "Berhasil memperbarui kata sandi" }
      });
    } catch (error: any) {
      console.error("Gagal update password:", error);
      alert(error.response?.data?.message || "Gagal memperbarui kata sandi");
      setIsConfirmOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F4F6]">
      <AdminSidebar onLogout={() => console.log("Admin Logout")} />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto p-5 md:p-6">
        <AdminHeader title="Manajemen Pegawai" subtitle="Pantau data sistem dan aktivitas pegawai" />

        <div className="w-full max-w-300 mx-auto space-y-4">
          
          <button 
            onClick={() => navigate("/admin/employee-management")}
            className="flex items-center gap-2 text-gray-800 font-extrabold text-[15px] hover:text-primary transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Ubah Kata Sandi
          </button>

          <div className="bg-white rounded-[20px] shadow-xs border border-gray-150 p-6 md:p-8">
            <form onSubmit={handleTriggerConfirm} className="space-y-5 max-w-xl">
              
              {/* Kata Sandi Lama */}
              {/* <div className="space-y-1.5 relative">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">Kata Sandi Lama<span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative w-full">
                  <input
                    type={showLama ? "text" : "password"} 
                    required 
                    placeholder="Min 8 karakter" 
                    value={sandiLama} 
                    onChange={(e) => setSandiLama(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 pr-12 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowLama(!showLama)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer">
                    {showLama ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div> */}

              {/* Kata Sandi Baru */}
              <div className="space-y-1.5 relative">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">Kata Sandi Baru<span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative w-full">
                  <input
                    type={showBaru ? "text" : "password"} 
                    required 
                    placeholder="Min 8 karakter" 
                    value={sandiBaru} 
                    onChange={(e) => setSandiBaru(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 pr-12 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowBaru(!showBaru)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer">
                    {showBaru ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div className="space-y-1.5 relative">
                <label className="text-[11.5px] font-extrabold text-black uppercase tracking-wider">Konfirmasi Kata Sandi Baru<span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative w-full">
                  <input
                    type={showKonfirmasi ? "text" : "password"} 
                    required 
                    placeholder="Konfirmasi Kata Sandi" 
                    value={konfirmasiSandi} 
                    onChange={(e) => setKonfirmasiSandi(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xs px-4 py-3 pr-12 text-[13.5px] font-semibold text-gray-800 outline-hidden focus:border-primary focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowKonfirmasi(!showKonfirmasi)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer">
                    {showKonfirmasi ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Tombol Control */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button" 
                  onClick={() => navigate("/admin/employee-management")}
                  className="px-6 py-2.5 text-[13.5px] text-black rounded-xs border border-gray/50  hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white text-[13.5px] px-6 py-2.5 rounded-xs "
                >
                  {isSubmitting ? "Memproses..." : "Simpan"}
                </button>
              </div>

            </form>
          </div>

          <ConfirAlamat 
            isOpen={isConfirmOpen}
            onCancel={() => setIsConfirmOpen(false)}
            onConfirm={handleFinalSave}
            title="Perbarui Kata Sandi?"
            description="Apakah anda yakin ingin mengubah kata sandi pegawai ini? Tindakan ini tidak dapat dibatalkan"
          />

        </div>
      </main>
    </div>
  );
};

export default UbahSandiPage;