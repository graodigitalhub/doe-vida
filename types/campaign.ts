export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'QUALQUER';
export type DonationType = 'Sangue Total' | 'Plaquetas' | 'Plasma' | 'Eritrócitos';
export type CampaignStatus = 'active' | 'completed';

export interface Campaign {
  id: string;
  slug: string;
  patient_name: string;
  blood_type: BloodType;
  donation_type: DonationType;
  hospital_name: string;
  hemocenter_name: string;
  city: string;
  state: string;
  patient_code: string | null;
  urgent_until: string | null;
  patient_photo_url: string | null;
  status: CampaignStatus;
  pledges_count: number;
  terms_accepted_at?: string;
  edit_token?: string; // Opcional: retornado apenas quando autenticado pelo token
  created_at: string;
}

export interface CreateCampaignInput {
  patient_name: string;
  blood_type: BloodType;
  donation_type: DonationType;
  hospital_name: string;
  hemocenter_name: string;
  city: string;
  state: string;
  patient_code?: string;
  urgent_until?: string;
  terms_accepted: boolean;
}

export interface UpdateCampaignInput {
  hospital_name?: string;
  hemocenter_name?: string;
  city?: string;
  state?: string;
  patient_code?: string;
  urgent_until?: string;
}
