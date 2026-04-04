import { useSearchParams } from "react-router";
import FormOtp from "../components/FormOtp/FormOtp"
import AuthLayouts from "../layouts/AuthLayouts/AuthLayouts";

const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const description = (
    <p>
      Kami telah mengirimkan kode OTP Ke:{" "}
      <span className="font-bold text-gray">{email || "—"}</span>
    </p>
  );

  return (
    <AuthLayouts title="Masukan Kode OTP" description={description}>
      <FormOtp />
    </AuthLayouts>
  );
};

export default VerifyOtpPage;
