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

// Storage & Services & Data
import { FaithionStorageService } from './services/storage';
import { NotificationService } from './services/notificationService';
import { evaluateNextAction } from './services/priorityEngine';
import { INITIAL_VERSE_OF_THE_DAY } from './data/bibleData';
import { 
  SpiritualProfile, 
  DailyTask, 
  ReadingPlan, 
  PrayerRequest, 
  FastingPlan, 
  Reflection, 
  DailyConsistency,
  FastingType,
  SpiritualObjective,
  RoutineActivity,
  ActivityExecutionLog,
  RoutineAdaptationSuggestion,
  RoutineBlock,
  ActivityStatus,
  InternalNotification
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

  // Reactive Domain States
  const [profile, setProfile] = useState<SpiritualProfile>(() => FaithionStorageService.getProfile());
  const [tasks, setTasks] = useState<DailyTask[]>(() => FaithionStorageService.getDailyTasks());
  const [plans, setPlans] = useState<ReadingPlan[]>(() => FaithionStorageService.getReadingPlans());
  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => FaithionStorageService.getPrayerRequests());
  const [fastingPlan, setFastingPlan] = useState<FastingPlan>(() => FaithionStorageService.getFastingPlan());
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

  // Modals state
  const [isGuidedActionOpen, setIsGuidedActionOpen] = useState(false);
  const [guidedTask, setGuidedTask] = useState<DailyTask | null>(null);
  const [guidedTaskExplanation, setGuidedTaskExplanation] = useState<string>('');
  const [isPrayerTimerOpen, setIsPrayerTimerOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [bibleTarget, setBibleTarget] = useState<{ bookId?: string; chapter?: number } | null>(null);

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

  // Sincroniza alertas internos suavemente
  useEffect(() => {
    const notifs = NotificationService.syncInternalStatusAlerts(tasks, activeReadingPlan, fastingPlan);
    setNotifications(notifs);
  }, [tasks, activeReadingPlan?.id, fastingPlan.active]);

  // Lógica: "O QUE FAÇO AGORA?" (Motor de Prioridade Operacional)
  const handleOpenWhatNow = () => {
    const result = evaluateNextAction(tasks, activeReadingPlan, fastingPlan);
    setGuidedTask(result.nextTask);
    setGuidedTaskExplanation(result.explanation);
    setIsGuidedActionOpen(true);
  };

  const handleContinueJourney = () => {
    const result = evaluateNextAction(tasks, activeReadingPlan, fastingPlan);
    if (result.nextTask) {
      setGuidedTask(result.nextTask);
      setGuidedTaskExplanation(result.explanation);
      setIsGuidedActionOpen(true);
    } else {
      setActiveTab('journey');
    }
  };

  // Handlers operacionais de tarefas
  const handleToggleTask = (id: string) => {
    const updated = FaithionStorageService.toggleTask(id);
    setTasks(updated);
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
  };

  const handleStartTask = (id: string) => {
    const updated = FaithionStorageService.startTask(id);
    setTasks(updated);
  };

  const handleCompleteTask = (id: string, notes?: string) => {
    const { tasks: updated } = FaithionStorageService.completeTask(id, notes);
    setTasks(updated);
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
  };

  const handleIgnoreTask = (id: string, reason?: string) => {
    const updated = FaithionStorageService.ignoreTask(id, reason);
    setTasks(updated);
  };

  const handleCancelTask = (id: string, reason?: string) => {
    const updated = FaithionStorageService.cancelTask(id, reason);
    setTasks(updated);
  };

  const handleSetTaskStatus = (id: string, status: ActivityStatus, notes?: string) => {
    const updated = FaithionStorageService.setTaskStatus(id, status, notes);
    setTasks(updated);
  };

  const handleAddTask = (newTaskData: Omit<DailyTask, 'id' | 'order' | 'completed'>) => {
    FaithionStorageService.addTask(newTaskData);
    setTasks(FaithionStorageService.getDailyTasks());
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
    FaithionStorageService.addRoutineActivity(act);
    setRoutineActivities(FaithionStorageService.getRoutineActivities());
  };

  const handleUpdateRoutineActivity = (id: string, updates: Partial<RoutineActivity>) => {
    const updated = FaithionStorageService.updateRoutineActivity(id, updates);
    setRoutineActivities(updated);
  };

  const handleDeleteRoutineActivity = (id: string) => {
    const updated = FaithionStorageService.deleteRoutineActivity(id);
    setRoutineActivities(updated);
  };

  const handleToggleActivityActive = (id: string) => {
    const updated = FaithionStorageService.toggleActivityActive(id);
    setRoutineActivities(updated);
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
  };

  const handleSetActivePlan = (planId: string) => {
    const updated = FaithionStorageService.setActivePlan(planId);
    setPlans(updated);
  };

  // Handlers de Oração
  const handleAddPrayer = (newPrayerData: Omit<PrayerRequest, 'id' | 'createdAt' | 'answered' | 'timesPrayed'>) => {
    FaithionStorageService.addPrayerRequest(newPrayerData);
    setPrayers(FaithionStorageService.getPrayerRequests());
  };

  const handleTogglePrayerAnswered = (id: string, testimony?: string) => {
    const updated = FaithionStorageService.togglePrayerAnswered(id, testimony);
    setPrayers(updated);
  };

  const handleFinishPrayerSession = (prayerIds: string[], minutes: number) => {
    FaithionStorageService.logPrayerSession(prayerIds, minutes);
    setPrayers(FaithionStorageService.getPrayerRequests());
    setConsistencyHistory(FaithionStorageService.getConsistencyHistory());
  };

  // Handlers de Jejum
  const handleStartFasting = (purpose: string, targetHours: number, type: FastingType) => {
    const newFast = FaithionStorageService.startFasting(purpose, targetHours, type);
    setFastingPlan(newFast);
  };

  const handleStopFasting = (reflections?: string) => {
    const endedFast = FaithionStorageService.stopFasting(reflections);
    setFastingPlan(endedFast);
  };

  // Handlers de Reflexão
  const handleAddReflection = (reflData: Omit<Reflection, 'id' | 'createdAt'>) => {
    FaithionStorageService.addReflection(reflData);
    setReflections(FaithionStorageService.getReflections());
  };

  // Handlers de Perfil
  const handleUpdateProfile = (updates: Partial<SpiritualProfile>) => {
    const updated = FaithionStorageService.updateProfile(updates);
    setProfile(updated);
  };

  const handleUpdateProfileGoals = (prayerMins: number, chapters: number) => {
    const updated = FaithionStorageService.updateProfile({
      dailyPrayerGoalMinutes: prayerMins,
      dailyBibleChaptersGoal: chapters
    });
    setProfile(updated);
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
              verseOfDay={INITIAL_VERSE_OF_THE_DAY}
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
                  description: `Meditação e consagração: "${verseText}"`,
                  scriptureReferences: [ref]
                });
                setActiveTab('prayer');
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
            />
          )}

          {activeTab === 'prayer' && (
            <PrayerView
              prayers={prayers}
              onAddPrayer={handleAddPrayer}
              onToggleAnswered={handleTogglePrayerAnswered}
              onOpenTimer={() => setIsPrayerTimerOpen(true)}
            />
          )}

          {activeTab === 'fasting' && (
            <FastingView
              fastingPlan={fastingPlan}
              onStartFasting={handleStartFasting}
              onStopFasting={handleStopFasting}
            />
          )}

          {activeTab === 'journey' && (
            <JourneyView
              profile={profile}
              reflections={reflections}
              onAddReflection={handleAddReflection}
              consistencyHistory={consistencyHistory}
              onUpdateProfileGoals={handleUpdateProfileGoals}
            />
          )}

          {activeTab === 'stats' && (
            <StatsView
              consistencyHistory={consistencyHistory}
              profile={profile}
              answeredPrayersCount={prayers.filter(p => p.answered).length}
              totalPrayersCount={prayers.length}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onResetData={handleResetData}
              onNavigateToRoutine={() => setActiveTab('routine')}
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

    </div>
  );
}
