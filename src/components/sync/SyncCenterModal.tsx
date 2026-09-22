import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Database, 
  Download, 
  Upload, 
  ShieldCheck, 
  Copy, 
  Check, 
  Key, 
  Wifi, 
  WifiOff, 
  FileText, 
  History, 
  X, 
  Play,
  RotateCcw,
  User,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { SyncEngine } from '../../services/syncEngine';
import { SupabaseService } from '../../services/supabaseService';
import { BackupService } from '../../services/backupService';
import { FaithionStorageService } from '../../services/storage';
import { 
  SupabaseSyncMetadata, 
  SupabaseConfig, 
  SupabaseUserSession, 
  LocalSnapshot, 
  OfflineTestReport,
  FaithionBackupPayload 
} from '../../types';

interface SyncCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const SyncCenterModal: React.FC<SyncCenterModalProps> = ({
  isOpen,
  onClose,
  onDataRestored
}) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'supabase' | 'backup' | 'snapshots'>('sync');
  const [meta, setMeta] = useState<SupabaseSyncMetadata>(SyncEngine.getMetadata());
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(SyncEngine.isSimulatingOffline());
  const [isSyncingNow, setIsSyncingNow] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Supabase Config State
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(SupabaseService.getConfig());
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSQL, setCopiedSQL] = useState<boolean>(false);

  // Auth State
  const [userSession, setUserSession] = useState<SupabaseUserSession>({ user: null, accessToken: null, isAnonymous: true });
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authName, setAuthName] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authFeedback, setAuthFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Backup & Restore State
  const [snapshots, setSnapshots] = useState<LocalSnapshot[]>([]);
  const [importInspection, setImportInspection] = useState<{
    isValid: boolean;
    error?: string;
    payload?: FaithionBackupPayload;
    summary?: any;
  } | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Test Runner State
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [testReport, setTestReport] = useState<OfflineTestReport | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Assina atualizações do motor de sincronização
    const unsubscribe = SyncEngine.subscribe((updatedMeta) => {
      setMeta(updatedMeta);
    });

    // Carrega sessão do Supabase
    SupabaseService.getSession().then(setUserSession);

    // Carrega snapshots
    setSnapshots(BackupService.getLocalSnapshots());

    // Atualiza estado de simulação
    setIsSimulatingOffline(SyncEngine.isSimulatingOffline());

    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Handlers de Sincronização ---
  const handleTriggerSync = async () => {
    setIsSyncingNow(true);
    setSyncFeedback(null);
    try {
      const res = await SyncEngine.syncNow();
      setSyncFeedback({
        type: res.success ? 'success' : 'error',
        message: res.message
      });
    } catch (e: any) {
      setSyncFeedback({
        type: 'error',
        message: e?.message || 'Erro ao sincronizar'
      });
    } finally {
      setIsSyncingNow(false);
    }
  };

  const handleToggleOfflineSimulation = (value: boolean) => {
    SyncEngine.setSimulatingOffline(value);
    setIsSimulatingOffline(value);
    setSyncFeedback({
      type: 'info',
      message: value 
        ? 'Modo offline simulado ativado! As alterações serão guardadas localmente.' 
        : 'Modo offline simulado desativado! Tentando reconexão e sincronização...'
    });
  };

  // --- Handlers do Teste de Resiliência ---
  const handleRunResilienceTest = async () => {
    setIsRunningTest(true);
    setTestReport(null);
    try {
      const report = await SyncEngine.runResilienceSelfTest(() => {
        // Cria uma atividade de rotina de teste
        const testActivity = FaithionStorageService.addRoutineActivity({
          name: `Teste Resiliência Local (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
          type: 'prayer',
          block: 'morning',
          suggestedTime: '07:00',
          estimatedMinutes: 10,
          priority: 'media',
          why: 'Verificação automatizada de resiliência local-first',
          isActive: true
        });

        // E também registra um log de execução histórico
        FaithionStorageService.logActivityExecution({
          activityId: testActivity.id,
          activityName: testActivity.name,
          block: 'morning',
          date: new Date().toISOString().split('T')[0],
          status: 'concluido',
          actualMinutes: 10,
          plannedMinutes: 10,
          quickReflection: 'Log gerado durante teste automatizado de resiliência local-first.'
        });

        return { id: testActivity.id, title: testActivity.name };
      });

      setTestReport(report);
      if (onDataRestored) onDataRestored();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRunningTest(false);
    }
  };

  // --- Handlers do Supabase ---
  const handleSaveSupabaseConfig = () => {
    const updated = SupabaseService.saveConfig(supabaseConfig);
    setSupabaseConfig(updated);
    setConnectionResult({
      success: true,
      message: 'Configurações do Supabase atualizadas localmente!'
    });
  };

  const handleTestSupabase = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    const result = await SupabaseService.testConnection(supabaseConfig.url, supabaseConfig.anonKey);
    setConnectionResult(result);
    setTestingConnection(false);
  };

  const handleCopySQL = () => {
    const sql = SupabaseService.getSupabaseSchemaSQL();
    navigator.clipboard.writeText(sql);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthFeedback(null);

    if (authMode === 'signup') {
      const res = await SupabaseService.signUp(authEmail, authPassword, authName);
      if (res.success && res.session) {
        setUserSession(res.session);
        setAuthFeedback({ success: true, message: 'Conta criada e conectada com sucesso!' });
      } else {
        setAuthFeedback({ success: res.success, message: res.error || 'Cadastro realizado. Verifique seu e-mail se necessário.' });
      }
    } else {
      const res = await SupabaseService.signIn(authEmail, authPassword);
      if (res.success && res.session) {
        setUserSession(res.session);
        setAuthFeedback({ success: true, message: 'Login realizado com sucesso!' });
      } else {
        setAuthFeedback({ success: false, message: res.error || 'Falha ao autenticar.' });
      }
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await SupabaseService.signOut();
    setUserSession({ user: null, accessToken: null, isAnonymous: true });
    setAuthFeedback({ success: true, message: 'Desconectado da conta na nuvem. Seus dados locais permanecem intactos.' });
  };

  // --- Handlers de Backup & Importação ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const inspection = BackupService.inspectBackupJSON(content);
      setImportInspection(inspection);
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!importInspection?.payload) return;

    const res = BackupService.restoreBackup(importInspection.payload, importMode);
    setSyncFeedback({
      type: res.success ? 'success' : 'error',
      message: res.message
    });

    setImportInspection(null);
    setSnapshots(BackupService.getLocalSnapshots());
    if (onDataRestored) onDataRestored();
  };

  const handleCreateManualSnapshot = () => {
    BackupService.createLocalSnapshot('Snapshot Manual Criado pelo Usuário', 'manual');
    setSnapshots(BackupService.getLocalSnapshots());
    setSyncFeedback({
      type: 'success',
      message: 'Ponto de segurança local criado com sucesso!'
    });
  };

  const handleRestoreSnapshot = (id: string) => {
    const res = BackupService.restoreLocalSnapshot(id);
    setSyncFeedback({
      type: res.success ? 'success' : 'error',
      message: res.message
    });
    setSnapshots(BackupService.getLocalSnapshots());
    if (onDataRestored) onDataRestored();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="sync-center-modal"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-semibold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Persistência & Sincronização
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Local-First
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                LOCAL-FIRST → SINCRONIZAÇÃO → NUVEM • Totalmente funcional mesmo offline
              </p>
            </div>
          </div>
          <button
            id="close-sync-modal-button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem de Feedback Rápido */}
        {syncFeedback && (
          <div className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between ${
            syncFeedback.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-b border-emerald-500/20'
              : syncFeedback.type === 'error'
              ? 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-b border-rose-500/20'
              : 'bg-sky-500/10 text-sky-800 dark:text-sky-300 border-b border-sky-500/20'
          }`}>
            <span>{syncFeedback.message}</span>
            <button onClick={() => setSyncFeedback(null)} className="underline ml-2">Fechar</button>
          </div>
        )}

        {/* Abas de Navegação */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 bg-stone-100/50 dark:bg-stone-900/30 gap-2">
          <button
            id="tab-sync-status"
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'sync'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sincronização & Status
            {meta.pendingMutationsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {meta.pendingMutationsCount}
              </span>
            )}
          </button>

          <button
            id="tab-supabase-cloud"
            onClick={() => setActiveTab('supabase')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'supabase'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Supabase & Nuvem
            {supabaseConfig.isConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            id="tab-backup-restore"
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'backup'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Backup & Restauração
          </button>

          <button
            id="tab-local-snapshots"
            onClick={() => setActiveTab('snapshots')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'snapshots'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Snapshots de Segurança ({snapshots.length})
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ==========================================
              ABA 1: SINCRONIZAÇÃO & STATUS
             ========================================== */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              {/* Card de Estado Atual */}
              <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Estado Operacional
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                      meta.syncStatus === 'sincronizado'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : meta.syncStatus === 'sincronizando'
                        ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20'
                        : meta.syncStatus === 'erro'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {meta.syncStatus}
                    </span>
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">
                    {meta.syncStatus === 'sincronizado' && 'Seus dados locais estão sincronizados com a nuvem.'}
                    {meta.syncStatus === 'sincronizando' && 'Transmitindo mutações e sincronizando alterações...'}
                    {meta.syncStatus === 'offline' && 'Operando 100% no modo local. Nenhuma operação depende de rede.'}
                    {meta.syncStatus === 'erro' && (meta.lastErrorMessage || 'Falha transitória de comunicação com a nuvem.')}
                  </p>
                  <p className="text-xs text-stone-400">
                    Última sincronização: {meta.lastSyncedAt ? new Date(meta.lastSyncedAt).toLocaleString('pt-BR') : 'Nunca sincronizado na nuvem'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="sync-now-button"
                    onClick={handleTriggerSync}
                    disabled={isSyncingNow}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-spin' : ''}`} />
                    {isSyncingNow ? 'Sincronizando...' : 'Sincronizar Agora'}
                  </button>
                </div>
              </div>

              {/* Fila de Mutações Locais (Local-First Guarantee) */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Fila de Alterações Locais Pendentes
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 font-semibold text-stone-700 dark:text-stone-300">
                    {meta.pendingMutationsCount} pendência(s)
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Toda alteração que você faz (rotinas, orações, leitura bíblica, reflexões) é gravada <strong className="text-stone-900 dark:text-stone-100">imediatamente</strong> no banco de dados local. Quando a conexão estiver disponível e o Supabase configurado, as mutações são enviadas sem apagar histórico.
                </p>
                {meta.pendingMutationsCount > 0 && (
                  <div className="pt-2 flex items-center justify-between border-t border-stone-200 dark:border-stone-800">
                    <span className="text-xs text-stone-500">
                      As alterações serão sincronizadas assim que a rede estiver online.
                    </span>
                    <button
                      id="clear-queue-button"
                      onClick={() => SyncEngine.clearPendingMutations()}
                      className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 underline"
                    >
                      Limpar fila manualmente
                    </button>
                  </div>
                )}
              </div>

              {/* Alternador de Simulação Offline (Testar Conexão Indisponível) */}
              <div className="p-5 rounded-xl border border-amber-200/60 dark:border-amber-900/30 bg-amber-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      {isSimulatingOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
                      Simulador de Modo Offline
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Permite testar o comportamento do aplicativo com a conexão indisponível.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="toggle-offline-simulation"
                      type="checkbox"
                      checked={isSimulatingOffline}
                      onChange={(e) => handleToggleOfflineSimulation(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>

              {/* Botão para Teste Automatizado de Resiliência */}
              <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <Play className="w-4 h-4 text-amber-600" />
                      Teste Automatizado de Resiliência Local-First
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Executa automaticamente: entrar em modo offline → criar atividade → reconectar → sincronizar → validar histórico intacto.
                    </p>
                  </div>
                  <button
                    id="run-resilience-test-button"
                    onClick={handleRunResilienceTest}
                    disabled={isRunningTest}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunningTest ? 'animate-spin' : ''}`} />
                    {isRunningTest ? 'Executando teste...' : 'Executar Teste'}
                  </button>
                </div>

                {/* Relatório do Teste */}
                {testReport && (
                  <div className="mt-3 p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        Relatório do Teste de Resiliência
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                        testReport.success ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-700'
                      }`}>
                        {testReport.success ? 'Aprovado' : 'Atenção'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {testReport.steps.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          {s.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                          {s.status === 'fail' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                          <div>
                            <p className="font-semibold text-stone-800 dark:text-stone-200">{s.step}</p>
                            <p className="text-stone-500 dark:text-stone-400 text-[11px]">{s.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              ABA 2: SUPABASE & NUVEM
             ========================================== */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              {/* Visão Geral da Conexão */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${supabaseConfig.isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {supabaseConfig.isConfigured ? 'Supabase Conectado' : 'Supabase Pendente de Configuração'}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {supabaseConfig.isConfigured 
                        ? 'Sincronização em nuvem e autenticação ativas.' 
                        : 'Você pode usar o app offline ou inserir as credenciais abaixo.'}
                    </p>
                  </div>
                </div>
                <button
                  id="test-supabase-connection-button"
                  onClick={handleTestSupabase}
                  disabled={testingConnection || !supabaseConfig.url}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  Testar Conexão
                </button>
              </div>

              {connectionResult && (
                <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  connectionResult.success 
                    ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                }`}>
                  {connectionResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  {connectionResult.message}
                </div>
              )}

              {/* Formulário de Configuração */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  Credenciais do Projeto Supabase
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Insira a URL e a Anon Public Key do seu projeto Supabase. Estas credenciais são armazenadas localmente no seu dispositivo.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      URL do Projeto Supabase
                    </label>
                    <input
                      id="supabase-url-input"
                      type="text"
                      value={supabaseConfig.url}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                      placeholder="https://seu-projeto.supabase.co"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Chave Pública Anon (anon key)
                    </label>
                    <input
                      id="supabase-anon-key-input"
                      type="password"
                      value={supabaseConfig.anonKey}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      id="save-supabase-config-button"
                      onClick={handleSaveSupabaseConfig}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      Salvar Configurações
                    </button>
                  </div>
                </div>
              </div>

              {/* Autenticação Supabase */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Conta & Autenticação
                    </h3>
                  </div>
                  {userSession.user && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Conectado
                    </span>
                  )}
                </div>

                {userSession.user ? (
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {userSession.user.name || 'Usuário'}
                      </p>
                      <p className="text-xs text-stone-500">
                        {userSession.user.email}
                      </p>
                    </div>
                    <button
                      id="supabase-signout-button"
                      onClick={handleSignOut}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Desconectar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="space-y-3">
                    <div className="flex gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className={`text-xs font-medium pb-1 ${authMode === 'login' ? 'text-amber-600 font-bold border-b-2 border-amber-600' : 'text-stone-400'}`}
                      >
                        Fazer Login
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`text-xs font-medium pb-1 ${authMode === 'signup' ? 'text-amber-600 font-bold border-b-2 border-amber-600' : 'text-stone-400'}`}
                      >
                        Criar Conta
                      </button>
                    </div>

                    {authFeedback && (
                      <div className={`p-2.5 rounded-lg text-xs ${authFeedback.success ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-800 dark:text-rose-300'}`}>
                        {authFeedback.message}
                      </div>
                    )}

                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Nome Completo
                        </label>
                        <input
                          id="auth-name-input"
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Seu nome"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        E-mail
                      </label>
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Senha
                      </label>
                      <input
                        id="auth-password-input"
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
                      />
                    </div>

                    <button
                      id="auth-submit-button"
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      {authLoading ? 'Processando...' : authMode === 'login' ? 'Entrar na Conta' : 'Criar Conta Gratuita'}
                    </button>
                  </form>
                )}
              </div>

              {/* Botão para Copiar Schema SQL do Supabase */}
              <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Schema SQL do Supabase (PostgreSQL + RLS)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Crie todas as 13 tabelas e regras de segurança (Row Level Security) com 1 clique no SQL Editor do Supabase.
                    </p>
                  </div>
                  <button
                    id="copy-supabase-sql-button"
                    onClick={handleCopySQL}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    {copiedSQL ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedSQL ? 'Copiado!' : 'Copiar SQL'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              ABA 3: BACKUP & RESTAURAÇÃO
             ========================================== */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Painel de Exportação */}
              <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-600" />
                      Exportar Backup Completo (Arquivo JSON)
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Gera um arquivo seguro contendo todos os 13 domínios: perfil, objetivos, rotina, bíblia, planos, progresso, oração, jejum, reflexões, histórico, favoritos, notas e configurações.
                    </p>
                  </div>
                  <button
                    id="download-backup-button"
                    onClick={() => BackupService.exportBackupToFile()}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Backup
                  </button>
                </div>
              </div>

              {/* Painel de Importação */}
              <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-600" />
                    Restaurar a Partir de um Arquivo
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Selecione um arquivo de backup do Faithion (.json) para restaurar seus dados.
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />

                <button
                  id="select-backup-file-button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 flex flex-col items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-5 h-5 text-stone-400" />
                  <span>Clique para selecionar o arquivo de backup (.json)</span>
                </button>

                {/* Pré-visualização & Inspeção do Arquivo */}
                {importInspection && (
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3 animate-in fade-in">
                    {importInspection.isValid ? (
                      <>
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                            Backup Válido • Exportado em {new Date(importInspection.summary.exportedAt).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold">
                            Versão {importInspection.summary.version}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {Object.entries(importInspection.summary.counts || {}).map(([key, count]: any) => (
                            <div key={key} className="p-2 rounded bg-white dark:bg-stone-800/80 border border-stone-100 dark:border-stone-800">
                              <span className="text-stone-400 text-[10px] uppercase block">{key}</span>
                              <span className="font-bold text-stone-800 dark:text-stone-100">{count} itens</span>
                            </div>
                          ))}
                        </div>

                        {/* Escolha do Modo de Restauração */}
                        <div className="pt-2 space-y-2">
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                            Método de Restauração:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setImportMode('merge')}
                              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                                importMode === 'merge'
                                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/20 text-stone-900 dark:text-stone-100 font-semibold'
                                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                              }`}
                            >
                              <div className="font-bold">Mesclar (Recomendado)</div>
                              <div className="text-[11px] text-stone-500 mt-0.5">Combina com os dados atuais sem apagar históricos existentes.</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setImportMode('replace')}
                              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                                importMode === 'replace'
                                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/20 text-stone-900 dark:text-stone-100 font-semibold'
                                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                              }`}
                            >
                              <div className="font-bold">Substituição Segura</div>
                              <div className="text-[11px] text-stone-500 mt-0.5">Cria um ponto de restauração automático prévio antes de aplicar.</div>
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setImportInspection(null)}
                            className="px-3 py-2 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                          >
                            Cancelar
                          </button>
                          <button
                            id="confirm-restore-button"
                            onClick={handleApplyRestore}
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-sm"
                          >
                            Confirmar & Restaurar Dados
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-rose-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{importInspection.error || 'Arquivo de backup inválido.'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              ABA 4: SNAPSHOTS LOCAIS DE SEGURANÇA
             ========================================== */}
          {activeTab === 'snapshots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-600" />
                    Pontos de Segurança Locais
                  </h3>
                  <p className="text-xs text-stone-500">
                    Snapshots salvos no dispositivo antes de operações críticas ou criados manualmente.
                  </p>
                </div>
                <button
                  id="create-manual-snapshot-button"
                  onClick={handleCreateManualSnapshot}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Criar Ponto Agora
                </button>
              </div>

              {snapshots.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                  Nenhum snapshot de segurança registrado ainda.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {snap.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 uppercase font-semibold">
                            {snap.type}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          {new Date(snap.timestamp).toLocaleString('pt-BR')} • {snap.itemsCountSummary}
                        </p>
                      </div>

                      <button
                        id={`restore-snapshot-${snap.id}`}
                        onClick={() => handleRestoreSnapshot(snap.id)}
                        className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-semibold transition-colors shrink-0"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-between text-xs text-stone-500">
          <span>FAITHION Storage Engine • Resiliência & Preservação Histórica</span>
          <button
            id="close-sync-footer-button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
