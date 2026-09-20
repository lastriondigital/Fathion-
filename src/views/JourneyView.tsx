import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  PenLine, 
  Plus, 
  CheckCircle2, 
  Flame, 
  HeartHandshake, 
  BookOpen, 
  Calendar, 
  ArrowRight,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { Reflection, SpiritualProfile, DailyConsistency } from '../types';

interface JourneyViewProps {
  profile: SpiritualProfile;
  reflections: Reflection[];
  onAddReflection: (ref: Omit<Reflection, 'id' | 'createdAt'>) => void;
  consistencyHistory: DailyConsistency[];
  onUpdateProfileGoals: (prayerMins: number, chapters: number) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  profile,
  reflections,
  onAddReflection,
  consistencyHistory,
  onUpdateProfileGoals
}) => {
  const [showNewReflForm, setShowNewReflForm] = useState(false);
  const [whatGodSpoke, setWhatGodSpoke] = useState('');
  const [practicalApp, setPracticalApp] = useState('');
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [scriptureRef, setScriptureRef] = useState('');
  const [moodRating, setMoodRating] = useState<1 | 2 | 3 | 4 | 5>(4);

  // Adaptação de Carga
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptedPrayer, setAdaptedPrayer] = useState(profile.dailyPrayerGoalMinutes);
  const [adaptedChapters, setAdaptedChapters] = useState(profile.dailyBibleChaptersGoal);
  const [adaptedSuccess, setAdaptedSuccess] = useState(false);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatGodSpoke.trim()) return;

    onAddReflection({
      date: new Date().toISOString().split('T')[0],
      whatGodSpoke: whatGodSpoke.trim(),
      practicalApplication: practicalApp.trim(),
      gratitudeNotes: gratitudeInput.split('\n').filter(s => s.trim().length > 0),
      scriptureRef: scriptureRef.trim() || undefined,
      moodRating
    });

    setWhatGodSpoke('');
    setPracticalApp('');
    setGratitudeInput('');
    setScriptureRef('');
    setShowNewReflForm(false);
  };

  const handleApplyAdaptation = () => {
    onUpdateProfileGoals(adaptedPrayer, adaptedChapters);
    setAdaptedSuccess(true);
    setTimeout(() => {
      setAdaptedSuccess(false);
      setIsAdapting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Principle */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
            Princípio Central do Faithion
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
          A Caminhada do Discípulo
        </h2>
        <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
          Uma vida espiritual madura não vive de impulsos emocionais efêmeros, mas de fidelidade constante.
        </p>

        {/* The 4 pillars: PLANEJAR → EXECUTAR → MONITORAR → ADAPTAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#E6E6DF] dark:border-[#24322C]">
          
          <div className="p-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
            <span className="text-[10px] uppercase font-bold text-[#29523F] dark:text-[#4F8E71]">
              Fase 1
            </span>
            <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
              Planejar
            </h4>
            <p className="text-xs text-[#7D8882] mt-1">
              Definir rotina do dia e planos bíblicos com horários realistas.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
            <span className="text-[10px] uppercase font-bold text-[#C59B3F]">
              Fase 2
            </span>
            <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
              Executar
            </h4>
            <p className="text-xs text-[#7D8882] mt-1">
              "O que faço agora?" — Ações guiadas sem paralisia por sobrecarga.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
            <span className="text-[10px] uppercase font-bold text-[#162E23] dark:text-[#4F8E71]">
              Fase 3
            </span>
            <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
              Monitorar
            </h4>
            <p className="text-xs text-[#7D8882] mt-1">
              Acompanhar consistência, orações respondidas e meditações.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/15">
            <span className="text-[10px] uppercase font-bold text-[#2A6E4F]">
              Fase 4
            </span>
            <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
              Adaptar
            </h4>
            <p className="text-xs text-[#7D8882] mt-1">
              Ajustar a carga com graça. Menos perfeccionismo, mais perseverança.
            </p>
          </div>

        </div>
      </div>

      {/* ADAPTAR: Ferramenta de Ajuste de Carga Espiritual */}
      <section className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C59B3F] uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Adaptação de Rotina sem Culpa</span>
            </div>
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] mt-0.5">
              Sentindo a rotina espiritual pesada ou irrealista?
            </h3>
            <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] max-w-xl">
              Deus se agrada da sinceridade do coração, não de listas sobrecarregadas que geram ansiedade e abandono. Ajuste sua carga para o ritmo da sua estação atual.
            </p>
          </div>

          <button
            onClick={() => setIsAdapting(!isAdapting)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#1B2521] border border-amber-300 dark:border-amber-800 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100/50 self-start sm:self-center transition-colors"
          >
            {isAdapting ? 'Fechar Ajuste' : 'Ajustar Metas'}
          </button>
        </div>

        {isAdapting && (
          <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/50 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Meta de Oração Diária Sustentável:
              </label>
              <div className="flex items-center gap-2">
                {[10, 15, 20, 30].map(m => (
                  <button
                    key={m}
                    onClick={() => setAdaptedPrayer(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      adaptedPrayer === m 
                        ? 'bg-[#162E23] text-white' 
                        : 'bg-white dark:bg-[#1B2521] border border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Leitura Bíblica Diária:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map(c => (
                  <button
                    key={c}
                    onClick={() => setAdaptedChapters(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      adaptedChapters === c 
                        ? 'bg-[#162E23] text-white' 
                        : 'bg-white dark:bg-[#1B2521] border border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    {c} {c === 1 ? 'capítulo' : 'capítulos'}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleApplyAdaptation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#162E23] text-white text-xs font-semibold"
              >
                {adaptedSuccess ? <Check className="w-4 h-4" /> : null}
                <span>{adaptedSuccess ? 'Metas Adaptadas!' : 'Salvar Nova Carga'}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* DIÁRIO DE REFLEXÕES & GRATIDÃO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Diário Espiritual & O Que Deus Falou
            </h3>
            <p className="text-xs text-[#7D8882]">
              Registre as ministrações do Espírito e as atitudes práticas do dia a dia
            </p>
          </div>
          <button
            onClick={() => setShowNewReflForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#162E23] text-white hover:bg-[#1F3F30] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Reflexão</span>
          </button>
        </div>

        {/* Formulário de Nova Reflexão */}
        {showNewReflForm && (
          <form onSubmit={handleSaveReflection} className="p-5 rounded-2xl bg-white dark:bg-[#141C19] border border-[#29523F]/30 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Registrar Diário Espiritual de Hoje
              </h4>
              <button
                type="button"
                onClick={() => setShowNewReflForm(false)}
                className="text-xs text-[#7D8882]"
              >
                Cancelar
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Passagem Bíblica Inspiradora (Opcional)
              </label>
              <input
                type="text"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                placeholder="Ex: Romanos 8:28 ou Salmos 23:1"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#162E23] dark:text-[#4F8E71] mb-1">
                O que Deus falou comigo hoje? *
              </label>
              <textarea
                required
                rows={3}
                value={whatGodSpoke}
                onChange={(e) => setWhatGodSpoke(e.target.value)}
                placeholder="Anote com sinceridade o direcionamento, confronto de amor ou consolo que você recebeu..."
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C59B3F] mb-1">
                Aplicação Prática (Como isso muda meu dia?):
              </label>
              <textarea
                rows={2}
                value={practicalApp}
                onChange={(e) => setPracticalApp(e.target.value)}
                placeholder="Ex: Não vou reagir com impaciência na reunião de hoje; vou respirar e orar antes de responder."
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Motivos de Gratidão (1 por linha):
              </label>
              <textarea
                rows={2}
                value={gratitudeInput}
                onChange={(e) => setGratitudeInput(e.target.value)}
                placeholder="Pela paz no caminho&#10;Pela provisão no almoço&#10;Por um amigo que mandou mensagem"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#162E23] text-white text-xs font-semibold"
              >
                Salvar no Diário
              </button>
            </div>
          </form>
        )}

        {/* Lista de Registros Anteriores */}
        <div className="space-y-3">
          {reflections.map((refl) => (
            <div
              key={refl.id}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs text-[#7D8882]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#29523F]" />
                  <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                    {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(refl.date + 'T12:00:00'))}
                  </span>
                  {refl.scriptureRef && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] font-semibold">
                      {refl.scriptureRef}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-[#162E23] dark:text-[#4F8E71] block mb-0.5">
                  O que Deus falou:
                </span>
                <p className="text-xs sm:text-sm text-[#19211D] dark:text-[#F1F4F2] font-serif-scripture leading-relaxed">
                  "{refl.whatGodSpoke}"
                </p>
              </div>

              {refl.practicalApplication && (
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-bold text-[#C59B3F] block mb-0.5">
                    Aplicação no Cotidiano:
                  </span>
                  <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5]">
                    {refl.practicalApplication}
                  </p>
                </div>
              )}

              {refl.gratitudeNotes && refl.gratitudeNotes.length > 0 && (
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-bold text-[#7D8882] block mb-1">
                    Gratidão Reconhecida:
                  </span>
                  <ul className="text-xs text-[#4B554F] dark:text-[#B0BBB5] space-y-0.5 list-disc list-inside">
                    {refl.gratitudeNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
