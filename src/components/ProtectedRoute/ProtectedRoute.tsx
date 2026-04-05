import { Navigate, Outlet } from "react-router";
import { useAuthStore, type UserRole } from "../../store/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { token, role } = useAuthStore();

  // 1. Cek apakah user sudah login
  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  // 2. Cek apakah role-nya diizinkan mengakses halaman ini
  if (!allowedRoles.includes(role)) {
    // Jika tidak punya akses, arahkan ke halaman "Unauthorized" atau tendang balik
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika aman, render halamannya (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;