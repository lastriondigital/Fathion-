import { DailyTask, ReadingPlan, FastingPlan, ActivityStatus } from '../types';

export interface PriorityEvaluationResult {
  nextTask: DailyTask | null;
  evaluatedTasks: DailyTask[];
  explanation: string;
  delayedCount: number;
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
}

/**
 * Converte horário "HH:MM" para minutos a partir da meia-noite
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

/**
 * Normaliza o status da tarefa considerando retrocompatibilidade com 'completed'
 */
export function normalizeTaskStatus(task: DailyTask, nowMinutes: number): ActivityStatus {
  if (task.completed || task.status === 'concluida') {
    return 'concluida';
  }
  if (task.status === 'ignorada') return 'ignorada';
  if (task.status === 'cancelada') return 'cancelada';
  if (task.status === 'em_andamento') return 'em_andamento';

  // Verifica atraso se o horário já passou há mais de 20 minutos
  const scheduledMins = parseTimeToMinutes(task.scheduledTime);
  if (nowMinutes > scheduledMins + 20) {
    return 'atrasada';
  }

  return task.status || 'planejada';
}

/**
 * Motor de Prioridade Operacional do FAITHION
 * Avalia: Horário, Atraso, Prioridade, Tipo, Plano Ativo, Duração e Dependências.
 */
export function evaluateNextAction(
  tasks: DailyTask[],
  activePlan?: ReadingPlan,
  fastingPlan?: FastingPlan,
  customNow?: Date
): PriorityEvaluationResult {
  const now = customNow || new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 1. Normaliza status e identifica dependências
  const completedIds = new Set<string>(
    tasks.filter(t => t.completed || t.status === 'concluida').map(t => t.id)
  );

  let delayedCount = 0;
  let inProgressTask: DailyTask | null = null;

  // Primeiro passe: calcular status normalizado
  const updatedTasks = tasks.map(task => {
    const normStatus = normalizeTaskStatus(task, currentMinutes);
    if (normStatus === 'atrasada') delayedCount++;
    if (normStatus === 'em_andamento') inProgressTask = task;
    return {
      ...task,
      status: normStatus
    };
  });

  const totalCount = updatedTasks.length;
  const completedCount = updatedTasks.filter(t => t.status === 'concluida').length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  // 2. Candidatos elegíveis (não concluídos, não ignorados, não cancelados)
  const eligibleTasks = updatedTasks.filter(t => 
    t.status !== 'concluida' && 
    t.status !== 'ignorada' && 
    t.status !== 'cancelada'
  );

  if (eligibleTasks.length === 0) {
    return {
      nextTask: null,
      evaluatedTasks: updatedTasks,
      explanation: 'Todas as atividades programadas para hoje foram concluídas. Desfrute de um momento de descanso e gratidão na presença de Deus.',
      delayedCount,
      completedCount,
      totalCount,
      completionPercentage
    };
  }

  // Se houver uma atividade em andamento, ela é a prioridade máxima absoluta
  if (inProgressTask) {
    const activeTask: DailyTask = inProgressTask;
    const nextTask: DailyTask = { ...activeTask, status: 'em_andamento' };
    return {
      nextTask,
      evaluatedTasks: updatedTasks.map(t => t.id === activeTask.id ? nextTask : t),
      explanation: 'Esta atividade já está em andamento. Foque sua atenção e finalize com serenidade.',
      delayedCount,
      completedCount,
      totalCount,
      completionPercentage
    };
  }

  // 3. Filtrar tarefas bloqueadas por dependências não concluídas
  const nonBlockedTasks = eligibleTasks.filter(task => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    const allDependenciesMet = task.dependencies.every(depId => completedIds.has(depId));
    return allDependenciesMet;
  });

  const poolToScore = nonBlockedTasks.length > 0 ? nonBlockedTasks : eligibleTasks;

  // 4. Calcular Score de Relevância
  let bestTask: DailyTask | null = null;
  let bestScore = -99999;
  let explanation = '';

  for (const task of poolToScore) {
    let score = 0;
    const taskMinutes = parseTimeToMinutes(task.scheduledTime);
    const diffMinutes = currentMinutes - taskMinutes; // positivo = horário já passou; negativo = futuro

    // Atraso: tarefa que passou do horário tem relevância para não ser esquecida
    if (diffMinutes > 20) {
      score += 150; // Atrasada
    } else if (Math.abs(diffMinutes) <= 60) {
      score += 120; // Muito próxima do horário atual (± 1 hora)
    } else if (diffMinutes < 0) {
      // Futura: quanto mais próxima, melhor
      score += Math.max(0, 100 - Math.abs(diffMinutes) / 2);
    }

    // Prioridade
    if (task.priority === 'alta') score += 60;
    else if (task.priority === 'media') score += 30;
    else score += 10;

    // Plano ativo de leitura
    if (task.category === 'bible') {
      if (task.planId && activePlan && task.planId === activePlan.id) {
        score += 40;
      } else {
        score += 25;
      }
    }

    // Jejum em curso
    if (task.category === 'fasting' && fastingPlan?.active) {
      score += 35;
    }

    // Oração diária central
    if (task.category === 'prayer') {
      score += 20;
    }

    // Duração equilibrada (favorece micro-momentos e práticas sustentáveis)
    if (task.estimatedMinutes > 0 && task.estimatedMinutes <= 20) {
      score += 15;
    }

    // Ordem no dia (desempate consistente)
    score -= (task.order || 0) * 2;

    if (score > bestScore) {
      bestScore = score;
      bestTask = task;

      // Monta explicação humana contextual
      if (diffMinutes > 20) {
        explanation = `Horário sugerido (${task.scheduledTime}) ultrapassado. É um momento propício para retomar sem pressa ou cobrança.`;
      } else if (Math.abs(diffMinutes) <= 60) {
        explanation = `Alinhada com o horário atual (${task.scheduledTime}) e com a tua rotina de ${task.timeOfDay === 'morning' ? 'manhã' : task.timeOfDay === 'afternoon' ? 'tarde' : 'noite'}.`;
      } else if (task.category === 'bible' && activePlan) {
        explanation = `Continuação do teu plano de leitura ativo "${activePlan.title}".`;
      } else if (task.priority === 'alta') {
        explanation = `Definida como alta prioridade espiritual para a tua caminhada de hoje.`;
      } else {
        explanation = `Próximo passo recomendado para manter a fidelidade e o ritmo diário com Deus.`;
      }
    }
  }

  // 5. Marca a melhor tarefa com status 'proxima' (se não estiver em andamento)
  const finalTasks = updatedTasks.map(t => {
    if (bestTask && t.id === bestTask.id) {
      return { ...t, status: 'proxima' as ActivityStatus };
    }
    return t;
  });

  const nextTaskWithStatus: DailyTask | null = bestTask 
    ? { ...bestTask, status: 'proxima' }
    : null;

  return {
    nextTask: nextTaskWithStatus,
    evaluatedTasks: finalTasks,
    explanation,
    delayedCount,
    completedCount,
    totalCount,
    completionPercentage
  };
}
