'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyDataButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleCopy}
      id="btn-copy-data"
      className="w-full flex items-center justify-center gap-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-teal-600" />
          <span className="text-teal-700">Dados copiados!</span>
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          Copiar Dados do Paciente
        </>
      )}
    </button>
  );
}
