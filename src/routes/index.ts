import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyOtpPage from "../pages/VerifyOtpPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/lupa-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/verifikasi-otp",
    Component: VerifyOtpPage,
  },
  {
    path: "/reset-password",
    Component: ResetPasswordPage,
  },
]);

export default router;
