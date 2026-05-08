import { type SVGProps } from 'react';

export default function InfoCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      {/* Lingkaran luar: Akan mengikuti warna dari className (misal: text-red-500) */}
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      
      {/* Huruf 'i': Secara eksplisit diatur ke warna putih murni */}
      <g fill="#ffffff">
        {/* Titik atas huruf i */}
        <circle cx="12" cy="7.5" r="1.5" />
        {/* Batang bawah huruf i */}
        <rect x="10.75" y="10.5" width="2.5" height="7" />
      </g>
    </svg>
  );
}