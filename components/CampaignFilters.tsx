'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { BLOOD_TYPE_CONFIG, BRAZIL_STATES } from '@/lib/utils';
import { BloodType } from '@/types/campaign';

interface CampaignFiltersProps {
  onFilter: (filters: { state: string; city: string; blood_type: string }) => void;
}

export function CampaignFilters({ onFilter }: CampaignFiltersProps) {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [bloodType, setBloodType] = useState('');

  const handleChange = (updates: Partial<{ state: string; city: string; blood_type: string }>) => {
    const next = {
      state: updates.state !== undefined ? updates.state : state,
      city: updates.city !== undefined ? updates.city : city,
      blood_type: updates.blood_type !== undefined ? updates.blood_type : bloodType,
    };
    if (updates.state !== undefined) setState(updates.state);
    if (updates.city !== undefined) setCity(updates.city);
    if (updates.blood_type !== undefined) setBloodType(updates.blood_type);
    onFilter(next);
  };

  const reset = () => {
    setState('');
    setCity('');
    setBloodType('');
    onFilter({ state: '', city: '', blood_type: '' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-slate-800">Filtrar Campanhas</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Estado */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Estado (UF)</label>
          <select
            value={state}
            onChange={e => handleChange({ state: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
          >
            <option value="">Todos os estados</option>
            {BRAZIL_STATES.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Cidade</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cidade..."
              value={city}
              onChange={e => handleChange({ city: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Tipo Sanguíneo */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Tipo Sanguíneo</label>
          <select
            value={bloodType}
            onChange={e => handleChange({ blood_type: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
          >
            <option value="">Todos os tipos</option>
            {Object.entries(BLOOD_TYPE_CONFIG).map(([type, config]) => (
              <option key={type} value={type}>
                {type === 'QUALQUER' ? 'Qualquer Tipo' : `${type} — ${config.label}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(state || city || bloodType) && (
        <button
          onClick={reset}
          className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium underline underline-offset-2 transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
