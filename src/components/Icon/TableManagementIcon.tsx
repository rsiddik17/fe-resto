import { type SVGProps } from 'react';

export default function TableManagementIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 80 80" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1">
        <path strokeWidth="6" d="M8 12h64" />
        <rect width="16" height="48" x="8" y="20" fill="currentColor" strokeWidth="4" rx="4" />
        <rect width="40" height="20" x="32" y="20" fill="currentColor" strokeWidth="4" rx="4" />
        <rect width="40" height="20" x="32" y="48" fill="currentColor" strokeWidth="4" rx="4" />
      </g>
    </svg>
  );
}