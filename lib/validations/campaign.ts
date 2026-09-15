import { z } from 'zod';

export const createCampaignSchema = z.object({
  patient_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  blood_type: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'QUALQUER'], {
    required_error: 'Selecione o tipo sanguíneo',
  }),
  donation_type: z.enum(['Sangue Total', 'Plaquetas', 'Plasma', 'Eritrócitos']).default('Sangue Total'),
  hospital_name: z.string().min(3, 'Nome do hospital é obrigatório').max(150),
  hemocenter_name: z.string().min(3, 'Nome do hemocentro é obrigatório').max(150),
  city: z.string().min(2, 'Cidade é obrigatória').max(100),
  state: z.string().length(2, 'Estado deve ter 2 caracteres (UF)'),
  patient_code: z.string().max(50).optional(),
  urgent_until: z.string().optional(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'Você deve concordar com os Termos de Uso e Política de Privacidade (LGPD).',
  }),
});

export const updateCampaignSchema = z.object({
  hospital_name: z.string().min(3, 'Nome do hospital é obrigatório').max(150),
  hemocenter_name: z.string().min(3, 'Nome do hemocentro é obrigatório').max(150),
  city: z.string().min(2, 'Cidade é obrigatória').max(100),
  state: z.string().length(2, 'Estado deve ter 2 caracteres (UF)'),
  patient_code: z.string().max(50).optional(),
  urgent_until: z.string().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
