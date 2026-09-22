/**
 * FAITHION — History Repository
 * Gerencia a tabela 'activity_history' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { ActivityExecutionLog } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class HistoryRepository {
  static async getHistory(): Promise<RepoResult<ActivityExecutionLog[]>> {
    const localHistory = FaithionStorageService.getActivityExecutionLogs();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localHistory, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('activity_history')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar histórico de atividades.');
        return { data: localHistory, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: ActivityExecutionLog[] = data.map(r => ({
          id: r.id,
          date: r.date,
          activityId: r.activity_id || '',
          activityName: r.activity_name,
          block: (r.block as any) || 'morning',
          plannedMinutes: r.planned_minutes,
          actualMinutes: r.actual_minutes,
          status: r.status as any,
          reason: (r.reason as any) ?? undefined,
          reasonNotes: r.reason_notes ?? undefined,
          quickReflection: r.quick_reflection ?? undefined,
          loggedAt: r.logged_at
        }));

        FaithionStorageService.saveActivityExecutionLogs(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: localHistory, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar histórico de atividades.');
      return { data: localHistory, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  static async logExecution(log: ActivityExecutionLog): Promise<RepoResult<ActivityExecutionLog>> {
    // 1. Gravação local com preservação histórica inegociável
    FaithionStorageService.logActivityExecution({
      activityId: log.activityId,
      activityName: log.activityName,
      block: log.block,
      date: log.date,
      status: log.status,
      plannedMinutes: log.plannedMinutes,
      actualMinutes: log.actualMinutes,
      reason: log.reason,
      reasonNotes: log.reasonNotes,
      quickReflection: log.quickReflection
    });

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: log, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('activity_history')
        .upsert({
          id: log.id,
          user_id: userId,
          date: log.date,
          activity_id: log.activityId,
          activity_name: log.activityName,
          block: log.block,
          planned_minutes: log.plannedMinutes,
          actual_minutes: log.actualMinutes,
          status: log.status,
          reason: log.reason ?? null,
          reason_notes: log.reasonNotes ?? null,
          quick_reflection: log.quickReflection ?? null,
          logged_at: log.loggedAt
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao registrar histórico no Supabase.');
        return { data: log, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: log, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao sincronizar log de execução.');
      return { data: log, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
