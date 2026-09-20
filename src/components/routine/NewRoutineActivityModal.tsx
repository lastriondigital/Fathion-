import React, { useState } from 'react';
import { X, Clock, Target, Sparkles, Check } from 'lucide-react';
import { RoutineActivity, RoutineBlock, RoutineActivityType, PriorityLevel } from '../../types';

interface NewRoutineActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Omit<RoutineActivity, 'id' | 'order'>) => void;
  defaultBlock?: RoutineBlock;
}

export const NewRoutineActivityModal: React.FC<NewRoutineActivityModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
  defaultBlock = 'morning'
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<RoutineActivityType>('prayer');
  const [block, setBlock] = useState<RoutineBlock>(defaultBlock);
  const [suggestedTime, setSuggestedTime] = useState('07:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [priority, setPriority] = useState<PriorityLevel>('alta');
  const [why, setWhy] = useState('');
  const [passageRef, setPassageRef] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'
  ]);

  if (!isOpen) return null;

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !why.trim()) return;

    onAddActivity({
      name: name.trim(),
      type,
      block,
      suggestedTime,
      estimatedMinutes: Number(estimatedMinutes),
      priority,
      why: why.trim(),
      isActive: true,
      applicableDays: selectedDays,
      passageRef: passageRef.trim() || undefined
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
              Nova Prática na Rotina
            </h3>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Estruture sua prática com clareza de horário e intenção espiritual
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Nome da Prática */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Nome da Prática *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Oração de Consagração, Leitura dos Salmos..."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          {/* Tipo e Bloco */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Tipo de Prática
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoutineActivityType)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value="prayer">Oração</option>
                <option value="reading">Leitura Bíblica</option>
                <option value="reflection">Reflexão / Exame</option>
                <option value="silence">Silêncio / Meditação</option>
                <option value="gratitude">Gratidão</option>
                <option value="memorization">Memorização</option>
                <option value="service">Serviço / Intercessão</option>
                <option value="other">Outra Prática</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Momento do Dia (Bloco)
              </label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value as RoutineBlock)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value="morning">Manhã</option>
                <option value="day">Durante o Dia</option>
                <option value="night">Noite</option>
                <option value="flexible">Flexível / Qualquer hora</option>
              </select>
            </div>
          </div>

          {/* Horário, Duração e Prioridade */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Horário Sugerido
              </label>
              <input
                type="text"
                value={suggestedTime}
                onChange={(e) => setSuggestedTime(e.target.value)}
                placeholder="07:00"
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Duração (min)
              </label>
              <input
                type="number"
                min="3"
                max="180"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          {/* Por que fazer essa prática (Intenção clara) */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Por que fazer essa prática? (Intenção e propósito) *
            </label>
            <textarea
              required
              rows={2}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Ex: Começar o dia com a mente ancorada em Deus antes de abrir mensagens de trabalho..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          {/* Referência Bíblica (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Referência / Texto de Apoio (Opcional)
            </label>
            <input
              type="text"
              value={passageRef}
              onChange={(e) => setPassageRef(e.target.value)}
              placeholder="Ex: Salmos 23, Romanos 8..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          {/* Dias da Semana */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1.5">
              Dias Aplicáveis
            </label>
            <div className="flex flex-wrap gap-1.5">
              {weekDays.map(day => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-[#162E23] text-white dark:bg-[#224535]'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-[#7D8882]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors shadow-xs"
            >
              Adicionar à Rotina
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
