import { create } from 'zustand';

export interface InboundNotification {
  id: string;
  phone: string;          // E.164 con +
  contactName: string;    // nombre que manda Meta (del perfil de WA)
  clientName: string | null; // nombre en el CRM si existe
  advisorId: string | null;  // asesora asignada si existe en el CRM
  body: string;
  type: string;
  timestamp: string;
}

interface InboxState {
  notifications: InboundNotification[];
  addNotification(n: InboundNotification): void;
  dismiss(id: string): void;
}

export const useInboxStore = create<InboxState>((set) => ({
  notifications: [],

  addNotification(n) {
    set((s) => ({
      // Deduplicar por id, mantener máximo 50
      notifications: s.notifications.some((x) => x.id === n.id)
        ? s.notifications
        : [n, ...s.notifications].slice(0, 50),
    }));
  },

  dismiss(id) {
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
  },
}));
