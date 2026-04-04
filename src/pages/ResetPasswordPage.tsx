import { useSearchParams } from "react-router";
import AuthLayouts from "../layouts/AuthLayouts/AuthLayouts";
import FormResetPassword from "../components/FormResetPassword/FormResetPassword";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <AuthLayouts
      title="Buat Kata Sandi Baru"
      description="Masukan kata sandi baru anda di bawah ini"
    >
      <FormResetPassword key={email} />
    </AuthLayouts>
  );
};

export default ResetPasswordPage;

