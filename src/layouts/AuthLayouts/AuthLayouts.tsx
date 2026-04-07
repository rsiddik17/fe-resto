import type React from "react";
import { Link } from "react-router";
import { cn } from "../../utils/utils";

interface AuthLayoutsProps {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  type?: string;
  cardClassName?: string;
}

const AuthLayouts = ({
  children,
  title,
  description,
  type, cardClassName
}: AuthLayoutsProps) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[url(/images/bg-login.webp)] bg-no-repeat bg-cover bg-center">
      <div className="relative w-full flex justify-center items-center p-4">
        <div className="absolute -top-12">
          <img
            src="/images/logo.webp"
            alt="Logo IT'S RESTO"
            className="w-full max-w-65 object-cover mx-auto"
          />
        </div>
        <div className={cn("w-full max-w-sm md:max-w-md bg-light-gray/75 px-7 pt-4 pb-3 rounded-lg shadow-sm mt-32", cardClassName)}>
          <h1 className="text-primary text-center text-[1.75rem] font-bold mt-2">
            {title}
          </h1>
          {description && (
            <div className="text-gray text-[0.938rem] text-center mb-6">{description}</div>
          )}
          {children}
          <p className="text-sm mt-3 text-center">
            {type === "login" && (
              <>
                Belum Punya Akun?{" "}
                <Link to="/register" state={{ loginPage: true }} className="font-bold text-primary">
                  Daftar
                </Link>
              </>
            )}

            {type === "register" &&  (
              <>
                Sudah Punya Akun?{" "}
                <Link to="/" className="font-bold text-primary">
                  Masuk
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayouts;
