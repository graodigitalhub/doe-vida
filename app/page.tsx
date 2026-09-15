import Link from 'next/link';
import { Heart, Droplets, Share2, CheckCircle, Users, MapPin, ArrowRight } from 'lucide-react';
import { getCampaigns } from '@/lib/actions/campaigns';
import { CampaignFeed } from '@/components/CampaignFeed';
import { HeroCampaignCard } from '@/components/HeroCampaignCard';

export const revalidate = 60; // ISR: revalida a cada 60s

const STATS = [
  { icon: '🩸', value: '2.4k+', label: 'Campanhas Criadas' },
  { icon: '❤️', value: '9.6k+', label: 'Vidas Impactadas' },
  { icon: '🗺️', value: '27', label: 'Estados Cobertos' },
];

const DONOR_REQUIREMENTS = [
  'Ter entre 16 e 69 anos (menores com autorização)',
  'Pesar acima de 50 kg',
  'Estar em boas condições de saúde',
  'Ter dormido ao menos 6 horas',
  'Não ter feito tatuagem nos últimos 12 meses',
  'Não estar em jejum prolongado',
  'Não ter ingerido bebida alcoólica nas últimas 12h',
];

export default async function HomePage() {
  const campaigns = await getCampaigns();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-red-50">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-red-50" />

        {/* Glow decorativo */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #EF4444, transparent)' }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #DC2626, transparent)' }}
        />

        {/* Partículas flutuantes */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-red-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-40 w-2 h-2 bg-red-300 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-4 h-4 border border-red-400 rounded-full animate-pulse-ring" />
        <div className="absolute bottom-48 left-40 w-2 h-2 bg-red-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-full mb-6 border border-red-200">
              <Droplets className="w-4 h-4 fill-red-600" />
              Plataforma de Doação de Sangue
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] mb-6">
              Cada gota
              <span className="block text-gradient-red animate-gradient-x">
                conta.
              </span>
              <span className="block text-slate-800 text-4xl md:text-5xl mt-2">
                Doe vida hoje.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              Conectamos pacientes que precisam de doação de sangue com doadores dispostos a salvar vidas. Crie seu pedido em minutos e compartilhe nas redes sociais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/novo"
                id="hero-cta-criar"
                className="group flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl shadow-red-200 hover:shadow-red-300 hover:-translate-y-1"
              >
                🩸 Criar Pedido de Doação
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#campanhas"
                className="flex items-center justify-center gap-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-sm hover:border-slate-300"
              >
                Ver Campanhas Ativas
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-slate-900 font-black text-2xl">{stat.value}</div>
                  <div className="text-slate-500 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card com loop das últimas campanhas cadastradas */}
          <HeroCampaignCard campaigns={campaigns} />
        </div>

        {/* Scroll indicator */}
        <a href="#campanhas" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
          <span className="text-xs font-medium tracking-widest uppercase">Rolar</span>
          <div className="w-5 h-8 border border-slate-600 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-slate-500 rounded-full animate-bounce" />
          </div>
        </a>
      </section>

      {/* ===== FEED DE CAMPANHAS ===== */}
      <CampaignFeed initialCampaigns={campaigns} />

      {/* ===== COMO FUNCIONA ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-red-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Como funciona</h2>
            <p className="text-slate-500 text-lg">Simples, rápido e eficaz</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📋', step: '01', title: 'Cadastre o pedido', desc: 'Preencha o formulário com os dados do paciente, hospital e tipo sanguíneo necessário.' },
              { icon: '🎨', step: '02', title: 'Gere os cards', desc: 'Criamos automaticamente cards profissionais para Instagram Stories, Feed e WhatsApp.' },
              { icon: '📢', step: '03', title: 'Compartilhe e salve vidas', desc: 'Baixe as imagens e compartilhe nas redes. Cada compartilhamento aumenta as chances de doação.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="absolute -top-4 left-8 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 group-hover:animate-bounce">{item.icon}</div>
                <h3 className="font-bold text-slate-900 text-xl mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO EDUCATIVA ===== */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 font-semibold text-sm px-4 py-2 rounded-full mb-4 border border-red-600/30">
              <CheckCircle className="w-4 h-4" />
              Requisitos para Doação
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Você pode ser um doador hoje?
            </h2>
            <p className="text-slate-400 text-lg">Verifique os requisitos básicos para doação de sangue</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {DONOR_REQUIREMENTS.map((req, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed">{req}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/novo"
              id="cta-educativa"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-300 shadow-xl shadow-red-900 hover:-translate-y-1"
            >
              Criar Pedido de Doação
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
