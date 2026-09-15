import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  const base = slugify(name, { lower: true, strict: true, locale: 'pt' });
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function isUrgent(urgentUntil: string | null): boolean {
  if (!urgentUntil) return false;
  const diff = new Date(urgentUntil).getTime() - Date.now();
  return diff > 0 && diff < 72 * 60 * 60 * 1000; // 72h
}

export const BLOOD_TYPE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'A+':      { color: 'text-red-600',   bg: 'bg-red-50',   label: 'A Positivo' },
  'A-':      { color: 'text-red-700',   bg: 'bg-red-100',  label: 'A Negativo' },
  'B+':      { color: 'text-orange-600',bg: 'bg-orange-50',label: 'B Positivo' },
  'B-':      { color: 'text-orange-700',bg: 'bg-orange-100',label: 'B Negativo' },
  'AB+':     { color: 'text-purple-600',bg: 'bg-purple-50',label: 'AB Positivo' },
  'AB-':     { color: 'text-purple-700',bg: 'bg-purple-100',label: 'AB Negativo' },
  'O+':      { color: 'text-rose-600',  bg: 'bg-rose-50',  label: 'O Positivo' },
  'O-':      { color: 'text-rose-800',  bg: 'bg-rose-100', label: 'O Negativo' },
  'QUALQUER':{ color: 'text-red-600',   bg: 'bg-red-50',   label: 'Qualquer Tipo' },
};

export function isAnyBloodType(type?: string | null): boolean {
  if (!type) return false;
  const normalized = type.trim().toUpperCase();
  return normalized === 'QUALQUER' || normalized === 'QUALQUER TIPO' || normalized === 'TODOS' || normalized === 'TODOS OS TIPOS';
}

export function formatBloodType(type?: string | null): string {
  if (isAnyBloodType(type)) return 'Qualquer Tipo';
  return type?.trim() || '';
}

export function getBloodSubtitle(type?: string | null): string {
  if (isAnyBloodType(type)) return 'Aceita todos os doadores';
  switch (type) {
    case 'O-':
      return 'Doador Universal';
    case 'AB+':
      return 'Receptor Universal';
    case 'O+':
      return 'Compatível com RH+';
    case 'A+':
    case 'A-':
      return 'Tipo A Necessário';
    case 'B+':
    case 'B-':
      return 'Tipo B Necessário';
    case 'AB-':
      return 'Tipo Raro';
    default:
      return 'Doação Necessária';
  }
}

export const BRAZIL_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

export function buildWhatsAppMessage(campaign: {
  patient_name: string;
  blood_type: string;
  hemocenter_name: string;
  city: string;
  state: string;
  slug: string;
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doevida.com.br';
  const bloodText = isAnyBloodType(campaign.blood_type)
    ? 'Qualquer Tipo (Aceita todos os doadores)'
    : campaign.blood_type;

  return (
    `🩸 *PEDIDO DE DOAÇÃO DE SANGUE URGENTE!*\n\n` +
    `👤 Paciente: *${campaign.patient_name}*\n` +
    `🩸 Tipo: *${bloodText}*\n` +
    `🏥 Hemocentro: *${campaign.hemocenter_name}*\n` +
    `📍 Local: *${campaign.city} - ${campaign.state}*\n\n` +
    `Por favor, compartilhe! Cada doação pode salvar até 4 vidas! ❤️\n` +
    `👉 ${siteUrl}/c/${campaign.slug}`
  );
}
