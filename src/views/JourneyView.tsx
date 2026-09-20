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
  ChevronRight
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
  RoutineBlock
} from '../types';
import { ReflectionModal } from '../components/reflection/ReflectionModal';
import { JourneyGuideSection } from '../components/journey/JourneyGuideSection';
import { FaithionStorageService } from '../services/storage';
import { JourneyGuideService } from '../services/journeyGuideService';

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
  const [activeTab, setActiveTab] = useState<'guide' | 'timeline' | 'reflections' | 'goals'>('guide');
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'bible' | 'prayer' | 'fasting' | 'reflection'>('all');
  
  // Feedback suave de ação no Guia
  const [guideFeedback, setGuideFeedback] = useState<string | null>(null);

  // Estados locais para dados quando não passados via props
  const [localTasks, setLocalTasks] = useState<DailyTask[]>(() => propTasks || FaithionStorageService.getDailyTasks());
  const [localPlans, setLocalPlans] = useState<ReadingPlan[]>(() => propPlans || FaithionStorageService.getReadingPlans());
  const [localRoutineActivities, setLocalRoutineActivities] = useState<RoutineActivity[]>(() => 
    propRoutineActivities || FaithionStorageService.getRoutineActivities()
  );
  const [dismissedAdaptationIds, setDismissedAdaptationIds] = useState<string[]>([]);

  // Sincroniza se as props mudarem
  const currentTasks = propTasks || localTasks;
  const currentPlans = propPlans || localPlans;
  const currentRoutineActivities = propRoutineActivities || localRoutineActivities;
  const currentPrayers = propPrayers || FaithionStorageService.getPrayerRequests();
  const currentFastingPlan = propFastingPlan || FaithionStorageService.getFastingPlan();
  const currentExecutionLogs = propExecutionLogs || FaithionStorageService.getExecutionLogs();
  const currentObjectives = propObjectives || FaithionStorageService.getObjectives();

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

    // Filtra adaptações que foram descartadas localmente
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

  // Reflection Modal State
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);

  // Adaptação de Carga
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptedPrayer, setAdaptedPrayer] = useState(profile.dailyPrayerGoalMinutes);
  const [adaptedChapters, setAdaptedChapters] = useState(profile.dailyBibleChaptersGoal);
  const [adaptedSuccess, setAdaptedSuccess] = useState(false);

  // Unified timeline history
  const unifiedHistory = FaithionStorageService.getUnifiedJourneyHistory();
  const filteredHistory = unifiedHistory.filter(entry => {
    if (timelineFilter === 'all') return true;
    return entry.type === timelineFilter;
  });

  const handleApplyAdaptation = () => {
    onUpdateProfileGoals(adaptedPrayer, adaptedChapters);
    setAdaptedSuccess(true);
    setTimeout(() => {
      setAdaptedSuccess(false);
      setIsAdapting(false);
    }, 1500);
  };

  // Handlers do Guia da Jornada
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
    setGuideFeedback('Prática concluída com serenidade.');
    setTimeout(() => setGuideFeedback(null), 3000);
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

    // Aplicação transparente conforme a ação sugerida
    if (adapt.actionPayload.type === 'reduce_duration' && adapt.activityId && adapt.actionPayload.newDuration) {
      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, {
        estimatedMinutes: adapt.actionPayload.newDuration
      });
      setLocalRoutineActivities(updated);
      setGuideFeedback(`Duração ajustada para ${adapt.actionPayload.newDuration} minutos.`);
    } else if (adapt.actionPayload.type === 'spread_plan' && adapt.planId) {
      const updated = FaithionStorageService.reorganizePlanSchedule(adapt.planId);
      setLocalPlans(updated);
      setGuideFeedback('Plano reorganizado com dias adicionais de respiro.');
    } else if (adapt.actionPayload.type === 'change_block' && adapt.activityId && adapt.actionPayload.newBlock) {
      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, {
        block: adapt.actionPayload.newBlock
      });
      setLocalRoutineActivities(updated);
      setGuideFeedback('Prática redistribuída na rotina.');
    } else if (adapt.actionPayload.type === 'change_time' && adapt.activityId && adapt.actionPayload.newTime) {
      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, {
        scheduledTime: adapt.actionPayload.newTime
      });
      setLocalRoutineActivities(updated);
      setGuideFeedback(`Horário antecipado para ${adapt.actionPayload.newTime}.`);
    } else {
      setGuideFeedback('Adaptação confirmada com sucesso.');
    }

    setDismissedAdaptationIds(prev => [...prev, adapt.id]);
    setTimeout(() => setGuideFeedback(null), 3500);
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
      if (adjustments.time !== undefined) updates.scheduledTime = adjustments.time;
      if (adjustments.block !== undefined) updates.block = adjustments.block;

      const updated = FaithionStorageService.updateRoutineActivity(adapt.activityId, updates);
      setLocalRoutineActivities(updated);
      setGuideFeedback(`Prática ajustada manualmente (${adjustments.duration || ''} min).`);
    } else {
      setGuideFeedback('Ajuste salvo com sucesso.');
    }

    setDismissedAdaptationIds(prev => [...prev, adapt.id]);
    setTimeout(() => setGuideFeedback(null), 3500);
  };

  const getEntryIcon = (type: JourneyEntry['type']) => {
    switch (type) {
      case 'bible':
        return <BookOpen className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />;
      case 'prayer':
        return <HeartHandshake className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'fasting':
        return <Flame className="w-4 h-4 text-[#C59B3F]" />;
      case 'reflection':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const getEntryBadge = (type: JourneyEntry['type']) => {
    switch (type) {
      case 'bible':
        return { label: 'Bíblia', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#29523F] dark:text-[#4F8E71] border-emerald-200' };
      case 'prayer':
        return { label: 'Oração', bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200' };
      case 'fasting':
        return { label: 'Jejum', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200' };
      case 'reflection':
      default:
        return { label: 'Reflexão', bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header Principle */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Jornada Espiritual & Integração
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
            Histórico Integrado da Jornada
          </h2>
          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
            Bíblia → Oração → Jejum → Reflexão registrados em perfeita unidade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="new-reflection-btn"
            onClick={() => {
              setEditingReflection(null);
              setIsReflectionModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Nova Reflexão</span>
          </button>
        </div>
      </div>

      {/* Navegação entre Visualizações: Guia da Jornada vs Timeline Integrada vs Diário de Reflexões vs Metas */}
      <div className="flex items-center gap-2 border-b border-[#E6E6DF] dark:border-[#24322C] pb-2 overflow-x-auto">
        <button
          id="tab-journey-guide"
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'guide'
              ? 'bg-[#162E23] text-white shadow-xs'
              : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-300" />
          <span>Guia da Jornada</span>
          {guideResult.adaptations.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#162E23] text-[10px] font-extrabold">
              {guideResult.adaptations.length}
            </span>
          )}
        </button>

        <button
          id="tab-journey-timeline"
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'timeline'
              ? 'bg-[#162E23] text-white shadow-xs'
              : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Linha do Tempo Unificada ({unifiedHistory.length})</span>
        </button>

        <button
          id="tab-journey-reflections"
          onClick={() => setActiveTab('reflections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'reflections'
              ? 'bg-[#162E23] text-white shadow-xs'
              : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Caderno de Reflexões ({reflections.length})</span>
        </button>

        <button
          id="tab-journey-goals"
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'goals'
              ? 'bg-[#162E23] text-white shadow-xs'
              : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Metas & Hábitos</span>
        </button>
      </div>

      {/* Feedback suave de ação */}
      {guideFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-[#2A6E4F] dark:text-[#4F8E71] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{guideFeedback}</span>
        </div>
      )}

      {/* ABA 0: GUIA DA JORNADA */}
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
          onNavigateToBible={onNavigateToBible}
          onNavigateToPrayer={onNavigateToPrayer}
          onNavigateToFasting={onNavigateToFasting}
        />
      )}

      {/* ABA 1: LINHA DO TEMPO UNIFICADA */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[#7D8882] font-semibold mr-1">Filtrar Atividades:</span>
              {[
                { id: 'all', label: 'Todas as Ações' },
                { id: 'bible', label: 'Bíblia' },
                { id: 'prayer', label: 'Oração' },
                { id: 'fasting', label: 'Jejum' },
                { id: 'reflection', label: 'Reflexão' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTimelineFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                    timelineFilter === f.id
                      ? 'bg-[#162E23] text-white shadow-xs'
                      : 'bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] hover:bg-neutral-50 dark:hover:bg-[#1B2521]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-[#7D8882]">
              {filteredHistory.length} marcos espirituais registrados
            </p>
          </div>

          {/* Cards da Timeline */}
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
              Nenhum registro encontrado para este filtro na jornada.
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-[#E6E6DF] dark:border-[#24322C] space-y-4 ml-3 sm:ml-4">
              {filteredHistory.map((entry) => {
                const badge = getEntryBadge(entry.type);

                return (
                  <div key={entry.id} className="relative group">
                    {/* Marcador na Linha */}
                    <div className="absolute -left-[31px] top-4 w-6 h-6 rounded-full bg-white dark:bg-[#141C19] border-2 border-[#29523F] flex items-center justify-center shadow-xs">
                      {getEntryIcon(entry.type)}
                    </div>

                    {/* Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-2 hover:border-[#29523F]/40 transition-all">
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(entry.timestamp))}
                          </span>
                        </div>

                        {entry.scriptureRef && (
                          <span className="px-2.5 py-0.5 rounded-md bg-[#29523F]/10 dark:bg-[#29523F]/30 text-[#29523F] dark:text-[#4F8E71] font-bold text-[11px]">
                            {entry.scriptureRef}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                        {entry.title}
                      </h4>

                      {entry.description && (
                        <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                          {entry.description}
                        </p>
                      )}

                      {/* Exibição Estruturada de Reflexão se for do tipo reflection */}
                      {entry.reflection && (
                        <div className="mt-2 p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-2 text-xs">
                          {entry.reflection.whatLearned && (
                            <div>
                              <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-1">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                <span>O que aprendi:</span>
                              </span>
                              <p className="text-[#4B554F] dark:text-[#B0BBB5] pl-4">{entry.reflection.whatLearned}</p>
                            </div>
                          )}

                          {entry.reflection.whatCaughtAttention && (
                            <div>
                              <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-sky-500" />
                                <span>O que me chamou atenção:</span>
                              </span>
                              <p className="text-[#4B554F] dark:text-[#B0BBB5] pl-4">{entry.reflection.whatCaughtAttention}</p>
                            </div>
                          )}

                          {entry.reflection.howToApply && (
                            <div>
                              <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-1">
                                <Footprints className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Como posso aplicar:</span>
                              </span>
                              <p className="text-[#4B554F] dark:text-[#B0BBB5] pl-4">{entry.reflection.howToApply}</p>
                            </div>
                          )}

                          {entry.reflection.personalPrayer && (
                            <div>
                              <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 text-rose-500" />
                                <span>Oração pessoal:</span>
                              </span>
                              <p className="text-[#4B554F] dark:text-[#B0BBB5] pl-4 italic">"{entry.reflection.personalPrayer}"</p>
                            </div>
                          )}

                          {entry.reflection.notes && (
                            <div>
                              <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-[#7D8882]" />
                                <span>Observações:</span>
                              </span>
                              <p className="text-[#4B554F] dark:text-[#B0BBB5] pl-4">{entry.reflection.notes}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Vínculo explícito entre disciplinas */}
                      {entry.relatedTitle && (
                        <div className="pt-2 text-[11px] text-[#7D8882] flex items-center gap-1">
                          <Compass className="w-3 h-3 text-[#29523F]" />
                          <span>Conectado a: <strong>{entry.relatedTitle}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: CADERNO DE REFLEXÕES */}
      {activeTab === 'reflections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#7D8882]">
              Registro livre de meditações, aprendizados e orações geradas após leitura ou jejum.
            </p>
            <button
              onClick={() => {
                setEditingReflection(null);
                setIsReflectionModalOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Reflexão</span>
            </button>
          </div>

          {reflections.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
              Nenhuma reflexão registrada ainda. Clique em "Registrar Reflexão" para guardar suas meditações.
            </div>
          ) : (
            <div className="space-y-4">
              {reflections.map((refl) => (
                <div
                  key={refl.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#29523F]" />
                      <span className="font-bold text-[#19211D] dark:text-[#F1F4F2]">
                        {refl.date}
                      </span>
                      {refl.scriptureRef && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] font-semibold text-[11px]">
                          {refl.scriptureRef}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingReflection(refl);
                          setIsReflectionModalOpen(true);
                        }}
                        className="text-xs text-[#7D8882] hover:text-[#19211D] underline"
                      >
                        Editar
                      </button>
                      {onDeleteReflection && (
                        <button
                          onClick={() => onDeleteReflection(refl.id)}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>

                  {/* As 5 Dimensões da Reflexão */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {(refl.whatLearned || refl.whatGodSpoke) && (
                      <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
                        <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>1. O que aprendi:</span>
                        </span>
                        <p className="text-[#19211D] dark:text-[#F1F4F2] leading-relaxed">
                          {refl.whatLearned || refl.whatGodSpoke}
                        </p>
                      </div>
                    )}

                    {refl.whatCaughtAttention && (
                      <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
                        <span className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-sky-500" />
                          <span>2. O que me chamou atenção:</span>
                        </span>
                        <p className="text-[#19211D] dark:text-[#F1F4F2] leading-relaxed">
                          {refl.whatCaughtAttention}
                        </p>
                      </div>
                    )}

                    {(refl.howToApply || refl.practicalApplication) && (
                      <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <Footprints className="w-3.5 h-3.5 text-emerald-500" />
                          <span>3. Como posso aplicar:</span>
                        </span>
                        <p className="text-[#19211D] dark:text-[#F1F4F2] leading-relaxed">
                          {refl.howToApply || refl.practicalApplication}
                        </p>
                      </div>
                    )}

                    {refl.personalPrayer && (
                      <div className="p-3 rounded-xl bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
                        <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          <span>4. Oração pessoal:</span>
                        </span>
                        <p className="text-[#19211D] dark:text-[#F1F4F2] leading-relaxed italic">
                          "{refl.personalPrayer}"
                        </p>
                      </div>
                    )}
                  </div>

                  {refl.notes && (
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
                      <strong className="text-[#19211D] dark:text-[#F1F4F2]">5. Observações:</strong> {refl.notes}
                    </div>
                  )}

                  {/* Gratidão (legado) */}
                  {refl.gratitudeNotes && refl.gratitudeNotes.length > 0 && (
                    <div className="text-xs text-[#7D8882] pt-1">
                      <strong>Gratidão:</strong> {refl.gratitudeNotes.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: METAS & ADAPTAÇÃO */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          {/* Os 4 pilares da disciplina */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
              <span className="text-[10px] uppercase font-bold text-[#29523F] dark:text-[#4F8E71]">Fase 1</span>
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">Planejar</h4>
              <p className="text-xs text-[#7D8882] mt-1">Definir rotina do dia e planos bíblicos com horários realistas.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
              <span className="text-[10px] uppercase font-bold text-[#C59B3F]">Fase 2</span>
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">Executar</h4>
              <p className="text-xs text-[#7D8882] mt-1">Ações guiadas sem paralisia por sobrecarga espiritual.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
              <span className="text-[10px] uppercase font-bold text-[#29523F] dark:text-[#4F8E71]">Fase 3</span>
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">Monitorar</h4>
              <p className="text-xs text-[#7D8882] mt-1">Acompanhar a jornada sem sentimento de culpa ou cobrança legalista.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
              <span className="text-[10px] uppercase font-bold text-[#C59B3F]">Fase 4</span>
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">Adaptar</h4>
              <p className="text-xs text-[#7D8882] mt-1">Reduzir carga em semanas difíceis para manter a constância.</p>
            </div>
          </div>

          {/* Adaptar Carga de Metas */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Ajuste Saudável de Metas
                </h3>
                <p className="text-xs text-[#7D8882] mt-0.5">
                  Está em uma semana sobrecarregada? É melhor ler 1 capítulo com atenção do que desistir.
                </p>
              </div>
              <button
                onClick={() => setIsAdapting(!isAdapting)}
                className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] underline"
              >
                {isAdapting ? 'Recolher' : 'Ajustar Metas'}
              </button>
            </div>

            {isAdapting && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E6E6DF] dark:border-[#24322C]">
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
                    className="px-5 py-2 rounded-xl bg-[#162E23] text-white text-xs font-bold shadow-xs"
                  >
                    {adaptedSuccess ? 'Metas Salvas com Sucesso!' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
        }}
        initialReflection={editingReflection}
      />

    </div>
  );
};
