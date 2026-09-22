import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  Download, 
  FileSpreadsheet, 
  FileJson, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Flame, 
  BookOpen, 
  HeartHandshake, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  ListChecks, 
  Compass, 
  Info,
  CalendarDays,
  Activity,
  Award,
  ArrowRight
} from 'lucide-react';
import { 
  DailyConsistency, 
  SpiritualProfile, 
  StatsPeriod, 
  StatsFilterOptions,
  ReadingPlan,
  PrayerPlan,
  PrayerRequest,
  FastingPlan,
  Reflection,
  RoutineActivity,
  ActivityExecutionLog,
  PracticeRecord
} from '../types';
import { StatsAnalyticsService } from '../services/statsAnalyticsService';
import { FaithionStorageService } from '../services/storage';
import { StatsMetricCard } from '../components/stats/StatsMetricCard';
import { StatsCharts } from '../components/stats/StatsCharts';
import { StatsInsights } from '../components/stats/StatsInsights';

interface StatsViewProps {
  consistencyHistory: DailyConsistency[];
  profile: SpiritualProfile;
  answeredPrayersCount?: number;
  totalPrayersCount?: number;
  plans?: ReadingPlan[];
  prayerPlans?: PrayerPlan[];
  prayers?: PrayerRequest[];
  fastingRecords?: FastingPlan[];
  reflections?: Reflection[];
  routineActivities?: RoutineActivity[];
  executionLogs?: ActivityExecutionLog[];
  onNavigateToTab?: (tab: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  consistencyHistory,
  profile,
  answeredPrayersCount = 0,
  totalPrayersCount = 0,
  plans,
  prayerPlans,
  prayers,
  fastingRecords,
  reflections,
  routineActivities,
  executionLogs,
  onNavigateToTab
}) => {
  // Estado do Filtro de Período
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('30d');
  
  // Datas para período personalizado
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultPastStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return d.toISOString().split('T')[0];
  }, []);

  const [customStartDate, setCustomStartDate] = useState<string>(defaultPastStr);
  const [customEndDate, setCustomEndDate] = useState<string>(todayStr);
  const [appliedCustomDates, setAppliedCustomDates] = useState<{ start: string; end: string }>({
    start: defaultPastStr,
    end: todayStr
  });

  // Estado de feedback de exportação
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Resolver dados persistidos com fallbacks caso não venham diretamente de props
  const resolvedPlans = useMemo(() => plans || FaithionStorageService.getReadingPlans(), [plans]);
  const resolvedPrayerPlans = useMemo(() => prayerPlans || FaithionStorageService.getPrayerPlans(), [prayerPlans]);
  const resolvedFastingRecords = useMemo(() => fastingRecords || FaithionStorageService.getFastingRecords(), [fastingRecords]);
  const resolvedReflections = useMemo(() => reflections || FaithionStorageService.getReflections(), [reflections]);
  const resolvedRoutineActivities = useMemo(() => routineActivities || FaithionStorageService.getRoutineActivities(), [routineActivities]);
  const resolvedExecutionLogs = useMemo(() => executionLogs || FaithionStorageService.getExecutionLogs(), [executionLogs]);
  const readingSessions = useMemo(() => FaithionStorageService.getBibleReadingHistory(), []);
  const practiceRecords = useMemo(() => FaithionStorageService.getPracticeRecords(), []);

  // Construir filtro ativo
  const filterOptions: StatsFilterOptions = useMemo(() => {
    if (selectedPeriod === 'custom') {
      return {
        period: 'custom',
        startDate: appliedCustomDates.start,
        endDate: appliedCustomDates.end
      };
    }
    return {
      period: selectedPeriod
    };
  }, [selectedPeriod, appliedCustomDates]);

  // Execução do cálculo das estatísticas detalhadas
  const stats = useMemo(() => {
    return StatsAnalyticsService.calculateStats({
      filter: filterOptions,
      profile,
      consistencyHistory,
      readingPlans: resolvedPlans,
      prayerPlans: resolvedPrayerPlans,
      executionLogs: resolvedExecutionLogs,
      routineActivities: resolvedRoutineActivities,
      readingSessions,
      fastingRecords: resolvedFastingRecords,
      reflections: resolvedReflections,
      practiceRecords
    });
  }, [
    filterOptions,
    profile,
    consistencyHistory,
    resolvedPlans,
    resolvedPrayerPlans,
    resolvedExecutionLogs,
    resolvedRoutineActivities,
    readingSessions,
    resolvedFastingRecords,
    resolvedReflections,
    practiceRecords
  ]);

  // Handlers de exportação
  const handleExportCSV = () => {
    StatsAnalyticsService.exportToCSV(stats, filterOptions);
    setExportFeedback('Relatório CSV exportado com sucesso!');
    setTimeout(() => setExportFeedback(null), 3500);
  };

  const handleExportJSON = () => {
    StatsAnalyticsService.exportToJSON(stats, filterOptions);
    setExportFeedback('Dados estruturados em JSON exportados!');
    setTimeout(() => setExportFeedback(null), 3500);
  };

  const handleApplyCustomPeriod = () => {
    if (!customStartDate || !customEndDate) return;
    if (customStartDate > customEndDate) {
      alert('A data de início deve ser anterior ou igual à data de término.');
      return;
    }
    setAppliedCustomDates({
      start: customStartDate,
      end: customEndDate
    });
  };

  // Formatação de Horas/Minutos
  const readingHours = (stats.readingTimeMinutes / 60).toFixed(1);
  const prayerHours = (stats.prayerTimeMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* 1. HEADER DO MÓDULO DE ESTATÍSTICAS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                Comportamento & Fatos Objetivos
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Estatísticas da Rotina Cristã
            </h2>
            <p className="text-xs sm:text-sm text-[#617068] dark:text-[#9AA8A1] mt-0.5">
              Acompanhamento factual da consistência diária, sem avaliações de mérito espiritual
            </p>
          </div>

          {/* Ações de Exportação */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F2F7F4] dark:bg-[#1B2621] text-[#162E23] dark:text-[#E8EFEA] border border-[#D5E2D9] dark:border-[#25362E] hover:bg-[#E6F0EB] dark:hover:bg-[#22332B] transition-all shadow-2xs cursor-pointer"
              title="Baixar planilha CSV para Excel ou Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
              <span>Exportar CSV</span>
            </button>

            <button
              type="button"
              id="export-json-btn"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#15201B] text-[#4B554F] dark:text-[#C5D1CB] border border-[#E6E6DF] dark:border-[#2A3B33] hover:bg-[#F9FAF9] dark:hover:bg-[#1E2B25] transition-all shadow-2xs cursor-pointer"
              title="Baixar dados brutos e analíticos em JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-[#7D8882]" />
              <span>Exportar JSON</span>
            </button>
          </div>
        </div>

        {/* Feedback Temporário de Exportação */}
        {exportFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{exportFeedback}</span>
          </div>
        )}

        {/* SELETOR DE PERÍODOS (7d, 30d, 90d, Personalizado) */}
        <div className="pt-3 border-t border-[#F0F2EF] dark:border-[#212E27] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#7D8882]" />
            <span className="text-xs font-semibold text-[#617068] dark:text-[#9AA8A1]">
              Período de Análise:
            </span>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-[#F2F7F4] dark:bg-[#18231E] border border-[#E6E6DF] dark:border-[#24322C] self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              id="period-btn-7d"
              onClick={() => setSelectedPeriod('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPeriod === '7d'
                  ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs font-bold'
                  : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
              }`}
            >
              7 dias
            </button>

            <button
              type="button"
              id="period-btn-30d"
              onClick={() => setSelectedPeriod('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPeriod === '30d'
                  ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs font-bold'
                  : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
              }`}
            >
              30 dias
            </button>

            <button
              type="button"
              id="period-btn-90d"
              onClick={() => setSelectedPeriod('90d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPeriod === '90d'
                  ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs font-bold'
                  : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
              }`}
            >
              90 dias
            </button>

            <button
              type="button"
              id="period-btn-custom"
              onClick={() => setSelectedPeriod('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPeriod === 'custom'
                  ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs font-bold'
                  : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
              }`}
            >
              Personalizado
            </button>
          </div>
        </div>

        {/* INPUTS PARA PERÍODO PERSONALIZADO */}
        {selectedPeriod === 'custom' && (
          <div className="p-3.5 rounded-xl bg-[#F9FBFA] dark:bg-[#121A17] border border-[#E6EDE8] dark:border-[#1F2B25] flex flex-wrap items-center gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <label htmlFor="custom-start-date" className="text-xs font-medium text-[#617068] dark:text-[#9AA8A1]">
                De:
              </label>
              <input
                id="custom-start-date"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-[#D5DDD8] dark:border-[#2C3B34] bg-white dark:bg-[#1A2520] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="custom-end-date" className="text-xs font-medium text-[#617068] dark:text-[#9AA8A1]">
                Até:
              </label>
              <input
                id="custom-end-date"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-[#D5DDD8] dark:border-[#2C3B34] bg-white dark:bg-[#1A2520] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>

            <button
              type="button"
              id="apply-custom-period-btn"
              onClick={handleApplyCustomPeriod}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#29523F] dark:bg-[#4F8E71] text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              Filtrar
            </button>

            <span className="text-[11px] text-[#7D8882] dark:text-[#8D9B94] ml-auto">
              Período ativo: {stats.totalDaysInPeriod} dias
            </span>
          </div>
        )}
      </div>

      {/* 2. GRADE DAS 12 MÉTRICAS CONSOLIDADAS (4 GRUPOS OBJETIVOS) */}
      <div className="space-y-4">
        
        {/* GRUPO 1: EXECUÇÃO GERAL */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
              1. Execução & Frequência
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatsMetricCard
              id="metric-active-days"
              title="Dias Ativos"
              value={stats.activeDays}
              unit={`/ ${stats.totalDaysInPeriod} d`}
              subtext="Dias com ao menos uma prática"
              icon={CalendarIcon}
              iconColor="text-[#29523F] dark:text-[#4F8E71]"
              iconBg="bg-[#EAF3EE] dark:bg-[#192A22]"
              badge={{ 
                label: `${Math.round((stats.activeDays / stats.totalDaysInPeriod) * 100)}% do período`,
                variant: 'emerald'
              }}
              highlight={true}
            />

            <StatsMetricCard
              id="metric-completed-activities"
              title="Atividades Concluídas"
              value={stats.completedActivities}
              unit="ações"
              subtext={`${stats.plannedActivities} previstas na rotina`}
              icon={CheckCircle2}
              iconColor="text-emerald-700 dark:text-emerald-400"
              iconBg="bg-emerald-50 dark:bg-emerald-950/40"
              badge={{ 
                label: 'Concluídas',
                variant: 'neutral'
              }}
            />

            <StatsMetricCard
              id="metric-execution-rate"
              title="Taxa de Execução"
              value={`${stats.executionRate}%`}
              subtext="Cumprimento das metas planejadas"
              icon={TrendingUp}
              iconColor="text-[#162E23] dark:text-[#4F8E71]"
              iconBg="bg-[#F2F7F4] dark:bg-[#1C2822]"
              badge={{
                label: stats.executionRate >= 75 ? 'Consistente' : 'Em ajuste',
                variant: stats.executionRate >= 75 ? 'emerald' : 'amber'
              }}
            />
          </div>
        </div>

        {/* GRUPO 2: LEITURAS E ESCRITURAS */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
              2. Palavra & Escrituras
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatsMetricCard
              id="metric-readings"
              title="Leituras"
              value={stats.readingSessionsCount}
              unit="sessões"
              subtext="Momentos no texto bíblico"
              icon={BookOpen}
              iconColor="text-[#29523F] dark:text-[#4F8E71]"
              iconBg="bg-[#EBF3EF] dark:bg-[#192721]"
            />

            <StatsMetricCard
              id="metric-chapters"
              title="Capítulos"
              value={stats.chaptersCount}
              unit="capítulos"
              subtext="Porções meditadas no período"
              icon={Layers}
              iconColor="text-sky-700 dark:text-sky-400"
              iconBg="bg-sky-50 dark:bg-sky-950/40"
            />

            <StatsMetricCard
              id="metric-reading-time"
              title="Tempo de Leitura"
              value={`${readingHours}h`}
              unit={`(${stats.readingTimeMinutes} min)`}
              subtext="Imersão acumulada nas Escrituras"
              icon={Clock}
              iconColor="text-indigo-700 dark:text-indigo-400"
              iconBg="bg-indigo-50 dark:bg-indigo-950/40"
            />
          </div>
        </div>

        {/* GRUPO 3: ORAÇÃO E JEJUM */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
              3. Oração & Consagração
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatsMetricCard
              id="metric-prayer-sessions"
              title="Sessões de Oração"
              value={stats.prayerSessionsCount}
              unit="momentos"
              subtext="Orações matinais, clamores e intercessões"
              icon={HeartHandshake}
              iconColor="text-[#C59B3F]"
              iconBg="bg-[#FBF6EA] dark:bg-[#252014]"
            />

            <StatsMetricCard
              id="metric-prayer-time"
              title="Tempo de Oração Registrado"
              value={`${prayerHours}h`}
              unit={`(${stats.prayerTimeMinutes} min)`}
              subtext="Diálogo e clamor registrados"
              icon={Clock}
              iconColor="text-amber-700 dark:text-amber-400"
              iconBg="bg-amber-50 dark:bg-amber-950/40"
            />

            <StatsMetricCard
              id="metric-fastings"
              title="Jejuns"
              value={stats.fastingsCount}
              unit="cumpridos"
              subtext="Períodos de consagração e abstinência"
              icon={Flame}
              iconColor="text-orange-700 dark:text-orange-400"
              iconBg="bg-orange-50 dark:bg-orange-950/40"
            />
          </div>
        </div>

        {/* GRUPO 4: REFLEXÕES E PLANOS */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7D8882]">
              4. Reflexões & Planos
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatsMetricCard
              id="metric-reflections"
              title="Reflexões"
              value={stats.reflectionsCount}
              unit="anotações"
              subtext="Diários espirituais e pensamentos"
              icon={Sparkles}
              iconColor="text-purple-700 dark:text-purple-400"
              iconBg="bg-purple-50 dark:bg-purple-950/40"
            />

            <StatsMetricCard
              id="metric-active-plans"
              title="Planos Ativos"
              value={stats.activePlansCount}
              unit="em curso"
              subtext="Planos de leitura e oração atuais"
              icon={ListChecks}
              iconColor="text-[#29523F] dark:text-[#4F8E71]"
              iconBg="bg-[#EBF3EF] dark:bg-[#192721]"
            />

            <StatsMetricCard
              id="metric-completed-plans"
              title="Planos Concluídos"
              value={stats.completedPlansCount}
              unit="finalizados"
              subtext="Metas concluídas na jornada"
              icon={Award}
              iconColor="text-emerald-700 dark:text-emerald-400"
              iconBg="bg-emerald-50 dark:bg-emerald-950/40"
              badge={{
                label: stats.completedPlansCount > 0 ? 'Concluídos' : 'Em jornada',
                variant: stats.completedPlansCount > 0 ? 'emerald' : 'neutral'
              }}
            />
          </div>
        </div>

      </div>

      {/* 3. GRÁFICOS VISUAIS (LINHA, CALENDÁRIO HEATMAP, DISTRIBUIÇÃO, SEMANAL) */}
      <StatsCharts stats={stats} />

      {/* 4. ANÁLISES FACTUAIS E INTELIGENTES (MELHOR HORÁRIO, CONSISTÊNCIA, PLANOS) */}
      <StatsInsights stats={stats} onNavigateToTab={onNavigateToTab} />

    </div>
  );
};
