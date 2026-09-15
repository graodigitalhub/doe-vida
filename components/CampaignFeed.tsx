'use client';

import { useState, useMemo } from 'react';
import { CampaignCard } from './CampaignCard';
import { CampaignFilters } from './CampaignFilters';
import { Campaign } from '@/types/campaign';
import { Droplets } from 'lucide-react';

interface CampaignFeedProps {
  initialCampaigns: Campaign[];
}

export function CampaignFeed({ initialCampaigns }: CampaignFeedProps) {
  const [filters, setFilters] = useState({ state: '', city: '', blood_type: '' });

  const filtered = useMemo(() => {
    return initialCampaigns.filter(c => {
      if (filters.state && c.state !== filters.state) return false;
      if (filters.city && !c.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.blood_type && c.blood_type !== filters.blood_type) return false;
      return true;
    });
  }, [initialCampaigns, filters]);

  return (
    <section id="campanhas" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 font-semibold text-sm px-4 py-2 rounded-full mb-4 border border-red-100">
          <Droplets className="w-4 h-4 fill-red-400" />
          Campanhas Ativas
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
          Pedidos que precisam de você
        </h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Cada campanha é uma vida que espera por um herói. Encontre pedidos próximos a você.
        </p>
      </div>

      <CampaignFilters onFilter={setFilters} />

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🩸</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            {initialCampaigns.length === 0
              ? 'Nenhuma campanha ativa ainda'
              : 'Nenhuma campanha encontrada com esses filtros'}
          </h3>
          <p className="text-slate-400">
            {initialCampaigns.length === 0
              ? 'Seja o primeiro a cadastrar um pedido de doação!'
              : 'Tente ajustar os filtros para encontrar mais campanhas.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </section>
  );
}
