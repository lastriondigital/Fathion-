/**
 * FAITHION — Cliente Supabase Centralizado e Reutilizável
 * 
 * Regras de Segurança:
 * - Utiliza APENAS chaves públicas (publishable_key / anon_key).
 * - NUNCA utiliza service_role ou secret key no frontend.
 * - Valida a existência das variáveis e emite alertas claros em vez de falhas silenciosas.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// 1. Obtenção das variáveis de ambiente com prioridade solicitada
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
// Aceita VITE_SUPABASE_PUBLISHABLE_KEY (recomendado) ou fallback VITE_SUPABASE_ANON_KEY
const envPublishableKey = (
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
) as string | undefined;

// Fallback opcional para configurações salvas pelo usuário no localStorage
let storedUrl: string | undefined;
let storedKey: string | undefined;
try {
  const localConfig = localStorage.getItem('faithion_supabase_config_v1');
  if (localConfig) {
    const parsed = JSON.parse(localConfig);
    storedUrl = parsed.url;
    storedKey = parsed.anonKey;
  }
} catch {}

export const supabaseUrl = envUrl || storedUrl || '';
export const supabasePublishableKey = envPublishableKey || storedKey || '';

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  hasKey: boolean;
  error: string | null;
}

/**
 * Validação segura das credenciais do Supabase
 */
export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const hasUrl = Boolean(supabaseUrl && supabaseUrl.trim().length > 0);
  const hasKey = Boolean(supabasePublishableKey && supabasePublishableKey.trim().length > 0);

  if (!hasUrl && !hasKey) {
    return {
      isConfigured: false,
      hasUrl: false,
      hasKey: false,
      error: 'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY não foram configuradas. O aplicativo está operando em modo local-first resiliente.'
    };
  }

  if (!hasUrl) {
    return {
      isConfigured: false,
      hasUrl: false,
      hasKey,
      error: 'Variável VITE_SUPABASE_URL ausente. Verifique seu arquivo de variáveis de ambiente.'
    };
  }

  if (!hasKey) {
    return {
      isConfigured: false,
      hasUrl,
      hasKey: false,
      error: 'Variável VITE_SUPABASE_PUBLISHABLE_KEY (ou VITE_SUPABASE_ANON_KEY) ausente. Verifique suas credenciais públicas do Supabase.'
    };
  }

  return {
    isConfigured: true,
    hasUrl: true,
    hasKey: true,
    error: null
  };
}

const status = getSupabaseConfigStatus();
if (!status.isConfigured) {
  console.info(`[FAITHION Supabase] Modo Local-First Ativo: ${status.error}`);
}

/**
 * Instância única e tipada do Supabase Client para uso em toda a aplicação.
 * Se as variáveis estiverem ausentes, o cliente é inicializado com fallback seguro
 * para não quebrar a aplicação ao importar, permitindo que a camada de repositórios
 * e serviços desvie elegantemente para o armazenamento local sem quebras.
 */
let client: SupabaseClient<Database> | null = null;

if (status.isConfigured) {
  try {
    client = createClient<Database>(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'faithion_supabase_auth_token'
      }
    });
  } catch (err) {
    console.error('[FAITHION Supabase] Erro ao instanciar createClient:', err);
  }
}

export const supabase = client;

/**
 * Retorna o cliente ativo se configurado, ou lança um erro amigável se chamado em operação que requer nuvem
 */
export function getRequiredSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    const currentStatus = getSupabaseConfigStatus();
    throw new Error(currentStatus.error || 'Cliente Supabase não está configurado.');
  }
  return supabase;
}
