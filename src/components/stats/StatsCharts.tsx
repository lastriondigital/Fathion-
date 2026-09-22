import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  BarChart2, 
  Calendar as CalendarIcon, 
  PieChart as PieChartIcon,
  TrendingUp,
  Clock,
  BookOpen,
  HeartHandshake
} from 'lucide-react';
import { DetailedRoutineStats } from '../../types';

interface StatsChartsProps {
  stats: DetailedRoutineStats;
}

export const StatsCharts: React.FC<StatsChartsProps> = ({ stats }) => {
  const [activeChartTab, setActiveChartTab] = useState<'timeline' | 'heatmap' | 'distribution' | 'weekday'>('timeline');

  // Máximo para escala do gráfico de linha
  const maxCompleted = Math.max(...stats.dailyTimeline.map(d => d.completedCount), 5);
  const maxMinutes = Math.max(...stats.dailyTimeline.map(d => Math.max(d.prayerMinutes, d.readingMinutes)), 30);

  return (
    <section className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141C19] border border-[#E6E6DF] dark:border-[#24322C] shadow-xs space-y-6">
      
      {/* Header com Navegação de Abas do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F2EF] dark:border-[#212E27]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#7D8882] dark:text-[#788780]">
              Visualizações & Padrões
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#19211D] dark:text-[#F1F4F2]">
            Comportamento Gráfico da Rotina
          </h3>
          <p className="text-xs text-[#617068] dark:text-[#9AA8A1]">
            Visão gráfica sóbria do ritmo de práticas ao longo do tempo
          </p>
        </div>

        {/* Seletor de Visão Gráfica */}
        <div className="flex items-center p-1 rounded-xl bg-[#F2F7F4] dark:bg-[#1B2621] border border-[#E6E6DF] dark:border-[#24322C] self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            id="chart-tab-timeline"
            onClick={() => setActiveChartTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeChartTab === 'timeline'
                ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs'
                : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            Tendência
          </button>

          <button
            type="button"
            id="chart-tab-heatmap"
            onClick={() => setActiveChartTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeChartTab === 'heatmap'
                ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs'
                : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Calendário
          </button>

          <button
            type="button"
            id="chart-tab-distribution"
            onClick={() => setActiveChartTab('distribution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeChartTab === 'distribution'
                ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs'
                : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            Distribuição
          </button>

          <button
            type="button"
            id="chart-tab-weekday"
            onClick={() => setActiveChartTab('weekday')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeChartTab === 'weekday'
                ? 'bg-white dark:bg-[#25362E] text-[#162E23] dark:text-[#F1F4F2] shadow-2xs'
                : 'text-[#617068] dark:text-[#8D9B94] hover:text-[#19211D] dark:hover:text-[#F1F4F2]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Semana
          </button>
        </div>
      </div>

      {/* 1. GRÁFICO DE TENDÊNCIA TEMPORAL (LINHA / ÁREA RESPONSIVA) */}
      {activeChartTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#617068] dark:text-[#9AA8A1]">
              Acompanhamento dia a dia ({stats.dailyTimeline.length} dias avaliados)
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-[#4B554F] dark:text-[#B0BBB5]">
                <span className="w-3 h-1.5 rounded-xs bg-[#29523F] dark:bg-[#4F8E71]" />
                Atividades cumpridas
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#4B554F] dark:text-[#B0BBB5]">
                <span className="w-3 h-1.5 rounded-xs bg-[#C59B3F]" />
                Minutos de oração
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#4B554F] dark:text-[#B0BBB5]">
                <span className="w-3 h-1.5 rounded-xs bg-[#6366F1]" />
                Minutos de leitura
              </span>
            </div>
          </div>

          {/* Gráfico SVG vetorial responsivo */}
          <div className="w-full h-56 relative border border-[#F0F2EF] dark:border-[#202E27] rounded-xl p-3 bg-[#FAFCFB] dark:bg-[#111815] overflow-x-auto">
            <div className="min-w-[600px] h-full flex flex-col justify-between">
              {/* SVG Area */}
              <div className="relative flex-1">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 160">
                  {/* Linhas de grade sutis */}
                  <line x1="0" y1="40" x2="1000" y2="40" stroke="#E6EBE8" strokeDasharray="3 3" className="dark:stroke-[#203028]" />
                  <line x1="0" y1="80" x2="1000" y2="80" stroke="#E6EBE8" strokeDasharray="3 3" className="dark:stroke-[#203028]" />
                  <line x1="0" y1="120" x2="1000" y2="120" stroke="#E6EBE8" strokeDasharray="3 3" className="dark:stroke-[#203028]" />

                  {/* Linha 1: Atividades Concluídas */}
                  {stats.dailyTimeline.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#29523F"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dark:stroke-[#4F8E71]"
                      points={stats.dailyTimeline.map((d, idx) => {
                        const x = (idx / (stats.dailyTimeline.length - 1)) * 1000;
                        const y = 140 - (d.completedCount / maxCompleted) * 110;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}

                  {/* Linha 2: Minutos de Oração */}
                  {stats.dailyTimeline.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#C59B3F"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={stats.dailyTimeline.map((d, idx) => {
                        const x = (idx / (stats.dailyTimeline.length - 1)) * 1000;
                        const y = 140 - (Math.min(d.prayerMinutes, maxMinutes) / maxMinutes) * 110;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}

                  {/* Pontos de dados */}
                  {stats.dailyTimeline.map((d, idx) => {
                    // Pular pontos se forem muitos para não poluir
                    const step = stats.dailyTimeline.length > 35 ? 4 : (stats.dailyTimeline.length > 16 ? 2 : 1);
                    if (idx % step !== 0 && idx !== stats.dailyTimeline.length - 1) return null;

                    const x = (idx / (stats.dailyTimeline.length - 1)) * 1000;
                    const y = 140 - (d.completedCount / maxCompleted) * 110;
                    return (
                      <g key={d.date}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          className="fill-[#29523F] dark:fill-[#4F8E71] stroke-white dark:stroke-[#111815] stroke-2"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Rótulos de datas no eixo X */}
              <div className="flex justify-between text-[10px] text-[#7D8882] dark:text-[#8D9B94] pt-2 border-t border-[#E6EBE8] dark:border-[#1E2C25]">
                {stats.dailyTimeline.map((d, idx) => {
                  const step = stats.dailyTimeline.length > 35 ? 7 : (stats.dailyTimeline.length > 14 ? 3 : 1);
                  if (idx % step !== 0 && idx !== stats.dailyTimeline.length - 1) return null;
                  return (
                    <span key={d.date} className="text-center font-medium">
                      {d.dayLabel}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CALENDÁRIO DE ATIVIDADE (HEATMAP DE INTENSIDADE) */}
      {activeChartTab === 'heatmap' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#617068] dark:text-[#9AA8A1]">
              Mapa de densidade de práticas no período ({stats.activeDays} dias com práticas cumpridas)
            </span>
            <div className="flex items-center gap-2 text-[11px] text-[#7D8882]">
              <span>Inativo</span>
              <span className="w-3 h-3 rounded-xs bg-[#ECEFEA] dark:bg-[#1A2520]" />
              <span className="w-3 h-3 rounded-xs bg-[#C9DEC8] dark:bg-[#203D2B]" />
              <span className="w-3 h-3 rounded-xs bg-[#6E9E80] dark:bg-[#2C6343]" />
              <span className="w-3 h-3 rounded-xs bg-[#29523F] dark:bg-[#4F8E71]" />
              <span>Intenso (5+)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#F0F2EF] dark:border-[#202E27] bg-[#FAFCFB] dark:bg-[#111815] overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-1">
              {stats.activityHeatmap.map((item) => {
                let colorClass = 'bg-[#ECEFEA] dark:bg-[#1A2520] border-[#DFE4DE] dark:border-[#22312A]';
                if (item.activityLevel === 1) colorClass = 'bg-[#C9DEC8] dark:bg-[#203D2B] border-[#B6D1B4] dark:border-[#264D35]';
                if (item.activityLevel === 2) colorClass = 'bg-[#6E9E80] dark:bg-[#2C6343] border-[#5E8E70] dark:border-[#387A53]';
                if (item.activityLevel === 3) colorClass = 'bg-[#29523F] dark:bg-[#3D745B] border-[#1D3E2F] dark:border-[#4B8E70] text-white';
                if (item.activityLevel === 4) colorClass = 'bg-[#162E23] dark:bg-[#4F8E71] border-[#0E2018] dark:border-[#67B591] text-amber-200';

                return (
                  <div 
                    key={item.date} 
                    className="flex flex-col items-center gap-1 group relative cursor-pointer"
                    title={`${item.dateFormatted}: ${item.count} práticas realizadas`}
                  >
                    <div 
                      className={`w-7 h-8 sm:w-8 sm:h-9 rounded-md border flex flex-col items-center justify-center transition-transform group-hover:scale-105 ${colorClass}`}
                    >
                      <span className="text-[9px] font-bold opacity-80">
                        {item.date.split('-')[2]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-[#7D8882] dark:text-[#8D9B94]">
            Dica: Dias vazios indicam descansos naturais ou pausas na rotina. A graça acolhe os recomeços sem culpa.
          </p>
        </div>
      )}

      {/* 3. DISTRIBUIÇÃO DAS PRÁTICAS CRISTÃS */}
      {activeChartTab === 'distribution' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#617068] dark:text-[#9AA8A1]">
            <span>Equilíbrio entre as disciplinas espirituais no período</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Barras Horizontais com Percentual */}
            <div className="space-y-3">
              {stats.practiceDistribution.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#19211D] dark:text-[#F1F4F2]">
                      {item.label}
                    </span>
                    <span className="text-[#617068] dark:text-[#9AA8A1] font-mono">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#EAEFEA] dark:bg-[#1E2B25] overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(item.percentage, 4)}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo em Bloco Confortável */}
            <div className="p-4 rounded-xl bg-[#F7FAF8] dark:bg-[#17221D] border border-[#E6EBE7] dark:border-[#24332B] space-y-3">
              <h4 className="text-xs font-bold text-[#162E23] dark:text-[#4F8E71] uppercase tracking-wider">
                Composição do Ritmo
              </h4>
              <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] leading-relaxed">
                Sua rotina mantém foco expressivo em <strong>{stats.practiceDistribution[0]?.label || 'Leitura'}</strong>, que responde por {stats.practiceDistribution[0]?.percentage || 0}% das suas ações registradas.
              </p>
              <div className="pt-2 border-t border-[#E6EBE7] dark:border-[#24332B] flex items-center justify-between text-xs">
                <span className="text-[#7D8882]">Total de ações computadas:</span>
                <span className="font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  {stats.practiceDistribution.reduce((acc, curr) => acc + curr.count, 0)} práticas
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RITMO POR DIA DA SEMANA */}
      {activeChartTab === 'weekday' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#617068] dark:text-[#9AA8A1]">
            <span>Taxa de sucesso e constância em cada dia da semana</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {stats.weekdayDistribution.map((w) => {
              const heightPercent = Math.max(w.successRate, 12);
              const isHighlight = w.successRate >= 80;

              return (
                <div key={w.dayName} className="flex flex-col items-center gap-2">
                  <div className="w-full h-36 bg-[#F4F7F5] dark:bg-[#16211C] rounded-xl border border-[#E6EAE7] dark:border-[#223128] p-1 flex flex-col justify-end items-center relative group">
                    <div 
                      className={`w-full rounded-lg transition-all duration-300 flex items-center justify-center ${
                        isHighlight 
                          ? 'bg-[#29523F] dark:bg-[#4F8E71] text-white' 
                          : 'bg-[#98B8A6] dark:bg-[#2C523F] text-white/90'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <span className="text-[10px] font-bold">
                        {w.successRate}%
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-[#19211D] dark:text-[#F1F4F2] block">
                      {w.shortDay}
                    </span>
                    <span className="text-[10px] text-[#7D8882] block">
                      {w.completedCount} feats
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </section>
  );
};
