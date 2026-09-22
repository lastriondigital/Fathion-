/**
 * FAITHION — Goals Repository
 * Gerencia a tabela 'goals' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { SpiritualGoal } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class GoalsRepository {
  static async getGoals(): Promise<RepoResult<SpiritualGoal[]>> {
    const localGoals = FaithionStorageService.getSpiritualGoals();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localGoals, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar objetivos.');
        return { data: localGoals, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: SpiritualGoal[] = data.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category as any,
          targetValue: r.target_value ?? 1,
          currentValue: r.current_value ?? 0,
          unit: r.unit || 'vezes',
          why: r.why || '',
          deadline: r.deadline ?? undefined,
          completed: r.completed
        }));

        FaithionStorageService.saveSpiritualGoals(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: localGoals, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar objetivos.');
      return { data: localGoals, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  static async upsertGoal(goal: SpiritualGoal): Promise<RepoResult<SpiritualGoal>> {
    const current = FaithionStorageService.getSpiritualGoals();
    const exists = current.some(g => g.id === goal.id);
    const updated = exists ? current.map(g => (g.id === goal.id ? goal : g)) : [...current, goal];
    FaithionStorageService.saveSpiritualGoals(updated);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: goal, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('goals')
        .upsert({
          id: goal.id,
          user_id: userId,
          title: goal.title,
          category: goal.category,
          priority: 'media',
          target_value: goal.targetValue,
          current_value: goal.currentValue,
          unit: goal.unit,
          why: goal.why,
          deadline: goal.deadline ?? null,
          status: goal.completed ? 'concluido' : 'ativo',
          completed: goal.completed,
          updated_at: new Date().toISOString()
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao salvar objetivo no Supabase.');
        return { data: goal, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: goal, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao salvar objetivo.');
      return { data: goal, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
