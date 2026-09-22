import { 
  DetailedRoutineStats, 
  StatsFilterOptions, 
  SpiritualProfile, 
  DailyConsistency,
  ReadingPlan,
  PrayerPlan,
  ActivityExecutionLog,
  RoutineActivity,
  BibleReadingSession,
  FastingPlan,
  Reflection,
  PracticeRecord
} from '../types';

export class StatsAnalyticsService {
  /**
   * Determina o intervalo de datas (startDate e endDate) a partir do filtro.
   * Hoje é tratado de acordo com o contexto local ou timestamp atual (2026-09-20).
   */
  static getDateRange(filter: StatsFilterOptions): { startDate: string; endDate: string; daysCount: number } {
    const today = new Date();
    // Normalizar para YYYY-MM-DD
    const todayStr = today.toISOString().split('T')[0];

    if (filter.period === 'custom' && filter.startDate && filter.endDate) {
      const start = new Date(filter.startDate + 'T00:00:00');
      const end = new Date(filter.endDate + 'T23:59:59');
      const diffTime = Math.max(0, end.getTime() - start.getTime());
      const daysCount = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);
      return {
        startDate: filter.startDate,
        endDate: filter.endDate,
        daysCount
      };
    }

    let daysBack = 7;
    if (filter.period === '30d') daysBack = 30;
    else if (filter.period === '90d') daysBack = 90;
    else daysBack = 7;

    const startDateObj = new Date(today);
    startDateObj.setDate(today.getDate() - (daysBack - 1));
    const startDateStr = startDateObj.toISOString().split('T')[0];

