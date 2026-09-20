import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  HeartHandshake, 
  Sparkles, 
  BookOpen,
  Volume2
} from 'lucide-react';
import { PrayerRequest } from '../../types';

interface PrayerTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayers: PrayerRequest[];
  onFinishSession: (prayerIds: string[], minutes: number) => void;
}

const PRAYER_PILLARS = [
  {
    step: 'Adoração',
    description: 'Comece exaltando a soberania, a santidade e o caráter amoroso do Pai celestial.',
    scripture: 'Salmos 100:4 — "Entrem por suas portas com ações de graças e em seus átrios com louvor."'
  },
  {
    step: 'Confissão',
    description: 'Abra o coração com humildade, confessando pensamentos, atitudes ou pecados.',
    scripture: '1 João 1:9 — "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar."'
  },
  {
    step: 'Gratidão',
    description: 'Agradeça deliberadamente por 3 graças ou livramentos concretos experimentados.',
    scripture: '1 Tessalonicenses 5:18 — "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus."'
  },
  {
    step: 'Súplica & Intercessão',
    description: 'Apresente os pedidos pelos enfermos, familiares, decisões vitais e a Igreja.',
    scripture: 'Filipenses 4:6 — "Em tudo, pela oração e súplicas, apresentem seus pedidos a Deus."'
  }
];

export const PrayerTimerModal: React.FC<PrayerTimerModalProps> = ({
  isOpen,
  onClose,
  prayers,
  onFinishSession
}) => {
  const [targetMinutes, setTargetMinutes] = useState<number>(10);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedPrayerIds, setSelectedPrayerIds] = useState<string[]>([]);
  const [currentPillarIndex, setCurrentPillarIndex] = useState<number>(0);

  // Inicializar orações selecionadas
  useEffect(() => {
    if (isOpen) {
      const activeIds = prayers.filter(p => !p.answered).slice(0, 3).map(p => p.id);
      setSelectedPrayerIds(activeIds);
      setSecondsRemaining(targetMinutes * 60);
      setIsActive(false);
      setCurrentPillarIndex(0);
    }
  }, [isOpen, prayers, targetMinutes]);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  if (!isOpen) return null;

  const toggleSelectPrayer = (id: string) => {
    setSelectedPrayerIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSetDuration = (mins: number) => {
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsActive(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    const elapsedSeconds = targetMinutes * 60 - secondsRemaining;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    onFinishSession(selectedPrayerIds, elapsedMinutes);
    onClose();
  };

  const currentPillar = PRAYER_PILLARS[currentPillarIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FBFBFA] dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] w-full max-w-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between bg-white dark:bg-[#1B2521]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-[#C59B3F]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Momento de Oração Silenciosa
              </h3>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                "Tu, quando orares, entra no teu quarto e fecha a porta..."
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#141C19]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Duration Selector */}
          <div className="flex items-center justify-center gap-2">
            {[5, 10, 15, 20, 30].map(mins => (
              <button
                key={mins}
                onClick={() => handleSetDuration(mins)}
                disabled={isActive}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  targetMinutes === mins
                    ? 'bg-[#162E23] dark:bg-[#224535] text-white shadow-xs'
                    : 'bg-[#EFEFEA] dark:bg-[#1B2521] text-[#4B554F] dark:text-[#B0BBB5] hover:bg-[#E6E6DF]'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>

          {/* Central Timer Display */}
          <div className="text-center py-4">
            <div className="text-5xl sm:text-6xl font-serif-scripture font-bold tracking-tight text-[#162E23] dark:text-[#4F8E71]">
              {formatTime(secondsRemaining)}
            </div>
            <p className="text-xs text-[#7D8882] dark:text-[#788780] mt-1 font-sans">
              {isActive ? 'Em comunhão com Deus...' : 'Pronto para silenciar e orar'}
            </p>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setIsActive(!isActive)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162E23] text-white hover:bg-[#1F3F30] font-semibold text-sm transition-all shadow-xs"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Iniciar Oração</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsActive(false);
                  setSecondsRemaining(targetMinutes * 60);
                }}
                className="p-2.5 rounded-xl bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#7D8882] hover:text-[#19211D]"
                title="Reiniciar tempo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] hover:bg-[#D5E6DC] font-semibold text-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Concluir</span>
              </button>
            </div>
          </div>

          {/* Guia Meditativo dos 4 Pilares da Oração */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase font-bold tracking-wider text-[#C59B3F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pilar: {currentPillar.step}</span>
              </div>
              <div className="flex gap-1">
                {PRAYER_PILLARS.map((p, idx) => (
                  <button
                    key={p.step}
                    onClick={() => setCurrentPillarIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentPillarIndex === idx ? 'w-5 bg-[#162E23] dark:bg-[#4F8E71]' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-[#19211D] dark:text-[#F1F4F2] leading-relaxed font-sans">
              {currentPillar.description}
            </p>
            
            <p className="text-xs text-[#7D8882] dark:text-[#788780] font-serif-scripture italic border-t border-neutral-100 dark:border-neutral-800 pt-2">
              {currentPillar.scripture}
            </p>
          </div>

          {/* Intercessão por Pedidos Ativos */}
          {prayers.filter(p => !p.answered).length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] flex items-center justify-between">
                <span>Interceder por pedidos de hoje:</span>
                <span className="text-[11px] text-[#7D8882]">
                  {selectedPrayerIds.length} selecionados
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {prayers.filter(p => !p.answered).map(p => (
                  <button
                    key={p.id}
                    onClick={() => toggleSelectPrayer(p.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between border transition-all ${
                      selectedPrayerIds.includes(p.id)
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                        : 'bg-white dark:bg-[#1B2521] border-[#E6E6DF] dark:border-[#24322C] text-[#4B554F] dark:text-[#B0BBB5]'
                    }`}
                  >
                    <span className="font-medium truncate mr-2">{p.title}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedPrayerIds.includes(p.id) ? 'bg-[#C59B3F] border-[#C59B3F] text-white' : 'border-neutral-300'
                    }`}>
                      {selectedPrayerIds.includes(p.id) && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
