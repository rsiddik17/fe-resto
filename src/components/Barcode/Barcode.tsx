import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ value, className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      JsBarcode(svgRef.current, value, {
        width: 2,
        height: 60,
        displayValue: false,
        lineColor: '#000000',
        background: 'transparent',
        margin: 0,
      });
    }
  }, [value]);

  return <svg ref={svgRef} className={`w-full h-auto ${className}`} />;
};