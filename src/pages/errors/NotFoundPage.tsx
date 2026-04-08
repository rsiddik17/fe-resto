import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/ui/Button";

const NotFoundPage = () => {
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
        homePath = "/kasir/dashboard";
        break;
      case "WAITER":
        homePath = "/pelayan/order";
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

    // Gunakan replace: true agar halaman 404 ini tidak tersimpan di riwayat tombol "Back" browser
    navigate(homePath, { replace: true });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-6">
      
      <p className="mb-6 text-lg font-medium">
        404 Tidak Ditemukan
      </p>
      
      <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6 text-center">
        Ups! Halaman Tidak Ditemukan
      </h1>
      
      <p className="mb-8 text-center text-lg">
        Halaman tidak ditemukan. Silakan kembali ke beranda
      </p>
      
      <Button 
        onClick={handleGoHome} 
        className="px-8 py-4"
      >
        Kembali ke Beranda
      </Button>

    </div>
  );
};

export default NotFoundPage;