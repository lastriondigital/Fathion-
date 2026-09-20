import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Clock, 
  Bookmark, 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Check, 
  ChevronRight, 
  Compass, 
  FileText,
  Target
} from 'lucide-react';
import { 
  ReadingPlan, 
  PlanMethod, 
  PlanFrequency 
} from '../../types';
import { 
  BIBLE_CANON, 
  findCanonBook, 
  TESTAMENT_BOOKS 
} from '../../data/bibleCanon';
import { 
  generateReadingPlan, 
  getTodayDateString, 
  PRESET_THEMES 
} from '../../services/readingPlanGenerator';
import { 
  PLAN_TEMPLATES, 
  instantiatePlanFromTemplate, 
  PlanTemplateDefinition 
} from '../../data/readingPlanTemplates';
import { BIBLE_VERSIONS } from '../../services/bibleService';

interface ReadingPlanCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (newPlan: ReadingPlan) => void;
}

const METHODS_LIST: { id: PlanMethod; label: string; desc: string }[] = [
  { id: 'sequencia_biblica', label: 'Sequência Bíblica', desc: 'Lê porções contínuas da Bíblia ou de um testamento inteiro' },
  { id: 'livros_especificos', label: 'Livros Específicos', desc: 'Escolha um ou múltiplos livros da Bíblia para ler do início ao fim' },
  { id: 'capitulos_especificos', label: 'Capítulos Específicos', desc: 'Selecione um intervalo de capítulos de um livro (ex: Provérbios 1 a 31)' },
  { id: 'passagens_especificas', label: 'Passagens Específicas', desc: 'Monte sua própria lista com passagens e versículos selecionados' },
  { id: 'temas', label: 'Temas Espirituais', desc: 'Jornadas devocionais curadas sobre temas práticos e oração' },
  { id: 'personalizado', label: 'Personalizado Livre', desc: 'Defina a quantidade de dias e organize sua leitura livremente' }
];

const DAYS_OF_WEEK = [
  { label: 'Dom', value: 0 },
  { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 }
];

