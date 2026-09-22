import React, { useState } from 'react';
import { 
  User, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Database,
  Cloud,
  Clock,
  Sparkles,
  Compass
} from 'lucide-react';
import { 
  SpiritualProfile, 
  BibleExperienceLevel, 
  ReadingFrequency,
  PrayerFrequency,
  ReadingPreference, 
  PrayerPreference, 
  RoutinePreference 
} from '../types';
import { FaithionStorageService } from '../services/storage';

interface SettingsViewProps {
  profile: SpiritualProfile;
  onUpdateProfile: (profile: Partial<SpiritualProfile>) => void;
  onResetData: () => void;
  onNavigateToRoutine?: () => void;
  onOpenSyncCenter?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
  onNavigateToRoutine,
  onOpenSyncCenter
}) => {
  // State for all Spiritual Profile fields
  const [name, setName] = useState(profile.name);
  const [wakeUpTime, setWakeUpTime] = useState(profile.wakeUpTime || '06:30');
  const [bedTime, setBedTime] = useState(profile.bedTime || '22:30');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(
    profile.availableTimeSlots || ['Manhã cedo (06:00 - 07:30)', 'Noite (21:30 - 22:30)']
  );
  const [availableDays, setAvailableDays] = useState<string[]>(
    profile.availableDays || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  );
  const [preferredPracticeDurationMinutes, setPreferredPracticeDurationMinutes] = useState(
    profile.preferredPracticeDurationMinutes || 20
  );
  const [bibleExperienceLevel, setBibleExperienceLevel] = useState<BibleExperienceLevel>(
    profile.bibleExperienceLevel || 'intermediario'
  );
  const [readingFrequency, setReadingFrequency] = useState<ReadingFrequency>(
    profile.readingFrequency || 'vezes_semana'
  );
  const [prayerFrequency, setPrayerFrequency] = useState<PrayerFrequency>(
    profile.prayerFrequency || 'uma_dia'
  );
  const [topicsOfInterest, setTopicsOfInterest] = useState<string[]>(
    profile.topicsOfInterest || ['Paz e Ansiedade', 'Sabedoria para Decisões', 'Evangelhos e Vida de Jesus', 'Graça e Identidade']
  );
  const [newTopicInput, setNewTopicInput] = useState('');
  const [readingPreference, setReadingPreference] = useState<ReadingPreference>(
    profile.readingPreference || 'devocionais'
  );
  const [prayerPreference, setPrayerPreference] = useState<PrayerPreference>(
    profile.prayerPreference || 'espontanea'
  );
  const [routinePreference, setRoutinePreference] = useState<RoutinePreference>(
    profile.routinePreference || 'manha_focada'
  );

  const [spiritualFocus, setSpiritualFocus] = useState(profile.spiritualFocus);
  const [lifeSeason, setLifeSeason] = useState(profile.lifeSeason);
  const [dailyPrayerGoal, setDailyPrayerGoal] = useState(profile.dailyPrayerGoalMinutes);
  const [dailyBibleGoal, setDailyBibleGoal] = useState(profile.dailyBibleChaptersGoal);
  const [version, setVersion] = useState(profile.preferredBibleVersion);
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const timeSlotPresets = [
    'Manhã cedo (06:00 - 07:30)',
    'Almoço (12:00 - 13:30)',
    'Final da Tarde (17:30 - 19:00)',
    'Noite (21:30 - 22:30)',
    'Finais de Semana com mais tempo'
  ];

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length > 1) {
        setAvailableDays(availableDays.filter(d => d !== day));
      }
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const toggleTimeSlot = (slot: string) => {
    if (availableTimeSlots.includes(slot)) {
      if (availableTimeSlots.length > 1) {
        setAvailableTimeSlots(availableTimeSlots.filter(s => s !== slot));
      }
    } else {
      setAvailableTimeSlots([...availableTimeSlots, slot]);
    }
  };

  const handleAddTopic = () => {
    const trimmed = newTopicInput.trim();
    if (trimmed && !topicsOfInterest.includes(trimmed)) {
      setTopicsOfInterest([...topicsOfInterest, trimmed]);
      setNewTopicInput('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopicsOfInterest(topicsOfInterest.filter(t => t !== topic));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      wakeUpTime,
      bedTime,
      availableTimeSlots,
      availableDays,
      preferredPracticeDurationMinutes: Number(preferredPracticeDurationMinutes),
      bibleExperienceLevel,
      readingFrequency,
      prayerFrequency,
      topicsOfInterest,
      readingPreference,
      prayerPreference,
      routinePreference,
      spiritualFocus,
      lifeSeason,
      dailyPrayerGoalMinutes: Number(dailyPrayerGoal),
      dailyBibleChaptersGoal: Number(dailyBibleGoal),
      preferredBibleVersion: version
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const json = FaithionStorageService.exportFullBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faithion-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = FaithionStorageService.importFullBackupJSON(content);
        if (success) {
          setImportStatus('Backup restaurado com sucesso! Recarregando...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus('Falha ao processar o arquivo de backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#29523F] dark:bg-[#4F8E71]" />
          <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
            Perfil Espiritual & Rotina Pessoal
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
          Configuração do Teu Perfil Espiritual
        </h2>
        <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1 font-serif-scripture italic">
          O FAITHION não assume pré-concepções sobre tua fé. Tu és quem define teus próprios objetivos, horários e ritmo de caminhada.
        </p>
      </div>

      {/* Form: Spiritual Profile */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Seção 1: Identidade e Horários de Vida Real */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
              <User className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
              <span>Identidade & Horários de Vida Real</span>
            </h3>
            <span className="text-[11px] text-[#7D8882]">Passo 1 de 4</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Nome de Preferência *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2] focus:outline-none focus:border-[#29523F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Horário Habitual de Acordar
              </label>
              <input
                type="text"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                placeholder="06:30"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Horário Habitual de Dormir
              </label>
              <input
                type="text"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                placeholder="22:30"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
          </div>

          {/* Duração Média Desejada */}
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Duração Média Desejada para Práticas (Minutos por bloco)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={preferredPracticeDurationMinutes}
                  onChange={(e) => setPreferredPracticeDurationMinutes(Number(e.target.value))}
                  className="w-24 px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
                />
                <span className="text-xs text-[#7D8882]">
                  Evita sobrecarga e foca na fidelidade real ao longo dos dias.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Tradução Bíblica Preferencial
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="NVI">NVI — Nova Versão Internacional</option>
                <option value="Almeida">Almeida Revista e Atualizada (ARA)</option>
                <option value="ARA">Almeida Corrigida Fiel (ACF)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2: Disponibilidade (Horários e Dias) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
              <span>Dias & Horários Disponíveis</span>
            </h3>
            <span className="text-[11px] text-[#7D8882]">Passo 2 de 4</span>
          </div>

          {/* Dias Disponíveis */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-2">
              Dias da Semana Disponíveis para Práticas
            </label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map(day => {
                const isSelected = availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#162E23] text-white dark:bg-[#224535] shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-[#7D8882]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horários / Janelas Disponíveis */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-2">
              Janelas de Horário Mais Confortáveis
            </label>
            <div className="flex flex-wrap gap-2">
              {timeSlotPresets.map(slot => {
                const isSelected = availableTimeSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleTimeSlot(slot)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#E6F0EA] dark:bg-[#192D23] text-[#162E23] dark:text-[#4F8E71] border border-[#29523F]/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-[#7D8882] border border-transparent'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Seção 3: Nível de Experiência e Frequências Atuais */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
              <span>Experiência Bíblica & Frequências Atuais</span>
            </h3>
            <span className="text-[11px] text-[#7D8882]">Passo 3 de 4</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Nível de Experiência Bíblica
              </label>
              <select
                value={bibleExperienceLevel}
                onChange={(e) => setBibleExperienceLevel(e.target.value as BibleExperienceLevel)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="iniciante">Iniciante (Dando os primeiros passos)</option>
                <option value="intermediario">Intermediário (Conheço os livros centrais)</option>
                <option value="avancado">Avançado (Hábito frequente e hermenêutica)</option>
                <option value="estudioso">Líder / Estudioso das Escrituras</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Frequência Atual de Leitura
              </label>
              <select
                value={readingFrequency}
                onChange={(e) => setReadingFrequency(e.target.value as ReadingFrequency)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="diaria">Diária</option>
                <option value="vezes_semana">Algumas vezes por semana</option>
                <option value="raramente">Raramente</option>
                <option value="recomecando">Recomeçando agora</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Frequência Atual de Oração
              </label>
              <select
                value={prayerFrequency}
                onChange={(e) => setPrayerFrequency(e.target.value as PrayerFrequency)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="multiplas_dia">Múltiplas vezes ao dia</option>
                <option value="uma_dia">Pelo menos uma vez ao dia</option>
                <option value="esporadica">Esporádica (alguns dias)</option>
                <option value="momentos_dificeis">Apenas em momentos difíceis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção 4: Preferências Pessoais & Temas de Interesse */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C59B3F]" />
              <span>Preferências de Prática & Temas de Interesse</span>
            </h3>
            <span className="text-[11px] text-[#7D8882]">Passo 4 de 4</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Preferência de Leitura
              </label>
              <select
                value={readingPreference}
                onChange={(e) => setReadingPreference(e.target.value as ReadingPreference)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="devocionais">Temas devocionais e edificação prática</option>
                <option value="capitulo_a_capitulo">Capítulo a capítulo (Sequencial)</option>
                <option value="versiculo_a_versiculo">Versículo a versículo (Meditação lenta)</option>
                <option value="cronologico">Ordem cronológica bíblica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Preferência de Oração
              </label>
              <select
                value={prayerPreference}
                onChange={(e) => setPrayerPreference(e.target.value as PrayerPreference)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="espontanea">Espontânea e livre conversa com Deus</option>
                <option value="silenciosa">Silenciosa e contemplativa</option>
                <option value="caderno_guiado">Caderno com pedidos e gratidão estruturada</option>
                <option value="salmos_biblica">Oração baseada em Salmos e textos bíblicos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Preferência de Rotina
              </label>
              <select
                value={routinePreference}
                onChange={(e) => setRoutinePreference(e.target.value as RoutinePreference)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              >
                <option value="manha_focada">Manhã focada e estruturada</option>
                <option value="micro_momentos">Micro-momentos e pausas ao longo do dia</option>
                <option value="noite_reflexiva">Noite reflexiva antes de deitar</option>
                <option value="flexivel">Flexível de acordo com o ritmo diário</option>
              </select>
            </div>
          </div>

          {/* Temas de Interesse com Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1.5">
              Temas Bíblicos e Espirituais de Interesse
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {topicsOfInterest.map(topic => (
                <span
                  key={topic}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-[#162E23] dark:text-[#4F8E71] flex items-center gap-1.5 font-medium"
                >
                  <span>{topic}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(topic)}
                    className="text-[#7D8882] hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={newTopicInput}
                onChange={(e) => setNewTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                placeholder="Adicionar tema (ex: Família, Trabalho, Salmos...)"
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F2F7F4] dark:bg-[#1B2521] text-[#162E23] dark:text-[#4F8E71] border border-[#29523F]/30 hover:bg-[#E6F0EA]"
              >
                + Adicionar
              </button>
            </div>
          </div>

          {/* Foco e Estação de Vida */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Foco Espiritual da Temporada
              </label>
              <input
                type="text"
                value={spiritualFocus}
                onChange={(e) => setSpiritualFocus(e.target.value)}
                placeholder="Ex: Intimidade com Deus e Firmeza Diária"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B554F] dark:text-[#B0BBB5] mb-1">
                Estação de Vida
              </label>
              <input
                type="text"
                value={lifeSeason}
                onChange={(e) => setLifeSeason(e.target.value)}
                placeholder="Ex: Novos projetos, busca por sabedoria e calma"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#FBFBFA] dark:bg-[#1B2521] border border-[#E6E6DF] dark:border-[#24322C] text-[#19211D] dark:text-[#F1F4F2]"
              />
            </div>
          </div>

          {/* Atalho para Objetivos */}
          {onNavigateToRoutine && (
            <div className="pt-2 flex items-center justify-between text-xs text-[#7D8882] bg-[#FBFBFA] dark:bg-[#1B2521] p-3 rounded-xl border border-[#E6E6DF] dark:border-[#24322C]">
              <span>Deseja gerenciar seus objetivos específicos de oração, Bíblia e disciplina?</span>
              <button
                type="button"
                onClick={onNavigateToRoutine}
                className="font-bold text-[#162E23] dark:text-[#4F8E71] hover:underline"
              >
                Abrir Central de Rotina & Objetivos →
              </button>
            </div>
          )}

          {/* Botão de Salvar */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {savedSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Perfil espiritual salvo com sucesso!</span>
              </span>
            )}
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#162E23] text-white hover:bg-[#1F3F30] text-xs font-bold transition-all shadow-xs"
            >
              Salvar Perfil Espiritual
            </button>
          </div>
        </div>

      </form>

      {/* Backup & Dados */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#C59B3F]" />
          <span>Gestão de Dados & Backup</span>
        </h3>
        <p className="text-xs text-[#7D8882]">
          Seus registros espirituais, rotina, objetivos e reflexões pertencem exclusivamente a você. Faça backup em arquivo JSON a qualquer momento.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E6F0EA] text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 text-[#162E23] dark:text-[#4F8E71] hover:bg-[#E6F0EA] text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Importar Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar os dados de exemplo padrão do Faithion?')) {
                onResetData();
              }
            }}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs text-[#7D8882] hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Dados Iniciais</span>
          </button>
        </div>

        {importStatus && (
          <div className="text-xs font-medium text-[#29523F] dark:text-[#4F8E71]">
            {importStatus}
          </div>
        )}
      </section>

      {/* Arquitetura de Sincronização Supabase */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#F2F7F4] dark:bg-[#1B2521] border border-[#29523F]/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#29523F] dark:text-[#4F8E71] uppercase tracking-wider">
            <Cloud className="w-4 h-4" />
            <span>Arquitetura de Sincronização Cloud (Supabase-Ready)</span>
          </div>
          {onOpenSyncCenter && (
            <button
              type="button"
              id="open-sync-center-from-settings"
              onClick={onOpenSyncCenter}
              className="py-1.5 px-3.5 rounded-xl bg-[#162E23] hover:bg-[#1F3F30] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Gerenciar Sincronização & Nuvem</span>
            </button>
          )}
        </div>
        <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
          Modelo Local-First Desacoplado & Seguro
        </h4>
        <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
          O FAITHION opera 100% no seu dispositivo sem dependência obrigatória de servidores. As entidades de <code className="text-xs bg-white dark:bg-black/30 px-1 py-0.5 rounded">Perfil</code>, <code className="text-xs bg-white dark:bg-black/30 px-1 py-0.5 rounded">Rotina</code>, <code className="text-xs bg-white dark:bg-black/30 px-1 py-0.5 rounded">Objetivos</code>, <code className="text-xs bg-white dark:bg-black/30 px-1 py-0.5 rounded">Logs de Execução</code> e <code className="text-xs bg-white dark:bg-black/30 px-1 py-0.5 rounded">Adaptações</code> estão preparadas para sincronização com PostgreSQL / Supabase quando ativado.
        </p>
      </section>

    </div>
  );
};
