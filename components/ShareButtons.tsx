'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, MessageCircle, Loader2, Check } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { buildWhatsAppMessage } from '@/lib/utils';

interface ShareButtonsProps {
  campaign: Campaign;
  cardRef: React.RefObject<HTMLDivElement | null>;
  format: 'stories' | 'feed';
}

export function ShareButtons({ campaign, cardRef, format }: ShareButtonsProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `doe-vida-${campaign.slug}-${format}.png`;
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleWhatsApp = () => {
    try {
      const text = buildWhatsAppMessage(campaign);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      
      // Abre o WhatsApp diretamente
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Erro ao abrir WhatsApp:', err);
      alert('Não foi possível abrir o WhatsApp automaticamente.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex-1 flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5"
      >
        {downloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : downloaded ? (
          <Check className="w-5 h-5" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        {downloading ? 'Gerando PNG...' : downloaded ? 'Baixado!' : 'Baixar PNG'}
      </button>

      <button
        onClick={handleWhatsApp}
        className="flex-1 flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-0.5"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        Compartilhar no WhatsApp
      </button>
    </div>
  );
}
