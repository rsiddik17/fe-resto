import type React from "react";
import Input, { type InputProps } from "../ui/Input";
import Label from "../ui/Label";
import { forwardRef, useState } from "react";
import { EyeOff, Eye } from "lucide-react";

interface FormInputProps extends InputProps {
  children: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ children, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const currentType = isPassword ? showPassword ? "text" : "password" : type;

    return (
      <div className="flex flex-col gap-y-1">
        <Label htmlFor={id}>{children}</Label>
        <div className="relative">
          <Input
            id={id}
            type={currentType}
            className={`${isPassword ? "pr-10" : ""}`}
            ref={ref}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray/80 hover:text-gray transition"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  },
);

export default FormInput;
