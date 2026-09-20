import React from 'react';
import { 
  BarChart3, 
  Flame, 
  HeartHandshake, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  TrendingUp,
  Award
} from 'lucide-react';
import { DailyConsistency, SpiritualProfile } from '../types';

interface StatsViewProps {
  consistencyHistory: DailyConsistency[];
  profile: SpiritualProfile;
  answeredPrayersCount: number;
  totalPrayersCount: number;
}

export const StatsView: React.FC<StatsViewProps> = ({
  consistencyHistory,
  profile,
  answeredPrayersCount,
  totalPrayersCount
}) => {
  // Cálculos consolidados
  const totalDaysTracked = consistencyHistory.length;
  const totalPrayerMinutes = consistencyHistory.reduce((acc, h) => acc + h.prayerMinutes, 0);
  const totalPrayerHours = (totalPrayerMinutes / 60).toFixed(1);
  const totalChaptersRead = consistencyHistory.filter(h => h.bibleRead).length;
  const totalFastingCompleted = consistencyHistory.filter(h => h.fastingLogged).length;
  
  const averageScore = totalDaysTracked > 0
    ? Math.round(consistencyHistory.reduce((acc, h) => acc + h.score, 0) / totalDaysTracked)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
            Monitoramento de Fidelidade
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2]">
          Constância na Caminhada
        </h2>
        <p className="text-xs sm:text-sm text-[#4B554F] dark:text-[#B0BBB5] mt-1">
          "Muito bem, servo bom e fiel; sobre o pouco foste fiel, sobre o muito te colocarei." — Mateus 25:21
        </p>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
          <div className="flex items-center justify-between text-[#7D8882]">
            <span className="text-xs font-semibold">Tempo de Oração</span>
            <HeartHandshake className="w-4 h-4 text-[#C59B3F]" />
          </div>
          <div className="text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-2">
            {totalPrayerHours}h
          </div>
          <div className="text-[11px] text-[#7D8882] mt-0.5">
            {totalPrayerMinutes} minutos acumulados
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
          <div className="flex items-center justify-between text-[#7D8882]">
            <span className="text-xs font-semibold">Leituras Registradas</span>
            <BookOpen className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />
          </div>
          <div className="text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-2">
            {totalChaptersRead}
          </div>
          <div className="text-[11px] text-[#7D8882] mt-0.5">
            dias de leitura cumprida
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
          <div className="flex items-center justify-between text-[#7D8882]">
            <span className="text-xs font-semibold">Orações Respondidas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#19211D] dark:text-[#F1F4F2] mt-2">
            {answeredPrayersCount}
          </div>
          <div className="text-[11px] text-[#7D8882] mt-0.5">
            de {totalPrayersCount} pedidos apresentados
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-2xs">
          <div className="flex items-center justify-between text-[#7D8882]">
            <span className="text-xs font-semibold">Consistência Média</span>
            <TrendingUp className="w-4 h-4 text-[#162E23] dark:text-[#4F8E71]" />
          </div>
          <div className="text-2xl font-bold text-[#162E23] dark:text-[#4F8E71] mt-2">
            {averageScore}%
          </div>
          <div className="text-[11px] text-[#7D8882] mt-0.5">
            cumprimento das atividades
          </div>
        </div>

      </div>

      {/* Calendário de Fidelidade dos Últimos 14 Dias */}
      <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
            Mapa Diário de Fidelidade (Últimos 14 Dias)
          </h3>
          <p className="text-xs text-[#7D8882]">
            Acompanhe o ritmo diário sem cobrança doentia, com foco em perseverança
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 pt-2">
          {consistencyHistory.map((day) => {
            const dateObj = new Date(day.date + 'T12:00:00');
            const dayOfWeek = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(dateObj);
            const dayNum = dateObj.getDate();

            let bgClass = 'bg-[#F2F7F4] dark:bg-[#1B2521] border-[#E6E6DF] dark:border-[#24322C]';
            if (day.score >= 90) bgClass = 'bg-[#162E23] text-white border-[#162E23] dark:bg-[#224535]';
            else if (day.score >= 70) bgClass = 'bg-[#386E56] text-white border-[#386E56]';
            else if (day.score > 0) bgClass = 'bg-[#E6F0EA] text-[#162E23] dark:bg-[#192D23] dark:text-[#4F8E71]';

            const isDarkBg = day.score >= 70;

            return (
              <div
                key={day.date}
                className={`p-3 rounded-xl border text-center transition-all ${bgClass}`}
              >
                <div className={`text-[10px] uppercase font-bold ${isDarkBg ? 'text-amber-200' : 'text-[#7D8882]'}`}>
                  {dayOfWeek}
                </div>
                <div className="text-base font-bold my-0.5">
                  {dayNum}
                </div>
                <div className={`text-[10px] ${isDarkBg ? 'text-white/80' : 'text-[#4B554F] dark:text-[#B0BBB5]'}`}>
                  {day.score}%
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 text-[11px] text-[#7D8882] pt-2">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E6F0EA] dark:bg-[#192D23]" /> Parcial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#386E56]" /> Bom
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#162E23] dark:bg-[#224535]" /> Pleno (90%+)
          </span>
        </div>
      </section>

    </div>
  );
};
