import FormForgotPassword from "../../components/FormForgotPassword/FormForgotPassword";
import AuthLayouts from "../../layouts/AuthLayouts/AuthLayouts";


const ForgotPasswordPage = () => {
    return (
        <div>
            <AuthLayouts title="Lupa Kata Sandi" description="Masukkan alamat email yang terdaftar pada akun anda">
                <FormForgotPassword/>
            </AuthLayouts>
        </div>
    )
}

export default ForgotPasswordPage;