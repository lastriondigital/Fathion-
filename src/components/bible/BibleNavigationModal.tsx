import React, { useState } from 'react';
import { X, Search, BookOpen, Layers, Check } from 'lucide-react';
import { BibleBook, BibleVersion } from '../../types';
import { BIBLE_BOOKS } from '../../data/bibleData';

interface BibleNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: BibleVersion[];
  selectedVersion: BibleVersion;
  onSelectVersion: (version: BibleVersion) => void;
  selectedBookId: string;
  selectedChapter: number;
  onSelectBookAndChapter: (bookId: string, chapter: number) => void;
}

export const BibleNavigationModal: React.FC<BibleNavigationModalProps> = ({
  isOpen,
  onClose,
  versions,
  selectedVersion,
  onSelectVersion,
  selectedBookId,
  selectedChapter,
  onSelectBookAndChapter
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'versions'>('books');
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'AT' | 'NT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempBookId, setTempBookId] = useState<string>(selectedBookId);

  if (!isOpen) return null;

  const currentBook = BIBLE_BOOKS.find(b => b.id === tempBookId) || BIBLE_BOOKS[0];

  const filteredBooks = BIBLE_BOOKS.filter(book => {
    const matchesTestament = testamentFilter === 'ALL' || book.testament === testamentFilter;
    const matchesQuery = book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesQuery;
  });

  const availableChapters = Object.keys(currentBook.chapters).map(Number);
  // Se o livro tiver chaptersCount maior, podemos gerar lista de capítulos disponíveis
  const chaptersList = availableChapters.length > 0 
    ? availableChapters.sort((a, b) => a - b)
    : Array.from({ length: Math.min(currentBook.chaptersCount, 20) }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#29523F] dark:text-[#4F8E71]" />
            <h3 className="text-base font-bold text-[#162E23] dark:text-[#F1F4F2]">
              Navegar nas Escrituras
            </h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Livros / Versões */}
        <div className="flex border-b border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#111715]">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'books'
                ? 'border-[#29523F] dark:border-[#4F8E71] text-[#29523F] dark:text-[#4F8E71] bg-white dark:bg-[#141C19]'
                : 'border-transparent text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Livros & Capítulos</span>
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'versions'
                ? 'border-[#29523F] dark:border-[#4F8E71] text-[#29523F] dark:text-[#4F8E71] bg-white dark:bg-[#141C19]'
                : 'border-transparent text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Versões da Bíblia ({versions.length})</span>
          </button>
        </div>

        {/* Tab Content: Livros & Capítulos */}
        {activeTab === 'books' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Column: Lista de Livros */}
            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[#E6E6DF] dark:border-[#24322C] flex flex-col overflow-hidden">
              
              {/* Search & Testament Filters */}
              <div className="p-3 border-b border-[#E6E6DF] dark:border-[#24322C] space-y-2 bg-[#FBFBFA] dark:bg-[#111715]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8882]" />
                  <input
                    type="text"
                    placeholder="Filtrar livro..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
                  />
                </div>

                <div className="flex items-center gap-1">
                  {(['ALL', 'AT', 'NT'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTestamentFilter(t)}
                      className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        testamentFilter === t
                          ? 'bg-[#29523F] text-white'
                          : 'bg-white dark:bg-[#141C19] text-[#7D8882] border border-[#E6E6DF] dark:border-[#24322C]'
                      }`}
                    >
                      {t === 'ALL' ? 'Todos' : t === 'AT' ? 'Antigo Test.' : 'Novo Test.'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Books Scroll Area */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#E6E6DF]/40 dark:divide-[#24322C]/40">
                {filteredBooks.map(book => {
                  const isSelected = book.id === tempBookId;
                  return (
                    <button
                      key={book.id}
                      onClick={() => setTempBookId(book.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#F2F7F4] dark:bg-[#1B2521] text-[#29523F] dark:text-[#4F8E71] font-bold border border-[#29523F]/30'
                          : 'text-[#19211D] dark:text-[#F1F4F2] hover:bg-neutral-50 dark:hover:bg-[#1A2320]'
                      }`}
                    >
                      <div>
                        <span>{book.name}</span>
                        <span className="block text-[10px] text-[#7D8882] font-normal">
                          {book.category} • {book.testament}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#24322C] text-[#7D8882]">
                        {Object.keys(book.chapters).length} cap.
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Seletor de Capítulos */}
            <div className="w-full md:w-1/2 flex flex-col p-4 overflow-y-auto bg-white dark:bg-[#141C19]">
              <div className="mb-3 pb-2 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#162E23] dark:text-[#F1F4F2]">
                    {currentBook.name}
                  </h4>
                  <span className="text-[11px] text-[#7D8882]">
                    Selecione o capítulo desejado
                  </span>
                </div>
                <span className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] px-2 py-0.5 rounded-full bg-[#F2F7F4] dark:bg-[#1B2521]">
                  {selectedVersion.abbreviation}
                </span>
              </div>

              {/* Chapters Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {chaptersList.map(ch => {
                  const isCurrent = tempBookId === selectedBookId && ch === selectedChapter;
                  return (
                    <button
                      key={ch}
                      onClick={() => {
                        onSelectBookAndChapter(tempBookId, ch);
                        onClose();
                      }}
                      className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#29523F] text-white shadow-xs scale-105'
                          : 'bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] hover:bg-[#F2F7F4] dark:hover:bg-[#22302A] hover:border-[#29523F]/40'
                      }`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* Tab Content: Versões Bíblicas */
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#141C19]">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-300">
              <span className="font-bold block mb-0.5">Integridade e Licenças Livres</span>
              Todas as 6 versões do Faithion são de Domínio Público ou de Licença Aberta autorizada, respeitando plenamente a lei e os direitos autorais.
            </div>

            <div className="space-y-2">
              {versions.map(ver => {
                const isSelected = ver.id === selectedVersion.id;
                return (
                  <div
                    key={ver.id}
                    onClick={() => {
                      if (ver.available) {
                        onSelectVersion(ver);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#29523F] dark:border-[#4F8E71] bg-[#F2F7F4] dark:bg-[#1B2521]'
                        : 'border-[#E6E6DF] dark:border-[#24322C] hover:bg-[#FBFBFA] dark:hover:bg-[#1A2320]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#162E23] text-white dark:bg-[#2A4C3D]">
                            {ver.abbreviation}
                          </span>
                          <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                            {ver.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#24322C] text-[#7D8882]">
                            {ver.language}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4B554F] dark:text-[#B0BBB5]">
                          {ver.description || ver.origin}
                        </p>
                        <div className="text-[10px] font-semibold text-[#29523F] dark:text-[#4F8E71]">
                          Licença: {ver.license}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#29523F] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
