import type React from "react";
import { cn } from "../../utils/utils";

interface AuthLayoutsProps {
  children: React.ReactNode;
  title: string;
  // description: string;
  description?: React.ReactNode;
  cardClassName?: string;
}

const AuthLayouts = ({
  children,
  title,
  description,
  cardClassName,
}: AuthLayoutsProps) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[url(/images/bg-login.webp)] bg-no-repeat bg-cover bg-center">
      <div className="relative w-full flex justify-center items-center p-4">
        <div className="absolute -top-20 md:-top-22">
          <img
            src="/images/logo.webp"
            alt="Logo IT'S RESTO"
            className="w-full max-w-[320px] object-cover mx-auto"
          />
        </div>
        <div
          className={cn(
            "w-full max-w-md md:max-w-lg bg-light-gray/80 p-7 rounded-lg shadow-sm mt-32",
            cardClassName,
          )}
        >
          <h1 className="text-primary text-center text-3xl font-bold mt-4 mb-1">
            {title}
          </h1>
          {description != null && description !== "" && (
            <p className="text-gray text-start px-5 mb-6">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayouts;
