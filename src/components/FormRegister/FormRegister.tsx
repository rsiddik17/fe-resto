import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { authAPI } from "../../api/auth.api";

const registerSchema = z
  .object({
    fullname: z.string().min(3, "Nama lengkap wajib di isi!"),
    email: z.email("Format email tidak valid!").min(1, "Email wajib diisi!"),
    phone_number: z
      .string()
      .min(11, "Nomor telepon minimal 11 angka!")
      .max(15, "Nomor telepon terlalu panjang!")
      .regex(/^[0-9]+$/, "Nomor telepon harus terdiri dari angka!"),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter!")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])/,
        "Kata sandi harus mengandung kombinasi huruf dan angka!",
      ),
    confirm_password: z.string().min(1, "Konfirmasi kata sandi wajib diisi!"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "kata sandi tidak cocok. Silakan periksa kembali.",
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
     await authAPI.register({
        fullname: data.fullname,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
        confirm_password: data.confirm_password, 
      });

      navigate(
        `/verifikasi-otp?email=${encodeURIComponent(data.email)}&type=register`,
      );
    } catch (error) {
      let errorMessage = "Gagal melakukan registrasi.";
      
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
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-3">
        <div className="space-y-1">
          <FormInput
            children="Nama Lengkap"
            type="text"
            id="nama"
            placeholder="Nama Lengkap"
            autoFocus
            {...register("fullname")}
            error={!!errors.fullname}
          />
          {errors.fullname && (
            <span className="text-red-500 text-sm text-start block">
              {errors.fullname?.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7">
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

          <div className="space-y-1">
            <FormInput
              children="No Telepon"
              type="tel"
              id="phone_number"
              placeholder="No Telepon"
              {...register("phone_number")}
              error={!!errors.phone_number}
            />
            {errors.phone_number && (
              <span className="text-red-500 text-sm text-start block">
                {errors.phone_number?.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7">
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
              {...register("confirm_password")}
              error={!!errors.confirm_password}
            />
            {errors.confirm_password && (
              <span className="text-red-500 text-sm text-start block">
                {errors.confirm_password?.message}
              </span>
            )}
          </div>
        </div>

        {errors.root && (
          <span className="text-red-500 text-sm text-center block pt-2">
            {errors.root?.message}
          </span>
        )}

        <Button className="w-full mt-4" type="submit">
          Daftar
        </Button>
      </form>
    </>
  );
};

export default FormRegister;
