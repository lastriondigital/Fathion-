import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  Clock, 
  Sparkles,
  Layers,
  Edit2
} from 'lucide-react';
import { ReadingPlan, PlanDay } from '../../types';
import { BIBLE_VERSIONS } from '../../services/bibleService';

interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ReadingPlan;
  onUpdatePlan: (planId: string, updates: Partial<ReadingPlan>) => void;
  onAddDay: (planId: string, day: Omit<PlanDay, 'dayNumber'>) => void;
  onRemoveDay: (planId: string, dayNumber: number) => void;
  onReorderDays: (planId: string, days: PlanDay[]) => void;
  onDeletePlan: (planId: string) => void;
}

export const PlanEditorModal: React.FC<PlanEditorModalProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdatePlan,
  onAddDay,
  onRemoveDay,
  onReorderDays,
  onDeletePlan
}) => {
  if (!isOpen) return null;

  // Basic Info Form
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description);
  const [objective, setObjective] = useState(plan.objective || '');
  const [dailyMinutes, setDailyMinutes] = useState(plan.dailyEstimatedMinutes || 15);
  const [preferredVersion, setPreferredVersion] = useState(plan.preferredVersion || 'arc');

  // New Day Form
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [newDayPassage, setNewDayPassage] = useState('');
  const [newDayBookId, setNewDayBookId] = useState('mateus');
  const [newDayChapter, setNewDayChapter] = useState(1);
  const [newDayPrompt, setNewDayPrompt] = useState('');

  // Save General Info
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePlan(plan.id, {
      title,
      description,
      objective,
      dailyEstimatedMinutes: dailyMinutes,
      preferredVersion
    });
  };

  // Move Day Up
  const handleMoveDayUp = (idx: number) => {
    if (idx <= 0) return;
    const newDays = [...plan.days];
    const temp = newDays[idx];
    newDays[idx] = newDays[idx - 1];
    newDays[idx - 1] = temp;
    onReorderDays(plan.id, newDays);
  };

  // Move Day Down
  const handleMoveDayDown = (idx: number) => {
    if (idx >= plan.days.length - 1) return;
    const newDays = [...plan.days];
    const temp = newDays[idx];
    newDays[idx] = newDays[idx + 1];
    newDays[idx + 1] = temp;
    onReorderDays(plan.id, newDays);
  };

  // Add Day
  const handleCreateDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDayPassage.trim()) return;

    onAddDay(plan.id, {
      title: newDayTitle.trim() || `Leitura: ${newDayPassage}`,
      passageRef: newDayPassage.trim(),
      bookId: newDayBookId,
      chapter: Number(newDayChapter) || 1,
      devotionalPrompt: newDayPrompt.trim() || `Reflexão e oração sobre ${newDayPassage}.`,
      completed: false,
      estimatedMinutes: dailyMinutes
    });

    setNewDayTitle('');
    setNewDayPassage('');
    setNewDayPrompt('');
    setIsAddingDay(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Personalizar & Gerenciar Plano
              </h3>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                {plan.title} ({plan.days.length} dias cadastrados)
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* General Plan Settings Form */}
          <form onSubmit={handleSaveInfo} className="p-4 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-neutral-50 dark:bg-[#0C1210] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#19211D] dark:text-[#F1F4F2]">
                Informações do Plano
              </h4>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Salvar Alterações
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#4B554F] dark:text-[#B0BBB5]">Título:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#4B554F] dark:text-[#B0BBB5]">Descrição:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#4B554F] dark:text-[#B0BBB5]">Objetivo Espiritual:</label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#4B554F] dark:text-[#B0BBB5]">Tempo Diário (min):</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#4B554F] dark:text-[#B0BBB5]">Versão Bíblica:</label>
                <select
                  value={preferredVersion}
                  onChange={(e) => setPreferredVersion(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                >
                  {BIBLE_VERSIONS.map(v => (
                    <option key={v.id} value={v.id}>{v.abbreviation} — {v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>

          {/* Days List and Reordering */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#162E23] dark:text-[#4F8E71]" />
                Dias e Leituras ({plan.days.length})
              </h4>

              <button
                type="button"
                onClick={() => setIsAddingDay(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#D4E6DC] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Dia
              </button>
            </div>

            {/* Add Day Form Dropdown */}
            {isAddingDay && (
              <form onSubmit={handleCreateDay} className="p-4 rounded-xl border border-[#162E23]/30 dark:border-[#4F8E71]/30 bg-[#E6F0EA]/20 dark:bg-[#192D23]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#162E23] dark:text-[#4F8E71]">
                    Novo Dia (Dia {plan.days.length + 1})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingDay(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#4B554F] dark:text-[#B0BBB5]">Passagem (ex: Salmo 91):</label>
                    <input
                      type="text"
                      value={newDayPassage}
                      onChange={(e) => setNewDayPassage(e.target.value)}
                      placeholder="Ex: Mateus 1"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#4B554F] dark:text-[#B0BBB5]">Título do Dia:</label>
                    <input
                      type="text"
                      value={newDayTitle}
                      onChange={(e) => setNewDayTitle(e.target.value)}
                      placeholder="Ex: A Genealogia e o Nascimento"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-medium text-[#4B554F] dark:text-[#B0BBB5]">Prompt Devocional:</label>
                    <input
                      type="text"
                      value={newDayPrompt}
                      onChange={(e) => setNewDayPrompt(e.target.value)}
                      placeholder="Ex: O que essa passagem revela sobre a soberania de Deus?"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30]"
                  >
                    Confirmar e Adicionar
                  </button>
                </div>
              </form>
            )}

            {/* Days Rows */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {plan.days.map((day, idx) => (
                <div
                  key={day.dayNumber}
                  className="p-3 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-bold text-[#162E23] dark:text-[#4F8E71] shrink-0 w-12">
                      Dia {day.dayNumber}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#19211D] dark:text-[#F1F4F2] truncate">
                          {day.passageRef}
                        </span>
                        {day.date && (
                          <span className="text-[10px] text-[#7D8882] dark:text-[#788780]">
                            • {day.date}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7D8882] dark:text-[#788780] truncate">
                        {day.title}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Move up, down, remove */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveDayUp(idx)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === plan.days.length - 1}
                      onClick={() => handleMoveDayDown(idx)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={plan.days.length <= 1}
                      onClick={() => onRemoveDay(plan.id, day.dayNumber)}
                      className="p-1 rounded text-neutral-400 hover:text-red-500 disabled:opacity-30 ml-1"
                      title="Remover este dia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone: Delete Plan */}
          <div className="pt-4 border-t border-red-200 dark:border-red-950 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-red-800 dark:text-red-400">Excluir Plano de Leitura</h5>
              <p className="text-[11px] text-neutral-500">Esta ação remove o plano permanentemente.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja excluir o plano "${plan.title}"?`)) {
                  onDeletePlan(plan.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 hover:bg-red-100"
            >
              Excluir Plano
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end bg-[#FBFBFA] dark:bg-[#101714]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30]"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
