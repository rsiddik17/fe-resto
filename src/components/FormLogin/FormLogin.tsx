import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import { Link } from "react-router";

const loginSchema = z.object({
  email: z.email("Format email tidak valid!").min(1, "Email wajib diisi!"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter!"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const FormLogin = () => {
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isLoginFailed = true;

      if (isLoginFailed) {
        throw new Error("Email atau kata sandi yang Anda masukkan salah.");
      }

      console.log("Data siap dikirim:", data);
    } catch (error: any) {
      setError("root", {
        message: `${error.message}`,
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
            className="block text-right my-5 text-black/50 underline"
          >
            lupa kata sandi
          </Link>

          {errors.root && (
            <span className="text-red-500 text-sm text-center block -translate-y-2">
              {errors.root?.message}
            </span>
          )}

          <Button className="w-full mb-2" type="submit">
            Masuk
          </Button>
        </form>
    </>
  );
};

export default FormLogin;
