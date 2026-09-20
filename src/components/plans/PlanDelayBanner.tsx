import React from 'react';
import { AlertCircle, ArrowRight, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { ReadingPlan } from '../../types';

interface PlanDelayBannerProps {
  plan: ReadingPlan;
  delayedCount: number;
  onContinueWhereLeftOff: () => void;
  onOpenReorganizeModal: () => void;
}

export const PlanDelayBanner: React.FC<PlanDelayBannerProps> = ({
  plan,
  delayedCount,
  onContinueWhereLeftOff,
  onOpenReorganizeModal
}) => {
  if (delayedCount === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Ajuste de Ritmo com Graça
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                {delayedCount} {delayedCount === 1 ? 'leitura anterior pendente' : 'leituras anteriores pendentes'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
              No Faithion, seu progresso <strong>nunca é apagado</strong>. A Palavra é alimento para a alma, não uma cobrança. Escolha como prefere seguir:
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={onContinueWhereLeftOff}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] shadow-2xs transition-all"
            title="Move a próxima leitura para hoje e desloca os dias futuros suavemente"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Continuar de Onde Parou</span>
          </button>

          <button
            onClick={onOpenReorganizeModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#141C19] text-[#162E23] dark:text-[#4F8E71] border border-amber-300/80 dark:border-amber-800/60 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reorganizar Plano</span>
          </button>
        </div>
      </div>
    </div>
  );
};
