import { forwardRef } from "react";
import { cn } from "../../utils/utils";

const baseStyle = "inline-block font-bold text-lg text-white rounded-xs cursor-pointer transition";

const variants = {
  primary: "bg-primary hover:bg-primary-hover",
};

const sizes = {
  sm: "px-4 py-2",
  md: "px-6 py-3",
  lg: "px-8 py-4",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      type = "button",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;