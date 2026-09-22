/**
 * FAITHION — Utilitários Comuns para Repositórios Supabase
 * Tratamento consistente de erros e resiliência Local-First.
 */

import { supabase, getSupabaseConfigStatus } from '../../lib/supabase';
import { AuthService } from '../../lib/auth/authService';

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
  isFromLocal: boolean;
  errorCode?: 'NO_ENV' | 'NO_AUTH' | 'SESSION_EXPIRED' | 'NETWORK_ERROR' | 'DB_ERROR';
}

export async function getCurrentAuthenticatedUserId(): Promise<string | null> {
  if (!supabase) return null;
  const session = await AuthService.getCurrentSession();
  return session?.user?.id ?? null;
}

export function parseSupabaseError(err: any, fallbackMessage: string): { message: string; code: RepoResult<any>['errorCode'] } {
  const status = getSupabaseConfigStatus();
  if (!status.isConfigured) {
    return {
      message: status.error || 'Configuração Supabase ausente.',
      code: 'NO_ENV'
    };
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      message: 'Dispositivo sem conexão com a internet. Os dados foram preservados localmente.',
      code: 'NETWORK_ERROR'
    };
  }

  const rawMessage = err?.message || String(err || '');

  if (rawMessage.includes('JWT expired') || rawMessage.includes('token is expired')) {
    return {
      message: 'Sua sessão expirou. Por favor, faça login novamente.',
      code: 'SESSION_EXPIRED'
    };
  }

  if (rawMessage.includes('Failed to fetch') || rawMessage.includes('NetworkError') || rawMessage.includes('network')) {
    return {
      message: 'Falha de comunicação com o Supabase. Utilizando dados locais.',
      code: 'NETWORK_ERROR'
    };
  }

  if (rawMessage.includes('row-level security') || rawMessage.includes('RLS')) {
    return {
      message: 'Acesso negado pelas políticas de segurança do banco (RLS). Apenas os seus próprios dados podem ser acessados.',
      code: 'DB_ERROR'
    };
  }

  return {
    message: rawMessage || fallbackMessage,
    code: 'DB_ERROR'
  };
}
