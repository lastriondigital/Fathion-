import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  User, 
  Calendar, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  BookOpen,
  Flame,
  ArrowRight
} from 'lucide-react';
import { PrayerRequest, PrayerCategory, PrayerStatus, PriorityLevel } from '../../types';

interface PrayerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prayer: Omit<PrayerRequest, 'id' | 'createdAt' | 'timesPrayed'> & { id?: string }) => void;
  initialPrayer?: PrayerRequest | null;
  defaultPassageRef?: string;
  onOpenFastingWithPrayer?: (prayerTitle: string, prayerId?: string) => void;
}

const CATEGORIES: { id: PrayerCategory; label: string; icon: string }[] = [
  { id: 'spiritual', label: 'Vida Espiritual', icon: '🕊️' },
  { id: 'family', label: 'Família', icon: '🏡' },
  { id: 'health', label: 'Saúde & Cura', icon: '🌿' },
  { id: 'calling', label: 'Vocação & Trabalho', icon: '💼' },
  { id: 'church', label: 'Igreja & Reino', icon: '⛪' },
  { id: 'intercession', label: 'Intercessão por Outros', icon: '🤝' },
  { id: 'gratitude', label: 'Ação de Graças', icon: '✨' },
];

const STATUS_OPTIONS: { id: PrayerStatus; label: string; description: string; color: string }[] = [
  { id: 'ativo', label: 'Ativo', description: 'Apresentado na presença de Deus', color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300' },
  { id: 'em_oracao', label: 'Em oração', description: 'Em clamor contínuo e intensivo', color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300' },
  { id: 'respondido', label: 'Respondido', description: 'Oração atendida pelo Senhor', color: 'bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-300' },
  { id: 'agradecimento', label: 'Agradecimento', description: 'Culto de gratidão e louvor', color: 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300' },
  { id: 'arquivado', label: 'Arquivado', description: 'Ciclo guardado na jornada', color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300' },
];

const PRIORITIES: { id: PriorityLevel; label: string; badgeColor: string }[] = [
  { id: 'alta', label: 'Alta Prioridade', badgeColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200' },
  { id: 'media', label: 'Prioridade Média', badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200' },
  { id: 'baixa', label: 'Prioridade Baixa', badgeColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200' },
];

export const PrayerRequestModal: React.FC<PrayerRequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPrayer,
  defaultPassageRef,
  onOpenFastingWithPrayer
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [person, setPerson] = useState('');
  const [category, setCategory] = useState<PrayerCategory>('spiritual');
  const [priority, setPriority] = useState<PriorityLevel>('media');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<PrayerStatus>('ativo');
  const [answer, setAnswer] = useState('');
  const [notes, setNotes] = useState('');
  const [scriptureRef, setScriptureRef] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialPrayer) {
        setTitle(initialPrayer.title || '');
        setDescription(initialPrayer.description || '');
        setPerson(initialPrayer.person || '');
        setCategory(initialPrayer.category || 'spiritual');
        setPriority(initialPrayer.priority || 'media');
        setDate(initialPrayer.date || (initialPrayer.createdAt ? initialPrayer.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]));
        setStatus(initialPrayer.status || (initialPrayer.answered ? 'respondido' : 'ativo'));
        setAnswer(initialPrayer.answer || initialPrayer.answeredTestimony || '');
        setNotes(initialPrayer.notes || '');
        setScriptureRef(initialPrayer.scriptureReferences?.[0] || '');
      } else {
        setTitle('');
        setDescription('');
        setPerson('');
        setCategory('spiritual');
        setPriority('media');
        setDate(new Date().toISOString().split('T')[0]);
        setStatus('ativo');
        setAnswer('');
        setNotes('');
        setScriptureRef(defaultPassageRef || '');
      }
    }
  }, [isOpen, initialPrayer, defaultPassageRef]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialPrayer?.id,
      title: title.trim(),
      description: description.trim(),
      person: person.trim() || undefined,
      category,
      priority,
      date,
      status,
      answer: answer.trim() || undefined,
      notes: notes.trim() || undefined,
      scriptureReferences: scriptureRef.trim() ? [scriptureRef.trim()] : (initialPrayer?.scriptureReferences || []),
      answered: status === 'respondido' || status === 'agradecimento',
      answeredTestimony: answer.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="prayer-request-modal-container"
        className="relative w-full max-w-xl bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] shadow-2xl p-6 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6DF] dark:border-[#24322C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#29523F]/10 dark:bg-[#29523F]/30 flex items-center justify-center text-[#29523F] dark:text-[#4F8E71]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                {initialPrayer ? 'Editar Pedido de Oração' : 'Novo Pedido de Oração'}
              </h2>
              <p className="text-xs text-[#7D8882] dark:text-[#8E9B93]">
                Apresente diante de Deus os seus clamores, intercessões e ações de graças.
              </p>
            </div>
          </div>
          <button
            id="close-prayer-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Título do Pedido *
            </label>
            <input
              id="prayer-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Sabedoria nas decisões da empresa"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
            />
          </div>

          {/* Pessoa & Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <User className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Pessoa / Causa</span>
              </label>
              <input
                id="prayer-person-input"
                type="text"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                placeholder="Ex: Minha mãe, Pastor João, Irmãos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Data</span>
              </label>
              <input
                id="prayer-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
              />
            </div>
          </div>

          {/* Categoria & Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <Tag className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Categoria</span>
              </label>
              <select
                id="prayer-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as PrayerCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Prioridade</span>
              </label>
              <select
                id="prayer-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
              >
                {PRIORITIES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado / Status */}
          <div>
            <label className="block text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Estado do Pedido
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STATUS_OPTIONS.map(opt => {
                const isSelected = status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id)}
                    className={`px-2.5 py-2 rounded-xl text-center border transition-all text-xs font-bold ${
                      isSelected 
                        ? `${opt.color} ring-2 ring-emerald-500/40 shadow-xs`
                        : 'border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#22302A]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Descrição do Pedido
            </label>
            <textarea
              id="prayer-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Descreva com detalhes o motivo pelo qual você está clamando..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors resize-none"
            />
          </div>

          {/* Resposta Concedida (quando respondido ou agradecimento) */}
          {(status === 'respondido' || status === 'agradecimento' || answer) && (
            <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 animate-in fade-in">
              <label className="flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-purple-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Resposta de Deus / Testemunho Concedido</span>
              </label>
              <textarea
                id="prayer-answer-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={2}
                placeholder="Registre aqui como Deus respondeu a esta oração para fortalecer sua fé e a de outros..."
                className="w-full px-3.5 py-2 rounded-lg border border-purple-200 dark:border-purple-800/50 bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          )}

          {/* Notas & Passagem Bíblica de Sustentação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                <span>Passagem Bíblica de Sustentação</span>
              </label>
              <input
                id="prayer-scripture-input"
                type="text"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                placeholder="Ex: Filipenses 4:6-7"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <FileText className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Notas & Acompanhamento</span>
              </label>
              <input
                id="prayer-notes-input"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Orar com jejum na quarta-feira"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
              />
            </div>
          </div>

          {/* Integração com Jejum */}
          {onOpenFastingWithPrayer && title.trim() && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onOpenFastingWithPrayer(title.trim(), initialPrayer?.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#29523F]/5 dark:bg-[#29523F]/20 border border-[#29523F]/20 text-[#29523F] dark:text-[#4F8E71] hover:bg-[#29523F]/10 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#C59B3F]" />
                  <span>Consagrar um Jejum por este motivo</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
              id="save-prayer-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#29523F] dark:bg-[#386650] text-white text-xs font-bold hover:bg-[#1E3D2F] dark:hover:bg-[#29523F] transition-colors shadow-xs"
            >
              {initialPrayer ? 'Salvar Alterações' : 'Salvar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
