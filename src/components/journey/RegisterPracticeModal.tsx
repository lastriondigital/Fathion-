import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  HeartHandshake, 
  Flame, 
  Compass, 
  GraduationCap, 
  Layers, 
  CalendarDays, 
  Church, 
  BrainCircuit, 
  Sparkles, 
  Check, 
  Clock, 
  FileText, 
  MapPin, 
  BookmarkCheck
} from 'lucide-react';
import { PracticeCategory, PracticeRecord } from '../../types';

interface RegisterPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<PracticeRecord, 'id' | 'createdAt'>) => void;
  initialCategory?: PracticeCategory;
}

const CATEGORY_OPTIONS: {
  type: PracticeCategory;
  label: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}[] = [
  { type: 'bible', label: 'Leitura Bíblica', desc: 'Passagem ou capítulo lido', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { type: 'prayer', label: 'Oração & Clamor', desc: 'Intercessão, louvor e entrega', icon: HeartHandshake, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400' },
  { type: 'fasting', label: 'Jejum', desc: 'Propósito consagrado de abstinência', icon: Flame, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400' },
  { type: 'reflection', label: 'Reflexão & Diário', desc: 'Meditação e escuta de Deus', icon: Compass, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' },
  { type: 'study', label: 'Estudo Bíblico', desc: 'Aprofundamento temático ou exegese', icon: GraduationCap, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400' },
  { type: 'plan', label: 'Plano de Leitura', desc: 'Cumprimento de dia de plano', icon: Layers, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' },
  { type: 'activity', label: 'Atividade de Rotina', desc: 'Prática matinal, diurna ou noturna', icon: CalendarDays, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400' },
  { type: 'event', label: 'Culto ou Evento', desc: 'Culto na igreja, vigília, congresso', icon: Church, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400' },
  { type: 'memorization', label: 'Memorização', desc: 'Versículo guardado no coração', icon: BrainCircuit, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' },
  { type: 'custom', label: 'Prática Personalizada', desc: 'Caminhada de oração, silêncio, etc.', icon: Sparkles, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400' }
];

export const RegisterPracticeModal: React.FC<RegisterPracticeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory = 'bible'
}) => {
  const [selectedType, setSelectedType] = useState<PracticeCategory>(initialCategory);
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(currentTime);
  const [title, setTitle] = useState('');
  const [passageRef, setPassageRef] = useState('');
  const [prayerFocus, setPrayerFocus] = useState('');
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [resultSummary, setResultSummary] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [chaptersCount, setChaptersCount] = useState<number>(1);
  const [locationOrLeader, setLocationOrLeader] = useState('');
  const [status, setStatus] = useState<'concluido' | 'parcial' | 'ignorado' | 'atrasado' | 'planejado'>('concluido');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Título padrão se deixado em branco
    let finalTitle = title.trim();
    if (!finalTitle) {
      const cat = CATEGORY_OPTIONS.find(c => c.type === selectedType);
      finalTitle = passageRef ? `${cat?.label}: ${passageRef}` : (cat?.label || 'Prática Espiritual');
    }

    onSave({
      date,
      time,
      type: selectedType,
      title: finalTitle,
      passageRef: passageRef.trim() || undefined,
      prayerFocus: prayerFocus.trim() || undefined,
      reflectionNotes: reflectionNotes.trim() || undefined,
      resultSummary: resultSummary.trim() || undefined,
      durationMinutes: Number(durationMinutes) || undefined,
      chaptersCount: (selectedType === 'bible' || selectedType === 'study' || selectedType === 'plan') ? (Number(chaptersCount) || 1) : undefined,
      locationOrLeader: locationOrLeader.trim() || undefined,
      status
    });

    // Reset fields
    setTitle('');
    setPassageRef('');
    setPrayerFocus('');
    setReflectionNotes('');
    setResultSummary('');
    setLocationOrLeader('');
    setStatus('concluido');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        id="register-practice-modal"
        className="bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between bg-[#F8F9F8] dark:bg-[#1A2420]">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Acompanhamento Espiritual
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
              Registrar Prática ou Evento
            </h2>
          </div>
          <button 
            id="close-practice-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-[#7D8882] hover:text-[#19211D] dark:hover:text-[#F1F4F2] hover:bg-[#E6E6DF]/50 dark:hover:bg-[#24322C]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1 text-sm text-[#19211D] dark:text-[#F1F4F2]">
          
          {/* Seletor de Tipo de Prática (10 tipos) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7D8882] dark:text-[#788780] mb-2">
              Tipo de Prática (10 Modalidades de Acompanhamento)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORY_OPTIONS.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedType === cat.type;
                return (
                  <button
                    key={cat.type}
                    type="button"
                    id={`select-practice-type-${cat.type}`}
                    onClick={() => setSelectedType(cat.type)}
                    className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all text-xs ${
                      isSelected 
                        ? 'border-[#29523F] bg-[#29523F]/10 dark:border-[#4F8E71] dark:bg-[#4F8E71]/20 font-semibold' 
                        : 'border-[#E6E6DF] dark:border-[#24322C] hover:bg-neutral-50 dark:hover:bg-[#1B2621]'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mb-1.5 ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate w-full">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Linha de Data e Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                Data do Registro
              </label>
              <input
                type="date"
                id="practice-date-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                Horário
              </label>
              <input
                type="time"
                id="practice-time-input"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                Status da Prática
              </label>
              <select
                id="practice-status-select"
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
              >
                <option value="concluido">Concluído</option>
                <option value="parcial">Parcial</option>
                <option value="atrasado">Atrasado / Reagendado</option>
                <option value="ignorado">Ignorado / Pulado</option>
                <option value="planejado">Planejado</option>
              </select>
            </div>
          </div>

          {/* Título da Prática */}
          <div>
            <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
              Título / Nome da Atividade
            </label>
            <input
              type="text"
              id="practice-title-input"
              placeholder={
                selectedType === 'bible' ? 'Ex: Leitura Matinal de Romanos' :
                selectedType === 'event' ? 'Ex: Culto de Celebração de Domingo' :
                selectedType === 'study' ? 'Ex: Estudo sobre a Oração Sacerdotal' :
                selectedType === 'prayer' ? 'Ex: Oração de Intercessão pela Família' :
                selectedType === 'memorization' ? 'Ex: Memorização de Salmo 119:11' :
                'Ex: Caminhada em Oração e Gratidão'
              }
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
            />
          </div>

          {/* Passagem Bíblica (Específico para leitura, estudo, reflexão, plano, memorização) */}
          {(selectedType === 'bible' || selectedType === 'study' || selectedType === 'reflection' || selectedType === 'plan' || selectedType === 'memorization' || selectedType === 'event') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                  Passagem Bíblica (Passagem na Timeline)
                </label>
                <input
                  type="text"
                  id="practice-passage-input"
                  placeholder="Ex: Romanos 8:1-17, Salmo 23, Tiago 1:5"
                  value={passageRef}
                  onChange={e => setPassageRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                  Capítulos Lidos
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  id="practice-chapters-input"
                  value={chaptersCount}
                  onChange={e => setChaptersCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
                />
              </div>
            </div>
          )}

          {/* Campo específico para Culto/Evento: Igreja, Pregador ou Local */}
          {selectedType === 'event' && (
            <div>
              <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                Local, Igreja ou Pregador
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-[#7D8882]" />
                <input
                  type="text"
                  id="practice-location-input"
                  placeholder="Ex: Igreja Batista Central — Pr. Samuel"
                  value={locationOrLeader}
                  onChange={e => setLocationOrLeader(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
                />
              </div>
            </div>
          )}

          {/* Duração */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                Duração (minutos dedicados)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2.5 text-[#7D8882]" />
                <input
                  type="number"
                  min="1"
                  max="480"
                  id="practice-duration-input"
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
                Oração Associada (Oração na Timeline)
              </label>
              <input
                type="text"
                id="practice-prayer-input"
                placeholder="Ex: Pedido de cura, clamor por direção, ação de graças"
                value={prayerFocus}
                onChange={e => setPrayerFocus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
              />
            </div>
          </div>

          {/* Reflexão e O que aprendeu */}
          <div>
            <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
              Reflexão / O que Deus ministrou ao coração (Reflexão na Timeline)
            </label>
            <textarea
              id="practice-reflection-input"
              rows={2}
              placeholder="O que mais chamou atenção no texto ou momento? Qual a aplicação prática para sua vida?"
              value={reflectionNotes}
              onChange={e => setReflectionNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
            />
          </div>

          {/* Resultado (Resultado na Timeline) */}
          <div>
            <label className="block text-xs font-medium text-[#7D8882] dark:text-[#788780] mb-1">
              Resultado / Fruto Concreto (Resultado na Timeline)
            </label>
            <input
              type="text"
              id="practice-result-input"
              placeholder="Ex: Paz renovada, versículo decorado, decisão tomada, comunhão edificada"
              value={resultSummary}
              onChange={e => setResultSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2621] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#29523F]"
            />
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="cancel-practice-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E6E6DF] dark:border-[#24322C] text-xs font-medium text-[#4B554F] dark:text-[#B0BBB5] hover:bg-neutral-50 dark:hover:bg-[#1B2621] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="submit-practice-btn"
              className="px-5 py-2 rounded-xl bg-[#29523F] hover:bg-[#1E3D2F] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              Confirmar e Salvar Registro
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
