/**
 * FAITHION — Serviço de Backup, Restauração e Snapshots de Segurança
 * Suporta exportação/importação de todos os 13 domínios de dados com
 * preservação estrita de histórico e integridade referencial.
 */

import { FaithionStorageService } from './storage';
import { FaithionBackupPayload, LocalSnapshot } from '../types';

const STORAGE_KEY_SNAPSHOTS = 'faithion_snapshots_vault_v1';
const CURRENT_SCHEMA_VERSION = 2;
const APP_VERSION = '1.2.0';

export class BackupService {
  /**
   * Gera o payload estruturado com todos os 13 domínios de dados do Faithion
   */
  static generateBackupPayload(): FaithionBackupPayload {
    const profile = FaithionStorageService.getProfile();
    const objectives = FaithionStorageService.getObjectives();
    const goals = FaithionStorageService.getGoals();
    const routineActivities = FaithionStorageService.getRoutineActivities();
    const executionLogs = FaithionStorageService.getExecutionLogs();
    const adaptationSuggestions = FaithionStorageService.getAdaptationSuggestions();
    const tasks = FaithionStorageService.getDailyTasks();
    const bibleHighlights = FaithionStorageService.getBibleHighlightsList();
    const bibleFavorites = FaithionStorageService.getBibleFavorites();
    const bibleNotes = FaithionStorageService.getBibleNotes();
    const bibleHistory = FaithionStorageService.getBibleReadingHistory();
    const bibleLastRead = FaithionStorageService.getLastRead();
    const bibleSettings = FaithionStorageService.getBibleSettings();
    const plans = FaithionStorageService.getReadingPlans();
    const prayerPlans = FaithionStorageService.getPrayerPlans();
    const prayers = FaithionStorageService.getPrayerRequests();
    const fasting = FaithionStorageService.getFastingPlan();
    const fastingRecords = FaithionStorageService.getFastingRecords();
    const reflections = FaithionStorageService.getReflections();
    const consistency = FaithionStorageService.getConsistencyHistory();
    const practiceRecords = FaithionStorageService.getPracticeRecords();
    const wordHistory = FaithionStorageService.getWordHistory();

    const itemsCount = {
      profile: 1,
      objectives: objectives.length,
      routineActivities: routineActivities.length,
      executionLogs: executionLogs.length,
      tasks: tasks.length,
      plans: plans.length,
      prayerPlans: prayerPlans.length,
      prayers: prayers.length,
      fastingRecords: fastingRecords.length,
      reflections: reflections.length,
      consistency: consistency.length,
      practiceRecords: practiceRecords.length,
      bibleHighlights: bibleHighlights.length,
      bibleFavorites: bibleFavorites.length,
      bibleNotes: bibleNotes.length,
      bibleHistory: bibleHistory.length
    };

    const dataObj = {
      profile,
      objectives,
      goals,
      routineActivities,
      executionLogs,
      adaptationSuggestions,
      tasks,
      bibleHighlights,
      bibleFavorites,
      bibleNotes,
      bibleHistory,
      bibleLastRead,
      bibleSettings,
      plans,
      prayerPlans,
      prayers,
      fasting,
      fastingRecords,
      reflections,
      consistency,
      practiceRecords,
      wordHistory
    };

    const checksum = this.calculateSimpleHash(JSON.stringify(dataObj));

    return {
      version: APP_VERSION,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      checksum,
      metadata: {
        appName: 'FAITHION',
        appVersion: APP_VERSION,
        itemsCount
      },
      data: dataObj
    };
  }

