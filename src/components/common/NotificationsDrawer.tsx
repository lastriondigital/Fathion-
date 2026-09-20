import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  HeartHandshake, 
  Flame, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { InternalNotification, InternalNotificationType } from '../../types';
import { NavTabId } from '../layout/Sidebar';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InternalNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigateToTab: (tab: NavTabId) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNavigateToTab
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: InternalNotificationType) => {
    switch (type) {
      case 'atividade_atrasada':
        return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'proxima_atividade':
        return <Clock className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />;
      case 'plano':
        return <BookOpen className="w-4 h-4 text-[#29523F] dark:text-[#4F8E71]" />;
      case 'oracao':
        return <HeartHandshake className="w-4 h-4 text-[#C59B3F]" />;
      case 'jejum':
        return <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'lembrete':
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getTypeBadge = (type: InternalNotificationType) => {
    switch (type) {
      case 'atividade_atrasada':
        return { label: 'Atrasada', bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'proxima_atividade':
        return { label: 'Próxima Ação', bg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300' };
      case 'plano':
        return { label: 'Plano Bíblico', bg: 'bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-300' };
      case 'oracao':
        return { label: 'Oração', bg: 'bg-amber-100 text-[#C59B3F] dark:bg-amber-950/60 dark:text-amber-200' };
      case 'jejum':
        return { label: 'Jejum', bg: 'bg-orange-100 text-orange-900 dark:bg-orange-950/60 dark:text-orange-300' };
      default:
        return { label: 'Lembrete', bg: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' };
    }
  };

  const handleItemClick = (notif: InternalNotification) => {
    onMarkAsRead(notif.id);
    if (notif.targetTab) {
      onNavigateToTab(notif.targetTab as NavTabId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FBFBFA] dark:bg-[#141C19] h-full shadow-2xl flex flex-col border-l border-[#E6E6DF] dark:border-[#24322C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E6DF] dark:border-[#24322C] bg-white dark:bg-[#1B2521] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E6F0EA] dark:bg-[#192D23] text-[#29523F] dark:text-[#4F8E71]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#19211D] dark:text-[#F1F4F2]">
                  Lembretes & Alertas
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#162E23] text-white">
                    {unreadCount} novos
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7D8882] dark:text-[#788780]">
                Notificações internas da tua rotina espiritual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg text-[#7D8882] hover:bg-[#EFEFEA] dark:hover:bg-[#141C19]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action toolbar */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-neutral-50 dark:bg-[#18231E] border-b border-[#E6E6DF] dark:border-[#24322C] flex items-center justify-between text-xs">
            <span className="text-[#7D8882] dark:text-[#788780]">
              Total: {notifications.length} avisos
            </span>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 font-semibold text-[#162E23] dark:text-[#4F8E71] hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marcar lidos</span>
              </button>
            )}
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#E6F0EA] dark:bg-[#192D23] flex items-center justify-center text-[#29523F] dark:text-[#4F8E71]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#19211D] dark:text-[#F1F4F2]">
                Sem notificações no momento
              </h4>
              <p className="text-xs text-[#7D8882] dark:text-[#788780] max-w-xs mx-auto">
                Tudo está em paz. Os lembretes de oração, leitura, atrasos e jejum surgirão aqui sem cobrar você.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const badge = getTypeBadge(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                    notif.read
                      ? 'bg-white/60 dark:bg-[#141C19]/60 border-[#E6E6DF] dark:border-[#24322C]'
                      : 'bg-white dark:bg-[#1B2521] border-[#29523F]/30 shadow-xs ring-1 ring-[#29523F]/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#F2F7F4] dark:bg-[#141C19] shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B3F]" />
                        )}
                        <span className="text-[10px] text-[#7D8882] dark:text-[#788780] ml-auto">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#19211D] dark:text-[#F1F4F2] leading-snug">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-[#4B554F] dark:text-[#B0BBB5] mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-[#162E23] dark:text-[#4F8E71] font-semibold flex items-center gap-1 hover:underline">
                      <span>Ver no aplicativo</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(notif.id);
                      }}
                      className="text-neutral-400 hover:text-red-500 p-1 rounded transition-colors opacity-80 group-hover:opacity-100"
                      title="Excluir notificação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white dark:bg-[#1B2521] border-t border-[#E6E6DF] dark:border-[#24322C] text-center text-[11px] text-[#7D8882] dark:text-[#788780]">
          Notificações locais • Totalmente livre de dependências pagas
        </div>
      </div>
    </div>
  );
};
