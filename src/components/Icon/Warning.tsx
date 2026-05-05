import { type SVGProps } from 'react';

// Pastikan interface ini ada tepat di atas fungsi
interface WarningIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export default function WarningIcon({ size = 24, ...props }: WarningIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      {...props}
    >
      <path 
        fill="currentColor" 
        d="M12 2.2c-.4 0-.8.2-1 .5l-9.8 17c-.3.5-.3 1.1 0 1.6s.8.7 1.3.7h19.5c.5 0 1-.2 1.3-.7s.3-1.1 0-1.6l-9.8-17c-.2-.3-.6-.5-1.1-.5z"
      />
      <g fill="#ffffff">
        <path d="M10.75 9h2.5v5h-2.5z" />
        <circle cx="12" cy="17" r="1.5" />
      </g>
    </svg>
  );
}