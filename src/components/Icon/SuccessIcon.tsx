import React, { type SVGProps } from 'react';

export default function SuccessIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" {...props}>
      {/* Lingkaran: Akan mengikuti warna dari className (misal: text-primary) */}
      <circle cx="24" cy="24" r="20" fill="currentColor" />
      
      {/* Ceklis: Secara eksplisit diatur ke warna putih */}
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