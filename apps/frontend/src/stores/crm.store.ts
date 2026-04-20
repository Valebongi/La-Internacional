import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizePhoneAR } from '@/lib/phone';

export const CLIENT_TYPES = ['Cosmetóloga', 'Esteticista', 'Dermatóloga', 'Revendedora'] as const;
export type ClientType = typeof CLIENT_TYPES[number];

export type ClientState =
  | 'Recibido'
  | 'En validación'
  | 'Presupuestando'
  | 'Sin comprobante'
  | 'Agendado'
  | 'Comprado';

export interface Advisor {
  id: string;
  name: string;
  color: string;
  email: string;
  clientTypes: ClientType[];
}

export interface Client {
  id: string;
  name: string;
  phone: string; // normalized E.164
  type: ClientType;
  advisorId: string;
  tags: string[];
  city?: string;
  state: ClientState;
  lastContact?: string;
  createdAt: string;
}

export interface ValidationResult {
  raw: string;
  normalized: string | null;
  existing: Client | null;
}

interface CrmState {
  advisors: Advisor[];
  clients: Client[];

  // --- derived helpers ---
  advisorForType(type: ClientType): Advisor | null;
  findByPhone(phone: string): Client | null;

  // --- actions ---
  addClient(input: Omit<Client, 'id' | 'createdAt' | 'advisorId'> & { advisorId?: string }): Client | null;
  addClients(inputs: Array<Omit<Client, 'id' | 'createdAt' | 'advisorId'> & { advisorId?: string }>): Client[];
  updateClient(id: string, patch: Partial<Client>): void;
  removeClient(id: string): void;
  validatePhones(rawList: string[]): ValidationResult[];
  reassignType(type: ClientType, advisorId: string): void;
}

const DEFAULT_ADVISORS: Advisor[] = [
  { id: 'a_sofia', name: 'Sofía', color: '#7C3AED', email: 'sofia@lainternacional.com.ar', clientTypes: ['Cosmetóloga'] },
  { id: 'a_carla', name: 'Carla', color: '#2563EB', email: 'carla@lainternacional.com.ar', clientTypes: ['Esteticista'] },
  { id: 'a_julia', name: 'Julia', color: '#0EA5E9', email: 'julia@lainternacional.com.ar', clientTypes: ['Dermatóloga'] },
  { id: 'a_lu',    name: 'Lu',    color: '#EC4899', email: 'lu@lainternacional.com.ar',    clientTypes: ['Revendedora'] },
  { id: 'a_mica',  name: 'Mica',  color: '#10B981', email: 'mica@lainternacional.com.ar',  clientTypes: [] },
];

const now = () => new Date().toISOString();
const rid = () => 'c_' + Math.random().toString(36).slice(2, 10);

const SEED_CLIENTS: Client[] = [
  { id: 'c_seed_01', name: 'Lucía Fernández', phone: '+5493511234567', type: 'Cosmetóloga', advisorId: 'a_sofia', tags: ['VIP', 'Quincenal'], city: 'Córdoba',    state: 'Presupuestando', lastContact: 'hace 2 h',    createdAt: now() },
  { id: 'c_seed_02', name: 'Camila Ponce',    phone: '+5493514445566', type: 'Esteticista', advisorId: 'a_carla', tags: ['Nueva'],            city: 'Villa María', state: 'Recibido',        lastContact: 'hace 30 min', createdAt: now() },
  { id: 'c_seed_03', name: 'Ariana Giménez',  phone: '+5493517778899', type: 'Dermatóloga', advisorId: 'a_julia', tags: ['Mayorista'],        city: 'Río Cuarto',  state: 'Agendado',        lastContact: 'ayer',        createdAt: now() },
  { id: 'c_seed_04', name: 'Valentina Ríos',  phone: '+5493513334455', type: 'Revendedora', advisorId: 'a_lu',    tags: ['Top 10'],           city: 'Córdoba',     state: 'Comprado',        lastContact: 'hace 4 h',    createdAt: now() },
  { id: 'c_seed_05', name: 'Nati Medina',     phone: '+5493512226677', type: 'Cosmetóloga', advisorId: 'a_sofia', tags: [],                   city: 'Alta Gracia', state: 'Sin comprobante', lastContact: 'hace 3 d',    createdAt: now() },
  { id: 'c_seed_06', name: 'Agus Torres',     phone: '+5493518889900', type: 'Esteticista', advisorId: 'a_carla', tags: ['Recurrente'],       city: 'Jesús María', state: 'En validación',   lastContact: 'hace 1 h',    createdAt: now() },
  { id: 'c_seed_07', name: 'Flor Navarro',    phone: '+5493516665544', type: 'Cosmetóloga', advisorId: 'a_sofia', tags: ['VIP'],              city: 'Córdoba',     state: 'Presupuestando', lastContact: 'hace 2 d',    createdAt: now() },
  { id: 'c_seed_08', name: 'Rocío Bustos',    phone: '+5493515554433', type: 'Revendedora', advisorId: 'a_lu',    tags: ['Mayorista'],        city: 'Bell Ville',  state: 'Agendado',        lastContact: 'hace 5 h',    createdAt: now() },
];

export const useCrmStore = create<CrmState>()(
  persist(
    (set, get) => ({
      advisors: DEFAULT_ADVISORS,
      clients: SEED_CLIENTS,

      advisorForType(type) {
        return get().advisors.find((a) => a.clientTypes.includes(type)) ?? null;
      },

      findByPhone(phone) {
        const normalized = normalizePhoneAR(phone);
        if (!normalized) return null;
        return get().clients.find((c) => c.phone === normalized) ?? null;
      },

      addClient(input) {
        const normalized = normalizePhoneAR(input.phone);
        if (!normalized) return null;
        if (get().clients.some((c) => c.phone === normalized)) return null;

        const advisorId = input.advisorId ?? get().advisorForType(input.type)?.id;
        if (!advisorId) return null;

        const client: Client = {
          id: rid(),
          name: input.name,
          phone: normalized,
          type: input.type,
          advisorId,
          tags: input.tags ?? [],
          city: input.city,
          state: input.state ?? 'Recibido',
          lastContact: input.lastContact ?? 'recién agregado',
          createdAt: now(),
        };
        set((s) => ({ clients: [client, ...s.clients] }));
        return client;
      },

      addClients(inputs) {
        const out: Client[] = [];
        inputs.forEach((i) => {
          const created = get().addClient(i);
          if (created) out.push(created);
        });
        return out;
      },

      updateClient(id, patch) {
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },

      removeClient(id) {
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
      },

      validatePhones(rawList) {
        const clients = get().clients;
        return rawList.map((raw) => {
          const normalized = normalizePhoneAR(raw);
          const existing = normalized ? clients.find((c) => c.phone === normalized) ?? null : null;
          return { raw, normalized, existing };
        });
      },

      reassignType(type, advisorId) {
        set((s) => ({
          advisors: s.advisors.map((a) => {
            if (a.id === advisorId) {
              return { ...a, clientTypes: Array.from(new Set([...a.clientTypes, type])) };
            }
            return { ...a, clientTypes: a.clientTypes.filter((t) => t !== type) };
          }),
        }));
      },
    }),
    {
      name: 'lid-crm-store',
      version: 1,
    },
  ),
);
