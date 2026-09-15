'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({ url, size = 120, className = '' }: QRCodeDisplayProps) {
  return (
    <div className={`flex items-center justify-center bg-white p-2 rounded-xl shadow-sm ${className}`}>
      <QRCodeSVG
        value={url}
        size={size}
        level="H"
        includeMargin={false}
        fgColor="#0F172A"
        bgColor="#FFFFFF"
      />
    </div>
  );
}
