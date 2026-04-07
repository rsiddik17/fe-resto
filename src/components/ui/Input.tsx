import { forwardRef } from "react";
import { cn } from "../../utils/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({type = "text", id, error, className, ...props}, ref) => {
        return (
            <input type={type} id={id} className={cn("w-full px-4 py-2 border border-secondary bg-white rounded-xs transition", "placeholder:text-gray/50", "focus:outline-none focus:ring-2 focus:ring-primary", error && "border-red-500 focus:ring-red-500", className)} ref={ref} {...props} />
        )
    }
)

export default Input;