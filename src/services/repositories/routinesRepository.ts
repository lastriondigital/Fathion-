/**
 * FAITHION — Routines Repository
 * Gerencia as tabelas 'routines' e 'routine_items' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { RoutineActivity } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class RoutinesRepository {
  /**
   * Obtém as atividades da rotina
   */
  static async getActivities(): Promise<RepoResult<RoutineActivity[]>> {
    const localActivities = FaithionStorageService.getRoutineActivities();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localActivities, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await (supabase.from('routine_items') as any)
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar rotina do Supabase.');
        return { data: localActivities, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: RoutineActivity[] = (data as any[]).map(row => ({
          id: row.id,
          name: row.name,
          type: row.type as any,
          block: row.block as any,
          suggestedTime: row.suggested_time || '07:00',
          estimatedMinutes: row.estimated_minutes,
          priority: (row.priority as any) || 'media',
          why: row.why || '',
          isActive: row.is_active,
          order: row.order_index,
          applicableDays: Array.isArray(row.applicable_days) ? (row.applicable_days as string[]) : undefined,
          passageRef: row.passage_ref ?? undefined
        }));

        FaithionStorageService.saveRoutineActivities(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: localActivities, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar atividades da rotina.');
      return { data: localActivities, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Salva ou atualiza uma atividade de rotina
   */
  static async upsertActivity(activity: RoutineActivity): Promise<RepoResult<RoutineActivity>> {
    const current = FaithionStorageService.getRoutineActivities();
    const exists = current.some(a => a.id === activity.id);
    const updatedLocal = exists
      ? current.map(a => (a.id === activity.id ? activity : a))
      : [...current, activity];
    FaithionStorageService.saveRoutineActivities(updatedLocal);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: activity, error: null, isFromLocal: true };
    }

    try {
      const { error } = await (supabase.from('routine_items') as any)
        .upsert({
          id: activity.id,
          user_id: userId,
          name: activity.name,
          type: activity.type,
          block: activity.block,
          suggested_time: activity.suggestedTime,
          estimated_minutes: activity.estimatedMinutes,
          priority: activity.priority,
          why: activity.why,
          is_active: activity.isActive,
          order_index: activity.order,
          applicable_days: activity.applicableDays ?? null,
          passage_ref: activity.passageRef ?? null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao salvar atividade de rotina no Supabase.');
        return { data: activity, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: activity, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao salvar atividade.');
      return { data: activity, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Deleta uma atividade da rotina
   */
  static async deleteActivity(id: string): Promise<RepoResult<boolean>> {
    FaithionStorageService.deleteRoutineActivity(id);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: true, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('routine_items')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao excluir atividade no Supabase.');
        return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: true, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao deletar atividade.');
      return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
