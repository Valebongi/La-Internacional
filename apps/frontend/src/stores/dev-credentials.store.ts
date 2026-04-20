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

  setToken(token: string): void;
  clearToken(): void;
  hasOverride(): boolean;
}

export const useDevCredentialsStore = create<DevCredentialsState>()(
  persist(
    (set, get) => ({
      metaTokenOverride: null,
      updatedAt: null,

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
    { name: 'lid-dev-credentials', version: 1 },
  ),
);

export function maskToken(token: string | null | undefined): string {
  if (!token) return '—';
  if (token.length <= 12) return '••••';
  return `${token.slice(0, 6)}…${token.slice(-4)}`;
}
