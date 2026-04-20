import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  peopleOutline, pricetagsOutline, banOutline, logoWhatsapp, layersOutline, personOutline,
  cashOutline, syncOutline, checkmarkCircleOutline, alertCircleOutline,
  keyOutline, eyeOutline, eyeOffOutline, trashOutline, flashOutline,
} from 'ionicons/icons';
import { mockAdvisors } from '@/lib/mock-data';
import { usePricingStore, formatARS } from '@/stores/pricing.store';
import { fetchMetaPricing } from '@/services/pricing.service';
import { templatesService, type TemplateCategory } from '@/services/templates.service';
import { useDevCredentialsStore, maskToken } from '@/stores/dev-credentials.store';

const TABS = [
  { id: 'advisors', label: 'Asesoras', icon: personOutline },
  { id: 'types', label: 'Tipos', icon: peopleOutline },
  { id: 'tags', label: 'Tags', icon: pricetagsOutline },
  { id: 'states', label: 'Estados', icon: layersOutline },
  { id: 'pricing', label: 'Precios', icon: cashOutline },
  { id: 'credentials', label: 'Credenciales', icon: keyOutline },
  { id: 'optout', label: 'Opt-out', icon: banOutline },
  { id: 'channels', label: 'Canales', icon: logoWhatsapp },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('advisors');

  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Configuración</h1>
          <p className="lid-page-subtitle">Asesoras, tipos, tags, estados, canales y opt-out</p>
        </div>
      </div>

      <div className="lid-tabs" style={{ marginBottom: 20 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`lid-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <IonIcon icon={t.icon} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="lid-card">
        {tab === 'advisors' && (
          <div className="lid-grid lid-grid-2">
            {mockAdvisors.map((a) => (
              <div key={a.name} className="lid-card">
                <div className="lid-row">
                  <div className="lid-conv-avatar" style={{ background: a.color, width: 48, height: 48, fontSize: 18 }}>
                    {a.name.slice(0, 1)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{a.name}</div>
                    <div className="lid-muted" style={{ fontSize: 12 }}>{a.name.toLowerCase()}@lainternacional.com.ar</div>
                  </div>
                  <span className="lid-badge lid-badge-success">Activa</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'types' && (
          <div className="lid-row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {['Cosmetóloga', 'Esteticista', 'Dermatóloga', 'Revendedora'].map((t) => (
              <span key={t} className="lid-badge lid-badge-violet" style={{ fontSize: 13, padding: '8px 14px' }}>{t}</span>
            ))}
          </div>
        )}
        {tab === 'tags' && (
          <div className="lid-row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {['VIP', 'Mayorista', 'Recurrente', 'Top 10', 'Nueva', 'Quincenal'].map((t, i) => {
              const cls = ['lid-badge-pink', 'lid-badge-violet', 'lid-badge-blue', 'lid-badge-sky', 'lid-badge-success', 'lid-badge-warning'][i % 6];
              return <span key={t} className={`lid-badge ${cls}`} style={{ fontSize: 13, padding: '8px 14px' }}>{t}</span>;
            })}
          </div>
        )}
        {tab === 'states' && (
          <div className="lid-col" style={{ gap: 8 }}>
            {['Recibido', 'En validación', 'Presupuestando', 'Sin comprobante', 'Agendado', 'Comprado'].map((s, i) => (
              <div key={s} className="lid-row" style={{ padding: 12, borderRadius: 10, background: 'var(--lid-gray-50)', justifyContent: 'space-between' }}>
                <div className="lid-row">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--lid-brand-gradient)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{i + 1}</div>
                  <strong>{s}</strong>
                </div>
                <span className="lid-muted">pendiente de confirmar con cliente</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'pricing' && <PricingTab />}
        {tab === 'credentials' && <CredentialsTab />}
        {tab === 'optout' && (
          <div className="lid-empty">
            <div className="lid-empty-icon"><IonIcon icon={banOutline} /></div>
            <p className="lid-empty-title">12 contactos en opt-out</p>
            <p className="lid-empty-sub">Son clientes que pidieron no recibir difusiones. Se excluyen automáticamente en cualquier campaña.</p>
          </div>
        )}
        {tab === 'channels' && (
          <div className="lid-grid lid-grid-3">
            {['WA #1', 'WA #2', 'WA #3', 'WA #4', 'WA #5', 'Instagram'].map((c, i) => (
              <div key={c} className="lid-card">
                <div className="lid-row" style={{ justifyContent: 'space-between' }}>
                  <strong>{c}</strong>
                  <span className="lid-badge lid-badge-success">Conectado</span>
                </div>
                <div className="lid-muted" style={{ fontSize: 12, marginTop: 6 }}>+549 351 555-{1000 + i * 37}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Credenciales tab ============ */

function CredentialsTab() {
  const override = useDevCredentialsStore((s) => s.metaTokenOverride);
  const updatedAt = useDevCredentialsStore((s) => s.updatedAt);
  const setToken = useDevCredentialsStore((s) => s.setToken);
  const clearToken = useDevCredentialsStore((s) => s.clearToken);

  const [input, setInput] = useState('');
  const [reveal, setReveal] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const save = () => {
    setToken(input);
    setInput('');
    setTestResult(null);
  };

  const test = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await templatesService.list();
      setTestResult({ ok: true, message: `OK — Meta devolvió ${r.data?.length ?? 0} plantilla${(r.data?.length ?? 0) === 1 ? '' : 's'}.` });
    } catch (e) {
      setTestResult({ ok: false, message: (e as Error).message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="lid-col" style={{ gap: 20 }}>
      <div className="lid-card" style={{
        padding: 16,
        borderLeft: '4px solid var(--lid-violet-500)',
        background: 'linear-gradient(135deg, var(--lid-violet-50) 0%, #ffffff 100%)',
      }}>
        <div className="lid-row" style={{ gap: 12 }}>
          <IonIcon icon={keyOutline} style={{ fontSize: 24, color: 'var(--lid-violet-600)' }} />
          <div style={{ flex: 1 }}>
            <strong>Access token de Meta (override de .env)</strong>
            <p className="lid-muted" style={{ fontSize: 12, margin: '4px 0 0' }}>
              Para testear sin reiniciar Vite. Si pegás un token acá, se usa en todas las llamadas a Meta en vez del de <code>.env.local</code>.
              Si lo limpiás, volvemos al de <code>.env</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="lid-card">
        <div className="lid-row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <strong style={{ fontSize: 14 }}>Estado actual</strong>
          {override ? (
            <span className="lid-badge lid-badge-violet lid-badge-dot">
              <IonIcon icon={flashOutline} style={{ marginRight: 4 }} />
              Usando override
            </span>
          ) : (
            <span className="lid-badge lid-badge-gray">Usando .env</span>
          )}
        </div>
        {override && (
          <div className="lid-row" style={{ marginTop: 14, gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: 220,
              padding: '10px 14px',
              background: 'var(--lid-gray-50)',
              border: '1px solid var(--lid-gray-200)',
              borderRadius: 8,
              fontFamily: 'monospace',
              fontSize: 13,
              color: 'var(--lid-gray-700)',
              wordBreak: 'break-all',
            }}>
              {reveal ? override : maskToken(override)}
            </div>
            <button className="lid-icon-btn" onClick={() => setReveal(!reveal)} title={reveal ? 'Ocultar' : 'Revelar'}>
              <IonIcon icon={reveal ? eyeOffOutline : eyeOutline} />
            </button>
            <button
              className="lid-icon-btn"
              onClick={clearToken}
              title="Limpiar override (volver al .env)"
              style={{ color: 'var(--lid-pink-600)', borderColor: 'var(--lid-pink-200)' }}
            >
              <IonIcon icon={trashOutline} />
            </button>
          </div>
        )}
        {updatedAt && (
          <div className="lid-muted" style={{ fontSize: 11, marginTop: 10 }}>
            Guardado: {new Date(updatedAt).toLocaleString('es-AR')}
          </div>
        )}
      </div>

      <div className="lid-card">
        <label className="lid-label">Pegar nuevo token</label>
        <p className="lid-muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
          Copialo desde developers.facebook.com → tu App → WhatsApp → API Setup.
          Usá preferentemente un token <strong>temporal de 24h</strong> para testeo.
        </p>
        <textarea
          className="lid-input"
          style={{ height: 90, padding: 12, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
          placeholder="EAAfuN… (token completo)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="lid-row" style={{ justifyContent: 'flex-end', marginTop: 10, gap: 10 }}>
          <button className="lid-btn-gradient" onClick={save} disabled={!input.trim()}>
            Guardar como override
          </button>
        </div>
      </div>

      <div className="lid-card">
        <div className="lid-row" style={{ justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <strong style={{ fontSize: 14 }}>Probar el token</strong>
            <p className="lid-muted" style={{ fontSize: 12, margin: '4px 0 0' }}>
              Hace un GET a Meta (lista plantillas) usando el token actual (override si hay, si no el de .env).
            </p>
          </div>
          <button className="lid-btn-gradient" onClick={test} disabled={testing}>
            <IonIcon icon={syncOutline} style={{ marginRight: 6, verticalAlign: '-3px', animation: testing ? 'spin 1s linear infinite' : undefined }} />
            {testing ? 'Probando…' : 'Probar ahora'}
          </button>
        </div>
        {testResult && (
          <div className="lid-row" style={{
            marginTop: 14, padding: 12,
            background: testResult.ok ? '#ECFDF5' : 'var(--lid-pink-50)',
            border: `1px solid ${testResult.ok ? '#6EE7B7' : 'var(--lid-pink-200)'}`,
            borderRadius: 8, gap: 10, alignItems: 'flex-start',
          }}>
            <IonIcon
              icon={testResult.ok ? checkmarkCircleOutline : alertCircleOutline}
              style={{ color: testResult.ok ? '#059669' : 'var(--lid-pink-600)', fontSize: 18, flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: testResult.ok ? '#059669' : 'var(--lid-pink-600)', wordBreak: 'break-word' }}>
              {testResult.message}
            </span>
          </div>
        )}
      </div>

      <div className="lid-muted" style={{ fontSize: 11, padding: 12, background: 'var(--lid-gray-50)', borderRadius: 8 }}>
        ⚠️ <strong>Solo para dev/testeo:</strong> el token queda en localStorage del navegador. No pegues tu token permanente de producción acá — usá uno temporal de 24h de Meta developers.
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ============ Precios tab ============ */

function PricingTab() {
  const ratesARS = usePricingStore((s) => s.ratesARS);
  const fxUsdToArs = usePricingStore((s) => s.fxUsdToArs);
  const lastSync = usePricingStore((s) => s.lastSync);
  const source = usePricingStore((s) => s.source);
  const updateRate = usePricingStore((s) => s.updateRate);
  const updateFx = usePricingStore((s) => s.updateFx);
  const applySync = usePricingStore((s) => s.applySync);

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await fetchMetaPricing(90);
      if (!result.ok) {
        setSyncResult({ ok: false, message: result.error ?? 'Error desconocido' });
      } else {
        const sync = applySync(result);
        const n = sync.categoriesUpdated.length;
        if (n === 0) {
          setSyncResult({
            ok: true,
            message: `Meta respondió pero no hay facturación aún (${result.rangeDays}d). Seguimos con los valores manuales.`,
          });
        } else {
          setSyncResult({
            ok: true,
            message: `Actualizadas ${n} categoría${n === 1 ? '' : 's'}: ${sync.categoriesUpdated.join(', ')}${sync.categoriesSkipped.length ? ` — sin datos: ${sync.categoriesSkipped.join(', ')}` : ''}`,
          });
        }
      }
    } catch (err) {
      setSyncResult({ ok: false, message: (err as Error).message });
    } finally {
      setSyncing(false);
    }
  };

  const categories: Array<{ key: TemplateCategory; label: string; desc: string }> = [
    { key: 'MARKETING', label: 'Marketing', desc: 'Promos, catálogos, novedades' },
    { key: 'UTILITY', label: 'Utility', desc: 'Confirmaciones, actualizaciones' },
    { key: 'AUTHENTICATION', label: 'Authentication', desc: 'OTP, verificaciones' },
  ];

  return (
    <div className="lid-col" style={{ gap: 20 }}>
      <div className="lid-card" style={{
        padding: 16,
        borderLeft: '4px solid var(--lid-violet-500)',
        background: 'linear-gradient(135deg, var(--lid-violet-50) 0%, #ffffff 100%)',
      }}>
        <div className="lid-row" style={{ gap: 12 }}>
          <IonIcon icon={cashOutline} style={{ fontSize: 24, color: 'var(--lid-violet-600)' }} />
          <div style={{ flex: 1 }}>
            <strong>Tarifas por categoría de plantilla</strong>
            <p className="lid-muted" style={{ fontSize: 12, margin: '4px 0 0' }}>
              Se usan en la vista de plantilla, difusiones y analítica. Podés editarlas a mano o traerlas del historial real de Meta.
            </p>
          </div>
        </div>
      </div>

      {/* Sync button */}
      <div className="lid-card">
        <div className="lid-row" style={{ justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <strong style={{ fontSize: 14 }}>Sincronizar con Meta</strong>
            <p className="lid-muted" style={{ fontSize: 12, margin: '4px 0 0' }}>
              Consulta `pricing_analytics` (últimos 90 días), calcula promedio USD/msg por categoría y lo convierte a ARS usando el FX de abajo.
            </p>
            {lastSync ? (
              <p className="lid-muted" style={{ fontSize: 11, margin: '6px 0 0' }}>
                Última sync: {new Date(lastSync.at).toLocaleString('es-AR')} · actualizadas: {lastSync.categoriesUpdated.join(', ') || 'ninguna'}
              </p>
            ) : (
              <p className="lid-muted" style={{ fontSize: 11, margin: '6px 0 0' }}>Nunca sincronizado. Valores actuales son estimados.</p>
            )}
          </div>
          <button className="lid-btn-gradient" onClick={handleSync} disabled={syncing}>
            <IonIcon
              icon={syncOutline}
              style={{ marginRight: 6, verticalAlign: '-3px', animation: syncing ? 'spin 1s linear infinite' : undefined }}
            />
            {syncing ? 'Sincronizando…' : 'Sincronizar ahora'}
          </button>
        </div>

        {syncResult && (
          <div className="lid-row" style={{
            marginTop: 14, padding: 12,
            background: syncResult.ok ? '#ECFDF5' : 'var(--lid-pink-50)',
            border: `1px solid ${syncResult.ok ? '#6EE7B7' : 'var(--lid-pink-200)'}`,
            borderRadius: 8, gap: 10, alignItems: 'flex-start',
          }}>
            <IonIcon
              icon={syncResult.ok ? checkmarkCircleOutline : alertCircleOutline}
              style={{ color: syncResult.ok ? '#059669' : 'var(--lid-pink-600)', fontSize: 18 }}
            />
            <span style={{ fontSize: 13, color: syncResult.ok ? '#059669' : 'var(--lid-pink-600)' }}>
              {syncResult.message}
            </span>
          </div>
        )}
      </div>

      {/* FX */}
      <div className="lid-card">
        <label className="lid-label">Tipo de cambio USD → ARS</label>
        <p className="lid-muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
          Meta factura en USD; usamos este FX para mostrar las tarifas en ARS.
        </p>
        <div className="lid-row" style={{ gap: 10 }}>
          <input
            type="number"
            className="lid-input"
            style={{ maxWidth: 200, fontSize: 15, fontWeight: 600 }}
            value={fxUsdToArs}
            step={1}
            onChange={(e) => updateFx(Number(e.target.value))}
          />
          <span className="lid-muted" style={{ alignSelf: 'center', fontSize: 13 }}>ARS por 1 USD</span>
        </div>
      </div>

      {/* Rates editable */}
      <div className="lid-card">
        <strong style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>Tarifas actuales (editables)</strong>
        <div className="lid-col" style={{ gap: 10 }}>
          {categories.map((c) => (
            <div key={c.key} className="lid-row" style={{
              padding: 14,
              background: 'var(--lid-gray-50)',
              borderRadius: 10,
              gap: 14,
              alignItems: 'center',
            }}>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14 }}>{c.label}</strong>
                <div className="lid-muted" style={{ fontSize: 12 }}>{c.desc}</div>
              </div>
              <div className="lid-row" style={{ gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--lid-gray-700)' }}>$</span>
                <input
                  type="number"
                  className="lid-input"
                  style={{ width: 120, textAlign: 'right', fontSize: 16, fontWeight: 700 }}
                  value={ratesARS[c.key]}
                  step={0.01}
                  onChange={(e) => updateRate(c.key, Number(e.target.value))}
                />
                <span className="lid-muted" style={{ fontSize: 12 }}>ARS/msg</span>
              </div>
              <div style={{ minWidth: 80, textAlign: 'right' }}>
                <div className="lid-muted" style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>USD equiv.</div>
                <div style={{ fontSize: 12 }}>~${(ratesARS[c.key] / Math.max(fxUsdToArs, 1)).toFixed(4)}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="lid-muted" style={{ fontSize: 11, marginTop: 10 }}>{source}</p>
      </div>

      {/* Preview */}
      <div className="lid-card lid-card-feature">
        <strong style={{ fontSize: 14, display: 'block', marginBottom: 10 }}>Ejemplo de costo</strong>
        <div className="lid-grid lid-grid-3">
          {categories.map((c) => (
            <div key={c.key} className="lid-card" style={{ padding: 12, background: '#fff' }}>
              <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>{c.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{formatARS(ratesARS[c.key])} × 100</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }} className="lid-brand-text">
                {formatARS(ratesARS[c.key] * 100)}
              </div>
              <div className="lid-muted" style={{ fontSize: 11, marginTop: 2 }}>para 100 destinatarios</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
