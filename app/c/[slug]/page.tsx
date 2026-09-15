import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { MapPin, CheckCircle, Share2, Navigation, ShieldCheck } from 'lucide-react';
import { getCampaignBySlug, verifyCampaignToken } from '@/lib/actions/campaigns';
import { BLOOD_TYPE_CONFIG, formatDate, isUrgent } from '@/lib/utils';
import { CopyDataButton } from './CopyDataButton';
import { CompleteCampaignButton } from './CompleteCampaignButton';
import { PledgeButton } from '@/components/PledgeButton';
import { EditCampaignModal } from '@/components/EditCampaignModal';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: 'Campanha não encontrada — Doe Vida' };

  return {
    title: `${campaign.patient_name} precisa de ${campaign.blood_type} — Doe Vida`,
    description: `Pedido de doação de ${campaign.donation_type} tipo ${campaign.blood_type} para ${campaign.patient_name} em ${campaign.hemocenter_name}, ${campaign.city} - ${campaign.state}.`,
    openGraph: {
      title: `🚨 URGENTE: ${campaign.patient_name} precisa de ${campaign.blood_type}`,
      description: `Doe sangue e salve a vida de ${campaign.patient_name}. Hemocentro: ${campaign.hemocenter_name} (${campaign.city} - ${campaign.state}).`,
    },
  };
}

export default async function CampaignPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { token } = await searchParams;

  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  const bloodConfig = BLOOD_TYPE_CONFIG[campaign.blood_type] ?? BLOOD_TYPE_CONFIG['O+'];
  const urgent = isUrgent(campaign.urgent_until);
  
  // Verificação segura do token no servidor (sem expor o token no retorno público da API)
  const hasEditAccess = await verifyCampaignToken(slug, token);
  const isCompleted = campaign.status === 'completed';

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(campaign.hemocenter_name + ' ' + campaign.city + ' ' + campaign.state)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(campaign.hemocenter_name + ' ' + campaign.city)}`;

  const copyText = `🩸 Pedido de Doação de Sangue\n\nPaciente: ${campaign.patient_name}\nTipo: ${campaign.blood_type}\nHemocentro: ${campaign.hemocenter_name}\nHospital: ${campaign.hospital_name}\nLocal: ${campaign.city} - ${campaign.state}${campaign.patient_code ? `\nCódigo: ${campaign.patient_code}` : ''}\n\nAcesse: ${process.env.NEXT_PUBLIC_SITE_URL}/c/${campaign.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Status: concluído */}
        {isCompleted && (
          <div className="mb-6 bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-teal-800">Meta de doação atingida! 🎉</p>
              <p className="text-teal-600 text-sm">Esta campanha foi marcada como concluída ou atingiu o prazo de validade.</p>
            </div>
          </div>
        )}

        {/* Painel do Administrador/Criador com Token */}
        {hasEditAccess && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Acesso de Gestão Ativo:</span> Você está acessando pelo link de criador deste pedido.
              </div>
            </div>
          </div>
        )}

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
          {/* Header do Card */}
          <div className="bg-red-50 border-b border-red-100 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {campaign.patient_photo_url ? (
              <div className="relative w-40 h-40 md:w-52 md:h-52 shrink-0">
                <Image 
                  src={campaign.patient_photo_url} 
                  alt={campaign.patient_name}
                  fill
                  sizes="(max-width: 768px) 160px, 208px"
                  priority
                  className="object-cover rounded-full shadow-lg shadow-red-100 border-4 border-white"
                />
              </div>
            ) : (
              <div className="w-40 h-40 md:w-52 md:h-52 bg-white rounded-full flex items-center justify-center shadow-lg shadow-red-100 border-4 border-white flex-shrink-0">
                <div className="text-center">
                  <div className="text-5xl font-black mb-1" style={{ color: bloodConfig.color }}>
                    {campaign.blood_type}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full mb-4 shadow-sm shadow-red-200">
                🚨 {urgent ? 'URGENTE' : 'PRECISA-SE DE DOAÇÃO'}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
                {campaign.patient_name}
              </h1>
              {campaign.patient_code && (
                <p className="text-sm text-slate-500 mb-2">Código / Leito: <span className="font-semibold">{campaign.patient_code}</span></p>
              )}
              <p className="text-slate-600 text-lg">
                Precisa de doação de sangue <strong style={{ color: bloodConfig.color }}>{campaign.blood_type}</strong>
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Hospital e hemocentro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Hospital</p>
                <p className="font-bold text-slate-900">{campaign.hospital_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Onde Doar</p>
                <p className="font-bold text-slate-900">{campaign.hemocenter_name}</p>
              </div>
            </div>

            {/* Localização */}
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="font-semibold">{campaign.city} — {campaign.state}</span>
            </div>

            {/* Urgência */}
            {campaign.urgent_until && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                <span className="text-red-600 font-semibold">⏰ Urgente até: </span>
                <span className="text-red-800 font-bold">{formatDate(campaign.urgent_until)}</span>
              </div>
            )}

            {/* Botão "Eu Vou Doar" */}
            {!isCompleted && (
              <PledgeButton slug={campaign.slug} initialCount={campaign.pledges_count || 0} />
            )}

            <hr className="border-slate-100" />

            {/* Botões de ação */}
            <div className="space-y-3">
              {/* Como chegar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-maps"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl transition-all duration-200 shadow-md shadow-blue-100 hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4" />
                  Google Maps
                </a>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-waze"
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-5 py-3 rounded-2xl transition-all duration-200 shadow-md shadow-cyan-100 hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4" />
                  Waze
                </a>
              </div>

              {/* Copiar dados */}
              <CopyDataButton text={copyText} />

              {/* Compartilhar / gerar cards */}
              <Link
                href={`/c/${campaign.slug}/compartilhar${hasEditAccess ? `?token=${token}` : ''}`}
                id="btn-share-cards"
                className="w-full flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-red-100 hover:-translate-y-0.5"
              >
                <Share2 className="w-5 h-5" />
                Gerar e Compartilhar Cards
              </Link>
            </div>
          </div>
        </div>

        {/* Ações de Gestão (somente com token válido) */}
        {hasEditAccess && !isCompleted && (
          <div className="space-y-3">
            <EditCampaignModal campaign={campaign} editToken={token!} />
            <CompleteCampaignButton slug={campaign.slug} editToken={token!} />
          </div>
        )}

        {/* Link de volta */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-400 hover:text-red-500 transition-colors">
            ← Ver todas as campanhas
          </Link>
        </div>
      </div>
    </div>
  );
}
