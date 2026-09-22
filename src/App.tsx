/**
 * FAITHION — Teu guia pessoal para planejar, executar e acompanhar tua caminhada cristã.
 * Princípio: PLANEJAR → EXECUTAR → MONITORAR → ADAPTAR
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavTabId } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MoreSheet } from './components/layout/MoreSheet';

// Views
import { TodayView } from './views/TodayView';
import { RoutineView } from './views/RoutineView';
import { BibleView } from './views/BibleView';
import { PlansView } from './views/PlansView';
import { PrayerView } from './views/PrayerView';
import { FastingView } from './views/FastingView';
import { JourneyView } from './views/JourneyView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';

// Modals
import { GuidedActionModal } from './components/common/GuidedActionModal';
import { PrayerTimerModal } from './components/prayer/PrayerTimerModal';
import { NewTaskModal } from './components/tasks/NewTaskModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { ReflectionModal } from './components/reflection/ReflectionModal';
import { SyncCenterModal } from './components/sync/SyncCenterModal';

// Storage & Services & Data & Supabase Repositories
import { FaithionStorageService } from './services/storage';
import { SyncEngine } from './services/syncEngine';
import { NotificationService } from './services/notificationService';
import { evaluateNextAction } from './services/priorityEngine';
import { JourneyGuideService } from './services/journeyGuideService';
import { INITIAL_VERSE_OF_THE_DAY } from './data/bibleData';
import { useAuth } from './lib/auth';
import { 
  ProfileRepository,
  DailyTasksRepository,
  PrayerRepository,
  RoutinesRepository,
  ReadingPlanRepository
} from './services/repositories';
import { 
  SpiritualProfile, 
  DailyTask, 
  ReadingPlan, 
  PrayerRequest, 
  PrayerPlan,
  PrayerStatus,
  FastingPlan, 
  FastingType,
  FastingStatus,
  Reflection, 
  DailyConsistency,
  SpiritualObjective,
  RoutineActivity,
  ActivityExecutionLog,
  RoutineAdaptationSuggestion,
  RoutineBlock,
  ActivityStatus,
  InternalNotification,
  PlanDay,
  PlanFrequency,
  WordOfTheDay,
  WordOfTheDayHistoryItem
} from './types';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTabId>('today');
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

  // Theme (Dark/Light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('faithion_dark_mode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('faithion_dark_mode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('faithion_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Inicializa o SyncEngine (Local-First, detecta conectividade e ouvintes)
  useEffect(() => {
    SyncEngine.init();
  }, []);

  // Supabase Auth Context
  const { user, profile: authProfile } = useAuth();

  // Reactive Domain States
  const [profile, setProfile] = useState<SpiritualProfile>(() => FaithionStorageService.getProfile());
  const [tasks, setTasks] = useState<DailyTask[]>(() => FaithionStorageService.getDailyTasks());
  const [plans, setPlans] = useState<ReadingPlan[]>(() => FaithionStorageService.getReadingPlans());
  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => FaithionStorageService.getPrayerRequests());
  const [prayerPlans, setPrayerPlans] = useState<PrayerPlan[]>(() => FaithionStorageService.getPrayerPlans());
  const [fastingPlan, setFastingPlan] = useState<FastingPlan>(() => FaithionStorageService.getFastingPlan());
  const [fastingRecords, setFastingRecords] = useState<FastingPlan[]>(() => FaithionStorageService.getFastingRecords());
  const [reflections, setReflections] = useState<Reflection[]>(() => FaithionStorageService.getReflections());
  const [consistencyHistory, setConsistencyHistory] = useState<DailyConsistency[]>(() => 
    FaithionStorageService.getConsistencyHistory()
  );

  // Perfil Espiritual e Rotina Pessoal (PLANEJAR → EXECUTAR → MONITORAR → ADAPTAR)
  const [objectives, setObjectives] = useState<SpiritualObjective[]>(() => 
    FaithionStorageService.getObjectives()
  );
  const [routineActivities, setRoutineActivities] = useState<RoutineActivity[]>(() => 
    FaithionStorageService.getRoutineActivities()
  );
  const [executionLogs, setExecutionLogs] = useState<ActivityExecutionLog[]>(() => 
    FaithionStorageService.getExecutionLogs()
  );
  const [adaptationSuggestions, setAdaptationSuggestions] = useState<RoutineAdaptationSuggestion[]>(() => 
    FaithionStorageService.getAdaptationSuggestions()
  );

  // Carrega dados reais do Supabase para o usuário autenticado (Local-First com sincronização transparente)
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function loadSupabaseUserData() {
      try {
        const [profileRes, tasksRes, prayersRes, routinesRes, plansRes] = await Promise.allSettled([
          ProfileRepository.getProfile(),
          DailyTasksRepository.getTasks(),
          PrayerRepository.getPrayerRequests(),
          RoutinesRepository.getActivities(),
          ReadingPlanRepository.getPlans()
        ]);

        if (!isMounted) return;

        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          setProfile(profileRes.value.data);
        }
        if (tasksRes.status === 'fulfilled' && tasksRes.value.data && tasksRes.value.data.length > 0) {
          setTasks(tasksRes.value.data);
        }
        if (prayersRes.status === 'fulfilled' && prayersRes.value.data && prayersRes.value.data.length > 0) {
          setPrayers(prayersRes.value.data);
        }
        if (routinesRes.status === 'fulfilled' && routinesRes.value.data && routinesRes.value.data.length > 0) {
          setRoutineActivities(routinesRes.value.data);
        }
        if (plansRes.status === 'fulfilled' && plansRes.value.data && plansRes.value.data.length > 0) {
          setPlans(plansRes.value.data);
        }
      } catch (e) {
        console.warn('[FAITHION] Modo offline ou erro ao carregar do Supabase:', e);
      }
    }

    loadSupabaseUserData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Modals state
  const [isGuidedActionOpen, setIsGuidedActionOpen] = useState(false);
  const [guidedTask, setGuidedTask] = useState<DailyTask | null>(null);
  const [guidedNextTask, setGuidedNextTask] = useState<DailyTask | null>(null);
  const [guidedTaskExplanation, setGuidedTaskExplanation] = useState<string>('');
  const [isPrayerTimerOpen, setIsPrayerTimerOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isSyncCenterOpen, setIsSyncCenterOpen] = useState(false);
  const [bibleTarget, setBibleTarget] = useState<{ bookId?: string; chapter?: number } | null>(null);

  const refreshAllData = () => {
    setProfile(FaithionStorageService.getProfile());
    setTasks(FaithionStorageService.getDailyTasks());
    setPlans(FaithionStorageService.getReadingPlans());
    setPrayers(FaithionStorageService.getPrayerRequests());
    setPrayerPlans(FaithionStorageService.getPrayerPlans());
    setFastingPlan(FaithionStorageService.getFastingPlan());
    setFastingRecords(FaithionStorageService.getFastingRecords());
    setReflections(FaithionStorageService.getReflections());
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
    setObjectives(FaithionStorageService.getObjectives());
    setRoutineActivities(FaithionStorageService.getRoutineActivities());
    setExecutionLogs(FaithionStorageService.getExecutionLogs());
    setAdaptationSuggestions(FaithionStorageService.getAdaptationSuggestions());
  };

  // Cross-module contextual triggers
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [reflectionModalContext, setReflectionModalContext] = useState<{ title?: string; passage?: string } | null>(null);

  // Notificações Internas (sem serviços pagos)
  const [notifications, setNotifications] = useState<InternalNotification[]>(() => 
    NotificationService.getNotifications()
  );

  // Cálculos de Status
  const pendingTasks = tasks.filter(t => !t.completed && t.status !== 'concluida');
  const activePrayers = prayers.filter(p => !p.answered);
  const activeReadingPlan = plans.find(p => p.isActive) || plans[0];
  const streakDays = 14;
  const pendingAdaptationsCount = adaptationSuggestions.filter(s => s.status === 'pending').length;

  // Palavra do Dia Personalizada & Histórico
  const [wordOfTheDay, setWordOfTheDay] = useState<WordOfTheDay>(() => {
    return FaithionStorageService.getWordOfTheDay();
  });
  const [wordHistory, setWordHistory] = useState<WordOfTheDayHistoryItem[]>(() => {
    return FaithionStorageService.getWordOfTheDayHistory();
  });

  // Atualiza recomendação da Palavra do Dia com base nos objetivos ativos e preferências
  useEffect(() => {
    const updated = FaithionStorageService.getWordOfTheDay({
      profile,
      objectives,
      activePlans: plans
    });
    setWordOfTheDay(updated);
    setWordHistory(FaithionStorageService.getWordOfTheDayHistory());
  }, [objectives, profile.preferredBibleVersion, plans]);

  const handleRecalculateWordOfDay = () => {
    const fresh = FaithionStorageService.getWordOfTheDay({
      profile,
      objectives,
      activePlans: plans,
      forceNew: true
    });
    setWordOfTheDay(fresh);
    setWordHistory(FaithionStorageService.getWordOfTheDayHistory());
    NotificationService.addNotification({
      title: 'Palavra do Dia Atualizada',
      message: `Recomendação recalculada com base nos seus objetivos atuais.`,
      type: 'plano',
      targetTab: 'today'
    });
  };

  const handleToggleWordFavorite = (wordId: string) => {
    const updated = FaithionStorageService.toggleWordOfTheDayFavorite(wordId);
    setWordHistory(updated);
  };

  const handleSaveWordReflection = (wordId: string, reflectionText: string) => {
    FaithionStorageService.saveWordOfTheDayUserReflection(wordId, reflectionText);
    setWordHistory(FaithionStorageService.getWordOfTheDayHistory());
    NotificationService.addNotification({
      title: 'Reflexão Salva',
      message: 'Sua meditação na Palavra do Dia foi guardada com sucesso.',
      type: 'lembrete',
      targetTab: 'journey'
    });
  };

  const handleSetWordOfDayFromBible = (reference: string, text: string, bookId?: string, chapter?: number) => {
    const customWord: WordOfTheDay = {
      id: `custom-word-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      reference,
      passage: text,
      version: profile.preferredBibleVersion || 'NVI',
      theme: 'Passagem Selecionada na Bíblia',
      context: `Passagem selecionada na leitura bíblica de ${reference}.`,
      reflection: 'Meditação pessoal nas Sagradas Escrituras.',
      questions: [
        'O que esta passagem bíblica me ensina sobre a fidelidade e vontade de Deus?',
        'Como posso praticar este ensinamento ao longo do meu dia?'
      ],
      practicalApplication: 'Guarde este versículo na memória e pratique a obediência ao longo do dia.',
      optionalPrayer: 'Senhor meu Deus, grava Tua verdade em meu coração e guia meus passos segundo a Tua Palavra.',
      contentSource: {
        bibleSource: `Bíblia Sagrada (${profile.preferredBibleVersion || 'NVI'})`,
        commentarySource: 'Seleção direta do leitor',
        isAiAssisted: false
      },
      matchingCriteria: {
        reason: 'Selecionada diretamente por você durante a leitura bíblica'
      },
      bookId: bookId || 'salmos',
      chapter: chapter || 1,
      text,
      whyMeditate: `Passagem selecionada na leitura bíblica de ${reference}.`
    };
    FaithionStorageService.setCustomWordOfTheDay(customWord);
    setWordOfTheDay(customWord);
    setWordHistory(FaithionStorageService.getWordOfTheDayHistory());
    NotificationService.addNotification({
      title: 'Palavra do Dia Definida',
      message: `${reference} foi definida como sua Palavra do Dia!`,
      type: 'lembrete',
      targetTab: 'today'
    });
  };

  const handleOpenPrayerWithVerse = (title: string, passage: string) => {
    handleAddPrayer({
      title,
      description: `Meditação e oração na passagem: "${passage}"`,
      person: 'Pessoal',
      category: 'spiritual',
      priority: 'media',
      date: new Date().toISOString().split('T')[0],
      status: 'ativo',
      notes: ''
    });
    setActiveTab('prayer');
  };

  const handleOpenFastingWithPassage = (passage: string) => {
    setActiveTab('fasting');
  };

  const handleOpenReflectionWithPassage = (passage: string, theme?: string) => {
    setReflectionModalContext({
      title: theme ? `Reflexão: ${theme}` : 'Reflexão na Palavra do Dia',
      passage
    });
    setIsReflectionModalOpen(true);
  };

  const handleOpenBibleAt = (bookId: string, chapter: number) => {
    setBibleTarget({ bookId, chapter });
    setActiveTab('bible');
  };

  // Sincroniza alertas internos suavemente
  useEffect(() => {
    const notifs = NotificationService.syncInternalStatusAlerts(tasks, activeReadingPlan, fastingPlan);
    setNotifications(notifs);
  }, [tasks, activeReadingPlan?.id, fastingPlan.active]);

  // Lógica: "O QUE FAÇO AGORA?" (Motor do Guia da Jornada)
  const handleOpenWhatNow = () => {
    const guideResult = JourneyGuideService.computeJourneyGuide({
      tasks,
      plans,
      routineActivities,
      executionLogs,
      objectives,
      profile,
      prayers,
      fastingPlan
    });

    if (guideResult.currentActivity) {
      const task1: DailyTask = tasks.find(t => t.id === guideResult.currentActivity?.id) || {
        id: guideResult.currentActivity.id,
        title: guideResult.currentActivity.title,
        category: guideResult.currentActivity.category,
        timeOfDay: 'anytime',
        passageReference: guideResult.currentActivity.passageReference,
        estimatedMinutes: guideResult.currentActivity.estimatedMinutes,
        scheduledTime: guideResult.currentActivity.scheduledTime || 'Agora',
        status: guideResult.currentActivity.status,
        why: guideResult.currentActivity.why,
        completed: false,
        order: 1
      };
      setGuidedTask(task1);

      if (guideResult.nextActivity) {
        const task2: DailyTask = tasks.find(t => t.id === guideResult.nextActivity?.id) || {
          id: guideResult.nextActivity.id,
          title: guideResult.nextActivity.title,
          category: guideResult.nextActivity.category,
          timeOfDay: 'anytime',
          passageReference: guideResult.nextActivity.passageReference,
          estimatedMinutes: guideResult.nextActivity.estimatedMinutes,
          scheduledTime: guideResult.nextActivity.scheduledTime || 'Depois',
          status: guideResult.nextActivity.status,
          why: guideResult.nextActivity.why,
          completed: false,
          order: 2
        };
        setGuidedNextTask(task2);
      } else {
        setGuidedNextTask(null);
      }

      setGuidedTaskExplanation(guideResult.explanation);
      setIsGuidedActionOpen(true);
    } else {
      setGuidedTask(null);
      setGuidedNextTask(null);
      setGuidedTaskExplanation('Todas as atividades planejadas para o momento foram completadas.');
      setIsGuidedActionOpen(true);
    }
  };

  const handleContinueJourney = () => {
    handleOpenWhatNow();
  };

  // Handlers operacionais de tarefas
  const handleToggleTask = (id: string) => {
    const updated = FaithionStorageService.toggleTask(id);
    setTasks(updated);
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
    // Sincroniza em nuvem no Supabase caso autenticado
    DailyTasksRepository.toggleTaskCompletion(id).catch(() => {});
  };

  const handleStartTask = (id: string) => {
    const updated = FaithionStorageService.startTask(id);
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) DailyTasksRepository.upsertTask(task).catch(() => {});
  };

  const handleCompleteTask = (id: string, notes?: string) => {
    const { tasks: updated } = FaithionStorageService.completeTask(id, notes);
    setTasks(updated);
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
    const task = updated.find(t => t.id === id);
    if (task) DailyTasksRepository.upsertTask(task).catch(() => {});
  };

  const handleIgnoreTask = (id: string, reason?: string) => {
    const updated = FaithionStorageService.ignoreTask(id, reason);
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) DailyTasksRepository.upsertTask(task).catch(() => {});
  };

  const handleCancelTask = (id: string, reason?: string) => {
    const updated = FaithionStorageService.cancelTask(id, reason);
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) DailyTasksRepository.upsertTask(task).catch(() => {});
  };

  const handleSetTaskStatus = (id: string, status: ActivityStatus, notes?: string) => {
    const updated = FaithionStorageService.setTaskStatus(id, status, notes);
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) DailyTasksRepository.upsertTask(task).catch(() => {});
  };

  const handleAddTask = (newTaskData: Omit<DailyTask, 'id' | 'order' | 'completed'>) => {
    const created = FaithionStorageService.addTask(newTaskData);
    setTasks(FaithionStorageService.getDailyTasks());
    if (created) DailyTasksRepository.upsertTask(created).catch(() => {});
  };

  // Handlers de Notificações
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(NotificationService.markAsRead(id));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(NotificationService.markAllAsRead());
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(NotificationService.deleteNotification(id));
  };

  // Handlers de Rotina Pessoal
  const handleAddRoutineActivity = (act: Omit<RoutineActivity, 'id' | 'order'>) => {
    const created = FaithionStorageService.addRoutineActivity(act);
    setRoutineActivities(FaithionStorageService.getRoutineActivities());
    if (created) RoutinesRepository.upsertActivity(created).catch(() => {});
  };

  const handleUpdateRoutineActivity = (id: string, updates: Partial<RoutineActivity>) => {
    const updated = FaithionStorageService.updateRoutineActivity(id, updates);
    setRoutineActivities(updated);
    const activity = updated.find(a => a.id === id);
    if (activity) RoutinesRepository.upsertActivity(activity).catch(() => {});
  };

  const handleDeleteRoutineActivity = (id: string) => {
    const updated = FaithionStorageService.deleteRoutineActivity(id);
    setRoutineActivities(updated);
    RoutinesRepository.deleteActivity(id).catch(() => {});
  };

  const handleToggleActivityActive = (id: string) => {
    const updated = FaithionStorageService.toggleActivityActive(id);
    setRoutineActivities(updated);
    const activity = updated.find(a => a.id === id);
    if (activity) RoutinesRepository.upsertActivity(activity).catch(() => {});
  };

  const handleReorderActivities = (block: RoutineBlock, orderedIds: string[]) => {
    const updated = FaithionStorageService.reorderRoutineActivities(block, orderedIds);
    setRoutineActivities(updated);
  };

  // Handlers de Objetivos Espirituais
  const handleAddObjective = (obj: Omit<SpiritualObjective, 'id' | 'createdAt'>) => {
    FaithionStorageService.addObjective(obj);
    setObjectives(FaithionStorageService.getObjectives());
  };

  const handleUpdateObjective = (id: string, updates: Partial<SpiritualObjective>) => {
    const updated = FaithionStorageService.updateObjective(id, updates);
    setObjectives(updated);
  };

  const handleDeleteObjective = (id: string) => {
    const updated = FaithionStorageService.deleteObjective(id);
    setObjectives(updated);
  };

  // Handlers de Log de Execução
  const handleLogExecution = (log: Omit<ActivityExecutionLog, 'id' | 'loggedAt'>) => {
    FaithionStorageService.logActivityExecution(log);
    setExecutionLogs(FaithionStorageService.getExecutionLogs());
    setAdaptationSuggestions(FaithionStorageService.getAdaptationSuggestions());
  };

  const handleDeleteExecutionLog = (id: string) => {
    const updated = FaithionStorageService.deleteExecutionLog(id);
    setExecutionLogs(updated);
  };

  // Handlers de Adaptação Inteligente (PLANEJAR → ADAPTAR)
  const handleApplyAdaptation = (suggestionId: string) => {
    const result = FaithionStorageService.applyAdaptationSuggestion(suggestionId);
    setAdaptationSuggestions(result.suggestions);
    setRoutineActivities(result.activities);
  };

  const handleDismissAdaptation = (suggestionId: string) => {
    const updated = FaithionStorageService.dismissAdaptationSuggestion(suggestionId);
    setAdaptationSuggestions(updated);
  };

  const handleReorganizeRoutine = (suggestionId: string) => {
    const updated = FaithionStorageService.markSuggestionReorganized(suggestionId);
    setAdaptationSuggestions(updated);
  };

  // Handlers de Planos
  const handleTogglePlanDay = (planId: string, dayNumber: number) => {
    const updated = FaithionStorageService.togglePlanDay(planId, dayNumber);
    setPlans(updated);
    const plan = updated.find(p => p.id === planId);
    if (plan) ReadingPlanRepository.upsertPlan(plan).catch(() => {});
  };

  const handleSetActivePlan = (planId: string) => {
    const updated = FaithionStorageService.setActivePlan(planId);
    setPlans(updated);
    const plan = updated.find(p => p.id === planId);
    if (plan) ReadingPlanRepository.upsertPlan(plan).catch(() => {});
  };

  const handleCreatePlan = (plan: ReadingPlan) => {
    const updated = FaithionStorageService.addReadingPlan(plan);
    setPlans(updated);
    ReadingPlanRepository.upsertPlan(plan).catch(() => {});
  };

  const handleUpdatePlan = (planId: string, updates: Partial<ReadingPlan>) => {
    const updated = FaithionStorageService.updateReadingPlan(planId, updates);
    setPlans(updated);
  };

  const handleDeletePlan = (planId: string) => {
    const updated = FaithionStorageService.deleteReadingPlan(planId);
    setPlans(updated);
  };

  const handleDuplicatePlan = (planId: string) => {
    const updated = FaithionStorageService.duplicateReadingPlan(planId);
    setPlans(updated);
  };

  const handlePausePlan = (planId: string) => {
    const updated = FaithionStorageService.pauseReadingPlan(planId);
    setPlans(updated);
  };

  const handleResumePlan = (planId: string) => {
    const updated = FaithionStorageService.resumeReadingPlan(planId);
    setPlans(updated);
  };

  const handleArchivePlan = (planId: string) => {
    const updated = FaithionStorageService.archiveReadingPlan(planId);
    setPlans(updated);
  };

  const handleUnarchivePlan = (planId: string) => {
    const updated = FaithionStorageService.unarchiveReadingPlan(planId);
    setPlans(updated);
  };

  const handleContinueWhereLeftOff = (planId: string) => {
    const updated = FaithionStorageService.continuePlanFromWhereLeftOff(planId);
    setPlans(updated);
  };

  const handleReorganizePlan = (planId: string, newStartDate?: string, freq?: PlanFrequency, daysOfWeek?: number[]) => {
    const updated = FaithionStorageService.reorganizePlanSchedule(planId, newStartDate, freq, daysOfWeek);
    setPlans(updated);
  };

  const handleAddDayToPlan = (planId: string, day: Omit<PlanDay, 'dayNumber'>) => {
    const updated = FaithionStorageService.addDayToPlan(planId, day);
    setPlans(updated);
  };

  const handleRemoveDayFromPlan = (planId: string, dayNumber: number) => {
    const updated = FaithionStorageService.removeDayFromPlan(planId, dayNumber);
    setPlans(updated);
  };

  const handleReorderPlanDays = (planId: string, days: PlanDay[]) => {
    const updated = FaithionStorageService.reorderPlanDays(planId, days);
    setPlans(updated);
  };

  // Handlers de Oração
  const handleAddPrayer = (newPrayerData: Omit<PrayerRequest, 'id' | 'createdAt' | 'answered' | 'timesPrayed'>) => {
    const created = FaithionStorageService.addPrayerRequest(newPrayerData);
    setPrayers(FaithionStorageService.getPrayerRequests());
    if (created) PrayerRepository.upsertPrayerRequest(created).catch(() => {});
  };

  const handleUpdatePrayer = (id: string, updates: Partial<PrayerRequest>) => {
    const updated = FaithionStorageService.updatePrayerRequest(id, updates);
    setPrayers(updated);
    const prayer = updated.find(p => p.id === id);
    if (prayer) PrayerRepository.upsertPrayerRequest(prayer).catch(() => {});
  };

  const handleDeletePrayer = (id: string) => {
    const updated = FaithionStorageService.deletePrayerRequest(id);
    setPrayers(updated);
    PrayerRepository.deletePrayerRequest(id).catch(() => {});
  };

  const handleSetPrayerStatus = (id: string, status: PrayerStatus, answer?: string, notes?: string) => {
    const updated = FaithionStorageService.setPrayerStatus(id, status, answer, notes);
    setPrayers(updated);
    const prayer = updated.find(p => p.id === id);
    if (prayer) PrayerRepository.upsertPrayerRequest(prayer).catch(() => {});
  };

  const handleTogglePrayerAnswered = (id: string, testimony?: string) => {
    const updated = FaithionStorageService.togglePrayerAnswered(id, testimony);
    setPrayers(updated);
    const prayer = updated.find(p => p.id === id);
    if (prayer) PrayerRepository.upsertPrayerRequest(prayer).catch(() => {});
  };

  const handleFinishPrayerSession = (prayerIds: string[], minutes: number) => {
    FaithionStorageService.logPrayerSession(prayerIds, minutes);
    setPrayers(FaithionStorageService.getPrayerRequests());
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
  };

  // Handlers de Planos de Oração
  const handleAddPrayerPlan = (plan: Omit<PrayerPlan, 'id' | 'createdAt'>) => {
    FaithionStorageService.addPrayerPlan(plan);
    setPrayerPlans(FaithionStorageService.getPrayerPlans());
  };

  const handleUpdatePrayerPlan = (id: string, updates: Partial<PrayerPlan>) => {
    const updated = FaithionStorageService.updatePrayerPlan(id, updates);
    setPrayerPlans(updated);
  };

  const handleDeletePrayerPlan = (id: string) => {
    const updated = FaithionStorageService.deletePrayerPlan(id);
    setPrayerPlans(updated);
  };

  // Handlers de Jejum
  const handleStartFasting = (purpose: string, targetHours: number, type: FastingType) => {
    const newFast = FaithionStorageService.startFasting(purpose, targetHours, type);
    setFastingPlan(newFast);
    setFastingRecords(FaithionStorageService.getFastingRecords());
  };

  const handleStopFasting = (reflections?: string) => {
    const endedFast = FaithionStorageService.stopFasting(reflections);
    setFastingPlan(endedFast);
    setFastingRecords(FaithionStorageService.getFastingRecords());
  };

  const handleCreateFasting = (data: any) => {
    FaithionStorageService.addFastingRecord(data);
    setFastingRecords(FaithionStorageService.getFastingRecords());
    setFastingPlan(FaithionStorageService.getFastingPlan());
  };

  const handleStartFastingRecord = (id: string) => {
    FaithionStorageService.startFastingRecord(id);
    setFastingRecords(FaithionStorageService.getFastingRecords());
    setFastingPlan(FaithionStorageService.getFastingPlan());
  };

  const handleCompleteFastingRecord = (id: string, reflections?: string) => {
    FaithionStorageService.completeFastingRecord(id, reflections);
    setFastingRecords(FaithionStorageService.getFastingRecords());
    setFastingPlan(FaithionStorageService.getFastingPlan());
  };

  const handleInterruptFastingRecord = (id: string, reason?: string) => {
    FaithionStorageService.interruptFastingRecord(id, reason);
    setFastingRecords(FaithionStorageService.getFastingRecords());
    setFastingPlan(FaithionStorageService.getFastingPlan());
  };

  const handleCancelFastingRecord = (id: string, reason?: string) => {
    FaithionStorageService.cancelFastingRecord(id, reason);
    setFastingRecords(FaithionStorageService.getFastingRecords());
    setFastingPlan(FaithionStorageService.getFastingPlan());
  };

  const handleDeleteFastingRecord = (id: string) => {
    const updated = FaithionStorageService.deleteFastingRecord(id);
    setFastingRecords(updated);
    setFastingPlan(FaithionStorageService.getFastingPlan());
  };

  // Handlers de Reflexão
  const handleAddReflection = (reflData: Omit<Reflection, 'id' | 'createdAt'>) => {
    FaithionStorageService.addReflection(reflData);
    setReflections(FaithionStorageService.getReflections());
  };

  const handleUpdateReflection = (id: string, updates: Partial<Reflection>) => {
    const updated = FaithionStorageService.updateReflection(id, updates);
    setReflections(updated);
  };

  const handleDeleteReflection = (id: string) => {
    const updated = FaithionStorageService.deleteReflection(id);
    setReflections(updated);
  };

  // Navegação Cruzada Inteligente (Bíblia -> Oração -> Jejum -> Reflexão)
  const handleOpenFastingFromPrayer = (prayerTitle: string, prayerId?: string) => {
    setActiveTab('fasting');
  };

  const handleOpenFastingFromBible = (passageRef: string) => {
    setActiveTab('fasting');
  };

  const handleTriggerReflectionModal = (contextTitle: string, passageRef?: string) => {
    setReflectionModalContext({ title: contextTitle, passage: passageRef });
    setIsReflectionModalOpen(true);
  };

  // Handlers de Perfil
  const handleUpdateProfile = (updates: Partial<SpiritualProfile>) => {
    const updated = FaithionStorageService.updateProfile(updates);
    setProfile(updated);
    ProfileRepository.saveProfile(updated).catch(() => {});
  };

  const handleUpdateProfileGoals = (prayerMins: number, chapters: number) => {
    const updated = FaithionStorageService.updateProfile({
      dailyPrayerGoalMinutes: prayerMins,
      dailyBibleChaptersGoal: chapters
    });
    setProfile(updated);
    ProfileRepository.saveProfile(updated).catch(() => {});
  };

  const handleResetData = () => {
    FaithionStorageService.resetToDefaultData();
    setProfile(FaithionStorageService.getProfile());
    setTasks(FaithionStorageService.getDailyTasks());
    setPlans(FaithionStorageService.getReadingPlans());
    setPrayers(FaithionStorageService.getPrayerRequests());
    setFastingPlan(FaithionStorageService.getFastingPlan());
    setReflections(FaithionStorageService.getReflections());
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
    setObjectives(FaithionStorageService.getObjectives());
    setRoutineActivities(FaithionStorageService.getRoutineActivities());
    setExecutionLogs(FaithionStorageService.getExecutionLogs());
    setAdaptationSuggestions(FaithionStorageService.getAdaptationSuggestions());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] dark:bg-[#0C1210] text-[#19211D] dark:text-[#F1F4F2] transition-colors">
      
      {/* Global Application Header */}
      <Header
        profile={profile}
        streakDays={streakDays}
        onOpenWhatNow={handleOpenWhatNow}
        onContinueJourney={handleContinueJourney}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        activeTabTitle={activeTab}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
        onOpenSyncCenter={() => setIsSyncCenterOpen(true)}
      />

      {/* Main Container: Sidebar + Active View Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar with all items */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          pendingTasksCount={pendingTasks.length}
          activePrayersCount={activePrayers.length}
          isFastingActive={fastingPlan.active}
          pendingAdaptationsCount={pendingAdaptationsCount}
        />

        {/* View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto pb-24 lg:pb-12">
          
          {activeTab === 'today' && (
            <TodayView
              profile={profile}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onStartTask={handleStartTask}
              onCompleteTask={handleCompleteTask}
              onIgnoreTask={handleIgnoreTask}
              onCancelTask={handleCancelTask}
              onSetTaskStatus={handleSetTaskStatus}
              verseOfDay={wordOfTheDay}
              wordOfTheDay={wordOfTheDay}
              wordHistory={wordHistory}
              onToggleWordFavorite={handleToggleWordFavorite}
              onSaveWordReflection={handleSaveWordReflection}
              onRecalculateWordOfDay={handleRecalculateWordOfDay}
              onOpenPrayerWithVerse={handleOpenPrayerWithVerse}
              onOpenFastingWithPassage={handleOpenFastingWithPassage}
              onOpenReflectionWithPassage={handleOpenReflectionWithPassage}
              onOpenBibleAt={handleOpenBibleAt}
              activePlan={activeReadingPlan}
              fastingPlan={fastingPlan}
              streakDays={streakDays}
              prayerRequests={prayers}
              reflections={reflections}
              onSaveReflection={handleAddReflection}
              onOpenWhatNow={handleOpenWhatNow}
              onContinueJourney={handleContinueJourney}
              onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenPrayerTimer={() => setIsPrayerTimerOpen(true)}
            />
          )}

          {activeTab === 'routine' && (
            <RoutineView
              profile={profile}
              routineActivities={routineActivities}
              objectives={objectives}
              executionLogs={executionLogs}
              adaptationSuggestions={adaptationSuggestions}
              onAddRoutineActivity={handleAddRoutineActivity}
              onUpdateRoutineActivity={handleUpdateRoutineActivity}
              onDeleteRoutineActivity={handleDeleteRoutineActivity}
              onToggleActivityActive={handleToggleActivityActive}
              onReorderActivities={handleReorderActivities}
              onAddObjective={handleAddObjective}
              onUpdateObjective={handleUpdateObjective}
              onDeleteObjective={handleDeleteObjective}
              onLogExecution={handleLogExecution}
              onDeleteExecutionLog={handleDeleteExecutionLog}
              onApplyAdaptation={handleApplyAdaptation}
              onDismissAdaptation={handleDismissAdaptation}
              onReorganizeRoutine={handleReorganizeRoutine}
              onNavigateToSettings={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'bible' && (
            <BibleView
              initialBookId={bibleTarget?.bookId}
              initialChapter={bibleTarget?.chapter}
              activeReadingPlan={activeReadingPlan}
              onOpenPrayerWithVerse={(verseText, ref) => {
                handleAddPrayer({
                  title: `Oração sobre ${ref}`,
                  category: 'spiritual',
                  priority: 'media',
                  date: new Date().toISOString().split('T')[0],
                  status: 'ativo',
                  description: `Meditação e consagração: "${verseText}"`,
                  scriptureReferences: [ref]
                });
                setActiveTab('prayer');
              }}
              onOpenFastingWithPassage={(ref) => {
                handleOpenFastingFromBible(ref);
              }}
              onSetVerseOfDay={(ref, text) => {
                handleSetWordOfDayFromBible(ref, text);
              }}
              onSaveReflection={handleAddReflection}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'plans' && (
            <PlansView
              plans={plans}
              onTogglePlanDay={handleTogglePlanDay}
              onSetActivePlan={handleSetActivePlan}
              onNavigateToBible={(bookId, chapter) => {
                setBibleTarget({ bookId, chapter });
                setActiveTab('bible');
              }}
              onCreatePlan={handleCreatePlan}
              onUpdatePlan={handleUpdatePlan}
              onDeletePlan={handleDeletePlan}
              onDuplicatePlan={handleDuplicatePlan}
              onPausePlan={handlePausePlan}
              onResumePlan={handleResumePlan}
              onArchivePlan={handleArchivePlan}
              onUnarchivePlan={handleUnarchivePlan}
              onContinueWhereLeftOff={handleContinueWhereLeftOff}
              onReorganizePlan={handleReorganizePlan}
              onAddDayToPlan={handleAddDayToPlan}
              onRemoveDayFromPlan={handleRemoveDayFromPlan}
              onReorderPlanDays={handleReorderPlanDays}
            />
          )}

          {activeTab === 'prayer' && (
            <PrayerView
              prayers={prayers}
              onAddPrayer={handleAddPrayer}
              onUpdatePrayer={handleUpdatePrayer}
              onDeletePrayer={handleDeletePrayer}
              onToggleAnswered={handleTogglePrayerAnswered}
              onSetPrayerStatus={handleSetPrayerStatus}
              prayerPlans={prayerPlans}
              onAddPrayerPlan={handleAddPrayerPlan}
              onUpdatePrayerPlan={handleUpdatePrayerPlan}
              onDeletePrayerPlan={handleDeletePrayerPlan}
              onOpenTimer={() => setIsPrayerTimerOpen(true)}
              onOpenFastingWithPrayer={handleOpenFastingFromPrayer}
              onOpenReflection={handleTriggerReflectionModal}
            />
          )}

          {activeTab === 'fasting' && (
            <FastingView
              fastingPlan={fastingPlan}
              fastingRecords={fastingRecords}
              prayers={prayers}
              onStartFasting={handleStartFasting}
              onStopFasting={handleStopFasting}
              onCreateFasting={handleCreateFasting}
              onStartFastingRecord={handleStartFastingRecord}
              onCompleteFastingRecord={handleCompleteFastingRecord}
              onInterruptFastingRecord={handleInterruptFastingRecord}
              onCancelFastingRecord={handleCancelFastingRecord}
              onDeleteFastingRecord={handleDeleteFastingRecord}
              onNavigateToBible={(ref) => {
                setActiveTab('bible');
              }}
              onOpenReflection={handleTriggerReflectionModal}
            />
          )}

          {activeTab === 'journey' && (
            <JourneyView
              profile={profile}
              reflections={reflections}
              onAddReflection={handleAddReflection}
              onUpdateReflection={handleUpdateReflection}
              onDeleteReflection={handleDeleteReflection}
              consistencyHistory={consistencyHistory}
              onUpdateProfileGoals={handleUpdateProfileGoals}
              onNavigateToBible={(ref) => setActiveTab('bible')}
              onNavigateToPrayer={() => setActiveTab('prayer')}
              onNavigateToFasting={() => setActiveTab('fasting')}
            />
          )}

          {activeTab === 'stats' && (
            <StatsView
              consistencyHistory={consistencyHistory}
              profile={profile}
              answeredPrayersCount={prayers.filter(p => p.answered).length}
              totalPrayersCount={prayers.length}
              plans={plans}
              prayerPlans={prayerPlans}
              prayers={prayers}
              fastingRecords={fastingRecords}
              reflections={reflections}
              routineActivities={routineActivities}
              executionLogs={executionLogs}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onResetData={handleResetData}
              onNavigateToRoutine={() => setActiveTab('routine')}
              onOpenSyncCenter={() => setIsSyncCenterOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation (5 items: Hoje, Bíblia, Planos, Jornada, Mais) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMoreDrawerOpen(false);
        }}
        onOpenMore={() => setIsMoreDrawerOpen(true)}
        isMoreOpen={isMoreDrawerOpen}
        pendingTasksCount={pendingTasks.length}
      />

      {/* Mobile Drawer "Mais" */}
      <MoreSheet
        isOpen={isMoreDrawerOpen}
        onClose={() => setIsMoreDrawerOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
        activePrayersCount={activePrayers.length}
        isFastingActive={fastingPlan.active}
        pendingAdaptationsCount={pendingAdaptationsCount}
      />

      {/* Modals */}
      <GuidedActionModal
        isOpen={isGuidedActionOpen}
        onClose={() => setIsGuidedActionOpen(false)}
        task={guidedTask}
        explanation={guidedTaskExplanation}
        onCompleteTask={(id) => handleCompleteTask(id)}
        onStartTask={handleStartTask}
        onIgnoreTask={handleIgnoreTask}
        onNavigateToSection={(sec) => {
          setIsGuidedActionOpen(false);
          setActiveTab(sec as NavTabId);
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onDeleteNotification={handleDeleteNotification}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as NavTabId);
          setIsNotificationsDrawerOpen(false);
        }}
      />

      <PrayerTimerModal
        isOpen={isPrayerTimerOpen}
        onClose={() => setIsPrayerTimerOpen(false)}
        prayers={prayers}
        onFinishSession={handleFinishPrayerSession}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => {
          setIsReflectionModalOpen(false);
          setReflectionModalContext(null);
        }}
        onSave={(refl) => {
          handleAddReflection(refl);
          setIsReflectionModalOpen(false);
          setReflectionModalContext(null);
        }}
        relatedTitle={reflectionModalContext?.title}
        scriptureRef={reflectionModalContext?.passage}
      />

      <SyncCenterModal
        isOpen={isSyncCenterOpen}
        onClose={() => setIsSyncCenterOpen(false)}
        onDataRestored={refreshAllData}
      />

    </div>
  );
}
