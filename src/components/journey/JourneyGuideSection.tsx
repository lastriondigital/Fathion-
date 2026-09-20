import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  HeartHandshake, 
  Flame, 
  PenLine, 
  ChevronRight, 
  RotateCcw, 
  Sliders, 
  Info, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  X, 
  Calendar, 
  Layers, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  JourneyGuideRecommendationItem, 
  JourneyAdaptationSuggestion, 
  TaskCategory,
  RoutineBlock
} from '../../types';

interface JourneyGuideSectionProps {
  currentActivity: JourneyGuideRecommendationItem | null;
  nextActivity: JourneyGuideRecommendationItem | null;
  subsequentActivities: JourneyGuideRecommendationItem[];
  explanation: string;
  adaptations: JourneyAdaptationSuggestion[];
  onStartActivity: (activity: JourneyGuideRecommendationItem) => void;
  onCompleteActivity: (activityId: string) => void;
  onIgnoreActivity: (activityId: string) => void;
  onAcceptAdaptation: (adaptation: JourneyAdaptationSuggestion) => void;
  onIgnoreAdaptation: (adaptationId: string) => void;
  onAdjustAdaptation: (adaptation: JourneyAdaptationSuggestion, adjustments: {
    duration?: number;
    time?: string;
    block?: RoutineBlock;
  }) => void;
  onOpenBible?: (bookId?: string, chapter?: number) => void;
  onOpenPrayer?: () => void;
  onOpenFasting?: () => void;
  onOpenReflection?: () => void;
}

