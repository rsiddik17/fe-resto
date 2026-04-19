import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { authAPI } from "../api/auth.api";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 119; // 01:45
const RESEND_COOLDOWN_SECONDS = 59;

export const useOtp = (email: string, type: string, onSuccess: () => void) => {
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [resendError, setResendError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState(false);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(OTP_EXPIRY_SECONDS);
  const [resendSeconds, setResendSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus input pertama
  useEffect(() => {
    const id = requestAnimationFrame(() => inputsRef.current[0]?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  // Timer Expiry
  useEffect(() => {
    const id = window.setInterval(() => {
      setOtpExpirySeconds((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Timer Resend
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
        const numericCode = Number(code);

        const isForgotPassword = type === "forgot-password";

        const responseData = await authAPI.verifyOtp(
          { email: email, otpCode: numericCode },
          isForgotPassword,
        );

        const tokenDariBackend =
          responseData.data?.resetToken ||
          responseData.resetToken ||
          responseData.data?.token ||
          responseData.token;

        if (tokenDariBackend) {
          // Tambahkan replace: true agar navigasi ini menimpa onSuccess() bawaan page
          navigate(`/reset-password?token=${tokenDariBackend}`, {
            replace: true,
          });
        } else {
          onSuccess();
        }
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          console.log(
            "🔴 DETAIL ERROR DARI BACKEND:",
            JSON.stringify(error.response.data, null, 2),
          );
        } else {
          console.error("Gagal verifikasi:", error);
        }

        // Nyalakan error state merah di UI
        setOtpError(true);
      } finally {
        setIsVerifying(false);
      }
    },
    [email, type, navigate, onSuccess],
  );

  const handleVerifyClick = () => {
    const code = digits.join("");
    if (code.length !== OTP_LENGTH || digits.some((d) => !d)) return;
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

    if (d && index < OTP_LENGTH - 1) focusInput(index + 1);
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

    // 2. RESET ERROR RESEND SEBELUM MENCOBA LAGI
    setResendError(null);

    try {
      await authAPI.resendOtp({ email: email });

      setResendSeconds(RESEND_COOLDOWN_SECONDS);
      setOtpExpirySeconds(OTP_EXPIRY_SECONDS);
      setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setOtpError(false);
      focusInput(0);

      console.log("OTP Baru berhasil dikirim ke:", email);
    } catch (error) {
      // 3. TANGKAP ERROR DAN MASUKKAN KE STATE UI
      let errorMessage = "Gagal mengirim ulang OTP, silakan coba lagi.";

      if (isAxiosError(error) && error.response) {
        console.log("🔴 DETAIL ERROR RESEND:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else {
        console.error("Gagal mengirim ulang OTP:", error);
      }

      setResendError(errorMessage);
    }
  };

  return {
    digits,
    otpError,
    resendError,
    otpExpirySeconds,
    resendSeconds,
    isVerifying,
    inputsRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleResend,
    handleVerifyClick,
  };
};
