import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Heart, 
  Star, 
  Share2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Flame, 
  HeartHandshake, 
  History, 
  RotateCw, 
  HelpCircle, 
  Info,
  ExternalLink,
  Copy
} from 'lucide-react';
import { WordOfTheDay } from '../../types';

interface WordOfDayCardProps {
  word: WordOfTheDay;
  isFavorite?: boolean;
  onToggleFavorite?: (wordId: string) => void;
  onOpenBible?: (bookId: string, chapter: number) => void;
  onOpenPrayer?: (ref: string, text: string) => void;
  onOpenFasting?: (ref: string) => void;
  onOpenReflection?: (ref: string, text: string, theme: string) => void;
  onOpenHistory?: () => void;
  onRecalculate?: () => void;
}

export const WordOfDayCard: React.FC<WordOfDayCardProps> = ({
  word,
  isFavorite = false,
  onToggleFavorite,
  onOpenBible,
  onOpenPrayer,
  onOpenFasting,
  onOpenReflection,
  onOpenHistory,
  onRecalculate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `"${word.passage}"\n— ${word.reference} (${word.version})\n\nTema: ${word.theme}\nAplicação Prática: ${word.practicalApplication}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section 
      id="section-palavra-do-dia-personalizada" 
      className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs relative overflow-hidden transition-all duration-200"
    >
      {/* Faixa Superior: Indicadores e Ações Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span>Palavra do Dia Personalizada</span>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F2F7F4] dark:bg-[#1B2521] text-[#29523F] dark:text-[#88A898] border border-[#29523F]/20">
            {word.reference} ({word.version})
          </span>

          {word.theme && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
              {word.theme}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(word.id)}
              className={`p-2 rounded-xl transition-all ${
                isFavorite 
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' 
                  : 'text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar como favorita'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            title="Copiar texto bíblico e referência"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 transition-all"
              title="Consultar palavras dos dias anteriores"
            >
              <History className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
              <span className="hidden sm:inline">Histórico</span>
            </button>
          )}

          {onRecalculate && (
            <button
              onClick={onRecalculate}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              title="Recalcular com base nos meus objetivos atuais"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Critério Transparente de Personalização */}
      {word.matchingCriteria?.reason && (
        <div className="my-3 px-3.5 py-2 rounded-xl bg-[#F8FAF9] dark:bg-[#18231F] border border-[#E0ECE5] dark:border-[#22352B] flex items-center gap-2 text-xs text-[#29523F] dark:text-[#9EC4B0]">
          <Info className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71] shrink-0" />
          <div className="leading-snug">
            <strong className="font-semibold">Por que esta palavra hoje: </strong>
            <span>{word.matchingCriteria.reason}</span>
          </div>
        </div>
      )}

      {/* 1. TEXTO BÍBLICO AUTÊNTICO (SAGRADAS ESCRITURAS) */}
      <div className="my-4">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7D8882] dark:text-[#788780] mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#C59B3F]" />
          <span>Texto Bíblico das Escrituras Sagradas</span>
        </div>

        <blockquote className="font-serif-scripture text-lg sm:text-xl text-[#19211D] dark:text-[#F1F4F2] leading-relaxed italic p-4 sm:p-5 rounded-xl bg-[#FAF9F5] dark:bg-[#161F1B] border-l-4 border-[#C59B3F] shadow-2xs">
          "{word.passage}"
        </blockquote>
        
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-2 px-1">
          <span className="font-medium text-[#162E23] dark:text-[#4F8E71]">
            {word.reference} — {word.contentSource.bibleSource}
          </span>
          {onOpenBible && (
            <button
              onClick={() => onOpenBible(word.bookId, word.chapter)}
              className="inline-flex items-center gap-1 text-[#29523F] dark:text-[#4F8E71] font-bold hover:underline"
            >
              <span>Abrir na Bíblia</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Seção Resumida de Destaque (Sempre Visível) */}
      <div className="grid sm:grid-cols-2 gap-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
        <div className="p-3.5 rounded-xl bg-[#F8FAF9] dark:bg-[#17221E] border border-neutral-100 dark:border-neutral-800">
          <span className="font-bold text-[#29523F] dark:text-[#4F8E71] block mb-1">
            Contexto da Passagem:
          </span>
          <p className="text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
            {word.context}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-[#1E1F18] border border-amber-100 dark:border-amber-900/40">
          <span className="font-bold text-[#C59B3F] block mb-1">
            Sugestão Prática para Hoje:
          </span>
          <p className="text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
            {word.practicalApplication}
          </p>
        </div>
      </div>

      {/* Seção Expandida: Reflexão Teológica, Perguntas de Autoexame e Oração */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-200/70 dark:border-neutral-800 space-y-4 text-xs animate-in fade-in duration-200">
          
          {/* 2. Reflexão Teológica e Humana (Distinção Clara) */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1B2521] border border-[#29523F]/15 dark:border-[#29523F]/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#162E23] dark:text-[#4F8E71] text-xs uppercase tracking-wider">
                Reflexão Temática & Meditação
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 italic">
                {word.contentSource.commentarySource}
              </span>
            </div>
            <p className="text-[#323D37] dark:text-[#CBD8D1] text-sm leading-relaxed">
              {word.reflection}
            </p>
            <div className="mt-2 text-[11px] text-[#7D8882] dark:text-[#788780] italic flex items-center gap-1.5 border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Distinção devocional: O texto acima é uma reflexão e interpretação temática humana para apoiar sua meditação pessoal nas Escrituras.
              </span>
            </div>
          </div>

          {/* 3. Perguntas para Autoexame Pessoal */}
          {word.questions && word.questions.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#181D1A] border border-neutral-200/70 dark:border-neutral-800">
              <span className="font-bold text-[#C59B3F] block mb-2 text-xs uppercase tracking-wider">
                Perguntas para Sua Meditação:
              </span>
              <ul className="space-y-2 text-[#4B554F] dark:text-[#B0BBB5]">
                {word.questions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#C59B3F]">•</span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Oração Sugerida de Resposta */}
          {word.optionalPrayer && (
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-[#15241C] border border-emerald-200/60 dark:border-emerald-900/40">
              <span className="font-bold text-[#2A6E4F] dark:text-[#4F8E71] block mb-1 text-xs uppercase tracking-wider">
                Oração Sugerida de Resposta a Deus:
              </span>
              <p className="italic text-[#29523F] dark:text-[#A4CEB7] leading-relaxed text-sm">
                "{word.optionalPrayer}"
              </p>
            </div>
          )}

          {/* 5. Fonte e Origem Declarada */}
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#121815] text-[11px] text-neutral-500 dark:text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-neutral-200/50 dark:border-neutral-850">
            <div>
              <strong>Fonte Bíblica: </strong> {word.contentSource.bibleSource}
            </div>
            <div>
              <strong>Comentário Devocional: </strong> {word.contentSource.commentarySource}
            </div>
          </div>
        </div>
      )}

      {/* Barra de Ações Integradas e Alternância Expandir/Recolher */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#162E23] dark:text-[#4F8E71] hover:text-[#29523F] dark:hover:text-[#6BB092] transition-colors py-1.5"
        >
          <span>{isExpanded ? 'Recolher reflexão profunda' : 'Ver reflexão, perguntas e oração'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenReflection && (
            <button
              onClick={() => onOpenReflection(word.reference, word.passage, word.theme)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C59B3F]" />
              <span>Refletir</span>
            </button>
          )}

          {onOpenPrayer && (
            <button
              onClick={() => onOpenPrayer(word.reference, word.passage)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] border border-[#29523F]/30 hover:bg-[#D5E6DC] transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
              <span>Orar</span>
            </button>
          )}

          {onOpenFasting && (
            <button
              onClick={() => onOpenFasting(word.reference)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Jejum</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
