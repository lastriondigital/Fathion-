import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  PenLine, 
  Plus, 
  CheckCircle2, 
  Flame, 
  HeartHandshake, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Check,
  Filter,
  Eye,
  Lightbulb,
  Footprints,
  Heart,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  Search,
  RotateCcw,
  GraduationCap,
  Church,
  BrainCircuit,
  CalendarDays
} from 'lucide-react';
import { 
  Reflection, 
  SpiritualProfile, 
  DailyConsistency, 
  JourneyEntry,
  DailyTask,
  ReadingPlan,
  RoutineActivity,
  ActivityExecutionLog,
  SpiritualObjective,
  PrayerRequest,
  FastingPlan,
  JourneyAdaptationSuggestion,
  JourneyGuideRecommendationItem,
  RoutineBlock,
  PracticeCategory,
  PracticeRecord
} from '../types';
import { ReflectionModal } from '../components/reflection/ReflectionModal';
import { JourneyGuideSection } from '../components/journey/JourneyGuideSection';
import { JourneyTimelineCard } from '../components/journey/JourneyTimelineCard';
import { ConsistencyDashboard } from '../components/journey/ConsistencyDashboard';
import { RegisterPracticeModal } from '../components/journey/RegisterPracticeModal';
import { FaithionStorageService } from '../services/storage';
import { JourneyGuideService } from '../services/journeyGuideService';
import { ConsistencyService } from '../services/consistencyService';

