import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  BookOpen, 
  ShieldAlert, 
  Play, 
  Pause, 
  XCircle, 
  Calendar, 
  Heart, 
  FileText, 
  Plus, 
  Filter, 
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { FastingPlan, FastingType, FastingStatus, PrayerRequest } from '../types';
import { FastingModal } from '../components/fasting/FastingModal';

interface FastingViewProps {
  fastingPlan: FastingPlan;
  fastingRecords?: FastingPlan[];
  prayers?: PrayerRequest[];
  onStartFasting: (purpose: string, targetHours: number, type: FastingType) => void;
  onStopFasting: (reflections?: string) => void;
  onCreateFasting?: (data: any) => void;
  onStartFastingRecord?: (id: string) => void;
  onCompleteFastingRecord?: (id: string, reflections?: string) => void;
  onInterruptFastingRecord?: (id: string, reason?: string) => void;
  onCancelFastingRecord?: (id: string, reason?: string) => void;
  onDeleteFastingRecord?: (id: string) => void;
  onNavigateToBible?: (passageRef: string) => void;
  onOpenReflection?: (contextTitle: string) => void;
}

const STATUS_FILTERS: { id: FastingStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'em_andamento', label: 'Em Andamento' },
  { id: 'planejado', label: 'Planejados' },
  { id: 'concluido', label: 'Concluídos' },
  { id: 'interrompido', label: 'Interrompidos' },
  { id: 'cancelado', label: 'Cancelados' },
];

