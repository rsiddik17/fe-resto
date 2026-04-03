import type React from "react";
import { forwardRef } from "react";
import { cn } from "../../utils/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode
};

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ htmlFor, children, className}, ref) => {
        return (
            <label ref={ref} htmlFor={htmlFor} className={cn("text-lg font-bold", className)} >{children}</label>
        )
    }
)

export default Label;