import { 
  SpiritualProfile, 
  DailyTask, 
  ActivityStatus,
  PrayerRequest, 
  PrayerStatus,
  PrayerPlan,
  PrayerPlanType,
  FastingPlan, 
  FastingStatus,
  ReadingPlan, 
  PlanDay,
  PlanStatus,
  PlanFrequency,
  Reflection, 
  JourneyEntry,
  DailyConsistency,
  SpiritualGoal,
  SpiritualObjective,
  RoutineActivity,
  ActivityExecutionLog,
  RoutineAdaptationSuggestion,
  RoutineBlock,
  SupabaseSyncMetadata,
  BibleHighlight,
  HighlightColor,
  BibleFavorite,
  BibleNote,
  BibleReadingSession,
  BibleLastRead,
  BibleFontSize,
  BibleFontFamily,
  WordOfTheDay,
  WordOfTheDayHistoryItem,
  PracticeRecord
} from '../types';
import { WordOfTheDayService, PersonalizationContext } from './wordOfTheDayService';
import { 
  refreshPlanDaysStatus, 
  continueFromWhereYouLeftOff, 
  reorganizeRemainingPlan, 
  evaluateDayStatus, 
  getTodayDateString 
} from './readingPlanGenerator';
import { 
  INITIAL_SPIRITUAL_PROFILE, 
  INITIAL_DAILY_TASKS, 
  INITIAL_PRAYER_REQUESTS, 
  INITIAL_PRAYER_PLANS,
  INITIAL_FASTING_PLAN, 
  INITIAL_FASTING_RECORDS,
  INITIAL_READING_PLANS, 
  INITIAL_REFLECTIONS, 
  INITIAL_CONSISTENCY_HISTORY,
  INITIAL_GOALS,
  INITIAL_OBJECTIVES,
  INITIAL_ROUTINE_ACTIVITIES,
  INITIAL_EXECUTION_LOGS,
  INITIAL_ADAPTATION_SUGGESTIONS,
  INITIAL_PRACTICE_RECORDS
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'faithion_profile_v1',
  TASKS: 'faithion_tasks_v1',
  PRAYERS: 'faithion_prayers_v1',
  PRAYER_PLANS: 'faithion_prayer_plans_v1',
  FASTING: 'faithion_fasting_v1',
  FASTING_RECORDS: 'faithion_fasting_records_v1',
  PLANS: 'faithion_plans_v1',
  REFLECTIONS: 'faithion_reflections_v1',
  CONSISTENCY: 'faithion_consistency_v1',
  GOALS: 'faithion_goals_v1',
  OBJECTIVES: 'faithion_objectives_v1',
  ROUTINE_ACTIVITIES: 'faithion_routine_activities_v1',
  EXECUTION_LOGS: 'faithion_execution_logs_v1',
  ADAPTATION_SUGGESTIONS: 'faithion_adaptation_suggestions_v1',
  BIBLE_HIGHLIGHTS: 'faithion_bible_highlights_v1',
  BIBLE_FAVORITES: 'faithion_bible_favorites_v1',
  BIBLE_NOTES: 'faithion_bible_notes_v1',
  BIBLE_HISTORY: 'faithion_bible_history_v1',
  BIBLE_LAST_READ: 'faithion_bible_last_read_v1',
  BIBLE_SETTINGS: 'faithion_bible_settings_v1',
  PRACTICE_RECORDS: 'faithion_practice_records_v1',
  SYNC_METADATA: 'faithion_sync_meta_v1'
};

type StorageListener = (key: string, value: any) => void;
const storageListeners: StorageListener[] = [];

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`[Faithion Storage] Failed to load key "${key}", using fallback.`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    storageListeners.forEach(listener => {
      try {
        listener(key, value);
      } catch (err) {
        console.warn(`[Faithion Storage] Listener error for key ${key}:`, err);
      }
    });
  } catch (e) {
    console.error(`[Faithion Storage] Failed to save key "${key}".`, e);
  }
}

export class FaithionStorageService {
  // --- Profile ---
  static getProfile(): SpiritualProfile {
    const loaded = safeGet<Partial<SpiritualProfile>>(STORAGE_KEYS.PROFILE, INITIAL_SPIRITUAL_PROFILE);
    // Garantir que campos adicionados recentemente tenham valores padrão
    return {
      ...INITIAL_SPIRITUAL_PROFILE,
      ...loaded,
      availableTimeSlots: loaded.availableTimeSlots || INITIAL_SPIRITUAL_PROFILE.availableTimeSlots,
      availableDays: loaded.availableDays || INITIAL_SPIRITUAL_PROFILE.availableDays,
      topicsOfInterest: loaded.topicsOfInterest || INITIAL_SPIRITUAL_PROFILE.topicsOfInterest
    };
  }

