import { useDevCredentialsStore } from '@/stores/dev-credentials.store';

/**
 * fetch con inyección del header x-lid-meta-token cuando hay override.
 * Usar para cualquier llamada a `/api/meta/*` o `/api/upload-header`.
 *
 * El proxy de Vite (dev) lee este header y lo usa como Bearer hacia Meta;
 * si no está presente, usa el valor de .env.
 */
export async function metaFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const override = useDevCredentialsStore.getState().metaTokenOverride;
  const headers = new Headers(init.headers);
  if (override) headers.set('x-lid-meta-token', override);
  return fetch(input, { ...init, headers });
}
