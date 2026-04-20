import { metaFetch } from '@/lib/meta-fetch';

export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
export type TemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED' | 'DISABLED' | 'IN_APPEAL';

export interface TemplateButton {
  type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY';
  text: string;
  url?: string;
  phone_number?: string;
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: {
    body_text?: string[][];
    header_text?: string[];
    header_handle?: string[];
    header_url?: string[];
  };
  buttons?: TemplateButton[];
}

export interface MetaTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  components: TemplateComponent[];
  rejected_reason?: string;
}

export interface CreateTemplateInput {
  name: string;
  category: TemplateCategory;
  language: string;
  components: TemplateComponent[];
}

const WABA_ID = import.meta.env.VITE_META_WABA_ID;
const BASE = `/api/meta/${WABA_ID}/message_templates`;

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error?.message ?? body?.error?.error_user_msg ?? res.statusText;
    const err = new Error(msg);
    (err as Error & { meta?: unknown }).meta = body?.error;
    throw err;
  }
  return body as T;
}

const FIELDS = 'id,name,category,language,status,components,rejected_reason';

export const templatesService = {
  async list(): Promise<{ data: MetaTemplate[] }> {
    if (!WABA_ID) throw new Error('VITE_META_WABA_ID no está configurado');
    const res = await metaFetch(`${BASE}?limit=100&fields=${FIELDS}`);
    return handle(res);
  },

  async get(id: string): Promise<MetaTemplate> {
    const res = await metaFetch(`/api/meta/${id}?fields=${FIELDS}`);
    return handle(res);
  },

  async create(input: CreateTemplateInput): Promise<{ id: string; status: TemplateStatus; category: TemplateCategory }> {
    if (!WABA_ID) throw new Error('VITE_META_WABA_ID no está configurado');
    const res = await metaFetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handle(res);
  },

  async remove(name: string): Promise<{ success: boolean }> {
    if (!WABA_ID) throw new Error('VITE_META_WABA_ID no está configurado');
    const res = await metaFetch(`${BASE}?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
    return handle(res);
  },

  async uploadHeaderMedia(file: File): Promise<{ handle: string }> {
    const buf = await file.arrayBuffer();
    const res = await metaFetch('/api/upload-header', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-file-name': file.name,
        'x-file-type': file.type,
        'x-file-size': String(file.size),
      },
      body: buf,
    });
    return handle(res);
  },
};

export function statusBadgeClass(status: TemplateStatus): string {
  switch (status) {
    case 'APPROVED': return 'lid-badge lid-badge-success';
    case 'PENDING': return 'lid-badge lid-badge-warning';
    case 'REJECTED': return 'lid-badge lid-badge-pink';
    case 'PAUSED':
    case 'DISABLED': return 'lid-badge lid-badge-gray';
    case 'IN_APPEAL': return 'lid-badge lid-badge-sky';
    default: return 'lid-badge lid-badge-gray';
  }
}

export function categoryBadgeClass(cat: TemplateCategory): string {
  switch (cat) {
    case 'MARKETING': return 'lid-badge lid-badge-pink';
    case 'UTILITY': return 'lid-badge lid-badge-blue';
    case 'AUTHENTICATION': return 'lid-badge lid-badge-violet';
  }
}

export interface StatusMeta {
  label: string;
  color: string;      // accent color (border-left, dot)
  bg: string;         // soft background
  fg: string;         // text color
}

export function statusMeta(status: TemplateStatus): StatusMeta {
  switch (status) {
    case 'APPROVED':  return { label: 'Aprobada',        color: '#10B981', bg: '#ECFDF5', fg: '#047857' };
    case 'PENDING':   return { label: 'En revisión',     color: '#F59E0B', bg: '#FFFBEB', fg: '#B45309' };
    case 'REJECTED':  return { label: 'Rechazada',       color: '#EC4899', bg: '#FDF2F8', fg: '#BE185D' };
    case 'PAUSED':    return { label: 'Pausada',         color: '#64748B', bg: '#F1F5F9', fg: '#475569' };
    case 'DISABLED':  return { label: 'Deshabilitada',   color: '#94A3B8', bg: '#F1F5F9', fg: '#475569' };
    case 'IN_APPEAL': return { label: 'En apelación',    color: '#0EA5E9', bg: '#F0F9FF', fg: '#0369A1' };
    default:          return { label: String(status),    color: '#64748B', bg: '#F1F5F9', fg: '#475569' };
  }
}

export function extractHeaderImageUrl(t: MetaTemplate): string | null {
  const header = t.components?.find((c) => c.type === 'HEADER');
  if (!header || header.format !== 'IMAGE') return null;
  const url = header.example?.header_handle?.[0] ?? header.example?.header_url?.[0];
  return url ?? null;
}
