import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  BookOpen, 
  HeartHandshake, 
  Flame, 
  PenLine, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Play,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { DailyTask, TaskCategory } from '../../types';

interface GuidedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: DailyTask | null;
  explanation?: string;
  onStartTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onIgnoreTask: (taskId: string, reason?: string) => void;
  onNavigateToSection: (section: 'bible' | 'prayer' | 'fasting' | 'journey') => void;
}

export const GuidedActionModal: React.FC<GuidedActionModalProps> = ({
  isOpen,
  onClose,
  task,
  explanation,
  onStartTask,
  onCompleteTask,
  onIgnoreTask,
  onNavigateToSection
}) => {
  const [completedSuccess, setCompletedSuccess] = useState(false);

  if (!isOpen) return null;

  const getCategoryIcon = (category?: TaskCategory) => {
    switch (category) {
      case 'bible': return <BookOpen className="w-6 h-6 text-[#29523F] dark:text-[#4F8E71]" />;
      case 'prayer': return <HeartHandshake className="w-6 h-6 text-[#C59B3F]" />;
      case 'fasting': return <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
      case 'reflection': return <PenLine className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      default: return <Compass className="w-6 h-6 text-[#29523F] dark:text-[#4F8E71]" />;
    }
  };

  const getCategoryLabel = (category?: TaskCategory) => {
    switch (category) {
      case 'bible': return 'Leitura Bíblica';
      case 'prayer': return 'Oração & Comunhão';
      case 'fasting': return 'Consagração & Jejum';
      case 'reflection': return 'Reflexão Espiritual';
      case 'service': return 'Serviço & Generosidade';
      default: return 'Atividade Espiritual';
    }
  };

  const handleStart = () => {
    if (task) {
      onStartTask(task.id);
      if (task.category === 'bible') {
        onNavigateToSection('bible');
        onClose();
      } else if (task.category === 'prayer') {
        onNavigateToSection('prayer');
        onClose();
      } else if (task.category === 'fasting') {
        onNavigateToSection('fasting');
        onClose();
      } else if (task.category === 'reflection') {
        onNavigateToSection('journey');
        onClose();
      }
    }
  };

  const handleComplete = () => {
    if (task) {
      onCompleteTask(task.id);
      setCompletedSuccess(true);
      setTimeout(() => {
        setCompletedSuccess(false);
        onClose();
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FBFBFA] dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between bg-white dark:bg-[#1B2521]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#29523F] dark:text-[#4F8E71]">
              <Sparkles className="w-5 h-5 text-[#C59B3F]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
                O que devo fazer agora?
              </span>
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Teu Próximo Passo Espiritual
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#141C19]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {completedSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-[#2A6E4F] dark:text-[#4F8E71]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Atividade concluída.
              </h4>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                Fidelidade no pouco. O sistema calculará a próxima ação automaticamente.
              </p>
            </div>
          ) : task ? (
            <>
              {/* Context Explanation */}
              {explanation && (
                <div className="p-3 rounded-xl bg-[#E6F0EA]/70 dark:bg-[#192D23]/60 border border-[#29523F]/20 text-xs text-[#162E23] dark:text-[#4F8E71] flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#C59B3F] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold">Critério do Motor: </strong>
                    {explanation}
                  </p>
                </div>
              )}

              {/* Task Title & Status */}
              <div className="flex items-start gap-3.5">
                <div className="p-3.5 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 shrink-0">
                  {getCategoryIcon(task.category)}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#E6F0EA] dark:bg-[#192D23] text-[#29523F] dark:text-[#4F8E71]">
                      {getCategoryLabel(task.category)}
                    </span>
                    {task.status === 'atrasada' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Atrasada
                      </span>
                    )}
                    {task.status === 'em_andamento' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 animate-pulse">
                        Em andamento
                      </span>
                    )}
                    <span className="text-xs text-[#7D8882] dark:text-[#788780] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.scheduledTime} ({task.estimatedMinutes > 0 ? `${task.estimatedMinutes} min` : 'Em curso'})
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#19211D] dark:text-[#F1F4F2] leading-snug">
                    {task.title}
                  </h4>
                  {task.passageReference && (
                    <span className="inline-block text-xs font-semibold text-[#29523F] dark:text-[#4F8E71] bg-white dark:bg-[#1B2521] px-2 py-0.5 rounded border border-[#E6E6DF] dark:border-[#24322C]">
                      {task.passageReference}
                    </span>
                  )}
                </div>
              </div>

              {/* POR QUE DEVO FAZER ISSO? (Redução de Carga Mental) */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-1">
                <div className="text-xs uppercase tracking-wider font-bold text-[#C59B3F] flex items-center gap-1.5">
                  <span>Por que devo fazer isso?</span>
                </div>
                <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#D5D5CB] leading-relaxed">
                  {task.why}
                </p>
              </div>

              {/* Action Buttons: COMEÇAR & CONCLUIR */}
              <div className="pt-2 space-y-2.5">
                {task.status !== 'em_andamento' ? (
                  <button
                    id="btn-modal-start-action"
                    onClick={handleStart}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#162E23] text-white hover:bg-[#1F3F30] font-bold text-sm transition-all shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>COMEÇAR AGORA ({task.estimatedMinutes} min)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                    <p className="text-xs font-semibold text-[#2A6E4F] dark:text-[#4F8E71] mb-2">
                      Atividade já iniciada — continue dedicando este tempo
                    </p>
                    <button
                      id="btn-modal-conclude-running"
                      onClick={handleComplete}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#162E23] text-white hover:bg-[#1F3F30] font-bold text-sm transition-all shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>CONCLUIR ATIVIDADE</span>
                    </button>
                  </div>
                )}

                {task.status !== 'em_andamento' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="btn-modal-quick-complete"
                      onClick={handleComplete}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#29523F] dark:text-[#4F8E71] hover:bg-[#F2F7F4] font-semibold text-xs transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Já fiz, concluir</span>
                    </button>
                    <button
                      id="btn-modal-ignore"
                      onClick={() => {
                        onIgnoreTask(task.id, 'Adiada pelo usuário para outro momento');
                        onClose();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] dark:text-[#788780] hover:bg-neutral-100 font-medium text-xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Adiar / Ignorar hoje</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#E6F0EA] dark:bg-[#192D23] flex items-center justify-center text-[#29523F] dark:text-[#4F8E71]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Tudo em paz por hoje!
              </h4>
              <p className="text-xs text-[#7D8882] dark:text-[#788780] max-w-xs mx-auto">
                Todas as tarefas planejadas para o dia foram concluídas. Desfrute do descanso na presença de Deus.
              </p>
              <button
                onClick={onClose}
                className="py-2 px-6 rounded-lg bg-[#162E23] text-white text-xs font-semibold"
              >
                Amém, descansar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
