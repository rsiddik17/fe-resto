import { type SVGProps } from 'react';

// Interface untuk mendukung prop 'size'
interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export default function SuccessIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      {...props}
    >
      {/* Lingkaran: Mengikuti warna teks (currentColor) */}
      <circle cx="24" cy="24" r="20" fill="currentColor" />
      
      {/* Ceklis: Tetap putih agar terlihat kontras di atas lingkaran */}
      <path 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="m16 24l6 6l12-12" 
      />
    </svg>
  );
}