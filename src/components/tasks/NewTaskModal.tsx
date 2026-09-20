import React, { useState } from 'react';
import { X, Plus, Clock, Sparkles } from 'lucide-react';
import { TaskCategory, TimeOfDay, DailyTask } from '../../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<DailyTask, 'id' | 'order' | 'completed'>) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('prayer');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [scheduledTime, setScheduledTime] = useState('07:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [why, setWhy] = useState('');
  const [passageReference, setPassageReference] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !why.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      timeOfDay,
      scheduledTime,
      estimatedMinutes,
      why: why.trim(),
      passageReference: passageReference.trim() || undefined,
      status: 'planejada',
      priority: 'media'
    });

    setTitle('');
    setWhy('');
    setPassageReference('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FBFBFA] dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] w-full max-w-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between bg-white dark:bg-[#1B2521]">
          <div>
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Nova Atividade Espiritual
            </h3>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Planeje com propósito e reduza a sobrecarga diária
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#141C19]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Título da Atividade *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Leitura dos Salmos ou Oração Matinal"
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value="bible">Leitura Bíblica</option>
                <option value="prayer">Oração & Comunhão</option>
                <option value="fasting">Consagração & Jejum</option>
                <option value="reflection">Reflexão Espiritual</option>
                <option value="service">Serviço & Generosidade</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Período do Dia
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value="morning">Manhã</option>
                <option value="afternoon">Tarde</option>
                <option value="evening">Noite</option>
                <option value="anytime">Qualquer Momento</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Horário Sugerido
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Duração Estimada (min)
              </label>
              <input
                type="number"
                min="0"
                max="180"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>
          </div>

          {/* O PORQUÊ - PRINCÍPIO CENTRAL DE CLAREZA */}
          <div>
            <label className="block text-xs font-semibold text-[#162E23] dark:text-[#4F8E71] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
              <span>Por que devo fazer isso? (Propósito Espiritual) *</span>
            </label>
            <textarea
              required
              rows={2}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Ex: Para consagrar minhas decisões antes de responder emails e desacelerar o coração."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          {category === 'bible' && (
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Referência Bíblica (Opcional)
              </label>
              <input
                type="text"
                value={passageReference}
                onChange={(e) => setPassageReference(e.target.value)}
                placeholder="Ex: Salmos 23 ou Romanos 8"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#1B2521]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#162E23] text-white hover:bg-[#1F3F30] text-xs font-semibold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Atividade</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
