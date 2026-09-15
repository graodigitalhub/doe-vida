import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, Clock, Users } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { BLOOD_TYPE_CONFIG, formatDate, isUrgent } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const bloodConfig = BLOOD_TYPE_CONFIG[campaign.blood_type] ?? BLOOD_TYPE_CONFIG['O+'];
  const urgent = isUrgent(campaign.urgent_until);

  return (
    <Link href={`/c/${campaign.slug}`} className="group block">
      <div className="relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        {/* Linha decorativa superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-red-600" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bloodConfig.bg} border-2 border-red-100 shadow-sm`}>
              <span className={`font-black text-2xl ${bloodConfig.color}`}>
                {campaign.blood_type}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-lg leading-tight truncate group-hover:text-red-600 transition-colors">
                {campaign.patient_name}
              </h3>
              <p className="text-sm text-slate-500 truncate mt-0.5">
                {campaign.hospital_name}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1">
                {campaign.donation_type}
              </p>
            </div>
            
            {campaign.patient_photo_url && (
              <div className="relative w-14 h-14 shrink-0">
                <Image 
                  src={campaign.patient_photo_url} 
                  alt={campaign.patient_name} 
                  fill
                  sizes="56px"
                  className="rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2 mb-4">
            {urgent && (
              <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-red-100 animate-pulse">
                <Clock className="w-3 h-3" />
                URGENTE
              </span>
            )}
            {!urgent && campaign.status === 'active' && (
              <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full border border-teal-200">
                <Heart className="w-3 h-3 fill-teal-500" />
                Ativo
              </span>
            )}
            {campaign.pledges_count > 0 && (
              <span className="flex items-center gap-1 bg-rose-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-100">
                <Users className="w-3 h-3" />
                {campaign.pledges_count} {campaign.pledges_count === 1 ? 'doador a caminho' : 'doadores a caminho'}
              </span>
            )}
          </div>

          {/* Hospital e localização */}
          <div className="space-y-1.5 pt-2 border-t border-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-4 h-4 text-slate-400">🏥</span>
              <span className="truncate">{campaign.hemocenter_name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{campaign.city} - {campaign.state}</span>
            </div>
          </div>

          {/* Urgência */}
          {campaign.urgent_until && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Urgente até: <span className="font-semibold text-slate-600">{formatDate(campaign.urgent_until)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
