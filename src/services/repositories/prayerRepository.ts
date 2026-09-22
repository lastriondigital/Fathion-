/**
 * FAITHION — Prayer Repository
 * Gerencia as tabelas 'prayer_requests' e 'prayer_plans' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { PrayerRequest, PrayerPlan } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class PrayerRepository {
  /**
   * Obtém os pedidos de oração
   */
  static async getPrayerRequests(): Promise<RepoResult<PrayerRequest[]>> {
    const localRequests = FaithionStorageService.getPrayerRequests();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localRequests, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao buscar pedidos de oração do Supabase.');
        return { data: localRequests, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: PrayerRequest[] = data.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          person: row.person ?? undefined,
          category: row.category as any,
          priority: row.priority as any,
          date: row.date,
          status: row.status as any,
          answer: row.answer ?? undefined,
          notes: row.notes ?? undefined,
          scriptureReferences: Array.isArray(row.scripture_references) ? (row.scripture_references as string[]) : undefined,
          answered: row.answered,
          answeredAt: row.answered_at ?? undefined,
          answeredTestimony: row.answered_testimony ?? undefined,
          timesPrayed: row.times_prayed,
          lastPrayedAt: row.last_prayed_at ?? undefined,
          isUrgent: row.is_urgent,
          createdAt: row.created_at
        }));

        FaithionStorageService.savePrayerRequests(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: localRequests, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar orações.');
      return { data: localRequests, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Cria ou atualiza um pedido de oração
   */
  static async upsertPrayerRequest(request: PrayerRequest): Promise<RepoResult<PrayerRequest>> {
    const current = FaithionStorageService.getPrayerRequests();
    const exists = current.some(r => r.id === request.id);
    const updatedLocal = exists
      ? current.map(r => (r.id === request.id ? request : r))
      : [request, ...current];
    FaithionStorageService.savePrayerRequests(updatedLocal);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: request, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .upsert({
          id: request.id,
          user_id: userId,
          title: request.title,
          description: request.description,
          person: request.person ?? null,
          category: request.category,
          priority: request.priority,
          date: request.date,
          status: request.status,
          answer: request.answer ?? null,
          notes: request.notes ?? null,
          scripture_references: request.scriptureReferences ?? null,
          answered: request.answered,
          answered_at: request.answeredAt ?? null,
          answered_testimony: request.answeredTestimony ?? null,
          times_prayed: request.timesPrayed,
          last_prayed_at: request.lastPrayedAt ?? null,
          is_urgent: Boolean(request.isUrgent),
          created_at: request.createdAt,
          updated_at: new Date().toISOString()
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao sincronizar oração no Supabase.');
        return { data: request, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: request, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao salvar oração.');
      return { data: request, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Deleta um pedido de oração
   */
  static async deletePrayerRequest(id: string): Promise<RepoResult<boolean>> {
    FaithionStorageService.deletePrayerRequest(id);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: true, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao deletar oração no Supabase.');
        return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: true, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao deletar oração.');
      return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
