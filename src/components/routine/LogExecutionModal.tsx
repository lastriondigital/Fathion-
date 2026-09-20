import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertCircle, Heart } from 'lucide-react';
import { 
  ActivityExecutionLog, 
  RoutineActivity, 
  ExecutionStatus, 
  SkipReason, 
  RoutineBlock 
} from '../../types';

interface LogExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: RoutineActivity[];
  selectedActivity?: RoutineActivity | null;
  onLogExecution: (log: Omit<ActivityExecutionLog, 'id' | 'loggedAt'>) => void;
}

export const LogExecutionModal: React.FC<LogExecutionModalProps> = ({
  isOpen,
  onClose,
  activities,
  selectedActivity,
  onLogExecution
}) => {
  const [activityId, setActivityId] = useState<string>(() => selectedActivity?.id || activities[0]?.id || '');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ExecutionStatus>('concluido');
  const [actualMinutes, setActualMinutes] = useState<number>(() => selectedActivity?.estimatedMinutes || 15);
  const [reason, setReason] = useState<SkipReason | undefined>(undefined);
  const [reasonNotes, setReasonNotes] = useState('');
  const [quickReflection, setQuickReflection] = useState('');

  if (!isOpen) return null;

  const currentAct = activities.find(a => a.id === activityId) || selectedActivity || activities[0];

  const handleActivityChange = (id: string) => {
    setActivityId(id);
    const act = activities.find(a => a.id === id);
    if (act && status === 'concluido') {
      setActualMinutes(act.estimatedMinutes);
    }
  };

  const handleStatusChange = (newStatus: ExecutionStatus) => {
    setStatus(newStatus);
    if (newStatus === 'concluido' && currentAct) {
      setActualMinutes(currentAct.estimatedMinutes);
      setReason(undefined);
    } else if (newStatus === 'parcial' && currentAct) {
      setActualMinutes(Math.max(1, Math.floor(currentAct.estimatedMinutes / 2)));
    } else if (newStatus === 'pulado') {
      setActualMinutes(0);
      if (!reason) setReason('falta_tempo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAct) return;

    onLogExecution({
      date,
      activityId: currentAct.id,
      activityName: currentAct.name,
      block: currentAct.block,
      plannedMinutes: currentAct.estimatedMinutes,
      actualMinutes: Number(actualMinutes),
      status,
      reason: status !== 'concluido' ? reason : undefined,
      reasonNotes: reasonNotes.trim() || undefined,
      quickReflection: quickReflection.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Registro de Execução
            </h3>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Monitore sua caminhada com honestidade e sem sentimento de culpa
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Escolha da Atividade e Data */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Atividade
              </label>
              <select
                value={activityId}
                onChange={(e) => handleActivityChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                {activities.map(act => (
                  <option key={act.id} value={act.id}>
                    {act.name} ({act.estimatedMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Data de Execução
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
          </div>

          {/* Status (Concluído, Parcial, Pulado) */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1.5">
              Status da Execução
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('concluido')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  status === 'concluido'
                    ? 'bg-[#162E23] text-white border-[#162E23]'
                    : 'bg-neutral-50 dark:bg-neutral-800/50 border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Concluído</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('parcial')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  status === 'parcial'
                    ? 'bg-amber-800 text-white border-amber-800'
                    : 'bg-neutral-50 dark:bg-neutral-800/50 border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882]'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Parcial</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('pulado')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  status === 'pulado'
                    ? 'bg-stone-700 text-white border-stone-700'
                    : 'bg-neutral-50 dark:bg-neutral-800/50 border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882]'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-stone-300" />
                <span>Pulado</span>
              </button>
            </div>
          </div>

          {/* Planejado vs Executado */}
          <div className="p-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15 flex items-center justify-between text-xs">
            <div>
              <span className="text-[#7D8882] block">Planejado</span>
              <span className="font-bold text-[#162E23] dark:text-[#4F8E71]">
                {currentAct ? `${currentAct.estimatedMinutes} minutos` : '--'}
              </span>
            </div>
            <div>
              <label className="text-[#7D8882] block text-right">Executado real</label>
              <div className="flex items-center gap-1 justify-end">
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={actualMinutes}
                  onChange={(e) => setActualMinutes(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-right text-xs font-bold rounded-lg bg-white dark:bg-[#141C19] border border-[#29523F]/30"
                />
                <span className="font-medium text-[#4B554F] dark:text-[#B0BBB5]">min</span>
              </div>
            </div>
          </div>

          {/* Motivo (Se parcial ou pulado) - Sem julgamento */}
          {status !== 'concluido' && (
            <div className="space-y-2 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 animate-in fade-in">
              <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200">
                Qual foi o principal fator? (Sem culpa, apenas para aprendizado e adaptação)
              </label>
              <select
                value={reason || 'cansaco'}
                onChange={(e) => setReason(e.target.value as SkipReason)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="cansaco">Cansaço físico ou mental acumulado</option>
                <option value="falta_tempo">Falta de tempo / Demandas urgentes</option>
                <option value="esquecimento">Esquecimento ou distração</option>
                <option value="imprevisto">Imprevisto inadiável com família/trabalho</option>
                <option value="outro">Outro motivo particular</option>
              </select>

              <input
                type="text"
                value={reasonNotes}
                onChange={(e) => setReasonNotes(e.target.value)}
                placeholder="Observação opcional sobre o momento..."
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]"
              />
            </div>
          )}

          {/* Reflexão Rápida */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Reflexão Rápida / O que Deus ministrou (Opcional)
            </label>
            <textarea
              rows={2}
              value={quickReflection}
              onChange={(e) => setQuickReflection(e.target.value)}
              placeholder="Ex: Foi um tempo breve mas restaurador; versículo tal falou muito ao coração..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
            />
          </div>

          <div className="pt-3 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#7D8882]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors shadow-xs"
            >
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
