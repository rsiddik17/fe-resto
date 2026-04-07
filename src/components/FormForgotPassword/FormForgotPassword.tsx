import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../Loading/Loading";

const forgorPasswordSchema = z.object({
  email: z
    .email("Email tidak valid. Pastikan format email benar.")
    .min(1, "Email wajib diisi!"),
});

type ForgotPasswordValues = z.infer<typeof forgorPasswordSchema>;

const FormForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgorPasswordSchema),
  });

  const handleForgotPassword = async (data: ForgotPasswordValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Kirim OTP ke email:", data.email);
      navigate(`/verifikasi-otp?email=${encodeURIComponent(data.email)}&type=forgot-password`);

    } catch (error) {
      setError("root", {
        message: `${error}`,
      });
    }
  };

  return (
    <div className="mt-10">
      <Loading show={isSubmitting} />
      <form onSubmit={handleSubmit(handleForgotPassword)}>
        <FormInput
          children="Alamat Email"
          type="email"
          id="email"
          placeholder="Email"
          autoFocus
          className="mb-8"
          {...register("email")}
          error={!!errors.email}
        />

        {errors.email && (
          <span className="block text-red-500 text-sm text-center">
            {errors.email.message}
          </span>
        )}

        {errors.root && (
          <span className="block text-red-500 text-sm text-center mb-4">
            {errors.root.message}
          </span>
        )}

        <Button className="w-full mt-8" type="submit">
          Kirim Kode OTP
        </Button>
        <Link
          to="/"
          className="flex justify-center items-center gap-2 text-center my-6 text-black/50 underline"
        >
          <ArrowLeft size={20} /> kembali ke halaman login
        </Link>
      </form>
    </div>
  );
};

export default FormForgotPassword;
