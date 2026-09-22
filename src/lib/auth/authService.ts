/**
 * FAITHION — Serviço de Autenticação Supabase Real
 * Camada src/lib/auth/authService.ts
 * 
 * Funcionalidades:
 * - Sessão atual e usuário atual
 * - Login com senha
 * - Cadastro de usuário
 * - Logout
 * - Observação de mudanças de estado de autenticação (onAuthStateChange)
 * - Carregamento e criação automática de perfil (profiles) e configurações (user_settings)
 */

import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, getSupabaseConfigStatus } from '../supabase';
import { Database, ProfileRow, UserSettingsRow } from '../../types/database';

export interface AuthResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string | null;
}

export interface UserProfileBundle {
  profile: ProfileRow | null;
  settings: UserSettingsRow | null;
}

export class AuthService {
  /**
   * Obtém a sessão atual autenticada no Supabase
   */
  static async getCurrentSession(): Promise<Session | null> {
    if (!supabase) return null;
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('[AuthService] Erro ao recuperar sessão:', error.message);
        return null;
      }
      return session;
    } catch (err: any) {
      console.warn('[AuthService] Falha de conexão ao obter sessão:', err?.message);
      return null;
    }
  }

  /**
   * Obtém o usuário atualmente autenticado
   */
  static async getCurrentUser(): Promise<User | null> {
    if (!supabase) return null;
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
    } catch (err) {
      return null;
    }
  }

  /**
   * Login com e-mail e senha
   */
  static async signInWithPassword(email: string, password: string): Promise<AuthResponse<{ user: User; session: Session }>> {
    const configStatus = getSupabaseConfigStatus();
    if (!configStatus.isConfigured || !supabase) {
      return {
        success: false,
        error: configStatus.error || 'Configuração do Supabase indisponível.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        let friendlyMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          friendlyMessage = 'E-mail ou senha incorretos. Verifique os dados digitados.';
        } else if (error.message.includes('Email not confirmed')) {
          friendlyMessage = 'E-mail não confirmado. Por favor, verifique sua caixa de entrada.';
        }
        return { success: false, error: friendlyMessage };
      }

      if (!data.user || !data.session) {
        return { success: false, error: 'Não foi possível iniciar a sessão com o servidor.' };
      }

      // Garante perfil e configurações criadas no banco
      await this.ensureUserProfileAndSettings(data.user);

      return {
        success: true,
        data: { user: data.user, session: data.session }
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Falha de conexão com o serviço de autenticação.'
      };
    }
  }

  /**
   * Cadastro de nova conta com e-mail e senha
   */
  static async signUp(email: string, password: string, name?: string): Promise<AuthResponse<{ user: User | null; session: Session | null; confirmationRequired: boolean }>> {
    const configStatus = getSupabaseConfigStatus();
    if (!configStatus.isConfigured || !supabase) {
      return {
        success: false,
        error: configStatus.error || 'Configuração do Supabase indisponível.'
      };
    }

    try {
      const userName = name?.trim() || email.split('@')[0];
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: userName
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Se a sessão já veio ativa (auto-confirm ligado), garante o perfil
        if (data.session) {
          await this.ensureUserProfileAndSettings(data.user, userName);
        }

        return {
          success: true,
          data: {
            user: data.user,
            session: data.session,
            confirmationRequired: !data.session
          }
        };
      }

      return { success: false, error: 'Não foi possível concluir o cadastro.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Falha ao comunicar com o servidor de autenticação.' };
    }
  }

  /**
   * Encerramento da sessão ativa
   */
  static async signOut(): Promise<AuthResponse> {
    if (!supabase) return { success: true };
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('[AuthService] Aviso no encerramento de sessão:', error.message);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  /**
   * Observador de alterações de estado de autenticação (onAuthStateChange)
   */
  static onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /**
   * Envio de e-mail para recuperação de senha
   */
  static async resetPasswordForEmail(email: string): Promise<AuthResponse> {
    if (!supabase) {
      return { success: false, error: 'Supabase não configurado.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erro ao solicitar redefinição.' };
    }
  }

  /**
   * Busca ou cria o registro em profiles e user_settings para o usuário autenticado.
   * O usuário só tem acesso aos seus próprios dados conforme as regras RLS do Supabase.
   */
  static async ensureUserProfileAndSettings(user: User, fallbackName?: string): Promise<UserProfileBundle> {
    if (!supabase) {
      return { profile: null, settings: null };
    }

    const userId = user.id;
    let userProfile: ProfileRow | null = null;
    let userSettings: UserSettingsRow | null = null;

    try {
      // 1. Busca perfil existente
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileData) {
        userProfile = profileData as ProfileRow;
      } else if (!profileErr || profileErr.code === 'PGRST116') {
        // Perfil não existe ainda: cria o perfil inicial
        const initialName = fallbackName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Discípulo';
        const { data: newProfile, error: insertErr } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: initialName,
            email: user.email ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
            spiritual_focus: 'Intimidade com Deus e Discernimento',
            life_season: 'Busca por Sabedoria e Constância',
            daily_prayer_goal_minutes: 15,
            daily_bible_chapters_goal: 2,
            weekly_fasting_goal_days: 1,
            preferred_bible_version: 'NVI',
            wake_up_time: '06:30',
            bed_time: '23:00',
            preferred_practice_duration_minutes: 15,
            bible_experience_level: 'iniciante',
            reading_frequency: 'diaria',
            prayer_frequency: 'uma_dia',
            reading_preference: 'capitulo_a_capitulo',
            prayer_preference: 'caderno_guiado',
            routine_preference: 'manha_focada'
          })
          .select()
          .single();

        if (insertErr) {
          console.warn('[AuthService] Aviso ao inicializar perfil:', insertErr.message);
        } else {
          userProfile = newProfile as ProfileRow;
        }
      }

      // 2. Busca ou cria user_settings
      const { data: settingsData, error: settingsErr } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (settingsData) {
        userSettings = settingsData as UserSettingsRow;
      } else if (!settingsErr || settingsErr.code === 'PGRST116') {
        const { data: newSettings, error: insertSetErr } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            theme: 'system',
            reminders_enabled: true,
            auto_sync: true,
            available_time_slots: ['Manhã (06:00 - 08:00)', 'Noite (21:00 - 22:30)'],
            available_days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            topics_of_interest: ['Paz', 'Sabedoria', 'Oração', 'Fé']
          })
          .select()
          .single();

        if (insertSetErr) {
          console.warn('[AuthService] Aviso ao inicializar configurações:', insertSetErr.message);
        } else {
          userSettings = newSettings as UserSettingsRow;
        }
      }
    } catch (err: any) {
      console.warn('[AuthService] Erro ao sincronizar perfil do usuário com Supabase:', err?.message);
    }

    return { profile: userProfile, settings: userSettings };
  }

  /**
   * Atualiza os dados do perfil do usuário autenticado no Supabase
   */
  static async updateProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>): Promise<AuthResponse<ProfileRow>> {
    if (!supabase) return { success: false, error: 'Supabase não configurado.' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data: data as ProfileRow };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }
}
