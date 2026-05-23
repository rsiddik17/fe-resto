import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const GuestRoute = () => {
  const { token, role } = useAuthStore();

  // Jika belum ada token ATAU role-nya bukan GUEST, tendang ke landing page/login
  if (!token || role !== "GUEST") {
    return <Navigate to="/" replace />;
  }

  // Jika sudah punya token GUEST, izinkan akses ke halaman QR
  return <Outlet />;
};

export default GuestRoute;