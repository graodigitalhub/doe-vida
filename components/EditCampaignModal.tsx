'use client';

import { useState, useTransition } from 'react';
import { Edit3, X, Loader2, Check } from 'lucide-react';
import { updateCampaign } from '@/lib/actions/campaigns';
import { BRAZIL_STATES } from '@/lib/utils';
import { Campaign } from '@/types/campaign';

interface EditCampaignModalProps {
  campaign: Campaign;
  editToken: string;
}

export function EditCampaignModal({ campaign, editToken }: EditCampaignModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    hospital_name: campaign.hospital_name,
    hemocenter_name: campaign.hemocenter_name,
    city: campaign.city,
    state: campaign.state,
    patient_code: campaign.patient_code || '',
    urgent_until: campaign.urgent_until || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await updateCampaign(campaign.slug, editToken, {
        hospital_name: formData.hospital_name,
        hemocenter_name: formData.hemocenter_name,
        city: formData.city,
        state: formData.state,
        patient_code: formData.patient_code || undefined,
        urgent_until: formData.urgent_until || undefined,
      });

      if (res?.error) {
        const msg = Object.values(res.error).flat()[0] || 'Erro ao atualizar dados.';
        setError(msg);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
        }, 1500);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        id="btn-open-edit-modal"
        className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-2xl transition-all duration-200 shadow-sm"
      >
        <Edit3 className="w-4 h-4" />
        Editar Dados da Campanha
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-sm">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">Editar Campanha</h2>
                  <p className="text-xs text-slate-500">Atualize informações sobre o paciente ou local</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center shadow-sm border border-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Hospital / Clínica
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospital_name}
                  onChange={e => setFormData({ ...formData, hospital_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Hemocentro (onde doar)
                </label>
                <input
                  type="text"
                  required
                  value={formData.hemocenter_name}
                  onChange={e => setFormData({ ...formData, hemocenter_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Estado (UF)
                  </label>
                  <select
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    {BRAZIL_STATES.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Código / Leito
                  </label>
                  <input
                    type="text"
                    value={formData.patient_code}
                    onChange={e => setFormData({ ...formData, patient_code: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Urgente até
                  </label>
                  <input
                    type="date"
                    value={formData.urgent_until}
                    onChange={e => setFormData({ ...formData, urgent_until: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-medium">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="bg-teal-50 border border-teal-200 text-teal-700 p-3 rounded-xl text-xs font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Informações atualizadas com sucesso!
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-red-100"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
