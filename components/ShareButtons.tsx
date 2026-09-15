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
  const [downloadingWhatsApp, setDownloadingWhatsApp] = useState(false);
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

  const handleWhatsApp = async () => {
    if (!cardRef.current) return;
    setDownloadingWhatsApp(true);

    try {
      const text = buildWhatsAppMessage(campaign);
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      
      // Attempt native Web Share API (Mobile devices usually)
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `doacao-${campaign.slug}.png`, { type: 'image/png' });
        
        const shareData = {
          title: 'Pedido de Doação de Sangue',
          text: text,
          files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setDownloadingWhatsApp(false);
          return;
        }
      } catch (e) {
        // Ignore native share error and fallback to desktop strategy
        console.log('Native share failed or not supported, falling back...');
      }

      // Fallback strategy for Desktop / unsupported
      // 1. Download image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `doe-vida-${campaign.slug}-${format}.png`;
      link.click();

      // 2. Copy text to clipboard
      await navigator.clipboard.writeText(text);

      // 3. Alert user
      alert('A imagem do card foi baixada e o texto foi copiado para sua área de transferência!\n\nVocê será redirecionado para o WhatsApp. Lá, basta COLAR na conversa (Ctrl+V ou Segurar > Colar) para enviar a imagem junto com o texto.');

      // 4. Open WhatsApp
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');

    } catch (err) {
      console.error('Erro ao gerar card para WhatsApp:', err);
      alert('Houve um erro ao gerar o card. Tente baixar a imagem primeiro.');
    } finally {
      setDownloadingWhatsApp(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        onClick={handleDownload}
        disabled={downloading || downloadingWhatsApp}
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
        disabled={downloading || downloadingWhatsApp}
        className="flex-1 flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-0.5"
      >
        {downloadingWhatsApp ? (
          <Loader2 className="w-5 h-5 animate-spin fill-white" />
        ) : (
          <MessageCircle className="w-5 h-5 fill-white" />
        )}
        {downloadingWhatsApp ? 'Preparando...' : 'Compartilhar no WhatsApp'}
      </button>
    </div>
  );
}