  static updateProfile(profile: Partial<SpiritualProfile>): SpiritualProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    safeSet(STORAGE_KEYS.PROFILE, updated);
    return updated;
  }

  static saveProfile(profile: SpiritualProfile): void {
    safeSet(STORAGE_KEYS.PROFILE, profile);
  }

  static addChangeListener(listener: StorageListener): () => void {
    storageListeners.push(listener);
    return () => {
      const idx = storageListeners.indexOf(listener);
      if (idx >= 0) storageListeners.splice(idx, 1);
    };
  }

  // --- Objectives (Objetivos Espirituais Pessoais) ---
  static getObjectives(): SpiritualObjective[] {
    return safeGet<SpiritualObjective[]>(STORAGE_KEYS.OBJECTIVES, INITIAL_OBJECTIVES);
  }

  static saveObjectives(objectives: SpiritualObjective[]): void {
    safeSet(STORAGE_KEYS.OBJECTIVES, objectives);
  }

  static addObjective(objective: Omit<SpiritualObjective, 'id' | 'createdAt'>): SpiritualObjective {
    const current = this.getObjectives();
    const newObjective: SpiritualObjective = {
      ...objective,
      id: `obj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.saveObjectives([newObjective, ...current]);
    return newObjective;
  }

  static updateObjective(id: string, updates: Partial<SpiritualObjective>): SpiritualObjective[] {
    const current = this.getObjectives();
    const updated = current.map(obj => obj.id === id ? { ...obj, ...updates } : obj);
    this.saveObjectives(updated);
    return updated;
  }

  static deleteObjective(id: string): SpiritualObjective[] {
    const current = this.getObjectives();
    const updated = current.filter(obj => obj.id !== id);
    this.saveObjectives(updated);
    return updated;
  }

  // --- Routine Activities (Rotina Pessoal: Manhã / Dia / Noite / Flexível) ---
  static getRoutineActivities(): RoutineActivity[] {
    return safeGet<RoutineActivity[]>(STORAGE_KEYS.ROUTINE_ACTIVITIES, INITIAL_ROUTINE_ACTIVITIES);
  }

  static saveRoutineActivities(activities: RoutineActivity[]): void {
    safeSet(STORAGE_KEYS.ROUTINE_ACTIVITIES, activities);
  }

  static addRoutineActivity(activity: Omit<RoutineActivity, 'id' | 'order'>): RoutineActivity {
    const current = this.getRoutineActivities();
    const sameBlockActivities = current.filter(a => a.block === activity.block);
    const newActivity: RoutineActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      order: sameBlockActivities.length + 1
    };
    this.saveRoutineActivities([...current, newActivity]);
    return newActivity;
  }

  static updateRoutineActivity(id: string, updates: Partial<RoutineActivity>): RoutineActivity[] {
    const current = this.getRoutineActivities();
    const updated = current.map(a => a.id === id ? { ...a, ...updates } : a);
    this.saveRoutineActivities(updated);
    return updated;
  }

  static deleteRoutineActivity(id: string): RoutineActivity[] {
    const current = this.getRoutineActivities();
    const target = current.find(a => a.id === id);
    // NUNCA APAGAR HISTÓRICO: Guarda a atividade arquivada para que logs antigos nunca percam sua referência
    if (target) {
      const archived = safeGet<RoutineActivity[]>('faithion_archived_routines_v1', []);
      safeSet('faithion_archived_routines_v1', [target, ...archived.filter(a => a.id !== id)]);
    }
    const updated = current.filter(a => a.id !== id);
    this.saveRoutineActivities(updated);
    return updated;
  }

  static toggleActivityActive(id: string): RoutineActivity[] {
    const current = this.getRoutineActivities();
    const updated = current.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    this.saveRoutineActivities(updated);
    return updated;
  }

  static reorderRoutineActivities(block: RoutineBlock, orderedIds: string[]): RoutineActivity[] {
    const current = this.getRoutineActivities();
    const otherBlocks = current.filter(a => a.block !== block);
    const reorderedInBlock = orderedIds
      .map((id, index) => {
        const found = current.find(a => a.id === id);
        if (!found) return null;
        return { ...found, order: index + 1 };
      })
      .filter((item): item is RoutineActivity => item !== null);

    const merged = [...otherBlocks, ...reorderedInBlock];
    this.saveRoutineActivities(merged);
    return merged;
  }

  // --- Activity Execution Logs (Histórico e Log de Execução) ---
  static getExecutionLogs(): ActivityExecutionLog[] {
    return safeGet<ActivityExecutionLog[]>(STORAGE_KEYS.EXECUTION_LOGS, INITIAL_EXECUTION_LOGS);
  }

  static saveExecutionLogs(logs: ActivityExecutionLog[]): void {
    safeSet(STORAGE_KEYS.EXECUTION_LOGS, logs);
  }

  static logActivityExecution(log: Omit<ActivityExecutionLog, 'id' | 'loggedAt'>): ActivityExecutionLog {
    const current = this.getExecutionLogs();
    const newLog: ActivityExecutionLog = {
      ...log,
      id: `log-${Date.now()}`,
      loggedAt: new Date().toISOString()
    };
    const updated = [newLog, ...current];
    this.saveExecutionLogs(updated);

    // Avalia automaticamente oportunidades de adaptação inteligente gentil
    this.evaluateIntelligentAdaptations(updated);

    return newLog;
  }

  static deleteExecutionLog(id: string): ActivityExecutionLog[] {
    const current = this.getExecutionLogs();
    const updated = current.filter(l => l.id !== id);
    this.saveExecutionLogs(updated);
    return updated;
  }

  // --- Intelligent Adaptation (PLANEJAR → ADAPTAR) ---
  static getAdaptationSuggestions(): RoutineAdaptationSuggestion[] {
    return safeGet<RoutineAdaptationSuggestion[]>(
      STORAGE_KEYS.ADAPTATION_SUGGESTIONS, 
      INITIAL_ADAPTATION_SUGGESTIONS
    );
  }

  static saveAdaptationSuggestions(suggestions: RoutineAdaptationSuggestion[]): void {
    safeSet(STORAGE_KEYS.ADAPTATION_SUGGESTIONS, suggestions);
  }

  static applyAdaptationSuggestion(suggestionId: string): {
    suggestions: RoutineAdaptationSuggestion[];
    activities: RoutineActivity[];
  } {
    const suggestions = this.getAdaptationSuggestions();
    const targetSuggestion = suggestions.find(s => s.id === suggestionId);

    let activities = this.getRoutineActivities();

    if (targetSuggestion) {
      activities = activities.map(act => {
        if (act.id === targetSuggestion.activityId) {
          const action = targetSuggestion.suggestedAction;
          if (action.type === 'reduce_duration' && action.newDuration) {
            return { ...act, estimatedMinutes: action.newDuration };
          }
          if (action.type === 'change_block' && action.newBlock) {
            return { ...act, block: action.newBlock, suggestedTime: action.newTime || act.suggestedTime };
          }
          if (action.type === 'change_time' && action.newTime) {
            return { ...act, suggestedTime: action.newTime };
          }
          if (action.type === 'pause_temporarily') {
            return { ...act, isActive: false };
          }
        }
        return act;
      });

      this.saveRoutineActivities(activities);

      const updatedSuggestions = suggestions.map(s => 
        s.id === suggestionId ? { ...s, status: 'applied' as const } : s
      );
      this.saveAdaptationSuggestions(updatedSuggestions);
      return { suggestions: updatedSuggestions, activities };
    }

    return { suggestions, activities };
  }

  static dismissAdaptationSuggestion(suggestionId: string): RoutineAdaptationSuggestion[] {
    const suggestions = this.getAdaptationSuggestions();
    const updated = suggestions.map(s => 
      s.id === suggestionId ? { ...s, status: 'dismissed' as const } : s
    );
    this.saveAdaptationSuggestions(updated);
    return updated;
  }

  static markSuggestionReorganized(suggestionId: string): RoutineAdaptationSuggestion[] {
    const suggestions = this.getAdaptationSuggestions();
    const updated = suggestions.map(s => 
      s.id === suggestionId ? { ...s, status: 'reorganized' as const } : s
    );
    this.saveAdaptationSuggestions(updated);
    return updated;
  }

  /**
   * Monitoramento contínuo: se o usuário consistentemente não realiza uma prática
   * ou a realiza com tempo parcial devido a cansaço/falta de tempo, gera uma sugestão pastoral carinhosa.
   */
  private static evaluateIntelligentAdaptations(logs: ActivityExecutionLog[]): void {
    const activities = this.getRoutineActivities().filter(a => a.isActive);
    const existingSuggestions = this.getAdaptationSuggestions();

    for (const act of activities) {
      // Pega logs recentes dessa atividade
      const actLogs = logs.filter(l => l.activityId === act.id);
      if (actLogs.length < 3) continue;

      const recentLogs = actLogs.slice(0, 5);
      const skippedOrPartial = recentLogs.filter(l => l.status === 'pulado' || l.status === 'parcial');
      
      // Se mais de 60% foi pulado ou parcial nos últimos registros
      if (skippedOrPartial.length >= 3) {
        const hasActiveSuggestion = existingSuggestions.some(
          s => s.activityId === act.id && s.status === 'pending'
        );
        if (hasActiveSuggestion) continue;

        // Análise de motivos mais comuns
        const reasonCansaco = skippedOrPartial.filter(l => l.reason === 'cansaco').length;
        const reasonFaltaTempo = skippedOrPartial.filter(l => l.reason === 'falta_tempo').length;

        let suggestionTitle = '';
        let gentleTone = '';
        let suggestedAction: RoutineAdaptationSuggestion['suggestedAction'];

        if (act.block === 'night' && reasonCansaco >= 2) {
          suggestionTitle = `Reduzir duração de ${act.name} de ${act.estimatedMinutes}min para ${Math.max(5, Math.round(act.estimatedMinutes / 2))}min`;
          gentleTone = `Percebemos que o final do dia tem sido marcado por cansaço natural. Não há condenação alguma nisto! Que tal acolher seu corpo e manter este momento com apenas ${Math.max(5, Math.round(act.estimatedMinutes / 2))} minutos, ou realizá-lo um pouco antes de deitar?`;
          suggestedAction = {
            type: 'reduce_duration',
            title: suggestionTitle,
            newDuration: Math.max(5, Math.round(act.estimatedMinutes / 2))
          };
        } else if (act.block === 'morning' && reasonFaltaTempo >= 2) {
          suggestionTitle = `Ajustar horário ou duração matinal de ${act.name}`;
          gentleTone = `As manhãs costumam ser corridas e imprevistos acontecem. O Senhor se agrada da sinceridade do teu coração em poucos minutos de qualidade mais do que em ritos apressados. Gostaria de encurtar para ${Math.max(5, Math.round(act.estimatedMinutes / 2))} min?`;
          suggestedAction = {
            type: 'reduce_duration',
            title: suggestionTitle,
            newDuration: Math.max(5, Math.round(act.estimatedMinutes / 2))
          };
        } else {
          suggestionTitle = `Adaptar a prática de ${act.name}`;
          gentleTone = `Notamos que a prática de ${act.name} encontrou desafios para se encaixar na rotina recente. Caminhar com Deus é um relacionamento de graça, e a rotina deve servir à tua comunhão, não te oprimir. Que tal pausar temporariamente ou diminuir o tempo?`;
          suggestedAction = {
            type: 'reduce_duration',
            title: `Reduzir para ${Math.max(5, Math.round(act.estimatedMinutes / 2))} min`,
            newDuration: Math.max(5, Math.round(act.estimatedMinutes / 2))
          };
        }

        const newSuggestion: RoutineAdaptationSuggestion = {
          id: `adapt-${Date.now()}`,
          activityId: act.id,
          activityName: act.name,
          detectedPattern: `Esta atividade foi pulada ou parcial ${skippedOrPartial.length} vezes nos últimos registros.`,
          gentleTone,
          suggestedAction,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        this.saveAdaptationSuggestions([newSuggestion, ...existingSuggestions]);
      }
    }
  }

  // --- Goals (Metas Originais) ---
  static getGoals(): SpiritualGoal[] {
    return safeGet<SpiritualGoal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  }

  static saveGoals(goals: SpiritualGoal[]): void {
    safeSet(STORAGE_KEYS.GOALS, goals);
  }

  static addGoal(goal: Omit<SpiritualGoal, 'id'>): SpiritualGoal {
    const goals = this.getGoals();
    const newGoal: SpiritualGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    };
    this.saveGoals([newGoal, ...goals]);
    return newGoal;
  }

  // --- Daily Tasks (Princípio: PLANEJAR -> EXECUTAR -> MONITORAR) ---
  static getDailyTasks(): DailyTask[] {
    const raw = safeGet<DailyTask[]>(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
    // Garantir retrocompatibilidade e integridade de status
    return raw.map(task => {
      let status: ActivityStatus = task.status;
      if (!status) {
        status = task.completed ? 'concluida' : 'planejada';
      } else if (task.completed && status !== 'concluida') {
        status = 'concluida';
      }
      return {
        ...task,
        status,
        priority: task.priority || 'media'
      };
    });
  }

  static saveDailyTasks(tasks: DailyTask[]): void {
    safeSet(STORAGE_KEYS.TASKS, tasks);
  }

  static toggleTask(id: string): DailyTask[] {
    const tasks = this.getDailyTasks();
    const updated = tasks.map(task => {
      if (task.id === id) {
        const isNowCompleted = !task.completed;
        return {
          ...task,
          completed: isNowCompleted,
          status: (isNowCompleted ? 'concluida' : 'planejada') as ActivityStatus,
          completedAt: isNowCompleted ? new Date().toISOString() : undefined
        };
      }
      return task;
    });
    this.saveDailyTasks(updated);
    this.syncDailyProgress(updated);
    return updated;
  }

  static startTask(id: string): DailyTask[] {
    const tasks = this.getDailyTasks();
    const updated = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: 'em_andamento' as ActivityStatus,
          startedAt: new Date().toISOString()
        };
      }
      return task;
    });
    this.saveDailyTasks(updated);
    return updated;
  }

  static completeTask(id: string, notes?: string): { tasks: DailyTask[]; completedTask: DailyTask | null } {
    const tasks = this.getDailyTasks();
    let completedTask: DailyTask | null = null;
    const updated = tasks.map(task => {
      if (task.id === id) {
        completedTask = {
          ...task,
          completed: true,
          status: 'concluida' as ActivityStatus,
          completedAt: new Date().toISOString(),
          notes: notes !== undefined ? notes : task.notes
        };
        return completedTask;
      }
      return task;
    });
    this.saveDailyTasks(updated);
    this.syncDailyProgress(updated);
    return { tasks: updated, completedTask };
  }

  static setTaskStatus(id: string, status: ActivityStatus, notes?: string): DailyTask[] {
    const tasks = this.getDailyTasks();
    const updated = tasks.map(task => {
      if (task.id === id) {
        const isCompleted = status === 'concluida';
        return {
          ...task,
          status,
          completed: isCompleted,
          completedAt: isCompleted ? (task.completedAt || new Date().toISOString()) : undefined,
          notes: notes !== undefined ? notes : task.notes
        };
      }
      return task;
    });
    this.saveDailyTasks(updated);
    this.syncDailyProgress(updated);
    return updated;
  }

  static ignoreTask(id: string, reason?: string): DailyTask[] {
    return this.setTaskStatus(id, 'ignorada', reason);
  }

  static cancelTask(id: string, reason?: string): DailyTask[] {
    return this.setTaskStatus(id, 'cancelada', reason);
  }

  static addTask(task: Omit<DailyTask, 'id' | 'order' | 'completed'> & { status?: ActivityStatus; priority?: any }): DailyTask {
    const tasks = this.getDailyTasks();
    const newTask: DailyTask = {
      ...task,
      id: `task-${Date.now()}`,
      order: tasks.length + 1,
      completed: task.status === 'concluida',
      status: task.status || 'planejada',
      priority: task.priority || 'media'
    };
    const updated = [...tasks, newTask];
    this.saveDailyTasks(updated);
    return newTask;
  }

  static updateTask(id: string, updates: Partial<DailyTask>): DailyTask[] {
    const tasks = this.getDailyTasks();
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    this.saveDailyTasks(updated);
    return updated;
  }

  static deleteTask(id: string): DailyTask[] {
    const tasks = this.getDailyTasks();
    const updated = tasks.filter(t => t.id !== id);
    this.saveDailyTasks(updated);
    return updated;
  }

  // --- Reading Plans ---
  static getReadingPlans(): ReadingPlan[] {
    const rawPlans = safeGet<ReadingPlan[]>(STORAGE_KEYS.PLANS, INITIAL_READING_PLANS);
    // Garante que cada plano possua status e campos atualizados
    return rawPlans.map(plan => {
      const ensured: ReadingPlan = {
        ...plan,
        status: plan.status || (plan.isActive ? 'active' : 'active')
      };
      return refreshPlanDaysStatus(ensured);
    });
  }

  static saveReadingPlans(plans: ReadingPlan[]): void {
    safeSet(STORAGE_KEYS.PLANS, plans);
  }

  static addReadingPlan(newPlan: ReadingPlan): ReadingPlan[] {
    const plans = this.getReadingPlans();
    // Se for o primeiro ou for marcado ativo, desativa os outros
    const updated = newPlan.isActive
      ? plans.map(p => ({ ...p, isActive: false }))
      : [...plans];
    const finalPlans = [newPlan, ...updated];
    this.saveReadingPlans(finalPlans);
    return finalPlans;
  }

  static updateReadingPlan(planId: string, updates: Partial<ReadingPlan>): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(plan => {
      if (plan.id === planId) {
        const merged: ReadingPlan = {
          ...plan,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return refreshPlanDaysStatus(merged);
      }
      return plan;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static deleteReadingPlan(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const target = plans.find(p => p.id === planId);
    // NUNCA APAGAR HISTÓRICO: Arquiva o plano para manter rastreabilidade histórica de sessões de leitura
    if (target) {
      const archived = safeGet<ReadingPlan[]>('faithion_archived_plans_v1', []);
      safeSet('faithion_archived_plans_v1', [target, ...archived.filter(p => p.id !== planId)]);
    }
    const remaining = plans.filter(p => p.id !== planId);
    // Se o plano deletado era ativo, ativa o primeiro disponível se houver
    if (plans.find(p => p.id === planId)?.isActive && remaining.length > 0) {
      remaining[0].isActive = true;
    }
    this.saveReadingPlans(remaining);
    return remaining;
  }

  static duplicateReadingPlan(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const target = plans.find(p => p.id === planId);
    if (!target) return plans;

    const todayStr = getTodayDateString();
    const duplicatedId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const duplicated: ReadingPlan = {
      ...target,
      id: duplicatedId,
      title: `${target.title} (Cópia)`,
      isActive: false,
      status: 'active',
      startedAt: todayStr,
      startDate: todayStr,
      currentDay: 1,
      completedAt: undefined,
      pausedAt: undefined,
      days: target.days.map((d, index) => ({
        ...d,
        completed: false,
        completedAt: undefined,
        status: index === 0 ? 'em_andamento' : 'pendente'
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [duplicated, ...plans];
    this.saveReadingPlans(updated);
    return updated;
  }

  static pauseReadingPlan(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          status: 'paused' as PlanStatus,
          pausedAt: new Date().toISOString(),
          isActive: false
        };
      }
      return p;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static resumeReadingPlan(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(p => {
      if (p.id === planId) {
        const resumed: ReadingPlan = {
          ...p,
          status: 'active' as PlanStatus,
          pausedAt: undefined,
          isActive: true
        };
        // Reorganiza dias não concluídos a partir de hoje
        return continueFromWhereYouLeftOff(resumed);
      }
      // Se este passou a ser o ativo principal, desmarca os outros
      return { ...p, isActive: false };
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static archiveReadingPlan(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          status: 'archived' as PlanStatus,
          isActive: false
        };
      }
      return p;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static unarchiveReadingPlan(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          status: 'active' as PlanStatus
        };
      }
      return p;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static addDayToPlan(planId: string, newDayData: Omit<PlanDay, 'dayNumber'>): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(plan => {
      if (plan.id === planId) {
        const nextDayNum = plan.days.length + 1;
        const newDay: PlanDay = {
          ...newDayData,
          dayNumber: nextDayNum,
          completed: false,
          status: 'pendente'
        };
        const newDays = [...plan.days, newDay];
        return {
          ...plan,
          days: newDays,
          durationDays: newDays.length,
          updatedAt: new Date().toISOString()
        };
      }
      return plan;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static removeDayFromPlan(planId: string, dayNumber: number): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(plan => {
      if (plan.id === planId) {
        const filtered = plan.days.filter(d => d.dayNumber !== dayNumber);
        // Re-indexa os números dos dias
        const reindexed = filtered.map((d, idx) => ({
          ...d,
          dayNumber: idx + 1
        }));
        return {
          ...plan,
          days: reindexed,
          durationDays: reindexed.length,
          updatedAt: new Date().toISOString()
        };
      }
      return plan;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static reorderPlanDays(planId: string, reorderedDays: PlanDay[]): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(plan => {
      if (plan.id === planId) {
        const reindexed = reorderedDays.map((d, idx) => ({
          ...d,
          dayNumber: idx + 1
        }));
        return {
          ...plan,
          days: reindexed,
          durationDays: reindexed.length,
          updatedAt: new Date().toISOString()
        };
      }
      return plan;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static continuePlanFromWhereLeftOff(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(p => {
      if (p.id === planId) {
        return continueFromWhereYouLeftOff(p);
      }
      return p;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static reorganizePlanSchedule(
    planId: string, 
    newStartDate?: string, 
    freq?: PlanFrequency, 
    daysOfWeek?: number[]
  ): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(p => {
      if (p.id === planId) {
        return reorganizeRemainingPlan(p, newStartDate, freq, daysOfWeek);
      }
      return p;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static togglePlanDay(planId: string, dayNumber: number): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const todayStr = getTodayDateString();
    const updated = plans.map(plan => {
      if (plan.id === planId) {
        const updatedDays = plan.days.map(day => {
          if (day.dayNumber === dayNumber) {
            const nextCompleted = !day.completed;
            const completedAt = nextCompleted ? new Date().toISOString() : undefined;
            return {
              ...day,
              completed: nextCompleted,
              completedAt,
              status: evaluateDayStatus({ ...day, completed: nextCompleted }, todayStr)
            };
          }
          return day;
        });

        const completedCount = updatedDays.filter(d => d.completed).length;
        const nextCurrentDay = Math.min(completedCount + 1, plan.durationDays);

        return {
          ...plan,
          days: updatedDays,
          currentDay: nextCurrentDay,
          completedAt: completedCount === plan.durationDays ? new Date().toISOString() : undefined
        };
      }
      return plan;
    });
    this.saveReadingPlans(updated);
    return updated;
  }

  static setActivePlan(planId: string): ReadingPlan[] {
    const plans = this.getReadingPlans();
    const updated = plans.map(p => ({
      ...p,
      isActive: p.id === planId,
      status: p.id === planId && p.status === 'paused' ? 'active' : p.status
    }));
    this.saveReadingPlans(updated);
    return updated;
  }

  // --- Prayer Requests & Intercession ---
  static getPrayerRequests(): PrayerRequest[] {
    const raw = safeGet<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, INITIAL_PRAYER_REQUESTS);
    // Normalização defensiva para assegurar todos os novos campos requeridos
    return raw.map(p => {
      let derivedStatus: PrayerStatus = p.status;
      if (!derivedStatus) {
        derivedStatus = p.answered ? 'respondido' : 'ativo';
      }
      const derivedDate = p.date || (p.createdAt ? p.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
      return {
        ...p,
        status: derivedStatus,
        priority: p.priority || 'media',
        person: p.person || '',
        date: derivedDate,
        answer: p.answer || p.answeredTestimony || '',
        notes: p.notes || '',
        answered: derivedStatus === 'respondido' || derivedStatus === 'agradecimento' || !!p.answered
      };
    });
  }

  static savePrayerRequests(requests: PrayerRequest[]): void {
    safeSet(STORAGE_KEYS.PRAYERS, requests);
  }

  static addPrayerRequest(request: Omit<PrayerRequest, 'id' | 'createdAt' | 'answered' | 'timesPrayed'> & { answered?: boolean }): PrayerRequest {
    const requests = this.getPrayerRequests();
    const isAnswered = request.status === 'respondido' || request.status === 'agradecimento';
    const newRequest: PrayerRequest = {
      ...request,
      id: `prayer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      date: request.date || new Date().toISOString().split('T')[0],
      priority: request.priority || 'media',
      status: request.status || 'ativo',
      person: request.person?.trim() || undefined,
      answer: request.answer?.trim() || undefined,
      notes: request.notes?.trim() || undefined,
      answered: isAnswered,
      timesPrayed: (request as any).timesPrayed || 1,
      lastPrayedAt: new Date().toISOString()
    };
    this.savePrayerRequests([newRequest, ...requests]);
    return newRequest;
  }

  static updatePrayerRequest(id: string, updates: Partial<PrayerRequest>): PrayerRequest[] {
    const requests = this.getPrayerRequests();
    const updated = requests.map(p => {
      if (p.id === id) {
        const nextStatus = updates.status || p.status;
        const isAnswered = nextStatus === 'respondido' || nextStatus === 'agradecimento';
        return {
          ...p,
          ...updates,
          status: nextStatus,
          answered: isAnswered,
          answeredAt: isAnswered ? (p.answeredAt || new Date().toISOString()) : undefined,
          answer: updates.answer !== undefined ? updates.answer : p.answer
        };
      }
      return p;
    });
    this.savePrayerRequests(updated);
    return updated;
  }

  static deletePrayerRequest(id: string): PrayerRequest[] {
    const requests = this.getPrayerRequests();
    const updated = requests.filter(p => p.id !== id);
    this.savePrayerRequests(updated);
    return updated;
  }

  static togglePrayerAnswered(id: string, testimony?: string): PrayerRequest[] {
    const requests = this.getPrayerRequests();
    const updated = requests.map(p => {
      if (p.id === id) {
        const isCurrentlyAnswered = p.status === 'respondido' || p.status === 'agradecimento' || p.answered;
        const nextStatus: PrayerStatus = isCurrentlyAnswered ? 'ativo' : 'respondido';
        return {
          ...p,
          status: nextStatus,
          answered: !isCurrentlyAnswered,
          answeredAt: !isCurrentlyAnswered ? new Date().toISOString() : undefined,
          answeredTestimony: testimony || p.answeredTestimony,
          answer: testimony || p.answer || p.answeredTestimony
        };
      }
      return p;
    });
    this.savePrayerRequests(updated);
    return updated;
  }

  static setPrayerStatus(id: string, status: PrayerStatus, answer?: string, notes?: string): PrayerRequest[] {
    const requests = this.getPrayerRequests();
    const updated = requests.map(p => {
      if (p.id === id) {
        const isAnswered = status === 'respondido' || status === 'agradecimento';
        return {
          ...p,
          status,
          answered: isAnswered,
          answeredAt: isAnswered ? (p.answeredAt || new Date().toISOString()) : p.answeredAt,
          answer: answer !== undefined ? answer : p.answer,
          notes: notes !== undefined ? notes : p.notes
        };
      }
      return p;
    });
    this.savePrayerRequests(updated);
    return updated;
  }

  static logPrayerSession(prayerIds: string[], minutesSpent: number): void {
    const requests = this.getPrayerRequests();
    const now = new Date().toISOString();
    const updated = requests.map(p => {
      if (prayerIds.includes(p.id)) {
        return {
          ...p,
          timesPrayed: p.timesPrayed + 1,
          lastPrayedAt: now
        };
      }
      return p;
    });
    this.savePrayerRequests(updated);

    // Atualiza progresso do dia com minutos de oração
    const history = this.getConsistencyHistory();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = history.find(h => h.date === todayStr);
    if (todayRecord) {
      todayRecord.prayerMinutes += minutesSpent;
      this.saveConsistencyHistory([...history]);
    }
  }

  // --- Prayer Plans (Planos de Oração) ---
  static getPrayerPlans(): PrayerPlan[] {
    return safeGet<PrayerPlan[]>(STORAGE_KEYS.PRAYER_PLANS, INITIAL_PRAYER_PLANS);
  }

  static savePrayerPlans(plans: PrayerPlan[]): void {
    safeSet(STORAGE_KEYS.PRAYER_PLANS, plans);
  }

  static addPrayerPlan(plan: Omit<PrayerPlan, 'id' | 'createdAt'>): PrayerPlan {
    const plans = this.getPrayerPlans();
    const newPlan: PrayerPlan = {
      ...plan,
      id: `plan-prayer-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.savePrayerPlans([newPlan, ...plans]);
    return newPlan;
  }

  static updatePrayerPlan(id: string, updates: Partial<PrayerPlan>): PrayerPlan[] {
    const plans = this.getPrayerPlans();
    const updated = plans.map(p => p.id === id ? { ...p, ...updates } : p);
    this.savePrayerPlans(updated);
    return updated;
  }

  static deletePrayerPlan(id: string): PrayerPlan[] {
    const plans = this.getPrayerPlans();
    const updated = plans.filter(p => p.id !== id);
    this.savePrayerPlans(updated);
    return updated;
  }

  // --- Fasting Records & Management ---
  static getFastingRecords(): FastingPlan[] {
    const records = safeGet<FastingPlan[]>(STORAGE_KEYS.FASTING_RECORDS, INITIAL_FASTING_RECORDS);
    return records.map(f => {
      let derivedStatus: FastingStatus = f.status;
      if (!derivedStatus) {
        if (f.active) derivedStatus = 'em_andamento';
        else if (f.completed) derivedStatus = 'concluido';
        else derivedStatus = 'planejado';
      }
      return {
        ...f,
        status: derivedStatus,
        date: f.date || (f.startTime ? f.startTime.split('T')[0] : new Date().toISOString().split('T')[0]),
        startTime: f.startTime || '06:00',
        endTime: f.endTime || '18:00',
        active: derivedStatus === 'em_andamento',
        completed: derivedStatus === 'concluido'
      };
    });
  }

  static saveFastingRecords(records: FastingPlan[]): void {
    safeSet(STORAGE_KEYS.FASTING_RECORDS, records);
    // Também sincroniza com FASTING key do registro ativo
    const active = records.find(r => r.status === 'em_andamento') || records[0];
    if (active) {
      this.saveFastingPlan(active);
    }
  }

  static getFastingPlan(): FastingPlan {
    const records = this.getFastingRecords();
    const active = records.find(r => r.status === 'em_andamento');
    if (active) return active;
    const fallback = safeGet<FastingPlan>(STORAGE_KEYS.FASTING, INITIAL_FASTING_PLAN);
    return fallback;
  }

  static saveFastingPlan(plan: FastingPlan): void {
    safeSet(STORAGE_KEYS.FASTING, plan);
  }

  static createFastingRecord(data: {
    type: FastingPlan['type'];
    date: string;
    startTime: string;
    endTime: string;
    targetHours?: number;
    purpose: string;
    relatedPrayerId?: string;
    relatedPrayerTitle?: string;
    relatedPassage?: string;
    notes?: string;
    startNow?: boolean;
  }): FastingPlan {
    const records = this.getFastingRecords();
    const nowIso = new Date().toISOString();
    const startNow = !!data.startNow;
    const computedHours = data.targetHours && data.targetHours > 0 ? data.targetHours : 12;

    const newRecord: FastingPlan = {
      id: `fast-${Date.now()}`,
      title: data.purpose.length > 30 ? `${data.purpose.slice(0, 30)}...` : data.purpose,
      type: data.type,
      date: data.date,
      startTime: startNow ? nowIso : (data.startTime.includes('T') ? data.startTime : `${data.date}T${data.startTime}:00`),
      endTime: data.endTime.includes('T') ? data.endTime : `${data.date}T${data.endTime}:00`,
      targetHours: computedHours,
      purpose: data.purpose,
      relatedPrayerId: data.relatedPrayerId,
      relatedPrayerTitle: data.relatedPrayerTitle,
      relatedPassage: data.relatedPassage,
      notes: data.notes,
      status: startNow ? 'em_andamento' : 'planejado',
      active: startNow,
      completed: false,
      scriptureVerse: data.relatedPassage || 'Mateus 6:17-18',
      createdAt: nowIso
    };

    // Se estiver iniciando agora, desativa qualquer outro que estava em andamento
    const updatedRecords = startNow 
      ? records.map(r => r.status === 'em_andamento' ? { ...r, status: 'interrompido' as FastingStatus, active: false } : r)
      : records;

    const finalRecords = [newRecord, ...updatedRecords];
    this.saveFastingRecords(finalRecords);
    return newRecord;
  }

  static addFastingRecord(data: any): FastingPlan {
    return this.createFastingRecord(data);
  }

  static startFasting(purpose: string, targetHours: number, type: FastingPlan['type']): FastingPlan {
    const today = new Date().toISOString().split('T')[0];
    return this.createFastingRecord({
      type,
      date: today,
      startTime: '06:00',
      endTime: '18:00',
      targetHours,
      purpose,
      startNow: true
    });
  }

  static startFastingRecord(id: string): FastingPlan {
    const records = this.getFastingRecords();
    const nowIso = new Date().toISOString();
    let startedRecord: FastingPlan | null = null;

    const updated = records.map(r => {
      if (r.id === id) {
        startedRecord = {
          ...r,
          status: 'em_andamento' as FastingStatus,
          startTime: nowIso,
          active: true,
          completed: false
        };
        return startedRecord;
      }
      // Se havia outro em andamento, interrompe para dar lugar ao novo
      if (r.status === 'em_andamento') {
        return { ...r, status: 'interrompido' as FastingStatus, active: false };
      }
      return r;
    });

    this.saveFastingRecords(updated);
    return startedRecord || this.getFastingPlan();
  }

  static completeFastingRecord(id: string, reflections?: string): FastingPlan {
    const records = this.getFastingRecords();
    const nowIso = new Date().toISOString();
    let completedItem: FastingPlan | null = null;

    const updated = records.map(r => {
      if (r.id === id) {
        completedItem = {
          ...r,
          status: 'concluido' as FastingStatus,
          active: false,
          completed: true,
          completedAt: nowIso,
          reflectionsDuringFast: reflections || r.reflectionsDuringFast
        };
        return completedItem;
      }
      return r;
    });

    this.saveFastingRecords(updated);

    // Marca no histórico diário que houve jejum concluído
    const history = this.getConsistencyHistory();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = history.find(h => h.date === todayStr);
    if (todayRecord) {
      todayRecord.fastingLogged = true;
      this.saveConsistencyHistory([...history]);
    }

    return completedItem || this.getFastingPlan();
  }

  static interruptFastingRecord(id: string, reason?: string): FastingPlan {
    const records = this.getFastingRecords();
    const nowIso = new Date().toISOString();
    let interruptedItem: FastingPlan | null = null;

    const updated = records.map(r => {
      if (r.id === id) {
        interruptedItem = {
          ...r,
          status: 'interrompido' as FastingStatus,
          active: false,
          completed: false,
          interruptedAt: nowIso,
          interruptionReason: reason || 'Interrompido pelo usuário'
        };
        return interruptedItem;
      }
      return r;
    });

    this.saveFastingRecords(updated);
    return interruptedItem || this.getFastingPlan();
  }

  static cancelFastingRecord(id: string, reason?: string): FastingPlan {
    const records = this.getFastingRecords();
    let canceledItem: FastingPlan | null = null;

    const updated = records.map(r => {
      if (r.id === id) {
        canceledItem = {
          ...r,
          status: 'cancelado' as FastingStatus,
          active: false,
          completed: false,
          cancellationReason: reason || 'Cancelado antes de iniciar'
        };
        return canceledItem;
      }
      return r;
    });

    this.saveFastingRecords(updated);
    return canceledItem || this.getFastingPlan();
  }

  static deleteFastingRecord(id: string): FastingPlan[] {
    const records = this.getFastingRecords();
    const updated = records.filter(r => r.id !== id);
    this.saveFastingRecords(updated);
    return updated;
  }

  static stopFasting(reflections?: string): FastingPlan {
    const current = this.getFastingPlan();
    return this.completeFastingRecord(current.id, reflections);
  }

  // --- Reflections & Spiritual Journal ---
  static getReflections(): Reflection[] {
    return safeGet<Reflection[]>(STORAGE_KEYS.REFLECTIONS, INITIAL_REFLECTIONS);
  }

  static saveReflections(reflections: Reflection[]): void {
    safeSet(STORAGE_KEYS.REFLECTIONS, reflections);
  }

  static addReflection(refl: Omit<Reflection, 'id' | 'createdAt'>): Reflection {
    const reflections = this.getReflections();
    const newRefl: Reflection = {
      ...refl,
      id: `refl-${Date.now()}`,
      date: refl.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      whatLearned: refl.whatLearned?.trim() || undefined,
      whatCaughtAttention: refl.whatCaughtAttention?.trim() || undefined,
      howToApply: refl.howToApply?.trim() || undefined,
      personalPrayer: refl.personalPrayer?.trim() || undefined,
      notes: refl.notes?.trim() || undefined,
      // Retrocompatibilidade se foram preenchidos
      whatGodSpoke: refl.whatGodSpoke || refl.whatLearned || refl.notes || '',
      practicalApplication: refl.practicalApplication || refl.howToApply || '',
      gratitudeNotes: refl.gratitudeNotes || []
    };
    this.saveReflections([newRefl, ...reflections]);
    return newRefl;
  }

  static deleteReflection(id: string): Reflection[] {
    const reflections = this.getReflections();
    const updated = reflections.filter(r => r.id !== id);
    this.saveReflections(updated);
    return updated;
  }

  static updateReflection(id: string, updates: Partial<Reflection>): Reflection[] {
    const reflections = this.getReflections();
    const updated = reflections.map(r => r.id === id ? { ...r, ...updates } : r);
    this.saveReflections(updated);
    return updated;
  }

  // --- Práticas & Cultos/Eventos Personalizados ---
  static getPracticeRecords(): PracticeRecord[] {
    return safeGet<PracticeRecord[]>(STORAGE_KEYS.PRACTICE_RECORDS, INITIAL_PRACTICE_RECORDS);
  }

  static savePracticeRecords(records: PracticeRecord[]): void {
    safeSet(STORAGE_KEYS.PRACTICE_RECORDS, records);
  }

  static addPracticeRecord(data: Omit<PracticeRecord, 'id' | 'createdAt'>): PracticeRecord {
    const records = this.getPracticeRecords();
    const newRecord: PracticeRecord = {
      ...data,
      id: `prac-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    records.unshift(newRecord);
    this.savePracticeRecords(records);
    return newRecord;
  }

  static deletePracticeRecord(id: string): PracticeRecord[] {
    const records = this.getPracticeRecords();
    const filtered = records.filter(r => r.id !== id);
    this.savePracticeRecords(filtered);
    return filtered;
  }

  // --- INTEGRAÇÃO: Linha do Tempo Unificada da Jornada Espiritual ---
  // Estrutura expressa da Timeline: Data → atividade → passagem → oração → reflexão → resultado
  static getUnifiedJourneyHistory(): JourneyEntry[] {
    const entries: JourneyEntry[] = [];

    // 1. Leituras Bíblicas
    const readingSessions = this.getBibleReadingHistory();
    readingSessions.forEach(session => {
      entries.push({
        id: `journey-read-${session.id}`,
        date: session.date,
        timestamp: session.completedAt || session.startTime || `${session.date}T12:00:00Z`,
        type: 'bible',
        title: `Leitura Bíblica: ${session.passageRef}`,
        subtitle: `Versão ${session.versionAbbr} • ${session.durationMinutes} min de meditação`,
        content: session.relatedPlanTitle ? `Plano: ${session.relatedPlanTitle} (Dia ${session.relatedPlanDayNumber || 1})` : undefined,
        passageRef: session.passageRef,
        durationMinutes: session.durationMinutes,
        chaptersCount: 1,
        status: 'concluido',
        statusBadge: {
          label: 'Leitura Concluída',
          variant: 'emerald'
        },
        timelineData: {
          activity: `Leitura Bíblica (${session.versionAbbr || 'NVI'})`,
          passage: session.passageRef,
          prayer: session.relatedPlanTitle ? `Consagração do plano ${session.relatedPlanTitle}` : undefined,
          reflection: session.notes,
          result: `Concluída (${session.durationMinutes} min dedicados)`
        },
        details: [
          { label: 'Passagem', value: session.passageRef },
          { label: 'Duração', value: `${session.durationMinutes} min` }
        ]
      });
    });

    // 2. Orações (Pedidos, Respostas e Agradecimentos)
    const prayers = this.getPrayerRequests();
    prayers.forEach(prayer => {
      const isAnswered = prayer.status === 'respondido' || prayer.status === 'agradecimento';
      let badgeLabel = 'Oração Ativa';
      let badgeVariant: 'neutral' | 'emerald' | 'amber' | 'sky' | 'rose' | 'purple' = 'sky';
      if (prayer.status === 'em_oracao') {
        badgeLabel = 'Em Clamor';
        badgeVariant = 'amber';
      } else if (prayer.status === 'agradecimento') {
        badgeLabel = 'Agradecimento';
        badgeVariant = 'emerald';
      } else if (prayer.status === 'respondido') {
        badgeLabel = 'Respondida!';
        badgeVariant = 'emerald';
      } else if (prayer.status === 'arquivado') {
        badgeLabel = 'Arquivado';
        badgeVariant = 'neutral';
      }

      entries.push({
        id: `journey-prayer-${prayer.id}`,
        date: prayer.date || prayer.createdAt.split('T')[0],
        timestamp: prayer.createdAt,
        type: 'prayer',
        title: prayer.title,
        subtitle: prayer.person ? `Intercessão por: ${prayer.person}` : `Categoria: ${prayer.category}`,
        content: isAnswered && prayer.answer ? `Testemunho: "${prayer.answer}"` : prayer.description,
        prayerText: prayer.title + (prayer.description ? ` — ${prayer.description}` : ''),
        passageRef: prayer.scriptureReferences?.[0],
        status: isAnswered ? 'concluido' : 'planejado',
        statusBadge: {
          label: badgeLabel,
          variant: badgeVariant
        },
        timelineData: {
          activity: 'Oração & Intercessão',
          passage: prayer.scriptureReferences?.[0],
          prayer: prayer.title + (prayer.description ? ` — ${prayer.description}` : ''),
          reflection: prayer.notes,
          result: isAnswered && prayer.answer ? `Respondida: "${prayer.answer}"` : `Em clamor (${prayer.timesPrayed}x apresentada)`
        },
        details: [
          { label: 'Status', value: badgeLabel },
          { label: 'Apresentada', value: `${prayer.timesPrayed}x` }
        ]
      });
    });

    // 3. Jejuns (Planejados, Em andamento, Concluídos, Interrompidos)
    const fasts = this.getFastingRecords();
    fasts.forEach(fast => {
      let badgeLabel = 'Jejum Planejado';
      let badgeVariant: 'neutral' | 'emerald' | 'amber' | 'sky' | 'rose' | 'purple' = 'neutral';
      let fastStatus: 'concluido' | 'parcial' | 'ignorado' | 'atrasado' | 'planejado' = 'planejado';

      if (fast.status === 'em_andamento') {
        badgeLabel = 'Em Andamento';
        badgeVariant = 'amber';
        fastStatus = 'planejado';
      } else if (fast.status === 'concluido') {
        badgeLabel = 'Concluído com Vitória';
        badgeVariant = 'emerald';
        fastStatus = 'concluido';
      } else if (fast.status === 'interrompido') {
        badgeLabel = 'Interrompido';
        badgeVariant = 'rose';
        fastStatus = 'parcial';
      } else if (fast.status === 'cancelado') {
        badgeLabel = 'Cancelado';
        badgeVariant = 'neutral';
        fastStatus = 'ignorado';
      }

      entries.push({
        id: `journey-fast-${fast.id}`,
        date: fast.date || fast.startTime.split('T')[0],
        timestamp: fast.createdAt || fast.startTime,
        type: 'fasting',
        title: `Jejum: ${fast.purpose}`,
        subtitle: `Duração prevista: ${fast.targetHours}h • Tipo: ${fast.type}`,
        content: fast.reflectionsDuringFast ? `Reflexão do Jejum: "${fast.reflectionsDuringFast}"` : fast.notes,
        passageRef: fast.relatedPassage,
        prayerText: fast.relatedPrayerTitle,
        reflectionText: fast.reflectionsDuringFast || fast.notes,
        status: fastStatus,
        statusBadge: {
          label: badgeLabel,
          variant: badgeVariant
        },
        timelineData: {
          activity: `Jejum Espiritual (${fast.type})`,
          passage: fast.relatedPassage,
          prayer: fast.relatedPrayerTitle || `Propósito: ${fast.purpose}`,
          reflection: fast.reflectionsDuringFast || fast.notes,
          result: `Alvo: ${fast.targetHours}h • Status: ${badgeLabel}`
        },
        details: [
          { label: 'Horário', value: `${fast.startTime.slice(11, 16) || '06:00'} às ${fast.endTime.slice(11, 16) || '18:00'}` },
          { label: 'Propósito', value: fast.purpose }
        ]
      });
    });

    // 4. Reflexões Espirituais
    const reflections = this.getReflections();
    reflections.forEach(refl => {
      const summaryParts = [
        refl.whatLearned ? `Aprendizado: ${refl.whatLearned}` : null,
        refl.whatCaughtAttention ? `Atenção: ${refl.whatCaughtAttention}` : null,
        refl.howToApply ? `Aplicação: ${refl.howToApply}` : null,
        refl.personalPrayer ? `Oração: ${refl.personalPrayer}` : null,
        refl.notes ? `Notas: ${refl.notes}` : null
      ].filter(Boolean);

      entries.push({
        id: `journey-refl-${refl.id}`,
        date: refl.date,
        timestamp: refl.createdAt,
        type: 'reflection',
        title: refl.scriptureRef ? `Reflexão em ${refl.scriptureRef}` : (refl.relatedTitle || 'Diário Espiritual & Reflexão'),
        subtitle: refl.scriptureRef ? `Passagem bíblica: ${refl.scriptureRef}` : 'Meditação e Comunhão',
        content: summaryParts.length > 0 ? summaryParts.join(' • ') : (refl.whatGodSpoke || 'Reflexão registrada.'),
        passageRef: refl.scriptureRef,
        scriptureRef: refl.scriptureRef,
        prayerText: refl.personalPrayer,
        reflectionText: refl.whatLearned || refl.whatGodSpoke || refl.whatCaughtAttention,
        resultNotes: refl.howToApply,
        status: 'concluido',
        description: refl.notes || refl.whatGodSpoke,
        relatedTitle: refl.relatedTitle,
        reflection: refl,
        statusBadge: {
          label: 'Reflexão Registrada',
          variant: 'amber'
        },
        timelineData: {
          activity: 'Reflexão & Diário Devocional',
          passage: refl.scriptureRef,
          prayer: refl.personalPrayer,
          reflection: refl.whatLearned || refl.whatGodSpoke || refl.whatCaughtAttention,
          result: refl.howToApply ? `Aplicação Prática: ${refl.howToApply}` : 'Reflexão guardada no coração'
        },
        details: [
          { label: 'Data', value: refl.date },
          { label: 'Registros', value: `${summaryParts.length} tópicos` }
        ]
      });
    });

    // 5. Planos de Leitura (Dias Concluídos dos Planos Ativos e Passados)
    const plans = this.getReadingPlans();
    plans.forEach(plan => {
      plan.days.forEach(day => {
        if (day.completed) {
          const completedDate = day.completedAt ? day.completedAt.split('T')[0] : (plan.startedAt || '2026-09-15');
          const completedTimestamp = day.completedAt || `${completedDate}T10:00:00Z`;

          entries.push({
            id: `journey-plan-${plan.id}-day-${day.dayNumber}`,
            date: completedDate,
            timestamp: completedTimestamp,
            type: 'plan',
            title: `Plano: ${plan.title} (Dia ${day.dayNumber})`,
            subtitle: day.title || day.passageRef,
            content: day.devotionalPrompt ? `Estudo: ${day.devotionalPrompt}` : `Leitura: ${day.passageRef}`,
            passageRef: day.passageRef,
            chaptersCount: 1,
            status: 'concluido',
            statusBadge: {
              label: 'Plano em Dia',
              variant: 'purple'
            },
            timelineData: {
              activity: `Plano de Leitura: ${plan.title}`,
              passage: day.passageRef,
              prayer: undefined,
              reflection: day.devotionalPrompt,
              result: `Dia ${day.dayNumber} concluído com fidelidade`
            },
            details: [
              { label: 'Plano', value: plan.title },
              { label: 'Etapa', value: `Dia ${day.dayNumber} de ${plan.durationDays}` }
            ]
          });
        }
      });
    });

    // 6. Atividades de Rotina (Execution Logs)
    const logs = this.getExecutionLogs();
    logs.forEach(log => {
      const isConcluido = log.status === 'concluido';
      const isPulado = log.status === 'pulado';
      entries.push({
        id: `journey-log-${log.id}`,
        date: log.date,
        timestamp: log.loggedAt || `${log.date}T18:00:00Z`,
        type: 'activity',
        title: `Rotina: ${log.activityName}`,
        subtitle: `Bloco: ${log.block === 'morning' ? 'Manhã' : (log.block === 'night' ? 'Noite' : 'Dia')}`,
        content: log.quickReflection || (isPulado ? 'Atividade ignorada/pulada no dia' : 'Prática diária concluída'),
        durationMinutes: log.actualMinutes || log.plannedMinutes,
        status: isConcluido ? 'concluido' : (isPulado ? 'ignorado' : 'parcial'),
        statusBadge: {
          label: isConcluido ? 'Atividade Cumprida' : (isPulado ? 'Ignorada' : 'Parcial'),
          variant: isConcluido ? 'emerald' : (isPulado ? 'neutral' : 'amber')
        },
        timelineData: {
          activity: `Atividade de Rotina: ${log.activityName}`,
          passage: undefined,
          prayer: log.activityName.toLowerCase().includes('oração') ? log.activityName : undefined,
          reflection: log.quickReflection,
          result: `${isConcluido ? 'Concluído' : log.status} (${log.actualMinutes || log.plannedMinutes} min)`
        },
        details: [
          { label: 'Tempo', value: `${log.actualMinutes || log.plannedMinutes} min` },
          { label: 'Status', value: log.status }
        ]
      });
    });

    // 7. Práticas Personalizadas, Cultos/Eventos, Estudos e Memorização
    const practiceRecords = this.getPracticeRecords();
    practiceRecords.forEach(prac => {
      let badgeLabel = 'Prática Concluída';
      let badgeVariant: 'neutral' | 'emerald' | 'amber' | 'sky' | 'rose' | 'purple' = 'emerald';

      if (prac.type === 'event') {
        badgeLabel = 'Culto / Evento';
        badgeVariant = 'purple';
      } else if (prac.type === 'study') {
        badgeLabel = 'Estudo Bíblico';
        badgeVariant = 'sky';
      } else if (prac.type === 'memorization') {
        badgeLabel = 'Memorização';
        badgeVariant = 'emerald';
      } else if (prac.type === 'custom') {
        badgeLabel = 'Prática Pessoal';
        badgeVariant = 'amber';
      }

      if (prac.status === 'ignorado') {
        badgeVariant = 'neutral';
        badgeLabel = 'Ignorado';
      } else if (prac.status === 'atrasado') {
        badgeVariant = 'rose';
        badgeLabel = 'Atrasado';
      }

      entries.push({
        id: `journey-prac-${prac.id}`,
        date: prac.date,
        timestamp: prac.createdAt,
        type: prac.type,
        title: prac.title,
        subtitle: prac.locationOrLeader || (prac.durationMinutes ? `${prac.durationMinutes} minutos dedicados` : undefined),
        content: prac.resultSummary || prac.reflectionNotes || prac.notes,
        passageRef: prac.passageRef,
        prayerText: prac.prayerFocus,
        reflectionText: prac.reflectionNotes,
        resultNotes: prac.resultSummary,
        durationMinutes: prac.durationMinutes,
        chaptersCount: prac.chaptersCount,
        status: prac.status,
        statusBadge: {
          label: badgeLabel,
          variant: badgeVariant
        },
        timelineData: {
          activity: prac.type === 'event' ? `Culto/Evento: ${prac.title}` : (prac.type === 'study' ? `Estudo Bíblico: ${prac.title}` : (prac.type === 'memorization' ? `Memorização: ${prac.title}` : `Prática: ${prac.title}`)),
          passage: prac.passageRef,
          prayer: prac.prayerFocus,
          reflection: prac.reflectionNotes,
          result: prac.resultSummary || (prac.status === 'concluido' ? 'Concluído com êxito' : prac.status)
        },
        details: [
          { label: 'Tipo', value: badgeLabel },
          { label: 'Data', value: prac.date }
        ]
      });
    });

    // Ordena do mais recente ao mais antigo
    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // --- Palavra do Dia Personalizada & Histórico ---
  static getWordOfTheDay(context?: PersonalizationContext): WordOfTheDay {
    return WordOfTheDayService.getWordOfTheDay(context);
  }

  static getWordOfTheDayHistory(): WordOfTheDayHistoryItem[] {
    return WordOfTheDayService.getHistory();
  }

  static toggleWordOfTheDayFavorite(wordId: string): WordOfTheDayHistoryItem[] {
    return WordOfTheDayService.toggleFavorite(wordId);
  }

  static recordWordOfTheDayInteraction(wordId: string, type: 'read' | 'prayed' | 'fasted' | 'shared'): void {
    WordOfTheDayService.recordInteraction(wordId, type);
  }

  static saveWordOfTheDayUserReflection(wordId: string, text: string, reflectionId?: string): void {
    WordOfTheDayService.saveUserReflection(wordId, text, reflectionId);
  }

  static setCustomWordOfTheDay(word: WordOfTheDay): void {
    WordOfTheDayService.setCustomWordOfTheDay(word);
  }

  // --- Consistency & Progress (Princípio: MONITORAR & ADAPTAR) ---
  static getConsistencyHistory(): DailyConsistency[] {
    const stored = safeGet<DailyConsistency[]>(STORAGE_KEYS.CONSISTENCY, INITIAL_CONSISTENCY_HISTORY);
    if (stored && stored.length < 50 && INITIAL_CONSISTENCY_HISTORY.length >= 80) {
      const storedDates = new Set(stored.map(s => s.date));
      const missingFromInitial = INITIAL_CONSISTENCY_HISTORY.filter(i => !storedDates.has(i.date));
      const merged = [...missingFromInitial, ...stored].sort((a, b) => a.date.localeCompare(b.date));
      return merged;
    }
    return stored;
  }

  static saveConsistencyHistory(history: DailyConsistency[]): void {
    safeSet(STORAGE_KEYS.CONSISTENCY, history);
  }

  private static syncDailyProgress(tasks: DailyTask[]): void {
    const history = this.getConsistencyHistory();
    const todayStr = new Date().toISOString().split('T')[0];
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const score = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

    const existingIndex = history.findIndex(h => h.date === todayStr);
    if (existingIndex >= 0) {
      history[existingIndex] = {
        ...history[existingIndex],
        tasksCompleted: completedCount,
        totalTasks: totalCount,
        score
      };
    } else {
      history.push({
        date: todayStr,
        tasksCompleted: completedCount,
        totalTasks: totalCount,
        prayerMinutes: 15,
        bibleRead: tasks.some(t => t.category === 'bible' && t.completed),
        fastingLogged: false,
        score
      });
    }
    this.saveConsistencyHistory(history);
  }

  // --- Bible Highlights, Favorites, Notes & Reading ---
  static getBibleHighlights(): Record<string, boolean> {
    return safeGet<Record<string, boolean>>(STORAGE_KEYS.BIBLE_HIGHLIGHTS, {
      'salmos-23-1': true,
      'filipenses-4-6': true,
      'romanos-8-28': true,
      'romanos-8-38': true,
      'proverbios-3-5': true,
    });
  }

  static toggleHighlight(verseKey: string): boolean {
    const current = this.getBibleHighlights();
    const nextState = !current[verseKey];
    if (nextState) {
      current[verseKey] = true;
    } else {
      delete current[verseKey];
    }
    safeSet(STORAGE_KEYS.BIBLE_HIGHLIGHTS, current);
    return nextState;
  }

  static getBibleHighlightsList(): BibleHighlight[] {
    return safeGet<BibleHighlight[]>('faithion_bible_highlights_list_v1', [
      {
        id: 'hl-1',
        verseKey: 'salmos-23-1',
        bookId: 'salmos',
        chapter: 23,
        verseNumber: 1,
        color: 'gold',
        versionId: 'arc',
        createdAt: new Date().toISOString()
      },
      {
        id: 'hl-2',
        verseKey: 'romanos-8-28',
        bookId: 'romanos',
        chapter: 8,
        verseNumber: 28,
        color: 'emerald',
        versionId: 'arc',
        createdAt: new Date().toISOString()
      },
      {
        id: 'hl-3',
        verseKey: 'filipenses-4-6',
        bookId: 'filipenses',
        chapter: 4,
        verseNumber: 6,
        color: 'azure',
        versionId: 'arc',
        createdAt: new Date().toISOString()
      }
    ]);
  }

  static saveBibleHighlight(hl: Omit<BibleHighlight, 'id' | 'createdAt'>): BibleHighlight {
    const list = this.getBibleHighlightsList();
    const existingIdx = list.findIndex(h => h.verseKey === hl.verseKey);
    const newHighlight: BibleHighlight = {
      ...hl,
      id: `hl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };

    let updated: BibleHighlight[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = newHighlight;
    } else {
      updated = [newHighlight, ...list];
    }
    safeSet('faithion_bible_highlights_list_v1', updated);

    // Keep simple map in sync
    const map = this.getBibleHighlights();
    map[hl.verseKey] = true;
    safeSet(STORAGE_KEYS.BIBLE_HIGHLIGHTS, map);

    return newHighlight;
  }

  static removeBibleHighlight(verseKey: string): void {
    const list = this.getBibleHighlightsList().filter(h => h.verseKey !== verseKey);
    safeSet('faithion_bible_highlights_list_v1', list);

    const map = this.getBibleHighlights();
    delete map[verseKey];
    safeSet(STORAGE_KEYS.BIBLE_HIGHLIGHTS, map);
  }

  // --- Bible Favorites ---
  static getBibleFavorites(): BibleFavorite[] {
    return safeGet<BibleFavorite[]>(STORAGE_KEYS.BIBLE_FAVORITES, [
      {
        id: 'fav-1',
        bookId: 'salmos',
        bookName: 'Salmos',
        chapter: 23,
        verseNumber: 1,
        verseText: 'O Senhor é o meu pastor; nada me faltará.',
        versionId: 'arc',
        createdAt: new Date().toISOString()
      },
      {
        id: 'fav-2',
        bookId: 'romanos',
        bookName: 'Romanos',
        chapter: 8,
        verseNumber: 31,
        verseText: 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?',
        versionId: 'arc',
        createdAt: new Date().toISOString()
      }
    ]);
  }

  static toggleBibleFavorite(favData: Omit<BibleFavorite, 'id' | 'createdAt'>): boolean {
    const favorites = this.getBibleFavorites();
    const index = favorites.findIndex(
      f => f.bookId === favData.bookId && f.chapter === favData.chapter && f.verseNumber === favData.verseNumber
    );

    if (index >= 0) {
      favorites.splice(index, 1);
      safeSet(STORAGE_KEYS.BIBLE_FAVORITES, favorites);
      return false; // Removed
    } else {
      const newFav: BibleFavorite = {
        ...favData,
        id: `fav-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      favorites.unshift(newFav);
      safeSet(STORAGE_KEYS.BIBLE_FAVORITES, favorites);
      return true; // Added
    }
  }

  static isBibleFavorite(bookId: string, chapter: number, verseNumber: number): boolean {
    const favorites = this.getBibleFavorites();
    return favorites.some(f => f.bookId === bookId && f.chapter === chapter && f.verseNumber === verseNumber);
  }

  // --- Bible Notes ---
  static getBibleNotes(): BibleNote[] {
    return safeGet<BibleNote[]>(STORAGE_KEYS.BIBLE_NOTES, [
      {
        id: 'note-1',
        bookId: 'romanos',
        bookName: 'Romanos',
        chapter: 8,
        verseNumber: 28,
        noteText: 'Consolo profundo para os dias de incerteza: Deus orquestra os acontecimentos para o propósito eterno.',
        versionId: 'arc',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }

  static saveBibleNote(data: {
    bookId: string;
    bookName: string;
    chapter: number;
    verseNumber?: number;
    noteText: string;
    versionId: string;
    id?: string;
  }): BibleNote {
    const notes = this.getBibleNotes();
    const now = new Date().toISOString();

    if (data.id) {
      const index = notes.findIndex(n => n.id === data.id);
      if (index >= 0) {
        const updated: BibleNote = {
          ...notes[index],
          noteText: data.noteText,
          updatedAt: now
        };
        notes[index] = updated;
        safeSet(STORAGE_KEYS.BIBLE_NOTES, notes);
        return updated;
      }
    }

    const newNote: BibleNote = {
      id: `note-${Date.now()}`,
      bookId: data.bookId,
      bookName: data.bookName,
      chapter: data.chapter,
      verseNumber: data.verseNumber,
      noteText: data.noteText,
      versionId: data.versionId,
      createdAt: now,
      updatedAt: now
    };
    notes.unshift(newNote);
    safeSet(STORAGE_KEYS.BIBLE_NOTES, notes);
    return newNote;
  }

  static deleteBibleNote(id: string): void {
    const notes = this.getBibleNotes().filter(n => n.id !== id);
    safeSet(STORAGE_KEYS.BIBLE_NOTES, notes);
  }

  static saveBibleNotes(notes: BibleNote[]): void {
    safeSet(STORAGE_KEYS.BIBLE_NOTES, notes);
  }

  static getWordHistory(): WordOfTheDayHistoryItem[] {
    return WordOfTheDayService.getHistory();
  }

  // --- Bible Reading History & Sessions ---
  static getBibleReadingHistory(): BibleReadingSession[] {
    return safeGet<BibleReadingSession[]>(STORAGE_KEYS.BIBLE_HISTORY, [
      {
        id: 'sess-1',
        bookId: 'romanos',
        bookName: 'Romanos',
        chapter: 8,
        versionId: 'arc',
        versionAbbr: 'ARC',
        passageRef: 'Romanos 8',
        date: new Date().toISOString().split('T')[0],
        startTime: new Date(Date.now() - 15 * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        durationMinutes: 12,
        relatedPlanTitle: 'Fundamentos da Graça'
      }
    ]);
  }

  /**
   * Registra a leitura concluída e alimenta:
   * 1. Histórico de leitura
   * 2. Plano de leitura associado (se houver)
   * 3. Consistência diária (bibleRead: true)
   * 4. Tarefas do dia (marca tarefa de Bíblia como concluída)
   */
  static recordBibleReadingSession(
    sessionData: Omit<BibleReadingSession, 'id' | 'completedAt'>
  ): BibleReadingSession {
    const history = this.getBibleReadingHistory();
    const completedAt = new Date().toISOString();
    const newSession: BibleReadingSession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
      completedAt
    };
    history.unshift(newSession);
    safeSet(STORAGE_KEYS.BIBLE_HISTORY, history);

    // Salvar último ponto lido
    this.saveLastRead({
      bookId: sessionData.bookId,
      chapter: sessionData.chapter,
      versionId: sessionData.versionId,
      timestamp: completedAt
    });

    // Atualizar consistência diária
    const consistencyList = this.getConsistencyHistory();
    const todayStr = sessionData.date || new Date().toISOString().split('T')[0];
    const todayRecord = consistencyList.find(c => c.date === todayStr);
    if (todayRecord) {
      todayRecord.bibleRead = true;
      todayRecord.score = Math.min(100, todayRecord.score + 15);
      this.saveConsistencyHistory(consistencyList);
    }

    // Se houver tarefa diária de Bíblia hoje planejada, conclui-la
    const tasks = this.getDailyTasks();
    let tasksModified = false;
    tasks.forEach(task => {
      if (task.category === 'bible' && task.status !== 'concluida') {
        task.completed = true;
        task.status = 'concluida';
        task.completedAt = completedAt;
        task.actualMinutes = sessionData.durationMinutes || task.estimatedMinutes;
        tasksModified = true;
      }
    });
    if (tasksModified) {
      this.saveDailyTasks(tasks);
      this.syncDailyProgress(tasks);
    }

    // Se houver plano de leitura ativo relacionado, marcar o dia
    if (sessionData.relatedPlanId) {
      const plans = this.getReadingPlans();
      const plan = plans.find(p => p.id === sessionData.relatedPlanId);
      if (plan) {
        const day = plan.days.find(d => 
          (sessionData.relatedPlanDayNumber && d.dayNumber === sessionData.relatedPlanDayNumber) ||
          (d.bookId === sessionData.bookId && d.chapter === sessionData.chapter && !d.completed)
        );
        if (day && !day.completed) {
          day.completed = true;
          day.completedAt = completedAt;
          this.saveReadingPlans(plans);
        }
      }
    }

    return newSession;
  }

  // --- Last Read Position ---
  static getLastRead(): BibleLastRead {
    return safeGet<BibleLastRead>(STORAGE_KEYS.BIBLE_LAST_READ, {
      bookId: 'romanos',
      chapter: 8,
      versionId: 'arc',
      timestamp: new Date().toISOString()
    });
  }

  static saveLastRead(lastRead: BibleLastRead): void {
    safeSet(STORAGE_KEYS.BIBLE_LAST_READ, lastRead);
  }

  // --- Bible Display Settings ---
  static getBibleSettings(): {
    fontSize: BibleFontSize;
    fontFamily: BibleFontFamily;
    lineSpacing: 'normal' | 'relaxed';
    focusMode: boolean;
  } {
    return safeGet(STORAGE_KEYS.BIBLE_SETTINGS, {
      fontSize: 'normal',
      fontFamily: 'serif',
      lineSpacing: 'relaxed',
      focusMode: false
    });
  }

  static saveBibleSettings(settings: {
    fontSize: BibleFontSize;
    fontFamily: BibleFontFamily;
    lineSpacing: 'normal' | 'relaxed';
    focusMode: boolean;
  }): void {
    safeSet(STORAGE_KEYS.BIBLE_SETTINGS, settings);
  }

  // --- Backup & Restore ---
  static exportFullBackupJSON(): string {
    const data = {
      version: '1.1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      goals: this.getGoals(),
      objectives: this.getObjectives(),
      routineActivities: this.getRoutineActivities(),
      executionLogs: this.getExecutionLogs(),
      adaptationSuggestions: this.getAdaptationSuggestions(),
      tasks: this.getDailyTasks(),
      plans: this.getReadingPlans(),
      prayers: this.getPrayerRequests(),
      fasting: this.getFastingPlan(),
      reflections: this.getReflections(),
      consistency: this.getConsistencyHistory(),
      highlights: this.getBibleHighlights(),
      favorites: this.getBibleFavorites(),
      notes: this.getBibleNotes(),
      history: this.getBibleReadingHistory(),
      lastRead: this.getLastRead()
    };
    return JSON.stringify(data, null, 2);
  }

  static importFullBackupJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) safeSet(STORAGE_KEYS.PROFILE, data.profile);
      if (data.goals) safeSet(STORAGE_KEYS.GOALS, data.goals);
      if (data.objectives) safeSet(STORAGE_KEYS.OBJECTIVES, data.objectives);
      if (data.routineActivities) safeSet(STORAGE_KEYS.ROUTINE_ACTIVITIES, data.routineActivities);
      if (data.executionLogs) safeSet(STORAGE_KEYS.EXECUTION_LOGS, data.executionLogs);
      if (data.adaptationSuggestions) safeSet(STORAGE_KEYS.ADAPTATION_SUGGESTIONS, data.adaptationSuggestions);
      if (data.tasks) safeSet(STORAGE_KEYS.TASKS, data.tasks);
      if (data.plans) safeSet(STORAGE_KEYS.PLANS, data.plans);
      if (data.prayers) safeSet(STORAGE_KEYS.PRAYERS, data.prayers);
      if (data.fasting) safeSet(STORAGE_KEYS.FASTING, data.fasting);
      if (data.reflections) safeSet(STORAGE_KEYS.REFLECTIONS, data.reflections);
      if (data.consistency) safeSet(STORAGE_KEYS.CONSISTENCY, data.consistency);
      if (data.highlights) safeSet(STORAGE_KEYS.BIBLE_HIGHLIGHTS, data.highlights);
      if (data.favorites) safeSet(STORAGE_KEYS.BIBLE_FAVORITES, data.favorites);
      if (data.notes) safeSet(STORAGE_KEYS.BIBLE_NOTES, data.notes);
      if (data.history) safeSet(STORAGE_KEYS.BIBLE_HISTORY, data.history);
      if (data.lastRead) safeSet(STORAGE_KEYS.BIBLE_LAST_READ, data.lastRead);
      return true;
    } catch (e) {
      console.error('[Faithion Storage] Failed to import backup JSON', e);
      return false;
    }
  }

  static resetToDefaultData(): void {
    safeSet(STORAGE_KEYS.PROFILE, INITIAL_SPIRITUAL_PROFILE);
    safeSet(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
    safeSet(STORAGE_KEYS.PRAYERS, INITIAL_PRAYER_REQUESTS);
    safeSet(STORAGE_KEYS.FASTING, INITIAL_FASTING_PLAN);
    safeSet(STORAGE_KEYS.PLANS, INITIAL_READING_PLANS);
    safeSet(STORAGE_KEYS.REFLECTIONS, INITIAL_REFLECTIONS);
    safeSet(STORAGE_KEYS.CONSISTENCY, INITIAL_CONSISTENCY_HISTORY);
    safeSet(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    safeSet(STORAGE_KEYS.OBJECTIVES, INITIAL_OBJECTIVES);
    safeSet(STORAGE_KEYS.ROUTINE_ACTIVITIES, INITIAL_ROUTINE_ACTIVITIES);
    safeSet(STORAGE_KEYS.EXECUTION_LOGS, INITIAL_EXECUTION_LOGS);
    safeSet(STORAGE_KEYS.ADAPTATION_SUGGESTIONS, INITIAL_ADAPTATION_SUGGESTIONS);
  }

  // --- Supabase Future Sync Adapter Structure ---
  static getSyncMetadata(): SupabaseSyncMetadata {
    return safeGet<SupabaseSyncMetadata>(STORAGE_KEYS.SYNC_METADATA, {
      lastSyncedAt: null,
      syncStatus: 'offline',
      pendingMutationsCount: 0,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : false,
      isSupabaseConfigured: false
    });
  }
}
