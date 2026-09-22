import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService, AuthResponse } from './authService';
import { ProfileRow, UserSettingsRow } from '../../types/database';
import { getSupabaseConfigStatus, SupabaseConfigStatus } from '../supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  userSettings: UserSettingsRow | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  configStatus: SupabaseConfigStatus;
  signIn: (email: string, pass: string) => Promise<AuthResponse<{ user: User; session: Session }>>;
  signUp: (email: string, pass: string, name?: string) => Promise<AuthResponse<{ user: User | null; session: Session | null; confirmationRequired: boolean }>>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettingsRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<SupabaseConfigStatus>(() => getSupabaseConfigStatus());

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setUserSettings(null);
      return;
    }
    try {
      const bundle = await AuthService.ensureUserProfileAndSettings(user);
      setProfile(bundle.profile);
      setUserSettings(bundle.settings);
    } catch (err: any) {
      console.warn('[AuthProvider] Erro ao atualizar perfil:', err?.message);
    }
  }, [user]);

  // Inicialização da sessão e observação em tempo real de mudanças de auth
  useEffect(() => {
    let isMounted = true;
    const currentConfig = getSupabaseConfigStatus();
    setConfigStatus(currentConfig);

    if (!currentConfig.isConfigured) {
      setIsLoading(false);
      return;
    }

    async function initAuth() {
      try {
        const initialSession = await AuthService.getCurrentSession();
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            const bundle = await AuthService.ensureUserProfileAndSettings(initialSession.user);
            if (isMounted) {
              setProfile(bundle.profile);
              setUserSettings(bundle.settings);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setAuthError(err?.message || 'Falha ao recuperar sessão.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Inscrição em onAuthStateChange
    const { data: authListener } = AuthService.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      setUser(newUser);

      if (newUser) {
        const bundle = await AuthService.ensureUserProfileAndSettings(newUser);
        if (isMounted) {
          setProfile(bundle.profile);
          setUserSettings(bundle.settings);
        }
      } else {
        setProfile(null);
        setUserSettings(null);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    setAuthError(null);
    const res = await AuthService.signInWithPassword(email, pass);
    if (res.success && res.data) {
      setUser(res.data.user);
      setSession(res.data.session);
      const bundle = await AuthService.ensureUserProfileAndSettings(res.data.user);
      setProfile(bundle.profile);
      setUserSettings(bundle.settings);
    } else if (res.error) {
      setAuthError(res.error);
    }
    return res;
  };

  const signUp = async (email: string, pass: string, name?: string) => {
    setAuthError(null);
    const res = await AuthService.signUp(email, pass, name);
    if (res.success && res.data?.user && res.data.session) {
      setUser(res.data.user);
      setSession(res.data.session);
      const bundle = await AuthService.ensureUserProfileAndSettings(res.data.user, name);
      setProfile(bundle.profile);
      setUserSettings(bundle.settings);
    } else if (res.error) {
      setAuthError(res.error);
    }
    return res;
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserSettings(null);
    setAuthError(null);
  };

  const clearError = () => setAuthError(null);

  const value = useMemo<AuthContextType>(() => ({
    user,
    session,
    profile,
    userSettings,
    isLoading,
    isAuthenticated: Boolean(user && session),
    authError,
    configStatus,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    clearError
  }), [user, session, profile, userSettings, isLoading, authError, configStatus, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
