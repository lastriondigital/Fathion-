import React, { useState } from 'react';
import { X, Sparkles, Target, Calendar, Award } from 'lucide-react';
import { 
  SpiritualObjective, 
  ObjectiveCategory, 
  PriorityLevel, 
  ObjectiveFrequency, 
  ObjectiveStatus 
} from '../../types';

interface NewObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddObjective: (objective: Omit<SpiritualObjective, 'id' | 'createdAt'>) => void;
}

interface ObjectivePreset {
  title: string;
  category: ObjectiveCategory;
  suggestedWhy: string;
  defaultFrequency: ObjectiveFrequency;
}

const PRESETS: ObjectivePreset[] = [
  {
    title: 'Ler mais a Bíblia',
    category: 'bible',
    suggestedWhy: 'Desenvolver intimidade com as Escrituras e fundamentar meus passos na Verdade.',
    defaultFrequency: 'diaria'
  },
  {
    title: 'Melhorar a vida de oração',
    category: 'prayer',
    suggestedWhy: 'Aprender a permanecer na presença do Pai com sinceridade, escuta e gratidão.',
    defaultFrequency: 'diaria'
  },
  {
    title: 'Criar disciplina espiritual diária',
    category: 'discipline',
    suggestedWhy: 'Vencer a procrastinação e manter o altar aceso mesmo em dias corridos.',
    defaultFrequency: 'diaria'
  },
  {
    title: 'Estudar um livro bíblico específico',
    category: 'study',
    suggestedWhy: 'Mergulhar no contexto histórico e na revelação teológica para crescer na fé.',
    defaultFrequency: 'semanal'
  },
  {
    title: 'Conhecer melhor a Jesus através dos Evangelhos',
    category: 'bible',
    suggestedWhy: 'Observar o coração de Cristo, Seus ensinamentos e Seu amor pelas pessoas.',
    defaultFrequency: 'diaria'
  },
  {
    title: 'Memorizar versículos essenciais',
    category: 'memorization',
    suggestedWhy: 'Guardar a Palavra no coração para tempos de dúvida, tentação ou encorajamento.',
    defaultFrequency: 'semanal'
  },
  {
    title: 'Jejuar com propósito e discernimento',
    category: 'fasting',
    suggestedWhy: 'Subjugar a carne e focar em buscar direção divina para momentos decisivos.',
    defaultFrequency: 'semanal'
  },
  {
    title: 'Cultivar paz interior e entregar a ansiedade',
    category: 'peace',
    suggestedWhy: 'Aprender a descansar no cuidado soberano de Deus em vez de me sobrecarregar.',
    defaultFrequency: 'diaria'
  }
];

export const NewObjectiveModal: React.FC<NewObjectiveModalProps> = ({
  isOpen,
  onClose,
  onAddObjective
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ObjectiveCategory>('peace');
  const [priority, setPriority] = useState<PriorityLevel>('alta');
  const [frequency, setFrequency] = useState<ObjectiveFrequency>('diaria');
  const [deadline, setDeadline] = useState('');
  const [targetDescription, setTargetDescription] = useState('');
  const [why, setWhy] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: ObjectivePreset) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setWhy(preset.suggestedWhy);
    setFrequency(preset.defaultFrequency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !why.trim()) return;

    onAddObjective({
      title: title.trim(),
      category,
      priority,
      frequency,
      status: 'ativo',
      deadline: deadline ? deadline : undefined,
      targetDescription: targetDescription.trim() || undefined,
      why: why.trim(),
      currentProgress: Number(currentProgress)
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
              Novo Objetivo Espiritual
            </h3>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Defina seu objetivo com foco, propósito e sem imposição
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
          
          {/* Sugestões Rápidas */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#7D8882] block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
              <span>Sugestões Rápidas (1 Clique)</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E6F0EA] transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Título do Objetivo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ler todo o Novo Testamento, Orar 20 min pela manhã..."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          {/* Categoria e Prioridade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ObjectiveCategory)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="bible">Leitura Bíblica</option>
                <option value="prayer">Oração</option>
                <option value="discipline">Disciplina Pessoal</option>
                <option value="study">Estudo Teológico</option>
                <option value="memorization">Memorização</option>
                <option value="fasting">Jejum</option>
                <option value="peace">Paz Interior / Serenidade</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Nível de Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="alta">Alta Prioridade</option>
                <option value="media">Média Prioridade</option>
                <option value="baixa">Baixa Prioridade</option>
              </select>
            </div>
          </div>

          {/* Frequência e Prazo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Frequência Desejada
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as ObjectiveFrequency)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="diaria">Diária</option>
                <option value="dias_uteis">Dias Úteis</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Prazo Estimado (Opcional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
          </div>

          {/* Por que este objetivo é importante (Propósito central) */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Por que este objetivo é importante para você? *
            </label>
            <textarea
              required
              rows={2}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Ex: Quero aprender a confiar mais em Deus nas decisões e ter base bíblica firme..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
            />
          </div>

          {/* Detalhe da meta / Descrição alvo */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Descrição do Alvo / Meta Numérica (Opcional)
            </label>
            <input
              type="text"
              value={targetDescription}
              onChange={(e) => setTargetDescription(e.target.value)}
              placeholder="Ex: 27 livros do NT, 15 min diários, 1 jejum quinzenal"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
            />
          </div>

          {/* Progresso Inicial */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              <span>Progresso Inicial</span>
              <span className="text-[#29523F] dark:text-[#4F8E71] font-bold">{currentProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={currentProgress}
              onChange={(e) => setCurrentProgress(Number(e.target.value))}
              className="w-full accent-[#162E23]"
            />
          </div>

          {/* Ações */}
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
              Criar Objetivo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
