import { forwardRef } from 'react';
import { Campaign } from '@/types/campaign';
import { BLOOD_TYPE_CONFIG, isAnyBloodType } from '@/lib/utils';
import { QRCodeDisplay } from './QRCodeDisplay';

interface CardStoriesProps {
  campaign: Campaign;
  siteUrl?: string;
}

export const CardStories = forwardRef<HTMLDivElement, CardStoriesProps>(
  ({ campaign, siteUrl = 'https://doevida.com.br' }, ref) => {
    const bloodConfig = BLOOD_TYPE_CONFIG[campaign.blood_type] ?? BLOOD_TYPE_CONFIG['O+'];
    const baseUrl = siteUrl || 'https://doevida.com.br';
    const qrUrl = `${baseUrl}/c/${campaign.slug}`;

    return (
      <div
        ref={ref}
        style={{ width: 540, height: 960, fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}
        className="relative flex flex-col overflow-hidden bg-white rounded-3xl border border-slate-100"
      >
        {/* Fundo com gradiente suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-50 via-white to-red-50" />
        <div className="absolute top-0 left-0 right-0 h-64 opacity-50"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #FCA5A5 0%, transparent 70%)' }}
        />

        {/* Partículas decorativas */}
        <div className="absolute top-8 left-8 w-20 h-20 rounded-full border border-red-200 opacity-60" />
        <div className="absolute top-16 right-12 w-10 h-10 rounded-full border border-red-300 opacity-40" />
        <div className="absolute bottom-40 left-12 w-6 h-6 rounded-full bg-red-200 opacity-60" />

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo + header + badge urgência */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4C20 4 8 16 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 16 20 4 20 4Z" fill="white"/>
                  <path d="M20 27.5C20 27.5 13.5 22 13.5 17.5C13.5 15.015 15.515 13 18 13C19.105 13 20 13.895 20 13.895C20 13.895 20.895 13 22 13C24.485 13 26.5 15.015 26.5 17.5C26.5 22 20 27.5 20 27.5Z" fill="#DC2626" opacity="0.8"/>
                </svg>
              </div>
              <div>
                <div className="text-slate-900 font-bold text-lg leading-none">
                  Doe <span className="text-red-600">Vida</span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">doevida.com.br</div>
              </div>
            </div>

            {/* Urgência ao lado do logo */}
            <div className="inline-flex items-center bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md shadow-red-200 tracking-wide">
              🚨 PEDIDO URGENTE
            </div>
          </div>

          {/* Foto do Paciente e Tipo sanguíneo */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {campaign.patient_photo_url ? (
              <>
                <div className="mb-4 rounded-full p-1.5 bg-white shadow-xl shadow-red-100">
                  <img 
                    src={campaign.patient_photo_url} 
                    alt={campaign.patient_name}
                    className="w-48 h-48 object-cover rounded-full"
                  />
                </div>
                {isAnyBloodType(campaign.blood_type) ? (
                  <div className="flex flex-col items-center my-2">
                    <span className="mb-1 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Precisa-se de Sangue
                    </span>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2 rounded-full shadow-lg shadow-red-200/60 mb-1.5">
                      <span className="text-lg">🩸</span>
                      <span className="font-black text-lg tracking-tight uppercase">Qualquer Tipo</span>
                    </div>
                    <span className="text-slate-600 font-bold text-xs bg-white/90 border border-slate-200/80 px-3.5 py-1 rounded-full shadow-xs">
                      Aceita todos os doadores
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mb-1 text-slate-500 text-xs font-semibold uppercase tracking-widest">
                      Precisa-se de Sangue
                    </div>
                    <div className="font-black leading-none mb-1 text-[72px] text-red-600">
                      {campaign.blood_type}
                    </div>
                    <div className="text-slate-600 font-bold text-sm bg-red-50 px-3.5 py-1 rounded-full border border-red-100">
                      {bloodConfig.label}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-48 h-48 rounded-full bg-white shadow-xl shadow-red-100 border-4 border-white flex items-center justify-center mb-2">
                {isAnyBloodType(campaign.blood_type) ? (
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <span className="text-3xl mb-1">🩸</span>
                    <span className="font-black text-lg text-red-600 uppercase leading-tight">
                      Qualquer<br />Tipo
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      Todos os doadores
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="font-black leading-none tracking-tighter text-[60px] text-red-600">
                      {campaign.blood_type}
                    </div>
                    <div className="text-slate-500 text-xs font-bold mt-1">
                      {bloodConfig.label}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dados em Cards de vidro (Light theme) */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-slate-200 shadow-xl shadow-slate-100/50 text-left">
            <div className="space-y-4">
              <div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Paciente</div>
                <div className="text-slate-900 font-black text-xl leading-tight">{campaign.patient_name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Internado em</div>
                  <div className="text-slate-900 font-bold text-base leading-snug">{campaign.hospital_name}</div>
                  {campaign.patient_code && (
                    <div className="text-red-600 font-semibold text-xs mt-0.5">Leito: {campaign.patient_code}</div>
                  )}
                </div>
                <div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Onde doar</div>
                  <div className="text-slate-900 font-bold text-base leading-snug">{campaign.hemocenter_name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{campaign.city} - {campaign.state}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer com QR Code */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex-1 pr-6">
              <p className="text-slate-900 font-bold text-lg leading-tight mb-2">
                Aponte a câmera e saiba como doar
              </p>
              <p className="text-red-600 font-medium text-sm">
                Compartilhe e salve vidas ❤️
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-100">
              <QRCodeDisplay url={qrUrl} size={84} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CardStories.displayName = 'CardStories';
