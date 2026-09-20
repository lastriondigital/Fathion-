import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sliders, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Edit3, 
  Target, 
  HelpCircle, 
  ShieldCheck, 
  HeartHandshake, 
  BookOpen, 
  Flame, 
  PenLine, 
  Moon, 
  Sun, 
  Compass,
  ArrowRight,
  TrendingUp,
  Check
} from 'lucide-react';
import { 
  RoutineActivity, 
  RoutineBlock, 
  SpiritualObjective, 
  ActivityExecutionLog, 
  RoutineAdaptationSuggestion, 
  PriorityLevel, 
  RoutineActivityType,
  SpiritualProfile 
} from '../types';
import { NewRoutineActivityModal } from '../components/routine/NewRoutineActivityModal';
import { EditRoutineActivityModal } from '../components/routine/EditRoutineActivityModal';
import { NewObjectiveModal } from '../components/routine/NewObjectiveModal';
import { LogExecutionModal } from '../components/routine/LogExecutionModal';

interface RoutineViewProps {
  profile: SpiritualProfile;
  routineActivities: RoutineActivity[];
  objectives: SpiritualObjective[];
  executionLogs: ActivityExecutionLog[];
  adaptationSuggestions: RoutineAdaptationSuggestion[];
  onAddRoutineActivity: (act: Omit<RoutineActivity, 'id' | 'order'>) => void;
  onUpdateRoutineActivity: (id: string, updates: Partial<RoutineActivity>) => void;
  onDeleteRoutineActivity: (id: string) => void;
  onToggleActivityActive: (id: string) => void;
  onReorderActivities: (block: RoutineBlock, orderedIds: string[]) => void;
  onAddObjective: (obj: Omit<SpiritualObjective, 'id' | 'createdAt'>) => void;
  onUpdateObjective: (id: string, updates: Partial<SpiritualObjective>) => void;
  onDeleteObjective: (id: string) => void;
  onLogExecution: (log: Omit<ActivityExecutionLog, 'id' | 'loggedAt'>) => void;
  onDeleteExecutionLog: (id: string) => void;
  onApplyAdaptation: (suggestionId: string) => void;
  onDismissAdaptation: (suggestionId: string) => void;
  onReorganizeRoutine: (suggestionId: string) => void;
  onNavigateToSettings?: () => void;
}

type RoutineSubTab = 'routine' | 'objectives' | 'adaptation' | 'history';

