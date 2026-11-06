import Link from 'next/link';
import { Heart, Users, Sparkles, ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';
import type { Campaign } from '@/types/campaign';
import { CampaignCard } from '@/components/CampaignCard';

interface ClosedCampaignViewProps {
  patientName?: string;
  activeCampaigns: Campaign[];
}

export function ClosedCampaignView({ patientName, activeCampaigns }: ClosedCampaignViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Card Principal de Conclusão / Agradecimento */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-8 sm:p-12 text-center mb-10 relative">
          {/* Efeito decorativo no fundo */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-rose-400 to-red-500" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-6 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Ciclo Concluído • Validade de 30 dias Encerrada</span>
          </div>

          {/* Ícone de Destaque */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-tr from-rose-100 to-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-rose-100/50">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 fill-rose-500/20 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Esta campanha foi encerrada
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6">
            Nosso mais sincero agradecimento a todos que compartilharam, compareceram ao hemocentro ou enviaram apoio{' '}
            {patientName ? (
              <strong className="text-slate-900 font-bold">para {patientName}</strong>
            ) : (
              'a este pedido'
            )}
            ! Cada gesto de solidariedade fez uma diferença inestimável.
          </p>

          {/* Box de explicação humanizada sobre o prazo */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-sm text-slate-500 text-left sm:text-center max-w-xl mx-auto mb-8">
            <p>
              🛡️ <strong>Privacidade e Dados Atualizados:</strong> No Doe Vida, as campanhas têm um ciclo máximo de 30 dias. Após esse prazo, os pedidos são finalizados automaticamente para garantir a proteção de dados médicos e dar visibilidade a novas urgências.
            </p>
          </div>

          {/* Chamada para Ação Solidária */}
          <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-red-200/60 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2 text-rose-100 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>A solidariedade não pode parar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Outras vidas continuam precisando de você!
            </h2>
            <p className="text-rose-100 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
              Centenas de pacientes em hospitais e bancos de sangue em todo o Brasil aguardam por doadores todos os dias. Uma única doação sua pode salvar até 4 vidas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-red-600 font-black px-7 py-4 rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>🩸 Ver Campanhas Ativas</span>
                <ArrowRight className="w-5 h-5 text-red-600" />
              </Link>

              <Link
                href="/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-700/60 hover:bg-red-700/80 text-white font-bold px-6 py-4 rounded-2xl text-sm border border-red-400/40 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pedir Doação para Alguém</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Campanhas Ativas Recomendadas */}
        {activeCampaigns.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Campanhas urgentes precisando de ajuda
                </h3>
                <p className="text-sm text-slate-500">
                  Veja pacientes que precisam de doação neste momento
                </p>
              </div>
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCampaigns.map((camp) => (
                <CampaignCard key={camp.id} campaign={camp} />
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-xs transition-all hover:border-red-200 hover:shadow-sm"
              >
                <Users className="w-4 h-4 text-red-500" />
                <span>Explorar todas as campanhas em aberto</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

