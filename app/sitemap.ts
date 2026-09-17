import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // Revalida o sitemap a cada 1 hora

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doevida.com.br';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/novo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return staticRoutes;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const sixtyDaysAgo = new Date(Date.now() - SIXTY_DAYS_MS).toISOString();

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('slug, created_at')
      .eq('status', 'active')
      .gte('created_at', sixtyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !campaigns) {
      return staticRoutes;
    }

    const campaignRoutes: MetadataRoute.Sitemap = campaigns.map((campaign) => ({
      url: `${baseUrl}/c/${campaign.slug}`,
      lastModified: campaign.created_at ? new Date(campaign.created_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    return [...staticRoutes, ...campaignRoutes];
  } catch (error) {
    console.error('Erro ao gerar sitemap dinâmico:', error);
    return staticRoutes;
  }
}
