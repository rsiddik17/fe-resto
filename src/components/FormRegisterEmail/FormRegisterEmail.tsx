import { Link, useNavigate, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import FormInput from "../FormInput/FormInput";
import Button from "../ui/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../Loading/Loading";

const registerEmailSchema = z.object({
  email: z
    .email("Email tidak valid. Pastikan format email benar.")
    .min(1, "Email wajib diisi!"),
});

type RegisterEmailValues = z.infer<typeof registerEmailSchema>;

const FormRegisterEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tangkap data dari form register pertama
  const registerData = location.state?.registerData;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterEmailValues>({
    resolver: zodResolver(registerEmailSchema),
  });

  const handleRegisterEmail = async (data: RegisterEmailValues) => {
    // Validasi jaga-jaga jika user langsung tembak URL tanpa lewat form pertama
    if (!registerData) {
      setError("root", { message: "Data registrasi tidak lengkap, silakan daftar ulang." });
      setTimeout(() => navigate("/register"), 2000);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const finalPayload = {
        ...registerData,
        email: data.email
      };

      console.log("Kirim ke DB:", finalPayload);
      
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
    <div className="mt-12">
      <Loading show={isSubmitting} />
      <form onSubmit={handleSubmit(handleRegisterEmail)}>
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
          to="/register"
          className="flex justify-center items-center gap-2 text-center my-6 text-black/50 underline"
        >
          <ArrowLeft size={20} /> Kembali Ke Halaman Daftar
        </Link>
      </form>
    </div>
  );
};

export default FormRegisterEmail;