import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCampaignBySlug } from '@/lib/actions/campaigns';
import { formatBloodType, isCampaignExpired } from '@/lib/utils';
import { CardGenerator } from './CardGenerator';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign || isCampaignExpired(campaign.created_at)) return { title: 'Campanha Encerrada — Doe Vida' };

  const bloodLabel = formatBloodType(campaign.blood_type);

  return {
    title: `Compartilhar: ${campaign.patient_name} precisa de sangue (${bloodLabel}) — Doe Vida`,
    description: 'Gere cards profissionais para Instagram e WhatsApp e ajude a divulgar este pedido de doação de sangue.',
  };
}

export default async function CompartilharPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  // Se a campanha estiver com mais de 60 dias, redireciona para a página de campanha encerrada
  if (isCampaignExpired(campaign.created_at)) {
    redirect(`/c/${slug}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doevida.com.br';

  return <CardGenerator campaign={campaign} siteUrl={siteUrl} />;
}
