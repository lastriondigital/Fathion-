import React from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  HeartHandshake, 
  Flame, 
  Compass, 
  GraduationCap, 
  Layers, 
  CalendarDays, 
  Church, 
  BrainCircuit, 
  Sparkles, 
  Check, 
  Trash2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { JourneyEntry, PracticeCategory } from '../../types';

interface JourneyTimelineCardProps {
  entry: JourneyEntry;
  onNavigateToBible?: (ref?: string) => void;
  onDeletePractice?: (id: string) => void;
}

export const JourneyTimelineCard: React.FC<JourneyTimelineCardProps> = ({
  entry,
  onNavigateToBible,
  onDeletePractice
}) => {
  const getIcon = (type: PracticeCategory) => {
    switch (type) {
      case 'bible':
        return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'prayer':
        return <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'fasting':
        return <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'reflection':
        return <Compass className="w-4 h-4 text-amber-700 dark:text-amber-300" />;
      case 'study':
        return <GraduationCap className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'plan':
        return <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'activity':
        return <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'event':
        return <Church className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'memorization':
        return <BrainCircuit className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'custom':
      default:
        return <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    }
  };

  const getBadgeClass = (variant?: string) => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'sky':
        return 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-neutral-100 dark:bg-[#1B2621] text-[#4B554F] dark:text-[#B0BBB5] border-[#E6E6DF] dark:border-[#24322C]';
    }
  };

  const timeline = entry.timelineData || {
    activity: entry.title,
    passage: entry.passageRef || entry.scriptureRef,
    prayer: entry.prayerText,
    reflection: entry.reflectionText || (entry.reflection ? entry.reflection.whatLearned : undefined),
    result: entry.resultNotes || entry.statusBadge?.label || 'Concluído'
  };

  // Formatação de data amigável
  const dateObj = new Date(entry.timestamp || (entry.date ? `${entry.date}T12:00:00` : ''));
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    : entry.date;
  
  const formattedTime = entry.timestamp && entry.timestamp.includes('T')
    ? entry.timestamp.split('T')[1].slice(0, 5)
    : undefined;

  const isCustomPractice = entry.id.startsWith('journey-prac-');
  const customPracticeId = isCustomPractice ? entry.id.replace('journey-prac-', '') : null;

  return (
    <div 
      id={`timeline-card-${entry.id}`}
      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs hover:shadow-xs transition-shadow space-y-3.5"
    >
      {/* Cabeçalho: Data e Status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7D8882] dark:text-[#788780]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
          {formattedTime && (
            <span className="flex items-center gap-1">
              • <Clock className="w-3 h-3 inline" /> {formattedTime}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {entry.statusBadge && (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeClass(entry.statusBadge.variant)}`}>
              {entry.statusBadge.label}
            </span>
          )}
          {isCustomPractice && onDeletePractice && customPracticeId && (
            <button
              onClick={() => onDeletePractice(customPracticeId)}
              title="Excluir este registro"
              className="p-1 rounded-lg text-[#7D8882] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SEQUÊNCIA DA TIMELINE: Data → atividade → passagem → oração → reflexão → resultado */}
      <div className="relative pl-4 sm:pl-5 border-l-2 border-[#29523F]/30 dark:border-[#4F8E71]/40 space-y-3 ml-1 text-sm">
        
        {/* 1. ATIVIDADE */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#7D8882] dark:text-[#788780] tracking-wider mb-0.5">
            Atividade
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-neutral-100 dark:bg-[#1B2621]">
              {getIcon(entry.type)}
            </div>
            <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] text-sm sm:text-base">
              {timeline.activity}
            </span>
          </div>
          {entry.subtitle && (
            <p className="text-xs text-[#7D8882] dark:text-[#788780] mt-0.5 ml-7">
              {entry.subtitle}
            </p>
          )}
        </div>

        {/* 2. PASSAGEM (se houver) */}
        {timeline.passage && (
          <div>
            <div className="text-[10px] uppercase font-bold text-[#29523F] dark:text-[#4F8E71] tracking-wider mb-0.5">
              Passagem Bíblica
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToBible?.(timeline.passage)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-[#29523F] dark:text-[#4F8E71] hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{timeline.passage}</span>
                <ChevronRight className="w-3 h-3 text-[#29523F]/60" />
              </button>
            </div>
          </div>
        )}

        {/* 3. ORAÇÃO (se houver) */}
        {timeline.prayer && (
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider mb-0.5">
              Oração & Clamor
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-[#4B554F] dark:text-[#D1DDD6] italic flex items-start gap-2">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>"{timeline.prayer}"</span>
            </div>
          </div>
        )}

        {/* 4. REFLEXÃO (se houver) */}
        {timeline.reflection && (
          <div>
            <div className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-400 tracking-wider mb-0.5">
              Reflexão & Diário
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40 text-xs text-[#19211D] dark:text-[#E2E8E5] leading-relaxed">
              {timeline.reflection}
            </div>
          </div>
        )}

        {/* 5. RESULTADO */}
        {timeline.result && (
          <div>
            <div className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wider mb-0.5">
              Resultado Concreto
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#29523F]/10 dark:bg-[#4F8E71]/20 border border-[#29523F]/20 dark:border-[#4F8E71]/30 text-xs font-semibold text-[#1F3E30] dark:text-[#67B593]">
              <Check className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
              <span>{timeline.result}</span>
            </div>
          </div>
        )}

      </div>

      {/* Detalhes extras se existirem */}
      {entry.details && entry.details.length > 0 && (
        <div className="pt-2 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center gap-4 text-xs text-[#7D8882] dark:text-[#788780] flex-wrap">
          {entry.details.map((d, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="font-medium text-[#4B554F] dark:text-[#B0BBB5]">{d.label}:</span>
              <span>{d.value}</span>
            </span>
          ))}
        </div>
      )}

    </div>
  );
};
