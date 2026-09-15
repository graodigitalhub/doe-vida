import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCampaignBySlug } from '@/lib/actions/campaigns';
import { CardGenerator } from './CardGenerator';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: 'Campanha não encontrada' };

  return {
    title: `Compartilhar: ${campaign.patient_name} precisa de ${campaign.blood_type} — Doe Vida`,
    description: 'Gere cards profissionais para Instagram e WhatsApp e ajude a divulgar este pedido de doação de sangue.',
  };
}

export default async function CompartilharPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doevida.com.br';

  return <CardGenerator campaign={campaign} siteUrl={siteUrl} />;
}