export const FastingView: React.FC<FastingViewProps> = ({
  fastingPlan,
  fastingRecords = [],
  prayers = [],
  onStartFasting,
  onStopFasting,
  onCreateFasting,
  onStartFastingRecord,
  onCompleteFastingRecord,
  onInterruptFastingRecord,
  onCancelFastingRecord,
  onDeleteFastingRecord,
  onNavigateToBible,
  onOpenReflection
}) => {
  const [activeTabFilter, setActiveTabFilter] = useState<FastingStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFasting, setEditingFasting] = useState<FastingPlan | null>(null);

  // Dialogs de Ação (Concluir / Interromper)
  const [actionRecordId, setActionRecordId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'concluir' | 'interromper' | 'cancelar' | null>(null);
  const [actionInput, setActionInput] = useState('');

  // Localiza o jejum em andamento atual
  const currentRunningFast = fastingRecords.find(r => r.status === 'em_andamento') || (fastingPlan.active ? fastingPlan : null);

  // Cronômetro em tempo real
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!currentRunningFast) {
      setElapsedSeconds(0);
      return;
    }

    const calcElapsed = () => {
      const startTime = currentRunningFast.startTime;
      let startEpoch = new Date(startTime).getTime();
      if (isNaN(startEpoch)) {
        // Se for formato simples HH:mm
        const todayDate = currentRunningFast.date || new Date().toISOString().split('T')[0];
        startEpoch = new Date(`${todayDate}T${startTime}:00`).getTime();
      }
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((now - startEpoch) / 1000));
      setElapsedSeconds(diff);
    };

    calcElapsed();
    const timer = setInterval(calcElapsed, 1000);
    return () => clearInterval(timer);
  }, [currentRunningFast]);

  const targetSeconds = currentRunningFast ? (currentRunningFast.targetHours || 12) * 3600 : 12 * 3600;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));
  const remainingSeconds = Math.max(0, targetSeconds - elapsedSeconds);

  const formatHoursMinutesSeconds = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const getStatusBadge = (st: FastingStatus) => {
    switch (st) {
      case 'em_andamento':
        return { label: 'Em Andamento', bg: 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300' };
      case 'concluido':
        return { label: 'Concluído', bg: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300' };
      case 'interrompido':
        return { label: 'Interrompido', bg: 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300' };
      case 'cancelado':
        return { label: 'Cancelado', bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300' };
      case 'planejado':
      default:
        return { label: 'Planejado', bg: 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300' };
    }
  };

  const getTypeLabel = (type: FastingType) => {
    switch (type) {
      case 'water_only': return 'Apenas Água';
      case 'partial': return 'Jejum Parcial';
      case 'daniel': return 'Jejum de Daniel';
      case 'total': return 'Jejum Total';
      case 'digital': return 'Jejum Digital';
      default: return 'Personalizado';
    }
  };

  const filteredRecords = fastingRecords.filter(r => {
    if (activeTabFilter === 'all') return true;
    return r.status === activeTabFilter;
  });

  const handleConfirmAction = () => {
    if (!actionRecordId || !actionType) return;

    if (actionType === 'concluir') {
      if (onCompleteFastingRecord) {
        onCompleteFastingRecord(actionRecordId, actionInput.trim() || undefined);
      } else {
        onStopFasting(actionInput.trim() || undefined);
      }
    } else if (actionType === 'interromper') {
      if (onInterruptFastingRecord) {
        onInterruptFastingRecord(actionRecordId, actionInput.trim() || 'Interrompido pelo usuário');
      }
    } else if (actionType === 'cancelar') {
      if (onCancelFastingRecord) {
        onCancelFastingRecord(actionRecordId, actionInput.trim() || 'Cancelado antes de iniciar');
      }
    }

    setActionRecordId(null);
    setActionType(null);
    setActionInput('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Módulo de Jejum & Consagração
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
            Jejum com Propósito Espiritual
          </h2>
          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
            "Não só de pão viverá o homem, mas de toda a palavra que procede da boca de Deus." — Mateus 4:4
          </p>
        </div>

        <button
          id="new-fasting-btn"
          onClick={() => {
            setEditingFasting(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#162E23] dark:bg-[#29523F] text-white hover:bg-[#1F3F30] text-xs font-semibold transition-all shadow-xs self-start sm:self-center"
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>Consagrar Jejum</span>
        </button>
      </div>

      {/* AVISO MÉDICO OBRIGATÓRIO */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-300">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-amber-900 dark:text-amber-200">Aviso Espiritual & Saúde:</strong> O jejum no FAITHION é uma disciplina de caráter exclusivamente espiritual e devocional. O aplicativo não fornece recomendações médicas, nutricionais ou diagnósticos clínicos. Respeite sempre a sua saúde e consulte um médico antes de práticas alimentares restritivas.
        </div>
      </div>

      {/* PAINEL ATIVO: CRONÔMETRO DO JEJUM EM ANDAMENTO */}
      {currentRunningFast && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141C19] border border-[#29523F]/30 shadow-md space-y-6 text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
            <Flame className="w-4 h-4 fill-[#C59B3F] text-[#C59B3F] animate-pulse" />
            <span>Jejum em Andamento • Cronômetro em Tempo Real</span>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-mono font-bold text-[#162E23] dark:text-[#4F8E71] tracking-tight">
              {formatHoursMinutesSeconds(elapsedSeconds)}
            </div>
            <p className="text-xs text-[#7D8882] dark:text-[#8E9B93]">
              Meta: {currentRunningFast.targetHours} horas ({progressPercent}% concluído) • Restante: {formatHoursMinutesSeconds(remainingSeconds)}
            </p>
          </div>

          {/* Barra de Progresso */}
          <div className="max-w-md mx-auto w-full bg-neutral-100 dark:bg-[#24322C] h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#162E23] dark:bg-[#4F8E71] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Propósito e Conexões (Oração / Passagem) */}
          <div className="max-w-lg mx-auto p-4 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15 text-left space-y-2.5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#29523F] dark:text-[#4F8E71]">
                Propósito Espiritual Central:
              </div>
              <p className="text-sm font-semibold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
                {currentRunningFast.purpose}
              </p>
            </div>

            {/* Informações detalhadas */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#7D8882] pt-2 border-t border-neutral-200/60 dark:border-[#24322C]">
              <div>
                <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">Tipo:</span> {getTypeLabel(currentRunningFast.type)}
              </div>
              <div>
                <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">Data:</span> {currentRunningFast.date}
              </div>
            </div>

            {/* Oração vinculada */}
            {currentRunningFast.relatedPrayerTitle && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 pt-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Oração: {currentRunningFast.relatedPrayerTitle}</span>
              </div>
            )}

            {/* Passagem vinculada */}
            {currentRunningFast.relatedPassage && (
              <div className="flex items-center justify-between text-xs text-[#29523F] dark:text-[#4F8E71] pt-1">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Passagem: {currentRunningFast.relatedPassage}</span>
                </div>
                {onNavigateToBible && (
                  <button
                    onClick={() => onNavigateToBible(currentRunningFast.relatedPassage!)}
                    className="flex items-center gap-1 text-[11px] font-bold hover:underline"
                  >
                    <span>Ler na Bíblia</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Botões de Ação do Jejum em Andamento */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setActionRecordId(currentRunningFast.id);
                setActionType('concluir');
                setActionInput('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#162E23] hover:bg-[#1F3F30] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Concluir Jejum com Ação de Graças</span>
            </button>

            <button
              onClick={() => {
                setActionRecordId(currentRunningFast.id);
                setActionType('interromper');
                setActionInput('');
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
            >
              <Pause className="w-4 h-4" />
              <span>Interromper</span>
            </button>

            {onOpenReflection && (
              <button
                onClick={() => onOpenReflection(`Jejum: ${currentRunningFast.purpose}`)}
                className="px-4 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] hover:bg-neutral-50 dark:hover:bg-[#1B2521] transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-[#C59B3F]" />
                <span>Registrar Reflexão</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* LISTA & HISTÓRICO DE JEJUNS */}
      <div className="space-y-4">
        {/* Filtro de Estados */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#7D8882] font-semibold mr-1">Filtrar:</span>
            {STATUS_FILTERS.map(flt => {
              const isSelected = activeTabFilter === flt.id;
              const count = flt.id === 'all' 
                ? fastingRecords.length 
                : fastingRecords.filter(r => r.status === flt.id).length;

              return (
                <button
                  key={flt.id}
                  onClick={() => setActiveTabFilter(flt.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#162E23] text-white shadow-xs'
                      : 'bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] hover:bg-neutral-50 dark:hover:bg-[#1B2521]'
                  }`}
                >
                  {flt.label} ({count})
                </button>
              );
            })}
          </div>

          <span className="text-xs text-[#7D8882]">
            {filteredRecords.length} registros
          </span>
        </div>

        {/* Lista de Registros */}
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
            Nenhum registro de jejum nesta categoria. Clique em "Consagrar Jejum" para planejar um novo momento.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map(fast => {
              const badge = getStatusBadge(fast.status);
              const isRunning = fast.status === 'em_andamento';

              return (
                <div
                  key={fast.id}
                  className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141C19] border shadow-xs space-y-3 transition-all ${
                    isRunning 
                      ? 'border-[#29523F] ring-1 ring-[#29523F]/30' 
                      : 'border-[#E6E6DF] dark:border-[#24322C] hover:border-[#29523F]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Badges: Status, Tipo, Horário, Data */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>

                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-[#1B2521] text-[#4B554F] dark:text-[#B0BBB5] border border-[#E6E6DF] dark:border-[#24322C]">
                          {getTypeLabel(fast.type)}
                        </span>

                        <span className="text-[11px] text-[#7D8882] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{fast.date}</span>
                        </span>

                        <span className="text-[11px] text-[#7D8882] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{fast.startTime?.slice(11, 16) || fast.startTime || '06:00'} às {fast.endTime?.slice(11, 16) || fast.endTime || '18:00'} ({fast.targetHours}h)</span>
                        </span>
                      </div>

                      {/* Objetivo */}
                      <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                        {fast.purpose}
                      </h3>

                      {/* Oração Vinculada */}
                      {fast.relatedPrayerTitle && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          <span>Oração vinculada: {fast.relatedPrayerTitle}</span>
                        </div>
                      )}

                      {/* Passagem Bíblica de Sustentação */}
                      {fast.relatedPassage && (
                        <div className="flex items-center gap-2 text-xs text-[#29523F] dark:text-[#4F8E71]">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Passagem: {fast.relatedPassage}</span>
                          {onNavigateToBible && (
                            <button
                              onClick={() => onNavigateToBible(fast.relatedPassage!)}
                              className="text-[10px] font-bold underline hover:opacity-80 ml-1"
                            >
                              Abrir Bíblia
                            </button>
                          )}
                        </div>
                      )}

                      {/* Observações */}
                      {fast.notes && (
                        <div className="text-xs text-[#7D8882] pt-0.5">
                          <strong className="text-[#19211D] dark:text-[#F1F4F2]">Observações:</strong> {fast.notes}
                        </div>
                      )}

                      {/* Testemunho / Reflexões pós jejum */}
                      {fast.reflectionsDuringFast && (
                        <div className="mt-2 p-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-xs text-[#19211D] dark:text-[#F1F4F2]">
                          <strong className="text-[#29523F] dark:text-[#4F8E71] block mb-0.5">Reflexão & Fruto do Jejum:</strong>
                          "{fast.reflectionsDuringFast}"
                        </div>
                      )}

                      {/* Motivo de Interrupção / Cancelamento */}
                      {(fast.interruptionReason || fast.cancellationReason) && (
                        <div className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                          <strong>Motivo:</strong> {fast.interruptionReason || fast.cancellationReason}
                        </div>
                      )}
                    </div>

                    {/* Ações por Registro */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                      {fast.status === 'planejado' && onStartFastingRecord && (
                        <button
                          onClick={() => onStartFastingRecord(fast.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#29523F] text-white text-xs font-bold hover:bg-[#1E3D2F] transition-colors shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Iniciar Agora</span>
                        </button>
                      )}

                      {fast.status === 'planejado' && (
                        <button
                          onClick={() => {
                            setActionRecordId(fast.id);
                            setActionType('cancelar');
                            setActionInput('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#7D8882] hover:text-rose-600 hover:bg-neutral-100 transition-colors"
                        >
                          Cancelar
                        </button>
                      )}

                      {fast.status === 'em_andamento' && (
                        <button
                          onClick={() => {
                            setActionRecordId(fast.id);
                            setActionType('concluir');
                            setActionInput('');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Concluir</span>
                        </button>
                      )}

                      {/* Ação de Reflexão */}
                      {onOpenReflection && (
                        <button
                          onClick={() => onOpenReflection(`Jejum: ${fast.purpose}`)}
                          className="p-1.5 rounded-lg text-[#29523F] dark:text-[#4F8E71] hover:bg-emerald-50 dark:hover:bg-[#1B2521] transition-colors"
                          title="Registrar Reflexão Espiritual"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}

                      {/* Editar */}
                      <button
                        onClick={() => {
                          setEditingFasting(fast);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#7D8882] hover:text-[#19211D] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Excluir */}
                      {onDeleteFastingRecord && (
                        <button
                          onClick={() => onDeleteFastingRecord(fast.id)}
                          className="p-1.5 rounded-lg text-[#7D8882] hover:text-rose-600 hover:bg-neutral-100 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Princípios Bíblicos do Jejum */}
      <div className="grid sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
          <div className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71]">
            1. No Secreto
          </div>
          <p className="text-xs text-[#7D8882] leading-relaxed">
            Jesus ensina em Mateus 6 que o jejum deve ser para o Pai que vê em secreto, sem ostentação pública.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
          <div className="text-xs font-bold text-[#C59B3F]">
            2. Acompanhado de Oração
          </div>
          <p className="text-xs text-[#7D8882] leading-relaxed">
            Sem oração e leitura da Palavra, o jejum é apenas dieta. Substitua o tempo das refeições por comunhão com Deus.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
          <div className="text-xs font-bold text-[#162E23] dark:text-[#4F8E71]">
            3. Justiça e Amor (Isaías 58)
          </div>
          <p className="text-xs text-[#7D8882] leading-relaxed">
            O verdadeiro jejum inclui soltar as ligaduras da injustiça, repartir o pão com quem tem fome e praticar a misericórdia.
          </p>
        </div>
      </div>

      {/* Modal de Concluir / Interromper / Cancelar */}
      {actionType && actionRecordId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] w-full max-w-md p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
              {actionType === 'concluir' && 'Concluir Jejum Consagrado'}
              {actionType === 'interromper' && 'Interromper Jejum'}
              {actionType === 'cancelar' && 'Cancelar Jejum'}
            </h3>

            <p className="text-xs text-[#7D8882]">
              {actionType === 'concluir' && 'Deixe uma anotação devocional ou testemunho do que Deus operou:'}
              {actionType === 'interromper' && 'Se desejar, anote o motivo da interrupção para acompanhamento:'}
              {actionType === 'cancelar' && 'Confirma o cancelamento deste jejum agendado?'}
            </p>

            <textarea
              rows={3}
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              placeholder={actionType === 'concluir' ? 'O que Deus ministrou ao seu espírito?' : 'Motivo opcional...'}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActionType(null);
                  setActionRecordId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D8882]"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-xl bg-[#162E23] text-white text-xs font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição de Jejum */}
      <FastingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFasting(null);
        }}
        onSave={(data) => {
          if (onCreateFasting) {
            onCreateFasting(data);
          } else {
            onStartFasting(data.purpose, data.targetHours || 12, data.type);
          }
          setEditingFasting(null);
        }}
        initialFasting={editingFasting}
        availablePrayers={prayers}
      />

    </div>
  );
};
