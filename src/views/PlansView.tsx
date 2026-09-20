import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  Plus,
  Play,
  Pause,
  Copy,
  Archive,
  ArchiveRestore,
  RefreshCw,
  Edit3,
  MoreVertical,
  Clock,
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';
import { ReadingPlan, PlanDay, PlanStatus, PlanFrequency } from '../types';
import { PlanDelayBanner } from '../components/plans/PlanDelayBanner';
import { ReorganizePlanModal } from '../components/plans/ReorganizePlanModal';
import { ReadingPlanCreatorModal } from '../components/plans/ReadingPlanCreatorModal';
import { PlanEditorModal } from '../components/plans/PlanEditorModal';

interface PlansViewProps {
  plans: ReadingPlan[];
  onTogglePlanDay: (planId: string, dayNumber: number) => void;
  onSetActivePlan: (planId: string) => void;
  onNavigateToBible: (bookId: string, chapter: number, versionId?: string) => void;
  onCreatePlan: (plan: ReadingPlan) => void;
  onUpdatePlan: (planId: string, updates: Partial<ReadingPlan>) => void;
  onDeletePlan: (planId: string) => void;
  onDuplicatePlan: (planId: string) => void;
  onPausePlan: (planId: string) => void;
  onResumePlan: (planId: string) => void;
  onArchivePlan: (planId: string) => void;
  onUnarchivePlan: (planId: string) => void;
  onContinueWhereLeftOff: (planId: string) => void;
  onReorganizePlan: (planId: string, newStartDate?: string, freq?: PlanFrequency, daysOfWeek?: number[]) => void;
  onAddDayToPlan: (planId: string, day: Omit<PlanDay, 'dayNumber'>) => void;
  onRemoveDayFromPlan: (planId: string, dayNumber: number) => void;
  onReorderPlanDays: (planId: string, days: PlanDay[]) => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  plans,
  onTogglePlanDay,
  onSetActivePlan,
  onNavigateToBible,
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
  onDuplicatePlan,
  onPausePlan,
  onResumePlan,
  onArchivePlan,
  onUnarchivePlan,
  onContinueWhereLeftOff,
  onReorganizePlan,
  onAddDayToPlan,
  onRemoveDayFromPlan,
  onReorderPlanDays
}) => {
  // Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.find(p => p.isActive)?.id || plans[0]?.id || ''
  );

  // Status Filter for plan switcher: 'all' | 'active' | 'paused' | 'archived'
  const [planFilter, setPlanFilter] = useState<'all' | 'active' | 'paused' | 'archived'>('all');

  // Days list filter: 'all' | 'pending' | 'delayed' | 'completed'
  const [daysFilter, setDaysFilter] = useState<'all' | 'pending' | 'delayed' | 'completed'>('all');

  // Modal States
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReorganizeOpen, setIsReorganizeOpen] = useState(false);
  const [activeMenuPlanId, setActiveMenuPlanId] = useState<string | null>(null);

  // Find currently selected plan (or fallback to active or first)
  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans.find(p => p.isActive) || plans[0];

  // Filtered plans list
  const filteredPlans = plans.filter(p => {
    if (planFilter === 'all') return p.status !== 'archived';
    if (planFilter === 'active') return p.status === 'active';
    if (planFilter === 'paused') return p.status === 'paused';
    if (planFilter === 'archived') return p.status === 'archived';
    return true;
  });

  if (!currentPlan && plans.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] w-16 h-16 mx-auto flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
          Nenhum plano de leitura encontrado
        </h3>
        <p className="text-sm text-[#7D8882] dark:text-[#788780] max-w-md mx-auto">
          Crie seu primeiro plano de leitura bíblica personalizado ou explore nossos modelos recomendados.
        </p>
        <button
          onClick={() => setIsCreatorOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#162E23] text-white hover:bg-[#1F3F30] shadow-xs"
        >
          <Plus className="w-4 h-4" /> Criar Plano de Leitura
        </button>

        {isCreatorOpen && (
          <ReadingPlanCreatorModal
            isOpen={isCreatorOpen}
            onClose={() => setIsCreatorOpen(false)}
            onPlanCreated={(newPlan) => {
              onCreatePlan(newPlan);
              setSelectedPlanId(newPlan.id);
            }}
          />
        )}
      </div>
    );
  }

  // Statistics for the current plan
  const completedDaysCount = currentPlan.days.filter(d => d.completed).length;
  const delayedDaysCount = currentPlan.days.filter(d => d.status === 'atrasada').length;
  const progressPercent = currentPlan.durationDays > 0 
    ? Math.round((completedDaysCount / currentPlan.durationDays) * 100) 
    : 0;

  // Filter days for the list
  const filteredDays = currentPlan.days.filter(day => {
    if (daysFilter === 'all') return true;
    if (daysFilter === 'pending') return !day.completed;
    if (daysFilter === 'delayed') return day.status === 'atrasada';
    if (daysFilter === 'completed') return day.completed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E6E6DF] dark:border-[#24322C]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#162E23] dark:text-[#4F8E71]" />
            Planos de Leitura Bíblica
          </h1>
          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-0.5">
            Organize sua jornada diária pelas Escrituras com planos personalizados e modelos bíblicos
          </p>
        </div>

        <button
          onClick={() => setIsCreatorOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] shadow-2xs self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Plano</span>
        </button>
      </div>

      {/* Delayed Readings Alert Banner */}
      {delayedDaysCount > 0 && currentPlan.status === 'active' && (
        <PlanDelayBanner
          plan={currentPlan}
          delayedCount={delayedDaysCount}
          onContinueWhereLeftOff={() => onContinueWhereLeftOff(currentPlan.id)}
          onOpenReorganizeModal={() => setIsReorganizeOpen(true)}
        />
      )}

      {/* Main Plan Card Overview */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-5">
        
        {/* Top bar with plan switch and status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
                {currentPlan.category.toUpperCase()}
              </span>

              {currentPlan.isActive ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
                  Plano Principal
                </span>
              ) : currentPlan.status === 'paused' ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                  Em Pausa
                </span>
              ) : currentPlan.status === 'archived' ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Arquivado
                </span>
              ) : null}

              {currentPlan.preferredVersion && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[#4B554F] dark:text-[#B0BBB5]">
                  Versão: {currentPlan.preferredVersion.toUpperCase()}
                </span>
              )}

              {currentPlan.dailyEstimatedMinutes && (
                <span className="text-[11px] text-[#7D8882] dark:text-[#788780] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {currentPlan.dailyEstimatedMinutes} min/dia
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
              {currentPlan.title}
            </h2>

            {currentPlan.description && (
              <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] max-w-2xl leading-relaxed">
                {currentPlan.description}
              </p>
            )}

            {currentPlan.objective && (
              <p className="text-xs text-[#162E23] dark:text-[#4F8E71] font-medium pt-0.5">
                🎯 <strong>Objetivo:</strong> {currentPlan.objective}
              </p>
            )}
          </div>

          {/* Plan Actions Menu */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!currentPlan.isActive && currentPlan.status !== 'archived' && (
              <button
                onClick={() => onSetActivePlan(currentPlan.id)}
                className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors"
              >
                Definir Ativo
              </button>
            )}

            {currentPlan.status === 'active' ? (
              <button
                onClick={() => onPausePlan(currentPlan.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Pausar plano temporariamente"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </button>
            ) : currentPlan.status === 'paused' ? (
              <button
                onClick={() => onResumePlan(currentPlan.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors"
                title="Retomar plano e reorganizar leituras restantes a partir de hoje"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Retomar</span>
              </button>
            ) : null}

            <button
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Personalizar leituras, adicionar dias ou editar informações"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Personalizar</span>
            </button>

            <button
              onClick={() => onDuplicatePlan(currentPlan.id)}
              className="p-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Duplicar este plano"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {currentPlan.status !== 'archived' ? (
              <button
                onClick={() => onArchivePlan(currentPlan.id)}
                className="p-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Arquivar plano"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onUnarchivePlan(currentPlan.id)}
                className="p-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] text-neutral-500 hover:text-green-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Desarquivar plano"
              >
                <ArchiveRestore className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Plan Switcher Pills */}
        <div className="space-y-2 pt-2 border-t border-[#E6E6DF] dark:border-[#24322C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'Todos os Planos' },
                { id: 'active', label: 'Ativos' },
                { id: 'paused', label: 'Em Pausa' },
                { id: 'archived', label: 'Arquivados' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setPlanFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    planFilter === f.id
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-[#19211D] dark:text-[#F1F4F2]'
                      : 'text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-[#7D8882] dark:text-[#788780]">
              {filteredPlans.length} {filteredPlans.length === 1 ? 'plano' : 'planos'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filteredPlans.map((p) => {
              const isSelected = selectedPlanId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#162E23] dark:bg-[#224535] text-white shadow-xs'
                      : 'bg-[#F2F7F4] dark:bg-[#1B2521] text-[#4B554F] dark:text-[#B0BBB5] hover:bg-[#E6E6DF]'
                  }`}
                >
                  {p.isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress & Stats Bar */}
        <div className="pt-2 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#7D8882] dark:text-[#788780]">
            <div className="flex items-center gap-3">
              <span>
                <strong>{completedDaysCount}</strong> de <strong>{currentPlan.durationDays}</strong> dias concluídos
              </span>
              {delayedDaysCount > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {delayedDaysCount} pendentes anteriores
                </span>
              )}
            </div>
            <span className="font-bold text-[#162E23] dark:text-[#4F8E71]">
              {progressPercent}% Concluído
            </span>
          </div>

          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#162E23] dark:bg-[#4F8E71] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Days & Daily Activities Calendar Journey */}
      <div className="space-y-4">
        
        {/* Section Header with Day Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#162E23] dark:text-[#4F8E71]" />
              Calendário & Atividades Diárias
            </h3>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Passagem de cada dia, reflexão e status de acompanhamento
            </p>
          </div>

          {/* Filter Days */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#141C19] p-1 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] self-start sm:self-auto">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'pending', label: 'Pendentes' },
              { id: 'delayed', label: 'Atrasados' },
              { id: 'completed', label: 'Concluídos' }
            ].map(df => (
              <button
                key={df.id}
                onClick={() => setDaysFilter(df.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  daysFilter === df.id
                    ? 'bg-[#162E23] text-white dark:bg-[#224535]'
                    : 'text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-2.5">
          {filteredDays.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-[#E6E6DF] dark:border-[#24322C] text-center text-xs text-[#7D8882] dark:text-[#788780]">
              Nenhum dia de leitura encontrado para o filtro selecionado.
            </div>
          ) : (
            filteredDays.map((day) => {
              const isDelayed = day.status === 'atrasada';
              const isToday = day.status === 'em_andamento';
              const isCompleted = day.completed;

              return (
                <div
                  key={day.dayNumber}
                  className={`p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-neutral-50/80 dark:bg-[#141C19]/40 border-[#E6E6DF] dark:border-[#24322C] opacity-80'
                      : isDelayed
                      ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-300/60 dark:border-amber-900/40 shadow-xs'
                      : isToday
                      ? 'bg-emerald-50/40 dark:bg-[#192D23]/20 border-[#162E23]/40 dark:border-[#4F8E71]/40 shadow-xs'
                      : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] shadow-2xs hover:border-[#162E23]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Left: Checkbox & Info */}
                    <div className="flex items-start gap-3 min-w-0">
                      
                      {/* Checkbox */}
                      <button
                        onClick={() => onTogglePlanDay(currentPlan.id, day.dayNumber)}
                        className="mt-1 text-[#162E23] dark:text-[#4F8E71] shrink-0 hover:scale-105 transition-transform"
                        aria-label={`Alternar conclusão do dia ${day.dayNumber}`}
                      >
                        {day.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-[#162E23] text-white dark:fill-[#4F8E71] dark:text-[#0C1210]" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700 hover:text-[#162E23]" />
                        )}
                      </button>

                      {/* Details */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-[#C59B3F]">
                            Dia {day.dayNumber}
                          </span>

                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
                            {day.passageRef}
                          </span>

                          {day.date && (
                            <span className="text-xs text-[#7D8882] dark:text-[#788780] flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {day.date}
                            </span>
                          )}

                          {day.estimatedMinutes && (
                            <span className="text-xs text-[#7D8882] dark:text-[#788780] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {day.estimatedMinutes} min
                            </span>
                          )}

                          {/* Status Badge */}
                          {isCompleted ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                              Concluído
                            </span>
                          ) : isDelayed ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              Atrasada
                            </span>
                          ) : isToday ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                              Hoje
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              Pendente
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-semibold ${
                          day.completed 
                            ? 'line-through text-[#7D8882] dark:text-[#788780]' 
                            : 'text-[#19211D] dark:text-[#F1F4F2]'
                        }`}>
                          {day.title}
                        </h4>

                        {day.devotionalPrompt && (
                          <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] italic">
                            Prompt de Reflexão: "{day.devotionalPrompt}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Direct Reading Button */}
                    <button
                      onClick={() => onNavigateToBible(day.bookId, day.chapter, currentPlan.preferredVersion)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E6F0EA] shrink-0 transition-colors shadow-2xs"
                      title="Abrir imediatamente este capítulo na Bíblia do Faithion"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ler Passagem</span>
                    </button>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      {isCreatorOpen && (
        <ReadingPlanCreatorModal
          isOpen={isCreatorOpen}
          onClose={() => setIsCreatorOpen(false)}
          onPlanCreated={(newPlan) => {
            onCreatePlan(newPlan);
            setSelectedPlanId(newPlan.id);
          }}
        />
      )}

      {isEditorOpen && (
        <PlanEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          plan={currentPlan}
          onUpdatePlan={onUpdatePlan}
          onAddDay={onAddDayToPlan}
          onRemoveDay={onRemoveDayFromPlan}
          onReorderDays={onReorderPlanDays}
          onDeletePlan={onDeletePlan}
        />
      )}

      {isReorganizeOpen && (
        <ReorganizePlanModal
          isOpen={isReorganizeOpen}
          onClose={() => setIsReorganizeOpen(false)}
          plan={currentPlan}
          onConfirmReorganize={(newStartDate, freq, daysOfWeek) => {
            onReorganizePlan(currentPlan.id, newStartDate, freq, daysOfWeek);
          }}
        />
      )}

    </div>
  );
};
