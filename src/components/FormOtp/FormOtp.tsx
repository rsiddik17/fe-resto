import { ArrowLeft } from "lucide-react";
import Label from "../ui/Label";
import { cn } from "../../utils/utils";
import Loading from "../Loading/Loading";
import Button from "../ui/Button";
import { useOtp } from "../../hooks/useOtp";
import { Link, useSearchParams } from "react-router";

function formatMmSs(totalSeconds: number) {
  const m = Math.floor(Math.max(0, totalSeconds) / 60);
  const s = Math.max(0, totalSeconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface FormOtpProps {
  onSuccess: () => void;
}

const FormOtp = ({ onSuccess }: FormOtpProps) => {

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const {
    digits,
    otpError,
    otpExpirySeconds,
    resendSeconds,
    isVerifying,
    inputsRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleResend,
    handleVerifyClick, 
  } = useOtp(email, onSuccess);

  return (
    <div>
      <Loading show={isVerifying} />
      <div className="space-y-3">
        <div>
          <Label htmlFor="otp-0" className="px-5">
            Kode OTP
          </Label>
          <div
            className="mt-2 px-5 flex justify-start gap-2 sm:gap-4"
            role="group"
            aria-label="Kode OTP 6 digit"
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={otpExpirySeconds <= 0}
                className={cn(
                  "h-12 w-11 sm:w-12 rounded-xs border bg-white text-center text-lg font-semibold tabular-nums",
                  "outline-none transition focus:ring-2 focus:ring-primary",
                  otpError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-secondary",
                )}
              />
            ))}
          </div>
        </div>

        {otpError && (
          <p className="text-start px-5 text-sm text-red-500">
            Kode OTP yang anda masukan salah. Silakan coba lagi.
          </p>
        )}

        <p className="text-start px-5 text-sm text-black">
          Kode akan kadaluwarsa dalam:{" "}
          <span className="font-bold text-foreground">
            {formatMmSs(otpExpirySeconds)}
          </span>
        </p>

        <p className="text-start px-5 text-sm text-black">
          Belum menerima kode?{" "}
          {resendSeconds > 0 ? (
            <span className="text-primary font-semibold">
              Kirim Ulang OTP({resendSeconds}s)
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-primary underline-offset-2 hover:underline"
            >
              Kirim Ulang OTP
            </button>
          )}
        </p>

        <div className="px-5 pt-2">
          <Button
            className="w-full"
            type="button"
            onClick={handleVerifyClick}
            disabled={isVerifying || digits.some((d) => !d)}
          >
            Verifikasi
          </Button>
        </div>

        <div className="border-t border-black/10 pt-4">
          <Link
            to="/"
            className="flex justify-center items-center gap-2 text-center text-black/50 underline"
          >
            <ArrowLeft size={20} aria-hidden />
            Kembali Ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormOtp;