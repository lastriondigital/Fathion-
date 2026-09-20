import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  ListChecks, 
  CheckCircle2, 
  Sparkles,
  Repeat
} from 'lucide-react';
import { PrayerPlan, PrayerPlanType, PrayerRequest } from '../../types';

interface PrayerPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<PrayerPlan, 'id' | 'createdAt'> & { id?: string }) => void;
  initialPlan?: PrayerPlan | null;
  availablePrayers?: PrayerRequest[];
}

const DAYS_OF_WEEK = [
  { day: 0, short: 'Dom', label: 'Domingo' },
  { day: 1, short: 'Seg', label: 'Segunda' },
  { day: 2, short: 'Ter', label: 'Terça' },
  { day: 3, short: 'Qua', label: 'Quarta' },
  { day: 4, short: 'Qui', label: 'Quinta' },
  { day: 5, short: 'Sex', label: 'Sexta' },
  { day: 6, short: 'Sáb', label: 'Sábado' },
];

export const PrayerPlanModal: React.FC<PrayerPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan,
  availablePrayers = []
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PrayerPlanType>('diario');
  const [scheduledTimes, setScheduledTimes] = useState<string[]>(['06:30', '21:30']);
  const [newTimeInput, setNewTimeInput] = useState('12:00');
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [targetMinutes, setTargetMinutes] = useState<number>(15);
  const [associatedPrayerIds, setAssociatedPrayerIds] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      if (initialPlan) {
        setTitle(initialPlan.title || '');
        setDescription(initialPlan.description || '');
        setType(initialPlan.type || 'diario');
        setScheduledTimes(initialPlan.scheduledTimes || ['06:30']);
        setRecurrenceDays(initialPlan.recurrenceDays || [0, 1, 2, 3, 4, 5, 6]);
        setTargetMinutes(initialPlan.targetMinutes || 15);
        setAssociatedPrayerIds(initialPlan.associatedPrayerIds || []);
        setIsActive(initialPlan.isActive ?? true);
      } else {
        setTitle('');
        setDescription('');
        setType('diario');
        setScheduledTimes(['06:30', '21:30']);
        setRecurrenceDays([0, 1, 2, 3, 4, 5, 6]);
        setTargetMinutes(15);
        setAssociatedPrayerIds([]);
        setIsActive(true);
      }
    }
  }, [isOpen, initialPlan]);

  if (!isOpen) return null;

  const handleToggleDay = (day: number) => {
    if (recurrenceDays.includes(day)) {
      if (recurrenceDays.length > 1) {
        setRecurrenceDays(recurrenceDays.filter(d => d !== day));
      }
    } else {
      setRecurrenceDays([...recurrenceDays, day].sort());
    }
  };

  const handleAddTime = () => {
    if (!newTimeInput) return;
    if (!scheduledTimes.includes(newTimeInput)) {
      setScheduledTimes([...scheduledTimes, newTimeInput].sort());
    }
  };

  const handleRemoveTime = (timeToRemove: string) => {
    if (scheduledTimes.length > 1) {
      setScheduledTimes(scheduledTimes.filter(t => t !== timeToRemove));
    }
  };

  const handleTogglePrayer = (prayerId: string) => {
    if (associatedPrayerIds.includes(prayerId)) {
      setAssociatedPrayerIds(associatedPrayerIds.filter(id => id !== prayerId));
    } else {
      setAssociatedPrayerIds([...associatedPrayerIds, prayerId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialPlan?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      scheduledTimes,
      recurrenceDays,
      targetMinutes: Number(targetMinutes) || 15,
      associatedPrayerIds,
      isActive
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="prayer-plan-modal-container"
        className="relative w-full max-w-lg bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] shadow-2xl p-6 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6DF] dark:border-[#24322C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#29523F]/10 dark:bg-[#29523F]/30 flex items-center justify-center text-[#29523F] dark:text-[#4F8E71]">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                {initialPlan ? 'Editar Plano de Oração' : 'Novo Plano de Oração'}
              </h2>
              <p className="text-xs text-[#7D8882] dark:text-[#8E9B93]">
                Estabeleça horários, dias da semana e recorrência para a sua rotina de oração.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Título do Plano */}
          <div>
            <label className="block text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Nome do Plano de Oração *
            </label>
            <input
              id="plan-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Clamor Matinal & Intercessão Diária"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
            />
          </div>

          {/* Tipo de Plano (diário, semanal, personalizado) */}
          <div>
            <label className="block text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Tipo de Plano
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'diario', label: 'Diário', desc: 'Todos os dias' },
                { id: 'semanal', label: 'Semanal', desc: 'Dias específicos' },
                { id: 'personalizado', label: 'Personalizado', desc: 'Horários livres' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setType(opt.id as PrayerPlanType);
                    if (opt.id === 'diario') {
                      setRecurrenceDays([0, 1, 2, 3, 4, 5, 6]);
                    }
                  }}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    type === opt.id
                      ? 'bg-[#29523F]/10 dark:bg-[#29523F]/30 border-[#29523F] dark:border-[#4F8E71] text-[#29523F] dark:text-[#4F8E71] font-bold shadow-xs'
                      : 'border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#22302A]'
                  }`}
                >
                  <p className="text-xs">{opt.label}</p>
                  <p className="text-[10px] text-[#7D8882]">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recorrência: Dias da Semana */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7D8882]" />
              <span>Dias da Semana (Recorrência)</span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {DAYS_OF_WEEK.map(d => {
                const isSelected = recurrenceDays.includes(d.day);
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => handleToggleDay(d.day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      isSelected
                        ? 'bg-[#29523F] text-white border-[#29523F]'
                        : 'bg-[#FAFAF8] dark:bg-[#1B2521] text-[#7D8882] border-[#E6E6DF] dark:border-[#24322C] hover:bg-neutral-100'
                    }`}
                  >
                    {d.short}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horários Programados */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7D8882]" />
              <span>Horários Programados</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {scheduledTimes.map(time => (
                <span
                  key={time}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300"
                >
                  <Clock className="w-3 h-3" />
                  {time}
                  {scheduledTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      className="text-emerald-600 hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={newTimeInput}
                onChange={(e) => setNewTimeInput(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              />
              <button
                type="button"
                onClick={handleAddTime}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-[#24322C] text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] hover:bg-neutral-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Horário
              </button>
            </div>
          </div>

          {/* Duração Estimada por Sessão */}
          <div>
            <label className="block text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Tempo Diário Recomendado (Minutos)
            </label>
            <div className="flex items-center gap-3">
              {[10, 15, 20, 30, 45].map(min => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setTargetMinutes(min)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    targetMinutes === min
                      ? 'bg-[#29523F] text-white border-[#29523F]'
                      : 'border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] hover:bg-neutral-100'
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>

          {/* Vincular Pedidos de Oração Específicos */}
          {availablePrayers.length > 0 && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <ListChecks className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Vincular Pedidos a Este Plano (Opcional)</span>
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521]">
                {availablePrayers.map(p => {
                  const isChecked = associatedPrayerIds.includes(p.id);
                  return (
                    <label 
                      key={p.id}
                      className="flex items-center gap-2 text-xs text-[#19211D] dark:text-[#F1F4F2] hover:bg-neutral-100 dark:hover:bg-[#22302A] p-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePrayer(p.id)}
                        className="rounded-sm text-[#29523F] focus:ring-[#29523F]"
                      />
                      <span className="truncate flex-1">{p.title}</span>
                      {p.person && (
                        <span className="text-[10px] text-[#7D8882]">({p.person})</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E6E6DF] dark:border-[#24322C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
            >
              Cancelar
            </button>
            <button
              id="save-prayer-plan-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#29523F] dark:bg-[#386650] text-white text-xs font-bold hover:bg-[#1E3D2F] dark:hover:bg-[#29523F] transition-colors shadow-xs"
            >
              {initialPlan ? 'Salvar Plano' : 'Criar Plano de Oração'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
