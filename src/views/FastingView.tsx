import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  Check, 
  RotateCcw, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { FastingPlan, FastingType } from '../types';

interface FastingViewProps {
  fastingPlan: FastingPlan;
  onStartFasting: (purpose: string, targetHours: number, type: FastingType) => void;
  onStopFasting: (reflections?: string) => void;
}

export const FastingView: React.FC<FastingViewProps> = ({
  fastingPlan,
  onStartFasting,
  onStopFasting
}) => {
  const [showStartForm, setShowStartForm] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [targetHours, setTargetHours] = useState(12);
  const [type, setType] = useState<FastingType>('water_only');
  const [reflectionNote, setReflectionNote] = useState('');

  // Elapsed calculations
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!fastingPlan.active) {
      setElapsedSeconds(0);
      return;
    }

    const calcElapsed = () => {
      const start = new Date(fastingPlan.startTime).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((now - start) / 1000));
      setElapsedSeconds(diff);
    };

    calcElapsed();
    const timer = setInterval(calcElapsed, 1000);
    return () => clearInterval(timer);
  }, [fastingPlan]);

  const targetSeconds = fastingPlan.targetHours * 3600;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));

  const formatHoursMinutes = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    onStartFasting(purpose.trim(), targetHours, type);
    setShowStartForm(false);
    setPurpose('');
  };

  const handleFinish = () => {
    onStopFasting(reflectionNote.trim() || undefined);
    setReflectionNote('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Consagração e Disciplina do Corpo
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
            Jejum com Propósito
          </h2>
          <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
            "Não só de pão viverá o homem, mas de toda a palavra que procede da boca de Deus." — Mateus 4:4
          </p>
        </div>

        {!fastingPlan.active && (
          <button
            onClick={() => setShowStartForm(true)}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#162E23] text-white hover:bg-[#1F3F30] text-xs font-semibold transition-all shadow-xs self-start sm:self-center"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Consagrar Novo Jejum</span>
          </button>
        )}
      </div>

      {/* Start Fasting Form */}
      {showStartForm && !fastingPlan.active && (
        <form onSubmit={handleStart} className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#29523F]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Definir Propósito e Duração do Jejum
            </h3>
            <button
              type="button"
              onClick={() => setShowStartForm(false)}
              className="text-xs text-[#7D8882]"
            >
              Cancelar
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
              Propósito Espiritual Central *
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Ex: Direção para tomar uma decisão ou Humilhação diante de Deus"
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Tipo de Jejum
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FastingType)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value="water_only">Jejum de Alimentos (Apenas Água)</option>
                <option value="daniel">Jejum de Daniel (Legumes e Água)</option>
                <option value="partial">Jejum Parcial (Pular 1 ou 2 refeições)</option>
                <option value="digital">Jejum Digital / Redes Sociais</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Meta de Duração (Horas)
              </label>
              <select
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              >
                <option value={6}>6 horas (Manhã até o almoço)</option>
                <option value={12}>12 horas (06h às 18h)</option>
                <option value={16}>16 horas (Intermitente Espiritual)</option>
                <option value={24}>24 horas (Dia completo)</option>
                <option value={72}>3 dias</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-[#162E23] text-white text-xs font-semibold"
            >
              Iniciar Jejum Consagrado
            </button>
          </div>
        </form>
      )}

      {/* Active Fasting Dashboard */}
      {fastingPlan.active ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141C19] border border-[#29523F]/20 dark:border-[#29523F]/30 shadow-sm space-y-6 text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <Flame className="w-3.5 h-3.5 fill-emerald-600" />
            <span>Jejum em Andamento</span>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-mono font-bold text-[#162E23] dark:text-[#4F8E71]">
              {formatHoursMinutes(elapsedSeconds)}
            </div>
            <p className="text-xs text-[#7D8882] dark:text-[#788780]">
              Meta: {fastingPlan.targetHours} horas ({progressPercent}% concluído)
            </p>
          </div>

          {/* Barra de Progresso */}
          <div className="max-w-md mx-auto w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#162E23] dark:bg-[#4F8E71] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Propósito e Versículo */}
          <div className="max-w-lg mx-auto p-4 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15 text-left space-y-2">
            <div className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71]">
              Propósito Deste Jejum:
            </div>
            <p className="text-xs sm:text-sm text-[#19211D] dark:text-[#F1F4F2]">
              {fastingPlan.purpose}
            </p>
            <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-xs text-[#7D8882] italic">
              {fastingPlan.scriptureVerse}
            </div>
          </div>

          {/* Campo de notas / encerramento */}
          <div className="max-w-lg mx-auto space-y-3 pt-2">
            <textarea
              rows={2}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="O que Deus tem ministrado ao seu coração durante este jejum?"
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
            />

            <button
              onClick={handleFinish}
              className="w-full py-2.5 px-4 rounded-xl bg-[#162E23] hover:bg-[#1F3F30] text-white text-xs font-semibold transition-all shadow-xs"
            >
              Concluir e Quebrar Jejum com Ação de Graças
            </button>
          </div>

        </div>
      ) : (
        /* Empty / Guidance state */
        <div className="p-8 text-center bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] mx-auto flex items-center justify-center text-[#29523F] dark:text-[#4F8E71]">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
            Nenhum Jejum Ativo no Momento
          </h3>
          <p className="text-xs text-[#7D8882] max-w-sm mx-auto">
            O jejum não visa mudar a vontade de Deus, mas alinhar o nosso coração à vontade Dele e silenciar os apetites da carne.
          </p>
        </div>
      )}

      {/* Princípios Bíblicos do Jejum */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
          <div className="text-xs font-bold text-[#29523F] dark:text-[#4F8E71]">
            1. No Secreto
          </div>
          <p className="text-xs text-[#7D8882] leading-relaxed">
            Jesus ensina em Mateus 6 que o jejum deve ser para o Pai que vê em secreto, sem ostentação pública.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
          <div className="text-xs font-bold text-[#C59B3F]">
            2. Acompanhado de Oração
          </div>
          <p className="text-xs text-[#7D8882] leading-relaxed">
            Sem oração e leitura da Palavra, o jejum é apenas dieta. Substitua o tempo das refeições por comunhão com Deus.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] space-y-1">
          <div className="text-xs font-bold text-[#162E23] dark:text-[#4F8E71]">
            3. Justiça e Amor (Isaías 58)
          </div>
          <p className="text-xs text-[#7D8882] leading-relaxed">
            O verdadeiro jejum inclui soltar as ligaduras da injustiça, repartir o pão com quem tem fome e praticar a misericórdia.
          </p>
        </div>
      </div>

    </div>
  );
};