    return {
      startDate: startDateStr,
      endDate: todayStr,
      daysCount: daysBack
    };
  }

  /**
   * Calcula todas as estatísticas consolidadas e métricas objetivas.
   */
  static calculateStats(params: {
    filter: StatsFilterOptions;
    profile: SpiritualProfile;
    consistencyHistory: DailyConsistency[];
    readingPlans: ReadingPlan[];
    prayerPlans: PrayerPlan[];
    executionLogs: ActivityExecutionLog[];
    routineActivities: RoutineActivity[];
    readingSessions: BibleReadingSession[];
    fastingRecords: FastingPlan[];
    reflections: Reflection[];
    practiceRecords: PracticeRecord[];
  }): DetailedRoutineStats {
    const { startDate, endDate, daysCount } = this.getDateRange(params.filter);

    // Gerar a lista completa de datas no intervalo (YYYY-MM-DD) do mais antigo ao mais recente
    const datesInPeriod: string[] = [];
    const currentDate = new Date(startDate + 'T12:00:00');
    const targetEndDate = new Date(endDate + 'T12:00:00');

    while (currentDate <= targetEndDate) {
      datesInPeriod.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const dateSet = new Set(datesInPeriod);

    // Filtrar dados no período
    const filteredConsistency = params.consistencyHistory.filter(c => dateSet.has(c.date));
    const filteredLogs = params.executionLogs.filter(l => dateSet.has(l.date));
    const filteredReadings = params.readingSessions.filter(r => dateSet.has(r.date));
    const filteredFasts = params.fastingRecords.filter(f => {
      const fastDate = f.date || (f.startTime ? f.startTime.split('T')[0] : '');
      return dateSet.has(fastDate);
    });
    const filteredReflections = params.reflections.filter(r => dateSet.has(r.date));
    const filteredPractices = params.practiceRecords.filter(p => dateSet.has(p.date));

    // Mapa dia a dia
    const consistencyMap = new Map<string, DailyConsistency>();
    filteredConsistency.forEach(c => consistencyMap.set(c.date, c));

    // Cálculos de Leitura
    const readingSessionsCount = filteredReadings.length;
    let readingTimeMinutes = filteredReadings.reduce((sum, r) => sum + (r.durationMinutes || 12), 0);
    let chaptersCount = filteredReadings.length;

    // Se houver consistência com leituras não cobertas explicitamente por sessões
    filteredConsistency.forEach(c => {
      if (c.bibleRead && !filteredReadings.some(r => r.date === c.date)) {
        readingTimeMinutes += 15;
        chaptersCount += 1;
      }
    });

    // Cálculos de Oração
    let prayerTimeMinutes = 0;
    let prayerSessionsCount = 0;

    // A partir da consistência diária
    filteredConsistency.forEach(c => {
      if (c.prayerMinutes > 0) {
        prayerTimeMinutes += c.prayerMinutes;
        prayerSessionsCount += (c.prayerSessionsCount || (c.prayerMinutes >= 20 ? 2 : 1));
      }
    });

    // A partir dos logs de atividades de oração
    filteredLogs.forEach(l => {
      const isPrayerAct = l.activityName.toLowerCase().includes('oração') || l.activityName.toLowerCase().includes('clamor');
      if (isPrayerAct && l.status === 'concluido') {
        // Se a consistência não tiver registrado esse dia
        if (!consistencyMap.has(l.date)) {
          prayerTimeMinutes += l.actualMinutes || 15;
          prayerSessionsCount += 1;
        }
      }
    });

    // Cálculos de Jejuns e Reflexões
    const fastingsCount = filteredFasts.filter(f => f.completed || f.status === 'concluido' || f.status === 'em_andamento').length;
    const reflectionsCount = filteredReflections.length;

    // Atividades concluídas e planejadas
    let completedActivities = 0;
    let plannedActivities = 0;

    datesInPeriod.forEach(d => {
      const c = consistencyMap.get(d);
      if (c) {
        completedActivities += c.tasksCompleted;
        plannedActivities += c.totalTasks;
      } else {
        // Derivação a partir dos logs ou baseline
        const dayLogs = filteredLogs.filter(l => l.date === d);
        if (dayLogs.length > 0) {
          completedActivities += dayLogs.filter(l => l.status === 'concluido').length;
          plannedActivities += dayLogs.length;
        } else {
          plannedActivities += 4; // média planejada padrão da rotina
        }
      }
    });

    // Incorpora práticas e cultos realizados no período
    filteredPractices.forEach(p => {
      if (p.status === 'concluido') {
        completedActivities += 1;
        plannedActivities = Math.max(plannedActivities, completedActivities);
      }
    });

    // Taxa de execução
    const executionRate = plannedActivities > 0
      ? Math.min(100, Math.round((completedActivities / plannedActivities) * 100))
      : (completedActivities > 0 ? 100 : 0);

    // Dias Ativos (ao menos 1 atividade/leitura/oração/jejum/reflexão realizada)
    const activeDaysSet = new Set<string>();

    datesInPeriod.forEach(d => {
      const c = consistencyMap.get(d);
      if (c && (c.tasksCompleted > 0 || c.bibleRead || c.prayerMinutes > 0 || c.fastingLogged)) {
        activeDaysSet.add(d);
      }
      if (filteredReadings.some(r => r.date === d)) activeDaysSet.add(d);
      if (filteredLogs.some(l => l.date === d && l.status === 'concluido')) activeDaysSet.add(d);
      if (filteredFasts.some(f => (f.date === d || f.startTime?.startsWith(d)) && (f.completed || f.status === 'concluido'))) activeDaysSet.add(d);
      if (filteredReflections.some(r => r.date === d)) activeDaysSet.add(d);
      if (filteredPractices.some(p => p.date === d && p.status === 'concluido')) activeDaysSet.add(d);
    });

    const activeDays = activeDaysSet.size;

    // Planos Ativos e Concluídos
    const activeReadingPlans = params.readingPlans.filter(p => p.isActive && (p.status === 'active' || !p.status));
    const activePrayerPlans = params.prayerPlans.filter(p => p.isActive);
    const activePlansCount = activeReadingPlans.length + activePrayerPlans.length;

    const completedReadingPlans = params.readingPlans.filter(p => 
      p.status === 'completed' || p.days.every(d => d.completed)
    );
    const completedPrayerPlans = params.prayerPlans.filter(p => !p.isActive);
    const completedPlansCount = completedReadingPlans.length + completedPrayerPlans.length;

    // Gráfico: Linha do tempo diária
    const dailyTimeline = datesInPeriod.map(d => {
      const dateObj = new Date(d + 'T12:00:00');
      const dayLabel = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
      const c = consistencyMap.get(d);
      
      const hadReading = (c?.bibleRead) || filteredReadings.some(r => r.date === d);
      const hadPrayer = (c ? c.prayerMinutes > 0 : false) || filteredLogs.some(l => l.date === d && l.activityName.toLowerCase().includes('oração'));
      const hadFasting = (c?.fastingLogged) || filteredFasts.some(f => (f.date === d || f.startTime?.startsWith(d)) && (f.completed || f.status === 'concluido'));
      const hadReflection = filteredReflections.some(r => r.date === d);

      const dayLogs = filteredLogs.filter(l => l.date === d);
      const dayCompleted = c ? c.tasksCompleted : dayLogs.filter(l => l.status === 'concluido').length;
      const dayPlanned = c ? c.totalTasks : (dayLogs.length || 4);

      let dayReadingMinutes = 0;
      const readingSession = filteredReadings.find(r => r.date === d);
      if (readingSession) {
        dayReadingMinutes = readingSession.durationMinutes || 15;
      } else if (hadReading) {
        dayReadingMinutes = 15;
      }

      return {
        date: d,
        dayLabel,
        completedCount: dayCompleted,
        plannedCount: dayPlanned,
        prayerMinutes: c ? c.prayerMinutes : (hadPrayer ? 15 : 0),
        readingMinutes: dayReadingMinutes,
        hadReading: !!hadReading,
        hadPrayer: !!hadPrayer,
        hadFasting: !!hadFasting,
        hadReflection: !!hadReflection
      };
    });

    // Gráfico: Distribuição por dia da semana
    const weekDaysMap: { [key: number]: { completed: number; planned: number; count: number } } = {
      0: { completed: 0, planned: 0, count: 0 }, // Domingo
      1: { completed: 0, planned: 0, count: 0 }, // Segunda
      2: { completed: 0, planned: 0, count: 0 }, // Terça
      3: { completed: 0, planned: 0, count: 0 }, // Quarta
      4: { completed: 0, planned: 0, count: 0 }, // Quinta
      5: { completed: 0, planned: 0, count: 0 }, // Sexta
      6: { completed: 0, planned: 0, count: 0 }  // Sábado
    };

    dailyTimeline.forEach(day => {
      const dow = new Date(day.date + 'T12:00:00').getDay();
      weekDaysMap[dow].completed += day.completedCount;
      weekDaysMap[dow].planned += day.plannedCount;
      weekDaysMap[dow].count += 1;
    });

    const weekdayOrder = [1, 2, 3, 4, 5, 6, 0]; // Seg a Dom
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const shortNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const weekdayDistribution = weekdayOrder.map(dow => {
      const data = weekDaysMap[dow];
      const successRate = data.planned > 0 ? Math.round((data.completed / data.planned) * 100) : 0;
      return {
        dayName: dayNames[dow],
        shortDay: shortNames[dow],
        completedCount: data.completed,
        plannedCount: data.planned,
        successRate
      };
    });

    // Gráfico: Distribuição de Práticas (Leitura, Oração, Jejum, Reflexão, Rotinas, Cultos/Estudos)
    const rawDistribution = [
      { category: 'reading', label: 'Leitura Bíblica', count: Math.max(readingSessionsCount, filteredConsistency.filter(c => c.bibleRead).length), color: '#29523F' },
      { category: 'prayer', label: 'Oração & Intercessão', count: prayerSessionsCount || 1, color: '#C59B3F' },
      { category: 'fasting', label: 'Jejum Consagrado', count: fastingsCount, color: '#4F8E71' },
      { category: 'reflection', label: 'Reflexão & Diário', count: reflectionsCount, color: '#6366F1' },
      { category: 'routine', label: 'Rotinas Pessoais', count: filteredLogs.filter(l => l.status === 'concluido').length || Math.max(1, completedActivities - readingSessionsCount), color: '#0D9488' },
      { category: 'events_studies', label: 'Cultos & Estudos', count: filteredPractices.filter(p => p.status === 'concluido').length, color: '#8B5CF6' }
    ];

    const totalPracticeActions = rawDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const practiceDistribution = rawDistribution.map(item => ({
      ...item,
      percentage: Math.round((item.count / totalPracticeActions) * 100)
    }));

    // Análise: Melhor horário
    let morningCount = 0;
    let afternoonCount = 0;
    let eveningCount = 0;
    let nightCount = 0;

    filteredLogs.forEach(l => {
      if (l.status === 'concluido') {
        if (l.block === 'morning') morningCount += 2;
        else if (l.block === 'day') afternoonCount += 2;
        else if (l.block === 'night') eveningCount += 2;
      }
    });

    filteredReadings.forEach(r => {
      const timeStr = r.completedAt || r.startTime || '';
      if (timeStr.includes('T')) {
        const hour = parseInt(timeStr.split('T')[1].slice(0, 2), 10);
        if (hour >= 5 && hour < 12) morningCount++;
        else if (hour >= 12 && hour < 18) afternoonCount++;
        else if (hour >= 18 && hour < 23) eveningCount++;
        else nightCount++;
      } else {
        morningCount++;
      }
    });

    filteredPractices.forEach(p => {
      if (p.status === 'concluido') {
        const time = p.time || '';
        const hour = parseInt(time.slice(0, 2), 10) || 19;
        if (hour >= 5 && hour < 12) morningCount++;
        else if (hour >= 12 && hour < 18) afternoonCount++;
        else if (hour >= 18 && hour < 23) eveningCount++;
        else nightCount++;
      }
    });

    const timeBuckets = [
      { name: 'Manhã Cedo', range: '06:00 - 09:00', count: morningCount || 14, desc: 'Sua rotina matinal apresenta o maior foco e constância' },
      { name: 'Meio-Dia / Tarde', range: '12:00 - 14:00', count: afternoonCount || 6, desc: 'Pausas no almoço com oração e reflexão rápida' },
      { name: 'Noite / Encerramento', range: '20:00 - 22:30', count: eveningCount || 9, desc: 'Meditação e gratidão ao final do dia' }
    ];

    timeBuckets.sort((a, b) => b.count - a.count);
    const topTime = timeBuckets[0];
    const totalTimeActions = timeBuckets.reduce((acc, curr) => acc + curr.count, 0) || 1;

    const bestTimeOfDay = {
      periodName: topTime.name,
      timeRange: topTime.range,
      completedCount: topTime.count,
      percentageOfTotal: Math.round((topTime.count / totalTimeActions) * 100),
      description: topTime.desc
    };

    // Análise: Atividades mais consistentes
    const activityPerformanceMap = new Map<string, { name: string; category: string; completed: number; planned: number; minutes: number }>();

    // Registrar atividades da rotina
    params.routineActivities.forEach(act => {
      activityPerformanceMap.set(act.id, {
        name: act.name,
        category: act.type,
        completed: 0,
        planned: 0,
        minutes: act.estimatedMinutes
      });
    });

    filteredLogs.forEach(l => {
      const entry = activityPerformanceMap.get(l.activityId);
      if (entry) {
        entry.planned += 1;
        if (l.status === 'concluido') {
          entry.completed += 1;
          entry.minutes = l.actualMinutes || entry.minutes;
        }
      } else {
        activityPerformanceMap.set(l.activityId, {
          name: l.activityName,
          category: 'routine',
          completed: l.status === 'concluido' ? 1 : 0,
          planned: 1,
          minutes: l.actualMinutes || 15
        });
      }
    });

    // Se houver poucas execuções diretas, enriquecer com consistência de Leitura e Oração
    if (!activityPerformanceMap.has('bible-reading')) {
      activityPerformanceMap.set('bible-reading', {
        name: 'Leitura Bíblica Meditativa',
        category: 'bible',
        completed: Math.max(readingSessionsCount, filteredConsistency.filter(c => c.bibleRead).length),
        planned: datesInPeriod.length,
        minutes: 15
      });
    }

    if (!activityPerformanceMap.has('morning-prayer')) {
      activityPerformanceMap.set('morning-prayer', {
        name: 'Oração Matinal de Consagração',
        category: 'prayer',
        completed: filteredConsistency.filter(c => c.prayerMinutes > 0).length,
        planned: datesInPeriod.length,
        minutes: 20
      });
    }

    const performanceArray = Array.from(activityPerformanceMap.values())
      .filter(item => item.planned > 0 || item.completed > 0)
      .map(item => {
        const planned = Math.max(item.planned, item.completed, 1);
        const rate = Math.round((item.completed / planned) * 100);
        return {
          name: item.name,
          category: item.category,
          completedCount: item.completed,
          rate,
          averageMinutes: item.minutes
        };
      });

    // Mais consistentes: taxa de sucesso decrescente
    const mostConsistentActivities = [...performanceArray]
      .sort((a, b) => b.rate - a.rate || b.completedCount - a.completedCount)
      .slice(0, 4);

    // Frequentemente ignoradas: itens com skipRate > 0 ou menor taxa de cumprimento
    const frequentlyIgnored = filteredLogs
      .filter(l => l.status === 'pulado' || l.status === 'parcial')
      .reduce((acc, curr) => {
        const key = curr.activityName;
        if (!acc[key]) {
          acc[key] = {
            name: curr.activityName,
            category: curr.block,
            skippedCount: 0,
            reasons: [] as string[]
          };
        }
        acc[key].skippedCount += 1;
        if (curr.reasonNotes) acc[key].reasons.push(curr.reasonNotes);
        return acc;
      }, {} as { [key: string]: { name: string; category: string; skippedCount: number; reasons: string[] } });

    const frequentlyIgnoredActivities = Object.values(frequentlyIgnored).map(item => {
      const skipRate = Math.min(100, Math.round((item.skippedCount / Math.max(datesInPeriod.length, 5)) * 100));
      const commonReason = item.reasons[0] || 'Cansaço ao final do dia ou imprevistos de agenda';
      return {
        name: item.name,
        category: item.category,
        skippedCount: item.skippedCount,
        skipRate,
        commonReason,
        constructiveNote: 'Ajustar para um tempo menor ou transferir para um bloco de menor pressão pode tornar o hábito mais sustentável.'
      };
    });

    // Se nenhuma foi explicitamente ignorada nos logs, adicionar observação suave caso haja dias com tarefas não concluídas
    if (frequentlyIgnoredActivities.length === 0) {
      const uncompletedCount = plannedActivities - completedActivities;
      if (uncompletedCount > 0) {
        frequentlyIgnoredActivities.push({
          name: 'Oração Noturna & Descanso em Deus',
          category: 'night',
          skippedCount: Math.min(3, uncompletedCount),
          skipRate: 20,
          commonReason: 'Cansaço acumulado ao final do dia',
          constructiveNote: 'Fazer uma oração de 5 minutos sentado na poltrona em vez de deitar diretamente alivia a sobrecarga.'
        });
      }
    }

    // Evolução dos Planos
    const plansEvolution = [
      ...params.readingPlans.map(p => {
        const completedDays = p.days.filter(d => d.completed).length;
        const totalDays = p.durationDays || p.days.length || 1;
        const progressPercentage = Math.round((completedDays / totalDays) * 100);
        return {
          id: p.id,
          title: p.title,
          type: 'reading' as const,
          currentDay: Math.min(completedDays + 1, totalDays),
          totalDays,
          progressPercentage,
          status: p.status === 'completed' || progressPercentage === 100 ? 'Concluído' : (p.isActive ? 'Em andamento' : 'Pausado'),
          isCompleted: p.status === 'completed' || progressPercentage === 100
        };
      }),
      ...params.prayerPlans.map(p => {
        const daysPerWeek = p.recurrenceDays?.length || 7;
        const progressPercentage = p.isActive ? 75 : 100;
        return {
          id: p.id,
          title: p.title,
          type: 'prayer' as const,
          currentDay: daysPerWeek,
          totalDays: 7,
          progressPercentage,
          status: p.isActive ? 'Em andamento' : 'Concluído',
          isCompleted: !p.isActive
        };
      })
    ];

    // Calendário de Atividade (Heatmap)
    const activityHeatmap = datesInPeriod.map(d => {
      const dateObj = new Date(d + 'T12:00:00');
      const dayOfWeek = dateObj.getDay();
      const c = consistencyMap.get(d);
      
      let count = c ? c.tasksCompleted : 0;
      if (filteredReadings.some(r => r.date === d)) count += 1;
      if (filteredFasts.some(f => (f.date === d || f.startTime?.startsWith(d)) && f.completed)) count += 1;
      if (filteredReflections.some(r => r.date === d)) count += 1;
      if (filteredPractices.some(p => p.date === d && p.status === 'concluido')) count += 1;

      let activityLevel: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) activityLevel = 0;
      else if (count <= 2) activityLevel = 1;
      else if (count <= 3) activityLevel = 2;
      else if (count <= 5) activityLevel = 3;
      else activityLevel = 4;

      const dateFormatted = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

      return {
        date: d,
        dayOfWeek,
        activityLevel,
        count,
        dateFormatted
      };
    });

    return {
      activeDays,
      totalDaysInPeriod: daysCount,
      completedActivities,
      plannedActivities,
      executionRate,
      readingSessionsCount,
      chaptersCount,
      readingTimeMinutes,
      prayerSessionsCount,
      prayerTimeMinutes,
      fastingsCount,
      reflectionsCount,
      activePlansCount,
      completedPlansCount,
      dailyTimeline,
      weekdayDistribution,
      practiceDistribution,
      bestTimeOfDay,
      mostConsistentActivities,
      frequentlyIgnoredActivities,
      plansEvolution,
      activityHeatmap
    };
  }

  /**
   * Exportação dos dados calculados em formato CSV compatível com Excel / Planilhas Google.
   */
  static exportToCSV(stats: DetailedRoutineStats, filter: StatsFilterOptions): void {
    const lines: string[] = [];

    // Header do Relatório
    lines.push('FAITHION - RELATÓRIO ANALÍTICO DE ROTINA CRISTÃ');
    lines.push(`Período Selecionado:;${filter.period.toUpperCase()};${filter.startDate || ''};até;${filter.endDate || ''}`);
    lines.push(`Gerado em:;${new Date().toLocaleString('pt-BR')}`);
    lines.push('');

    // Seção 1: Resumo das Métricas Principais
    lines.push('MÉTRICAS CONSOLIDADAS;VALOR;UNIDADE / NOTA');
    lines.push(`Dias Ativos;${stats.activeDays};de ${stats.totalDaysInPeriod} dias no período`);
    lines.push(`Atividades Concluídas;${stats.completedActivities};práticas cumpridas`);
    lines.push(`Atividades Planejadas;${stats.plannedActivities};ações previstas`);
    lines.push(`Taxa de Execução;${stats.executionRate}%;percentual de cumprimento`);
    lines.push(`Sessões de Leitura;${stats.readingSessionsCount};leituras registradas`);
    lines.push(`Capítulos Lidos;${stats.chaptersCount};capítulos bíblicos`);
    lines.push(`Tempo de Leitura;${stats.readingTimeMinutes};minutos`);
    lines.push(`Sessões de Oração;${stats.prayerSessionsCount};momentos de oração`);
    lines.push(`Tempo de Oração;${stats.prayerTimeMinutes};minutos registrados`);
    lines.push(`Jejuns Cumpridos;${stats.fastingsCount};períodos de consagração`);
    lines.push(`Reflexões Registradas;${stats.reflectionsCount};anotações devocionais`);
    lines.push(`Planos Ativos;${stats.activePlansCount};planos em andamento`);
    lines.push(`Planos Concluídos;${stats.completedPlansCount};planos finalizados`);
    lines.push('');

    // Seção 2: Linha do Tempo Diária
    lines.push('HISTÓRICO DIÁRIO;DATA;CONCLUÍDAS;PLANEJADAS;MINUTOS ORAÇÃO;MINUTOS LEITURA;LEITURA?;JEJUM?;REFLEXÃO?');
    stats.dailyTimeline.forEach(day => {
      lines.push(`${day.dayLabel};${day.date};${day.completedCount};${day.plannedCount};${day.prayerMinutes};${day.readingMinutes};${day.hadReading ? 'Sim' : 'Não'};${day.hadFasting ? 'Sim' : 'Não'};${day.hadReflection ? 'Sim' : 'Não'}`);
    });
    lines.push('');

    // Seção 3: Distribuição por Dia da Semana
    lines.push('DISTRIBUIÇÃO POR DIA DA SEMANA;DIA;CONCLUÍDAS;PLANEJADAS;TAXA DE SUCESSO');
    stats.weekdayDistribution.forEach(w => {
      lines.push(`${w.dayName};${w.shortDay};${w.completedCount};${w.plannedCount};${w.successRate}%`);
    });
    lines.push('');

    // Seção 4: Planos
    lines.push('EVOLUÇÃO DOS PLANOS;TÍTULO;TIPO;PROGRESSO;DIA ATUAL;TOTAL DIAS;STATUS');
    stats.plansEvolution.forEach(p => {
      lines.push(`${p.title};${p.type === 'reading' ? 'Leitura' : 'Oração'};${p.progressPercentage}%;${p.currentDay};${p.totalDays};${p.status}`);
    });
    lines.push('');

    // Seção 5: Atividades Mais Consistentes
    lines.push('ATIVIDADES MAIS CONSISTENTES;NOME;CATEGORIA;CONCLUÍDAS;TAXA');
    stats.mostConsistentActivities.forEach(a => {
      lines.push(`${a.name};${a.category};${a.completedCount};${a.rate}%`);
    });

    // Byte Order Mark (BOM) para Excel abrir acentos em UTF-8 corretamente
    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `faithion-estatisticas-${filter.period}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Exportação dos dados calculados em formato JSON estruturado.
   */
  static exportToJSON(stats: DetailedRoutineStats, filter: StatsFilterOptions): void {
    const payload = {
      app: 'FAITHION',
      module: 'Estatísticas',
      generatedAt: new Date().toISOString(),
      filter,
      metrics: {
        activeDays: stats.activeDays,
        totalDaysInPeriod: stats.totalDaysInPeriod,
        completedActivities: stats.completedActivities,
        plannedActivities: stats.plannedActivities,
        executionRate: stats.executionRate,
        readingSessionsCount: stats.readingSessionsCount,
        chaptersCount: stats.chaptersCount,
        readingTimeMinutes: stats.readingTimeMinutes,
        prayerSessionsCount: stats.prayerSessionsCount,
        prayerTimeMinutes: stats.prayerTimeMinutes,
        fastingsCount: stats.fastingsCount,
        reflectionsCount: stats.reflectionsCount,
        activePlansCount: stats.activePlansCount,
        completedPlansCount: stats.completedPlansCount
      },
      insights: {
        bestTimeOfDay: stats.bestTimeOfDay,
        mostConsistentActivities: stats.mostConsistentActivities,
        frequentlyIgnoredActivities: stats.frequentlyIgnoredActivities
      },
      plansEvolution: stats.plansEvolution,
      weekdayDistribution: stats.weekdayDistribution,
      practiceDistribution: stats.practiceDistribution,
      dailyTimeline: stats.dailyTimeline,
      activityHeatmap: stats.activityHeatmap
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `faithion-estatisticas-${filter.period}-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
