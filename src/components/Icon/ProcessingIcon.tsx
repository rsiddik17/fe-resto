import { type SVGProps } from 'react';

export default function ProcessingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" {...props}>
      <g 
        fill="none" 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="4"
      >
        <path fill="currentColor" d="M42 36V20H14v16a6 6 0 0 0 6 6h16a6 6 0 0 0 6-6" />
        <path d="M4 20h40M18 8v4m10-6v6m10-4v4" />
      </g>
    </svg>
  );
}