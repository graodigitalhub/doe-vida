import { forwardRef } from 'react';
import { Campaign } from '@/types/campaign';
import { BLOOD_TYPE_CONFIG, isAnyBloodType } from '@/lib/utils';
import { QRCodeDisplay } from './QRCodeDisplay';

interface CardFeedProps {
  campaign: Campaign;
  siteUrl?: string;
}

export const CardFeed = forwardRef<HTMLDivElement, CardFeedProps>(
  ({ campaign, siteUrl = 'https://doevida.com.br' }, ref) => {
    const bloodConfig = BLOOD_TYPE_CONFIG[campaign.blood_type] ?? BLOOD_TYPE_CONFIG['O+'];
    const baseUrl = siteUrl || 'https://doevida.com.br';
    const qrUrl = `${baseUrl}/c/${campaign.slug}`;

    return (
      <div
        ref={ref}
        style={{ width: 540, height: 540, fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}
        className="relative flex overflow-hidden bg-white rounded-3xl border border-slate-100"
      >
        {/* Fundo com gradiente suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50" />
        <div className="absolute top-0 right-0 w-64 h-64 opacity-40"
          style={{ background: 'radial-gradient(circle at 100% 0%, #FCA5A5 0%, transparent 70%)' }}
        />

        {/* Partículas decorativas */}
        <div className="absolute top-10 right-10 w-3 h-3 bg-red-400 rounded-full opacity-60" />
        <div className="absolute bottom-12 left-10 w-2 h-2 bg-red-500 rounded-full opacity-50" />

        {/* Conteúdo flexível lado a lado */}
        <div className="relative z-10 flex w-full p-8 gap-8">
          
          {/* Lado Esquerdo (Tipo e Foto) */}
          <div className="flex-1 flex flex-col items-center justify-center border-r border-slate-200 pr-8">
            <div className="bg-red-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 shadow-md shadow-red-200">
              🚨 PEDIDO DE DOAÇÃO
            </div>
            
            {campaign.patient_photo_url ? (
              <img 
                src={campaign.patient_photo_url} 
                alt={campaign.patient_name}
                className="w-52 h-52 object-cover rounded-full mb-6 shadow-xl shadow-red-100 border-4 border-white"
              />
            ) : (
              <div className="w-52 h-52 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-100 border-4 border-white">
                {isAnyBloodType(campaign.blood_type) ? (
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <span className="text-2xl mb-1">🩸</span>
                    <span className="font-black text-base text-red-600 uppercase leading-tight">
                      Qualquer<br />Tipo
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      Todos os doadores
                    </span>
                  </div>
                ) : (
                  <div className="font-black leading-none tracking-tighter text-[64px] text-red-600">
                    {campaign.blood_type}
                  </div>
                )}
              </div>
            )}
            
            {campaign.patient_photo_url && (
              isAnyBloodType(campaign.blood_type) ? (
                <div className="mt-2 flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 rounded-full shadow-md shadow-red-200/50">
                    <span className="text-xs">🩸</span>
                    <span className="font-black text-[11px] uppercase tracking-tight">Qualquer Tipo</span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-semibold mt-1">
                    Aceita todos os doadores
                  </span>
                </div>
              ) : (
                <>
                  <div className="mt-2 mb-0.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center">
                    Precisa-se de Sangue
                  </div>
                  <div className="font-black leading-none tracking-tighter text-[48px] text-red-600">
                    {campaign.blood_type}
                  </div>
                </>
              )
            )}
          </div>

          {/* Lado Direito (Informações) */}
          <div className="flex-1 flex flex-col justify-center gap-6 py-2">
            <div>
              {/* Logo pequena */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
                   <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
                    <path d="M20 4C20 4 8 16 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 16 20 4 20 4Z" fill="white"/>
                  </svg>
                </div>
                <div className="text-slate-900 font-bold text-sm leading-none">
                  Doe <span className="text-red-600">Vida</span>
                </div>
              </div>

              {/* Dados */}
              <div className="space-y-3">
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Paciente</div>
                  <div className="text-slate-900 font-bold text-base leading-tight line-clamp-2">{campaign.patient_name}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Internado em</div>
                  <div className="text-slate-900 font-bold text-xs leading-tight line-clamp-1">{campaign.hospital_name}</div>
                  {campaign.patient_code && (
                    <div className="text-red-600 font-semibold text-[10px] mt-0.5">Leito: {campaign.patient_code}</div>
                  )}
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Onde doar</div>
                  <div className="text-slate-900 font-bold text-xs leading-tight line-clamp-1">{campaign.hemocenter_name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{campaign.city} - {campaign.state}</div>
                </div>
              </div>
            </div>

            {/* QR Code footer */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <QRCodeDisplay url={qrUrl} size={48} />
              <div>
                <div className="text-slate-900 text-[11px] font-bold leading-tight">Escaneie para<br/>saber mais</div>
                <div className="text-red-600 text-[9px] font-bold mt-0.5 tracking-wider">SALVE VIDAS</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
);
CardFeed.displayName = 'CardFeed';
