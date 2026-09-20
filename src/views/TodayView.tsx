import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  HeartHandshake, 
  Flame, 
  PenLine, 
  ChevronRight, 
  Plus, 
  Compass, 
  AlertCircle,
  Play,
  RotateCcw,
  Check,
  Ban,
  PauseCircle,
  Send,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { 
  DailyTask, 
  VerseOfDay, 
  WordOfTheDay,
  WordOfTheDayHistoryItem,
  SpiritualProfile, 
  ReadingPlan, 
  FastingPlan, 
  TaskCategory,
  ActivityStatus,
  PrayerRequest,
  Reflection
} from '../types';
import { NavTabId } from '../components/layout/Sidebar';
import { evaluateNextAction } from '../services/priorityEngine';
import { WordOfDayCard } from '../components/wordOfDay/WordOfDayCard';
import { WordOfDayHistoryModal } from '../components/wordOfDay/WordOfDayHistoryModal';
import { FaithionStorageService } from '../services/storage';

interface TodayViewProps {
  profile: SpiritualProfile;
  tasks: DailyTask[];
  onToggleTask: (id: string) => void;
  onStartTask: (id: string) => void;
  onCompleteTask: (id: string, notes?: string) => void;
  onIgnoreTask: (id: string, reason?: string) => void;
  onCancelTask: (id: string, reason?: string) => void;
  onSetTaskStatus: (id: string, status: ActivityStatus, notes?: string) => void;
  verseOfDay: VerseOfDay | WordOfTheDay;
  wordOfTheDay?: WordOfTheDay;
  wordHistory?: WordOfTheDayHistoryItem[];
  onToggleWordFavorite?: (wordId: string) => void;
  onSaveWordReflection?: (wordId: string, reflectionText: string) => void;
  onRecalculateWordOfDay?: () => void;
  onOpenPrayerWithVerse?: (title: string, passage: string) => void;
  onOpenFastingWithPassage?: (passage: string) => void;
  onOpenReflectionWithPassage?: (passage: string, theme?: string) => void;
  onOpenBibleAt?: (bookId: string, chapter: number) => void;
  activePlan?: ReadingPlan;
  fastingPlan: FastingPlan;
  streakDays: number;
  prayerRequests?: PrayerRequest[];
  reflections?: Reflection[];
  onSaveReflection?: (reflection: Omit<Reflection, 'id' | 'createdAt'>) => void;
  onOpenWhatNow: () => void;
  onContinueJourney: () => void;
  onOpenNewTaskModal: () => void;
  onNavigateToTab: (tab: NavTabId) => void;
  onOpenPrayerTimer: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  profile,
  tasks,
  onToggleTask,
  onStartTask,
  onCompleteTask,
  onIgnoreTask,
  onCancelTask,
  onSetTaskStatus,
  verseOfDay,
  wordOfTheDay,
  wordHistory,
  onToggleWordFavorite,
  onSaveWordReflection,
  onRecalculateWordOfDay,
  onOpenPrayerWithVerse,
  onOpenFastingWithPassage,
  onOpenReflectionWithPassage,
  onOpenBibleAt,
  activePlan,
  fastingPlan,
  streakDays,
  prayerRequests = [],
  reflections = [],
  onSaveReflection,
  onOpenWhatNow,
  onContinueJourney,
  onOpenNewTaskModal,
  onNavigateToTab,
  onOpenPrayerTimer
}) => {
  const [isWordHistoryOpen, setIsWordHistoryOpen] = useState(false);
  const [localWordHistory, setLocalWordHistory] = useState<WordOfTheDayHistoryItem[]>(() => {
    return wordHistory || FaithionStorageService.getWordOfTheDayHistory();
  });

  useEffect(() => {
    if (wordHistory) {
      setLocalWordHistory(wordHistory);
    }
  }, [wordHistory]);

  const handleToggleHistoryFavorite = (wordId: string) => {
    if (onToggleWordFavorite) {
      onToggleWordFavorite(wordId);
    }
    const updated = FaithionStorageService.toggleWordOfTheDayFavorite(wordId);
    setLocalWordHistory(updated);
  };

  const handleSaveHistoryReflection = (wordId: string, text: string) => {
    if (onSaveWordReflection) {
      onSaveWordReflection(wordId, text);
    }
    FaithionStorageService.saveWordOfTheDayUserReflection(wordId, text);
    setLocalWordHistory(FaithionStorageService.getWordOfTheDayHistory());
  };

  // Normaliza o objeto para WordOfTheDay
  const currentWord: WordOfTheDay = wordOfTheDay || ('passage' in verseOfDay ? (verseOfDay as WordOfTheDay) : {
    id: `wotd-${verseOfDay.bookId}-${verseOfDay.chapter}`,
    date: new Date().toISOString().split('T')[0],
    reference: verseOfDay.reference,
    passage: verseOfDay.text,
    text: verseOfDay.text,
    version: verseOfDay.version,
    theme: verseOfDay.theme || 'Reflexão Bíblica Diária',
    context: verseOfDay.whyMeditate,
    whyMeditate: verseOfDay.whyMeditate,
    reflection: verseOfDay.whyMeditate,
    questions: verseOfDay.questions || [
      'O que esta passagem bíblica me ensina sobre o caráter de Deus?',
      'Como posso praticar este princípio nas minhas decisões hoje?'
    ],
    practicalApplication: verseOfDay.practicalApplication,
    optionalPrayer: verseOfDay.optionalPrayer,
    contentSource: {
      bibleSource: `Bíblia Sagrada (${verseOfDay.version})`,
      commentarySource: 'Exposição devocional FAITHION'
    },
    bookId: verseOfDay.bookId,
    chapter: verseOfDay.chapter
  });

  const isCurrentWordFavorite = localWordHistory.find(
    h => h.wordId === currentWord.id || h.date === currentWord.date
  )?.isFavorite || false;

  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);
  const [justFinishedMessage, setJustFinishedMessage] = useState<string | null>(null);
  const [statusSelectorOpenId, setStatusSelectorOpenId] = useState<string | null>(null);
  
  // Reflexão do dia
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionGratitude, setReflectionGratitude] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Timer em andamento
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Execução do Motor de Prioridade
  const priorityResult = evaluateNextAction(tasks, activePlan, fastingPlan);
  const nextTask = priorityResult.nextTask;

  // Se a próxima tarefa estiver em andamento, cronometrar
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (nextTask && nextTask.status === 'em_andamento') {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [nextTask?.id, nextTask?.status]);

  const handleStartNext = (taskId: string) => {
    onStartTask(taskId);
  };

  const handleConcludeNext = (taskId: string) => {
    onCompleteTask(taskId);
    setJustFinishedMessage('Atividade concluída com fidelidade.');
    setTimeout(() => {
      setJustFinishedMessage(null);
    }, 3500);
  };

  const handleSaveDailyReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim() && !reflectionGratitude.trim()) return;

    if (onSaveReflection) {
      onSaveReflection({
        date: new Date().toISOString().split('T')[0],
        scriptureRef: verseOfDay.reference,
        whatGodSpoke: reflectionText,
        practicalApplication: 'Dar graças em toda circunstância e manter a oração em espírito.',
        gratitudeNotes: reflectionGratitude ? [reflectionGratitude] : [],
        moodRating: 5
      });
      setReflectionSaved(true);
      setTimeout(() => {
        setReflectionText('');
        setReflectionGratitude('');
        setReflectionSaved(false);
      }, 3000);
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'bible': return <BookOpen className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />;
      case 'prayer': return <HeartHandshake className="w-4 h-4 text-[#C59B3F]" />;
      case 'fasting': return <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'reflection': return <PenLine className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      default: return <Compass className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />;
    }
  };

  const getCategoryName = (category: TaskCategory) => {
    switch (category) {
      case 'bible': return 'Leitura';
      case 'prayer': return 'Oração';
      case 'fasting': return 'Jejum';
      case 'reflection': return 'Reflexão';
      default: return 'Espiritual';
    }
  };

  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case 'proxima':
        return {
          label: 'Próxima',
          classes: 'bg-[#E6F0EA] text-[#162E23] dark:bg-[#192D23] dark:text-[#4F8E71] border border-[#29523F]/30'
        };
      case 'em_andamento':
        return {
          label: 'Em andamento',
          classes: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30 animate-pulse'
        };
      case 'atrasada':
        return {
          label: 'Atrasada',
          classes: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-400/30'
        };
      case 'concluida':
        return {
          label: 'Concluída',
          classes: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
        };
      case 'ignorada':
        return {
          label: 'Ignorada',
          classes: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800/60 dark:text-neutral-500 line-through'
        };
      case 'cancelada':
        return {
          label: 'Cancelada',
          classes: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
        };
      case 'planejada':
      default:
        return {
          label: 'Planejada',
          classes: 'bg-neutral-50 text-neutral-700 dark:bg-[#1B2521] dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
        };
    }
  };

  const activeTodayPlanDay = activePlan?.days.find(d => d.dayNumber === activePlan.currentDay);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* 1. PALAVRA DO DIA PERSONALIZADA */}
      <WordOfDayCard
        word={currentWord}
        isFavorite={isCurrentWordFavorite}
        onToggleFavorite={handleToggleHistoryFavorite}
        onOpenBible={(bookId, chapter) => {
          if (onOpenBibleAt) {
            onOpenBibleAt(bookId, chapter);
          } else {
            onNavigateToTab('bible');
          }
        }}
        onOpenPrayer={(ref, text) => {
          if (onOpenPrayerWithVerse) {
            onOpenPrayerWithVerse(`Oração sobre ${ref}`, text);
          } else {
            onOpenPrayerTimer();
          }
        }}
        onOpenFasting={(ref) => {
          if (onOpenFastingWithPassage) {
            onOpenFastingWithPassage(ref);
          } else {
            onNavigateToTab('fasting');
          }
        }}
        onOpenReflection={(ref, text, theme) => {
          if (onOpenReflectionWithPassage) {
            onOpenReflectionWithPassage(ref, theme);
          } else {
            setReflectionText(`Meditação em ${ref}: "${text.slice(0, 100)}..."`);
          }
        }}
        onOpenHistory={() => setIsWordHistoryOpen(true)}
        onRecalculate={onRecalculateWordOfDay}
      />

      {/* 2. PRÓXIMA ATIVIDADE (MOTOR DE PRIORIDADE + "PRÓXIMA AÇÃO") */}
      <section 
        id="section-proxima-atividade"
        className="p-5 sm:p-6 rounded-2xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 dark:border-[#29523F]/30 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#29523F]/15 dark:border-[#29523F]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#162E23] dark:bg-[#4F8E71]" />
              <span className="text-xs uppercase tracking-wider font-bold text-[#29523F] dark:text-[#4F8E71]">
                2. Próxima Atividade
              </span>
              <span className="text-xs text-[#7D8882]">•</span>
              <span className="text-xs text-[#7D8882] dark:text-[#788780]">
                Motor de Prioridade Operacional
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
              PRÓXIMA AÇÃO
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-today-what-now"
              onClick={onOpenWhatNow}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] border border-[#29523F]/30 hover:bg-[#D5E6DC] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#C59B3F]" />
              <span>O QUE FAÇO AGORA?</span>
            </button>
            <button
              id="btn-today-continue"
              onClick={onContinueJourney}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-all shadow-xs"
            >
              <span>CONTINUAR JORNADA</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback de conclusão suave */}
        {justFinishedMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-xs text-[#162E23] dark:text-emerald-300 font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#2A6E4F]" />
            <span>{justFinishedMessage} Mostrando a próxima atividade abaixo:</span>
          </div>
        )}

        {/* Resposta Clara do Motor à Próxima Ação */}
        {nextTask ? (
          <div className="mt-4 p-5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="p-3 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] shrink-0 mt-0.5">
                {getCategoryIcon(nextTask.category)}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2F7F4] dark:bg-[#1B2521] text-[#29523F] dark:text-[#4F8E71]">
                    {getCategoryName(nextTask.category)}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(nextTask.status).classes}`}>
                    {getStatusBadge(nextTask.status).label}
                  </span>
                  <span className="text-xs text-[#7D8882] dark:text-[#788780] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {nextTask.scheduledTime} ({nextTask.estimatedMinutes > 0 ? `${nextTask.estimatedMinutes} min` : 'Em curso'})
                  </span>
                  {nextTask.passageReference && (
                    <span className="text-xs font-semibold text-[#162E23] dark:text-[#4F8E71] bg-[#E6F0EA] dark:bg-[#192D23] px-2 py-0.5 rounded">
                      {nextTask.passageReference}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#19211D] dark:text-[#F1F4F2] leading-snug">
                  {nextTask.title}
                </h3>

                <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] max-w-2xl leading-relaxed">
                  <strong className="text-[#C59B3F]">Por que devo fazer isso: </strong>
                  {nextTask.why}
                </p>

                {priorityResult.explanation && (
                  <p className="text-[11px] text-[#7D8882] dark:text-[#788780] italic">
                    Critério: {priorityResult.explanation}
                  </p>
                )}

                {/* Se em andamento, mostra timer decorrido */}
                {nextTask.status === 'em_andamento' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Tempo decorrido: {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações: [COMEÇAR] ou [CONCLUIR] */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
              {nextTask.status !== 'em_andamento' ? (
                <button
                  id="btn-next-action-start"
                  onClick={() => handleStartNext(nextTask.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#162E23] dark:bg-[#224535] text-white hover:bg-[#1F3F30] transition-all shadow-xs"
                >
                  <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>COMEÇAR</span>
                </button>
              ) : (
                <button
                  id="btn-next-action-conclude"
                  onClick={() => handleConcludeNext(nextTask.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2A6E4F] text-white hover:bg-[#21573E] transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONCLUIR</span>
                </button>
              )}

              <button
                onClick={() => onIgnoreTask(nextTask.id, 'Adiada pelo usuário para outro momento')}
                className="px-3 py-2 rounded-xl text-xs font-medium text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Ignorar ou adiar no momento"
              >
                Ignorar
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-center sm:text-left sm:flex sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-[#2A6E4F]" />
              <div>
                <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Todas as atividades de hoje foram cumpridas!
                </h4>
                <p className="text-xs text-[#7D8882]">
                  Você manteve a fidelidade. Permaneça em descanso e louvor na presença do Senhor.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('journey')}
              className="mt-3 sm:mt-0 text-xs font-semibold text-[#162E23] dark:text-[#4F8E71] underline"
            >
              Registrar Reflexão no Diário
            </button>
          </div>
        )}
      </section>

      {/* 8. PROGRESSO DO DIA (ROUTINE TRACKING SEM JULGAMENTO ESPIRITUAL) */}
      <section 
        id="section-progresso-do-dia" 
        className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#162E23] dark:bg-[#4F8E71]" />
              <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
                8. Progresso do Dia
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-lg sm:text-xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
                {priorityResult.completedCount}/{priorityResult.totalCount} atividades concluídas
              </span>
              <span className="text-base font-bold text-[#2A6E4F] dark:text-[#4F8E71]">
                {priorityResult.completionPercentage}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#C59B3F] font-semibold flex items-center gap-1">
              <span>{streakDays} dias de consistência</span>
            </span>
          </div>
        </div>

        {/* Barra de Progresso Suave */}
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#162E23] dark:bg-[#4F8E71] transition-all duration-500 rounded-full"
            style={{ width: `${priorityResult.completionPercentage}%` }}
          />
        </div>

        {/* Filosofia Explícita: Acompanhamento da rotina sem cobrança espiritual */}
        <p className="text-[11px] text-[#7D8882] dark:text-[#788780] leading-relaxed italic">
          * Acompanhamento da rotina diária — sem cobranças ou julgamento espiritual, apenas o teu ritmo com Deus.
        </p>
      </section>

      {/* 3. ROTINA DE HOJE (7 ESTADOS: planejada, próxima, em andamento, concluída, ignorada, atrasada, cancelada) */}
      <section id="section-rotina-de-hoje" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#162E23] dark:bg-[#4F8E71]" />
              <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
                3. Rotina de Hoje
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
              Atividades Programadas do Dia
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('routine')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FBFBFA] dark:bg-[#141C19] text-[#29523F] dark:text-[#4F8E71] border border-[#29523F]/20 hover:bg-[#E6F0EA] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ajustar Rotina & Objetivos</span>
            </button>
            <button
              id="btn-add-today-task"
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#D5E6DC] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Atividade</span>
            </button>
          </div>
        </div>

        {/* Lista de Atividades com Suporte a Todos os 7 Estados */}
        <div className="space-y-3">
          {priorityResult.evaluatedTasks.map((task) => {
            const isWhyExpanded = expandedWhyId === task.id;
            const badge = getStatusBadge(task.status);
            const isSelectorOpen = statusSelectorOpenId === task.id;

            return (
              <div 
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  task.status === 'concluida' 
                    ? 'bg-neutral-50/80 dark:bg-[#141C19]/50 border-[#E6E6DF] dark:border-[#24322C] opacity-80' 
                    : task.status === 'em_andamento'
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs'
                    : task.status === 'atrasada'
                    ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-xs'
                    : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] shadow-2xs hover:border-[#29523F]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Checkbox de Alternância Rápida */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      aria-label={`Marcar ${task.title}`}
                      className="mt-0.5 text-[#162E23] dark:text-[#4F8E71] shrink-0"
                    >
                      {task.status === 'concluida' ? (
                        <CheckCircle2 className="w-5 h-5 fill-[#162E23] text-white dark:fill-[#4F8E71] dark:text-[#0C1210]" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700 hover:text-[#29523F]" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
                          {getCategoryName(task.category)}
                        </span>

                        {/* Status Badge */}
                        <div className="relative inline-block">
                          <button
                            onClick={() => setStatusSelectorOpenId(isSelectorOpen ? null : task.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${badge.classes}`}
                            title="Clique para alterar o estado da atividade"
                          >
                            <span>{badge.label}</span>
                            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                          </button>

                          {/* Popover dos 7 Estados */}
                          {isSelectorOpen && (
                            <div className="absolute left-0 mt-1 w-36 bg-white dark:bg-[#1B2521] rounded-lg shadow-lg border border-[#E6E6DF] dark:border-[#24322C] py-1 z-20 text-xs animate-in fade-in duration-100">
                              {(['planejada', 'proxima', 'em_andamento', 'concluida', 'ignorada', 'atrasada', 'cancelada'] as ActivityStatus[]).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => {
                                    onSetTaskStatus(task.id, st);
                                    setStatusSelectorOpenId(null);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                                    task.status === st ? 'font-bold text-[#162E23] dark:text-[#4F8E71]' : 'text-[#4B554F] dark:text-[#B0BBB5]'
                                  }`}
                                >
                                  {getStatusBadge(st).label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="text-[11px] text-[#7D8882] dark:text-[#788780] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.scheduledTime} ({task.estimatedMinutes} min)
                        </span>

                        {task.passageReference && (
                          <span className="text-[11px] font-medium text-[#29523F] dark:text-[#4F8E71] bg-[#F2F7F4] dark:bg-[#1B2521] px-1.5 py-0.5 rounded">
                            {task.passageReference}
                          </span>
                        )}
                      </div>

                      <h3 className={`text-sm font-semibold ${
                        task.status === 'concluida' 
                          ? 'line-through text-[#7D8882] dark:text-[#788780]' 
                          : task.status === 'ignorada' || task.status === 'cancelada'
                          ? 'text-[#7D8882] dark:text-[#788780] line-through italic'
                          : 'text-[#19211D] dark:text-[#F1F4F2]'
                      }`}>
                        {task.title}
                      </h3>

                      {/* Exibição do Por que devo fazer */}
                      <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                        <span className="text-[#C59B3F] font-semibold">Propósito: </span>
                        {task.why}
                      </p>
                    </div>
                  </div>

                  {/* Ações contextuais rápidas */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {task.status !== 'concluida' && (
                      <>
                        {task.status !== 'em_andamento' ? (
                          <button
                            onClick={() => onStartTask(task.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#D5E6DC] transition-colors"
                          >
                            Começar
                          </button>
                        ) : (
                          <button
                            onClick={() => onCompleteTask(task.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2A6E4F] text-white hover:bg-[#21573E] transition-colors"
                          >
                            Concluir
                          </button>
                        )}
                      </>
                    )}

                    {task.category === 'bible' && (
                      <button
                        onClick={() => onNavigateToTab('bible')}
                        className="p-1.5 rounded-lg text-xs text-[#29523F] dark:text-[#4F8E71] hover:bg-[#E6F0EA] dark:hover:bg-[#192D23]"
                        title="Abrir Bíblia"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    )}
                    {task.category === 'prayer' && (
                      <button
                        onClick={onOpenPrayerTimer}
                        className="p-1.5 rounded-lg text-xs text-[#C59B3F] hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        title="Timer de Oração"
                      >
                        <HeartHandshake className="w-4 h-4" />
                      </button>
                    )}
                    {task.category === 'fasting' && (
                      <button
                        onClick={() => onNavigateToTab('fasting')}
                        className="p-1.5 rounded-lg text-xs text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40"
                        title="Acompanhar Jejum"
                      >
                        <Flame className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BLOCOS 4, 5, 6: PLANO DE LEITURA, ORAÇÕES PROGRAMADAS, JEJUM PROGRAMADO */}
      <section className="grid sm:grid-cols-3 gap-4 pt-2">
        
        {/* 4. PLANO DE LEITURA */}
        <div 
          id="section-plano-de-leitura"
          className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-[#7D8882] tracking-wider">
                4. Plano de Leitura
              </span>
              <BookOpen className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
            </div>
            
            <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] mt-2">
              {activePlan ? activePlan.title : 'Plano de Leitura Ativo'}
            </h4>

            {activeTodayPlanDay ? (
              <div className="mt-2 space-y-1 text-xs">
                <span className="font-semibold text-[#162E23] dark:text-[#4F8E71] block">
                  Dia {activePlan?.currentDay}: {activeTodayPlanDay.title}
                </span>
                <span className="text-[#7D8882] dark:text-[#788780] block">
                  Passagem: <strong>{activeTodayPlanDay.passageRef}</strong>
                </span>
                <p className="text-[#4B554F] dark:text-[#B0BBB5] text-[11px] mt-1 line-clamp-2">
                  {activeTodayPlanDay.devotionalPrompt}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#7D8882] mt-1">
                Dia {activePlan?.currentDay || 8} de {activePlan?.durationDays || 16}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('bible')}
              className="w-full py-2 px-3 rounded-lg bg-[#F2F7F4] dark:bg-[#1B2521] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E6F0EA] text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <span>Ler Hoje</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTab('plans')}
              className="py-2 px-3 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] hover:bg-neutral-50 text-xs font-medium"
              title="Ver todos os planos"
            >
              Planos
            </button>
          </div>
        </div>

        {/* 5. ORAÇÕES PROGRAMADAS */}
        <div 
          id="section-oracoes-programadas"
          className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-[#7D8882] tracking-wider">
                5. Orações Programadas
              </span>
              <HeartHandshake className="w-4 h-4 text-[#C59B3F]" />
            </div>

            <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] mt-2">
              Comunhão & Intercessão
            </h4>

            <div className="mt-2 space-y-1.5 text-xs text-[#4B554F] dark:text-[#B0BBB5]">
              <div className="flex items-center justify-between">
                <span>Meta diária:</span>
                <span className="font-semibold text-[#162E23] dark:text-[#4F8E71]">
                  {profile.dailyPrayerGoalMinutes} min/dia
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pedidos ativos:</span>
                <span className="font-semibold text-[#C59B3F]">
                  {prayerRequests.filter(p => !p.answered).length} motivos
                </span>
              </div>
              {prayerRequests.length > 0 && (
                <p className="text-[11px] text-[#7D8882] truncate mt-1">
                  Ex: {prayerRequests[0]?.title}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onOpenPrayerTimer}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[#C59B3F] hover:bg-amber-100/70 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>Orar Agora (Timer)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6. JEJUM PROGRAMADO */}
        <div 
          id="section-jejum-programado"
          className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-[#7D8882] tracking-wider">
                6. Jejum Programado
              </span>
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>

            <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] mt-2">
              {fastingPlan.active ? 'Jejum em Curso' : fastingPlan.title}
            </h4>

            <div className="mt-2 space-y-1 text-xs">
              <span className="text-[#7D8882] block">
                Duração planejada: <strong>{fastingPlan.targetHours} horas</strong> {fastingPlan.active ? '(em andamento)' : ''}
              </span>
              <p className="text-[#4B554F] dark:text-[#B0BBB5] text-[11px] line-clamp-2 mt-1">
                {fastingPlan.purpose}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('fasting')}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 hover:bg-orange-100/70 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>{fastingPlan.active ? 'Acompanhar Jejum' : 'Consagrar Jejum'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* 7. REFLEXÃO DO DIA */}
      <section 
        id="section-reflexao-do-dia"
        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#162E23] dark:bg-[#4F8E71]" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              7. Reflexão do Dia
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('journey')}
            className="text-xs font-semibold text-[#162E23] dark:text-[#4F8E71] hover:underline flex items-center gap-1"
          >
            <span>Ver Diário Completo</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
            O que Deus ministrou ao teu coração hoje?
          </h3>
          <p className="text-xs text-[#7D8882] dark:text-[#788780] mt-0.5">
            Registre reflexões, discernimentos ou orações de gratidão para consolidar tua caminhada.
          </p>
        </div>

        <form onSubmit={handleSaveDailyReflection} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Reflexão Espiritual / O que Deus falou:
            </label>
            <textarea
              rows={2}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Ex: Hoje compreendi mais profundamente que a graça de Deus me sustenta em minhas fraquezas..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#1B2521] text-xs sm:text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:ring-1 focus:ring-[#29523F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Gratidão de Hoje:
            </label>
            <input
              type="text"
              value={reflectionGratitude}
              onChange={(e) => setReflectionGratitude(e.target.value)}
              placeholder="Ex: Grato pela paz em meio aos prazos do trabalho..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#1B2521] text-xs sm:text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:ring-1 focus:ring-[#29523F]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {reflectionSaved ? (
              <span className="text-xs font-semibold text-[#2A6E4F] flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reflexão guardada no teu Diário Espiritual.</span>
              </span>
            ) : (
              <span className="text-[11px] text-[#7D8882]">
                Salva localmente com segurança no teu perfil
              </span>
            )}

            <button
              type="submit"
              disabled={!reflectionText.trim() && !reflectionGratitude.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] disabled:opacity-50 transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Registrar Reflexão</span>
            </button>
          </div>
        </form>
      </section>

      {/* Modal de Histórico de Palavras do Dia */}
      <WordOfDayHistoryModal
        isOpen={isWordHistoryOpen}
        onClose={() => setIsWordHistoryOpen(false)}
        history={localWordHistory}
        onToggleFavorite={handleToggleHistoryFavorite}
        onSaveReflection={handleSaveHistoryReflection}
        onOpenBible={(bookId, chapter) => {
          if (onOpenBibleAt) {
            onOpenBibleAt(bookId, chapter);
          } else {
            onNavigateToTab('bible');
          }
        }}
        onOpenPrayer={(ref, text) => {
          if (onOpenPrayerWithVerse) {
            onOpenPrayerWithVerse(`Oração sobre ${ref}`, text);
          } else {
            onOpenPrayerTimer();
          }
        }}
      />

    </div>
  );
};
