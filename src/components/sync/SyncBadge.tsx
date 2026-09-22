import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { SyncEngine } from '../../services/syncEngine';
import { SupabaseSyncMetadata, SyncStatus } from '../../types';

interface SyncBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const SyncBadge: React.FC<SyncBadgeProps> = ({ onClick, className = '' }) => {
  const [meta, setMeta] = useState<SupabaseSyncMetadata>(SyncEngine.getMetadata());

  useEffect(() => {
    const unsubscribe = SyncEngine.subscribe((updatedMeta) => {
      setMeta(updatedMeta);
    });
    return unsubscribe;
  }, []);

  const getStatusDisplay = (status: SyncStatus) => {
    switch (status) {
      case 'sincronizado':
        return {
          icon: <Cloud className="w-3.5 h-3.5 text-emerald-500" />,
          label: 'Sincronizado',
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
          dot: 'bg-emerald-500'
        };
      case 'sincronizando':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin" />,
          label: 'Sincronizando...',
          bg: 'bg-sky-500/10 border-sky-500/20 text-sky-700 dark:text-sky-400',
          dot: 'bg-sky-500 animate-pulse'
        };
      case 'erro':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
          label: 'Falha no sync',
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
          dot: 'bg-rose-500'
        };
      case 'offline':
      default:
        return {
          icon: <CloudOff className="w-3.5 h-3.5 text-amber-500" />,
          label: meta.pendingMutationsCount > 0 
            ? `Offline (${meta.pendingMutationsCount})` 
            : 'Offline',
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
          dot: 'bg-amber-500'
        };
    }
  };

  const statusConfig = getStatusDisplay(meta.syncStatus);

  return (
    <button
      id="sync-status-badge-button"
      onClick={onClick}
      title={`Estado: ${meta.syncStatus} • Clique para gerenciar sincronização e backup`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-90 active:scale-95 cursor-pointer select-none ${statusConfig.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
      {statusConfig.icon}
      <span className="hidden sm:inline">{statusConfig.label}</span>
      {meta.pendingMutationsCount > 0 && meta.syncStatus !== 'offline' && (
        <span className="ml-0.5 px-1 py-0.2 text-[10px] rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
          +{meta.pendingMutationsCount}
        </span>
      )}
    </button>
  );
};
