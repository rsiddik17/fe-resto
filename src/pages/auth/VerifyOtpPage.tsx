import { Navigate, useNavigate, useSearchParams } from "react-router";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";
import FormOtp from "../../components/Form/FormOtp";
import { deObfuscateData } from "../../utils/crypto";

const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // get email and type from url
  const scrambledEmail = searchParams.get("_cx") ?? "";
  const scrambledType = searchParams.get("_t") ?? "";

  // deobfuscate email and type
  const email = deObfuscateData(scrambledEmail);
  const type = deObfuscateData(scrambledType);

  if (!email || !email.includes("@")) {
    return <Navigate to="/register" replace />;
  }

  const description = (
    <p className="text-start mx-1 md:mx-5 mt-2">
      Kami telah mengirimkan kode OTP Ke:{" "}
      <span className="font-bold text-gray">{email || "—"}</span>
    </p>
  );

  const handleOtpSuccess = (token?: string) => {
    if (type === "register") {
      // Jika registrasi, setelah verifikasi berhasil kembali ke login
      navigate("/", { replace: true });
    } else if (type === "forgot-password" && token) {
      // Jika dari lupa sandi, teruskan ke reset-password dengan JWT Token di URL
      navigate(`/reset-password?token=${token}`, { replace: true });
    } else {
      // Fallback
      navigate("/");
    }
  };

  return (
    <AuthLayouts title="Masukan Kode OTP" description={description}>
      <FormOtp onSuccess={handleOtpSuccess} />
    </AuthLayouts>
  );
};

export default VerifyOtpPage;
