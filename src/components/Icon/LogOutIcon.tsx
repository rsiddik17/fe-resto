import { type SVGProps } from 'react';

export default function LogOutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      {/* Gunakan fillRule="evenodd" untuk membuat area transparan di overlap ekor panah */}
      <g fill="currentColor" fillRule="evenodd">
        {/* Persegi Panjang Membulat (Latar belakang) */}
        <path d="M12.5 3a2.5 2.5 0 0 0-2.5 2.5v13a2.5 2.5 0 0 0 2.5 2.5H18.5a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 18.5 3h-6z" />
        {/* Panah (arah kanan, dengan ekor masuk ke dalam persegi) */}
        <path d="M14.5 11h-4v2h4l-2 2h3l3-3-3-3h-3l2 2z" />
      </g>
    </svg>
  );
}