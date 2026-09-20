import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Eye, 
  Footprints, 
  Heart, 
  FileText, 
  Calendar,
  Check
} from 'lucide-react';
import { Reflection } from '../../types';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reflection: Omit<Reflection, 'id' | 'createdAt'> & { id?: string }) => void;
  initialReflection?: Reflection | null;
  scriptureRef?: string;
  relatedActivityType?: 'bible' | 'prayer' | 'fasting' | 'routine';
  relatedActivityId?: string;
  relatedTitle?: string;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialReflection,
  scriptureRef,
  relatedActivityType,
  relatedActivityId,
  relatedTitle
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [passage, setPassage] = useState('');
  const [whatLearned, setWhatLearned] = useState('');
  const [whatCaughtAttention, setWhatCaughtAttention] = useState('');
  const [howToApply, setHowToApply] = useState('');
  const [personalPrayer, setPersonalPrayer] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialReflection) {
        setDate(initialReflection.date || new Date().toISOString().split('T')[0]);
        setPassage(initialReflection.scriptureRef || '');
        setWhatLearned(initialReflection.whatLearned || initialReflection.whatGodSpoke || '');
        setWhatCaughtAttention(initialReflection.whatCaughtAttention || '');
        setHowToApply(initialReflection.howToApply || initialReflection.practicalApplication || '');
        setPersonalPrayer(initialReflection.personalPrayer || '');
        setNotes(initialReflection.notes || '');
      } else {
        setDate(new Date().toISOString().split('T')[0]);
        setPassage(scriptureRef || '');
        setWhatLearned('');
        setWhatCaughtAttention('');
        setHowToApply('');
        setPersonalPrayer('');
        setNotes('');
      }
    }
  }, [isOpen, initialReflection, scriptureRef]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: initialReflection?.id,
      date,
      scriptureRef: passage.trim() || undefined,
      whatLearned: whatLearned.trim() || undefined,
      whatCaughtAttention: whatCaughtAttention.trim() || undefined,
      howToApply: howToApply.trim() || undefined,
      personalPrayer: personalPrayer.trim() || undefined,
      notes: notes.trim() || undefined,
      relatedActivityId,
      relatedActivityType,
      relatedTitle: relatedTitle || (passage ? `Leitura de ${passage}` : 'Reflexão Espiritual'),
      whatGodSpoke: whatLearned.trim() || notes.trim() || 'Reflexão registrada.',
      practicalApplication: howToApply.trim() || '',
      gratitudeNotes: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="reflection-modal-container"
        className="relative w-full max-w-xl bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] shadow-2xl p-6 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6DF] dark:border-[#24322C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C59B3F]/10 dark:bg-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                {initialReflection ? 'Editar Reflexão Espiritual' : 'Reflexão & Meditação'}
              </h2>
              <p className="text-xs text-[#7D8882] dark:text-[#8E9B93]">
                {relatedTitle ? `Vinculada a: ${relatedTitle}` : 'Guarde no coração o que Deus ministrou ao seu espírito.'}
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

        {/* Lembrete de Liberdade (Não obrigar o usuário a responder) */}
        <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-xs text-[#29523F] dark:text-[#8E9B93] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C59B3F] shrink-0" />
          <span>
            Todos os campos são opcionais. Responda com liberdade apenas ao que desejar compartilhar neste momento.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Data & Passagem Bíblica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Data</span>
              </label>
              <input
                id="reflection-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                <span>Passagem Bíblica (Opcional)</span>
              </label>
              <input
                id="reflection-passage-input"
                type="text"
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                placeholder="Ex: Mateus 5:1-12, Salmo 23"
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
          </div>

          {/* 1. O que aprendi? */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>1. O que aprendi?</span>
              <span className="text-[10px] font-normal text-[#7D8882]">(opcional)</span>
            </label>
            <textarea
              id="reflection-what-learned-input"
              value={whatLearned}
              onChange={(e) => setWhatLearned(e.target.value)}
              rows={2}
              placeholder="A revelação ou princípio bíblico central compreendido..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors resize-none"
            />
          </div>

          {/* 2. O que me chamou atenção? */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <Eye className="w-3.5 h-3.5 text-sky-500" />
              <span>2. O que me chamou atenção?</span>
              <span className="text-[10px] font-normal text-[#7D8882]">(opcional)</span>
            </label>
            <textarea
              id="reflection-what-caught-attention-input"
              value={whatCaughtAttention}
              onChange={(e) => setWhatCaughtAttention(e.target.value)}
              rows={2}
              placeholder="Uma frase, detalhe, atitude de Jesus ou palavra que saltou aos olhos..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors resize-none"
            />
          </div>

          {/* 3. Como posso aplicar? */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-500" />
              <span>3. Como posso aplicar?</span>
              <span className="text-[10px] font-normal text-[#7D8882]">(opcional)</span>
            </label>
            <textarea
              id="reflection-how-to-apply-input"
              value={howToApply}
              onChange={(e) => setHowToApply(e.target.value)}
              rows={2}
              placeholder="Passo prático de obediência, perdão, atitude ou compromisso hoje..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors resize-none"
            />
          </div>

          {/* 4. Oração pessoal */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>4. Oração pessoal</span>
              <span className="text-[10px] font-normal text-[#7D8882]">(opcional)</span>
            </label>
            <textarea
              id="reflection-personal-prayer-input"
              value={personalPrayer}
              onChange={(e) => setPersonalPrayer(e.target.value)}
              rows={2}
              placeholder="Sua resposta em diálogo sincero e íntimo com o Pai..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors resize-none"
            />
          </div>

          {/* 5. Observações */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#7D8882]" />
              <span>5. Observações</span>
              <span className="text-[10px] font-normal text-[#7D8882]">(opcional)</span>
            </label>
            <textarea
              id="reflection-notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Contexto do dia, sentimentos, pensamentos adicionais..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors resize-none"
            />
          </div>

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
              id="save-reflection-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#29523F] dark:bg-[#386650] text-white text-xs font-bold hover:bg-[#1E3D2F] dark:hover:bg-[#29523F] transition-colors shadow-xs"
            >
              Salvar Reflexão na Jornada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
