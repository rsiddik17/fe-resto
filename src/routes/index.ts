import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

const router = createBrowserRouter([
    {
        path: "/",
        Component: LoginPage
    },
     {
        path: "/lupa-password",
        Component: ForgotPasswordPage
    }
])

export default router;