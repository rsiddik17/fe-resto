import { type SVGProps } from 'react';

// 1. Buat interface agar TS mengenali prop 'size'
interface NotesIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

// 2. Gunakan interface tersebut dan destructuring size
export default function NotesIcon({ size = 20, ...props }: NotesIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size}   // Gunakan variabel size
      height={size}  // Gunakan variabel size
      viewBox="0 0 24 24" 
      {...props}
    >
      <g fill="currentColor">
        <path d="M6 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1m1 3a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2zm-1 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1"/>
        <path fillRule="evenodd" d="M2 4a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm3-1h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1" clipRule="evenodd"/>
      </g>
    </svg>
  );
}