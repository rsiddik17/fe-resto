import FormRegisterEmail from "../../components/FormRegisterEmail/FormRegisterEmail";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";


const RegisterEmailPage = () => {
  return (
    <AuthLayouts
      title="Masukan Email"
      description="Masukan alamat email aktif"
    >
      <FormRegisterEmail />
    </AuthLayouts>
  );
};

export default RegisterEmailPage;