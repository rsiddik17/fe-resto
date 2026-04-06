import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/ui/Button";

const KioskHomePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <div>
      <h1>Halaman Kiosk</h1>

      <Button className="ml-2" onClick={handleLogout}>
        Keluar
      </Button>
    </div>
  );
};

export default KioskHomePage;