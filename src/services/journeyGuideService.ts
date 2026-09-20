import { 
  DailyTask, 
  ReadingPlan, 
  RoutineActivity, 
  ActivityExecutionLog, 
  SpiritualObjective, 
  SpiritualProfile, 
  FastingPlan, 
  PrayerRequest,
  JourneyGuideRecommendationItem,
  JourneyGuideCalculationResult,
  JourneyAdaptationSuggestion,
  ActivityStatus
} from '../types';

/**
 * Converte string de horário "HH:MM" para minutos desde 00:00
 */
function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 12 * 60;
  const parts = timeStr.trim().split(':');
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
  }
  return 12 * 60;
}

export class JourneyGuideService {
  /**
   * Calcula as recomendações do "Guia da Jornada"
   * Respondendo de forma límpida: "O que devo fazer agora?"
   * Baseado em:
   * 1. Rotina
   * 2. Planos
   * 3. Atividades
   * 4. Histórico
   * 5. Objetivos
   * 6. Horários
   * 7. Progresso
   * 8. Atividades atrasadas
   */
  static computeJourneyGuide(params: {
    tasks: DailyTask[];
    plans: ReadingPlan[];
    routineActivities: RoutineActivity[];
    executionLogs: ActivityExecutionLog[];
    objectives: SpiritualObjective[];
    profile: SpiritualProfile;
    prayers: PrayerRequest[];
    fastingPlan: FastingPlan;
    customNow?: Date;
  }): JourneyGuideCalculationResult {
    const {
      tasks,
      plans,
      routineActivities,
      executionLogs,
      objectives,
      profile,
      prayers,
      fastingPlan,
      customNow
    } = params;

    const now = customNow || new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 1. Identificar plano de leitura ativo e passagem pendente
    const activePlan = plans.find(p => p.isActive) || plans[0];
    let pendingPlanPassage: { title: string; passageRef: string; estimatedMinutes: number } | null = null;
    if (activePlan && activePlan.days) {
      const todayDay = activePlan.days.find(d => !d.completed);
      if (todayDay) {
        pendingPlanPassage = {
          title: `Leitura Bíblica: ${activePlan.title}`,
          passageRef: todayDay.passageRef || `${todayDay.bookId} ${todayDay.chapter}`,
          estimatedMinutes: todayDay.estimatedMinutes || activePlan.dailyEstimatedMinutes || 15
        };
      }
    }

    // 2. Mapeamento de candidatos à recomendação
    const candidates: JourneyGuideRecommendationItem[] = [];

    // Prioridade máxima se já houver atividade em andamento
    const inProgressTask = tasks.find(t => t.status === 'em_andamento');
    if (inProgressTask) {
      const taskMinutes = parseTimeToMinutes(inProgressTask.scheduledTime);
      candidates.push({
        id: inProgressTask.id,
        title: inProgressTask.title,
        category: inProgressTask.category,
        subtitle: inProgressTask.passageReference,
        passageReference: inProgressTask.passageReference,
        estimatedMinutes: inProgressTask.estimatedMinutes || 15,
        scheduledTime: inProgressTask.scheduledTime,
        status: 'em_andamento',
        why: inProgressTask.why || 'Atividade que já foi iniciada por você.',
        score: 9999,
        source: 'task',
        transparentFactors: {
          activityDelay: 'Em andamento no momento atual.',
          timeAlignment: `Iniciada às ${inProgressTask.scheduledTime}.`
        }
      });
    }

    // 3. Avaliar tarefas do dia não concluídas
    const eligibleTasks = tasks.filter(t => 
      t.status !== 'concluida' && 
      t.status !== 'ignorada' && 
      t.status !== 'cancelada' &&
      t.status !== 'em_andamento'
    );

    for (const task of eligibleTasks) {
      let score = 0;
      const taskMinutes = parseTimeToMinutes(task.scheduledTime);
      const diffMinutes = currentMinutes - taskMinutes; // positivo = horário já passou; negativo = futuro
      const isDelayed = diffMinutes > 20;

      const factors: JourneyGuideRecommendationItem['transparentFactors'] = {};

      // Eixo 1: Horários
      if (isDelayed) {
        score += 150;
        factors.activityDelay = `Horário agendado (${task.scheduledTime}) já passou há ${diffMinutes} minutos.`;
      } else if (Math.abs(diffMinutes) <= 60) {
        score += 120;
        factors.timeAlignment = `Horário atual coincide com o agendamento (${task.scheduledTime}).`;
      } else if (diffMinutes < 0) {
        // Futura: quanto mais próxima, melhor
        const proximityBonus = Math.max(0, 90 - Math.abs(diffMinutes) / 3);
        score += proximityBonus;
        factors.timeAlignment = `Programada para mais tarde às ${task.scheduledTime}.`;
      }

      // Eixo 2: Rotina
      const currentBlock = currentMinutes < 12 * 60 ? 'morning' : currentMinutes < 18 * 60 ? 'day' : 'night';
      if (task.timeOfDay === currentBlock) {
        score += 45;
        factors.routineMatch = `Alinhada com seu bloco de rotina da ${currentBlock === 'morning' ? 'manhã' : currentBlock === 'day' ? 'tarde' : 'noite'}.`;
      }

      // Eixo 3: Planos
      if (task.category === 'bible') {
        if (task.planId && activePlan && task.planId === activePlan.id) {
          score += 55;
          factors.planStatus = `Vinculada ao plano de leitura bíblica ativo "${activePlan.title}".`;
        } else {
          score += 35;
          factors.planStatus = 'Prática central de leitura bíblica.';
        }
      }

      // Eixo 4: Histórico
      const taskHistory = executionLogs.filter(l => 
        l.activityName.toLowerCase().includes(task.title.toLowerCase()) ||
        l.activityId === task.id
      );
      if (taskHistory.length > 0) {
        const completedCount = taskHistory.filter(l => l.status === 'concluido').length;
        const consistencyRate = completedCount / taskHistory.length;
        if (consistencyRate > 0.7) {
          score += 25;
          factors.historyConsistency = `Seu histórico mostra alta fidelidade nesta prática (${Math.round(consistencyRate * 100)}%).`;
        }
      }

      // Eixo 5: Objetivos espirituais
      const alignedObjective = objectives.find(obj => 
        obj.status === 'ativo' && 
        (obj.category === task.category || obj.title.toLowerCase().includes(task.category))
      );
      if (alignedObjective) {
        score += alignedObjective.priority === 'alta' ? 40 : 20;
        factors.objectiveAlignment = `Alinhada ao seu objetivo espiritual ativo: "${alignedObjective.title}".`;
      }

      // Eixo 6: Jejum em curso
      if (task.category === 'fasting' && fastingPlan?.active) {
        score += 50;
        factors.routineMatch = 'Jejum ativo no momento.';
      }

      // Eixo 7: Prioridade declarada
      if (task.priority === 'alta') score += 50;
      else if (task.priority === 'media') score += 25;

      // Eixo 8: Duração sustentável (micro-momentos não sufocam o usuário)
      if (task.estimatedMinutes > 0 && task.estimatedMinutes <= 20) {
        score += 15;
      }

      candidates.push({
        id: task.id,
        title: task.title,
        category: task.category,
        subtitle: task.passageReference,
        passageReference: task.passageReference,
        estimatedMinutes: task.estimatedMinutes || 15,
        scheduledTime: task.scheduledTime,
        status: (isDelayed ? 'atrasada' : 'planejada') as ActivityStatus,
        why: task.why || 'Prática essencial para o crescimento e constância espiritual.',
        score,
        source: 'task',
        transparentFactors: factors
      });
    }

    // Se a lista de tarefas estiver vazia mas houver leitura pendente no plano ativo, adiciona o plano
    if (candidates.length === 0 && pendingPlanPassage) {
      candidates.push({
        id: `plan-pending-${activePlan.id}`,
        title: 'Leitura Bíblica',
        category: 'bible',
        subtitle: pendingPlanPassage.passageRef,
        passageReference: pendingPlanPassage.passageRef,
        estimatedMinutes: pendingPlanPassage.estimatedMinutes,
        scheduledTime: 'Agora',
        status: 'planejada',
        why: `Próxima porção bíblica do seu plano "${activePlan.title}".`,
        score: 100,
        source: 'plan',
        transparentFactors: {
          planStatus: `Capítulo do dia no plano ativo "${activePlan.title}".`,
          routineMatch: 'Recomendação baseada em sua caminhada nas Escrituras.'
        }
      });
    }

    // Ordenar candidatos por score decrescente
    candidates.sort((a, b) => b.score - a.score);

    const currentActivity = candidates.length > 0 ? candidates[0] : null;
    const nextActivity = candidates.length > 1 ? candidates[1] : null;
    const subsequentActivities = candidates.slice(2);

    // Monta explicação humana do porquê da recomendação
    let explanation = '';
    if (currentActivity) {
      const f = currentActivity.transparentFactors;
      const parts: string[] = [];
      if (f.activityDelay) parts.push('há um momento pendente que pode ser retomado sem culpa');
      if (f.timeAlignment) parts.push('está no horário propício da sua rotina');
      if (f.planStatus) parts.push('avança no seu plano bíblico ativo');
      if (f.objectiveAlignment) parts.push('fortalece seus objetivos espirituais');

      explanation = parts.length > 0
        ? `Sugerida porque ${parts.join(', ')}.`
        : 'Próxima ação recomendada para sustentar seu ritmo devocional diário com serenidade.';
    } else {
      explanation = 'Todas as atividades programadas foram concluídas. Desfrute de um tempo livre de oração espontânea ou descanso em Deus.';
    }

    // 4. Detecção de Adaptações
    const adaptations = this.detectAdaptationPatterns({
      tasks,
      plans,
      routineActivities,
      executionLogs,
      customNow: now
    });

    return {
      currentActivity,
      nextActivity,
      subsequentActivities,
      explanation,
      adaptations
    };
  }

