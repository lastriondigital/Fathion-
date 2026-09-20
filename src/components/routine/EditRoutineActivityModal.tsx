import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { RoutineActivity, RoutineBlock, RoutineActivityType, PriorityLevel } from '../../types';

interface EditRoutineActivityModalProps {
  isOpen: boolean;
  activity: RoutineActivity | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<RoutineActivity>) => void;
  onDelete: (id: string) => void;
}

export const EditRoutineActivityModal: React.FC<EditRoutineActivityModalProps> = ({
  isOpen,
  activity,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<RoutineActivityType>('prayer');
  const [block, setBlock] = useState<RoutineBlock>('morning');
  const [suggestedTime, setSuggestedTime] = useState('07:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [priority, setPriority] = useState<PriorityLevel>('alta');
  const [why, setWhy] = useState('');
  const [passageRef, setPassageRef] = useState('');

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setType(activity.type);
      setBlock(activity.block);
      setSuggestedTime(activity.suggestedTime);
      setEstimatedMinutes(activity.estimatedMinutes);
      setPriority(activity.priority);
      setWhy(activity.why);
      setPassageRef(activity.passageRef || '');
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !why.trim()) return;

    onSave(activity.id, {
      name: name.trim(),
      type,
      block,
      suggestedTime,
      estimatedMinutes: Number(estimatedMinutes),
      priority,
      why: why.trim(),
      passageRef: passageRef.trim() || undefined
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Deseja remover "${activity.name}" da sua rotina?`)) {
      onDelete(activity.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Editar Prática da Rotina
            </h3>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Ajuste horários, durações e o propósito desta disciplina
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
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Nome da Prática *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoutineActivityType)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="prayer">Oração</option>
                <option value="reading">Leitura Bíblica</option>
                <option value="reflection">Reflexão / Exame</option>
                <option value="silence">Silêncio / Meditação</option>
                <option value="gratitude">Gratidão</option>
                <option value="memorization">Memorização</option>
                <option value="service">Serviço</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Bloco
              </label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value as RoutineBlock)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="morning">Manhã</option>
                <option value="day">Durante o Dia</option>
                <option value="night">Noite</option>
                <option value="flexible">Flexível</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Horário
              </label>
              <input
                type="text"
                value={suggestedTime}
                onChange={(e) => setSuggestedTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Duração (min)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Por que fazer essa prática? (Intenção clara) *
            </label>
            <textarea
              required
              rows={2}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Referência Bíblica (Opcional)
            </label>
            <input
              type="text"
              value={passageRef}
              onChange={(e) => setPassageRef(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
            />
          </div>

          <div className="pt-3 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remover da rotina</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#7D8882]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
