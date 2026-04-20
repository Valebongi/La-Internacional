import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const OVERRIDE_HEADER = 'x-lid-meta-token';

/** Extrae el token a usar: header override → env fallback. */
function resolveToken(req: IncomingMessage, envToken: string): string {
  const header = req.headers[OVERRIDE_HEADER];
  const fromHeader = Array.isArray(header) ? header[0] : header;
  return (fromHeader && fromHeader.trim()) || envToken;
}

/**
 * Plugin: descarga una imagen pública (o firmada de Meta) server-side,
 * la sube al endpoint `/media` del phone number y devuelve el media_id.
 *
 * Se usa antes de enviar una difusión con template que tiene header de imagen:
 * Meta no puede refetchear URLs de scontent.whatsapp.net, pero sí acepta `id`
 * de `/media` como header image en el send.
 */
function metaResendMediaPlugin(env: Record<string, string>): PluginOption {
  const version = env.META_GRAPH_VERSION ?? 'v25.0';
  const phoneNumberId = env.META_PHONE_NUMBER_ID ?? env.VITE_META_PHONE_NUMBER_ID;
  const envToken = env.META_ACCESS_TOKEN ?? '';

  return {
    name: 'lid-meta-resend-media',
    configureServer(server) {
      server.middlewares.use('/api/resend-media', async (req: IncomingMessage, res: ServerResponse) => {
        const sendJson = (status: number, payload: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };

        if (req.method !== 'POST') return sendJson(405, { error: 'Method Not Allowed' });

        const token = resolveToken(req, envToken);
        if (!phoneNumberId || !token) {
          return sendJson(500, { error: 'Falta META_PHONE_NUMBER_ID o token' });
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        let body: { url?: string };
        try {
          body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
        } catch {
          return sendJson(400, { error: 'Body debe ser JSON con { url }' });
        }
        if (!body.url) return sendJson(400, { error: 'Falta url' });

        try {
          // 1) Descargar la imagen desde la URL firmada de Meta
          const imgRes = await fetch(body.url);
          if (!imgRes.ok) {
            return sendJson(502, { error: `No se pudo descargar la imagen (HTTP ${imgRes.status})` });
          }
          const arrayBuf = await imgRes.arrayBuffer();
          const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg';

          // 2) Subirla al endpoint /media del phone number
          const extension = contentType.split('/')[1] ?? 'jpg';
          const form = new FormData();
          const blob = new Blob([arrayBuf], { type: contentType });
          form.append('messaging_product', 'whatsapp');
          form.append('type', contentType);
          form.append('file', blob, `image.${extension}`);

          const uploadRes = await fetch(
            `https://graph.facebook.com/${version}/${phoneNumberId}/media`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: form,
            },
          );
          const uploadBody = await uploadRes.json().catch(() => ({}));
          const mediaId = uploadBody?.id as string | undefined;
          if (!uploadRes.ok || !mediaId) {
            return sendJson(uploadRes.status || 500, {
              error: uploadBody?.error?.message ?? 'Upload a /media falló',
              meta: uploadBody?.error,
            });
          }

          return sendJson(200, { mediaId });
        } catch (err) {
          console.error('[resend-media] error', err);
          return sendJson(500, { error: (err as Error).message });
        }
      });
    },
  };
}

/**
 * Plugin de desarrollo: maneja la subida de media para headers de plantilla.
 * Usa la Resumable Upload API de Meta (2 pasos).
 */
function metaUploadHeaderPlugin(env: Record<string, string>): PluginOption {
  const metaVersion = env.META_GRAPH_VERSION ?? 'v25.0';
  const appId = env.META_APP_ID;
  const envToken = env.META_ACCESS_TOKEN ?? '';

  return {
    name: 'lid-meta-upload-header',
    configureServer(server) {
      server.middlewares.use('/api/upload-header', async (req: IncomingMessage, res: ServerResponse) => {
        const sendJson = (status: number, payload: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };

        if (req.method !== 'POST') return sendJson(405, { error: 'Method Not Allowed' });

        const token = resolveToken(req, envToken);
        if (!appId || !token) {
          return sendJson(500, {
            error: 'META_APP_ID o token no configurados. Cargá uno en Ajustes → Credenciales o agregá META_ACCESS_TOKEN al .env.local.',
          });
        }

        const fileName = String(req.headers['x-file-name'] ?? '');
        const fileType = String(req.headers['x-file-type'] ?? '');
        const fileSize = Number(req.headers['x-file-size'] ?? 0);

        if (!fileName || !fileType || !fileSize) {
          return sendJson(400, { error: 'Faltan headers x-file-name, x-file-type, x-file-size.' });
        }

        try {
          const sessionUrl =
            `https://graph.facebook.com/${metaVersion}/${appId}/uploads` +
            `?file_name=${encodeURIComponent(fileName)}` +
            `&file_length=${fileSize}` +
            `&file_type=${encodeURIComponent(fileType)}`;

          const s1 = await fetch(sessionUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          const s1Body = await s1.json().catch(() => ({}));
          const sessionId = s1Body?.id as string | undefined;
          if (!s1.ok || !sessionId) {
            return sendJson(s1.status || 500, {
              error: s1Body?.error?.message ?? 'No se pudo crear la sesión de upload',
              meta: s1Body?.error,
            });
          }

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const bodyBuffer = Buffer.concat(chunks);

          const uploadUrl = `https://graph.facebook.com/${metaVersion}/${sessionId}`;
          const s2 = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              Authorization: `OAuth ${token}`,
              file_offset: '0',
              'Content-Type': 'application/octet-stream',
            },
            body: bodyBuffer,
          });
          const s2Body = await s2.json().catch(() => ({}));
          const handle = s2Body?.h as string | undefined;
          if (!s2.ok || !handle) {
            return sendJson(s2.status || 500, {
              error: s2Body?.error?.message ?? 'La subida del archivo falló',
              meta: s2Body?.error,
            });
          }

          return sendJson(200, { handle });
        } catch (err) {
          console.error('[upload-header] error', err);
          return sendJson(500, { error: (err as Error).message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const envToken = env.META_ACCESS_TOKEN ?? '';
  const metaVersion = env.META_GRAPH_VERSION ?? 'v25.0';

  return {
    plugins: [react(), metaUploadHeaderPlugin(env), metaResendMediaPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api/meta': {
          target: 'https://graph.facebook.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/meta/, `/${metaVersion}`),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              const token = resolveToken(req, envToken);
              if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`);
              }
              // Siempre removemos el header custom para no mandarlo a Meta
              proxyReq.removeHeader(OVERRIDE_HEADER);
            });
            proxy.on('error', (err) => {
              console.error('[meta-proxy] error:', err.message);
            });
          },
        },
      },
    },
  };
});
