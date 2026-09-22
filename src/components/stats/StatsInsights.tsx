import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Calendar, 
  Compass, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { DetailedRoutineStats } from '../../types';

interface StatsInsightsProps {
  stats: DetailedRoutineStats;
  onNavigateToTab?: (tab: string) => void;
}

export const StatsInsights: React.FC<StatsInsightsProps> = ({ stats, onNavigateToTab }) => {
  return (
    <div className="space-y-6">
      
      {/* Grade de Análises Objetivas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. MELHOR HORÁRIO DE REALIZAÇÃO */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
                  Janela de Eficácia
                </span>
                <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Melhor Horário Observado
                </h4>
              </div>
            </div>
            <span className="text-xs font-bold text-[#162E23] dark:text-[#4F8E71] bg-[#F2F7F4] dark:bg-[#1B2621] px-2.5 py-1 rounded-full border border-[#DDE7E1] dark:border-[#24362E]">
              {stats.bestTimeOfDay.percentageOfTotal}% das práticas
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBFDFB] dark:bg-[#121A17] border border-[#EBF1ED] dark:border-[#1F2B25] space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                {stats.bestTimeOfDay.periodName}
              </span>
              <span className="text-xs font-mono text-[#617068] dark:text-[#9AA8A1]">
                {stats.bestTimeOfDay.timeRange}
              </span>
            </div>
            <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
              {stats.bestTimeOfDay.description}. Proteger os primeiros momentos do dia preserva a tranquilidade da rotina.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#7D8882]">
            <span>Volume registrado nesta faixa:</span>
            <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">
              {stats.bestTimeOfDay.completedCount} conclusões
            </span>
          </div>
        </div>

        {/* 2. PERÍODOS DE MAIOR ATIVIDADE NA SEMANA */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
                  Ritmo Semanal
                </span>
                <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Períodos de Maior Atividade
                </h4>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-sm">
              Constância Alta
            </span>
          </div>

          {/* Top 3 dias mais fortes */}
          <div className="grid grid-cols-3 gap-2">
            {[...stats.weekdayDistribution]
              .sort((a, b) => b.successRate - a.successRate)
              .slice(0, 3)
              .map((d, idx) => (
                <div key={d.dayName} className="p-2.5 rounded-xl bg-[#F7FAF8] dark:bg-[#17221D] border border-[#E6EBE8] dark:border-[#202E27] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#7D8882]">
                    #{idx + 1} {d.shortDay}
                  </span>
                  <div className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
                    {d.successRate}%
                  </div>
                  <span className="text-[10px] text-[#7D8882]">
                    {d.completedCount} práticas
                  </span>
                </div>
              ))}
          </div>

          <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5]">
            Dias centrais e fins de semana mostram ritmos distintos, permitindo planejar leituras mais longas nos dias de maior tempo livre.
          </p>
        </div>

      </div>

      {/* 3. ATIVIDADES MAIS CONSISTENTES E FREQUENTEMENTE IGNORADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Atividades Mais Consistentes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F2F7F4] dark:bg-[#1B2621] text-[#29523F] dark:text-[#4F8E71] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
                Perseverança Prática
              </span>
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Atividades Mais Consistentes
              </h4>
            </div>
          </div>

          <div className="space-y-2.5">
            {stats.mostConsistentActivities.map((act) => (
              <div 
                key={act.name}
                className="p-3 rounded-xl border border-[#EEF2EF] dark:border-[#1F2B25] bg-[#FAFCFB] dark:bg-[#121A17] flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] truncate block">
                    {act.name}
                  </span>
                  <span className="text-[11px] text-[#7D8882]">
                    {act.completedCount} vezes cumprida • ~{act.averageMinutes} min/sessão
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs font-bold text-[#162E23] dark:text-[#4F8E71] bg-[#F2F7F4] dark:bg-[#1B2621] px-2 py-0.5 rounded-sm border border-[#DCE6DF] dark:border-[#25362E]">
                    {act.rate}% taxa
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Frequentemente Ignoradas / Ajustes Construtivos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
                Oportunidades de Ajuste
              </span>
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Atividades Frequentemente Ignoradas
              </h4>
            </div>
          </div>

          <div className="space-y-2.5">
            {stats.frequentlyIgnoredActivities.map((act) => (
              <div 
                key={act.name}
                className="p-3 rounded-xl border border-[#F5EBEB] dark:border-[#2D1F21] bg-[#FFFBFB] dark:bg-[#1A1315] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] truncate">
                    {act.name}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded-sm border border-rose-200 dark:border-rose-800 shrink-0">
                    {act.skippedCount}x pulada
                  </span>
                </div>

                <div className="text-[11px] text-[#7D8882] dark:text-[#9AA8A1]">
                  <strong>Motivo observado:</strong> {act.commonReason}
                </div>

                <p className="text-xs text-[#524447] dark:text-[#D1B8BC] leading-relaxed pt-1 border-t border-[#F5EAEB] dark:border-[#2B1B1E]">
                  💡 <strong>Sugestão gentil:</strong> {act.constructiveNote}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. EVOLUÇÃO DOS PLANOS (LEITURA E ORAÇÃO) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
              Jornada Estruturada
            </span>
            <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Evolução dos Planos no Período
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#7D8882]">
            <span>{stats.activePlansCount} planos em andamento</span>
            <span>•</span>
            <span>{stats.completedPlansCount} concluídos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {stats.plansEvolution.map((plan) => (
            <div 
              key={plan.id}
              className="p-4 rounded-xl border border-[#EEF2EF] dark:border-[#1F2B25] bg-[#FAFCFB] dark:bg-[#121A17] space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882] block">
                    {plan.type === 'reading' ? 'Plano de Leitura' : 'Plano de Oração'}
                  </span>
                  <h5 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] truncate mt-0.5">
                    {plan.title}
                  </h5>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm shrink-0 ${
                  plan.isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-[#F2F7F4] dark:bg-[#1B2621] text-[#162E23] dark:text-[#4F8E71] border border-[#DCE6DF] dark:border-[#25362E]'
                }`}>
                  {plan.status}
                </span>
              </div>

              {/* Barra de Progresso */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#7D8882]">
                  <span>Dia {plan.currentDay} de {plan.totalDays}</span>
                  <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] font-mono">
                    {plan.progressPercentage}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EAEFEA] dark:bg-[#1E2B25] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#29523F] dark:bg-[#4F8E71] transition-all duration-500"
                    style={{ width: `${Math.max(plan.progressPercentage, 4)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PRINCÍPIO TEOLÓGICO DA GRAÇA (PROTEÇÃO CONTRA COBRANÇA DOENTIA) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F8F6] dark:bg-[#15221C] border border-[#DEE7E2] dark:border-[#23352B] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#29523F] dark:text-[#4F8E71] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
          <strong className="text-[#19211D] dark:text-[#F1F4F2] font-semibold block">
            Princípio Bíblico: As estatísticas medem ritmo de rotina, nunca aceitação por Deus
          </strong>
          <p>
            Nenhum gráfico ou taxa percentual mede intimidade espiritual genuína ou mérito perante o Senhor. "Pela graça sois salvos, por meio da fé; e isso não vem de vós, é dom de Deus" (Efésios 2:8). Use estes dados unicamente como instrumento de auto-observação e disciplina amável para organizar o seu dia.
          </p>
        </div>
      </div>

    </div>
  );
};
