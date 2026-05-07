import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Store DEV-only para sobrescribir credenciales de Meta sin reiniciar Vite.
 *
 * Se usa como override del .env en dev/testeo. Se persiste en localStorage.
 * El token se manda como header `x-lid-meta-token` que el proxy de Vite lee
 * antes de usar el valor de .env.
 *
 * ⚠️ No para producción: localStorage NO es un lugar seguro para tokens
 * permanentes. Para testeo con tokens temporales de 24h está bien.
 */
interface DevCredentialsState {
  metaTokenOverride: string | null;
  updatedAt: string | null;
  hydrated: boolean;

  setToken(token: string): void;
  clearToken(): void;
  hasOverride(): boolean;
}

const STORAGE_NAME = 'lid-dev-credentials';

type PersistedDevCredentials = {
  state?: {
    metaTokenOverride?: string | null;
    updatedAt?: string | null;
  };
  version?: number;
};

function readPersistedCredentials(): PersistedDevCredentials['state'] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_NAME);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedDevCredentials;
    return parsed.state ?? null;
  } catch {
    return null;
  }
}

export function getEffectiveMetaTokenOverride(): string | null {
  const fromState = useDevCredentialsStore.getState().metaTokenOverride?.trim();
  if (fromState) return fromState;

  const fromStorage = readPersistedCredentials()?.metaTokenOverride?.trim();
  return fromStorage || null;
}

const initialPersisted = readPersistedCredentials();

export const useDevCredentialsStore = create<DevCredentialsState>()(
  persist(
    (set, get) => ({
      metaTokenOverride: initialPersisted?.metaTokenOverride?.trim() || null,
      updatedAt: initialPersisted?.updatedAt ?? null,
      hydrated: !!initialPersisted,

      setToken(token) {
        const trimmed = token.trim();
        set({
          metaTokenOverride: trimmed || null,
          updatedAt: trimmed ? new Date().toISOString() : null,
        });
      },

      clearToken() {
        set({ metaTokenOverride: null, updatedAt: null });
      },

      hasOverride() {
        return !!get().metaTokenOverride;
      },
    }),
    {
      name: STORAGE_NAME,
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          useDevCredentialsStore.setState({
            metaTokenOverride: state.metaTokenOverride?.trim() || null,
            updatedAt: state.updatedAt ?? null,
            hydrated: true,
          });
          return;
        }
        useDevCredentialsStore.setState({ hydrated: true });
      },
    },
  ),
);

export function maskToken(token: string | null | undefined): string {
  if (!token) return '—';
  if (token.length <= 12) return '••••';
  return `${token.slice(0, 6)}…${token.slice(-4)}`;
}
