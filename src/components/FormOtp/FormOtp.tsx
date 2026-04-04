import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import Label from "../ui/Label";
import { cn } from "../../utils/utils";
import Loading from "../Loading/Loading";
import Button from "../ui/Button";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 105; // 01:45
const RESEND_COOLDOWN_SECONDS = 54;

function formatMmSs(totalSeconds: number) {
  const m = Math.floor(Math.max(0, totalSeconds) / 60);
  const s = Math.max(0, totalSeconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const FormOtp = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [otpError, setOtpError] = useState(false);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(OTP_EXPIRY_SECONDS);
  const [resendSeconds, setResendSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const lastSubmittedRef = useRef<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => inputsRef.current[0]?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setOtpExpirySeconds((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setResendSeconds((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const verifyOtp = useCallback(
    async (code: string) => {
      setIsVerifying(true);
      setOtpError(false);
      try {
        console.log("[FormOtp] verifyOtp called with:", code, "email:", email);
        await new Promise((r) => setTimeout(r, 800));
        const isValid = code === "123456";
        if (!isValid) {
          console.log("[FormOtp] invalid otp:", code);
          setOtpError(true);
          return;
        }
        console.log("[FormOtp] valid otp, navigating...");
        navigate(`/reset-password?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
      } finally {
        setIsVerifying(false);
      }
    },
    [email, navigate],
  );

  // useEffect(() => {
  //   const code = digits.join("");
  //   if (code.length !== OTP_LENGTH) {
  //     lastSubmittedRef.current = null;
  //     return;
  //   }
  //   if (lastSubmittedRef.current === code) return;
  //   lastSubmittedRef.current = code;
  //   void verifyOtp(code);
  // }, [digits, verifyOtp]);

  const handleVerifyClick = () => {
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) return;
    if (digits.some((d) => !d)) return;
    void verifyOtp(code);
  };


  const focusInput = (index: number) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (index: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    if (otpError) setOtpError(false);

    setDigits((prev) => {
      const next = [...prev];
      next[index] = d;
      return next;
    });

    if (d && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    if (otpError) setOtpError(false);
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? "");
    setDigits(next);
    const lastIdx = Math.min(pasted.length, OTP_LENGTH) - 1;
    focusInput(lastIdx >= 0 ? lastIdx : 0);
  };

  const handleResend = async () => {
    if (resendSeconds > 0) return;
    setResendSeconds(RESEND_COOLDOWN_SECONDS);
    setOtpExpirySeconds(OTP_EXPIRY_SECONDS);
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setOtpError(false);
    lastSubmittedRef.current = null;
    focusInput(0);
    await new Promise((r) => setTimeout(r, 500));
    console.log("Kirim ulang OTP ke:", email);
  };

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
