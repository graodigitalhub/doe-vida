'use client';

import { useRef, useState } from 'react';
import { Smartphone, LayoutGrid, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Campaign } from '@/types/campaign';
import { formatBloodType } from '@/lib/utils';
import { CardStories } from '@/components/CardStories';
import { CardFeed } from '@/components/CardFeed';
import { ShareButtons } from '@/components/ShareButtons';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';

interface CardGeneratorProps {
  campaign: Campaign;
  siteUrl: string;
}

export function CardGenerator({ campaign, siteUrl: initialSiteUrl }: CardGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'stories' | 'feed'>('stories');
  const storiesRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Usa o origin do navegador se disponível, ou o initialSiteUrl, ou fallback final
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const siteUrl = initialSiteUrl || currentOrigin || 'https://doevida.com.br';

  const activeRef = activeTab === 'stories' ? storiesRef : feedRef;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href={`/c/${campaign.slug}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao pedido
          </Link>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-full mb-4 border border-red-200">
            🎨 Gerador de Cards
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            Cards para Compartilhar
          </h1>
          <p className="text-slate-600 text-lg">
            Escolha o formato, baixe a imagem e compartilhe nas redes sociais.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 px-2">
          <button
            onClick={() => setActiveTab('stories')}
            id="tab-stories"
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              activeTab === 'stories'
                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Stories / Status</span>
            <span className="sm:hidden">Stories</span> (9:16)
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            id="tab-feed"
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              activeTab === 'feed'
                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Feed / Post</span>
            <span className="sm:hidden">Feed</span> (1:1)
          </button>
        </div>

        {/* Preview do card (Adaptado para mobile e desktop sem quebra de overflow) */}
        <div className="flex justify-center mb-8 overflow-hidden w-full max-w-full px-1">
          <div className="relative flex justify-center items-start w-full">
            <div className="absolute inset-0 bg-red-100 blur-3xl rounded-full opacity-40 pointer-events-none" />

            {/* Stories: escala adaptativa para caber em qualquer mobile */}
            <div
              className="relative transition-all duration-300 shadow-2xl shadow-slate-200/50 rounded-3xl"
              style={{
                display: activeTab === 'stories' ? 'block' : 'none',
                transform: 'scale(var(--card-scale-stories, 0.52))',
                transformOrigin: 'top center',
                marginBottom: activeTab === 'stories' ? '-450px' : '0',
              }}
            >
              <CardStories ref={storiesRef} campaign={campaign} siteUrl={siteUrl} />
            </div>

            {/* Feed: escala adaptativa para caber em qualquer mobile */}
            <div
              className="relative transition-all duration-300 shadow-2xl shadow-slate-200/50 rounded-3xl"
              style={{
                display: activeTab === 'feed' ? 'block' : 'none',
                transform: 'scale(var(--card-scale-feed, 0.65))',
                transformOrigin: 'top center',
                marginBottom: activeTab === 'feed' ? '-185px' : '0',
              }}
            >
              <CardFeed ref={feedRef} campaign={campaign} siteUrl={siteUrl} />
            </div>
          </div>
        </div>

        {/* Botões de compartilhamento */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
          <p className="text-slate-600 font-semibold text-center text-xs sm:text-sm mb-5">
            {activeTab === 'stories'
              ? '📱 Card Stories (1080×1920px) — Ideal para Instagram Stories e Status do WhatsApp'
              : '🖼️ Card Feed (1080×1080px) — Ideal para posts no Feed do Instagram e Facebook'}
          </p>
          <ShareButtons campaign={campaign} cardRef={activeRef} format={activeTab} />
        </div>

        {/* Informações da campanha */}
        <div className="mt-6 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 className="text-slate-900 font-bold mb-4 text-xs uppercase tracking-wider">Dados do Pedido</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'Paciente', value: campaign.patient_name },
              { label: 'Tipo', value: formatBloodType(campaign.blood_type) },
              { label: 'Doação', value: campaign.donation_type },
              { label: 'Hemocentro', value: campaign.hemocenter_name },
              { label: 'Hospital', value: campaign.hospital_name },
              { label: 'Local', value: `${campaign.city} - ${campaign.state}` },
            ].map(item => (
              <div key={item.label}>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">{item.label}</div>
                <div className="text-slate-900 font-bold break-words">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 self-start">
              <QRCodeDisplay url={`${siteUrl}/c/${campaign.slug}`} size={75} />
            </div>
            <div className="min-w-0">
              <p className="text-slate-500 text-xs font-semibold mb-1">Link do pedido:</p>
              <p className="text-red-600 text-xs sm:text-sm font-mono font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 truncate block max-w-full">
                {siteUrl}/c/{campaign.slug}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
