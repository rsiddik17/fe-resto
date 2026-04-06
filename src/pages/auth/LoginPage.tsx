import FormLogin from "../../components/FormLogin/FormLogin";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";

const LoginPage = () => {
  return (
    <>
      <AuthLayouts title="Selamat Datang" description="Masuk untuk mengakses akun anda" type="login">
        <FormLogin/>
      </AuthLayouts>
    </>
  );
};

export default LoginPage;
