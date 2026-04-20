import { useEffect, useRef } from 'react';
import { usePricingStore } from '@/stores/pricing.store';
import { fetchMetaPricing } from '@/services/pricing.service';

const STALE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Componente invisible que dispara un sync silencioso de pricing
 * si la última sync fue hace más de 7 días. Se monta una sola vez por sesión.
 */
export default function PricingAutoSync() {
  const applySync = usePricingStore((s) => s.applySync);
  const lastSync = usePricingStore((s) => s.lastSync);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const lastAt = lastSync?.at ? new Date(lastSync.at).getTime() : 0;
    const isStale = Date.now() - lastAt > STALE_MS;
    if (!isStale) return;

    fetchMetaPricing(90)
      .then((r) => {
        if (r.ok) applySync(r);
      })
      .catch(() => { /* silencioso */ });
  }, [applySync, lastSync]);

  return null;
}
