import FormRegister from "../../components/FormRegister/FormRegister";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";

const RegisterPage = () => {
    return (
        <>
            <AuthLayouts title="Selamat Datang" description="Lengkapi data untuk membuat akun anda" type="register" cardClassName="md:max-w-2xl">
                <FormRegister/>
            </AuthLayouts>
        </>
    )
}

export default RegisterPage;