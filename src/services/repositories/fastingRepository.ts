/**
 * FAITHION — Fasting Repository
 * Gerencia a tabela 'fasting_plans' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { FastingPlan } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class FastingRepository {
  static async getFastingPlans(): Promise<RepoResult<FastingPlan[]>> {
    const localPlans = FaithionStorageService.getFastingPlans();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localPlans, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('fasting_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao buscar jejuns do Supabase.');
        return { data: localPlans, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: FastingPlan[] = data.map(r => ({
          id: r.id,
          title: r.title,
          type: r.type as any,
          date: r.date,
          startTime: r.start_time,
          endTime: r.end_time,
          targetHours: r.target_hours,
          purpose: r.purpose,
          relatedPrayerId: r.related_prayer_id ?? undefined,
          relatedPassage: r.related_passage ?? undefined,
          notes: r.notes ?? undefined,
          status: r.status as any,
          active: r.active,
          completed: r.completed,
          completedAt: r.completed_at ?? undefined,
          interruptedAt: r.interrupted_at ?? undefined,
          interruptionReason: r.interruption_reason ?? undefined,
          reflectionsDuringFast: r.reflections_during_fast ?? undefined,
          createdAt: r.created_at
        }));

        FaithionStorageService.saveFastingPlans(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: localPlans, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar planos de jejum.');
      return { data: localPlans, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  static async upsertFastingPlan(plan: FastingPlan): Promise<RepoResult<FastingPlan>> {
    const current = FaithionStorageService.getFastingPlans();
    const exists = current.some(p => p.id === plan.id);
    const updated = exists ? current.map(p => (p.id === plan.id ? plan : p)) : [plan, ...current];
    FaithionStorageService.saveFastingPlans(updated);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: plan, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('fasting_plans')
        .upsert({
          id: plan.id,
          user_id: userId,
          title: plan.title,
          type: plan.type,
          date: plan.date,
          start_time: plan.startTime,
          end_time: plan.endTime,
          target_hours: plan.targetHours,
          purpose: plan.purpose,
          related_prayer_id: plan.relatedPrayerId ?? null,
          related_passage: plan.relatedPassage ?? null,
          notes: plan.notes ?? null,
          status: plan.status,
          active: plan.active,
          completed: plan.completed,
          completed_at: plan.completedAt ?? null,
          interrupted_at: plan.interruptedAt ?? null,
          interruption_reason: plan.interruptionReason ?? null,
          reflections_during_fast: plan.reflectionsDuringFast ?? null,
          updated_at: new Date().toISOString()
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao salvar plano de jejum no Supabase.');
        return { data: plan, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: plan, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao sincronizar jejum.');
      return { data: plan, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
