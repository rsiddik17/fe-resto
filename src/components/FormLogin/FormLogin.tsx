import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import { Link, useNavigate } from "react-router";
import { useAuthStore, type UserRole } from "../../store/useAuthStore";

const loginSchema = z.object({
  email: z.email("Format email tidak valid!").min(1, "Email wajib diisi!"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter!"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const FormLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let simulatedRole: UserRole = "CUSTOMER"; // Default role

      if (data.email.includes("admin")) {
        simulatedRole = "ADMIN";
      } else if (data.email.includes("kasir")) {
        simulatedRole = "CASHIER";
      } else if (data.email.includes("pelayan")) {
        simulatedRole = "WAITER";
      } else if (data.email.includes("dapur")) {
        simulatedRole = "KITCHEN";
      } else if (data.email.includes("kiosk")) {
        simulatedRole = "KIOSK_SYSTEM";
      }

      const fakeApiResponse = {
        token: "fake-jwt-token-12345",
        role: simulatedRole,
      };

      setAuth(fakeApiResponse.token, fakeApiResponse.role);

      switch (fakeApiResponse.role) {
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
      if (error instanceof Error) {
        setError("root", {
          message: error.message,
        });
      }
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
