import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Star, 
  BookOpen, 
  Calendar, 
  HeartHandshake, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Check, 
  ExternalLink,
  Copy,
  Sparkles
} from 'lucide-react';
import { WordOfTheDayHistoryItem, WordOfTheDay } from '../../types';

interface WordOfDayHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: WordOfTheDayHistoryItem[];
  onToggleFavorite: (wordId: string) => void;
  onSaveReflection: (wordId: string, reflectionText: string) => void;
  onOpenBible?: (bookId: string, chapter: number) => void;
  onOpenPrayer?: (ref: string, text: string) => void;
}

export const WordOfDayHistoryModal: React.FC<WordOfDayHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onToggleFavorite,
  onSaveReflection,
  onOpenBible,
  onOpenPrayer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'with_reflections'>('all');
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);
  const [editingReflectionId, setEditingReflectionId] = useState<string | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filtragem
  const filteredHistory = history.filter(item => {
    const word = item.word;
    const matchesSearch = 
      word.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.passage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.userReflection && item.userReflection.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'favorites') return item.isFavorite;
    if (filterType === 'with_reflections') return Boolean(item.userReflection && item.userReflection.trim());
    return true;
  });

  const handleCopy = (item: WordOfTheDayHistoryItem) => {
    const textToCopy = `"${item.word.passage}"\n— ${item.word.reference} (${item.word.version})\n\nTema: ${item.word.theme}\nAplicação: ${item.word.practicalApplication}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleStartEditReflection = (item: WordOfTheDayHistoryItem) => {
    setEditingReflectionId(item.wordId);
    setReflectionDraft(item.userReflection || '');
  };

  const handleSaveReflectionDraft = (wordId: string) => {
    onSaveReflection(wordId, reflectionDraft);
    setEditingReflectionId(null);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
      return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#141C19] w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
              <Sparkles className="w-5 h-5 text-[#C59B3F]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Histórico de Palavras do Dia
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Consulte as passagens e meditações apresentadas em dias anteriores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-[#16201B] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por versículo, livro, tema ou reflexão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-[#1B2521] border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#29523F] dark:focus:ring-[#4F8E71] text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-[#162E23] text-white'
                  : 'bg-white dark:bg-[#1B2521] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Todas ({history.length})
            </button>
            <button
              onClick={() => setFilterType('favorites')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                filterType === 'favorites'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-[#1B2521] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Favoritas ({history.filter(h => h.isFavorite).length})</span>
            </button>
            <button
              onClick={() => setFilterType('with_reflections')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                filterType === 'with_reflections'
                  ? 'bg-[#29523F] text-white'
                  : 'bg-white dark:bg-[#1B2521] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Minhas Reflexões ({history.filter(h => h.userReflection?.trim()).length})</span>
            </button>
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800/80">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm font-semibold">Nenhuma palavra encontrada</p>
              <p className="text-xs max-w-sm mx-auto">
                Tente alterar os termos de busca ou filtros para localizar palavras anteriores.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const word = item.word;
              const isExpanded = expandedWordId === item.id;
              const isEditing = editingReflectionId === item.wordId;

              return (
                <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="flex items-center gap-1 font-semibold text-neutral-500 dark:text-neutral-400">
                          <Calendar className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                          {formatDateDisplay(item.date)}
                        </span>
                        <span className="font-bold px-2 py-0.5 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
                          {word.reference} ({word.version})
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50">
                          {word.theme}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(item.wordId)}
                        className={`p-1.5 rounded-lg transition-all ${
                          item.isFavorite
                            ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                            : 'text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                        title={item.isFavorite ? 'Remover dos favoritos' : 'Marcar como favorita'}
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleCopy(item)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Copiar versículo"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Citação Bíblica */}
                  <blockquote className="font-serif-scripture text-sm sm:text-base text-neutral-800 dark:text-neutral-200 italic p-3.5 rounded-xl bg-neutral-50 dark:bg-[#18221D] border-l-3 border-[#C59B3F]">
                    "{word.passage}"
                  </blockquote>

                  {/* Reflexão do Usuário (se houver ou se editando) */}
                  {item.userReflection && !isEditing && (
                    <div className="p-3 rounded-xl bg-[#F4F9F6] dark:bg-[#192721] border border-[#29523F]/20 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#29523F] dark:text-[#4F8E71] flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Minha Reflexão Pessoal:
                        </span>
                        <button
                          onClick={() => handleStartEditReflection(item)}
                          className="text-[11px] text-[#162E23] dark:text-[#4F8E71] font-semibold hover:underline"
                        >
                          Editar
                        </button>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {item.userReflection}
                      </p>
                    </div>
                  )}

                  {isEditing && (
                    <div className="p-3 rounded-xl bg-[#F4F9F6] dark:bg-[#192721] border border-[#29523F]/30 space-y-2">
                      <label className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] block">
                        Anotar o que esta Palavra representou para mim:
                      </label>
                      <textarea
                        value={reflectionDraft}
                        onChange={(e) => setReflectionDraft(e.target.value)}
                        placeholder="Escreva sua oração ou aprendizado sobre esta passagem..."
                        className="w-full p-2.5 rounded-lg text-xs bg-white dark:bg-[#141C19] border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#29523F] dark:text-neutral-100"
                        rows={3}
                      />
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          onClick={() => setEditingReflectionId(null)}
                          className="px-3 py-1 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveReflectionDraft(item.wordId)}
                          className="px-3 py-1 rounded-lg bg-[#162E23] text-white font-semibold hover:bg-[#29523F]"
                        >
                          Salvar Reflexão
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Detalhes Expandidos (Contexto, Reflexão Teológica, Perguntas, Aplicação) */}
                  {isExpanded && (
                    <div className="p-4 rounded-xl bg-white dark:bg-[#151E1A] border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs animate-in fade-in duration-150">
                      <div>
                        <strong className="text-[#29523F] dark:text-[#4F8E71] block mb-0.5">
                          Contexto Bíblico & Histórico:
                        </strong>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {word.context}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <strong className="text-[#162E23] dark:text-[#4F8E71] block mb-0.5">
                          Reflexão & Meditação Temática:
                        </strong>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          {word.reflection}
                        </p>
                      </div>

                      {word.questions && word.questions.length > 0 && (
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <strong className="text-[#C59B3F] block mb-1">
                            Perguntas para Meditação:
                          </strong>
                          <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                            {word.questions.map((q, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span>•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <strong className="text-amber-700 dark:text-amber-400 block mb-0.5">
                          Sugestão Prática:
                        </strong>
                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          {word.practicalApplication}
                        </p>
                      </div>

                      {word.optionalPrayer && (
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">
                            Oração de Resposta:
                          </strong>
                          <p className="italic text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            "{word.optionalPrayer}"
                          </p>
                        </div>
                      )}

                      <div className="text-[10px] text-neutral-400 dark:text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <span>Fonte: {word.contentSource.bibleSource}</span>
                        <span>{word.contentSource.commentarySource}</span>
                      </div>
                    </div>
                  )}

                  {/* Ações da Linha */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <button
                      onClick={() => setExpandedWordId(isExpanded ? null : item.id)}
                      className="text-[#29523F] dark:text-[#4F8E71] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Ocultar detalhes' : 'Ver reflexão completa e contexto'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      {!item.userReflection && !isEditing && (
                        <button
                          onClick={() => handleStartEditReflection(item)}
                          className="text-[#162E23] dark:text-[#4F8E71] font-semibold hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Escrever nota</span>
                        </button>
                      )}

                      {onOpenBible && (
                        <button
                          onClick={() => {
                            onOpenBible(word.bookId, word.chapter);
                            onClose();
                          }}
                          className="text-neutral-600 dark:text-neutral-400 hover:text-[#162E23] dark:hover:text-[#4F8E71] font-semibold flex items-center gap-1"
                        >
                          <span>Bíblia</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}

                      {onOpenPrayer && (
                        <button
                          onClick={() => {
                            onOpenPrayer(word.reference, word.passage);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] font-semibold hover:bg-[#D5E6DC] transition-all flex items-center gap-1"
                        >
                          <HeartHandshake className="w-3 h-3" />
                          <span>Orar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#16201B] flex items-center justify-between text-xs text-neutral-500">
          <span>{filteredHistory.length} palavra(s) no histórico</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
