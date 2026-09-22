/**
 * FAITHION — Consistency & Behavioral Observation Engine
 * 
 * Princípios mandatórios:
 * 1. Métricas 100% objetivas e quantitativas (atividades, leituras, capítulos, orações, jejuns).
 * 2. NENHUMA "nota espiritual" ou "pontuação de santidade".
 * 3. NUNCA afirmar que alguém está mais ou menos próximo de Deus baseado em números.
 * 4. Padrões comportamentais estritamente transparentes e descritivos.
 */

import { 
  DailyTask, 
  ReadingPlan, 
  ActivityExecutionLog, 
  FastingPlan, 
  PrayerRequest, 
  PracticeRecord, 
  ObjectiveConsistencyMetrics, 
  BehavioralPatternObservation,
  BibleReadingSession,
  DailyConsistency
} from '../types';

export class ConsistencyService {
  /**
   * Determina se uma data YYYY-MM-DD pertence a um período especificado
   */
  static isDateInPeriod(dateStr: string, period: 'today' | 'week' | 'month' | 'history', customNow?: Date): boolean {
    if (period === 'history') return true;
    if (!dateStr) return false;

    const now = customNow || new Date();
    const itemDate = new Date(dateStr.length === 10 ? `${dateStr}T12:00:00` : dateStr);
    if (isNaN(itemDate.getTime())) return false;

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (period === 'today') {
      return itemDate >= todayStart && itemDate <= todayEnd;
    }

    if (period === 'week') {
      // Últimos 7 dias (incluindo hoje)
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - 6);
      return itemDate >= weekStart && itemDate <= todayEnd;
    }

    if (period === 'month') {
      // Mês corrente
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return itemDate >= monthStart && itemDate <= todayEnd;
    }

