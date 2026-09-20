import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Share2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Type,
  Maximize2,
  Minimize2,
  Clock,
  Layers,
  Sparkles,
  HeartHandshake,
  FileText,
  Copy,
  FolderHeart,
  RotateCcw,
  CheckCircle2,
  Settings,
  Highlighter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { 
  BibleBook, 
  BibleVerse, 
  BibleVersion, 
  BibleHighlight, 
  HighlightColor, 
  BibleFavorite, 
  BibleNote, 
  BibleFontSize, 
  BibleFontFamily,
  ReadingPlan,
  Reflection,
  NavTabId
} from '../types';
import { BIBLE_BOOKS, INITIAL_VERSE_OF_THE_DAY } from '../data/bibleData';
import { bibleVersionRegistry } from '../data/bibleVersions';
import { getChapterVersesForVersion } from '../data/multiVersionBible';
import { FaithionStorageService } from '../services/storage';
import { BibleNavigationModal } from '../components/bible/BibleNavigationModal';
import { BibleVerseActionModal } from '../components/bible/BibleVerseActionModal';
import { BibleComparisonModal } from '../components/bible/BibleComparisonModal';
import { BibleHistoryDrawer } from '../components/bible/BibleHistoryDrawer';
import { BibleCompleteReadingModal } from '../components/bible/BibleCompleteReadingModal';

interface BibleViewProps {
  onOpenPrayerWithVerse?: (verseText: string, ref: string) => void;
  onOpenFastingWithPassage?: (passageRef: string) => void;
  onSaveReflection?: (reflection: Omit<Reflection, 'id' | 'createdAt'>) => void;
  onNavigateToTab?: (tab: NavTabId) => void;
  activeReadingPlan?: ReadingPlan | null;
  onSetVerseOfDay?: (ref: string, text: string) => void;
  initialBookId?: string;
  initialChapter?: number;
  initialVersionId?: string;
}

