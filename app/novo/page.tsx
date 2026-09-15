'use client';

import { useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, Heart, ShieldCheck, Calendar, Info } from 'lucide-react';
import { createCampaign } from '@/lib/actions/campaigns';
import { createCampaignSchema, CreateCampaignInput } from '@/lib/validations/campaign';
import { BLOOD_TYPE_CONFIG, BRAZIL_STATES } from '@/lib/utils';
import { TermsDialog } from '@/components/TermsDialog';

const DONATION_TYPES = ['Sangue Total', 'Plaquetas', 'Plasma', 'Eritrócitos'] as const;

// Helper para comprimir imagem no navegador antes do upload
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const maxDim = 1200;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else resolve(file);
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => resolve(file);
  });
}

export default function NovoCampaignPage() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCampaignInput>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: { 
      donation_type: 'Sangue Total',
      terms_accepted: false,
    },
  });

  const termsAccepted = watch('terms_accepted');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('A foto selecionada é muito grande. Escolha uma imagem com até 10MB.');
        e.target.value = '';
        return;
      }
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const onSubmit = (data: CreateCampaignInput, event?: React.BaseSyntheticEvent) => {
    setServerError(null);
    startTransition(async () => {
      const formElement = event?.target as HTMLFormElement;
      const formData = new FormData(formElement);

      // Se houver arquivo selecionado, comprime no cliente
      const file = fileInputRef.current?.files?.[0];
      if (file && file.size > 0) {
        try {
          const compressedBlob = await compressImage(file);
          formData.set('photo', compressedBlob, 'patient_photo.jpg');
        } catch (e) {
          console.warn('Compressão falhou, enviando arquivo original', e);
        }
      }

      formData.set('terms_accepted', 'true');

      const result = await createCampaign(formData);
      if (result?.error) {
        const firstError = Object.values(result.error).flat()[0];
        setServerError(firstError || 'Erro ao criar campanha. Tente novamente.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-semibold text-sm px-4 py-2 rounded-full mb-4">
            🩸 Novo Pedido de Doação
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Crie sua campanha</h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Preencha os dados abaixo. Em segundos, seu pedido estará ativo e você receberá cards prontos para compartilhar.
          </p>
        </div>

        {/* Alerta de Validade de 60 Dias */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-6 flex items-start gap-3 text-amber-900 shadow-sm">
          <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Validade máxima de 60 dias:</span> Cada pedido permanece ativo por até 60 dias para manter as informações sempre atualizadas para os doadores. Você poderá encerrar a campanha a qualquer momento pelo seu link de edição.
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Faixa decorativa */}
          <div className="h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Nome do paciente */}
            <div>
              <label htmlFor="patient_name" className="block text-sm font-semibold text-slate-700 mb-2">
                Nome do Paciente <span className="text-red-500">*</span>
              </label>
              <input
                id="patient_name"
                type="text"
                placeholder="Ex: Maria da Silva"
                {...register('patient_name')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              />
              {errors.patient_name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.patient_name.message}</p>
              )}
            </div>

            {/* Tipo sanguíneo + tipo doação (responsivo: coluna única no mobile, 2 colunas no desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="blood_type" className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo Sanguíneo <span className="text-red-500">*</span>
                </label>
                <select
                  id="blood_type"
                  {...register('blood_type')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                >
                  <option value="">Selecione...</option>
                  {Object.entries(BLOOD_TYPE_CONFIG).map(([type, config]) => (
                    <option key={type} value={type}>{type} — {config.label}</option>
                  ))}
                </select>
                {errors.blood_type && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.blood_type.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="donation_type" className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo de Doação
                </label>
                <select
                  id="donation_type"
                  {...register('donation_type')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                >
                  {DONATION_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hospital */}
            <div>
              <label htmlFor="hospital_name" className="block text-sm font-semibold text-slate-700 mb-2">
                Hospital / Clínica <span className="text-red-500">*</span>
              </label>
              <input
                id="hospital_name"
                type="text"
                placeholder="Ex: Hospital de Base do Distrito Federal"
                {...register('hospital_name')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              />
              {errors.hospital_name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.hospital_name.message}</p>
              )}
            </div>

            {/* Hemocentro */}
            <div>
              <label htmlFor="hemocenter_name" className="block text-sm font-semibold text-slate-700 mb-2">
                Hemocentro (onde doar) <span className="text-red-500">*</span>
              </label>
              <input
                id="hemocenter_name"
                type="text"
                placeholder="Ex: HEMOCENTRO DF — HEMOBSB"
                {...register('hemocenter_name')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              />
              {errors.hemocenter_name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.hemocenter_name.message}</p>
              )}
            </div>

            {/* Cidade + Estado (responsivo: empilhado no mobile, 2+1 no tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Ex: Brasília"
                  {...register('city')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                />
                {errors.city && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-slate-700 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  id="state"
                  {...register('state')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                >
                  <option value="">UF</option>
                  {BRAZIL_STATES.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>

            {/* Foto do Paciente */}
            <div>
              <label htmlFor="photo" className="block text-sm font-semibold text-slate-700 mb-2">
                Foto do Paciente <span className="text-slate-400 font-normal">(Opcional, mas aumenta em até 3x o engajamento)</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                  ref={fileInputRef}
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {photoPreview && (
                  <div className="shrink-0 flex items-center gap-2">
                    <img 
                      src={photoPreview} 
                      alt="Prévia" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-red-200 shadow-sm"
                    />
                    <span className="text-xs text-teal-600 font-semibold">Foto carregada</span>
                  </div>
                )}
              </div>
            </div>

            {/* Campos opcionais */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Campos Opcionais</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patient_code" className="block text-sm font-semibold text-slate-700 mb-2">
                    Código / Leito
                  </label>
                  <input
                    id="patient_code"
                    type="text"
                    placeholder="Ex: 204-B"
                    {...register('patient_code')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="urgent_until" className="block text-sm font-semibold text-slate-700 mb-2">
                    Urgente até
                  </label>
                  <input
                    id="urgent_until"
                    type="date"
                    {...register('urgent_until')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox Termos de Uso e LGPD */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <input
                  id="terms_accepted"
                  type="checkbox"
                  {...register('terms_accepted')}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="terms_accepted" className="text-sm text-slate-700 leading-normal cursor-pointer select-none">
                  Declaro ter consentimento do paciente ou responsável legal e concordo com os{' '}
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="text-red-600 hover:text-red-700 font-bold underline underline-offset-2"
                  >
                    Termos de Uso e Política de Privacidade (LGPD)
                  </button>
                  , ciente da validade máxima de 60 dias da campanha. <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.terms_accepted && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1 font-medium">
                  ⚠️ {errors.terms_accepted.message}
                </p>
              )}
            </div>

            {/* Erro servidor */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                ⚠️ {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="submit-campaign"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 shadow-xl shadow-red-100 hover:shadow-red-200 hover:-translate-y-0.5 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando campanha e gerando cards...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white" />
                  Criar Pedido e Gerar Cards
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-slate-400">
              Você receberá um link seguro de edição para atualizar dados ou encerrar a campanha quando necessário.
            </p>
          </div>
        </form>
      </div>

      {/* Modal de Termos de Uso e LGPD */}
      <TermsDialog isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}
