import { metaFetch } from "@/lib/meta-fetch";
import type { TemplateCategory } from './templates.service';

const WABA_ID = import.meta.env.VITE_META_WABA_ID;

export interface MetaPricingDataPoint {
  start: number;
  end: number;
  pricing_category?: string;
  pricing_type?: string;
  volume: number;
  cost: number; // en USD según Meta bills
}

export interface SyncResult {
  ok: boolean;
  error?: string;
  rawPoints?: MetaPricingDataPoint[];
  perCategoryUSD: Partial<Record<TemplateCategory, { avgCost: number; volume: number; totalCost: number }>>;
  rangeDays: number;
}

const DAY = 86400;

/**
 * Trae el historial de pricing de los últimos N días desde Meta,
 * agrega por categoría y devuelve avg USD por mensaje.
 *
 * Si la respuesta no tiene datos para una categoría (cost=0 o volume=0),
 * esa categoría no se incluye en `perCategoryUSD` — el caller decide si
 * mantener el default manual o marcarla como "sin datos".
 */
export async function fetchMetaPricing(days = 90): Promise<SyncResult> {
  if (!WABA_ID) {
    return { ok: false, error: 'VITE_META_WABA_ID no configurado', perCategoryUSD: {}, rangeDays: days };
  }

  const end = Math.floor(Date.now() / 1000);
  const start = end - days * DAY;

  const fieldsParam =
    `pricing_analytics.start(${start}).end(${end}).granularity(DAILY)` +
    `.dimensions(%5B%22PRICING_CATEGORY%22%5D)`;

  try {
    const res = await metaFetch(`/api/meta/${WABA_ID}?fields=${fieldsParam}`);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: body?.error?.message ?? `HTTP ${res.status}`,
        perCategoryUSD: {},
        rangeDays: days,
      };
    }

    const points: MetaPricingDataPoint[] =
      body?.pricing_analytics?.data?.[0]?.data_points ?? [];

    const acc: Record<string, { totalCost: number; volume: number }> = {};
    for (const p of points) {
      const cat = (p.pricing_category ?? '').toUpperCase();
      if (!cat) continue;
      if (!acc[cat]) acc[cat] = { totalCost: 0, volume: 0 };
      acc[cat].totalCost += Number(p.cost ?? 0);
      acc[cat].volume += Number(p.volume ?? 0);
    }

    const perCategoryUSD: SyncResult['perCategoryUSD'] = {};
    (['MARKETING', 'UTILITY', 'AUTHENTICATION'] as TemplateCategory[]).forEach((cat) => {
      const entry = acc[cat];
      if (entry && entry.volume > 0 && entry.totalCost > 0) {
        perCategoryUSD[cat] = {
          totalCost: entry.totalCost,
          volume: entry.volume,
          avgCost: entry.totalCost / entry.volume,
        };
      } else if (entry) {
        perCategoryUSD[cat] = {
          totalCost: entry.totalCost,
          volume: entry.volume,
          avgCost: 0,
        };
      }
    });

    return { ok: true, rawPoints: points, perCategoryUSD, rangeDays: days };
  } catch (err) {
    return { ok: false, error: (err as Error).message, perCategoryUSD: {}, rangeDays: days };
  }
}
