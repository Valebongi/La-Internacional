import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OpportunityStatus = 'active' | 'won' | 'lost';

export interface Opportunity {
  id: string;
  phone: string;           // E.164 con +
  contactName: string;     // nombre del perfil de WhatsApp
  clientId: string | null; // id en CRM si existe
  clientName: string | null;
  advisorId: string | null;
  status: OpportunityStatus;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  createdAt: string;
}

interface OpportunitiesState {
  opportunities: Opportunity[];

  // Devuelve la oportunidad activa para un número, o null si no hay
  findActiveByPhone(phone: string): Opportunity | null;

  // Crea oportunidad si no existe una activa para ese phone; si existe la actualiza
  upsertFromMessage(params: {
    phone: string;
    contactName: string;
    clientId: string | null;
    clientName: string | null;
    advisorId: string | null;
    message: string;
    timestamp: string;
  }): { created: boolean; opportunity: Opportunity };

  closeOpportunity(id: string, status: 'won' | 'lost'): void;
  reopenOpportunity(id: string): void;
}

const rid = () => 'opp_' + Math.random().toString(36).slice(2, 10);

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      opportunities: [],

      findActiveByPhone(phone) {
        return get().opportunities.find(
          (o) => o.phone === phone && o.status === 'active',
        ) ?? null;
      },

      upsertFromMessage({ phone, contactName, clientId, clientName, advisorId, message, timestamp }) {
        const existing = get().findActiveByPhone(phone);

        if (existing) {
          // Ya hay una activa — solo actualizamos último mensaje
          set((s) => ({
            opportunities: s.opportunities.map((o) =>
              o.id === existing.id
                ? { ...o, lastMessage: message, lastMessageAt: timestamp, messageCount: o.messageCount + 1 }
                : o,
            ),
          }));
          return { created: false, opportunity: { ...existing, lastMessage: message, lastMessageAt: timestamp } };
        }

        // No existe — creamos nueva
        const opp: Opportunity = {
          id: rid(),
          phone,
          contactName,
          clientId,
          clientName,
          advisorId,
          status: 'active',
          lastMessage: message,
          lastMessageAt: timestamp,
          messageCount: 1,
          createdAt: timestamp,
        };
        set((s) => ({ opportunities: [opp, ...s.opportunities] }));
        return { created: true, opportunity: opp };
      },

      closeOpportunity(id, status) {
        set((s) => ({
          opportunities: s.opportunities.map((o) =>
            o.id === id ? { ...o, status } : o,
          ),
        }));
      },

      reopenOpportunity(id) {
        set((s) => ({
          opportunities: s.opportunities.map((o) =>
            o.id === id ? { ...o, status: 'active' } : o,
          ),
        }));
      },
    }),
    { name: 'lid-opportunities', version: 1 },
  ),
);
