/**
 * FAITHION — Reflections Repository
 * Gerencia a tabela 'reflections' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { Reflection } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class ReflectionsRepository {
  static async getReflections(): Promise<RepoResult<Reflection[]>> {
    const localReflections = FaithionStorageService.getReflections();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localReflections, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar reflexões do Supabase.');
        return { data: localReflections, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: Reflection[] = data.map(r => ({
          id: r.id,
          date: r.date,
          scriptureRef: r.scripture_ref ?? undefined,
          whatLearned: r.what_learned ?? undefined,
          whatCaughtAttention: r.what_caught_attention ?? undefined,
          howToApply: r.how_to_apply ?? undefined,
          personalPrayer: r.personal_prayer ?? undefined,
          notes: r.notes ?? undefined,
          relatedActivityId: r.related_activity_id ?? undefined,
          relatedActivityType: r.related_activity_type as any,
          relatedTitle: r.related_title ?? undefined,
          moodRating: (r.mood_rating as any) ?? undefined,
          createdAt: r.created_at
        }));

        FaithionStorageService.saveReflections(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: localReflections, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar reflexões.');
      return { data: localReflections, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  static async upsertReflection(reflection: Reflection): Promise<RepoResult<Reflection>> {
    const current = FaithionStorageService.getReflections();
    const exists = current.some(r => r.id === reflection.id);
    const updated = exists ? current.map(r => (r.id === reflection.id ? reflection : r)) : [reflection, ...current];
    FaithionStorageService.saveReflections(updated);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: reflection, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('reflections')
        .upsert({
          id: reflection.id,
          user_id: userId,
          date: reflection.date,
          scripture_ref: reflection.scriptureRef ?? null,
          what_learned: reflection.whatLearned ?? null,
          what_caught_attention: reflection.whatCaughtAttention ?? null,
          how_to_apply: reflection.howToApply ?? null,
          personal_prayer: reflection.personalPrayer ?? null,
          notes: reflection.notes ?? null,
          related_activity_id: reflection.relatedActivityId ?? null,
          related_activity_type: reflection.relatedActivityType ?? null,
          related_title: reflection.relatedTitle ?? null,
          mood_rating: reflection.moodRating ?? null,
          created_at: reflection.createdAt,
          updated_at: new Date().toISOString()
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao salvar reflexão no Supabase.');
        return { data: reflection, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: reflection, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao sincronizar reflexão.');
      return { data: reflection, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
