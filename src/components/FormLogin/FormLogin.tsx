import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import { Link, useNavigate } from "react-router";
import { useAuthStore, type UserRole } from "../../store/useAuthStore";
import { isAxiosError } from "axios";
import { authAPI } from "../../api/auth.api";
import ReCAPTCHA from "react-google-recaptcha";

const loginSchema = z.object({
  email: z.email("Format email tidak valid!").min(1, "Email wajib diisi!"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter!"),
  captchaToken: z.string().min(1, "Verifikasi gagal, silakan centang CAPTCHA!"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const FormLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      captchaToken: "", 
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    try {
      const responseData = await authAPI.login({
        email: data.email,
        password: data.password,
        captchaToken: data.captchaToken,
      });

      const token = responseData.data.token;
      const role = responseData.data.user.role as UserRole;

      setAuth(token, role);

      switch (role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "CASHIER":
          navigate("/kasir/dashboard");
          break;
        case "WAITER" :
          navigate("/pelayan/order");
          break;
        case "KITCHEN":
          navigate("/kitchen/queue");
          break;
        case "KIOSK_SYSTEM":
          navigate("/kiosk/home");
          break;
        case "CUSTOMER":
          navigate("/customer/home");
          break;
        default:
          navigate("/");
      }
      
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat login.";
      
      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError("root", {
        message: errorMessage,
      });
    }
  };

  return (
    <>
      <Loading show={isSubmitting} />
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-2">
        <div className="space-y-1">
          <FormInput
            children="Email"
            type="email"
            id="email"
            placeholder="Email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
          />
          {errors.email && (
            <span className="text-red-500 text-sm text-center">
              {errors.email?.message}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            children="Kata Sandi"
            type="password"
            id="password"
            placeholder="Kata Sandi"
            {...register("password")}
            error={!!errors.password}
          />
          {errors.password && (
            <span className="text-red-500 text-sm text-center">
              {errors.password?.message}
            </span>
          )}
        </div>
        
        <Link
          to="/lupa-password"
          className="block text-sm text-right my-3.5 text-black/50 underline"
        >
          lupa kata sandi
        </Link>

        <div className="flex flex-col items-center w-full mb-4">
          <ReCAPTCHA
            // Ingat: Nanti ganti sitekey ini dengan key asli dari Google (biasanya disimpan di file .env)
            sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
            onChange={(token) => {
              // Jika dicentang, simpan tokennya ke dalam state form
              setValue("captchaToken", token || "", { shouldValidate: true });
            }}
          />
          {errors.captchaToken && (
            <span className="text-red-500 text-sm mt-1 text-center">
              {errors.captchaToken.message}
            </span>
          )}
        </div>

        {errors.root && (
          <span className="text-red-500 text-sm text-center block -translate-y-2">
            {errors.root?.message}
          </span>
        )}

        <Button className="w-full" type="submit">
          Masuk
        </Button>
      </form>
    </>
  );
};

export default FormLogin;
