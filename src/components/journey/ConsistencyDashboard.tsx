import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  HeartHandshake, 
  Flame, 
  Layers, 
  AlertCircle, 
  SkipForward, 
  Calendar, 
  Sparkles, 
  GraduationCap, 
  Church, 
  BrainCircuit, 
  TrendingUp,
  Info
} from 'lucide-react';
import { ObjectiveConsistencyMetrics, BehavioralPatternObservation } from '../../types';

interface ConsistencyDashboardProps {
  metrics: ObjectiveConsistencyMetrics;
  observations: BehavioralPatternObservation[];
  periodLabel: string;
}

export const ConsistencyDashboard: React.FC<ConsistencyDashboardProps> = ({
  metrics,
  observations,
  periodLabel
}) => {
  return (
    <div className="space-y-5">
      
      {/* Padrões de Comportamento (Observações transparentes sem julgamento espiritual) */}
      {observations.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6F4] dark:bg-[#16211C] border border-[#E0E5E1] dark:border-[#26372E] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#29523F] dark:text-[#4F8E71]">
                Padrões & Observações de Comportamento
              </h3>
            </div>
            <span className="text-[11px] text-[#7D8882] dark:text-[#788780] hidden sm:inline">
              Fatos objetivos da rotina
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {observations.map(obs => (
              <div 
                key={obs.id}
                id={`observation-${obs.id}`}
                className="p-3 rounded-xl bg-white dark:bg-[#1B2722] border border-[#E6E6DF] dark:border-[#24322C] flex items-start gap-3 shadow-2xs"
              >
                <div className="p-2 rounded-lg bg-[#29523F]/10 dark:bg-[#4F8E71]/20 text-[#29523F] dark:text-[#4F8E71] shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                      {obs.text}
                    </p>
                    {obs.metricBadge && (
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#25352E] text-[10px] font-bold text-[#29523F] dark:text-[#67B593] shrink-0">
                        {obs.metricBadge}
                      </span>
                    )}
                  </div>
                  {obs.contextDetail && (
                    <p className="text-[11px] text-[#7D8882] dark:text-[#8FA198] mt-1 leading-relaxed">
                      {obs.contextDetail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#7D8882] dark:text-[#788780] pt-1">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Essas são observações de comportamento e ritmo, não julgamentos espirituais.</span>
          </div>
        </div>
      )}

      {/* Grid de Métricas Objetivas da Consistência */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] dark:text-[#788780]">
            Métricas Objetivas de Fidelidade ({periodLabel})
          </h3>
          <span className="text-[11px] text-[#7D8882]">Sem nota espiritual</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Atividades Planejadas & Concluídas */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Atividades</span>
              <CheckCircle2 className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.completedActivities} <span className="text-xs font-normal text-[#7D8882]">/ {metrics.plannedActivities}</span>
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              concluídas no período
            </div>
          </div>

          {/* Ignoradas & Atrasadas */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Reajustes</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.delayedActivities} <span className="text-xs font-normal text-[#7D8882]">atrasos</span>
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              {metrics.ignoredActivities} puladas/ignoradas
            </div>
          </div>

          {/* Dias Ativos */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Dias Ativos</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.activeDaysCount} <span className="text-xs font-normal text-[#7D8882]">/ {metrics.totalDaysInPeriod} dias</span>
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              com práticas registradas
            </div>
          </div>

          {/* Oração */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Oração</span>
              <HeartHandshake className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.prayerSessionsCount} <span className="text-xs font-normal text-[#7D8882]">sessões</span>
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              {metrics.totalPrayerMinutes} min dedicados
            </div>
          </div>

          {/* Leituras & Capítulos */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Bíblia</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.chaptersReadCount} <span className="text-xs font-normal text-[#7D8882]">capítulos</span>
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              {metrics.readingSessionsCount} leituras cumpridas
            </div>
          </div>

          {/* Planos Concluídos */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Planos Concluídos</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.plansCompletedCount}
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              planos finalizados
            </div>
          </div>

          {/* Jejuns Concluídos */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Jejuns</span>
              <Flame className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.fastsCompletedCount}
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              períodos concluídos
            </div>
          </div>

          {/* Estudos Bíblicos */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Estudos</span>
              <GraduationCap className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.studiesCount}
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              estudos aprofundados
            </div>
          </div>

          {/* Cultos & Eventos */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Cultos & Eventos</span>
              <Church className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.eventsCount}
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              reuniões na comunidade
            </div>
          </div>

          {/* Memorização */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
            <div className="flex items-center justify-between text-[#7D8882] text-xs font-medium">
              <span>Memorização</span>
              <BrainCircuit className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1.5">
              {metrics.memorizationsCount}
            </div>
            <div className="text-[11px] text-[#7D8882] mt-0.5">
              versículos guardados
            </div>
          </div>

        </div>

        {/* Lembrete Fundamental de Fé */}
        <div className="mt-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#16211C] border border-[#E6E6DF] dark:border-[#24322C] flex items-center gap-2 text-xs text-[#7D8882] dark:text-[#788780]">
          <Info className="w-4 h-4 text-[#7D8882] shrink-0" />
          <span>
            <strong>Princípio de Graça:</strong> Números refletem unicamente o registro prático da sua rotina. Nenhuma contagem define o amor de Deus ou substitui a suficiência da graça em Cristo.
          </span>
        </div>
      </div>

    </div>
  );
};
