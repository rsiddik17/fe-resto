import { type SVGProps } from 'react';

export default function UserIconSingle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      {/* Kepala: Mengikuti warna className */}
      <circle cx="12" cy="8" r="4.5" fill="currentColor" />
      
      {/* Bahu/Torso Padat: Mengikuti warna className */}
      <path 
        fill="currentColor" 
        d="M12 14c-4.4 0-8 2.2-8 5v1.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V19c0-2.8-3.6-5-8-5z" 
      />
    </svg>
  );
}