export const ReadingPlanCreatorModal: React.FC<ReadingPlanCreatorModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated
}) => {
  if (!isOpen) return null;

  const todayStr = getTodayDateString();

  // Tab State: 'custom' | 'templates'
  const [activeTab, setActiveTab] = useState<'custom' | 'templates'>('templates');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState(todayStr);
  const [durationDays, setDurationDays] = useState(30);
  const [frequency, setFrequency] = useState<PlanFrequency>('diaria');
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [dailyEstimatedMinutes, setDailyEstimatedMinutes] = useState(15);
  const [preferredVersion, setPreferredVersion] = useState('arc');
  const [method, setMethod] = useState<PlanMethod>('sequencia_biblica');

  // Method-specific states
  const [canonicalScope, setCanonicalScope] = useState<'all' | 'nt' | 'at' | 'gospels' | 'pentateuch'>('nt');
  const [selectedBooks, setSelectedBooks] = useState<string[]>(['joao', 'romanos']);
  const [chaptersRangeBook, setChaptersRangeBook] = useState('proverbios');
  const [startChapter, setStartChapter] = useState(1);
  const [endChapter, setEndChapter] = useState(31);
  const [specificPassages, setSpecificPassages] = useState<string[]>([
    'Salmo 23',
    'Mateus 5',
    'João 14',
    'Romanos 8',
    'Filipenses 4'
  ]);
  const [newPassageInput, setNewPassageInput] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ansiedade_paz');

  // Error validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper toggle day of week
  const toggleDayOfWeek = (val: number) => {
    if (selectedDaysOfWeek.includes(val)) {
      if (selectedDaysOfWeek.length > 1) {
        setSelectedDaysOfWeek(selectedDaysOfWeek.filter(d => d !== val));
      }
    } else {
      setSelectedDaysOfWeek([...selectedDaysOfWeek, val].sort());
    }
  };

  // Helper toggle selected book
  const toggleBook = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      if (selectedBooks.length > 1) {
        setSelectedBooks(selectedBooks.filter(id => id !== bookId));
      }
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  // Add specific passage
  const handleAddPassage = () => {
    const trimmed = newPassageInput.trim();
    if (trimmed && !specificPassages.includes(trimmed)) {
      setSpecificPassages([...specificPassages, trimmed]);
      setNewPassageInput('');
    }
  };

  // Remove specific passage
  const handleRemovePassage = (idx: number) => {
    setSpecificPassages(specificPassages.filter((_, i) => i !== idx));
  };

  // Load a template into the custom form to customize
  const handleLoadTemplateIntoForm = (template: PlanTemplateDefinition) => {
    setTitle(template.title);
    setDescription(template.description);
    setObjective(template.objective);
    setDurationDays(template.durationDays);
    setDailyEstimatedMinutes(template.dailyEstimatedMinutes);
    setPreferredVersion(template.preferredVersion);
    setFrequency(template.frequency || 'diaria');
    if (template.method) setMethod(template.method);
    setActiveTab('custom');
  };

  // Instant activate template
  const handleInstantActivateTemplate = (template: PlanTemplateDefinition) => {
    const instantiated = instantiatePlanFromTemplate(template, startDate);
    instantiated.isActive = true;
    onPlanCreated(instantiated);
    onClose();
  };

  // Live preview calculation
  const previewPlan = useMemo(() => {
    try {
      const plan = generateReadingPlan({
        title: title.trim() || 'Meu Novo Plano de Leitura',
        description: description.trim() || 'Plano de leitura bíblica diária no Faithion.',
        objective: objective.trim() || undefined,
        startDate,
        durationDays: Number(durationDays) || 30,
        frequency,
        selectedDaysOfWeek,
        dailyEstimatedMinutes: Number(dailyEstimatedMinutes) || 15,
        preferredVersion,
        method,
        canonicalScope,
        selectedBooks,
        selectedChaptersRange: {
          bookId: chaptersRangeBook,
          startChapter: Number(startChapter) || 1,
          endChapter: Number(endChapter) || 31
        },
        specificPassages,
        selectedTheme
      });
      return plan;
    } catch {
      return null;
    }
  }, [
    title,
    description,
    objective,
    startDate,
    durationDays,
    frequency,
    selectedDaysOfWeek,
    dailyEstimatedMinutes,
    preferredVersion,
    method,
    canonicalScope,
    selectedBooks,
    chaptersRangeBook,
    startChapter,
    endChapter,
    specificPassages,
    selectedTheme
  ]);

  // Handle final submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor, informe o nome do plano de leitura.');
      return;
    }

    if (method === 'passagens_especificas' && specificPassages.length === 0) {
      setErrorMsg('Adicione pelo menos uma passagem bíblica.');
      return;
    }

    if (!previewPlan || previewPlan.days.length === 0) {
      setErrorMsg('Não foi possível gerar dias de leitura com os parâmetros informados.');
      return;
    }

    onPlanCreated(previewPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Criador de Planos de Leitura Bíblica
              </h2>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                Estruture sua jornada nas Escrituras de acordo com seu ritmo e objetivo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tab Switcher */}
        <div className="px-5 pt-3 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center gap-4 shrink-0 bg-[#FBFBFA] dark:bg-[#101714]">
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'border-[#162E23] text-[#162E23] dark:border-[#4F8E71] dark:text-[#4F8E71]'
                : 'border-transparent text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Modelos Prontos (Recomendados)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'border-[#162E23] text-[#162E23] dark:border-[#4F8E71] dark:text-[#4F8E71]'
                : 'border-transparent text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <Layers className="w-4 h-4" />
            Criar Personalizado do Zero
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-800 dark:text-red-300 font-medium">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: MODELOS PRONTOS */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Escolha um Modelo Curado para Começar
                </h3>
                <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                  Selecione um plano pré-estruturado ou use-o como ponto de partida para personalizar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLAN_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-4 rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] hover:border-[#162E23]/40 dark:hover:border-[#4F8E71]/40 shadow-xs flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
                          {tmpl.badge}
                        </span>
                        <span className="text-xs text-[#7D8882] dark:text-[#788780] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tmpl.dailyEstimatedMinutes} min/dia
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                        {tmpl.title}
                      </h4>

                      <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed line-clamp-2">
                        {tmpl.description}
                      </p>

                      <p className="text-[11px] text-[#7D8882] dark:text-[#788780] italic">
                        <strong>Objetivo:</strong> {tmpl.objective}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadTemplateIntoForm(tmpl)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Personalizar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInstantActivateTemplate(tmpl)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] shadow-2xs transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ativar Este Plano
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PERSONALIZADO DO ZERO */}
          {activeTab === 'custom' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-[#E6E6DF] dark:border-[#24322C]">
                  <FileText className="w-4 h-4 text-[#162E23] dark:text-[#4F8E71]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#19211D] dark:text-[#F1F4F2]">
                    1. Informações do Plano
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                      Nome do Plano *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setErrorMsg(null); }}
                      placeholder="Ex: Minha Jornada nos Salmos & Provérbios"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:ring-2 focus:ring-[#162E23]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Leitura focada em discernimento para o trabalho e família"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:ring-2 focus:ring-[#162E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                      Objetivo Espiritual
                    </label>
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Ex: Fortalecer a constância e sabedoria diária"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:ring-2 focus:ring-[#162E23]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Método de Estruturação */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#E6E6DF] dark:border-[#24322C]">
                  <Compass className="w-4 h-4 text-[#162E23] dark:text-[#4F8E71]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#19211D] dark:text-[#F1F4F2]">
                    2. Método de Leitura Bíblica
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {METHODS_LIST.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        method === m.id
                          ? 'border-[#162E23] dark:border-[#4F8E71] bg-[#E6F0EA]/40 dark:bg-[#192D23]/40 shadow-xs ring-1 ring-[#162E23] dark:ring-[#4F8E71]'
                          : 'border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                          {m.label}
                        </span>
                        {method === m.id && (
                          <Check className="w-3.5 h-3.5 text-[#162E23] dark:text-[#4F8E71]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#7D8882] dark:text-[#788780] leading-tight">
                        {m.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Sub-configurações por método */}
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0C1210] border border-[#E6E6DF] dark:border-[#24322C] mt-3">
                  
                  {/* Método: Sequência Bíblica */}
                  {method === 'sequencia_biblica' && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                        Escopo da Sequência:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { id: 'nt', label: 'Novo Testamento' },
                          { id: 'gospels', label: 'Evangelhos' },
                          { id: 'all', label: 'Toda a Bíblia' },
                          { id: 'at', label: 'Antigo Testamento' },
                          { id: 'pentateuch', label: 'Pentateuco' }
                        ].map(scope => (
                          <button
                            key={scope.id}
                            type="button"
                            onClick={() => setCanonicalScope(scope.id as any)}
                            className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                              canonicalScope === scope.id
                                ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                                : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                            }`}
                          >
                            {scope.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Método: Livros Específicos */}
                  {method === 'livros_especificos' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                          Selecione os livros desejados:
                        </label>
                        <span className="text-[11px] text-[#7D8882] dark:text-[#788780]">
                          {selectedBooks.length} selecionado(s)
                        </span>
                      </div>
                      <div className="max-h-48 overflow-y-auto p-2 bg-white dark:bg-[#141C19] rounded-xl border border-[#E6E6DF] dark:border-[#24322C] grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {BIBLE_CANON.map(b => {
                          const isSel = selectedBooks.includes(b.id);
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => toggleBook(b.id)}
                              className={`p-1.5 rounded-lg text-xs font-medium text-left flex items-center justify-between transition-colors ${
                                isSel
                                  ? 'bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] font-bold'
                                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#4B554F] dark:text-[#B0BBB5]'
                              }`}
                            >
                              <span className="truncate">{b.name}</span>
                              <span className="text-[10px] opacity-60 shrink-0 ml-1">{b.chaptersCount}c</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Método: Capítulos Específicos */}
                  {method === 'capitulos_especificos' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#4B554F] dark:text-[#B0BBB5]">
                            Livro:
                          </label>
                          <select
                            value={chaptersRangeBook}
                            onChange={(e) => {
                              setChaptersRangeBook(e.target.value);
                              const b = findCanonBook(e.target.value);
                              if (b) {
                                setStartChapter(1);
                                setEndChapter(b.chaptersCount);
                              }
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                          >
                            {BIBLE_CANON.map(b => (
                              <option key={b.id} value={b.id}>{b.name} ({b.chaptersCount} caps)</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#4B554F] dark:text-[#B0BBB5]">
                            Capítulo Inicial:
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={endChapter}
                            value={startChapter}
                            onChange={(e) => setStartChapter(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#4B554F] dark:text-[#B0BBB5]">
                            Capítulo Final:
                          </label>
                          <input
                            type="number"
                            min={startChapter}
                            max={findCanonBook(chaptersRangeBook)?.chaptersCount || 150}
                            value={endChapter}
                            onChange={(e) => setEndChapter(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Método: Passagens Específicas */}
                  {method === 'passagens_especificas' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newPassageInput}
                          onChange={(e) => setNewPassageInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPassage(); } }}
                          placeholder="Ex: Salmo 91, Mateus 6, Isaías 40..."
                          className="flex-1 px-3.5 py-1.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#141C19] text-xs text-[#19211D] dark:text-[#F1F4F2]"
                        />
                        <button
                          type="button"
                          onClick={handleAddPassage}
                          className="px-3 py-1.5 rounded-xl bg-[#162E23] text-white text-xs font-semibold hover:bg-[#1F3F30] flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {specificPassages.map((p, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]"
                          >
                            {p}
                            <button
                              type="button"
                              onClick={() => handleRemovePassage(idx)}
                              className="text-neutral-400 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Método: Temas */}
                  {method === 'temas' && (
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                        Selecione o tema espiritual:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {Object.entries(PRESET_THEMES).map(([k, t]) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setSelectedTheme(k)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              selectedTheme === k
                                ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                                : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                            }`}
                          >
                            <h5 className="text-xs font-bold">{t.title}</h5>
                            <p className="text-[10px] opacity-80 mt-0.5 line-clamp-2">{t.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Método: Personalizado */}
                  {method === 'personalizado' && (
                    <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                      Você poderá adicionar, editar e renomear livremente cada dia do plano após a criação.
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Calendário, Duração & Frequência */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-[#E6E6DF] dark:border-[#24322C]">
                  <Calendar className="w-4 h-4 text-[#162E23] dark:text-[#4F8E71]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#19211D] dark:text-[#F1F4F2]">
                    3. Agendamento & Frequência
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                      Data Inicial
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:ring-2 focus:ring-[#162E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                      Duração (Dias de leitura)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:ring-2 focus:ring-[#162E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                      Tempo Diário (min)
                    </label>
                    <select
                      value={dailyEstimatedMinutes}
                      onChange={(e) => setDailyEstimatedMinutes(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2]"
                    >
                      <option value={5}>5 min / dia</option>
                      <option value={10}>10 min / dia</option>
                      <option value={15}>15 min / dia</option>
                      <option value={20}>20 min / dia</option>
                      <option value={30}>30 min / dia</option>
                      <option value={45}>45 min / dia</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                      Versão Preferida
                    </label>
                    <select
                      value={preferredVersion}
                      onChange={(e) => setPreferredVersion(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FBFBFA] dark:bg-[#0C1210] text-sm text-[#19211D] dark:text-[#F1F4F2]"
                    >
                      {BIBLE_VERSIONS.map(v => (
                        <option key={v.id} value={v.id}>{v.abbreviation} — {v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Frequência */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5]">
                    Frequência Semanal:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFrequency('diaria')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        frequency === 'diaria'
                          ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                          : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                      }`}
                    >
                      Diária (Todos os dias)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('dias_uteis')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        frequency === 'dias_uteis'
                          ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                          : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                      }`}
                    >
                      Dias Úteis (Segunda a Sexta)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('dias_especificos')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        frequency === 'dias_especificos'
                          ? 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]'
                          : 'bg-white dark:bg-[#141C19] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                      }`}
                    >
                      Dias Específicos
                    </button>
                  </div>

                  {frequency === 'dias_especificos' && (
                    <div className="flex items-center gap-1.5 pt-2">
                      {DAYS_OF_WEEK.map(d => {
                        const isSel = selectedDaysOfWeek.includes(d.value);
                        return (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => toggleDayOfWeek(d.value)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isSel
                                ? 'bg-[#162E23] text-white dark:bg-[#224535]'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Live Preview do Calendário */}
              {previewPlan && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#E6E6DF] dark:border-[#24322C]">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#162E23] dark:text-[#4F8E71]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#19211D] dark:text-[#F1F4F2]">
                        Pré-visualização do Calendário ({previewPlan.days.length} atividades)
                      </h3>
                    </div>
                    <span className="text-xs text-[#7D8882] dark:text-[#788780]">
                      Término: {previewPlan.days[previewPlan.days.length - 1]?.date || '—'}
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-neutral-50 dark:bg-[#0C1210] rounded-xl border border-[#E6E6DF] dark:border-[#24322C]">
                    {previewPlan.days.slice(0, 10).map((d) => (
                      <div
                        key={d.dayNumber}
                        className="p-2.5 rounded-lg bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-[#162E23] dark:text-[#4F8E71] min-w-[45px]">
                            Dia {d.dayNumber}
                          </span>
                          <span className="text-[#7D8882] dark:text-[#788780] min-w-[75px]">
                            {d.date}
                          </span>
                          <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                            {d.passageRef}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#7D8882] dark:text-[#788780]">
                          {d.estimatedMinutes} min
                        </span>
                      </div>
                    ))}
                    {previewPlan.days.length > 10 && (
                      <p className="text-center text-[11px] text-[#7D8882] dark:text-[#788780] pt-1">
                        + {previewPlan.days.length - 10} dias subsequentes calculados automaticamente
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#162E23] text-white hover:bg-[#1F3F30] shadow-xs transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Gerar e Iniciar Plano
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
