import { Navigate, useLocation } from "react-router";
import FormRegister from "../../components/FormRegister/FormRegister";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";

const RegisterPage = () => {
  const location = useLocation();

  // 🚨 FLOW GUARD: Cek apakah ada sinyal dari halaman login
  if (!location.state?.loginPage) {
    // Jika tidak ada, tendang balik ke halaman utama
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AuthLayouts
        title="Selamat Datang"
        description="Lengkapi data untuk membuat akun anda"
        type="register"
        cardClassName="md:max-w-2xl"
      >
        <FormRegister />
      </AuthLayouts>
    </>
  );
};

export default RegisterPage;