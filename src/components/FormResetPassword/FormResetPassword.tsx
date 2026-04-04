import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import { useNavigate, useSearchParams } from "react-router";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minimal 8 karakter, kombinasi huruf dan angka"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi!"),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Konfirmasi kata sandi tidak sama.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const FormResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (data: ResetPasswordValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Reset password untuk:", email, "data:", data);
      navigate("/");
    } catch (error: any) {
      setError("root", {
        message: `${error.message ?? error}`,
      });
    }
  };

  return (
    <>
      <Loading show={isSubmitting} />
      <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-2">
        <div className="space-y-1">
          <FormInput
            children="Kata Sandi Baru"
            type="password"
            id="password"
            placeholder="password"
            autoFocus
            {...register("password")}
            error={!!errors.password}
          />
          <p className="text-xs text-black/60">
            Minimal 8 karakter, kombinasi huruf dan angka
          </p>
         
        </div>

        <div className="space-y-1">
          <FormInput
            children="Konfirmasi Kata Sandi"
            type="password"
            id="confirmPassword"
            placeholder="Masukan Kata Sandi"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm text-center">
              {errors.confirmPassword?.message}
            </span>
          )}
        </div>

        {errors.root && (
          <span className="text-red-500 text-sm text-center block -translate-y-2">
            {errors.root?.message}
          </span>
        )}

        <Button className="w-full mb-2 mt-4" type="submit">
          Simpan Kata Sandi
        </Button>
      </form>
    </>
  );
};

export default FormResetPassword;
