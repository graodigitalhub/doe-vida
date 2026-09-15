'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';
import { createCampaignSchema, updateCampaignSchema } from '@/lib/validations/campaign';
import type { Campaign, UpdateCampaignInput } from '@/types/campaign';

import { v4 as uuidv4 } from 'uuid';

// Colunas públicas que nunca devem conter edit_token
const PUBLIC_CAMPAIGN_COLUMNS = 
  'id, slug, patient_name, blood_type, donation_type, hospital_name, hemocenter_name, city, state, patient_code, urgent_until, patient_photo_url, status, pledges_count, created_at';

// 60 dias em milissegundos
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export async function getCampaigns(filters?: {
  state?: string;
  city?: string;
  blood_type?: string;
}): Promise<Campaign[]> {
  const supabase = await createClient();
  const sixtyDaysAgo = new Date(Date.now() - SIXTY_DAYS_MS).toISOString();

  let query = supabase
    .from('campaigns')
    .select(PUBLIC_CAMPAIGN_COLUMNS)
    .eq('status', 'active')
    .gte('created_at', sixtyDaysAgo) // Regra de 60 dias: apenas campanhas recentes
    .order('created_at', { ascending: false })
    .limit(50);

  if (filters?.state) query = query.eq('state', filters.state);
  if (filters?.city) query = query.ilike('city', `%${filters.city}%`);
  if (filters?.blood_type) query = query.eq('blood_type', filters.blood_type);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as unknown as Campaign[]) ?? [];
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select(PUBLIC_CAMPAIGN_COLUMNS)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  // Checa se já completou 60 dias para marcar status como expirado visualmente
  const campaign = data as unknown as Campaign;
  const createdAtTime = new Date(campaign.created_at).getTime();
  if (Date.now() - createdAtTime > SIXTY_DAYS_MS && campaign.status === 'active') {
    campaign.status = 'completed';
  }

  return campaign;
}

// Verificação segura do token de edição no servidor sem vazar o token para o front-end
export async function verifyCampaignToken(slug: string, token: string | undefined): Promise<boolean> {
  if (!token || token.trim() === '') return false;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('id')
    .eq('slug', slug)
    .eq('edit_token', token)
    .single();

  return !error && !!data;
}

export async function createCampaign(formData: FormData) {
  const termsAccepted = formData.get('terms_accepted') === 'true' || formData.get('terms_accepted') === 'on';

  const raw = {
    patient_name:    formData.get('patient_name') as string,
    blood_type:      formData.get('blood_type') as string,
    donation_type:   formData.get('donation_type') as string,
    hospital_name:   formData.get('hospital_name') as string,
    hemocenter_name: formData.get('hemocenter_name') as string,
    city:            formData.get('city') as string,
    state:           formData.get('state') as string,
    patient_code:    formData.get('patient_code') as string || undefined,
    urgent_until:    formData.get('urgent_until') as string || undefined,
    terms_accepted:  termsAccepted,
  };

  const parsed = createCampaignSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const photoFile = formData.get('photo') as File | null;
  let patient_photo_url: string | null = null;
  const supabase = await createClient();

  // Validação segura do arquivo de imagem
  if (photoFile && photoFile.size > 0) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(photoFile.type)) {
      return { error: { photo: ['Formato de imagem inválido. Use JPG, PNG ou WebP.'] } };
    }
    // Limite máximo de 5MB
    if (photoFile.size > 5 * 1024 * 1024) {
      return { error: { photo: ['A foto deve ter no máximo 5MB.'] } };
    }

    const fileExt = photoFile.type.split('/')[1] === 'jpeg' ? 'jpg' : photoFile.type.split('/')[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('campaigns')
      .upload(fileName, photoFile, {
        contentType: photoFile.type,
        cacheControl: '3600',
        upsert: false,
      });
      
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('campaigns')
        .getPublicUrl(fileName);
      patient_photo_url = publicUrlData.publicUrl;
    }
  }

  const slug = generateSlug(parsed.data.patient_name);

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      patient_name: parsed.data.patient_name,
      blood_type: parsed.data.blood_type,
      donation_type: parsed.data.donation_type,
      hospital_name: parsed.data.hospital_name,
      hemocenter_name: parsed.data.hemocenter_name,
      city: parsed.data.city,
      state: parsed.data.state,
      patient_code: parsed.data.patient_code || null,
      urgent_until: parsed.data.urgent_until || null,
      patient_photo_url,
      slug,
      pledges_count: 0,
      terms_accepted_at: new Date().toISOString(),
    })
    .select('slug, edit_token')
    .single();

  if (error) return { error: { _form: [error.message] } };

  revalidatePath('/');
  redirect(`/c/${data.slug}/compartilhar?token=${data.edit_token}`);
}

export async function pledgeDonation(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('increment_pledge', {
    slug_param: slug,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${slug}`);
  revalidatePath('/');
  return { success: true, count: data as number };
}

export async function updateCampaign(slug: string, editToken: string, updates: UpdateCampaignInput) {
  const parsed = updateCampaignSchema.safeParse(updates);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('campaigns')
    .update({
      hospital_name: parsed.data.hospital_name,
      hemocenter_name: parsed.data.hemocenter_name,
      city: parsed.data.city,
      state: parsed.data.state,
      patient_code: parsed.data.patient_code || null,
      urgent_until: parsed.data.urgent_until || null,
    })
    .eq('slug', slug)
    .eq('edit_token', editToken);

  if (error) return { error: { _form: [error.message] } };

  revalidatePath(`/c/${slug}`);
  revalidatePath('/');
  return { success: true };
}

export async function completeCampaign(slug: string, editToken: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('campaigns')
    .update({ status: 'completed' })
    .eq('slug', slug)
    .eq('edit_token', editToken);

  if (error) return { error: error.message };

  revalidatePath(`/c/${slug}`);
  revalidatePath('/');
  return { success: true };
}
