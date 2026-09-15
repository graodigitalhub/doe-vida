'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, ExternalLink, Sparkles, MapPin, Building2, User } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { isUrgent, isAnyBloodType, getBloodSubtitle } from '@/lib/utils';

interface HeroCampaignCardProps {
  campaigns: Campaign[];
}

export function HeroCampaignCard({ campaigns }: HeroCampaignCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Considera até as 5 campanhas mais recentes
  const displayCampaigns = campaigns.slice(0, 5);
  const hasCampaigns = displayCampaigns.length > 0;
  const ROTATION_TIME = 5000; // 5 segundos

  // Auto-rotação
  useEffect(() => {
    if (!hasCampaigns || displayCampaigns.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      triggerSlide((currentIndex + 1) % displayCampaigns.length);
    }, ROTATION_TIME);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, hasCampaigns, displayCampaigns.length]);

  const triggerSlide = (nextIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 250);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerSlide((currentIndex + 1) % displayCampaigns.length);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerSlide((currentIndex - 1 + displayCampaigns.length) % displayCampaigns.length);
  };

  // Se não houver campanhas cadastradas, exibe um card com dados de exemplo
  if (!hasCampaigns) {
    return (
      <div className="hidden lg:flex items-center justify-center">
        <div className="relative w-84 animate-float">
          {/* Glow suave atrás do card */}
          <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-[2.5rem] blur-xl" />

          <div className="relative bg-white/95 backdrop-blur-sm border border-red-100 rounded-3xl p-6 shadow-2xl shadow-red-200/50">
            {/* Foto e Tipo Sanguíneo */}
            <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-gradient-to-br from-red-50/80 via-white to-rose-50/50 rounded-2xl border border-red-100">
              <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center text-3xl">
                👤
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">
                  Tipo Sanguíneo
                </span>
                <span className="text-5xl font-black text-red-600 leading-none block">
                  O-
                </span>
                <span className="inline-block mt-1 text-[11px] font-bold text-slate-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-xs">
                  Doador Universal
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 mb-4">
              <div className="flex justify-between text-slate-500">
                <span>Paciente</span>
                <span className="text-slate-900 font-bold">João Silva</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hemocentro</span>
                <span className="text-slate-900 font-semibold">HEMOPE</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Cidade</span>
                <span className="text-slate-900 font-semibold">Recife - PE</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-xs bg-red-50 py-3 px-4 rounded-xl border border-red-100">
              <Heart className="w-4 h-4 fill-red-600" />
              Compartilhe. Salve Vidas.
            </div>
          </div>

          <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white animate-pulse-ring">
            🚨 URGENTE
          </div>
        </div>
      </div>
    );
  }

  const current = displayCampaigns[currentIndex];
  const urgent = isUrgent(current.urgent_until);

  return (
    <div 
      className="hidden lg:flex flex-col items-center justify-center relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container principal com animação flutuante sutil */}
      <div className="relative w-84 animate-float group">
        
        {/* Glow atmosférico suave e dinâmico atrás do card */}
        <div className="absolute -inset-3 bg-gradient-to-tr from-red-500/25 via-rose-400/20 to-amber-500/10 rounded-[2.5rem] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative bg-white/95 backdrop-blur-sm border border-red-100/80 rounded-[2rem] p-6 shadow-2xl shadow-red-200/50 hover:shadow-red-300/60 transition-all duration-300 hover:scale-[1.01]">
          
          {/* Barrinhas estilo Story */}
          {displayCampaigns.length > 1 && (
            <div className="flex items-center gap-1.5 mb-4">
              {displayCampaigns.map((_, idx) => (
                <div 
                  key={idx} 
                  className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerSlide(idx);
                  }}
                >
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? 'w-full bg-red-600' 
                        : idx < currentIndex 
                          ? 'w-full bg-red-300' 
                          : 'w-0 bg-transparent'
                    }`} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* Cabeçalho do Card */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Pedido Recente
              </span>
            </div>
            
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100/90 px-2.5 py-1 rounded-full">
              {currentIndex + 1} de {displayCampaigns.length}
            </span>
          </div>

          {/* Conteúdo com transição suave */}
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}>
            
            {/* Bloco de Destaque: Foto do Paciente + Tipo Sanguíneo */}
            <div className="relative flex items-center justify-between gap-4 p-4 bg-gradient-to-br from-red-50/80 via-white to-rose-50/50 rounded-2xl border border-red-100 shadow-sm mb-4">
              
              {/* Foto do Paciente com anel decorativo */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-white shadow-md relative bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center ring-2 ring-red-500/20">
                  {current.patient_photo_url ? (
                    <img
                      src={current.patient_photo_url}
                      alt={current.patient_name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600 text-white font-black text-2xl shadow-inner select-none">
                      {current.patient_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Ícone sutil no canto da foto */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-red-100 text-[11px]">
                  🩸
                </div>
              </div>

              {/* Tipo Sanguíneo */}
              <div className="flex-1 flex flex-col items-end justify-center min-h-[72px] text-right">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                  Tipo Sanguíneo
                </span>
                {isAnyBloodType(current.blood_type) ? (
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs leading-none uppercase tracking-tight">
                      <span className="text-xs">🩸</span> Qualquer Tipo
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 mt-1.5">
                      Aceita todos os doadores
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="text-4xl sm:text-5xl tracking-tight font-black text-red-600 leading-none block">
                      {current.blood_type}
                    </span>
                    <span className="inline-block mt-1 text-[11px] font-bold text-slate-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-xs">
                      {getBloodSubtitle(current.blood_type)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Informações detalhadas do Paciente e Local */}
            <div className="space-y-2.5 text-xs bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80 mb-4">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  Paciente
                </span>
                <span className="text-slate-900 font-bold truncate max-w-[155px] text-right" title={current.patient_name}>
                  {current.patient_name}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Building2 className="w-3.5 h-3.5" />
                  Hemocentro
                </span>
                <span className="text-slate-900 font-semibold truncate max-w-[155px] text-right" title={current.hemocenter_name}>
                  {current.hemocenter_name}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  Local
                </span>
                <span className="text-slate-900 font-semibold truncate max-w-[155px] text-right">
                  {current.city} - {current.state}
                </span>
              </div>
            </div>

            {/* Botão de Ação Direto para a Campanha */}
            <Link
              href={`/c/${current.slug}`}
              className="group/btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-red-200/60 hover:shadow-lg hover:shadow-red-300/60 transition-all duration-200 active:scale-[0.98]"
            >
              <Heart className="w-3.5 h-3.5 fill-white group-hover/btn:scale-125 transition-transform" />
              <span>Ver Pedido & Ajudar</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>

          </div>

          {/* Botões de Navegação Manual nas Laterais */}
          {displayCampaigns.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                aria-label="Campanha anterior"
                className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:text-red-600 hover:scale-110 active:scale-95 transition-all z-20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                aria-label="Próxima campanha"
                className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-600 hover:text-red-600 hover:scale-110 active:scale-95 transition-all z-20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

        </div>

        {/* Badge Flutuante no Topo com animação de atenção */}
        {urgent ? (
          <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white animate-pulse-ring z-20 flex items-center gap-1">
            🚨 URGENTE
          </div>
        ) : (
          <div className="absolute -top-3 -right-3 bg-rose-600 text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white z-20 flex items-center gap-1 shadow-rose-200">
            <Sparkles className="w-3 h-3" /> PRECISA-SE
          </div>
        )}
      </div>

      {/* Dica de pausa ao passar mouse */}
      {displayCampaigns.length > 1 && (
        <p className="text-[11px] text-slate-400 font-medium mt-3 flex items-center gap-1">
          {isPaused ? '⏸️ Carrossel pausado' : '✨ Alternando automaticamente'}
        </p>
      )}
    </div>
  );
}
