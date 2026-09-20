import { 
  InternalNotification, 
  InternalNotificationType, 
  DailyTask, 
  ReadingPlan, 
  FastingPlan 
} from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'faithion_internal_notifications_v1';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('[NotificationService] Falha ao persistir notificações.', e);
  }
}

export class NotificationService {
  static getNotifications(): InternalNotification[] {
    return safeGet<InternalNotification[]>(NOTIFICATIONS_STORAGE_KEY, [
      {
        id: 'notif-welcome',
        type: 'proxima_atividade',
        title: 'Núcleo Operacional Hoje Ativo',
        message: 'Acompanhe teu ritmo e prioridades com clareza. Comece pela Próxima Ação recomendada.',
        targetTab: 'today',
        createdAt: new Date().toISOString(),
        read: false,
        priority: 'alta'
      }
    ]);
  }

  static saveNotifications(notifications: InternalNotification[]): void {
    safeSet(NOTIFICATIONS_STORAGE_KEY, notifications);
  }

  static markAsRead(id: string): InternalNotification[] {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    this.saveNotifications(updated);
    return updated;
  }

  static markAllAsRead(): InternalNotification[] {
    const notifications = this.getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
    return updated;
  }

  static deleteNotification(id: string): InternalNotification[] {
    const notifications = this.getNotifications();
    const updated = notifications.filter(n => n.id !== id);
    this.saveNotifications(updated);
    return updated;
  }

  static addNotification(
    notif: Omit<InternalNotification, 'id' | 'createdAt' | 'read'>
  ): InternalNotification {
    const notifications = this.getNotifications();
    
    // Evita duplicatas idênticas nas últimas 2 horas
    const existing = notifications.find(
      n => n.type === notif.type && n.title === notif.title && !n.read
    );
    if (existing) return existing;

    const newNotif: InternalNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false
    };

    const updated = [newNotif, ...notifications].slice(0, 30); // Mantém no máximo 30
    this.saveNotifications(updated);
    return newNotif;
  }

  /**
   * Avalia o estado atual das práticas e gera notificações de alerta e incentivo
   * 100% no cliente sem dependência de serviços pagos.
   */
  static syncInternalStatusAlerts(
    tasks: DailyTask[],
    activePlan?: ReadingPlan,
    fastingPlan?: FastingPlan
  ): InternalNotification[] {
    // 1. Notificação de Tarefas Atrasadas
    const delayedTasks = tasks.filter(t => t.status === 'atrasada');
    if (delayedTasks.length > 0) {
      const firstDelayed = delayedTasks[0];
      this.addNotification({
        type: 'atividade_atrasada',
        title: `Atividade aguardando: ${firstDelayed.title}`,
        message: `Estava prevista para ${firstDelayed.scheduledTime}. Lembre-se: no Reino de Deus não há culpa, apenas graça para recomeçar.`,
        targetTab: 'today',
        relatedTaskId: firstDelayed.id,
        priority: 'media'
      });
    }

    // 2. Notificação de Plano de Leitura
    if (activePlan && activePlan.isActive) {
      const todayDay = activePlan.days.find(d => d.dayNumber === activePlan.currentDay);
      if (todayDay && !todayDay.completed) {
        this.addNotification({
          type: 'plano',
          title: `Plano Bíblico: ${todayDay.title}`,
          message: `Leitura do Dia ${todayDay.dayNumber} em ${todayDay.passageRef} está pronta para você.`,
          targetTab: 'bible',
          priority: 'alta'
        });
      }
    }

    // 3. Notificação de Jejum ativo
    if (fastingPlan && fastingPlan.active) {
      this.addNotification({
        type: 'jejum',
        title: `Jejum em Curso: ${fastingPlan.title}`,
        message: `Propósito: ${fastingPlan.purpose}. Permaneça com o coração firmado em Deus.`,
        targetTab: 'fasting',
        priority: 'alta'
      });
    }

    // 4. Notificação de Oração
    const prayerTasks = tasks.filter(t => t.category === 'prayer' && (t.status === 'proxima' || t.status === 'planejada'));
    if (prayerTasks.length > 0) {
      const nextPrayer = prayerTasks[0];
      this.addNotification({
        type: 'oracao',
        title: `Momento de Oração: ${nextPrayer.title}`,
        message: `${nextPrayer.estimatedMinutes} min programados para ${nextPrayer.scheduledTime}.`,
        targetTab: 'today',
        relatedTaskId: nextPrayer.id,
        priority: 'alta'
      });
    }

    return this.getNotifications();
  }
}
