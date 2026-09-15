import { ImageResponse } from 'next/og';
import { getCampaignBySlug } from '@/lib/actions/campaigns';
import { BLOOD_TYPE_CONFIG } from '@/lib/utils';

export const runtime = 'edge';

export const alt = 'Pedido de Doação de Sangue — Doe Vida';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(to bottom right, #FEF2F2, #FFFFFF)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626',
            fontWeight: 'bold',
          }}
        >
          Doe Vida — doe-vida.com.br
        </div>
      ),
      { ...size }
    );
  }

  const bloodConfig = BLOOD_TYPE_CONFIG[campaign.blood_type] ?? BLOOD_TYPE_CONFIG['O+'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          padding: '48px 60px',
          backgroundImage: 'radial-gradient(circle at 100% 0%, #FEE2E2 0%, #FFFFFF 60%)',
          fontFamily: 'sans-serif',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                backgroundColor: '#DC2626',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              🩸
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A' }}>
                Doe <span style={{ color: '#DC2626' }}>Vida</span>
              </div>
              <div style={{ fontSize: '15px', color: '#64748B', fontWeight: 'bold' }}>
                doe-vida.com.br
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '10px 24px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🚨 PEDIDO URGENTE DE DOAÇÃO
          </div>
        </div>

        {/* Main Body */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          {/* Patient Photo or Blood Type Badge */}
          {campaign.patient_photo_url ? (
            <img
              src={campaign.patient_photo_url}
              alt={campaign.patient_name}
              style={{
                width: '210px',
                height: '210px',
                borderRadius: '999px',
                objectFit: 'cover',
                border: '6px solid #FEE2E2',
              }}
            />
          ) : (
            <div
              style={{
                width: '210px',
                height: '210px',
                borderRadius: '999px',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '6px solid #FEE2E2',
              }}
            >
              <span style={{ fontSize: '72px', fontWeight: '900', color: bloodConfig.color }}>
                {campaign.blood_type}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: '20px', color: '#DC2626', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {campaign.donation_type}
            </div>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#0F172A', lineHeight: 1.1, margin: '8px 0 16px 0' }}>
              {campaign.patient_name}
            </div>
            <div style={{ fontSize: '24px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Precisa de sangue <strong style={{ color: bloodConfig.color, marginLeft: '6px', fontSize: '32px' }}>{campaign.blood_type}</strong>
            </div>
          </div>
        </div>

        {/* Bottom Details Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #F1F5F9',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>Hospital</span>
              <span style={{ fontSize: '18px', color: '#1E293B', fontWeight: 'bold' }}>{campaign.hospital_name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>Hemocentro</span>
              <span style={{ fontSize: '18px', color: '#1E293B', fontWeight: 'bold' }}>{campaign.hemocenter_name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase' }}>Local</span>
              <span style={{ fontSize: '18px', color: '#1E293B', fontWeight: 'bold' }}>{campaign.city} - {campaign.state}</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              color: '#DC2626',
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '10px 20px',
              borderRadius: '14px',
            }}
          >
            doe-vida.com.br
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
