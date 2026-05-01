import { type SVGProps } from 'react';

export default function OrderListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
      <path 
        fill="currentColor" 
        d="M21 11h-3V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v13c0 1.65 1.35 3 3 3h14c1.65 0 3-1.35 3-3v-6c0-.55-.45-1-1-1m-7 6h-3v-2h3zm0-4H6v-2h8zm0-4H6V7h8zm6 9c0 .55-.45 1-1 1s-1-.45-1-1v-5h2z" 
      />
    </svg>
  );
}