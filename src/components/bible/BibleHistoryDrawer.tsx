import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Highlighter, 
  FileText, 
  Clock, 
  ChevronRight, 
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  BibleFavorite, 
  BibleHighlight, 
  BibleNote, 
  BibleReadingSession, 
  BibleVersion 
} from '../../types';

interface BibleHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: BibleFavorite[];
  highlights: BibleHighlight[];
  notes: BibleNote[];
  history: BibleReadingSession[];
  onNavigateToPassage: (bookId: string, chapter: number, verseNumber?: number) => void;
  onDeleteNote?: (id: string) => void;
  onRemoveFavorite?: (fav: BibleFavorite) => void;
  onRemoveHighlight?: (verseKey: string) => void;
}

export const BibleHistoryDrawer: React.FC<BibleHistoryDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  highlights,
  notes,
  history,
  onNavigateToPassage,
  onDeleteNote,
  onRemoveFavorite,
  onRemoveHighlight
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'highlights' | 'notes' | 'history'>('favorites');

  if (!isOpen) return null;

  const colorBadgeClass = (color: string) => {
    switch (color) {
      case 'gold': return 'bg-amber-300 dark:bg-amber-500';
      case 'emerald': return 'bg-emerald-300 dark:bg-emerald-500';
      case 'azure': return 'bg-sky-300 dark:bg-sky-500';
      case 'rose': return 'bg-rose-300 dark:bg-rose-500';
      default: return 'bg-amber-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#141C19] border-l border-[#E6E6DF] dark:border-[#24322C] w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#162E23] dark:text-[#F1F4F2]">
            Acervo Pessoal das Escrituras
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#111715]">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'favorites'
                ? 'border-[#29523F] text-[#29523F] dark:border-[#4F8E71] dark:text-[#4F8E71] bg-white dark:bg-[#141C19]'
                : 'border-transparent text-[#7D8882]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Favoritos ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('highlights')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'highlights'
                ? 'border-[#29523F] text-[#29523F] dark:border-[#4F8E71] dark:text-[#4F8E71] bg-white dark:bg-[#141C19]'
                : 'border-transparent text-[#7D8882]'
            }`}
          >
            <Highlighter className="w-4 h-4" />
            <span>Destaques ({highlights.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'notes'
                ? 'border-[#29523F] text-[#29523F] dark:border-[#4F8E71] dark:text-[#4F8E71] bg-white dark:bg-[#141C19]'
                : 'border-transparent text-[#7D8882]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notas ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'history'
                ? 'border-[#29523F] text-[#29523F] dark:border-[#4F8E71] dark:text-[#4F8E71] bg-white dark:bg-[#141C19]'
                : 'border-transparent text-[#7D8882]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Histórico ({history.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFBFA] dark:bg-[#111715]">
          
          {/* TAB: FAVORITOS */}
          {activeTab === 'favorites' && (
            favorites.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7D8882]">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Nenhum versículo favoritado ainda.</p>
                <p className="mt-1">Toque em qualquer versículo enquanto lê para favoritá-lo.</p>
              </div>
            ) : (
              favorites.map(fav => (
                <div
                  key={fav.id}
                  className="p-3.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] space-y-2 hover:border-[#29523F]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71]">
                      {fav.bookName} {fav.chapter}:{fav.verseNumber}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#24322C] text-[#7D8882]">
                      {fav.versionId.toUpperCase()}
                    </span>
                  </div>

                  <p className="font-serif-scripture text-xs leading-relaxed text-[#19211D] dark:text-[#F1F4F2]">
                    "{fav.verseText}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#E6E6DF]/50 dark:border-[#24322C]/50">
                    <span className="text-[10px] text-[#7D8882]">
                      Salvo em {new Date(fav.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <button
                      onClick={() => {
                        onNavigateToPassage(fav.bookId, fav.chapter, fav.verseNumber);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline flex items-center gap-1"
                    >
                      <span>Abrir na Bíblia</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB: DESTAQUES */}
          {activeTab === 'highlights' && (
            highlights.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7D8882]">
                <Highlighter className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Nenhum destaque salvo ainda.</p>
                <p className="mt-1">Destaque trechos com 4 cores para organizar sua leitura devocional.</p>
              </div>
            ) : (
              highlights.map(hl => (
                <div
                  key={hl.id}
                  className="p-3.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] flex items-center justify-between gap-3 hover:border-[#29523F]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${colorBadgeClass(hl.color)}`} />
                    <div>
                      <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] capitalize">
                        {hl.bookId} {hl.chapter}:{hl.verseNumber}
                      </span>
                      <span className="block text-[10px] text-[#7D8882]">
                        Marcado em {new Date(hl.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onNavigateToPassage(hl.bookId, hl.chapter, hl.verseNumber);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline flex items-center gap-1"
                    >
                      <span>Ler</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {onRemoveHighlight && (
                      <button
                        onClick={() => onRemoveHighlight(hl.verseKey)}
                        className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Remover marcador"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB: NOTAS */}
          {activeTab === 'notes' && (
            notes.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7D8882]">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Nenhuma anotação bíblica registrada.</p>
                <p className="mt-1">Anote revelações e aplicações práticas nos versículos.</p>
              </div>
            ) : (
              notes.map(note => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] space-y-2 hover:border-[#29523F]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71]">
                      {note.bookName} {note.chapter}{note.verseNumber ? `:${note.verseNumber}` : ''}
                    </span>
                    <span className="text-[10px] text-[#7D8882]">
                      {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <p className="text-xs text-[#19211D] dark:text-[#F1F4F2] leading-relaxed">
                    {note.noteText}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#E6E6DF]/50 dark:border-[#24322C]/50">
                    <button
                      onClick={() => {
                        onNavigateToPassage(note.bookId, note.chapter, note.verseNumber);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline flex items-center gap-1"
                    >
                      <span>Abrir passagem</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {onDeleteNote && (
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Excluir nota</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB: HISTÓRICO DE LEITURA */}
          {activeTab === 'history' && (
            history.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7D8882]">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Nenhuma sessão de leitura registrada ainda.</p>
                <p className="mt-1">Ao concluir uma leitura no Faithion, o registro é salvo automaticamente.</p>
              </div>
            ) : (
              history.map(sess => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] space-y-1.5 hover:border-[#29523F]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#162E23] dark:text-[#F1F4F2]">
                      {sess.passageRef}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold">
                      {sess.versionAbbr || sess.versionId.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#7D8882]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {sess.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sess.durationMinutes} min lidos
                    </span>
                  </div>

                  {sess.relatedPlanTitle && (
                    <div className="text-[10px] text-[#29523F] dark:text-[#4F8E71] font-semibold">
                      Plano: {sess.relatedPlanTitle}
                    </div>
                  )}

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        onNavigateToPassage(sess.bookId, sess.chapter);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] hover:underline flex items-center gap-1"
                    >
                      <span>Reler capítulo</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

        </div>

      </div>
    </div>
  );
};
