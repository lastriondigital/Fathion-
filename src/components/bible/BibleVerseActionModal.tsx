import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  Copy, 
  FileText, 
  Layers, 
  HeartHandshake, 
  Sparkles, 
  Check, 
  Trash2,
  Edit3
} from 'lucide-react';
import { BibleVerse, HighlightColor, BibleNote, BibleVersion } from '../../types';

interface BibleVerseActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: BibleVerse | null;
  bookName: string;
  bookId: string;
  chapter: number;
  currentVersion: BibleVersion;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  currentHighlightColor: HighlightColor | null;
  onSetHighlight: (color: HighlightColor) => void;
  onRemoveHighlight: () => void;
  existingNote?: BibleNote;
  onSaveNote: (noteText: string) => void;
  onDeleteNote?: () => void;
  onOpenComparison: () => void;
  onOpenPrayerWithVerse: (text: string, ref: string) => void;
  onCreateReflectionWithVerse: (text: string, ref: string) => void;
  onSetAsWordOfDay?: (text: string, ref: string) => void;
}

export const BibleVerseActionModal: React.FC<BibleVerseActionModalProps> = ({
  isOpen,
  onClose,
  verse,
  bookName,
  bookId,
  chapter,
  currentVersion,
  isFavorite,
  onToggleFavorite,
  currentHighlightColor,
  onSetHighlight,
  onRemoveHighlight,
  existingNote,
  onSaveNote,
  onDeleteNote,
  onOpenComparison,
  onOpenPrayerWithVerse,
  onCreateReflectionWithVerse,
  onSetAsWordOfDay
}) => {
  const [copiedType, setCopiedType] = useState<'all' | 'ref' | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(existingNote?.noteText || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen || !verse) return null;

  const verseRef = `${bookName} ${chapter}:${verse.number}`;
  const formattedQuote = `"${verse.text}" — ${verseRef} (${currentVersion.abbreviation})`;

  const handleCopy = (type: 'all' | 'ref') => {
    const textToCopy = type === 'all' ? formattedQuote : `${verseRef} (${currentVersion.abbreviation})`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onSaveNote(noteText.trim());
    setIsEditingNote(false);
    setStatusMessage('Nota salva com sucesso.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const colors: { id: HighlightColor; label: string; bgClass: string; borderClass: string }[] = [
    { id: 'gold', label: 'Dourado', bgClass: 'bg-amber-300 dark:bg-amber-500', borderClass: 'border-amber-500' },
    { id: 'emerald', label: 'Verde', bgClass: 'bg-emerald-300 dark:bg-emerald-500', borderClass: 'border-emerald-500' },
    { id: 'azure', label: 'Azul', bgClass: 'bg-sky-300 dark:bg-sky-500', borderClass: 'border-sky-500' },
    { id: 'rose', label: 'Rosa', bgClass: 'bg-rose-300 dark:bg-rose-500', borderClass: 'border-rose-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71]">
              {currentVersion.abbreviation} • {currentVersion.name}
            </span>
            <h3 className="text-base font-bold text-[#162E23] dark:text-[#F1F4F2]">
              {verseRef}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          
          {/* Verse Text Card */}
          <div className="p-4 rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C]">
            <p className="font-serif-scripture text-base sm:text-lg leading-relaxed text-[#19211D] dark:text-[#F1F4F2]">
              "{verse.text}"
            </p>
          </div>

          {/* Feedback message */}
          {statusMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Section: Marcadores de Cor (Highlights) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#7D8882] uppercase tracking-wider">
                Marcador de Leitura
              </label>
              {currentHighlightColor && (
                <button
                  onClick={() => {
                    onRemoveHighlight();
                    setStatusMessage('Destaque removido');
                    setTimeout(() => setStatusMessage(null), 2000);
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remover destaque</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {colors.map(c => {
                const isSelected = currentHighlightColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSetHighlight(c.id);
                      setStatusMessage(`Marcado com ${c.label}`);
                      setTimeout(() => setStatusMessage(null), 2000);
                    }}
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'ring-2 ring-[#29523F] ring-offset-2 scale-105 font-bold shadow-xs'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${c.bgClass}`} />
                    <span className="text-xs text-[#19211D] dark:text-[#F1F4F2]">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Ações Primárias (Favorito, Copiar, Comparar) */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Favorito */}
            <button
              onClick={() => {
                onToggleFavorite();
                setStatusMessage(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
                setTimeout(() => setStatusMessage(null), 2000);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
            </button>

            {/* Comparar Versões */}
            <button
              onClick={() => {
                onClose();
                onOpenComparison();
              }}
              className="p-3 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521] flex items-center justify-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
              <span>Comparar Versões</span>
            </button>

            {/* Copiar Texto + Ref */}
            <button
              onClick={() => handleCopy('all')}
              className="p-3 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521] flex items-center justify-center gap-2 transition-colors"
            >
              {copiedType === 'all' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'all' ? 'Texto Copiado!' : 'Copiar Texto'}</span>
            </button>

            {/* Copiar Apenas Referência */}
            <button
              onClick={() => handleCopy('ref')}
              className="p-3 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521] flex items-center justify-center gap-2 transition-colors"
            >
              {copiedType === 'ref' ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedType === 'ref' ? 'Ref. Copiada!' : 'Copiar Ref.'}</span>
            </button>

          </div>

          {/* Section: Notas Pessoais */}
          <div className="p-3.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#111715] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                <FileText className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                <span>Nota Pessoal / Comentário Devocional</span>
              </div>
              {existingNote && !isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-[11px] font-semibold text-[#29523F] dark:text-[#4F8E71] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            {isEditingNote || !existingNote ? (
              <form onSubmit={handleSaveNoteSubmit} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Escreva sua reflexão, revelação ou anotação pessoal sobre este versículo..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-xs bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F] resize-none"
                />
                <div className="flex items-center justify-end gap-2">
                  {existingNote && (
                    <button
                      type="button"
                      onClick={() => setIsEditingNote(false)}
                      className="px-3 py-1 rounded-lg text-xs text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-[#162E23] dark:bg-[#2A4C3D] text-white hover:bg-[#1F3F30]"
                  >
                    Salvar Nota
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                {existingNote.noteText}
              </div>
            )}
          </div>

          {/* Section: Integração com a Vida Espiritual */}
          <div className="space-y-2 pt-2 border-t border-[#E6E6DF] dark:border-[#24322C]">
            <label className="text-xs font-bold text-[#7D8882] uppercase tracking-wider block">
              Integração com Práticas
            </label>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenPrayerWithVerse(verse.text, verseRef);
                }}
                className="w-full p-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] hover:bg-[#E5EFEA] dark:hover:bg-[#22302A] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
                  <span>Orar com este Versículo</span>
                </div>
                <span className="text-[10px] text-[#29523F] dark:text-[#4F8E71] font-semibold">
                  Iniciar Oração →
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onCreateReflectionWithVerse(verse.text, verseRef);
                }}
                className="w-full p-3 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2521] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#C59B3F]" />
                  <span>Criar Reflexão no Diário Espiritual</span>
                </div>
                <span className="text-[10px] text-[#7D8882] font-semibold">
                  Registrar →
                </span>
              </button>

              {onSetAsWordOfDay && (
                <button
                  onClick={() => {
                    onSetAsWordOfDay(verse.text, verseRef);
                    setStatusMessage('Definido como Palavra de Meditação!');
                    setTimeout(() => {
                      setStatusMessage(null);
                      onClose();
                    }, 1500);
                  }}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] hover:bg-[#FBFBFA] dark:hover:bg-[#1B2521] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Definir como Minha Palavra do Dia</span>
                  </div>
                  <span className="text-[10px] text-[#7D8882] font-semibold">
                    Meditar →
                  </span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
