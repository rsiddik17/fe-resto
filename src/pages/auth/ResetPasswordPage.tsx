import { Navigate, useSearchParams } from "react-router";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";
import FormResetPassword from "../../components/FormResetPassword/FormResetPassword";


const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // ✅ HIDUPKAN PENJAGA INI
  // Jika ada orang iseng masuk tanpa bawa token sakti dari OTP, tendang ke login!
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayouts
      title="Buat Kata Sandi Baru"
      description="Masukan kata sandi baru anda di bawah ini"
    >
      <FormResetPassword />
    </AuthLayouts>
  );
};

export default ResetPasswordPage;

