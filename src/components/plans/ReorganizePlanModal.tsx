import React, { useState } from 'react';
import { X, Calendar, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { ReadingPlan, PlanFrequency } from '../../types';
import { getTodayDateString, generateScheduleDates } from '../../services/readingPlanGenerator';

interface ReorganizePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ReadingPlan;
  onConfirmReorganize: (newStartDate: string, frequency: PlanFrequency, daysOfWeek: number[]) => void;
}

const DAYS_OF_WEEK = [
  { label: 'Dom', value: 0 },
  { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 }
];

export const ReorganizePlanModal: React.FC<ReorganizePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onConfirmReorganize
}) => {
  if (!isOpen) return null;

  const todayStr = getTodayDateString();
  const [startDate, setStartDate] = useState(todayStr);
  const [frequency, setFrequency] = useState<PlanFrequency>(plan.frequency || 'diaria');
  const [selectedDays, setSelectedDays] = useState<number[]>(
    plan.selectedDaysOfWeek && plan.selectedDaysOfWeek.length > 0
      ? plan.selectedDaysOfWeek
      : [0, 1, 2, 3, 4, 5, 6]
  );

  const uncompletedCount = plan.days.filter(d => !d.completed).length;

  const toggleDay = (dayVal: number) => {
    if (selectedDays.includes(dayVal)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== dayVal));
      }
    } else {
      setSelectedDays([...selectedDays, dayVal].sort());
    }
  };

  // Preview das novas datas
  const activeWeekDays = frequency === 'dias_uteis' 
    ? [1, 2, 3, 4, 5] 
    : frequency === 'dias_especificos' 
    ? selectedDays 
    : [0, 1, 2, 3, 4, 5, 6];

  const calculatedDates = generateScheduleDates(startDate, uncompletedCount, frequency, activeWeekDays);
  const projectedEndDate = calculatedDates[calculatedDates.length - 1] || startDate;

  const handleSave = () => {
    onConfirmReorganize(startDate, frequency, activeWeekDays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Reorganizar Cronograma do Plano
              </h3>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                {plan.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Info Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
            Seu progresso de <strong>{plan.days.filter(d => d.completed).length} leituras concluídas</strong> permanecerá 100% gravado. Apenas as <strong>{uncompletedCount} leituras pendentes</strong> serão redistribuídas de acordo com suas novas preferências.
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4B554F] dark:text-[#B0BBB5] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Recomeçar a partir de:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:ring-2 focus:ring-[#162E23]"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4B554F] dark:text-[#B0BBB5]">
              Frequência de Leitura:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFrequency('diaria')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  frequency === 'diaria'
                    ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                    : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                }`}
              >
                Diária (7 dias)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('dias_uteis')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  frequency === 'dias_uteis'
                    ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                    : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                }`}
              >
                Dias Úteis (Seg-Sex)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('dias_especificos')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  frequency === 'dias_especificos'
                    ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                    : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                }`}
              >
                Personalizada
              </button>
            </div>
          </div>

          {/* Specific Days Picker */}
          {frequency === 'dias_especificos' && (
            <div className="space-y-2 pt-1">
              <label className="text-xs font-medium text-[#7D8882] dark:text-[#788780]">
                Selecione os dias da semana ativos:
              </label>
              <div className="flex items-center gap-1.5">
                {DAYS_OF_WEEK.map(d => {
                  const isSelected = selectedDays.includes(d.value);
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#162E23] text-white dark:bg-[#224535]'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projection Summary Box */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0C1210] border border-[#E6E6DF] dark:border-[#24322C] space-y-1.5 text-xs text-[#4B554F] dark:text-[#B0BBB5]">
            <div className="flex justify-between items-center">
              <span>Leituras a reagendar:</span>
              <span className="font-bold text-[#19211D] dark:text-[#F1F4F2]">{uncompletedCount} dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nova data inicial:</span>
              <span className="font-bold text-[#19211D] dark:text-[#F1F4F2]">{startDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Previsão de conclusão:</span>
              <span className="font-bold text-[#162E23] dark:text-[#4F8E71]">{projectedEndDate}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end gap-2 bg-[#FBFBFA] dark:bg-[#101714]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aplicar Novo Cronograma</span>
          </button>
        </div>
      </div>
    </div>
  );
};
