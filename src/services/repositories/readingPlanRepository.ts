/**
 * FAITHION — Reading Plan Repository
 * Gerencia as tabelas 'reading_plans', 'reading_plan_items' e 'reading_progress' no Supabase.
 */

import { supabase } from '../../lib/supabase';
import { ReadingPlan } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class ReadingPlanRepository {
  /**
   * Obtém os planos de leitura bíblica
   */
  static async getPlans(): Promise<RepoResult<ReadingPlan[]>> {
    const localPlans = FaithionStorageService.getReadingPlans();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: localPlans, error: null, isFromLocal: true };
    }

    try {
      const { data: plansData, error: plansErr } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (plansErr) {
        const parsed = parseSupabaseError(plansErr, 'Erro ao carregar planos de leitura.');
        return { data: localPlans, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (plansData && plansData.length > 0) {
        // Busca itens de planos
        const planIds = plansData.map(p => p.id);
        const { data: itemsData } = await supabase
          .from('reading_plan_items')
          .select('*')
          .in('plan_id', planIds)
          .order('day_number', { ascending: true });

        const mappedPlans: ReadingPlan[] = plansData.map(p => {
          const planItems = (itemsData || []).filter(item => item.plan_id === p.id);
          return {
            id: p.id,
            title: p.title,
            description: p.description || '',
            objective: p.objective ?? undefined,
            category: p.category as any,
            durationDays: p.duration_days,
            currentDay: p.current_day,
            isActive: p.is_active,
            status: p.status as any,
            startedAt: p.started_at ?? undefined,
            completedAt: p.completed_at ?? undefined,
            pausedAt: p.paused_at ?? undefined,
            startDate: p.start_date ?? undefined,
            frequency: p.frequency as any,
            dailyEstimatedMinutes: p.daily_estimated_minutes ?? undefined,
            preferredVersion: p.preferred_version ?? undefined,
            method: p.method as any,
            selectedBooks: Array.isArray(p.selected_books) ? (p.selected_books as string[]) : undefined,
            days: planItems.map(i => ({
              dayNumber: i.day_number,
              title: i.title,
              passageRef: i.passage_ref,
              bookId: i.book_id || '',
              chapter: i.chapter || 1,
              verseRange: i.verse_range ?? undefined,
              devotionalPrompt: i.devotional_prompt || '',
              completed: i.completed,
              completedAt: i.completed_at ?? undefined,
              date: i.date ?? undefined,
              estimatedMinutes: i.estimated_minutes ?? undefined,
              status: i.status as any
            })),
            isTemplate: p.is_template,
            createdAt: p.created_at,
            updatedAt: p.updated_at ?? undefined
          };
        });

        FaithionStorageService.saveReadingPlans(mappedPlans);
        return { data: mappedPlans, error: null, isFromLocal: false };
      }

      return { data: localPlans, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar planos.');
      return { data: localPlans, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Salva um plano de leitura e seus itens
   */
  static async upsertPlan(plan: ReadingPlan): Promise<RepoResult<ReadingPlan>> {
    const current = FaithionStorageService.getReadingPlans();
    const exists = current.some(p => p.id === plan.id);
    const updatedLocal = exists
      ? current.map(p => (p.id === plan.id ? plan : p))
      : [plan, ...current];
    FaithionStorageService.saveReadingPlans(updatedLocal);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return { data: plan, error: null, isFromLocal: true };
    }

    try {
      const { error: planErr } = await supabase
        .from('reading_plans')
        .upsert({
          id: plan.id,
          user_id: userId,
          title: plan.title,
          description: plan.description,
          objective: plan.objective ?? null,
          category: plan.category,
          duration_days: plan.durationDays,
          current_day: plan.currentDay,
          is_active: plan.isActive,
          status: plan.status || 'active',
          started_at: plan.startedAt ?? null,
          completed_at: plan.completedAt ?? null,
          paused_at: plan.pausedAt ?? null,
          start_date: plan.startDate ?? null,
          frequency: plan.frequency ?? null,
          daily_estimated_minutes: plan.dailyEstimatedMinutes ?? null,
          preferred_version: plan.preferredVersion ?? null,
          method: plan.method ?? null,
          selected_books: plan.selectedBooks ?? null,
          is_template: Boolean(plan.isTemplate),
          updated_at: new Date().toISOString()
        });

      if (planErr) {
        const parsed = parseSupabaseError(planErr, 'Erro ao salvar plano no Supabase.');
        return { data: plan, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      // Upsert dos itens do plano
      if (plan.days && plan.days.length > 0) {
        const itemsPayload = plan.days.map(d => ({
          id: `${plan.id}-day-${d.dayNumber}`,
          plan_id: plan.id,
          user_id: userId,
          day_number: d.dayNumber,
          title: d.title,
          passage_ref: d.passageRef,
          book_id: d.bookId || null,
          chapter: d.chapter || null,
          verse_range: d.verseRange ?? null,
          devotional_prompt: d.devotionalPrompt ?? null,
          estimated_minutes: d.estimatedMinutes ?? null,
          date: d.date ?? null,
          status: d.status ?? null,
          completed: d.completed,
          completed_at: d.completedAt ?? null
        }));

        await supabase.from('reading_plan_items').upsert(itemsPayload);
      }

      return { data: plan, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao salvar plano.');
      return { data: plan, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
