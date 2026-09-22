/**
 * FAITHION — Profile Repository
 * Gerencia as tabelas 'profiles' e 'user_settings' no Supabase com suporte Local-First.
 */

import { supabase } from '../../lib/supabase';
import { SpiritualProfile } from '../../types';
import { ProfileRow, UserSettingsRow } from '../../types/database';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class ProfileRepository {
  /**
   * Obtém o perfil espiritual:
   * 1º Busca do Supabase se o usuário estiver autenticado e online.
   * 2º Em caso de ausência de auth, offline ou erro de rede, recorre aos dados locais.
   */
  static async getProfile(): Promise<RepoResult<SpiritualProfile>> {
    const localProfile = FaithionStorageService.getSpiritualProfile();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return {
        data: localProfile,
        error: null,
        isFromLocal: true
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar perfil do Supabase.');
        return {
          data: localProfile,
          error: parsed.message,
          errorCode: parsed.code,
          isFromLocal: true
        };
      }

      if (data) {
        // Converte ProfileRow para SpiritualProfile da UI
        const mappedProfile: SpiritualProfile = {
          name: data.name || localProfile.name,
          spiritualFocus: data.spiritual_focus || localProfile.spiritualFocus,
          lifeSeason: data.life_season || localProfile.lifeSeason,
          dailyPrayerGoalMinutes: data.daily_prayer_goal_minutes ?? localProfile.dailyPrayerGoalMinutes,
          dailyBibleChaptersGoal: data.daily_bible_chapters_goal ?? localProfile.dailyBibleChaptersGoal,
          weeklyFastingGoalDays: data.weekly_fasting_goal_days ?? localProfile.weeklyFastingGoalDays,
          remindersEnabled: localProfile.remindersEnabled,
          preferredBibleVersion: (data.preferred_bible_version as any) || localProfile.preferredBibleVersion,
          wakeUpTime: data.wake_up_time || localProfile.wakeUpTime,
          bedTime: data.bed_time || localProfile.bedTime,
          availableTimeSlots: localProfile.availableTimeSlots,
          availableDays: localProfile.availableDays,
          preferredPracticeDurationMinutes: data.preferred_practice_duration_minutes ?? localProfile.preferredPracticeDurationMinutes,
          bibleExperienceLevel: (data.bible_experience_level as any) || localProfile.bibleExperienceLevel,
          readingFrequency: (data.reading_frequency as any) || localProfile.readingFrequency,
          prayerFrequency: (data.prayer_frequency as any) || localProfile.prayerFrequency,
          topicsOfInterest: localProfile.topicsOfInterest,
          readingPreference: (data.reading_preference as any) || localProfile.readingPreference,
          prayerPreference: (data.prayer_preference as any) || localProfile.prayerPreference,
          routinePreference: (data.routine_preference as any) || localProfile.routinePreference
        };

        // Atualiza cache local silenciosamente para manter paridade offline
        FaithionStorageService.saveSpiritualProfile(mappedProfile);

        return {
          data: mappedProfile,
          error: null,
          isFromLocal: false
        };
      }

      return {
        data: localProfile,
        error: null,
        isFromLocal: true
      };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Erro ao conectar ao Supabase.');
      return {
        data: localProfile,
        error: parsed.message,
        errorCode: parsed.code,
        isFromLocal: true
      };
    }
  }

  /**
   * Salva o perfil:
   * Grava localmente de forma imediata (zero latência na UI) e reflete no Supabase se autenticado.
   */
  static async saveProfile(profile: SpiritualProfile): Promise<RepoResult<SpiritualProfile>> {
    // 1. Gravação local imediata
    FaithionStorageService.saveSpiritualProfile(profile);

    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return {
        data: profile,
        error: null,
        isFromLocal: true
      };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name: profile.name,
          spiritual_focus: profile.spiritualFocus,
          life_season: profile.lifeSeason,
          daily_prayer_goal_minutes: profile.dailyPrayerGoalMinutes,
          daily_bible_chapters_goal: profile.dailyBibleChaptersGoal,
          weekly_fasting_goal_days: profile.weeklyFastingGoalDays,
          preferred_bible_version: profile.preferredBibleVersion,
          wake_up_time: profile.wakeUpTime,
          bed_time: profile.bedTime,
          preferred_practice_duration_minutes: profile.preferredPracticeDurationMinutes,
          bible_experience_level: profile.bibleExperienceLevel,
          reading_frequency: profile.readingFrequency,
          prayer_frequency: profile.prayerFrequency,
          reading_preference: profile.readingPreference,
          prayer_preference: profile.prayerPreference,
          routine_preference: profile.routinePreference,
          updated_at: new Date().toISOString()
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Não foi possível salvar na nuvem.');
        return {
          data: profile,
          error: parsed.message,
          errorCode: parsed.code,
          isFromLocal: true
        };
      }

      return {
        data: profile,
        error: null,
        isFromLocal: false
      };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao sincronizar perfil com o Supabase.');
      return {
        data: profile,
        error: parsed.message,
        errorCode: parsed.code,
        isFromLocal: true
      };
    }
  }

  /**
   * Obtém configurações adicionais (tabela user_settings)
   */
  static async getUserSettings(): Promise<RepoResult<UserSettingsRow>> {
    const userId = await getCurrentAuthenticatedUserId();
    if (!userId || !supabase) {
      return {
        data: null,
        error: null,
        isFromLocal: true
      };
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar configurações.');
        return { data: null, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: data as UserSettingsRow, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar configurações.');
      return { data: null, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
