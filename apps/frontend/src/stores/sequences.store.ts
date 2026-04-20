import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClientType } from './crm.store';

export type SequenceTriggerKind = 'post_purchase' | 'inactivity' | 'birthday' | 'custom_days';

export interface SequenceTrigger {
  kind: SequenceTriggerKind;
  days?: number; // para post_purchase, inactivity, custom_days
}

export interface Sequence {
  id: string;
  name: string;
  trigger: SequenceTrigger;
  templateName: string;
  active: boolean;
  createdByUserId: string;
  advisorId?: string;
  createdAt: string;
  restrictToType?: ClientType;
  sentThisMonth: number;
}

const SEED: Sequence[] = [
  {
    id: 'seq_seed_1',
    name: 'Seguimiento post-compra',
    trigger: { kind: 'post_purchase', days: 7 },
    templateName: 'hello_world',
    active: true,
    createdByUserId: 'u_admin',
    createdAt: new Date().toISOString(),
    sentThisMonth: 142,
  },
  {
    id: 'seq_seed_2',
    name: 'Reactivación inactivos',
    trigger: { kind: 'inactivity', days: 45 },
    templateName: 'hello_world',
    active: true,
    createdByUserId: 'u_admin',
    createdAt: new Date().toISOString(),
    sentThisMonth: 68,
  },
];

interface SequencesState {
  sequences: Sequence[];
  create(input: Omit<Sequence, 'id' | 'createdAt' | 'sentThisMonth'>): Sequence;
  toggleActive(id: string): void;
  remove(id: string): void;
  incrementSent(id: string, count: number): void;
}

const rid = () => 'seq_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const useSequencesStore = create<SequencesState>()(
  persist(
    (set) => ({
      sequences: SEED,
      create(input) {
        const s: Sequence = {
          ...input,
          id: rid(),
          createdAt: new Date().toISOString(),
          sentThisMonth: 0,
        };
        set((state) => ({ sequences: [s, ...state.sequences] }));
        return s;
      },
      toggleActive(id) {
        set((state) => ({
          sequences: state.sequences.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
        }));
      },
      remove(id) {
        set((state) => ({ sequences: state.sequences.filter((s) => s.id !== id) }));
      },
      incrementSent(id, count) {
        set((state) => ({
          sequences: state.sequences.map((s) => s.id === id ? { ...s, sentThisMonth: s.sentThisMonth + count } : s),
        }));
      },
    }),
    { name: 'lid-sequences-store', version: 1 },
  ),
);

export function triggerLabel(t: SequenceTrigger): string {
  switch (t.kind) {
    case 'post_purchase': return `Post-compra +${t.days ?? 7} días`;
    case 'inactivity':    return `Inactividad +${t.days ?? 45} días`;
    case 'birthday':      return 'Cumpleaños';
    case 'custom_days':   return `${t.days ?? 0} días después de captura`;
  }
}
