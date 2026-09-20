import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Calendar, 
  Clock, 
  BookOpen, 
  Heart, 
  FileText, 
  AlertTriangle, 
  Play, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { FastingPlan, FastingType, FastingStatus, PrayerRequest } from '../../types';

interface FastingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    type: FastingType;
    date: string;
    startTime: string;
    endTime: string;
    targetHours?: number;
    purpose: string;
    relatedPrayerId?: string;
    relatedPrayerTitle?: string;
    relatedPassage?: string;
    notes?: string;
    startNow?: boolean;
    status?: FastingStatus;
  }) => void;
  initialFasting?: FastingPlan | null;
  availablePrayers?: PrayerRequest[];
  defaultPassage?: string;
  defaultPrayerTitle?: string;
  defaultPrayerId?: string;
}

const FASTING_TYPES: { id: FastingType; label: string; desc: string }[] = [
  { id: 'water_only', label: 'Apenas Água', desc: 'Abstenção de alimentos sólidos com hidratação de água' },
  { id: 'partial', label: 'Jejum Parcial', desc: 'Pular uma refeição específica consagrando o tempo em oração' },
  { id: 'daniel', label: 'Jejum de Daniel', desc: 'Legumes, frutas e água, abstendo-se de manjares e açúcares' },
  { id: 'total', label: 'Jejum Total', desc: 'Abstenção temporária completa por período devocional' },
  { id: 'digital', label: 'Jejum Digital', desc: 'Abstenção de telas, redes sociais e entretenimento profano' },
];

