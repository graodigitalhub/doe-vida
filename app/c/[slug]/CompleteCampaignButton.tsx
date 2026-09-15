'use client';

import { useState, useTransition } from 'react';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { completeCampaign } from '@/lib/actions/campaigns';

interface CompleteCampaignButtonProps {
  slug: string;
  editToken: string;
}

export function CompleteCampaignButton({ slug, editToken }: CompleteCampaignButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const handleComplete = () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    startTransition(async () => {
      const result = await completeCampaign(slug, editToken);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
      <p className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
        <CheckCircle className="w-4 h-4" />
        Gestão da Campanha
      </p>

      {error && (
        <div className="mb-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        onClick={handleComplete}
        id="btn-complete-campaign"
        disabled={isPending}
        className={`w-full flex items-center justify-center gap-2.5 font-bold px-6 py-3 rounded-2xl transition-all duration-200 ${
          confirm
            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-100'
            : 'bg-white hover:bg-teal-100 text-teal-800 border border-teal-200'
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Encerrando...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            {confirm ? '✅ Confirmar: Meta Atingida!' : 'Marcar como Meta Concluída'}
          </>
        )}
      </button>
      {confirm && !isPending && (
        <p className="text-xs text-teal-600 mt-2 text-center">
          Clique novamente para confirmar o encerramento.
        </p>
      )}
    </div>
  );
}
