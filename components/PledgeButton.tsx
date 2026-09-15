'use client';

import { useState, useTransition } from 'react';
import { Heart, Loader2, Check, Users } from 'lucide-react';
import { pledgeDonation } from '@/lib/actions/campaigns';

interface PledgeButtonProps {
  slug: string;
  initialCount: number;
}

export function PledgeButton({ slug, initialCount }: PledgeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasPledged, setHasPledged] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handlePledge = () => {
    if (hasPledged || isPending) return;

    startTransition(async () => {
      const res = await pledgeDonation(slug);
      if (res.success && typeof res.count === 'number') {
        setCount(res.count);
        setHasPledged(true);
      }
    });
  };

  return (
    <div className="bg-rose-50/70 border border-rose-100 rounded-3xl p-5 sm:p-6 text-center my-4 transition-all">
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100/70 px-3 py-1 rounded-full mb-3">
        <Users className="w-3.5 h-3.5" />
        Rede de Apoio
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
        {count} {count === 1 ? 'pessoa confirmou doação' : 'pessoas confirmaram doação'}
      </h3>
      <p className="text-slate-600 text-sm mb-4 max-w-md mx-auto">
        Vai até o hemocentro doar para esta campanha? Registre sua intenção para incentivar mais doadores e dar esperança à família.
      </p>

      <button
        onClick={handlePledge}
        disabled={hasPledged || isPending}
        id="btn-pledge-donation"
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-md ${
          hasPledged
            ? 'bg-teal-600 text-white cursor-default shadow-teal-100'
            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Registrando...
          </>
        ) : hasPledged ? (
          <>
            <Check className="w-4 h-4" />
            Obrigado! Sua intenção foi registrada ❤️
          </>
        ) : (
          <>
            <Heart className="w-4 h-4 fill-white" />
            Eu Vou Doar Sangue
          </>
        )}
      </button>
    </div>
  );
}