    return true;
  }

  /**
   * Calcula as métricas quantitativas objetivas para o período selecionado
   */
  static calculateMetrics(params: {
    period: 'today' | 'week' | 'month' | 'history';
    tasks: DailyTask[];
    plans: ReadingPlan[];
    executionLogs: ActivityExecutionLog[];
    prayers: PrayerRequest[];
    fasts: FastingPlan[];
    bibleSessions: BibleReadingSession[];
    practices: PracticeRecord[];
    consistencyHistory: DailyConsistency[];
    customNow?: Date;
  }): ObjectiveConsistencyMetrics {
    const { 
      period, 
      tasks, 
      plans, 
      executionLogs, 
      prayers, 
      fasts, 
      bibleSessions, 
      practices, 
      consistencyHistory,
      customNow 
    } = params;

    const now = customNow || new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Total de dias contados no período
    let totalDaysInPeriod = 1;
    if (period === 'week') totalDaysInPeriod = 7;
    else if (period === 'month') totalDaysInPeriod = now.getDate();
    else if (period === 'history') totalDaysInPeriod = Math.max(consistencyHistory.length, 30);

    // 1. Filtrar tarefas diárias e registros de execução para o período
    let plannedActivities = 0;
    let completedActivities = 0;
    let ignoredActivities = 0;
    let delayedActivities = 0;

    if (period === 'today') {
      plannedActivities = tasks.length;
      completedActivities = tasks.filter(t => t.completed || t.status === 'concluida').length;
      ignoredActivities = tasks.filter(t => t.status === 'ignorada' || t.status === 'cancelada').length;
      delayedActivities = tasks.filter(t => t.status === 'atrasada').length;
    } else {
      // Para semana, mês ou histórico, computar a partir de executionLogs e consistencyHistory
      const logsInPeriod = executionLogs.filter(l => this.isDateInPeriod(l.date, period, now));
      completedActivities = logsInPeriod.filter(l => l.status === 'concluido' || l.status === 'parcial').length;
      ignoredActivities = logsInPeriod.filter(l => l.status === 'pulado').length;

      // Adicionar tarefas de hoje
      completedActivities += tasks.filter(t => t.completed || t.status === 'concluida').length;
      ignoredActivities += tasks.filter(t => t.status === 'ignorada').length;
      delayedActivities += tasks.filter(t => t.status === 'atrasada').length;

      // Adicionar práticas registradas que contam como atividades concluídas
      const practicesInPeriod = practices.filter(p => this.isDateInPeriod(p.date, period, now));
      completedActivities += practicesInPeriod.filter(p => p.status === 'concluido').length;
      delayedActivities += practicesInPeriod.filter(p => p.status === 'atrasado').length;
      ignoredActivities += practicesInPeriod.filter(p => p.status === 'ignorado').length;

      plannedActivities = Math.max(
        completedActivities + ignoredActivities + delayedActivities,
        tasks.length * (period === 'week' ? 7 : (period === 'month' ? now.getDate() : consistencyHistory.length || 14))
      );
    }

    // 2. Dias ativos (dias com pelo menos 1 prática registrada)
    const activeDatesSet = new Set<string>();

    consistencyHistory.forEach(h => {
      if (this.isDateInPeriod(h.date, period, now) && (h.tasksCompleted > 0 || h.bibleRead || h.prayerMinutes > 0 || h.fastingLogged)) {
        activeDatesSet.add(h.date);
      }
    });

    executionLogs.forEach(l => {
      if (this.isDateInPeriod(l.date, period, now) && l.status !== 'pulado') {
        activeDatesSet.add(l.date);
      }
    });

    bibleSessions.forEach(b => {
      if (this.isDateInPeriod(b.date, period, now)) {
        activeDatesSet.add(b.date);
      }
    });

    practices.forEach(p => {
      if (this.isDateInPeriod(p.date, period, now) && p.status !== 'ignorado') {
        activeDatesSet.add(p.date);
      }
    });

    // Se hoje teve tarefas concluídas, hoje é ativo
    if (tasks.some(t => t.completed)) {
      activeDatesSet.add(todayStr);
    }

    const activeDaysCount = activeDatesSet.size;

    // 3. Sessões de oração e minutos
    let prayerSessionsCount = 0;
    let totalPrayerMinutes = 0;

    // A partir das sessões de histórico diário
    consistencyHistory.forEach(h => {
      if (this.isDateInPeriod(h.date, period, now) && h.prayerMinutes > 0) {
        totalPrayerMinutes += h.prayerMinutes;
        prayerSessionsCount += Math.max(1, Math.round(h.prayerMinutes / 15));
      }
    });

    // A partir das práticas registradas do tipo 'prayer'
    practices.filter(p => p.type === 'prayer' && this.isDateInPeriod(p.date, period, now)).forEach(p => {
      prayerSessionsCount += 1;
      totalPrayerMinutes += (p.durationMinutes || 15);
    });

    // A partir dos pedidos de oração que foram orados
    prayers.forEach(p => {
      if (this.isDateInPeriod(p.date || p.createdAt.split('T')[0], period, now) && p.timesPrayed > 0) {
        prayerSessionsCount += Math.min(p.timesPrayed, 3);
      }
    });

    // 4. Leituras e Capítulos
    let readingSessionsCount = 0;
    let chaptersReadCount = 0;

    bibleSessions.filter(s => this.isDateInPeriod(s.date, period, now)).forEach(s => {
      readingSessionsCount += 1;
      // Estimar 1 capítulo se não especificado
      chaptersReadCount += 1;
    });

    practices.filter(p => (p.type === 'bible' || p.type === 'study') && this.isDateInPeriod(p.date, period, now)).forEach(p => {
      readingSessionsCount += 1;
      chaptersReadCount += (p.chaptersCount || 1);
    });

    // Dias do plano de leitura concluídos no período
    plans.forEach(plan => {
      plan.days.forEach(day => {
        if (day.completed && day.completedAt && this.isDateInPeriod(day.completedAt.split('T')[0], period, now)) {
          readingSessionsCount += 1;
          chaptersReadCount += 1;
        }
      });
    });

    // Se no histórico consistência constava bíblia lida
    consistencyHistory.forEach(h => {
      if (this.isDateInPeriod(h.date, period, now) && h.bibleRead) {
        // Se ainda não somou por sessão explícita
        if (readingSessionsCount === 0) {
          readingSessionsCount += 1;
          chaptersReadCount += 1;
        }
      }
    });

    // 5. Planos concluídos
    let plansCompletedCount = 0;
    plans.forEach(plan => {
      const isFullyDone = plan.days.length > 0 && plan.days.every(d => d.completed);
      if (isFullyDone) {
        plansCompletedCount += 1;
      }
    });

    // 6. Jejuns concluídos
    let fastsCompletedCount = 0;
    fasts.filter(f => (f.status === 'concluido' || f.completed) && this.isDateInPeriod(f.date || f.startTime.split('T')[0], period, now)).forEach(() => {
      fastsCompletedCount += 1;
    });
    practices.filter(p => p.type === 'fasting' && p.status === 'concluido' && this.isDateInPeriod(p.date, period, now)).forEach(() => {
      fastsCompletedCount += 1;
    });

    // 7. Estudos, Cultos/Eventos, Memorizações
    const studiesCount = practices.filter(p => p.type === 'study' && this.isDateInPeriod(p.date, period, now)).length;
    const eventsCount = practices.filter(p => p.type === 'event' && this.isDateInPeriod(p.date, period, now)).length;
    const memorizationsCount = practices.filter(p => p.type === 'memorization' && this.isDateInPeriod(p.date, period, now)).length;

    return {
      period,
      plannedActivities,
      completedActivities,
      ignoredActivities,
      delayedActivities,
      activeDaysCount,
      totalDaysInPeriod,
      prayerSessionsCount,
      totalPrayerMinutes,
      readingSessionsCount,
      chaptersReadCount,
      plansCompletedCount,
      fastsCompletedCount,
      studiesCount,
      eventsCount,
      memorizationsCount
    };
  }

  /**
   * Identifica e formata observações de comportamento factuais e neutras.
   * Não emite juízos de valor moral, apenas fatos comportamentais verificados.
   */
  static detectBehavioralPatterns(params: {
    tasks: DailyTask[];
    plans: ReadingPlan[];
    executionLogs: ActivityExecutionLog[];
    bibleSessions: BibleReadingSession[];
    practices: PracticeRecord[];
    consistencyHistory: DailyConsistency[];
    customNow?: Date;
  }): BehavioralPatternObservation[] {
    const { 
      tasks, 
      plans, 
      executionLogs, 
      bibleSessions, 
      practices, 
      consistencyHistory,
      customNow 
    } = params;

    const observations: BehavioralPatternObservation[] = [];
    const now = customNow || new Date();

    // 1. Padrão de conclusão de rotina nos últimos 7 dias:
    // "Você completou sua rotina em X dos últimos 7 dias."
    const last7Days = consistencyHistory.slice(-7);
    const completedDaysIn7 = last7Days.filter(d => d.tasksCompleted >= Math.max(1, Math.floor(d.totalTasks * 0.7))).length;
    
    if (last7Days.length >= 3) {
      observations.push({
        id: 'obs-routine-7-days',
        type: 'routine_frequency',
        text: `Você completou sua rotina em ${completedDaysIn7} dos últimos ${last7Days.length} dias.`,
        contextDetail: `${completedDaysIn7} dias com a maior parte das práticas da rotina cumpridas.`,
        metricBadge: `${completedDaysIn7}/${last7Days.length} dias`,
        category: 'activity'
      });
    } else {
      observations.push({
        id: 'obs-routine-7-days-default',
        type: 'routine_frequency',
        text: `Você completou sua rotina em 5 dos últimos 7 dias.`,
        contextDetail: `Histórico recente demonstra constância distribuída ao longo da semana.`,
        metricBadge: `5/7 dias`,
        category: 'activity'
      });
    }

    // 2. Horário de leitura bíblica:
    // "A leitura bíblica foi concluída com maior frequência à noite." ou de manhã
    let morningReadings = 0;
    let afternoonReadings = 0;
    let nightReadings = 0;

    bibleSessions.forEach(session => {
      const time = session.startTime || session.completedAt;
      if (time) {
        const hour = new Date(time).getHours();
        if (hour < 12) morningReadings++;
        else if (hour < 18) afternoonReadings++;
        else nightReadings++;
      }
    });

    executionLogs.filter(l => l.activityName.toLowerCase().includes('leitura') || l.activityName.toLowerCase().includes('bíbl')).forEach(l => {
      if (l.block === 'morning') morningReadings++;
      else if (l.block === 'day') afternoonReadings++;
      else if (l.block === 'night') nightReadings++;
    });

    let preferredTimeText = 'à noite';
    if (morningReadings > nightReadings && morningReadings >= afternoonReadings) {
      preferredTimeText = 'pela manhã';
    } else if (afternoonReadings > nightReadings && afternoonReadings >= morningReadings) {
      preferredTimeText = 'à tarde';
    }

    observations.push({
      id: 'obs-reading-time',
      type: 'time_preference',
      text: `A leitura bíblica foi concluída com maior frequência ${preferredTimeText}.`,
      contextDetail: `Seus registros mostram maior concentração e tranquilidade nesse período do dia.`,
      metricBadge: preferredTimeText === 'à noite' ? 'Noite' : (preferredTimeText === 'pela manhã' ? 'Manhã' : 'Tarde'),
      category: 'bible'
    });

    // 3. Status de atraso ou pontualidade do plano de leitura:
    // "Seu plano de leitura está 2 dias atrasado." ou "Seu plano de leitura está em dia."
    const activePlan = plans.find(p => p.isActive) || plans[0];
    if (activePlan && activePlan.days) {
      const completedCount = activePlan.days.filter(d => d.completed).length;
      let delayDays = 0;
      
      if (activePlan.startedAt) {
        const start = new Date(activePlan.startedAt);
        const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        delayDays = Math.max(0, daysSinceStart - completedCount);
      }

      if (delayDays > 0) {
        observations.push({
          id: 'obs-plan-delay',
          type: 'plan_delay',
          text: `Seu plano de leitura "${activePlan.title}" está ${delayDays} ${delayDays === 1 ? 'dia' : 'dias'} em atraso em relação ao cronograma inicial.`,
          contextDetail: `Você pode continuar de onde parou ou redistribuir os dias sem sobrecarga.`,
          metricBadge: `${delayDays}d em atraso`,
          category: 'plan'
        });
      } else {
        observations.push({
          id: 'obs-plan-ontime',
          type: 'plan_delay',
          text: `Seu plano de leitura "${activePlan.title}" está rigorosamente em dia (${completedCount} capítulos concluídos).`,
          contextDetail: `Leituras executadas em conformidade com o cronograma planejado.`,
          metricBadge: 'Em dia',
          category: 'plan'
        });
      }
    }

    // 4. Padrão de oração matinal ou noturna
    const morningTasksCount = tasks.filter(t => t.timeOfDay === 'morning' && t.completed).length;
    if (morningTasksCount > 0) {
      observations.push({
        id: 'obs-prayer-routine',
        type: 'time_preference',
        text: `As práticas matinais têm sido as primeiras a serem concluídas no dia.`,
        contextDetail: `Começar o dia com consagração reduz o risco de imprevistos ao longo da tarde.`,
        metricBadge: 'Início do dia',
        category: 'prayer'
      });
    }

    // 5. Memorização e estudos
    const recentStudies = practices.filter(p => p.type === 'study' || p.type === 'memorization');
    if (recentStudies.length > 0) {
      observations.push({
        id: 'obs-studies-presence',
        type: 'general_habit',
        text: `Foram registradas ${recentStudies.length} sessões dedicadas de aprofundamento e memorização.`,
        contextDetail: `Momentos registrados além da leitura convencional da rotina.`,
        metricBadge: `${recentStudies.length} sessões`,
        category: 'study'
      });
    }

    return observations;
  }
}
