import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

const PublicRoute = () => {
  const { token, role } = useAuthStore();

  // Jika user SUDAH login, arahkan mereka ke dashboard sesuai role-nya
  if (token && role) {
    switch (role) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "CASHIER":
        return <Navigate to="/kasir/dashboard" replace />;
      case "WAITER":
        return <Navigate to="/pelayan/order" replace />;
      case "KITCHEN":
        return <Navigate to="/kitchen/queue" replace />;
      case "KIOSK_SYSTEM":
        return <Navigate to="/kiosk/home" replace />;
      case "CUSTOMER":
        return <Navigate to="/customer/home" replace />;
      default:
        // Fallback jika role tidak dikenali
        return <Navigate to="/unauthorized" replace />;
    }
  }

  // Jika BELUM login, biarkan mengakses halaman (Outlet)
  return <Outlet />;
};

export default PublicRoute;