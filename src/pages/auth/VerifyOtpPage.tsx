import { Navigate, useNavigate, useSearchParams } from "react-router";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";
import FormOtp from "../../components/FormOtp/FormOtp";

const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") ?? "";
  const type = searchParams.get("type") ?? "forgot-password";

  if (!email) {
    return <Navigate to="/" replace />;
  }

  const description = (
    <p className="text-start mx-5">
      Kami telah mengirimkan kode OTP Ke:{" "}
      <span className="font-bold text-gray">{email || "—"}</span>
    </p>
  );

  const handleOtpSuccess = () => {
    if (type === "register") {
      // Jika dari daftar, kembali ke login
      navigate("/"); 
    } else {
      // Jika dari lupa password, ke buat password baru
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <AuthLayouts title="Masukan Kode OTP" description={description}>
      <FormOtp onSuccess={handleOtpSuccess}/>
    </AuthLayouts>
  );
};

export default VerifyOtpPage;