export const JourneyGuideSection: React.FC<JourneyGuideSectionProps> = ({
  currentActivity,
  nextActivity,
  subsequentActivities,
  explanation,
  adaptations,
  onStartActivity,
  onCompleteActivity,
  onIgnoreActivity,
  onAcceptAdaptation,
  onIgnoreAdaptation,
  onAdjustAdaptation,
  onOpenBible,
  onOpenPrayer,
  onOpenFasting,
  onOpenReflection
}) => {
  const [showTransparency, setShowTransparency] = useState(false);
  const [adjustingAdaptation, setAdjustingAdaptation] = useState<JourneyAdaptationSuggestion | null>(null);
  const [customDuration, setCustomDuration] = useState<number>(10);
  const [customTime, setCustomTime] = useState<string>('07:00');
  const [customBlock, setCustomBlock] = useState<RoutineBlock>('morning');
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'bible':
        return <BookOpen className="w-5 h-5 text-[#29523F] dark:text-[#4F8E71]" />;
      case 'prayer':
        return <HeartHandshake className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'fasting':
        return <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'reflection':
        return <PenLine className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <Compass className="w-5 h-5 text-[#29523F] dark:text-[#4F8E71]" />;
    }
  };

  const getCategoryName = (category: TaskCategory) => {
    switch (category) {
      case 'bible': return 'Leitura bíblica';
      case 'prayer': return 'Oração';
      case 'fasting': return 'Jejum & Consagração';
      case 'reflection': return 'Reflexão Espiritual';
      default: return 'Atividade';
    }
  };

  const handleStart = (activity: JourneyGuideRecommendationItem) => {
    onStartActivity(activity);
    if (activity.category === 'bible' && onOpenBible) {
      onOpenBible();
    } else if (activity.category === 'prayer' && onOpenPrayer) {
      onOpenPrayer();
    } else if (activity.category === 'fasting' && onOpenFasting) {
      onOpenFasting();
    } else if (activity.category === 'reflection' && onOpenReflection) {
      onOpenReflection();
    }
  };

  const handleQuickComplete = (id: string) => {
    setJustCompletedId(id);
    onCompleteActivity(id);
    setTimeout(() => {
      setJustCompletedId(null);
    }, 1800);
  };

  const handleOpenAdjustModal = (adapt: JourneyAdaptationSuggestion) => {
    setAdjustingAdaptation(adapt);
    setCustomDuration(adapt.actionPayload.newDuration || 10);
    setCustomTime(adapt.actionPayload.newTime || '07:30');
    setCustomBlock(adapt.actionPayload.newBlock || adapt.block || 'morning');
  };

  const handleSaveAdjust = () => {
    if (adjustingAdaptation) {
      onAdjustAdaptation(adjustingAdaptation, {
        duration: customDuration,
        time: customTime,
        block: customBlock
      });
      setAdjustingAdaptation(null);
    }
  };

  const pendingAdaptations = adaptations.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6">
      
      {/* 1. CABEÇALHO DO GUIA DA JORNADA COM PRINCÍPIO NORTEADOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#29523F] dark:text-[#4F8E71]">
              <Compass className="w-5 h-5 text-[#29523F] dark:text-[#4F8E71]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
                Guia da Jornada FAITHION
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Direção e Orientação Devocional
              </h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#29523F] dark:text-[#4F8E71] border border-[#29523F]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span>Decisão 100% Pessoal</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-3 leading-relaxed">
          O Faithion ajuda você a decidir o que executar na sua rotina diária, sem jamais tomar decisões espirituais por você ou julgar sua fé. Todas as recomendações são baseadas na sua rotina, planos, histórico e horários.
        </p>
      </div>

      {/* 2. MECANISMO: "O QUE FAÇO AGORA?" */}
      <section 
        id="section-o-que-faco-agora" 
        className="p-5 sm:p-6 rounded-2xl bg-[#F4F8F5] dark:bg-[#17221D] border border-[#29523F]/25 dark:border-[#29523F]/35 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#29523F]/15 dark:border-[#29523F]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C59B3F]" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#162E23] dark:text-[#4F8E71]">
              O que devo fazer agora?
            </h3>
          </div>
          <span className="text-xs text-[#7D8882] dark:text-[#788780]">
            Sequência recomendada para hoje
          </span>
        </div>

        {/* Feedback visual de conclusão rápida */}
        {justCompletedId && (
          <div className="p-3 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-xs text-[#162E23] dark:text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2A6E4F]" />
            <span>Atividade concluída com sucesso! Atualizando a sequência do seu dia.</span>
          </div>
        )}

        {/* ESTRUTURA EXATA SOLICITADA:
            Sua próxima atividade:
            [Nome da atividade]
            [Subtítulo / Passagem]
            [X minutos]
            [COMEÇAR]
            
            Depois:
            Próxima atividade:
            [Nome da atividade]
            [X minutos]
            [COMEÇAR]
        */}
        <div className="space-y-4">
          
          {/* BLOCO 1: SUA PRÓXIMA ATIVIDADE */}
          {currentActivity ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border-2 border-[#29523F]/30 dark:border-[#4F8E71]/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-widest font-extrabold text-[#29523F] dark:text-[#4F8E71] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#29523F] dark:bg-[#4F8E71]" />
                  Sua próxima atividade:
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71]">
                  Recomendação imediata
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
                    {getCategoryName(currentActivity.category)}
                  </h4>
                  
                  {currentActivity.subtitle ? (
                    <p className="text-base sm:text-lg font-serif-scripture italic text-[#29523F] dark:text-[#4F8E71]">
                      {currentActivity.subtitle}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-[#4B554F] dark:text-[#B0BBB5]">
                      {currentActivity.title}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-[#7D8882] dark:text-[#788780] pt-1">
                    <span className="flex items-center gap-1 font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                      <Clock className="w-3.5 h-3.5 text-[#C59B3F]" />
                      {currentActivity.estimatedMinutes} minutos
                    </span>
                    <span>•</span>
                    <span>Horário previsto: {currentActivity.scheduledTime}</span>
                  </div>
                </div>

                {/* Botões de Ação Imediata */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    id="btn-journey-start-current"
                    onClick={() => handleStart(currentActivity)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#162E23] hover:bg-[#1F3F30] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>[COMEÇAR]</span>
                  </button>

                  <button
                    id="btn-journey-quick-complete"
                    onClick={() => handleQuickComplete(currentActivity.id)}
                    className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] hover:bg-[#E5ECE7] text-[#29523F] dark:text-[#4F8E71] text-xs font-semibold border border-[#29523F]/20 transition-all"
                    title="Marcar como já realizada"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Já fiz, concluir</span>
                  </button>

                  <button
                    id="btn-journey-ignore-current"
                    onClick={() => onIgnoreActivity(currentActivity.id)}
                    className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2] text-xs font-medium transition-all"
                    title="Adiar para outro momento"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Adiar</span>
                  </button>
                </div>
              </div>

              {/* Por que fazer isso (Explicação contextual serena) */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                <strong className="text-[#C59B3F]">Propósito desta prática: </strong>
                {currentActivity.why}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#2A6E4F] mx-auto" />
              <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Todas as atividades do dia foram concluídas!
              </h4>
              <p className="text-xs text-[#7D8882] dark:text-[#788780] max-w-md mx-auto">
                Desfrute de descanso sereno, gratidão e liberdade espiritual. Você pode orar espontaneamente ou ler qualquer texto bíblico livremente.
              </p>
            </div>
          )}

          {/* BLOCO 2: DEPOIS: PRÓXIMA ATIVIDADE */}
          {nextActivity && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#141C19]/80 border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780] flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59B3F]" />
                  Depois:
                </span>
                <span className="text-[11px] font-semibold text-[#7D8882]">
                  Na sequência
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#7D8882] dark:text-[#788780] block">
                    Próxima atividade:
                  </span>
                  <h5 className="text-base sm:text-lg font-bold text-[#19211D] dark:text-[#F1F4F2]">
                    {getCategoryName(nextActivity.category)}
                    {nextActivity.subtitle && (
                      <span className="ml-2 font-normal text-sm font-serif-scripture italic text-[#29523F] dark:text-[#4F8E71]">
                        ({nextActivity.subtitle})
                      </span>
                    )}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-[#7D8882] dark:text-[#788780]">
                    <Clock className="w-3 h-3 text-[#C59B3F]" />
                    <span>{nextActivity.estimatedMinutes} minutos</span>
                    <span>•</span>
                    <span>{nextActivity.scheduledTime}</span>
                  </div>
                </div>

                <button
                  id="btn-journey-start-next"
                  onClick={() => handleStart(nextActivity)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] hover:bg-[#D5E6DC] text-[#162E23] dark:text-[#4F8E71] text-xs font-bold border border-[#29523F]/20 transition-all self-start sm:self-center"
                >
                  <Play className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                  <span>[COMEÇAR]</span>
                </button>
              </div>
            </div>
          )}

          {/* Subsequentes atividades planejadas para o restante do dia */}
          {subsequentActivities.length > 0 && (
            <div className="pt-2">
              <details className="text-xs group">
                <summary className="cursor-pointer font-bold text-[#7D8882] dark:text-[#788780] hover:text-[#19211D] dark:hover:text-[#F1F4F2] flex items-center gap-1 select-none">
                  <span>Ver mais {subsequentActivities.length} práticas planejadas para hoje</span>
                  <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-2.5 space-y-2 pl-2 border-l-2 border-[#E6E6DF] dark:border-[#24322C]">
                  {subsequentActivities.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C]">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(sub.category)}
                        <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">{sub.title}</span>
                      </div>
                      <span className="text-[#7D8882]">{sub.scheduledTime} ({sub.estimatedMinutes} min)</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

        </div>

        {/* Painel de Transparência Explicável dos 8 Critérios */}
        <div className="pt-2 border-t border-[#29523F]/15 dark:border-[#29523F]/30">
          <button
            onClick={() => setShowTransparency(!showTransparency)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#29523F] dark:text-[#4F8E71] hover:underline"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Por que esta recomendação foi feita? (Transparência do Motor)</span>
            {showTransparency ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTransparency && (
            <div className="mt-3 p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] text-xs space-y-2.5 animate-in fade-in duration-200">
              <p className="font-bold text-[#19211D] dark:text-[#F1F4F2]">
                {explanation}
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-[#4B554F] dark:text-[#B0BBB5] pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <div>
                  <strong className="text-[#19211D] dark:text-[#F1F4F2] block">• Rotina & Horário:</strong>
                  {currentActivity?.transparentFactors.timeAlignment || currentActivity?.transparentFactors.routineMatch || 'Compatível com o período atual.'}
                </div>
                <div>
                  <strong className="text-[#19211D] dark:text-[#F1F4F2] block">• Planos & Escrituras:</strong>
                  {currentActivity?.transparentFactors.planStatus || 'Alinhada à leitura bíblica contínua.'}
                </div>
                <div>
                  <strong className="text-[#19211D] dark:text-[#F1F4F2] block">• Objetivos Pessoais:</strong>
                  {currentActivity?.transparentFactors.objectiveAlignment || 'Promove disciplina e constância na caminhada cristã.'}
                </div>
                <div>
                  <strong className="text-[#19211D] dark:text-[#F1F4F2] block">• Histórico & Atrasos:</strong>
                  {currentActivity?.transparentFactors.activityDelay || currentActivity?.transparentFactors.historyConsistency || 'Sem pressa: momento oportuno para retomar.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. ADAPTAÇÃO INTELIGENTE (DETECÇÃO DE PADRÕES SIMPLES) */}
      <section 
        id="section-adaptacao-inteligente" 
        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6E6DF] dark:border-[#24322C]">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C59B3F]" />
              <h3 className="text-base sm:text-lg font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Adaptação Inteligente da Rotina
              </h3>
            </div>
            <p className="text-xs text-[#7D8882] dark:text-[#788780] mt-0.5">
              Padrões identificados para ajudar você a manter a constância sem frustração.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 self-start sm:self-auto">
            {pendingAdaptations.length} {pendingAdaptations.length === 1 ? 'sugestão pendente' : 'sugestões pendentes'}
          </span>
        </div>

        {/* Lista de Sugestões de Adaptação com [ACEITAR], [IGNORAR], [AJUSTAR] */}
        {pendingAdaptations.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#FBFBFA] dark:bg-[#1B2521] border border-dashed border-[#E6E6DF] dark:border-[#24322C] text-xs text-[#7D8882]">
            <CheckCircle2 className="w-5 h-5 text-[#2A6E4F] mx-auto mb-1.5" />
            Nenhuma sobrecarga ou atraso excessivo detectado no momento. Sua rotina está em equilíbrio.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAdaptations.map(adapt => (
              <div 
                key={adapt.id}
                className="p-4 sm:p-5 rounded-xl bg-[#FAFAF8] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-3.5 transition-all hover:border-[#29523F]/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                        {adapt.metricContext}
                      </span>
                      <span className="text-xs text-[#7D8882] dark:text-[#788780]">
                        {adapt.detectedPattern}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                      "{adapt.title}"
                    </h4>

                    <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                      {adapt.description}
                    </p>
                  </div>
                </div>

                {/* Ação Sugerida + Três botões obrigatórios: [ACEITAR] [IGNORAR] [AJUSTAR] */}
                <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-[#29523F] dark:text-[#4F8E71]">
                    Sugestão: {adapt.suggestedActionText}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      id={`btn-accept-adapt-${adapt.id}`}
                      onClick={() => onAcceptAdaptation(adapt)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#162E23] hover:bg-[#1F3F30] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>[ACEITAR]</span>
                    </button>

                    <button
                      id={`btn-ignore-adapt-${adapt.id}`}
                      onClick={() => onIgnoreAdaptation(adapt.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#141C19] hover:bg-neutral-100 dark:hover:bg-[#24322C] text-[#7D8882] hover:text-[#19211D] text-xs font-semibold border border-[#E6E6DF] dark:border-[#24322C] transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>[IGNORAR]</span>
                    </button>

                    <button
                      id={`btn-adjust-adapt-${adapt.id}`}
                      onClick={() => handleOpenAdjustModal(adapt)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] hover:bg-[#D5E6DC] text-[#162E23] dark:text-[#4F8E71] text-xs font-bold border border-[#29523F]/20 transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>[AJUSTAR]</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Princípio de Integridade: Nunca modificar silenciosamente */}
        <div className="p-3.5 rounded-xl bg-[#F4F4F0] dark:bg-[#192420] text-xs text-[#7D8882] dark:text-[#788780] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71] shrink-0" />
          <span>
            <strong>Garantia de Transparência:</strong> O Faithion nunca modifica sua rotina ou seus planos silenciosamente. Você tem controle absoluto para aceitar, ignorar ou ajustar cada sugestão.
          </span>
        </div>
      </section>

      {/* 4. MODAL DE AJUSTE MANUAL [AJUSTAR] */}
      {adjustingAdaptation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] w-full max-w-md p-5 sm:p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E6DF] dark:border-[#24322C]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C59B3F]" />
                <h4 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Ajustar Prática Manualmente
                </h4>
              </div>
              <button 
                onClick={() => setAdjustingAdaptation(null)}
                className="p-1 text-[#7D8882] hover:text-[#19211D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5]">
              Defina como você prefere adaptar a atividade "{adjustingAdaptation.activityName || adjustingAdaptation.title}".
            </p>

            {/* Duração em Minutos */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Duração Desejada: {customDuration} minutos
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20, 30].map(mins => (
                  <button
                    key={mins}
                    onClick={() => setCustomDuration(mins)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      customDuration === mins
                        ? 'bg-[#162E23] text-white'
                        : 'bg-neutral-100 dark:bg-[#1B2521] text-[#7D8882]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Horário Sugerido */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Horário Sugerido
              </label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2521] text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>

            {/* Bloco de Rotina */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Período da Rotina
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: 'Manhã' },
                  { id: 'day', label: 'Tarde' },
                  { id: 'night', label: 'Noite' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setCustomBlock(b.id as RoutineBlock)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      customBlock === b.id
                        ? 'bg-[#162E23] text-white'
                        : 'bg-neutral-100 dark:bg-[#1B2521] text-[#7D8882]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E6E6DF] dark:border-[#24322C]">
              <button
                onClick={() => setAdjustingAdaptation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAdjust}
                className="px-5 py-2 rounded-xl bg-[#162E23] text-white text-xs font-bold hover:bg-[#1F3F30] transition-colors shadow-xs"
              >
                Salvar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
