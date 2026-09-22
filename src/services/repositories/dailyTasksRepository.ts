/**
 * FAITHION — Daily Tasks Repository
 * Gerencia a tabela 'daily_tasks' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { DailyTask } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class DailyTasksRepository {
  /**
   * Obtém as tarefas diárias:
   * 1º Lê do Supabase se conectado e autenticado
   * 2º Fallback automático para o armazenamento local
   */
  static async getTasks(): Promise<RepoResult<DailyTask[]>> {
    const localTasks = FaithionStorageService.getDailyTasks();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localTasks, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar tarefas do Supabase.');
        return { data: localTasks, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mappedTasks: DailyTask[] = data.map(row => ({
          id: row.id,
          title: row.title,
          category: row.category as any,
          timeOfDay: row.time_of_day as any,
          scheduledTime: row.scheduled_time,
          estimatedMinutes: row.estimated_minutes,
          actualMinutes: row.actual_minutes ?? undefined,
          why: row.why || '',
          passageReference: row.passage_reference ?? undefined,
          status: row.status as any,
          priority: (row.priority as any) ?? undefined,
          completed: row.completed,
          completedAt: row.completed_at ?? undefined,
          startedAt: row.started_at ?? undefined,
          order: row.order_index,
          notes: row.notes ?? undefined,
          planId: row.plan_id ?? undefined
        }));

        // Atualiza armazenamento local para manter disponibilidade offline
        FaithionStorageService.saveDailyTasks(mappedTasks);
        return { data: mappedTasks, error: null, isFromLocal: false };
      }

      // Se o banco ainda não tem tarefas para este usuário mas o local tem, sincroniza as locais
      if (localTasks.length > 0) {
        this.syncAllLocalToCloud(localTasks, userId).catch(() => {});
      }

      return { data: localTasks, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha de comunicação ao buscar tarefas.');
      return { data: localTasks, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Salva ou atualiza uma tarefa diária
   */
  static async upsertTask(task: DailyTask): Promise<RepoResult<DailyTask>> {
    // 1. Atualiza estado local imediatamente
    const currentLocal = FaithionStorageService.getDailyTasks();
    const index = currentLocal.findIndex(t => t.id === task.id);
    const updatedLocal = index >= 0
      ? currentLocal.map(t => (t.id === task.id ? task : t))
      : [...currentLocal, task];
    FaithionStorageService.saveDailyTasks(updatedLocal);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: task, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('daily_tasks')
        .upsert({
          id: task.id,
          user_id: userId,
          title: task.title,
          category: task.category,
          time_of_day: task.timeOfDay,
          scheduled_time: task.scheduledTime,
          estimated_minutes: task.estimatedMinutes,
          actual_minutes: task.actualMinutes ?? null,
          why: task.why,
          passage_reference: task.passageReference ?? null,
          status: task.status,
          priority: task.priority ?? null,
          completed: task.completed,
          completed_at: task.completedAt ?? null,
          started_at: task.startedAt ?? null,
          order_index: task.order,
          notes: task.notes ?? null,
          plan_id: task.planId ?? null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao sincronizar tarefa na nuvem.');
        return { data: task, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: task, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha na conexão ao salvar tarefa.');
      return { data: task, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Alterna a conclusão de uma tarefa diária
   */
  static async toggleTaskCompletion(taskId: string, actualMinutes?: number): Promise<RepoResult<DailyTask>> {
    const updated = FaithionStorageService.toggleDailyTask(taskId, actualMinutes);
    if (!updated) {
      return { data: null, error: 'Tarefa não encontrada.', isFromLocal: true };
    }
    return this.upsertTask(updated);
  }

  /**
   * Remove uma tarefa diária
   */
  static async deleteTask(taskId: string): Promise<RepoResult<boolean>> {
    // 1. Remove localmente
    FaithionStorageService.deleteDailyTask(taskId);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: true, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('daily_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao deletar tarefa no Supabase.');
        return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: true, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha na conexão ao deletar tarefa.');
      return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  private static async syncAllLocalToCloud(tasks: DailyTask[], userId: string): Promise<void> {
    if (!supabase || tasks.length === 0) return;
    try {
      const payload = tasks.map(t => ({
        id: t.id,
        user_id: userId,
        title: t.title,
        category: t.category,
        time_of_day: t.timeOfDay,
        scheduled_time: t.scheduledTime,
        estimated_minutes: t.estimatedMinutes,
        actual_minutes: t.actualMinutes ?? null,
        why: t.why,
        passage_reference: t.passageReference ?? null,
        status: t.status,
        priority: t.priority ?? null,
        completed: t.completed,
        completed_at: t.completedAt ?? null,
        started_at: t.startedAt ?? null,
        order_index: t.order,
        notes: t.notes ?? null,
        plan_id: t.planId ?? null
      }));

      await supabase.from('daily_tasks').upsert(payload);
    } catch {}
  }
}
