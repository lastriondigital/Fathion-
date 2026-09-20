/**
 * FAITHION — Conceptual Data Models & Types
 * Principle: PLANEJAR → EXECUTAR → MONITORAR → ADAPTAR
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type TaskCategory = 'bible' | 'prayer' | 'fasting' | 'reflection' | 'service' | 'devotional';

export type PriorityLevel = 'alta' | 'media' | 'baixa';

export type ObjectiveCategory = 
  | 'bible' 
  | 'prayer' 
  | 'discipline' 
  | 'study' 
  | 'memorization' 
  | 'fasting' 
  | 'peace' 
  | 'custom';

export type ObjectiveFrequency = 'diaria' | 'semanal' | 'mensal' | 'dias_uteis';

export type ObjectiveStatus = 'ativo' | 'pausado' | 'concluido';

export type RoutineBlock = 'morning' | 'day' | 'night' | 'flexible';

export type RoutineActivityType = 
  | 'reading' 
  | 'prayer' 
  | 'reflection' 
  | 'silence' 
  | 'gratitude' 
  | 'memorization' 
  | 'service' 
  | 'other';

export type ExecutionStatus = 'concluido' | 'parcial' | 'pulado';

export type SkipReason = 'cansaco' | 'falta_tempo' | 'esquecimento' | 'imprevisto' | 'outro';

export type BibleExperienceLevel = 'iniciante' | 'intermediario' | 'avancado' | 'estudioso';
export type ReadingFrequency = 'diaria' | 'vezes_semana' | 'raramente' | 'recomecando';
export type PrayerFrequency = 'multiplas_dia' | 'uma_dia' | 'esporadica' | 'momentos_dificeis';
export type ReadingPreference = 'capitulo_a_capitulo' | 'devocionais' | 'versiculo_a_versiculo' | 'cronologico';
export type PrayerPreference = 'silenciosa' | 'caderno_guiado' | 'espontanea' | 'salmos_biblica';
export type RoutinePreference = 'manha_focada' | 'micro_momentos' | 'noite_reflexiva' | 'flexivel';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  joinedDate: string;
}

export interface SpiritualProfile {
  name: string;
  spiritualFocus: string; // Ex: "Intimidade com Deus e Discernimento"
  lifeSeason: string; // Ex: "Busca por Sabedoria e Paz"
  dailyPrayerGoalMinutes: number;
  dailyBibleChaptersGoal: number;
  weeklyFastingGoalDays: number;
  remindersEnabled: boolean;
  preferredBibleVersion: 'NVI' | 'Almeida' | 'ARA';

  // Configurações Pessoais de Rotina e Foco
  wakeUpTime: string; // "06:30"
  bedTime: string; // "23:00"
  availableTimeSlots: string[]; // ["Manhã cedo (06:00 - 07:30)", "Almoço (12:00 - 13:00)", "Noite (21:30 - 22:30)"]
  availableDays: string[]; // ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
  preferredPracticeDurationMinutes: number; // 15, 30, 45
  bibleExperienceLevel: BibleExperienceLevel;
  readingFrequency: ReadingFrequency;
  prayerFrequency: PrayerFrequency;
  topicsOfInterest: string[]; // Temas escolhidos pelo usuário
  readingPreference: ReadingPreference;
  prayerPreference: PrayerPreference;
  routinePreference: RoutinePreference;
}

export interface SpiritualObjective {
  id: string;
  title: string;
  category: ObjectiveCategory;
  priority: PriorityLevel;
  deadline?: string;
  frequency: ObjectiveFrequency;
  status: ObjectiveStatus;
  currentProgress: number; // 0 a 100
  targetDescription?: string;
  why: string; // Por que este objetivo é importante para o usuário (intenção/propósito)
  createdAt: string;
}

export interface RoutineActivity {
  id: string;
  name: string;
  type: RoutineActivityType;
  block: RoutineBlock;
  suggestedTime: string; // "06:30", "12:30", "21:30"
  estimatedMinutes: number;
  priority: PriorityLevel;
  why: string; // Por que fazer essa prática (intenção clara)
  isActive: boolean;
  order: number;
  applicableDays?: string[];
  passageRef?: string;
}

export interface ActivityExecutionLog {
  id: string;
  date: string; // YYYY-MM-DD
  activityId: string;
  activityName: string;
  block: RoutineBlock;
  plannedMinutes: number;
  actualMinutes: number;
  status: ExecutionStatus;
  reason?: SkipReason;
  reasonNotes?: string;
  quickReflection?: string;
  loggedAt: string;
}

export interface RoutineAdaptationSuggestion {
  id: string;
  activityId: string;
  activityName: string;
  detectedPattern: string;
  gentleTone: string;
  suggestedAction: {
    type: 'reduce_duration' | 'change_block' | 'change_time' | 'pause_temporarily';
    title: string;
    newDuration?: number;
    newBlock?: RoutineBlock;
    newTime?: string;
  };
  status: 'pending' | 'applied' | 'dismissed' | 'reorganized';
  createdAt: string;
}

export interface SpiritualGoal {
  id: string;
  title: string;
  category: TaskCategory;
  targetValue: number;
  currentValue: number;
  unit: string; // Ex: "minutos/dia", "capítulos/semana", "dias/mês"
  why: string; // Propósito espiritual
  deadline?: string;
  completed: boolean;
}

export type ActivityStatus = 
  | 'planejada'
  | 'proxima'
  | 'em_andamento'
  | 'concluida'
  | 'ignorada'
  | 'atrasada'
  | 'cancelada';

export interface DailyTask {
  id: string;
  title: string;
  category: TaskCategory;
  timeOfDay: TimeOfDay;
  scheduledTime: string; // "07:00", "12:30", "20:00"
  estimatedMinutes: number;
  why: string; // "Por que devo fazer isso?" - Reduz a carga mental e dá propósito
  passageReference?: string; // Ex: "Romanos 8:1-17"
  status: ActivityStatus;
  priority?: PriorityLevel;
  dependencies?: string[]; // IDs de tarefas que devem ser concluídas antes
  startedAt?: string;
  completed: boolean;
  completedAt?: string;
  actualMinutes?: number;
  order: number;
  notes?: string;
  planId?: string;
}

export type InternalNotificationType = 
  | 'lembrete'
  | 'atividade_atrasada'
  | 'proxima_atividade'
  | 'plano'
  | 'oracao'
  | 'jejum';

export interface InternalNotification {
  id: string;
  type: InternalNotificationType;
  title: string;
  message: string;
  targetTab?: string;
  relatedTaskId?: string;
  createdAt: string;
  read: boolean;
  priority?: PriorityLevel;
}

export type PlanStatus = 'active' | 'paused' | 'completed' | 'archived';

export type PlanMethod = 
  | 'sequencia_biblica' 
  | 'livros_especificos' 
  | 'capitulos_especificos' 
  | 'passagens_especificas' 
  | 'temas' 
  | 'personalizado';

export type PlanFrequency = 'diaria' | 'dias_uteis' | 'dias_especificos';

export interface PlanDay {
  dayNumber: number;
  title: string;
  passageRef: string;
  bookId: string;
  chapter: number;
  verseRange?: string;
  devotionalPrompt: string;
  completed: boolean;
  completedAt?: string;
  date?: string; // Data agendada (YYYY-MM-DD)
  estimatedMinutes?: number; // Duração estimada diária
  status?: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  objective?: string; // Objetivo espiritual
  category: 'foundations' | 'wisdom' | 'peace' | 'gospels' | 'epistles' | 'custom' | 'thematic' | 'canonical';
  durationDays: number;
  currentDay: number;
  isActive: boolean;
  status?: PlanStatus; // active | paused | completed | archived
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
  startDate?: string; // Data inicial (YYYY-MM-DD)
  frequency?: PlanFrequency; // diária | dias úteis | dias específicos
  selectedDaysOfWeek?: number[]; // [0..6] (0=Domingo, 1=Segunda, 2=Terça, etc.)
  dailyEstimatedMinutes?: number; // Tempo diário em minutos
  preferredVersion?: string; // Versão preferida: ARC, JFA, KJV, WEB, RVR, VUL
  method?: PlanMethod; // Método de estruturação
  selectedBooks?: string[]; // Livros selecionados
  selectedChaptersRange?: { bookId: string; startChapter: number; endChapter: number };
  specificPassages?: string[]; // Passagens específicas
  selectedTheme?: string;
  days: PlanDay[];
  isTemplate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PrayerCategory = 'family' | 'health' | 'spiritual' | 'gratitude' | 'calling' | 'church' | 'intercession';

export interface PrayerRequest {
  id: string;
  title: string;
  category: PrayerCategory;
  description: string;
  scriptureReferences?: string[];
  createdAt: string;
  answered: boolean;
  answeredAt?: string;
  answeredTestimony?: string;
  timesPrayed: number;
  lastPrayedAt?: string;
  isUrgent?: boolean;
}

export type FastingType = 'total' | 'partial' | 'daniel' | 'water_only' | 'digital';

export interface FastingPlan {
  id: string;
  title: string;
  type: FastingType;
  purpose: string; // Propósito espiritual central
  scriptureVerse: string;
  startTime: string; // ISO String
  targetHours: number;
  active: boolean;
  completed: boolean;
  completedAt?: string;
  reflectionsDuringFast?: string;
}

export interface Reflection {
  id: string;
  date: string; // YYYY-MM-DD
  scriptureRef?: string;
  whatGodSpoke: string;
  practicalApplication: string;
  gratitudeNotes: string[];
  moodRating?: 1 | 2 | 3 | 4 | 5; // Estado de espírito
  createdAt: string;
}

export interface DailyConsistency {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  totalTasks: number;
  prayerMinutes: number;
  bibleRead: boolean;
  fastingLogged: boolean;
  score: number; // 0 a 100
}

export interface VerseOfDay {
  reference: string;
  text: string;
  version: string;
  whyMeditate: string;
  practicalApplication: string;
  bookId: string;
  chapter: number;
}

export interface BibleVersion {
  id: string;
  name: string; // nome
  abbreviation: string; // abreviação
  language: string; // idioma
  origin: string; // origem
  license: string; // licença
  available: boolean; // disponibilidade
  order: number; // ordem
  description?: string;
}

export type HighlightColor = 'gold' | 'emerald' | 'azure' | 'rose';

export interface BibleHighlight {
  id: string;
  verseKey: string; // ex: "romanos-8-1"
  bookId: string;
  chapter: number;
  verseNumber: number;
  color: HighlightColor;
  versionId: string;
  createdAt: string;
}

export interface BibleFavorite {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  verseText: string;
  versionId: string;
  createdAt: string;
}

export interface BibleNote {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verseNumber?: number;
  noteText: string;
  versionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BibleReadingSession {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  versionId: string;
  versionAbbr: string;
  passageRef: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  completedAt: string;
  durationMinutes: number;
  relatedPlanId?: string;
  relatedPlanTitle?: string;
  relatedPlanDayNumber?: number;
}

export interface BibleLastRead {
  bookId: string;
  chapter: number;
  verseNumber?: number;
  versionId: string;
  timestamp: string;
}

export type BibleFontSize = 'small' | 'normal' | 'large' | 'xlarge';
export type BibleFontFamily = 'serif' | 'sans';

export interface BibleVerse {
  number: number;
  text: string;
  isHighlighted?: boolean;
  note?: string;
}

export interface BibleChapter {
  chapterNumber: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  testament: 'AT' | 'NT';
  category: 'Pentateuco' | 'Históricos' | 'Poéticos' | 'Profetas' | 'Evangelhos' | 'Cartas' | 'Revelação';
  chaptersCount: number;
  chapters: Record<number, BibleVerse[]>;
}

export interface SupabaseSyncMetadata {
  lastSyncedAt: string | null;
  syncStatus: 'synced' | 'local_only' | 'syncing' | 'error';
  pendingMutationsCount: number;
}

export type NavTabId = 'today' | 'routine' | 'bible' | 'plans' | 'prayer' | 'fasting' | 'journey' | 'stats' | 'settings';

