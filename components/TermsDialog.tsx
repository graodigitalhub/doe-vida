'use client';

import { useState } from 'react';
import { ShieldCheck, X, Calendar, Lock, AlertCircle } from 'lucide-react';

interface TermsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsDialog({ isOpen, onClose }: TermsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">Termos de Uso e LGPD</h2>
              <p className="text-xs text-red-600 font-semibold">Doe Vida • doevida.com.br</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center shadow-sm border border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed">
          
          {/* Destaque 60 dias */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 text-sm">Validade Máxima de 60 Dias</p>
              <p className="text-amber-800 text-xs mt-0.5 leading-normal">
                Para manter as informações verídicas e evitar circulação indevida de pedidos desatualizados, <strong>cada campanha possui vigência máxima de 60 dias</strong>. Após esse prazo, a campanha expira e é arquivada automaticamente pelo sistema.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-600" />
              1. Finalidade e Consentimento (LGPD)
            </h3>
            <p>
              Ao cadastrar uma campanha no Doe Vida, você declara ter autorização do paciente ou de seu responsável legal para divulgar as informações estritamente necessárias para a captação de doações voluntárias de sangue e hemocomponentes.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">2. Dados Coletados</h3>
            <p>
              Os dados solicitados (nome do paciente, tipo sanguíneo, hospital, hemocentro e foto opcional) destinam-se exclusivamente à confecção de cards públicos de solidariedade para redes sociais.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              3. Controle e Encerramento
            </h3>
            <p>
              O criador do pedido recebe um <strong>link exclusivo com chave de edição</strong> para concluir ou atualizar o pedido a qualquer momento antes do prazo de 60 dias. Quando a meta é atingida, o responsável pode encerrar a exibição da campanha com um clique.
            </p>
          </div>

          <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
            Última atualização: Setembro de 2026. Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-red-100"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