interface JourneyViewProps {
  profile: SpiritualProfile;
  reflections: Reflection[];
  onAddReflection: (ref: Omit<Reflection, 'id' | 'createdAt'> & { id?: string }) => void;
  onUpdateReflection?: (id: string, updates: Partial<Reflection>) => void;
  onDeleteReflection?: (id: string) => void;
  consistencyHistory: DailyConsistency[];
  onUpdateProfileGoals: (prayerMins: number, chapters: number) => void;
  onNavigateToBible?: (ref?: string) => void;
  onNavigateToPrayer?: () => void;
  onNavigateToFasting?: () => void;
  tasks?: DailyTask[];
  plans?: ReadingPlan[];
  prayers?: PrayerRequest[];
  fastingPlan?: FastingPlan;
  routineActivities?: RoutineActivity[];
  executionLogs?: ActivityExecutionLog[];
  objectives?: SpiritualObjective[];
  onStartTask?: (taskId: string) => void;
  onCompleteTask?: (taskId: string) => void;
  onIgnoreTask?: (taskId: string) => void;
  onAcceptAdaptation?: (adapt: JourneyAdaptationSuggestion) => void;
  onIgnoreAdaptation?: (adaptId: string) => void;
  onAdjustAdaptation?: (adapt: JourneyAdaptationSuggestion, adjustments: {
    duration?: number;
    time?: string;
    block?: RoutineBlock;
  }) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  profile,
  reflections,
  onAddReflection,
  onUpdateReflection,
  onDeleteReflection,
  consistencyHistory,
  onUpdateProfileGoals,
  onNavigateToBible,
  onNavigateToPrayer,
  onNavigateToFasting,
  tasks: propTasks,
  plans: propPlans,
  prayers: propPrayers,
  fastingPlan: propFastingPlan,
  routineActivities: propRoutineActivities,
  executionLogs: propExecutionLogs,
  objectives: propObjectives,
  onStartTask,
  onCompleteTask,
  onIgnoreTask,
  onAcceptAdaptation: propOnAcceptAdaptation,
  onIgnoreAdaptation: propOnIgnoreAdaptation,
  onAdjustAdaptation: propOnAdjustAdaptation
}) => {
  // VISÃO DA JORNADA: Hoje | Esta semana | Este mês | Histórico
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month' | 'history' | 'guide' | 'reflections' | 'goals'>('today');
  
  // Feedback suave de ação no Guia e Práticas
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Estados locais para dados quando não passados via props
  const [localTasks, setLocalTasks] = useState<DailyTask[]>(() => propTasks || FaithionStorageService.getDailyTasks());
  const [localPlans, setLocalPlans] = useState<ReadingPlan[]>(() => propPlans || FaithionStorageService.getReadingPlans());
  const [localRoutineActivities, setLocalRoutineActivities] = useState<RoutineActivity[]>(() => 
    propRoutineActivities || FaithionStorageService.getRoutineActivities()
  );
  const [localPracticeRecords, setLocalPracticeRecords] = useState<PracticeRecord[]>(() => 
    FaithionStorageService.getPracticeRecords()
  );
  const [dismissedAdaptationIds, setDismissedAdaptationIds] = useState<string[]>([]);
  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0);

  // Modais de Ação
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [initialPracticeCategory, setInitialPracticeCategory] = useState<PracticeCategory>('bible');
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);

  // Filtros avançados para a aba Histórico
  const [historyPeriodFilter, setHistoryPeriodFilter] = useState<'all' | 'today' | 'week' | 'month' | '30days'>('all');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('all');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all');
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // Adaptação de Carga / Metas
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptedPrayer, setAdaptedPrayer] = useState(profile.dailyPrayerGoalMinutes);
  const [adaptedChapters, setAdaptedChapters] = useState(profile.dailyBibleChaptersGoal);
  const [adaptedSuccess, setAdaptedSuccess] = useState(false);

  // Sincroniza se as props mudarem
  const currentTasks = propTasks || localTasks;
  const currentPlans = propPlans || localPlans;
  const currentRoutineActivities = propRoutineActivities || localRoutineActivities;
  const currentPrayers = propPrayers || FaithionStorageService.getPrayerRequests();
  const currentFastingPlan = propFastingPlan || FaithionStorageService.getFastingPlan();
  const currentFasts = FaithionStorageService.getFastingRecords();
  const currentExecutionLogs = propExecutionLogs || FaithionStorageService.getExecutionLogs();
  const currentObjectives = propObjectives || FaithionStorageService.getObjectives();
  const currentBibleSessions = FaithionStorageService.getBibleReadingHistory();

  // Histórico unificado reativo
  const unifiedHistory = useMemo(() => {
    return FaithionStorageService.getUnifiedJourneyHistory();
  }, [timelineRefreshKey, localPracticeRecords, reflections, currentTasks, currentPlans]);

  // Cálculo reativo do Guia da Jornada e Padrões de Adaptação
  const guideResult = useMemo(() => {
    const res = JourneyGuideService.computeJourneyGuide({
      tasks: currentTasks,
      plans: currentPlans,
      routineActivities: currentRoutineActivities,
      executionLogs: currentExecutionLogs,
      objectives: currentObjectives,
      profile,
      prayers: currentPrayers,
      fastingPlan: currentFastingPlan
    });

    const filteredAdaptations = res.adaptations.filter(a => !dismissedAdaptationIds.includes(a.id));
    return {
      ...res,
      adaptations: filteredAdaptations
    };
  }, [
    currentTasks, 
    currentPlans, 
    currentRoutineActivities, 
    currentExecutionLogs, 
    currentObjectives, 
    profile, 
    currentPrayers, 
    currentFastingPlan,
    dismissedAdaptationIds
  ]);

  // Cálculo das Métricas Objetivas da Consistência para Hoje, Semana, Mês
  const todayMetrics = useMemo(() => {
    return ConsistencyService.calculateMetrics({
      period: 'today',
      tasks: currentTasks,
      plans: currentPlans,
      executionLogs: currentExecutionLogs,
      prayers: currentPrayers,
      fasts: currentFasts,
      bibleSessions: currentBibleSessions,
      practices: localPracticeRecords,
      consistencyHistory
    });
  }, [currentTasks, currentPlans, currentExecutionLogs, currentPrayers, currentFasts, currentBibleSessions, localPracticeRecords, consistencyHistory]);

  const weekMetrics = useMemo(() => {
    return ConsistencyService.calculateMetrics({
      period: 'week',
      tasks: currentTasks,
      plans: currentPlans,
      executionLogs: currentExecutionLogs,
      prayers: currentPrayers,
      fasts: currentFasts,
      bibleSessions: currentBibleSessions,
      practices: localPracticeRecords,
      consistencyHistory
    });
  }, [currentTasks, currentPlans, currentExecutionLogs, currentPrayers, currentFasts, currentBibleSessions, localPracticeRecords, consistencyHistory]);

  const monthMetrics = useMemo(() => {
    return ConsistencyService.calculateMetrics({
      period: 'month',
      tasks: currentTasks,
      plans: currentPlans,
      executionLogs: currentExecutionLogs,
      prayers: currentPrayers,
      fasts: currentFasts,
      bibleSessions: currentBibleSessions,
      practices: localPracticeRecords,
      consistencyHistory
    });
  }, [currentTasks, currentPlans, currentExecutionLogs, currentPrayers, currentFasts, currentBibleSessions, localPracticeRecords, consistencyHistory]);

  // Padrões Comportamentais (Observações neutras de ritmo)
  const behavioralObservations = useMemo(() => {
    return ConsistencyService.detectBehavioralPatterns({
      tasks: currentTasks,
      plans: currentPlans,
      executionLogs: currentExecutionLogs,
      bibleSessions: currentBibleSessions,
      practices: localPracticeRecords,
      consistencyHistory
    });
  }, [currentTasks, currentPlans, currentExecutionLogs, currentBibleSessions, localPracticeRecords, consistencyHistory]);

  // Filtragem dos itens de timeline para Hoje
  const todayEntries = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return unifiedHistory.filter(e => e.date === todayStr);
  }, [unifiedHistory]);

  // Filtragem dos itens de timeline para Esta Semana
  const weekEntries = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    return unifiedHistory.filter(e => {
      const d = new Date(e.timestamp || e.date);
      return d >= sevenDaysAgo && d <= now;
    });
  }, [unifiedHistory]);

  // Filtragem dos itens de timeline para Este Mês
  const monthEntries = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return unifiedHistory.filter(e => {
      const d = new Date(e.timestamp || e.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
  }, [unifiedHistory]);

  // Filtragem completa e detalhada para o HISTÓRICO
  const filteredHistoryEntries = useMemo(() => {
    return unifiedHistory.filter(entry => {
      // Filtro de Período
      if (historyPeriodFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (entry.date !== todayStr) return false;
      } else if (historyPeriodFilter === 'week') {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        const d = new Date(entry.timestamp || entry.date);
        if (d < sevenDaysAgo || d > now) return false;
      } else if (historyPeriodFilter === 'month') {
        const now = new Date();
        const d = new Date(entry.timestamp || entry.date);
        if (d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) return false;
      } else if (historyPeriodFilter === '30days') {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const d = new Date(entry.timestamp || entry.date);
        if (d < thirtyDaysAgo || d > now) return false;
      }

      // Filtro por Tipo de Atividade (10 Categorias)
      if (historyTypeFilter !== 'all' && entry.type !== historyTypeFilter) {
        return false;
      }

      // Filtro por Status
      if (historyStatusFilter !== 'all') {
        if (historyStatusFilter === 'concluido' && entry.status !== 'concluido') return false;
        if (historyStatusFilter === 'parcial' && entry.status !== 'parcial') return false;
        if (historyStatusFilter === 'atrasado' && entry.status !== 'atrasado') return false;
        if (historyStatusFilter === 'ignorado' && entry.status !== 'ignorado') return false;
      }

      // Filtro por Busca de Texto
      if (historySearchQuery.trim()) {
        const q = historySearchQuery.toLowerCase();
        const matchTitle = entry.title?.toLowerCase().includes(q);
        const matchContent = entry.content?.toLowerCase().includes(q);
        const matchPassage = entry.passageRef?.toLowerCase().includes(q) || entry.scriptureRef?.toLowerCase().includes(q);
        const matchPrayer = entry.prayerText?.toLowerCase().includes(q);
        const matchReflection = entry.reflectionText?.toLowerCase().includes(q);
        const matchResult = entry.resultNotes?.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchPassage && !matchPrayer && !matchReflection && !matchResult) {
          return false;
        }
      }

      return true;
    });
  }, [unifiedHistory, historyPeriodFilter, historyTypeFilter, historyStatusFilter, historySearchQuery]);

  // Handlers
  const handleSavePractice = (newRecordData: Omit<PracticeRecord, 'id' | 'createdAt'>) => {
    const created = FaithionStorageService.addPracticeRecord(newRecordData);
    setLocalPracticeRecords(FaithionStorageService.getPracticeRecords());
    setTimelineRefreshKey(k => k + 1);
    setFeedbackMessage(`Prática "${created.title}" registrada com sucesso!`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleDeletePractice = (id: string) => {
    const updated = FaithionStorageService.deletePracticeRecord(id);
    setLocalPracticeRecords(updated);
    setTimelineRefreshKey(k => k + 1);
    setFeedbackMessage('Registro removido do histórico.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleApplyAdaptation = () => {
    onUpdateProfileGoals(adaptedPrayer, adaptedChapters);
    setAdaptedSuccess(true);
    setTimeout(() => {
      setAdaptedSuccess(false);
      setIsAdapting(false);
    }, 1500);
  };

  const handleStartActivity = (item: JourneyGuideRecommendationItem) => {
    if (onStartTask) {
      onStartTask(item.id);
    } else {
      const updated = FaithionStorageService.startTask(item.id);
      setLocalTasks(updated);
    }
  };

  const handleCompleteActivity = (activityId: string) => {
    if (onCompleteTask) {
      onCompleteTask(activityId);
    } else {
      const { tasks: updated } = FaithionStorageService.completeTask(activityId);
      setLocalTasks(updated);
    }
    setFeedbackMessage('Prática diária concluída.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleIgnoreActivity = (activityId: string) => {
    if (onIgnoreTask) {
      onIgnoreTask(activityId);
    } else {
      const updated = FaithionStorageService.ignoreTask(activityId, 'Adiada para outro momento');
      setLocalTasks(updated);
    }
  };

  const handleAcceptAdaptation = (adapt: JourneyAdaptationSuggestion) => {
    if (propOnAcceptAdaptation) {
      propOnAcceptAdaptation(adapt);
    }

    if (adapt.actionPayload.type === 'reduce_duration' && adapt.activityId && adapt.actionPayload.newDuration) {
      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, {
        estimatedMinutes: adapt.actionPayload.newDuration
      });
      setLocalRoutineActivities(updated);
      setFeedbackMessage(`Duração ajustada para ${adapt.actionPayload.newDuration} minutos.`);
    } else if (adapt.actionPayload.type === 'spread_plan' && adapt.planId) {
      const updated = FaithionStorageService.reorganizePlanSchedule(adapt.planId);
      setLocalPlans(updated);
      setFeedbackMessage('Plano reorganizado com dias adicionais de respiro.');
    } else if (adapt.actionPayload.type === 'change_block' && adapt.activityId && adapt.actionPayload.newBlock) {
      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, {
        block: adapt.actionPayload.newBlock
      });
      setLocalRoutineActivities(updated);
      setFeedbackMessage('Prática redistribuída na rotina.');
    } else if (adapt.actionPayload.type === 'change_time' && adapt.activityId && adapt.actionPayload.newTime) {
      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, {
        suggestedTime: adapt.actionPayload.newTime
      });
      setLocalRoutineActivities(updated);
      setFeedbackMessage(`Horário antecipado para ${adapt.actionPayload.newTime}.`);
    } else {
      setFeedbackMessage('Adaptação confirmada com sucesso.');
    }

    setDismissedAdaptationIds(prev => [...prev, adapt.id]);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleIgnoreAdaptation = (adaptId: string) => {
    if (propOnIgnoreAdaptation) {
      propOnIgnoreAdaptation(adaptId);
    }
    setDismissedAdaptationIds(prev => [...prev, adaptId]);
  };

  const handleAdjustAdaptation = (adapt: JourneyAdaptationSuggestion, adjustments: {
    duration?: number;
    time?: string;
    block?: RoutineBlock;
  }) => {
    if (propOnAdjustAdaptation) {
      propOnAdjustAdaptation(adapt, adjustments);
    }

    if (adapt.activityId) {
      const updates: Partial<RoutineActivity> = {};
      if (adjustments.duration !== undefined) updates.estimatedMinutes = adjustments.duration;
      if (adjustments.time !== undefined) updates.suggestedTime = adjustments.time;
      if (adjustments.block !== undefined) updates.block = adjustments.block;

      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, updates);
      setLocalRoutineActivities(updated);
      setFeedbackMessage(`Prática ajustada (${adjustments.duration || ''} min).`);
    } else {
      setFeedbackMessage('Ajuste salvo com sucesso.');
    }

    setDismissedAdaptationIds(prev => [...prev, adapt.id]);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header Principal da Jornada */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Acompanhamento Espiritual Integrado
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
            Jornada, Consistência & Histórico
          </h2>
          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
            Registro factual e observação de hábitos sem notas espirituais ou julgamento.
          </p>
        </div>

        {/* Botões de Ação Imediata */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            id="register-practice-btn"
            onClick={() => {
              setInitialPracticeCategory('bible');
              setIsPracticeModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#29523F] hover:bg-[#1E3D2F] text-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Prática</span>
          </button>

          <button
            id="new-reflection-btn"
            onClick={() => {
              setEditingReflection(null);
              setIsReflectionModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-[#19211D] dark:text-[#F1F4F2] hover:bg-neutral-50 dark:hover:bg-[#23312B] transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Nova Reflexão</span>
          </button>
        </div>
      </div>

      {/* Navegação da Visão da Jornada (Hoje | Esta semana | Este mês | Histórico + Acessórios) */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E6E6DF] dark:border-[#24322C] pb-2 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          <button
            id="tab-journey-today"
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'today'
                ? 'bg-[#162E23] text-white shadow-xs'
                : 'text-[#4B554F] dark:text-[#A0ABA5] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Hoje</span>
            {todayEntries.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {todayEntries.length}
              </span>
            )}
          </button>

          <button
            id="tab-journey-week"
            onClick={() => setActiveTab('week')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'week'
                ? 'bg-[#162E23] text-white shadow-xs'
                : 'text-[#4B554F] dark:text-[#A0ABA5] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span>Esta semana</span>
            <span className="text-[10px] opacity-75">
              ({weekMetrics.activeDaysCount}/7d)
            </span>
          </button>

          <button
            id="tab-journey-month"
            onClick={() => setActiveTab('month')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'month'
                ? 'bg-[#162E23] text-white shadow-xs'
                : 'text-[#4B554F] dark:text-[#A0ABA5] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Este mês</span>
            <span className="text-[10px] opacity-75">
              ({monthMetrics.completedActivities} ações)
            </span>
          </button>

          <button
            id="tab-journey-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-[#162E23] text-white shadow-xs'
                : 'text-[#4B554F] dark:text-[#A0ABA5] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Histórico Completo</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[10px]">
              {unifiedHistory.length}
            </span>
          </button>
        </div>

        {/* Abas Secundárias */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-[#E6E6DF] dark:border-[#24322C]">
          <button
            id="tab-journey-guide"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'guide'
                ? 'bg-[#29523F]/20 text-[#29523F] dark:text-[#4F8E71] font-bold'
                : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Guia Passo a Passo</span>
            {guideResult.adaptations.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            id="tab-journey-reflections"
            onClick={() => setActiveTab('reflections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'reflections'
                ? 'bg-[#29523F]/20 text-[#29523F] dark:text-[#4F8E71] font-bold'
                : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Caderno ({reflections.length})</span>
          </button>

          <button
            id="tab-journey-goals"
            onClick={() => setActiveTab('goals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'goals'
                ? 'bg-[#29523F]/20 text-[#29523F] dark:text-[#4F8E71] font-bold'
                : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Metas</span>
          </button>
        </div>
      </div>

      {/* Feedback suave de ação */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-[#2A6E4F] dark:text-[#4F8E71] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 1: HOJE */}
      {/* ========================================================================= */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          
          {/* Métricas Objetivas de Hoje */}
          <ConsistencyDashboard
            metrics={todayMetrics}
            observations={behavioralObservations.slice(0, 2)}
            periodLabel="Hoje"
          />

          {/* Guia Rápido de Hoje: Próxima Prática Recomendada */}
          {guideResult.currentActivity && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#13221C] dark:to-[#172922] border border-emerald-200/80 dark:border-[#243F33] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#29523F] dark:text-[#4F8E71]">
                  Recomendação Para o Seu Momento Atual
                </span>
                <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  {guideResult.currentActivity.title}
                </h3>
                <p className="text-xs text-[#4B554F] dark:text-[#A0ABA5]">
                  {guideResult.currentActivity.contextNote || guideResult.explanation}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCompleteActivity(guideResult.currentActivity!.id)}
                  className="px-4 py-2 rounded-xl bg-[#29523F] hover:bg-[#1E3D2F] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Concluir</span>
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-[#385949] text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:bg-white/50 transition-colors"
                >
                  Ver Guia Completo
                </button>
              </div>
            </div>
          )}

          {/* Timeline Estruturada de Hoje (Data → atividade → passagem → oração → reflexão → resultado) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] dark:text-[#788780]">
                Timeline das Práticas de Hoje ({todayEntries.length})
              </h3>
              <button
                onClick={() => {
                  setInitialPracticeCategory('bible');
                  setIsPracticeModalOpen(true);
                }}
                className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Prática a Hoje</span>
              </button>
            </div>

            {todayEntries.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-3">
                <Clock className="w-8 h-8 mx-auto text-[#7D8882]/60" />
                <p className="text-sm font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                  Nenhuma prática registrada ainda no dia de hoje.
                </p>
                <p className="text-xs text-[#7D8882] max-w-md mx-auto">
                  Você pode iniciar uma leitura, dedicar alguns minutos em oração, ou registrar uma atividade realizada.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => setIsPracticeModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#29523F] text-white text-xs font-bold shadow-xs hover:bg-[#1E3D2F] transition-colors"
                  >
                    Registrar Agora
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {todayEntries.map(entry => (
                  <JourneyTimelineCard
                    key={entry.id}
                    entry={entry}
                    onNavigateToBible={onNavigateToBible}
                    onDeletePractice={handleDeletePractice}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: ESTA SEMANA */}
      {/* ========================================================================= */}
      {activeTab === 'week' && (
        <div className="space-y-6">
          
          {/* Métricas Objetivas e Padrões da Semana */}
          <ConsistencyDashboard
            metrics={weekMetrics}
            observations={behavioralObservations}
            periodLabel="Últimos 7 Dias"
          />

          {/* Timeline da Semana */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] dark:text-[#788780]">
                Linha do Tempo da Semana ({weekEntries.length} registros)
              </h3>
              <span className="text-xs text-[#7D8882]">
                Estrutura: Data → Atividade → Passagem → Oração → Reflexão → Resultado
              </span>
            </div>

            {weekEntries.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-2">
                <CalendarDays className="w-8 h-8 mx-auto text-[#7D8882]/60" />
                <p className="text-sm font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                  Nenhum registro encontrado nos últimos 7 dias.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {weekEntries.map(entry => (
                  <JourneyTimelineCard
                    key={entry.id}
                    entry={entry}
                    onNavigateToBible={onNavigateToBible}
                    onDeletePractice={handleDeletePractice}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: ESTE MÊS */}
      {/* ========================================================================= */}
      {activeTab === 'month' && (
        <div className="space-y-6">
          
          {/* Métricas Objetivas e Padrões do Mês */}
          <ConsistencyDashboard
            metrics={monthMetrics}
            observations={behavioralObservations}
            periodLabel="Mês Atual"
          />

          {/* Timeline do Mês */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D8882] dark:text-[#788780]">
                Linha do Tempo do Mês ({monthEntries.length} registros)
              </h3>
              <span className="text-xs text-[#7D8882]">
                Histórico mensal contínuo
              </span>
            </div>

            {monthEntries.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-[#7D8882]/60" />
                <p className="text-sm font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                  Nenhum registro acumulado neste mês.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {monthEntries.map(entry => (
                  <JourneyTimelineCard
                    key={entry.id}
                    entry={entry}
                    onNavigateToBible={onNavigateToBible}
                    onDeletePractice={handleDeletePractice}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: HISTÓRICO COMPLETO COM FILTROS AVANÇADOS E CONSULTA */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          
          {/* Caixa de Filtros Avançados */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs space-y-4">
            
            {/* Linha 1: Busca por Texto */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7D8882]" />
                <input
                  type="text"
                  id="history-search-input"
                  placeholder="Buscar por passagem, oração, reflexão ou título..."
                  value={historySearchQuery}
                  onChange={e => setHistorySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
                />
              </div>

              {/* Filtro por Período */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Todo o Tempo' },
                  { id: 'today', label: 'Hoje' },
                  { id: 'week', label: '7 Dias' },
                  { id: 'month', label: 'Este Mês' },
                  { id: '30days', label: '30 Dias' }
                ].map(p => (
                  <button
                    key={p.id}
                    id={`filter-period-${p.id}`}
                    onClick={() => setHistoryPeriodFilter(p.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                      historyPeriodFilter === p.id
                        ? 'bg-[#29523F] text-white shadow-2xs'
                        : 'bg-neutral-100 dark:bg-[#1B2621] text-[#4B554F] dark:text-[#A0ABA5] hover:bg-neutral-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Linha 2: Filtro pelas 10 Práticas de Acompanhamento */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-[#7D8882] dark:text-[#788780] tracking-wider">
                  Filtrar por Modalidade de Prática (10 Categorias)
                </span>
                {(historyTypeFilter !== 'all' || historyPeriodFilter !== 'all' || historyStatusFilter !== 'all' || historySearchQuery) && (
                  <button
                    onClick={() => {
                      setHistoryPeriodFilter('all');
                      setHistoryTypeFilter('all');
                      setHistoryStatusFilter('all');
                      setHistorySearchQuery('');
                    }}
                    className="text-xs text-[#29523F] dark:text-[#4F8E71] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar Filtros</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Todas as Práticas' },
                  { id: 'bible', label: 'Leitura Bíblica' },
                  { id: 'prayer', label: 'Oração' },
                  { id: 'fasting', label: 'Jejum' },
                  { id: 'reflection', label: 'Reflexão' },
                  { id: 'study', label: 'Estudo' },
                  { id: 'plan', label: 'Planos' },
                  { id: 'activity', label: 'Rotina' },
                  { id: 'event', label: 'Cultos & Eventos' },
                  { id: 'memorization', label: 'Memorização' },
                  { id: 'custom', label: 'Personalizadas' }
                ].map(t => (
                  <button
                    key={t.id}
                    id={`filter-type-${t.id}`}
                    onClick={() => setHistoryTypeFilter(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                      historyTypeFilter === t.id
                        ? 'bg-[#162E23] text-white font-bold'
                        : 'bg-neutral-100 dark:bg-[#1B2621] text-[#4B554F] dark:text-[#A0ABA5] hover:bg-neutral-200 dark:hover:bg-[#25352E]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Linha 3: Filtro por Status da Ação */}
            <div className="flex items-center gap-2 text-xs pt-1 border-t border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882]">
              <span className="font-semibold">Status:</span>
              {[
                { id: 'all', label: 'Todos os Status' },
                { id: 'concluido', label: 'Concluídos' },
                { id: 'parcial', label: 'Parciais' },
                { id: 'atrasado', label: 'Atrasados' },
                { id: 'ignorado', label: 'Ignorados' }
              ].map(s => (
                <button
                  key={s.id}
                  id={`filter-status-${s.id}`}
                  onClick={() => setHistoryStatusFilter(s.id)}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    historyStatusFilter === s.id
                      ? 'bg-[#29523F]/20 text-[#29523F] dark:text-[#4F8E71] font-bold'
                      : 'hover:text-[#19211D]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

          </div>

          {/* Resultado da Consulta: Timeline Estruturada */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7D8882] dark:text-[#788780]">
                Linha do Tempo Estruturada: Data → Atividade → Passagem → Oração → Reflexão → Resultado
              </span>
              <span className="text-xs font-semibold text-[#29523F] dark:text-[#4F8E71]">
                {filteredHistoryEntries.length} registros encontrados
              </span>
            </div>

            {filteredHistoryEntries.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-3">
                <Layers className="w-8 h-8 mx-auto text-[#7D8882]/60" />
                <p className="text-sm font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                  Nenhum registro corresponde aos filtros selecionados.
                </p>
                <p className="text-xs text-[#7D8882]">
                  Tente alterar o período ou selecionar "Todas as Práticas".
                </p>
                <button
                  onClick={() => {
                    setHistoryPeriodFilter('all');
                    setHistoryTypeFilter('all');
                    setHistoryStatusFilter('all');
                    setHistorySearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#29523F] text-white text-xs font-bold"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistoryEntries.map(entry => (
                  <JourneyTimelineCard
                    key={entry.id}
                    entry={entry}
                    onNavigateToBible={onNavigateToBible}
                    onDeletePractice={handleDeletePractice}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 5: GUIA DA JORNADA PASSO A PASSO */}
      {/* ========================================================================= */}
      {activeTab === 'guide' && (
        <JourneyGuideSection
          currentActivity={guideResult.currentActivity}
          nextActivity={guideResult.nextActivity}
          subsequentActivities={guideResult.subsequentActivities}
          explanation={guideResult.explanation}
          adaptations={guideResult.adaptations}
          onStartActivity={handleStartActivity}
          onCompleteActivity={handleCompleteActivity}
          onIgnoreActivity={handleIgnoreActivity}
          onAcceptAdaptation={handleAcceptAdaptation}
          onIgnoreAdaptation={handleIgnoreAdaptation}
          onAdjustAdaptation={handleAdjustAdaptation}
          onOpenBible={onNavigateToBible ? () => onNavigateToBible() : undefined}
          onOpenPrayer={onNavigateToPrayer}
          onOpenFasting={onNavigateToFasting}
        />
      )}

      {/* ========================================================================= */}
      {/* ABA 6: CADERNO DE REFLEXÕES */}
      {/* ========================================================================= */}
      {activeTab === 'reflections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Caderno de Meditação & Diário Espiritual
              </h3>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                {reflections.length} reflexões e escutas registradas.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingReflection(null);
                setIsReflectionModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#29523F] text-white text-xs font-bold shadow-xs hover:bg-[#1E3D2F] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Escrever Reflexão</span>
            </button>
          </div>

          {reflections.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-2">
              <FileText className="w-8 h-8 mx-auto text-[#7D8882]/60" />
              <p className="text-sm font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                Nenhuma reflexão anotada ainda.
              </p>
              <p className="text-xs text-[#7D8882]">
                Anote o que Deus ministrou ao seu coração durante sua leitura bíblica ou momento de oração.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {reflections.map(ref => (
                <div
                  key={ref.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#7D8882] mb-1">
                      <span>{new Date(ref.date).toLocaleDateString('pt-BR')}</span>
                      {ref.scriptureRef && (
                        <button
                          onClick={() => onNavigateToBible?.(ref.scriptureRef)}
                          className="font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline"
                        >
                          {ref.scriptureRef}
                        </button>
                      )}
                    </div>
                    {ref.relatedTitle && (
                      <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                        {ref.relatedTitle}
                      </h4>
                    )}
                    <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed line-clamp-4 mt-1">
                      {ref.whatLearned || ref.whatGodSpoke || ref.whatCaughtAttention || ref.notes}
                    </p>
                    {ref.howToApply && (
                      <div className="mt-2 text-xs p-2 rounded-lg bg-neutral-50 dark:bg-[#1B2621] text-[#29523F] dark:text-[#4F8E71] font-medium">
                        <strong>Aplicação:</strong> {ref.howToApply}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingReflection(ref);
                        setIsReflectionModalOpen(true);
                      }}
                      className="text-xs text-[#7D8882] hover:text-[#19211D] font-medium"
                    >
                      Editar
                    </button>
                    {onDeleteReflection && (
                      <button
                        onClick={() => onDeleteReflection(ref.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium ml-2"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 7: METAS & AJUSTE SAUDÁVEL */}
      {/* ========================================================================= */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Ajuste Saudável de Metas & Hábitos
              </h3>
              <p className="text-xs text-[#7D8882] dark:text-[#788780] mt-0.5">
                Adapte seus alvos ao ritmo real de sua rotina. Constância sustentável é melhor que sobrecarga.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                  Meta de Oração Diária: {adaptedPrayer} minutos
                </label>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={adaptedPrayer}
                  onChange={(e) => setAdaptedPrayer(Number(e.target.value))}
                  className="w-full accent-[#29523F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                  Meta de Capítulos Bíblicos por Dia: {adaptedChapters}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(c => (
                    <button
                      key={c}
                      onClick={() => setAdaptedChapters(c)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        adaptedChapters === c
                          ? 'bg-[#162E23] text-white'
                          : 'bg-neutral-100 dark:bg-[#1B2521] text-[#7D8882]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  onClick={handleApplyAdaptation}
                  className="px-5 py-2 rounded-xl bg-[#29523F] hover:bg-[#1E3D2F] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {adaptedSuccess ? 'Metas Salvas com Sucesso!' : 'Salvar Alterações de Metas'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Registrar Prática Espiritual / Evento (10 Categorias) */}
      <RegisterPracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        onSave={handleSavePractice}
        initialCategory={initialPracticeCategory}
      />

      {/* Modal de Reflexão */}
      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => {
          setIsReflectionModalOpen(false);
          setEditingReflection(null);
        }}
        onSave={(data) => {
          if (data.id && onUpdateReflection) {
            onUpdateReflection(data.id, data);
          } else {
            onAddReflection(data);
          }
          setEditingReflection(null);
          setTimelineRefreshKey(k => k + 1);
        }}
        initialReflection={editingReflection}
      />

    </div>
  );
};