  /**
   * Detector de padrões simples de adaptação:
   * 1. Atividades frequentemente ignoradas
   * 2. Planos atrasados (que acumularam atividades)
   * 3. Excesso de atividades no mesmo horário
   * 4. Horários com baixa execução
   * 5. Períodos de maior consistência
   */
  static detectAdaptationPatterns(params: {
    tasks: DailyTask[];
    plans: ReadingPlan[];
    routineActivities: RoutineActivity[];
    executionLogs: ActivityExecutionLog[];
    customNow?: Date;
  }): JourneyAdaptationSuggestion[] {
    const { tasks, plans, routineActivities, executionLogs } = params;
    const suggestions: JourneyAdaptationSuggestion[] = [];

    // 1. ATIVIDADES FREQUENTEMENTE IGNORADAS OU ADIADAS
    for (const act of routineActivities.filter(a => a.isActive)) {
      const logs = executionLogs.filter(l => l.activityId === act.id);
      const skippedOrPartial = logs.filter(l => l.status === 'pulado' || l.status === 'parcial');
      const recentTasksForAct = tasks.filter(t => t.title.toLowerCase().includes(act.name.toLowerCase()));
      const ignoredTasksCount = recentTasksForAct.filter(t => t.status === 'ignorada' || t.status === 'cancelada').length;

      if (skippedOrPartial.length >= 2 || ignoredTasksCount >= 1) {
        const halfMinutes = Math.max(5, Math.round(act.estimatedMinutes / 2));
        suggestions.push({
          id: `adapt-ignored-${act.id}`,
          type: 'frequently_ignored',
          title: 'Esta atividade está sendo frequentemente adiada.',
          description: `A prática de "${act.name}" encontrou desafios para ser concluída recentemente. No Reino de Deus, fidelidade é melhor que excesso: que tal reduzir para ${halfMinutes} minutos ou agendar em outro momento?`,
          detectedPattern: `Atividade ignorada ou não concluída em ${skippedOrPartial.length || 1} ocasiões recentes.`,
          metricContext: `${skippedOrPartial.length || 1} vezes adiada`,
          activityId: act.id,
          activityName: act.name,
          suggestedActionText: `Reduzir duração de ${act.estimatedMinutes}min para ${halfMinutes}min`,
          actionPayload: {
            type: 'reduce_duration',
            newDuration: halfMinutes
          },
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }

    // 2. PLANOS ATRASADOS / PLANO ACUMULOU ATIVIDADES
    for (const plan of plans.filter(p => p.isActive)) {
      const uncompletedDays = (plan.days || []).filter(d => !d.completed);
      // Se houver 3 ou mais dias de leitura acumulados
      if (uncompletedDays.length >= 3 && (plan.currentDay || 1) > 2) {
        suggestions.push({
          id: `adapt-plan-${plan.id}`,
          type: 'plan_accumulated',
          title: 'Seu plano acumulou atividades.',
          description: `O plano "${plan.title}" possui dias de leitura pendentes. A Palavra de Deus alimenta, não condena. Recomendamos redistribuir o plano em dias adicionais para ler com meditação e paz.`,
          detectedPattern: `Leituras acumuladas no plano "${plan.title}".`,
          metricContext: `${uncompletedDays.length} leituras pendentes`,
          planId: plan.id,
          planTitle: plan.title,
          suggestedActionText: 'Reorganizar cronograma adicionando 5 dias de respiro',
          actionPayload: {
            type: 'spread_plan',
            extraDays: 5
          },
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }

    // 3. EXCESSO DE ATIVIDADES NO MESMO HORÁRIO
    const blocks: { block: 'morning' | 'day' | 'night'; label: string }[] = [
      { block: 'morning', label: 'manhã' },
      { block: 'day', label: 'tarde' },
      { block: 'night', label: 'noite' }
    ];

    for (const b of blocks) {
      const activitiesInBlock = routineActivities.filter(a => a.isActive && a.block === b.block);
      const totalMinutesInBlock = activitiesInBlock.reduce((acc, a) => acc + (a.estimatedMinutes || 0), 0);

      // Se há mais de 3 atividades ou mais de 45 minutos concentrados em um único bloco
      if (activitiesInBlock.length >= 4 || totalMinutesInBlock > 45) {
        suggestions.push({
          id: `adapt-overcrowded-${b.block}`,
          type: 'overcrowded_time',
          title: 'Sua rotina possui muitas atividades neste horário.',
          description: `Você tem ${activitiesInBlock.length} práticas (${totalMinutesInBlock} min) concentradas no período da ${b.label}. Distribuir momentos ao longo do dia evita pressa e cultiva oração contínua.`,
          detectedPattern: `${activitiesInBlock.length} atividades acumuladas no bloco da ${b.label}.`,
          metricContext: `${totalMinutesInBlock} minutos no mesmo bloco`,
          block: b.block,
          suggestedActionText: `Reorganizar práticas da ${b.label}, distribuindo parte para outro período`,
          actionPayload: {
            type: 'change_block',
            newBlock: b.block === 'morning' ? 'day' : 'morning'
          },
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }

    // 4. HORÁRIOS COM BAIXA EXECUÇÃO (Ex: logs noturnos com motivo 'cansaco')
    const nightLogs = executionLogs.filter(l => l.block === 'night' && (l.status === 'pulado' || l.reason === 'cansaco'));
    if (nightLogs.length >= 2) {
      suggestions.push({
        id: 'adapt-low-night',
        type: 'low_execution_time',
        title: 'Horário noturno com baixa execução detectado.',
        description: 'Percebemos que o final da noite costuma coincidir com cansaço físico. Nosso corpo é templo do Espírito Santo e o descanso é uma dádiva. Sugerimos antecipar práticas para o início da noite ou encurtá-las.',
        detectedPattern: 'Práticas noturnas puladas por cansaço natural recente.',
        metricContext: '2+ registros de cansaço à noite',
        block: 'night',
        suggestedActionText: 'Antecipar práticas noturnas em 30 minutos',
        actionPayload: {
          type: 'change_time',
          newTime: '20:30'
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }

    // 5. PERÍODOS DE MAIOR CONSISTÊNCIA
    const morningLogs = executionLogs.filter(l => l.block === 'morning');
    const completedMorning = morningLogs.filter(l => l.status === 'concluido').length;
    if (morningLogs.length >= 3 && (completedMorning / morningLogs.length) >= 0.75) {
      suggestions.push({
        id: 'adapt-consistency-morning',
        type: 'consistency_highlight',
        title: 'Período de maior consistência identificado.',
        description: `Suas manhãs têm registrado ${Math.round((completedMorning / morningLogs.length) * 100)}% de fidelidade. Este é um período nobre em sua rotina — recomendamos manter aqui suas leituras centrais.`,
        detectedPattern: 'Alta taxa de conclusão matinal sem atritos.',
        metricContext: `${Math.round((completedMorning / morningLogs.length) * 100)}% de sucesso na manhã`,
        block: 'morning',
        suggestedActionText: 'Manter e proteger seu momento matinal prioritário',
        actionPayload: {
          type: 'reinforce_consistency'
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }

    return suggestions;
  }
}
