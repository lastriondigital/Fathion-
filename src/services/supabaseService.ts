/**
 * FAITHION — Serviço de Integração Supabase
 * Prioridade: LOCAL-FIRST → SINCRONIZAÇÃO → NUVEM
 * 
 * Funciona de forma 100% resiliente:
 * Se as chaves do Supabase não estiverem configuradas ou o dispositivo estiver offline,
 * o app continua operando perfeitamente sem travar ou gerar erros no console.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig, SupabaseUserSession, FaithionBackupPayload } from '../types';

const STORAGE_KEY_CONFIG = 'faithion_supabase_config_v1';
const STORAGE_KEY_SESSION = 'faithion_supabase_session_v1';

export class SupabaseService {
  private static clientInstance: SupabaseClient | null = null;
  private static currentConfig: SupabaseConfig | null = null;

  /**
   * Obtém as credenciais ativas do Supabase:
   * 1º do localStorage
   * 2º das variáveis de ambiente (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
   */
  static getConfig(): SupabaseConfig {
    if (this.currentConfig) return this.currentConfig;

    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved) as SupabaseConfig;
        if (parsed.url && parsed.anonKey) {
          this.currentConfig = {
            ...parsed,
            isConfigured: true
          };
          return this.currentConfig;
        }
      }
    } catch (e) {
      console.warn('[SupabaseService] Erro ao ler configuração local:', e);
    }

    // Tenta variáveis de ambiente do Vite (prioriza VITE_SUPABASE_PUBLISHABLE_KEY com fallback para VITE_SUPABASE_ANON_KEY)
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const envKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

    this.currentConfig = {
      url: envUrl,
      anonKey: envKey,
      isConfigured: Boolean(envUrl && envKey),
      autoSyncIntervalMinutes: 5
    };

    return this.currentConfig;
  }

  /**
   * Salva novas credenciais do Supabase
   */
  static saveConfig(config: Partial<SupabaseConfig>): SupabaseConfig {
    const current = this.getConfig();
    const updated: SupabaseConfig = {
      ...current,
      ...config,
      isConfigured: Boolean((config.url ?? current.url) && (config.anonKey ?? current.anonKey))
    };

    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
    } catch (e) {
      console.error('[SupabaseService] Falha ao salvar configuração:', e);
    }

    this.currentConfig = updated;
    this.clientInstance = null; // Força reinicialização do cliente
    return updated;
  }

  /**
   * Obtém a instância do cliente Supabase de forma segura (Lazy Singleton)
   */
  static getClient(): SupabaseClient | null {
    const config = this.getConfig();
    if (!config.isConfigured || !config.url || !config.anonKey) {
      return null;
    }

    if (!this.clientInstance) {
      try {
        this.clientInstance = createClient(config.url, config.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            storageKey: 'faithion_supabase_auth_token'
          }
        });
      } catch (err) {
        console.warn('[SupabaseService] Não foi possível inicializar cliente Supabase:', err);
        return null;
      }
    }

    return this.clientInstance;
  }

  /**
   * Testa a conectividade com o Supabase fornecido
   */
  static async testConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
    const testUrl = url || this.getConfig().url;
    const testKey = anonKey || this.getConfig().anonKey;

    if (!testUrl || !testKey) {
      return {
        success: false,
        message: 'Por favor, informe a URL do projeto e a Chave Pública Anon.'
      };
    }

    try {
      const testClient = createClient(testUrl, testKey);
      // Tenta uma consulta simples de saúde
      const { data, error } = await testClient.auth.getSession();
      if (error && error.message && !error.message.includes('Auth session missing')) {
        return {
          success: false,
          message: `Falha na conexão: ${error.message}`
        };
      }
      return {
        success: true,
        message: 'Conexão com o Supabase estabelecida com sucesso!'
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Erro ao conectar: ${e?.message || 'Verifique sua URL e conexão com a internet.'}`
      };
    }
  }

  // ==========================================
  // AUTENTICAÇÃO
  // ==========================================

  /**
   * Obtém a sessão atual salva em cache ou no Supabase
   */
  static async getSession(): Promise<SupabaseUserSession> {
    const fallbackSession: SupabaseUserSession = {
      user: null,
      accessToken: null,
      isAnonymous: true
    };

    // Lê cache local primeiro para resposta instantânea offline
    try {
      const cached = localStorage.getItem(STORAGE_KEY_SESSION);
      if (cached) {
        const parsed = JSON.parse(cached) as SupabaseUserSession;
        if (parsed?.user) return parsed;
      }
    } catch {}

    const client = this.getClient();
    if (!client) return fallbackSession;

    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (error || !session) {
        return fallbackSession;
      }

      const userSession: SupabaseUserSession = {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          createdAt: session.user.created_at
        },
        accessToken: session.access_token,
        isAnonymous: false,
        sessionExpiry: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined
      };

      try {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(userSession));
      } catch {}

      return userSession;
    } catch {
      return fallbackSession;
    }
  }

  /**
   * Cadastrar novo usuário com e-mail e senha
   */
  static async signUp(email: string, pass: string, name?: string): Promise<{ success: boolean; error?: string; session?: SupabaseUserSession }> {
    const client = this.getClient();
    if (!client) {
      return {
        success: false,
        error: 'Supabase ainda não configurado. Insira a URL e a Anon Key nas configurações.'
      };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name || email.split('@')[0]
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        const userSession: SupabaseUserSession = {
          user: {
            id: data.user!.id,
            email: data.user!.email,
            name: name || data.user!.email?.split('@')[0],
            createdAt: data.user!.created_at
          },
          accessToken: data.session.access_token,
          isAnonymous: false
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(userSession));
        return { success: true, session: userSession };
      }

      return {
        success: true,
        error: 'Conta criada! Se necessário, confirme o e-mail cadastrado.'
      };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Erro ao realizar cadastro.' };
    }
  }

  /**
   * Entrar com e-mail e senha
   */
  static async signIn(email: string, pass: string): Promise<{ success: boolean; error?: string; session?: SupabaseUserSession }> {
    const client = this.getClient();
    if (!client) {
      return {
        success: false,
        error: 'Supabase ainda não configurado. Insira a URL e a Anon Key nas configurações.'
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password: pass
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        const userSession: SupabaseUserSession = {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            createdAt: data.user.created_at
          },
          accessToken: data.session.access_token,
          isAnonymous: false
        };
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(userSession));
        return { success: true, session: userSession };
      }

      return { success: false, error: 'Não foi possível obter sessão.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Erro ao fazer login.' };
    }
  }

  /**
   * Enviar e-mail de redefinição de senha
   */
  static async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const client = this.getClient();
    if (!client) {
      return { success: false, message: 'Supabase não configurado.' };
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true, message: 'Link de redefinição de senha enviado para seu e-mail.' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Erro ao solicitar redefinição.' };
    }
  }

  /**
   * Sair da conta (preserva os dados locais)
   */
  static async signOut(): Promise<void> {
    const client = this.getClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {}
    }
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }

  // ==========================================
  // BACKUP EM NUVEM
  // ==========================================

  /**
   * Faz upload de um snapshot completo de backup para a nuvem no Supabase
   */
  static async uploadCloudBackup(payload: FaithionBackupPayload): Promise<{ success: boolean; message: string }> {
    const client = this.getClient();
    if (!client) {
      return { success: false, message: 'Supabase não configurado.' };
    }

    const session = await this.getSession();
    const userId = session.user?.id || 'anonymous';

    try {
      const { error } = await client
        .from('faithion_backups')
        .insert({
          user_id: userId,
          exported_at: payload.exportedAt,
          version: payload.version,
          checksum: payload.checksum,
          items_summary: payload.metadata.itemsCount,
          backup_payload: payload
        });

      if (error) {
        // Se a tabela não existir, retorna aviso instrutivo
        if (error.code === '42P01') {
          return {
            success: false,
            message: 'Tabela faithion_backups ainda não criada no Supabase. Execute o script SQL no painel do Supabase.'
          };
        }
        return { success: false, message: `Erro no backup: ${error.message}` };
      }

      return { success: true, message: 'Backup na nuvem realizado com sucesso!' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Falha ao enviar backup para o Supabase.' };
    }
  }

  /**
   * Lista backups salvos na nuvem para a conta do usuário
   */
  static async listCloudBackups(): Promise<{ id: string; exportedAt: string; version: string; itemsSummary: any }[]> {
    const client = this.getClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from('faithion_backups')
        .select('id, exported_at, version, items_summary')
        .order('exported_at', { ascending: false })
        .limit(10);

      if (error || !data) return [];
      return data.map((b: any) => ({
        id: b.id,
        exportedAt: b.exported_at,
        version: b.version,
        itemsSummary: b.items_summary
      }));
    } catch {
      return [];
    }
  }

  /**
   * Baixa um backup da nuvem por ID
   */
  static async downloadCloudBackup(backupId: string): Promise<FaithionBackupPayload | null> {
    const client = this.getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('faithion_backups')
        .select('backup_payload')
        .eq('id', backupId)
        .single();

      if (error || !data) return null;
      return data.backup_payload as FaithionBackupPayload;
    } catch {
      return null;
    }
  }

  // ==========================================
  // SCHEMA SQL PARA SUPABASE
  // ==========================================

  /**
   * Retorna o script SQL completo e pronto para ser executado no SQL Editor do Supabase
   */
  static getSupabaseSchemaSQL(): string {
    return `-- ==============================================================================
-- FAITHION — SCHEMA COMPLETO DE PERSISTÊNCIA & SINCRONIZAÇÃO SUPABASE (POSTGRESQL)
-- Modelo: LOCAL-FIRST → SINCRONIZAÇÃO COM ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Tabela de Perfil Espiritual
CREATE TABLE IF NOT EXISTS faithion_profiles (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  spiritual_focus TEXT,
  life_season TEXT,
  wake_up_time TEXT,
  bed_time TEXT,
  daily_prayer_goal_minutes INT,
  daily_bible_chapters_goal INT,
  preferred_bible_version TEXT,
  available_time_slots JSONB,
  available_days JSONB,
  topics_of_interest JSONB,
  reading_preference TEXT,
  prayer_preference TEXT,
  routine_preference TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Objetivos Espirituais
CREATE TABLE IF NOT EXISTS faithion_objectives (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_frequency TEXT NOT NULL,
  target_count INT DEFAULT 1,
  target_duration_minutes INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Atividades da Rotina
CREATE TABLE IF NOT EXISTS faithion_routine_activities (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  block TEXT NOT NULL,
  suggested_time TEXT,
  estimated_minutes INT NOT NULL,
  frequency_type TEXT NOT NULL,
  days_of_week JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  "order" INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela Imutável de Logs de Execução (NUNCA APAGAR HISTÓRICO)
CREATE TABLE IF NOT EXISTS faithion_execution_logs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT,
  activity_name TEXT NOT NULL,
  date DATE NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  actual_minutes INT,
  planned_minutes INT,
  reason TEXT,
  reason_note TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Pedidos de Oração
CREATE TABLE IF NOT EXISTS faithion_prayers (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  person TEXT,
  description TEXT,
  answered BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'em_oracao',
  answer TEXT,
  answered_date DATE,
  times_prayed INT DEFAULT 0,
  last_prayed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de Planos de Oração
CREATE TABLE IF NOT EXISTS faithion_prayer_plans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  focus TEXT NOT NULL,
  daily_minutes INT NOT NULL,
  preferred_time TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  recurrence_days JSONB,
  specific_requests JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabela de Planos de Leitura Bíblica
CREATE TABLE IF NOT EXISTS faithion_reading_plans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_days INT NOT NULL,
  current_day INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  frequency TEXT NOT NULL,
  plan_days JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabela de Sessões de Leitura Bíblica (Histórico de Leitura)
CREATE TABLE IF NOT EXISTS faithion_bible_reading_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  book_name TEXT NOT NULL,
  chapter INT NOT NULL,
  version_abbr TEXT,
  passage_ref TEXT NOT NULL,
  date DATE NOT NULL,
  duration_minutes INT,
  completed_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  related_plan_id TEXT
);

-- 9. Tabela de Reflexões Espirituais
CREATE TABLE IF NOT EXISTS faithion_reflections (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  passage TEXT,
  what_learned TEXT,
  what_caught_attention TEXT,
  how_to_apply TEXT,
  personal_prayer TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabela de Jejum
CREATE TABLE IF NOT EXISTS faithion_fasting_records (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  target_hours INT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'planejado',
  reflections TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Tabela de Práticas e Eventos Personalizados (Cultos, Estudos, Memorização)
CREATE TABLE IF NOT EXISTS faithion_practice_records (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  passage_ref TEXT,
  prayer_focus TEXT,
  reflection_notes TEXT,
  result_summary TEXT,
  duration_minutes INT,
  status TEXT NOT NULL,
  location_or_leader TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Tabela de Destaques, Favoritos e Notas Bíblicas
CREATE TABLE IF NOT EXISTS faithion_bible_notes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  book_name TEXT NOT NULL,
  chapter INT NOT NULL,
  verse_number INT,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faithion_bible_favorites (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  book_name TEXT NOT NULL,
  chapter INT NOT NULL,
  verse_number INT NOT NULL,
  verse_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Tabela de Backups na Nuvem
CREATE TABLE IF NOT EXISTS faithion_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exported_at TIMESTAMPTZ NOT NULL,
  version TEXT NOT NULL,
  checksum TEXT NOT NULL,
  items_summary JSONB,
  backup_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
ALTER TABLE faithion_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_routine_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_prayer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_bible_reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_fasting_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_practice_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_bible_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_bible_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE faithion_backups ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO: CADA USUÁRIO SÓ ACESSA SEUS PRÓPRIOS DADOS
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'faithion_profiles', 'faithion_objectives', 'faithion_routine_activities',
      'faithion_execution_logs', 'faithion_prayers', 'faithion_prayer_plans',
      'faithion_reading_plans', 'faithion_bible_reading_sessions', 'faithion_reflections',
      'faithion_fasting_records', 'faithion_practice_records', 'faithion_bible_notes',
      'faithion_bible_favorites', 'faithion_backups'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Usuário acessa seus dados" ON %I', tbl);
    EXECUTE format('CREATE POLICY "Usuário acessa seus dados" ON %I FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', tbl);
  END LOOP;
END $$;
`;
  }
}