export const BibleView: React.FC<BibleViewProps> = ({ 
  onOpenPrayerWithVerse,
  onOpenFastingWithPassage,
  onSaveReflection,
  onNavigateToTab,
  activeReadingPlan,
  onSetVerseOfDay,
  initialBookId,
  initialChapter,
  initialVersionId
}) => {
  // Versions Registry
  const [versions] = useState<BibleVersion[]>(() => bibleVersionRegistry.getAvailableVersions());
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>(() => {
    return versions[0] || {
      id: 'arc',
      name: 'Almeida Revista e Corrigida',
      abbreviation: 'ARC',
      language: 'Português',
      origin: 'Domínio Público',
      license: 'Domínio Público',
      available: true,
      order: 1
    };
  });

  // Last read position
  const lastReadPosition = FaithionStorageService.getLastRead();

  // Navigation State
  const [selectedBookId, setSelectedBookId] = useState<string>(
    initialBookId || lastReadPosition?.bookId || 'romanos'
  );
  const [selectedChapter, setSelectedChapter] = useState<number>(
    initialChapter || lastReadPosition?.chapter || 8
  );

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reader Preferences (Storage Persisted)
  const [fontSize, setFontSize] = useState<BibleFontSize>(() => 
    FaithionStorageService.getBibleSettings().fontSize
  );
  const [fontFamily, setFontFamily] = useState<BibleFontFamily>(() => 
    FaithionStorageService.getBibleSettings().fontFamily
  );
  const [focusMode, setFocusMode] = useState<boolean>(() => 
    FaithionStorageService.getBibleSettings().focusMode
  );

  // Reading Timer (Minutes in current session)
  const [sessionStartTime] = useState<number>(Date.now());
  const [readingElapsedMinutes, setReadingElapsedMinutes] = useState<number>(1);

  // Storage State: Highlights, Favorites, Notes, History
  const [highlightsList, setHighlightsList] = useState<BibleHighlight[]>(() => 
    FaithionStorageService.getBibleHighlightsList()
  );
  const [favoritesList, setFavoritesList] = useState<BibleFavorite[]>(() => 
    FaithionStorageService.getBibleFavorites()
  );
  const [notesList, setNotesList] = useState<BibleNote[]>(() => 
    FaithionStorageService.getBibleNotes()
  );
  const [historyList, setHistoryList] = useState(() => 
    FaithionStorageService.getBibleReadingHistory()
  );

  // Modals & Drawers
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [activeVerseForModal, setActiveVerseForModal] = useState<BibleVerse | null>(null);
  const [comparisonVerseNum, setComparisonVerseNum] = useState<number | null>(null);

  // Copy feedback notification
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Timer interval for tracking active reading session
  useEffect(() => {
    const timer = setInterval(() => {
      const mins = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));
      setReadingElapsedMinutes(mins);
    }, 15000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Persist font preferences
  useEffect(() => {
    FaithionStorageService.saveBibleSettings({
      fontSize,
      fontFamily,
      lineSpacing: 'relaxed',
      focusMode
    });
  }, [fontSize, fontFamily, focusMode]);

  // Update navigation when props change (e.g. from Reading Plans)
  useEffect(() => {
    if (initialBookId) setSelectedBookId(initialBookId);
    if (initialChapter) setSelectedChapter(initialChapter);
    if (initialVersionId) {
      const match = versions.find(v => v.id.toLowerCase() === initialVersionId.toLowerCase());
      if (match) setSelectedVersion(match);
    }
  }, [initialBookId, initialChapter, initialVersionId, versions]);

  // Update last read when book/chapter changes
  useEffect(() => {
    FaithionStorageService.saveLastRead({
      bookId: selectedBookId,
      chapter: selectedChapter,
      versionId: selectedVersion.id,
      timestamp: new Date().toISOString()
    });
  }, [selectedBookId, selectedChapter, selectedVersion.id]);

  // Scroll to top smoothly on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedBookId, selectedChapter]);

  const currentBook = BIBLE_BOOKS.find(b => b.id === selectedBookId) || BIBLE_BOOKS[0];
  const verses: BibleVerse[] = getChapterVersesForVersion(selectedVersion.id, selectedBookId, selectedChapter);

  // Highlight Map for quick lookups
  const highlightMap: Record<number, HighlightColor> = {};
  highlightsList.forEach(hl => {
    if (hl.bookId === selectedBookId && hl.chapter === selectedChapter) {
      highlightMap[hl.verseNumber] = hl.color;
    }
  });

  // Favorite Map for quick lookups
  const favoriteMap: Record<number, boolean> = {};
  favoritesList.forEach(fav => {
    if (fav.bookId === selectedBookId && fav.chapter === selectedChapter) {
      favoriteMap[fav.verseNumber] = true;
    }
  });

  // Note Map for quick lookups
  const noteMap: Record<number, BibleNote> = {};
  notesList.forEach(note => {
    if (note.bookId === selectedBookId && note.chapter === selectedChapter && note.verseNumber) {
      noteMap[note.verseNumber] = note;
    }
  });

  // Search in all books
  const searchResults = searchQuery.trim().length >= 2 
    ? BIBLE_BOOKS.flatMap(book => {
        return Object.entries(book.chapters).flatMap(([chapStr, chapterVerses]) => {
          return chapterVerses
            .filter(v => v.text.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(v => ({
              bookName: book.name,
              bookId: book.id,
              chapter: Number(chapStr),
              verseNumber: v.number,
              text: v.text
            }));
        });
      })
    : [];

  // Font size styling
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm leading-relaxed';
      case 'large': return 'text-lg sm:text-xl leading-relaxed';
      case 'xlarge': return 'text-xl sm:text-2xl leading-loose';
      default: return 'text-base sm:text-lg leading-relaxed';
    }
  };

  const getFontFamilyClass = () => {
    return fontFamily === 'serif' ? 'font-serif-scripture' : 'font-sans-ui';
  };

  const colorHighlightClass = (color?: HighlightColor) => {
    switch (color) {
      case 'gold': return 'bg-amber-100/90 dark:bg-amber-950/40 border-l-4 border-amber-500';
      case 'emerald': return 'bg-emerald-100/90 dark:bg-emerald-950/40 border-l-4 border-emerald-500';
      case 'azure': return 'bg-sky-100/90 dark:bg-sky-950/40 border-l-4 border-sky-500';
      case 'rose': return 'bg-rose-100/90 dark:bg-rose-950/40 border-l-4 border-rose-500';
      default: return 'hover:bg-[#FBFBFA] dark:hover:bg-[#1A2320]';
    }
  };

  // Handlers for verse actions
  const handleToggleFavorite = (verse: BibleVerse) => {
    FaithionStorageService.toggleBibleFavorite({
      bookId: selectedBookId,
      bookName: currentBook.name,
      chapter: selectedChapter,
      verseNumber: verse.number,
      verseText: verse.text,
      versionId: selectedVersion.id
    });
    setFavoritesList(FaithionStorageService.getBibleFavorites());
  };

  const handleSetHighlight = (verse: BibleVerse, color: HighlightColor) => {
    const verseKey = `${selectedBookId}-${selectedChapter}-${verse.number}`;
    FaithionStorageService.saveBibleHighlight({
      verseKey,
      bookId: selectedBookId,
      chapter: selectedChapter,
      verseNumber: verse.number,
      color,
      versionId: selectedVersion.id
    });
    setHighlightsList(FaithionStorageService.getBibleHighlightsList());
  };

  const handleRemoveHighlight = (verse: BibleVerse) => {
    const verseKey = `${selectedBookId}-${selectedChapter}-${verse.number}`;
    FaithionStorageService.removeBibleHighlight(verseKey);
    setHighlightsList(FaithionStorageService.getBibleHighlightsList());
  };

  const handleSaveNote = (verseNumber: number, noteText: string) => {
    FaithionStorageService.saveBibleNote({
      bookId: selectedBookId,
      bookName: currentBook.name,
      chapter: selectedChapter,
      verseNumber,
      noteText,
      versionId: selectedVersion.id,
      id: noteMap[verseNumber]?.id
    });
    setNotesList(FaithionStorageService.getBibleNotes());
  };

  const handleDeleteNote = (id: string) => {
    FaithionStorageService.deleteBibleNote(id);
    setNotesList(FaithionStorageService.getBibleNotes());
  };

  const handleCopyChapter = () => {
    const formatted = verses.map(v => `${v.number}. ${v.text}`).join('\n\n');
    const header = `${currentBook.name} ${selectedChapter} (${selectedVersion.abbreviation})\n\n`;
    navigator.clipboard?.writeText(header + formatted);
    setCopiedNotification('Capítulo inteiro copiado para a área de transferência!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Conclusion of reading
  const handleConfirmCompleteReading = (relatedPlanId?: string, planDayNumber?: number) => {
    const session = FaithionStorageService.recordBibleReadingSession({
      bookId: selectedBookId,
      bookName: currentBook.name,
      chapter: selectedChapter,
      versionId: selectedVersion.id,
      versionAbbr: selectedVersion.abbreviation,
      passageRef: `${currentBook.name} ${selectedChapter}`,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date(sessionStartTime).toISOString(),
      durationMinutes: readingElapsedMinutes,
      relatedPlanId,
      relatedPlanTitle: activeReadingPlan?.title,
      relatedPlanDayNumber: planDayNumber
    });
    setHistoryList(FaithionStorageService.getBibleReadingHistory());
    setCopiedNotification(`Leitura de ${currentBook.name} ${selectedChapter} concluída e registrada com sucesso!`);
    setTimeout(() => setCopiedNotification(null), 4000);
  };

  const handleNextChapter = () => {
    const availableChapters = Object.keys(currentBook.chapters).map(Number).sort((a, b) => a - b);
    const currentIndex = availableChapters.indexOf(selectedChapter);
    if (currentIndex >= 0 && currentIndex < availableChapters.length - 1) {
      setSelectedChapter(availableChapters[currentIndex + 1]);
    } else {
      // Próximo livro
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === selectedBookId);
      if (bookIndex >= 0 && bookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIndex + 1];
        setSelectedBookId(nextBook.id);
        const nextChapters = Object.keys(nextBook.chapters).map(Number);
        setSelectedChapter(nextChapters[0] || 1);
      }
    }
  };

  const handlePrevChapter = () => {
    const availableChapters = Object.keys(currentBook.chapters).map(Number).sort((a, b) => a - b);
    const currentIndex = availableChapters.indexOf(selectedChapter);
    if (currentIndex > 0) {
      setSelectedChapter(availableChapters[currentIndex - 1]);
    } else {
      // Livro anterior
      const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === selectedBookId);
      if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        setSelectedBookId(prevBook.id);
        const prevChapters = Object.keys(prevBook.chapters).map(Number).sort((a, b) => a - b);
        setSelectedChapter(prevChapters[prevChapters.length - 1] || 1);
      }
    }
  };

  return (
    <div className={`space-y-6 max-w-4xl mx-auto pb-16 transition-all ${focusMode ? 'pt-4' : ''}`}>
      
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#162E23] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Top Controls & Navigation Bar */}
      <div className={`p-4 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${focusMode ? 'opacity-30 hover:opacity-100 transition-opacity' : ''}`}>
        
        {/* Book, Chapter & Version Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsNavModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-xs font-bold text-[#162E23] dark:text-[#F1F4F2] hover:bg-[#E5EFEA] dark:hover:bg-[#22302A] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
            <span>{currentBook.name} {selectedChapter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7D8882]" />
          </button>

          <button
            onClick={() => setIsNavModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-neutral-100 dark:bg-[#24322C] text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] hover:bg-neutral-200 dark:hover:bg-[#2C3B34] transition-colors"
            title="Mudar Versão da Bíblia"
          >
            <Layers className="w-3.5 h-3.5 text-[#7D8882]" />
            <span>{selectedVersion.abbreviation}</span>
          </button>

          {/* Acervo Pessoal (Favoritos, Notas, Destaques, Histórico) */}
          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] hover:bg-neutral-50 dark:hover:bg-[#1B2521] text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] transition-colors"
          >
            <FolderHeart className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span className="hidden sm:inline">Acervo Pessoal</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-[#24322C] text-[#7D8882]">
              {favoritesList.length + highlightsList.length + notesList.length}
            </span>
          </button>
        </div>

        {/* Action Controls: Search, Typography, Zen Focus, Complete */}
        <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8882]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar versículo..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          {/* Typography Controls */}
          <div className="flex items-center rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] p-0.5">
            <button
              onClick={() => setFontSize('small')}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${fontSize === 'small' ? 'bg-white dark:bg-[#29523F] font-bold shadow-2xs' : 'text-[#7D8882]'}`}
              title="Fonte Pequena"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${fontSize === 'normal' ? 'bg-white dark:bg-[#29523F] font-bold shadow-2xs' : 'text-[#7D8882]'}`}
              title="Fonte Normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${fontSize === 'large' ? 'bg-white dark:bg-[#29523F] font-bold shadow-2xs' : 'text-[#7D8882]'}`}
              title="Fonte Grande"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${fontSize === 'xlarge' ? 'bg-white dark:bg-[#29523F] font-bold shadow-2xs' : 'text-[#7D8882]'}`}
              title="Fonte Extra Grande"
            >
              A++
            </button>
          </div>

          {/* Serif / Sans Toggle */}
          <button
            onClick={() => setFontFamily(prev => prev === 'serif' ? 'sans' : 'serif')}
            className={`p-1.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] text-xs font-bold transition-colors ${
              fontFamily === 'serif'
                ? 'bg-white dark:bg-[#1B2521] text-[#29523F] dark:text-[#4F8E71]'
                : 'bg-[#F2F7F4] dark:bg-[#24322C] text-[#19211D]'
            }`}
            title={fontFamily === 'serif' ? 'Alternar para Sem Serifa' : 'Alternar para Serifa Clássica'}
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Zen / Focus Mode Toggle */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`p-1.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] transition-colors ${
              focusMode
                ? 'bg-[#29523F] text-white'
                : 'text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]'
            }`}
            title={focusMode ? 'Sair do Modo Foco' : 'Modo Foco / Leitura Serena'}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Botão Primário: CONCLUIR LEITURA */}
          <button
            onClick={() => setIsCompleteModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#162E23] dark:bg-[#224535] text-white hover:bg-[#1F3F30] flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Concluir Leitura</span>
          </button>

        </div>
      </div>

      {/* Banner de "Continuar Leitura" caso o usuário esteja em passagem diferente da última leitura */}
      {lastReadPosition && 
       (lastReadPosition.bookId !== selectedBookId || lastReadPosition.chapter !== selectedChapter) && (
        <div className="p-3.5 rounded-2xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#29523F] dark:text-[#4F8E71]">
            <RotateCcw className="w-4 h-4" />
            <span>
              Você estava lendo <strong>{lastReadPosition.bookId.toUpperCase()} {lastReadPosition.chapter}</strong> ({lastReadPosition.versionId.toUpperCase()}).
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedBookId(lastReadPosition.bookId);
              setSelectedChapter(lastReadPosition.chapter);
            }}
            className="font-bold underline text-[#162E23] dark:text-[#F1F4F2] hover:opacity-80 shrink-0"
          >
            Continuar de onde parou →
          </button>
        </div>
      )}

      {/* Se houver busca ativa */}
      {searchQuery.trim().length >= 2 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Resultados da busca por "{searchQuery}"
            </h3>
            <span className="text-xs text-[#7D8882]">
              {searchResults.length} versículos encontrados
            </span>
          </div>
          
          <div className="space-y-3">
            {searchResults.map((res, i) => (
              <div 
                key={i}
                onClick={() => {
                  setSelectedBookId(res.bookId);
                  setSelectedChapter(res.chapter);
                  setSearchQuery('');
                }}
                className="p-3.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] hover:bg-[#F2F7F4] dark:hover:bg-[#1B2521] cursor-pointer transition-colors"
              >
                <div className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71] mb-1">
                  {res.bookName} {res.chapter}:{res.verseNumber}
                </div>
                <p className="font-serif-scripture text-sm text-[#19211D] dark:text-[#F1F4F2]">
                  "{res.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Leitor Principal da Bíblia */
        <article className="p-6 sm:p-12 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-8">
          
          {/* Chapter Heading */}
          <div className="text-center pb-6 border-b border-[#E6E6DF] dark:border-[#24322C] space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#7D8882] dark:text-[#788780]">
                {currentBook.category} • {currentBook.testament === 'NT' ? 'Novo Testamento' : 'Antigo Testamento'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2F7F4] dark:bg-[#1B2521] text-[#29523F] dark:text-[#4F8E71] font-bold">
                {selectedVersion.abbreviation}
              </span>
            </div>

            <h2 className={`text-3xl sm:text-4xl font-bold text-[#162E23] dark:text-[#F1F4F2] ${getFontFamilyClass()}`}>
              {currentBook.name} {selectedChapter}
            </h2>

            <p className="text-xs text-[#7D8882]">
              {selectedVersion.name} • Toque em qualquer versículo para destacar, favoritar, anotar ou comparar
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleCopyChapter}
                className="text-xs font-medium text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2] flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar capítulo</span>
              </button>

              <span className="text-neutral-300 dark:text-[#24322C]">•</span>

              <span className="text-xs text-[#7D8882] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingElapsedMinutes} min lendo agora</span>
              </span>
            </div>
          </div>

          {/* Verses Content */}
          <div className={`space-y-4 ${getFontFamilyClass()} ${getFontSizeClass()}`}>
            {verses.map((verse) => {
              const highlightColor = highlightMap[verse.number];
              const isFavorite = favoriteMap[verse.number];
              const note = noteMap[verse.number];

              return (
                <div
                  key={verse.number}
                  onClick={() => setActiveVerseForModal(verse)}
                  className={`group relative p-3 sm:p-4 rounded-xl transition-all cursor-pointer ${colorHighlightClass(highlightColor)}`}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Verse Number & Badges */}
                    <div className="pt-1 select-none shrink-0 w-8 flex flex-col items-center gap-1">
                      <span className="text-xs font-sans-ui font-bold text-[#7D8882] dark:text-[#788780]">
                        {verse.number}
                      </span>
                      {isFavorite && (
                        <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
                      )}
                      {note && (
                        <FileText className="w-3 h-3 text-[#29523F] dark:text-[#4F8E71]" />
                      )}
                    </div>

                    {/* Verse Text */}
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[#19211D] dark:text-[#F1F4F2]">
                        {verse.text}
                      </p>

                      {/* Display Note Preview inline if present */}
                      {note && (
                        <div className="mt-2 p-2 rounded-lg bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-xs font-sans-ui text-[#29523F] dark:text-[#4F8E71] flex items-start gap-1.5">
                          <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{note.noteText}</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Actions on Verse Hover */}
                  <div className="mt-2 flex items-center justify-end gap-2 text-xs font-sans-ui opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVerseForModal(verse);
                      }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-[#24322C] text-[#4B554F] dark:text-[#B0BBB5] hover:bg-neutral-200"
                    >
                      Ações & Cores
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setComparisonVerseNum(verse.number);
                      }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#29523F] dark:text-[#4F8E71] hover:bg-[#E5EFEA]"
                    >
                      Comparar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chapter Navigation Footer & Complete Action */}
          <div className="pt-8 border-t border-[#E6E6DF] dark:border-[#24322C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrevChapter}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E5EFEA] dark:hover:bg-[#24322C] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Capítulo Anterior</span>
            </button>

            {/* Central [CONCLUIR LEITURA] Action */}
            <button
              onClick={() => setIsCompleteModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-[#162E23] dark:bg-[#224535] text-white hover:bg-[#1F3F30] flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              <span>Concluir Leitura ({readingElapsedMinutes} min)</span>
            </button>

            <button
              onClick={handleNextChapter}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E5EFEA] dark:hover:bg-[#24322C] transition-colors"
            >
              <span>Próximo Capítulo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </article>
      )}

      {/* Navigation Modal (Book, Chapter, Version) */}
      <BibleNavigationModal
        isOpen={isNavModalOpen}
        onClose={() => setIsNavModalOpen(false)}
        versions={versions}
        selectedVersion={selectedVersion}
        onSelectVersion={(v) => setSelectedVersion(v)}
        selectedBookId={selectedBookId}
        selectedChapter={selectedChapter}
        onSelectBookAndChapter={(bookId, chapter) => {
          setSelectedBookId(bookId);
          setSelectedChapter(chapter);
        }}
      />

      {/* Verse Action Modal */}
      {activeVerseForModal && (
        <BibleVerseActionModal
          isOpen={!!activeVerseForModal}
          onClose={() => setActiveVerseForModal(null)}
          verse={activeVerseForModal}
          bookName={currentBook.name}
          bookId={selectedBookId}
          chapter={selectedChapter}
          currentVersion={selectedVersion}
          isFavorite={!!favoriteMap[activeVerseForModal.number]}
          onToggleFavorite={() => handleToggleFavorite(activeVerseForModal)}
          currentHighlightColor={highlightMap[activeVerseForModal.number] || null}
          onSetHighlight={(color) => handleSetHighlight(activeVerseForModal, color)}
          onRemoveHighlight={() => handleRemoveHighlight(activeVerseForModal)}
          existingNote={noteMap[activeVerseForModal.number]}
          onSaveNote={(noteText) => handleSaveNote(activeVerseForModal.number, noteText)}
          onDeleteNote={() => {
            const n = noteMap[activeVerseForModal.number];
            if (n) handleDeleteNote(n.id);
          }}
          onOpenComparison={() => setComparisonVerseNum(activeVerseForModal.number)}
          onOpenPrayerWithVerse={(text, ref) => {
            if (onOpenPrayerWithVerse) onOpenPrayerWithVerse(text, ref);
          }}
          onCreateReflectionWithVerse={(text, ref) => {
            if (onSaveReflection) {
              onSaveReflection({
                date: new Date().toISOString().split('T')[0],
                scriptureRef: ref,
                whatGodSpoke: `Meditação sobre ${ref}: "${text}"`,
                practicalApplication: 'Guardar esta palavra no coração e praticá-la nas decisões de hoje.',
                gratitudeNotes: ['Pela clareza da Palavra de Deus revelada neste texto.'],
                moodRating: 5
              });
              setCopiedNotification(`Reflexão sobre ${ref} registrada no Diário Espiritual!`);
              setTimeout(() => setCopiedNotification(null), 3000);
            }
          }}
          onSetAsWordOfDay={(text, ref) => {
            if (onSetVerseOfDay) {
              onSetVerseOfDay(ref, text);
            }
          }}
        />
      )}

      {/* Multi-Version Comparison Modal */}
      {comparisonVerseNum !== null && (
        <BibleComparisonModal
          isOpen={comparisonVerseNum !== null}
          onClose={() => setComparisonVerseNum(null)}
          bookId={selectedBookId}
          bookName={currentBook.name}
          chapter={selectedChapter}
          verseNumber={comparisonVerseNum}
          versions={versions}
          baseVersion={selectedVersion}
        />
      )}

      {/* History, Favorites, Highlights & Notes Drawer */}
      <BibleHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        favorites={favoritesList}
        highlights={highlightsList}
        notes={notesList}
        history={historyList}
        onNavigateToPassage={(bookId, chapter, verseNum) => {
          setSelectedBookId(bookId);
          setSelectedChapter(chapter);
        }}
        onDeleteNote={handleDeleteNote}
        onRemoveFavorite={(fav) => {
          FaithionStorageService.toggleBibleFavorite({
            bookId: fav.bookId,
            bookName: fav.bookName,
            chapter: fav.chapter,
            verseNumber: fav.verseNumber,
            verseText: fav.verseText,
            versionId: fav.versionId
          });
          setFavoritesList(FaithionStorageService.getBibleFavorites());
        }}
        onRemoveHighlight={(key) => {
          FaithionStorageService.removeBibleHighlight(key);
          setHighlightsList(FaithionStorageService.getBibleHighlightsList());
        }}
      />

      {/* Complete Reading Modal */}
      <BibleCompleteReadingModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        passageRef={`${currentBook.name} ${selectedChapter}`}
        bookId={selectedBookId}
        chapter={selectedChapter}
        version={selectedVersion}
        durationMinutes={readingElapsedMinutes}
        activePlan={activeReadingPlan}
        onConfirmComplete={handleConfirmCompleteReading}
        onCreateReflection={(ref) => {
          if (onSaveReflection) {
            onSaveReflection({
              date: new Date().toISOString().split('T')[0],
              scriptureRef: ref,
              whatGodSpoke: `Meditação e revelação da leitura de ${ref} (${selectedVersion.abbreviation}).`,
              practicalApplication: 'Aplicar a verdade meditada com fé e perseverança no dia a dia.',
              gratitudeNotes: ['Gratidão pelo tempo em comunhão na Palavra.'],
              moodRating: 5
            });
            setCopiedNotification(`Reflexão sobre ${ref} registrada com sucesso no Diário!`);
            setTimeout(() => setCopiedNotification(null), 3000);
          }
        }}
        onOpenPrayer={(ref) => {
          if (onOpenPrayerWithVerse) {
            onOpenPrayerWithVerse(`Consagração da leitura bíblica em ${ref}`, ref);
          }
        }}
        onOpenFasting={(ref) => {
          if (onOpenFastingWithPassage) {
            onOpenFastingWithPassage(ref);
          }
        }}
        onSetWordOfDay={(ref) => {
          if (onSetVerseOfDay) {
            const firstVerse = verses[0]?.text || '';
            onSetVerseOfDay(ref, firstVerse);
          }
        }}
      />

    </div>
  );
};
