import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TemplateCategory } from '@/services/templates.service';
import type { SyncResult } from '@/services/pricing.service';

/**
 * Tarifas por mensaje según categoría de plantilla.
 *
 * Meta no expone una API pública de pricing — publica tarifas en docs estáticas.
 * Usamos valores configurables: los defaults reflejan el pricing público de Meta
 * para Argentina al momento de escribir (estimados). Se editan en Settings → Precios.
 *
 * Moneda: ARS (el resto del CRM expresa costos en ARS).
 */
interface LastSync {
  at: string;
  rangeDays: number;
  categoriesUpdated: TemplateCategory[];
  categoriesSkipped: TemplateCategory[];
}

interface PricingState {
  ratesARS: Record<TemplateCategory, number>;
  fxUsdToArs: number;
  lastUpdated: string;
  lastSync: LastSync | null;
  source: string;

  rateFor(category: TemplateCategory): number;
  updateRate(category: TemplateCategory, value: number): void;
  updateAll(rates: Record<TemplateCategory, number>, source?: string): void;
  updateFx(fx: number): void;
  applySync(result: SyncResult): LastSync;
}

const DEFAULT_RATES: Record<TemplateCategory, number> = {
  MARKETING: 75,
  UTILITY: 25,
  AUTHENTICATION: 25,
};

const DEFAULT_SOURCE = 'Estimados según pricing público de Meta para Argentina. Editables en Ajustes → Precios.';

export const usePricingStore = create<PricingState>()(
  persist(
    (set, get) => ({
      ratesARS: DEFAULT_RATES,
      fxUsdToArs: 1200,
      lastUpdated: new Date().toISOString(),
      lastSync: null,
      source: DEFAULT_SOURCE,

      rateFor(category) {
        return get().ratesARS[category];
      },

      updateRate(category, value) {
        set((s) => ({
          ratesARS: { ...s.ratesARS, [category]: Math.max(0, value) },
          lastUpdated: new Date().toISOString(),
        }));
      },

      updateAll(rates, source) {
        set({
          ratesARS: rates,
          lastUpdated: new Date().toISOString(),
          ...(source ? { source } : {}),
        });
      },

      updateFx(fx) {
        set({ fxUsdToArs: Math.max(1, fx), lastUpdated: new Date().toISOString() });
      },

      applySync(result) {
        const fx = get().fxUsdToArs;
        const cats: TemplateCategory[] = ['MARKETING', 'UTILITY', 'AUTHENTICATION'];
        const updated: TemplateCategory[] = [];
        const skipped: TemplateCategory[] = [];
        const nextRates = { ...get().ratesARS };

        cats.forEach((cat) => {
          const d = result.perCategoryUSD[cat];
          if (d && d.avgCost > 0 && d.volume > 0) {
            nextRates[cat] = Math.round(d.avgCost * fx * 100) / 100;
            updated.push(cat);
          } else {
            skipped.push(cat);
          }
        });

        const sync: LastSync = {
          at: new Date().toISOString(),
          rangeDays: result.rangeDays,
          categoriesUpdated: updated,
          categoriesSkipped: skipped,
        };

        set({
          ratesARS: nextRates,
          lastUpdated: new Date().toISOString(),
          lastSync: sync,
          source: `Sincronizado desde pricing_analytics de Meta (últimos ${result.rangeDays} días) × FX ${fx}.`,
        });

        return sync;
      },
    }),
    { name: 'lid-pricing-store', version: 2 },
  ),
);

export function formatARS(n: number): string {
  return `$${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`;
}

export function categoryColorForBadge(cat: TemplateCategory): string {
  switch (cat) {
    case 'MARKETING': return 'var(--lid-pink-500)';
    case 'UTILITY': return 'var(--lid-blue-500)';
    case 'AUTHENTICATION': return 'var(--lid-violet-500)';
  }
}
