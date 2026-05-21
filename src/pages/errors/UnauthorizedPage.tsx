import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/ui/Button";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  // Ambil data role dari global state
  const { role } = useAuthStore();

  const handleGoHome = () => {
    // Tentukan rute "Beranda" berdasarkan role yang sedang login
    let homePath = "/";

    switch (role) {
      case "ADMIN":
        homePath = "/admin/dashboard";
        break;
      case "CASHIER":
        homePath = "/cashier/dashboard";
        break;
      case "WAITER":
        homePath = "/waiter/dashboard";
        break;
      case "KITCHEN":
        homePath = "/kitchen/queue";
        break;
      case "KIOSK_SYSTEM":
        homePath = "/kiosk/home";
        break;
      case "CUSTOMER":
        homePath = "/customer/home";
        break;
      default:
        // Jika belum login (role = null), kembalikan ke halaman login awal
        homePath = "/";
    }

    // Gunakan replace: true agar halaman 403 ini tidak tersimpan di riwayat tombol "Back" browser
    navigate(homePath, { replace: true });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-6">
      
      {/* Kasih warna merah/primary untuk menegaskan ini area terlarang */}
      <p className="mb-6 text-lg font-medium"> 
        403 Akses Ditolak
      </p>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Ups! Kamu Nggak Punya Akses
      </h1>
      
      <p className="mb-8 text-center text-lg">
        Maaf, kamu tidak memiliki izin untuk melihat halaman ini. Silakan kembali ke beranda.
      </p>
      
      <Button 
        onClick={handleGoHome} 
        className="px-6 py-3"
      >
        Kembali ke Beranda
      </Button>

    </div>
  );
};

export default UnauthorizedPage;