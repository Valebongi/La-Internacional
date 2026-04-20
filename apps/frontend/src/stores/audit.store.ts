import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TemplateCategory } from '@/services/templates.service';
import type { ClientType } from './crm.store';

/** Metadata local que complementa a Meta: quién creó la plantilla, cuándo. */
export interface TemplateAudit {
  templateName: string;
  createdByUserId: string;
  createdAt: string;
}

/** Registro local de cada difusión enviada (Meta no nos guarda esto). */
export interface BroadcastRecord {
  id: string;
  createdByUserId: string;
  advisorId?: string;
  createdAt: string;
  templateName: string;
  templateCategory: TemplateCategory;
  segmentType: ClientType | 'all';
  recipientCount: number;
  okCount: number;
  failedCount: number;
  testMode: boolean;
  totalCostARS: number;
}

interface AuditState {
  templateAudits: TemplateAudit[];
  broadcasts: BroadcastRecord[];

  recordTemplateCreation(templateName: string, userId: string): void;
  templateCreatorOf(templateName: string): TemplateAudit | null;

  recordBroadcast(record: Omit<BroadcastRecord, 'id' | 'createdAt'>): BroadcastRecord;
}

const rid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      templateAudits: [],
      broadcasts: [],

      recordTemplateCreation(templateName, userId) {
        set((s) => ({
          templateAudits: [
            ...s.templateAudits.filter((t) => t.templateName !== templateName),
            { templateName, createdByUserId: userId, createdAt: new Date().toISOString() },
          ],
        }));
      },

      templateCreatorOf(templateName) {
        return get().templateAudits.find((t) => t.templateName === templateName) ?? null;
      },

      recordBroadcast(record) {
        const full: BroadcastRecord = {
          ...record,
          id: rid('b'),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ broadcasts: [full, ...s.broadcasts] }));
        return full;
      },
    }),
    { name: 'lid-audit-store', version: 1 },
  ),
);