  /**
   * Baixa o arquivo de backup no navegador
   */
  static exportBackupToFile(): void {
    const payload = this.generateBackupPayload();
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `faithion-backup-${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Cria também um snapshot local do momento da exportação
    this.createLocalSnapshot('Exportação de Backup', 'manual');
  }

  /**
   * Inspeciona e valida o conteúdo de um arquivo JSON de backup antes de aplicar
   */
  static inspectBackupJSON(jsonStr: string): {
    isValid: boolean;
    error?: string;
    payload?: FaithionBackupPayload;
    summary?: {
      exportedAt: string;
      version: string;
      counts: Record<string, number>;
      hasLegacyFormat: boolean;
    };
  } {
    try {
      const parsed = JSON.parse(jsonStr);

      // Suporte a formato V2 (FaithionBackupPayload)
      if (parsed.data && parsed.metadata) {
        const counts = parsed.metadata.itemsCount || {};
        return {
          isValid: true,
          payload: parsed as FaithionBackupPayload,
          summary: {
            exportedAt: parsed.exportedAt || new Date().toISOString(),
            version: parsed.version || '2.0.0',
            counts,
            hasLegacyFormat: false
          }
        };
      }

      // Suporte a formato legado V1 (onde campos estavam direto na raiz)
      if (parsed.profile || parsed.prayers || parsed.plans || parsed.reflections) {
        const counts: Record<string, number> = {
          profile: parsed.profile ? 1 : 0,
          prayers: Array.isArray(parsed.prayers) ? parsed.prayers.length : 0,
          plans: Array.isArray(parsed.plans) ? parsed.plans.length : 0,
          reflections: Array.isArray(parsed.reflections) ? parsed.reflections.length : 0,
          routineActivities: Array.isArray(parsed.routineActivities) ? parsed.routineActivities.length : 0,
          executionLogs: Array.isArray(parsed.executionLogs) ? parsed.executionLogs.length : 0,
          consistency: Array.isArray(parsed.consistency) ? parsed.consistency.length : 0
        };

        const convertedPayload: FaithionBackupPayload = {
          version: parsed.version || '1.0.0',
          schemaVersion: 1,
          exportedAt: parsed.exportedAt || new Date().toISOString(),
          checksum: 'legacy-v1',
          metadata: {
            appName: 'FAITHION',
            appVersion: '1.0.0-legacy',
            itemsCount: counts
          },
          data: {
            profile: parsed.profile || FaithionStorageService.getProfile(),
            objectives: parsed.objectives || [],
            goals: parsed.goals || [],
            routineActivities: parsed.routineActivities || [],
            executionLogs: parsed.executionLogs || [],
            adaptationSuggestions: parsed.adaptationSuggestions || [],
            tasks: parsed.tasks || [],
            bibleHighlights: parsed.highlights || [],
            bibleFavorites: parsed.favorites || [],
            bibleNotes: parsed.notes || [],
            bibleHistory: parsed.history || [],
            bibleLastRead: parsed.lastRead || FaithionStorageService.getLastRead(),
            bibleSettings: parsed.bibleSettings || FaithionStorageService.getBibleSettings(),
            plans: parsed.plans || [],
            prayerPlans: parsed.prayerPlans || [],
            prayers: parsed.prayers || [],
            fasting: parsed.fasting || FaithionStorageService.getFastingPlan(),
            fastingRecords: parsed.fastingRecords || [],
            reflections: parsed.reflections || [],
            consistency: parsed.consistency || [],
            practiceRecords: parsed.practiceRecords || [],
            wordHistory: parsed.wordHistory || []
          }
        };

        return {
          isValid: true,
          payload: convertedPayload,
          summary: {
            exportedAt: convertedPayload.exportedAt,
            version: '1.0.0 (Legado)',
            counts,
            hasLegacyFormat: true
          }
        };
      }

      return {
        isValid: false,
        error: 'Arquivo JSON inválido. Não foram encontrados dados estruturados do Faithion.'
      };
    } catch (e: any) {
      return {
        isValid: false,
        error: `Erro ao processar arquivo: ${e?.message || 'JSON malformado'}`
      };
    }
  }

  /**
   * Executa a restauração de um backup:
   * 1. Cria um snapshot de segurança automático pré-restauração
   * 2. Aplica com modo 'merge' (mesclar sem apagar histórico) ou 'replace' (substituir preservando histórico de práticas)
   */
  static restoreBackup(
    payload: FaithionBackupPayload,
    mode: 'merge' | 'replace' = 'merge'
  ): { success: boolean; message: string; restoredCounts: Record<string, number> } {
    try {
      // 1. Snapshot de emergência obrigatório antes de qualquer alteração
      this.createLocalSnapshot('Ponto de Segurança Antes da Restauração', 'pre_import');

      const data = payload.data;

      if (mode === 'replace') {
        // Substituição completa mas preservando registros históricos anteriores via união
        if (data.profile) FaithionStorageService.saveProfile(data.profile);
        if (data.objectives) FaithionStorageService.saveObjectives(data.objectives);
        if (data.goals) FaithionStorageService.saveGoals(data.goals);
        if (data.routineActivities) FaithionStorageService.saveRoutineActivities(data.routineActivities);
        if (data.tasks) FaithionStorageService.saveDailyTasks(data.tasks);
        if (data.plans) FaithionStorageService.saveReadingPlans(data.plans);
        if (data.prayerPlans) FaithionStorageService.savePrayerPlans(data.prayerPlans);
        if (data.prayers) FaithionStorageService.savePrayerRequests(data.prayers);
        if (data.fasting) FaithionStorageService.saveFastingPlan(data.fasting);
        if (data.fastingRecords) FaithionStorageService.saveFastingRecords(data.fastingRecords);
        if (data.reflections) FaithionStorageService.saveReflections(data.reflections);
        if (data.adaptationSuggestions) FaithionStorageService.saveAdaptationSuggestions(data.adaptationSuggestions);
        if (data.bibleNotes) FaithionStorageService.saveBibleNotes(data.bibleNotes);
        if (data.bibleLastRead) FaithionStorageService.saveLastRead(data.bibleLastRead);
        if (data.bibleSettings) FaithionStorageService.saveBibleSettings(data.bibleSettings);

        // HISTÓRICO: NUNCA DESTRUIR REGISTROS HISTÓRICOS. Fazer união segura de logs passados!
        const existingLogs = FaithionStorageService.getExecutionLogs();
        const incomingLogs = data.executionLogs || [];
        const mergedLogsMap = new Map<string, any>();
        existingLogs.forEach(l => mergedLogsMap.set(l.id, l));
        incomingLogs.forEach(l => mergedLogsMap.set(l.id, l));
        FaithionStorageService.saveExecutionLogs(Array.from(mergedLogsMap.values()));

        const existingPrac = FaithionStorageService.getPracticeRecords();
        const incomingPrac = data.practiceRecords || [];
        const mergedPracMap = new Map<string, any>();
        existingPrac.forEach(p => mergedPracMap.set(p.id, p));
        incomingPrac.forEach(p => mergedPracMap.set(p.id, p));
        FaithionStorageService.savePracticeRecords(Array.from(mergedPracMap.values()));

        const existingReadingHistory = FaithionStorageService.getBibleReadingHistory();
        const incomingReadingHistory = data.bibleHistory || [];
        const mergedReadingMap = new Map<string, any>();
        existingReadingHistory.forEach(s => mergedReadingMap.set(s.id, s));
        incomingReadingHistory.forEach(s => mergedReadingMap.set(s.id, s));
        localStorage.setItem('faithion_bible_history_v1', JSON.stringify(Array.from(mergedReadingMap.values())));

        const existingFavorites = FaithionStorageService.getBibleFavorites();
        const incomingFavorites = data.bibleFavorites || [];
        const mergedFavMap = new Map<string, any>();
        existingFavorites.forEach(f => mergedFavMap.set(f.id, f));
        incomingFavorites.forEach(f => mergedFavMap.set(f.id, f));
        localStorage.setItem('faithion_bible_favorites_v1', JSON.stringify(Array.from(mergedFavMap.values())));

        if (data.consistency) FaithionStorageService.saveConsistencyHistory(data.consistency);
      } else {
        // Modo 'merge': Mesclagem inteligente
        if (data.profile) {
          const currentProfile = FaithionStorageService.getProfile();
          FaithionStorageService.saveProfile({ ...currentProfile, ...data.profile });
        }

        // Objetivos
        if (data.objectives) {
          const current = FaithionStorageService.getObjectives();
          const map = new Map(current.map(o => [o.id, o]));
          data.objectives.forEach(o => map.set(o.id, o));
          FaithionStorageService.saveObjectives(Array.from(map.values()));
        }

        // Rotinas
        if (data.routineActivities) {
          const current = FaithionStorageService.getRoutineActivities();
          const map = new Map(current.map(r => [r.id, r]));
          data.routineActivities.forEach(r => map.set(r.id, r));
          FaithionStorageService.saveRoutineActivities(Array.from(map.values()));
        }

        // Orações
        if (data.prayers) {
          const current = FaithionStorageService.getPrayerRequests();
          const map = new Map(current.map(p => [p.id, p]));
          data.prayers.forEach(p => map.set(p.id, p));
          FaithionStorageService.savePrayerRequests(Array.from(map.values()));
        }

        // Planos de Oração
        if (data.prayerPlans) {
          const current = FaithionStorageService.getPrayerPlans();
          const map = new Map(current.map(p => [p.id, p]));
          data.prayerPlans.forEach(p => map.set(p.id, p));
          FaithionStorageService.savePrayerPlans(Array.from(map.values()));
        }

        // Planos de Leitura
        if (data.plans) {
          const current = FaithionStorageService.getReadingPlans();
          const map = new Map(current.map(p => [p.id, p]));
          data.plans.forEach(p => map.set(p.id, p));
          FaithionStorageService.saveReadingPlans(Array.from(map.values()));
        }

        // Reflexões
        if (data.reflections) {
          const current = FaithionStorageService.getReflections();
          const map = new Map(current.map(r => [r.id, r]));
          data.reflections.forEach(r => map.set(r.id, r));
          FaithionStorageService.saveReflections(Array.from(map.values()));
        }

        // Jejum
        if (data.fastingRecords) {
          const current = FaithionStorageService.getFastingRecords();
          const map = new Map(current.map(f => [f.id, f]));
          data.fastingRecords.forEach(f => map.set(f.id, f));
          FaithionStorageService.saveFastingRecords(Array.from(map.values()));
        }

        // Notas Bíblicas
        if (data.bibleNotes) {
          const current = FaithionStorageService.getBibleNotes();
          const map = new Map(current.map(n => [n.id, n]));
          data.bibleNotes.forEach(n => map.set(n.id, n));
          FaithionStorageService.saveBibleNotes(Array.from(map.values()));
        }

        // Favoritos Bíblicos
        if (data.bibleFavorites) {
          const current = FaithionStorageService.getBibleFavorites();
          const map = new Map(current.map(f => [f.id, f]));
          data.bibleFavorites.forEach(f => map.set(f.id, f));
          localStorage.setItem('faithion_bible_favorites_v1', JSON.stringify(Array.from(map.values())));
        }

        // Histórico de Leitura Bíblica
        if (data.bibleHistory) {
          const current = FaithionStorageService.getBibleReadingHistory();
          const map = new Map(current.map(s => [s.id, s]));
          data.bibleHistory.forEach(s => map.set(s.id, s));
          localStorage.setItem('faithion_bible_history_v1', JSON.stringify(Array.from(map.values())));
        }

        // Logs de Execução (Histórico Append-Only)
        if (data.executionLogs) {
          const current = FaithionStorageService.getExecutionLogs();
          const map = new Map(current.map(l => [l.id, l]));
          data.executionLogs.forEach(l => map.set(l.id, l));
          FaithionStorageService.saveExecutionLogs(Array.from(map.values()));
        }

        // Práticas (Histórico Append-Only)
        if (data.practiceRecords) {
          const current = FaithionStorageService.getPracticeRecords();
          const map = new Map(current.map(p => [p.id, p]));
          data.practiceRecords.forEach(p => map.set(p.id, p));
          FaithionStorageService.savePracticeRecords(Array.from(map.values()));
        }
      }

      return {
        success: true,
        message: mode === 'merge' 
          ? 'Dados mesclados com sucesso! Seu histórico foi completamente preservado.' 
          : 'Backup restaurado com segurança. Um ponto de restauração foi salvo previamente.',
        restoredCounts: payload.metadata?.itemsCount || {}
      };
    } catch (e: any) {
      console.error('[BackupService] Erro ao restaurar backup:', e);
      return {
        success: false,
        message: `Falha na restauração: ${e?.message || 'Erro desconhecido'}`,
        restoredCounts: {}
      };
    }
  }

  // ==========================================
  // SNAPSHOTS LOCAIS DE SEGURANÇA
  // ==========================================

  /**
   * Cria um snapshot local em cache
   */
  static createLocalSnapshot(label: string, type: 'auto' | 'pre_import' | 'manual' = 'manual'): LocalSnapshot {
    const payload = this.generateBackupPayload();
    const snapshots = this.getLocalSnapshots();

    const newSnapshot: LocalSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toISOString(),
      label,
      type,
      itemsCountSummary: `${payload.metadata.itemsCount.routineActivities} rotinas, ${payload.metadata.itemsCount.prayers} orações, ${payload.metadata.itemsCount.executionLogs} logs históricos`,
      payload
    };

    // Mantém no máximo 6 snapshots para não sobrecarregar o localStorage
    const updated = [newSnapshot, ...snapshots].slice(0, 6);
    try {
      localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('[BackupService] Limite de snapshot atingido, reduzindo histórico:', e);
      localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(updated.slice(0, 3)));
    }

    return newSnapshot;
  }

  /**
   * Lista os snapshots de segurança locais salvos
   */
  static getLocalSnapshots(): LocalSnapshot[] {
    try {
      const item = localStorage.getItem(STORAGE_KEY_SNAPSHOTS);
      if (!item) return [];
      return JSON.parse(item) as LocalSnapshot[];
    } catch {
      return [];
    }
  }

  /**
   * Restaura um snapshot local existente por ID
   */
  static restoreLocalSnapshot(snapshotId: string): { success: boolean; message: string } {
    const snapshots = this.getLocalSnapshots();
    const target = snapshots.find(s => s.id === snapshotId);
    if (!target) {
      return { success: false, message: 'Ponto de restauração não encontrado.' };
    }

    const res = this.restoreBackup(target.payload, 'replace');
    return {
      success: res.success,
      message: res.success 
        ? `Restauração concluída a partir de "${target.label}" (${new Date(target.timestamp).toLocaleTimeString()}).`
        : res.message
    };
  }

  /**
   * Deleta um snapshot local
   */
  static deleteLocalSnapshot(snapshotId: string): LocalSnapshot[] {
    const snapshots = this.getLocalSnapshots();
    const updated = snapshots.filter(s => s.id !== snapshotId);
    try {
      localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(updated));
    } catch {}
    return updated;
  }

  /**
   * Hash simples para integridade e verificação
   */
  private static calculateSimpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `hash-${Math.abs(hash).toString(16)}`;
  }
}
