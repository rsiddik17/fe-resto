import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router";

const registerSchema = z
  .object({
    nama: z.string().min(3, "Nama lengkap minimal 3 karakter!"),
    email: z.email("Format email tidak valid!").min(1, "Email wajib diisi!"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter!"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak sama.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const FormRegister = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Data registrasi siap dikirim:", data);

      navigate(`/verifikasi-otp?email=${encodeURIComponent(data.email)}&type=register`);
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
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-3">
        <div className="space-y-1">
          <FormInput
            children="Nama Lengkap"
            type="text"
            id="nama"
            placeholder="Nama Lengkap"
            autoFocus
            {...register("nama")}
            error={!!errors.nama}
          />
          {errors.nama && (
            <span className="text-red-500 text-sm text-start block">
              {errors.nama?.message}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            children="Email"
            type="email"
            id="email"
            placeholder="Email"
            {...register("email")}
            error={!!errors.email}
          />
          {errors.email && (
            <span className="text-red-500 text-sm text-start block">
              {errors.email?.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <span className="text-red-500 text-sm text-start block">
                {errors.password?.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <FormInput
              children="Konfirmasi Kata Sandi"
              type="password"
              id="confirmPassword"
              placeholder="Konfirmasi Kata Sandi"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm text-start block">
                {errors.confirmPassword?.message}
              </span>
            )}
          </div>
        </div>

        {errors.root && (
          <span className="text-red-500 text-sm text-center block pt-2">
            {errors.root?.message}
          </span>
        )}

        <Button className="w-full mt-4 mb-2" type="submit">
          Daftar
        </Button>
      </form>
    </>
  );
};

export default FormRegister;