export const RoutineView: React.FC<RoutineViewProps> = ({
  profile,
  routineActivities,
  objectives,
  executionLogs,
  adaptationSuggestions,
  onAddRoutineActivity,
  onUpdateRoutineActivity,
  onDeleteRoutineActivity,
  onToggleActivityActive,
  onReorderActivities,
  onAddObjective,
  onUpdateObjective,
  onDeleteObjective,
  onLogExecution,
  onDeleteExecutionLog,
  onApplyAdaptation,
  onDismissAdaptation,
  onReorganizeRoutine,
  onNavigateToSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<RoutineSubTab>('routine');
  
  // Modals state
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);
  const [defaultNewBlock, setDefaultNewBlock] = useState<RoutineBlock>('morning');
  const [editingActivity, setEditingActivity] = useState<RoutineActivity | null>(null);
  const [isNewObjectiveOpen, setIsNewObjectiveOpen] = useState(false);
  const [isLogExecutionOpen, setIsLogExecutionOpen] = useState(false);
  const [selectedLogActivity, setSelectedLogActivity] = useState<RoutineActivity | null>(null);

  // Group routine activities by block
  const morningActs = routineActivities.filter(a => a.block === 'morning').sort((a, b) => a.order - b.order);
  const dayActs = routineActivities.filter(a => a.block === 'day').sort((a, b) => a.order - b.order);
  const nightActs = routineActivities.filter(a => a.block === 'night').sort((a, b) => a.order - b.order);
  const flexibleActs = routineActivities.filter(a => a.block === 'flexible').sort((a, b) => a.order - b.order);

  const pendingSuggestions = adaptationSuggestions.filter(s => s.status === 'pending');
  const activeObjectives = objectives.filter(o => o.status === 'ativo');

  // Total daily planned minutes
  const totalPlannedDailyMinutes = routineActivities
    .filter(a => a.isActive)
    .reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

  // Reordering handlers within a block
  const handleMoveActivity = (block: RoutineBlock, index: number, direction: 'up' | 'down') => {
    const list = routineActivities.filter(a => a.block === block).sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const itemA = list[index];
    const itemB = list[targetIndex];
    list[index] = itemB;
    list[targetIndex] = itemA;

    onReorderActivities(block, list.map(item => item.id));
  };

  const getActivityTypeIcon = (type: RoutineActivityType) => {
    switch (type) {
      case 'reading': return <BookOpen className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />;
      case 'prayer': return <HeartHandshake className="w-3.5 h-3.5 text-[#C59B3F]" />;
      case 'reflection': return <PenLine className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'silence': return <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-300" />;
      case 'gratitude': return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'memorization': return <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'service': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      default: return <Compass className="w-3.5 h-3.5 text-[#29523F]" />;
    }
  };

  const getActivityTypeName = (type: RoutineActivityType) => {
    switch (type) {
      case 'reading': return 'Leitura Bíblica';
      case 'prayer': return 'Oração';
      case 'reflection': return 'Reflexão / Exame';
      case 'silence': return 'Silêncio / Meditação';
      case 'gratitude': return 'Gratidão';
      case 'memorization': return 'Memorização';
      case 'service': return 'Serviço / Intercessão';
      default: return 'Prática Espiritual';
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'alta':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">Alta</span>;
      case 'media':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">Média</span>;
      case 'baixa':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Baixa</span>;
    }
  };

  const openAddActivityForBlock = (block: RoutineBlock) => {
    setDefaultNewBlock(block);
    setIsNewActivityOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* 1. Header Banner & Princípio Central */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#29523F] dark:bg-[#4F8E71]" />
              <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
                Perfil Espiritual & Rotina Pessoal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Minha Rotina de Caminhada
            </h1>
            <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1 font-serif-scripture italic">
              "Planejar com propósito • Executar com paz • Monitorar sem culpa • Adaptar com sabedoria"
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsLogExecutionOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] border border-[#29523F]/30 hover:bg-[#D5E6DC] transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Registrar Execução</span>
            </button>
            <button
              onClick={() => setIsNewActivityOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Prática</span>
            </button>
          </div>
        </div>

        {/* Resumo em Números */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="p-2.5 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
            <span className="text-[#7D8882] block">Práticas Ativas</span>
            <span className="font-bold text-sm text-[#19211D] dark:text-[#F1F4F2]">
              {routineActivities.filter(a => a.isActive).length} de {routineActivities.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
            <span className="text-[#7D8882] block">Tempo Diário Planejado</span>
            <span className="font-bold text-sm text-[#162E23] dark:text-[#4F8E71]">
              ~{totalPlannedDailyMinutes} min / dia
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
            <span className="text-[#7D8882] block">Objetivos em Curso</span>
            <span className="font-bold text-sm text-[#C59B3F]">
              {activeObjectives.length} ativos
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
            <span className="text-[#7D8882] block">Adaptações Pendentes</span>
            <span className="font-bold text-sm text-[#2A6E4F] flex items-center gap-1">
              <span>{pendingSuggestions.length} sugestão(ões)</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Sub-Tabs de Navegação */}
      <div className="flex items-center gap-2 border-b border-[#E6E6DF] dark:border-[#24322C] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('routine')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'routine'
              ? 'bg-[#162E23] text-white shadow-2xs dark:bg-[#224535]'
              : 'text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521] hover:text-[#19211D]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Rotina (Manhã / Dia / Noite)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {routineActivities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('objectives')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'objectives'
              ? 'bg-[#162E23] text-white shadow-2xs dark:bg-[#224535]'
              : 'text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521] hover:text-[#19211D]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Objetivos Espirituais</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {objectives.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('adaptation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'adaptation'
              ? 'bg-[#162E23] text-white shadow-2xs dark:bg-[#224535]'
              : 'text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521] hover:text-[#19211D]'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Adaptação Inteligente</span>
          {pendingSuggestions.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-bold">
              {pendingSuggestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'history'
              ? 'bg-[#162E23] text-white shadow-2xs dark:bg-[#224535]'
              : 'text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521] hover:text-[#19211D]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Histórico & Logs</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {executionLogs.length}
          </span>
        </button>
      </div>

      {/* ====================================================
          TAB 1: ROTINA PESSOAL (MANHÃ / DIA / NOITE / FLEXÍVEL)
         ==================================================== */}
      {activeSubTab === 'routine' && (
        <div className="space-y-6">
          
          {/* Helper Note */}
          <div className="p-3.5 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-[#C59B3F] shrink-0 mt-0.5" />
            <div className="text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
              <strong>Personalização completa:</strong> Ative ou pause práticas conforme a sua estação. Mova a ordem com as setas para refletir a sua manhã, tarde e noite reais. Cada prática possui um <em>"Por quê"</em> para nunca se tornar mero ativismo religioso.
            </div>
          </div>

          {/* Blocos Estruturados */}
          {[
            { 
              block: 'morning' as RoutineBlock, 
              title: 'Manhã', 
              icon: Sun, 
              desc: 'Consagração inicial, silêncio e leitura antes das demandas do dia',
              items: morningActs 
            },
            { 
              block: 'day' as RoutineBlock, 
              title: 'Durante o Dia', 
              icon: Compass, 
              desc: 'Pausas do meio-dia, intercessão e momentos breves de gratidão',
              items: dayActs 
            },
            { 
              block: 'night' as RoutineBlock, 
              title: 'Noite', 
              icon: Moon, 
              desc: 'Exame do dia, liberação de perdão e descanso seguro nas mãos de Deus',
              items: nightActs 
            },
            { 
              block: 'flexible' as RoutineBlock, 
              title: 'Flexível / Qualquer Hora', 
              icon: Clock, 
              desc: 'Memorização, podcasts edificantes e disciplinas ao longo do percurso',
              items: flexibleActs 
            }
          ].map(({ block, title, icon: BlockIcon, desc, items }) => (
            <section 
              key={block}
              className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] text-[#162E23] dark:text-[#4F8E71]">
                    <BlockIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                      {title}
                    </h3>
                    <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                      {desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openAddActivityForBlock(block)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E6F0EA] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {/* Lista de Atividades do Bloco */}
              {items.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-[#E6E6DF] dark:border-[#24322C] text-center text-xs text-[#7D8882]">
                  Nenhuma prática cadastrada para este momento. Clique em "+ Adicionar".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((act, idx) => (
                    <div
                      key={act.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        act.isActive
                          ? 'bg-[#FBFBFA] dark:bg-[#1B2521]/60 border-[#E6E6DF] dark:border-[#24322C] hover:border-[#29523F]/30'
                          : 'bg-neutral-100/60 dark:bg-neutral-900/30 border-dashed border-neutral-300 dark:border-neutral-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Reordenar setas */}
                          <div className="flex flex-col items-center gap-0.5 pt-0.5 text-neutral-400">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveActivity(block, idx, 'up')}
                              className="p-0.5 hover:text-[#19211D] dark:hover:text-white disabled:opacity-20"
                              title="Mover para cima"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === items.length - 1}
                              onClick={() => handleMoveActivity(block, idx, 'down')}
                              className="p-0.5 hover:text-[#19211D] dark:hover:text-white disabled:opacity-20"
                              title="Mover para baixo"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Conteúdo Principal */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]">
                                {getActivityTypeIcon(act.type)}
                                <span>{getActivityTypeName(act.type)}</span>
                              </span>

                              <span className="text-[11px] text-[#7D8882] flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" />
                                {act.suggestedTime} ({act.estimatedMinutes} min)
                              </span>

                              {getPriorityBadge(act.priority)}

                              {act.passageRef && (
                                <span className="text-[11px] font-medium text-[#29523F] dark:text-[#4F8E71] bg-white dark:bg-[#141C19] px-1.5 py-0.5 rounded border border-[#29523F]/20">
                                  {act.passageRef}
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                              {act.name}
                            </h4>

                            <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                              <span className="text-[#C59B3F] font-bold">Por que: </span>
                              {act.why}
                            </p>

                            {act.applicableDays && act.applicableDays.length < 7 && (
                              <div className="text-[10px] text-[#7D8882] pt-0.5">
                                Dias: {act.applicableDays.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ações da Atividade */}
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          {/* Toggle Ativo */}
                          <button
                            onClick={() => onToggleActivityActive(act.id)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                              act.isActive
                                ? 'bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                            title={act.isActive ? 'Clique para pausar esta prática' : 'Clique para reativar'}
                          >
                            {act.isActive ? 'Ativa' : 'Pausada'}
                          </button>

                          {/* Log Rápido */}
                          <button
                            onClick={() => {
                              setSelectedLogActivity(act);
                              setIsLogExecutionOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#7D8882] hover:text-[#162E23] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Registrar execução desta prática"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => setEditingActivity(act)}
                            className="p-1.5 rounded-lg text-[#7D8882] hover:text-[#162E23] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Editar prática"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* ====================================================
          TAB 2: OBJETIVOS ESPIRITUAIS
         ==================================================== */}
      {activeSubTab === 'objectives' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Meus Objetivos Espirituais
              </h3>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                O usuário define seus próprios objetivos com base em suas convicções e momento de vida
              </p>
            </div>

            <button
              onClick={() => setIsNewObjectiveOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Objetivo</span>
            </button>
          </div>

          {/* Grid de Objetivos */}
          <div className="grid md:grid-cols-2 gap-4">
            {objectives.map(obj => {
              return (
                <div
                  key={obj.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {getPriorityBadge(obj.priority)}
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D8882]">
                          {obj.frequency}
                        </span>
                      </div>

                      <select
                        value={obj.status}
                        onChange={(e) => onUpdateObjective(obj.id, { status: e.target.value as any })}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="pausado">Pausado</option>
                        <option value="concluido">Concluído</option>
                      </select>
                    </div>

                    <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                      {obj.title}
                    </h4>

                    {obj.targetDescription && (
                      <p className="text-xs text-[#162E23] dark:text-[#4F8E71] font-medium">
                        {obj.targetDescription}
                      </p>
                    )}

                    <div className="p-3 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-xs">
                      <span className="text-[#C59B3F] font-bold block mb-0.5">
                        Por que este objetivo é importante:
                      </span>
                      <p className="text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                        {obj.why}
                      </p>
                    </div>

                    {obj.deadline && (
                      <div className="text-[11px] text-[#7D8882] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Prazo: {obj.deadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Barra de Progresso Interativa */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#7D8882]">Progresso Atual</span>
                      <span className="text-[#162E23] dark:text-[#4F8E71] font-bold">
                        {obj.currentProgress}%
                      </span>
                    </div>

                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#162E23] dark:bg-[#4F8E71] transition-all rounded-full"
                        style={{ width: `${obj.currentProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateObjective(obj.id, { 
                            currentProgress: Math.max(0, obj.currentProgress - 10) 
                          })}
                          className="px-2 py-0.5 text-xs rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
                          title="Diminuir 10%"
                        >
                          -10%
                        </button>
                        <button
                          onClick={() => onUpdateObjective(obj.id, { 
                            currentProgress: Math.min(100, obj.currentProgress + 10) 
                          })}
                          className="px-2 py-0.5 text-xs rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
                          title="Aumentar 10%"
                        >
                          +10%
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja excluir o objetivo "${obj.title}"?`)) {
                            onDeleteObjective(obj.id);
                          }
                        }}
                        className="text-xs text-[#7D8882] hover:text-rose-600 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 3: ADAPTAÇÃO INTELIGENTE (PLANEJAR → ADAPTAR)
         ==================================================== */}
      {activeSubTab === 'adaptation' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-2xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#29523F] dark:text-[#4F8E71]">
              <Sparkles className="w-4 h-4 text-[#C59B3F]" />
              <span>Princípio Central: Planejar → Executar → Monitorar → Adaptar</span>
            </div>
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Adaptação sem Culpa, Focada na Realidade
            </h3>
            <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
              O objetivo de monitorar não é acumular cobranças religiosas ou julgamentos. Quando uma prática é constantemente pulada devido ao cansaço, à falta de tempo ou a imprevistos, o FAITHION sugere ajustes realistas: encurtar a duração, trocar o momento do dia ou pausar gentilmente.
            </p>
          </div>

          {/* Sugestões de Adaptação */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
              <span>Sugestões Geradas pelo Sistema</span>
            </h4>

            {adaptationSuggestions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#2A6E4F] mx-auto" />
                <h5 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Sua rotina está fluindo de forma harmoniosa!
                </h5>
                <p className="text-xs text-[#7D8882] max-w-md mx-auto">
                  Não há sobrecargas ou práticas com taxa recorrente de cancelamento no momento. Continue sua caminhada com serenidade.
                </p>
              </div>
            ) : (
              adaptationSuggestions.map(sug => {
                const isPending = sug.status === 'pending';
                return (
                  <div
                    key={sug.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPending
                        ? 'bg-white dark:bg-[#141C19] border-[#29523F]/30 shadow-xs'
                        : 'bg-neutral-50 dark:bg-neutral-900/40 border-[#E6E6DF] dark:border-[#24322C] opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            Padrão Notado
                          </span>
                          <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                            {sug.activityName}
                          </span>
                        </div>

                        <p className="text-xs text-[#7D8882] italic">
                          "{sug.detectedPattern}"
                        </p>

                        <div className="p-3 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-xs leading-relaxed text-[#4B554F] dark:text-[#B0BBB5]">
                          <strong className="text-[#29523F] dark:text-[#4F8E71] block mb-1">
                            Abordagem afetuosa:
                          </strong>
                          {sug.gentleTone}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-[#162E23] dark:text-[#4F8E71]">
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Sugestão: {sug.suggestedAction.title}</span>
                        </div>
                      </div>

                      {/* Botões de Ação Tríplice: Adaptar, Manter como está, Reorganizar rotina */}
                      {isPending ? (
                        <div className="flex flex-col gap-2 shrink-0 sm:w-44">
                          <button
                            onClick={() => onApplyAdaptation(sug.id)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors text-center shadow-xs"
                          >
                            Adaptar
                          </button>

                          <button
                            onClick={() => onDismissAdaptation(sug.id)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#4B554F] dark:text-[#B0BBB5] hover:bg-[#E6F0EA] transition-colors text-center"
                          >
                            Manter como está
                          </button>

                          <button
                            onClick={() => {
                              onReorganizeRoutine(sug.id);
                              setActiveSubTab('routine');
                            }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] hover:text-[#19211D] transition-colors text-center"
                          >
                            Reorganizar rotina
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 self-start">
                          <Check className="w-3.5 h-3.5" />
                          <span>{sug.status === 'applied' ? 'Adaptado com sucesso' : 'Respondido'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 4: HISTÓRICO E LOG DE EXECUÇÃO
         ==================================================== */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Histórico & Logs de Execução
              </h3>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                Registro transparente do que foi planejado versus executado, com motivos sinceros
              </p>
            </div>

            <button
              onClick={() => setIsLogExecutionOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Execução</span>
            </button>
          </div>

          {/* Lista de Logs */}
          <div className="space-y-3">
            {executionLogs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-center text-xs text-[#7D8882]">
                Nenhum log registrado ainda. Comece a registrar suas práticas para alimentar a adaptação inteligente.
              </div>
            ) : (
              executionLogs.map(log => {
                const getStatusBadge = () => {
                  switch (log.status) {
                    case 'concluido':
                      return (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Concluído</span>
                        </span>
                      );
                    case 'parcial':
                      return (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Parcial</span>
                        </span>
                      );
                    case 'pulado':
                      return (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Pulado</span>
                        </span>
                      );
                  }
                };

                const getReasonLabel = (r?: string) => {
                  switch (r) {
                    case 'cansaco': return 'Cansaço físico ou mental';
                    case 'falta_tempo': return 'Falta de tempo / Demandas';
                    case 'esquecimento': return 'Esquecimento / Distração';
                    case 'imprevisto': return 'Imprevisto inadiável';
                    default: return r || 'Outro';
                  }
                };

                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#7D8882] font-semibold">
                            {log.date}
                          </span>
                          {getStatusBadge()}
                          <span className="text-xs text-[#7D8882]">
                            ({log.actualMinutes} min realizados de {log.plannedMinutes} min planejados)
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-1">
                          {log.activityName}
                        </h4>
                      </div>

                      <button
                        onClick={() => onDeleteExecutionLog(log.id)}
                        className="text-[#7D8882] hover:text-rose-600 transition-colors p-1"
                        title="Excluir log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Motivo se houver */}
                    {log.reason && (
                      <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200/50">
                        <strong className="font-semibold">Fator sincero: </strong>
                        {getReasonLabel(log.reason)}
                        {log.reasonNotes && ` — "${log.reasonNotes}"`}
                      </div>
                    )}

                    {/* Reflexão Rápida */}
                    {log.quickReflection && (
                      <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] italic pt-1 border-t border-neutral-100 dark:border-neutral-800">
                        "{log.quickReflection}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <NewRoutineActivityModal
        isOpen={isNewActivityOpen}
        defaultBlock={defaultNewBlock}
        onClose={() => setIsNewActivityOpen(false)}
        onAddActivity={onAddRoutineActivity}
      />

      <EditRoutineActivityModal
        isOpen={editingActivity !== null}
        activity={editingActivity}
        onClose={() => setEditingActivity(null)}
        onSave={onUpdateRoutineActivity}
        onDelete={onDeleteRoutineActivity}
      />

      <NewObjectiveModal
        isOpen={isNewObjectiveOpen}
        onClose={() => setIsNewObjectiveOpen(false)}
        onAddObjective={onAddObjective}
      />

      <LogExecutionModal
        isOpen={isLogExecutionOpen}
        onClose={() => {
          setIsLogExecutionOpen(false);
          setSelectedLogActivity(null);
        }}
        activities={routineActivities}
        selectedActivity={selectedLogActivity}
        onLogExecution={onLogExecution}
      />

    </div>
  );
};