export const FastingModal: React.FC<FastingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFasting,
  availablePrayers = [],
  defaultPassage,
  defaultPrayerTitle,
  defaultPrayerId
}) => {
  const [type, setType] = useState<FastingType>('water_only');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('18:00');
  const [purpose, setPurpose] = useState('');
  const [relatedPrayerId, setRelatedPrayerId] = useState('');
  const [relatedPassage, setRelatedPassage] = useState('');
  const [notes, setNotes] = useState('');
  const [startNow, setStartNow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialFasting) {
        setType(initialFasting.type || 'water_only');
        setDate(initialFasting.date || new Date().toISOString().split('T')[0]);
        setStartTime(initialFasting.startTime?.includes('T') ? initialFasting.startTime.split('T')[1].slice(0, 5) : (initialFasting.startTime || '06:00'));
        setEndTime(initialFasting.endTime?.includes('T') ? initialFasting.endTime.split('T')[1].slice(0, 5) : (initialFasting.endTime || '18:00'));
        setPurpose(initialFasting.purpose || initialFasting.title || '');
        setRelatedPrayerId(initialFasting.relatedPrayerId || '');
        setRelatedPassage(initialFasting.relatedPassage || initialFasting.scriptureVerse || '');
        setNotes(initialFasting.notes || initialFasting.reflectionsDuringFast || '');
        setStartNow(initialFasting.status === 'em_andamento');
      } else {
        setType('water_only');
        setDate(new Date().toISOString().split('T')[0]);
        setStartTime('06:00');
        setEndTime('18:00');
        setPurpose('');
        setRelatedPrayerId(defaultPrayerId || '');
        setRelatedPassage(defaultPassage || '');
        setNotes('');
        setStartNow(false);
      }
    }
  }, [isOpen, initialFasting, defaultPassage, defaultPrayerId]);

  if (!isOpen) return null;

  const calculateHours = (start: string, end: string) => {
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff <= 0) diff += 24 * 60;
      return Math.round((diff / 60) * 10) / 10;
    } catch {
      return 12;
    }
  };

  const hoursCalculated = calculateHours(startTime, endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    const selectedPrayer = availablePrayers.find(p => p.id === relatedPrayerId);

    onSave({
      type,
      date,
      startTime,
      endTime,
      targetHours: hoursCalculated,
      purpose: purpose.trim(),
      relatedPrayerId: relatedPrayerId || undefined,
      relatedPrayerTitle: selectedPrayer?.title || defaultPrayerTitle || undefined,
      relatedPassage: relatedPassage.trim() || undefined,
      notes: notes.trim() || undefined,
      startNow,
      status: startNow ? 'em_andamento' : 'planejado'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="fasting-modal-container"
        className="relative w-full max-w-xl bg-white dark:bg-[#141C19] rounded-2xl border border-[#E6E6DF] dark:border-[#24322C] shadow-2xl p-6 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6DF] dark:border-[#24322C]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C59B3F]/10 dark:bg-[#C59B3F]/30 flex items-center justify-center text-[#C59B3F]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                {initialFasting ? 'Editar Propósito de Jejum' : 'Consagrar Jejum'}
              </h2>
              <p className="text-xs text-[#7D8882] dark:text-[#8E9B93]">
                Consagre um período para humilhação, busca espiritual e sensibilidade à voz de Deus.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AVISO MÉDICO OBRIGATÓRIO */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold">Aviso Espiritual & Saúde:</span> O jejum no FAITHION é uma disciplina de caráter estritamente espiritual e devocional. O aplicativo não fornece diagnósticos, dietas ou prescrições médicas. Respeite sempre seus limites físicos e consulte um médico se tiver condições de saúde.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Objetivo Espiritual */}
          <div>
            <label className="block text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Objetivo Espiritual do Jejum *
            </label>
            <input
              id="fasting-purpose-input"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Ex: Quebra de fortalezas, clareza para nova fase, intercessão pela família"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] focus:outline-hidden focus:border-[#29523F] dark:focus:border-[#4F8E71] transition-colors"
            />
          </div>

          {/* Tipo de Jejum */}
          <div>
            <label className="block text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              Tipo de Jejum
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FASTING_TYPES.map(ft => (
                <button
                  key={ft.id}
                  type="button"
                  onClick={() => setType(ft.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    type === ft.id
                      ? 'bg-[#29523F]/10 dark:bg-[#29523F]/30 border-[#29523F] dark:border-[#4F8E71] ring-1 ring-[#29523F]'
                      : 'border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-[#7D8882] hover:bg-neutral-100'
                  }`}
                >
                  <p className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2]">{ft.label}</p>
                  <p className="text-[10px] text-[#7D8882] mt-0.5 leading-tight">{ft.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Data & Horários */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Data</span>
              </label>
              <input
                id="fasting-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Hora Inicial</span>
              </label>
              <input
                id="fasting-starttime-input"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7D8882]" />
                <span>Hora Final ({hoursCalculated}h)</span>
              </label>
              <input
                id="fasting-endtime-input"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
          </div>

          {/* Oração Relacionada & Passagem Bíblica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Oração Relacionada (Opcional)</span>
              </label>
              <select
                id="fasting-prayer-select"
                value={relatedPrayerId}
                onChange={(e) => setRelatedPrayerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="">-- Nenhuma oração vinculada --</option>
                {availablePrayers.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} {p.person ? `(${p.person})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#29523F] dark:text-[#4F8E71]" />
                <span>Passagem Bíblica Relacionada</span>
              </label>
              <input
                id="fasting-passage-input"
                type="text"
                value={relatedPassage}
                onChange={(e) => setRelatedPassage(e.target.value)}
                placeholder="Ex: Isaías 58:6-9, Esdras 8:21"
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#19211D] dark:text-[#F1F4F2] mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#7D8882]" />
              <span>Observações e Recomendações Devocionais</span>
            </label>
            <textarea
              id="fasting-notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Dedicar intervalos para meditação silenciosa e ingestão regular de água fresca."
              className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-[#FAFAF8] dark:bg-[#1B2521] text-xs text-[#19211D] dark:text-[#F1F4F2] resize-none"
            />
          </div>

          {/* Opção de Iniciar Agora */}
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Iniciar Jejum Imediatamente</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Ativa o cronômetro em tempo real agora mesmo</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="fasting-startnow-toggle"
                type="checkbox"
                checked={startNow}
                onChange={(e) => setStartNow(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#29523F]"></div>
            </label>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E6E6DF] dark:border-[#24322C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7D8882] hover:bg-neutral-100 dark:hover:bg-[#1B2521] transition-colors"
            >
              Cancelar
            </button>
            <button
              id="save-fasting-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#29523F] dark:bg-[#386650] text-white text-xs font-bold hover:bg-[#1E3D2F] dark:hover:bg-[#29523F] transition-colors shadow-xs"
            >
              {startNow ? 'Iniciar Jejum Agora' : 'Salvar Planejamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
