import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  addOutline,
  refreshOutline,
  documentTextOutline,
  alertCircleOutline,
  imageOutline,
  chevronForwardOutline,
  checkmarkCircle,
  timeOutline,
  closeCircle,
  pauseCircleOutline,
} from 'ionicons/icons';
import {
  templatesService,
  categoryBadgeClass,
  statusMeta,
  extractHeaderImageUrl,
  type MetaTemplate,
  type TemplateCategory,
  type TemplateStatus,
} from '@/services/templates.service';
import { usePricingStore, formatARS } from '@/stores/pricing.store';
import { cashOutline } from 'ionicons/icons';
import { useAuditStore } from '@/stores/audit.store';
import { useUsersStore } from '@/stores/users.store';
import { useTemplateMetaStore, type TemplateUse } from '@/stores/template-meta.store';

type FilterId = 'all' | TemplateCategory;
type StatusFilterId = 'all' | 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED';
type UseFilterId = 'all' | TemplateUse;

const USE_FILTERS: { id: UseFilterId; label: string }[] = [
  { id: 'all',       label: 'Todos los usos' },
  { id: 'broadcast', label: 'Difusión' },
  { id: 'postsale',  label: 'Post-Venta' },
  { id: 'ambas',     label: 'Ambas' },
];

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'MARKETING', label: 'Marketing' },
  { id: 'UTILITY', label: 'Utility' },
  { id: 'AUTHENTICATION', label: 'Authentication' },
];

const STATUS_FILTERS: { id: StatusFilterId; label: string }[] = [
  { id: 'all', label: 'Todos los estados' },
  { id: 'APPROVED', label: 'Aprobadas' },
  { id: 'PENDING', label: 'En revisión' },
  { id: 'REJECTED', label: 'Rechazadas' },
  { id: 'PAUSED', label: 'Pausadas' },
];

export default function TemplatesPage() {
  const history = useHistory();
  const [items, setItems] = useState<MetaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterId>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>('all');
  const [useFilter, setUseFilter] = useState<UseFilterId>('all');
  const getUse = useTemplateMetaStore((s) => s.getUse);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await templatesService.list();
      setItems(res.data ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => ({
    all: items.length,
    MARKETING: items.filter((i) => i.category === 'MARKETING').length,
    UTILITY: items.filter((i) => i.category === 'UTILITY').length,
    AUTHENTICATION: items.filter((i) => i.category === 'AUTHENTICATION').length,
  }), [items]);

  const statusCounts = useMemo(() => {
    const base = filter === 'all' ? items : items.filter((i) => i.category === filter);
    return {
      all: base.length,
      APPROVED: base.filter((i) => i.status === 'APPROVED').length,
      PENDING: base.filter((i) => i.status === 'PENDING').length,
      REJECTED: base.filter((i) => i.status === 'REJECTED').length,
      PAUSED: base.filter((i) => i.status === 'PAUSED' || i.status === 'DISABLED').length,
    };
  }, [items, filter]);

  const filtered = useMemo(() => {
    let arr = filter === 'all' ? items : items.filter((i) => i.category === filter);
    if (statusFilter !== 'all') {
      arr = arr.filter((i) => {
        if (statusFilter === 'PAUSED') return i.status === 'PAUSED' || i.status === 'DISABLED';
        return i.status === statusFilter;
      });
    }
    if (useFilter !== 'all') {
      arr = arr.filter((i) => {
        const u = getUse(i.name);
        if (useFilter === 'broadcast') return u === 'broadcast' || u === 'ambas';
        if (useFilter === 'postsale') return u === 'postsale' || u === 'ambas';
        return u === useFilter;
      });
    }
    return arr;
  }, [items, filter, statusFilter, useFilter, getUse]);

  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Plantillas de WhatsApp</h1>
          <p className="lid-page-subtitle">
            Creá plantillas y mandalas a revisión sin salir del CRM. Meta las aprueba en minutos/horas.
          </p>
        </div>
        <div className="lid-row">
          <button className="lid-icon-btn" onClick={load} title="Recargar" disabled={loading}>
            <IonIcon icon={refreshOutline} style={{ animation: loading ? 'spin 1s linear infinite' : undefined }} />
          </button>
          <button className="lid-btn-gradient" onClick={() => history.push('/templates/new')}>
            <IonIcon icon={addOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Nueva plantilla
          </button>
        </div>
      </div>

      <div className="lid-col" style={{ gap: 10, marginBottom: 20 }}>
        <div className="lid-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`lid-tab ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span style={{ marginLeft: 8, color: 'var(--lid-gray-400)', fontWeight: 500 }}>
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
        <div className="lid-tabs">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.id}
              className={`lid-tab ${statusFilter === s.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(s.id)}
            >
              {s.label}
              <span style={{ marginLeft: 8, color: 'var(--lid-gray-400)', fontWeight: 500 }}>
                {statusCounts[s.id]}
              </span>
            </button>
          ))}
        </div>
        <div className="lid-tabs">
          {USE_FILTERS.map((u) => (
            <button
              key={u.id}
              className={`lid-tab ${useFilter === u.id ? 'active' : ''}`}
              onClick={() => setUseFilter(u.id)}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="lid-card" style={{ borderColor: 'var(--lid-pink-500)', background: 'var(--lid-pink-50)', marginBottom: 16 }}>
          <div className="lid-row" style={{ gap: 10 }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: 22, color: 'var(--lid-pink-600)' }} />
            <div>
              <strong style={{ color: 'var(--lid-pink-600)' }}>No pudimos traer las plantillas</strong>
              <div className="lid-muted" style={{ fontSize: 13, marginTop: 4 }}>{error}</div>
            </div>
          </div>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon">
            <IonIcon icon={refreshOutline} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <p className="lid-empty-title">Cargando plantillas…</p>
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon"><IonIcon icon={documentTextOutline} /></div>
          <p className="lid-empty-title">Todavía no hay plantillas</p>
          <p className="lid-empty-sub">Creá la primera para poder mandar difusiones y secuencias de postventa.</p>
          <button className="lid-btn-gradient" onClick={() => history.push('/templates/new')} style={{ marginTop: 12 }}>
            <IonIcon icon={addOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Nueva plantilla
          </button>
        </div>
      )}

      {!loading && items.length > 0 && filtered.length === 0 && (
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon"><IonIcon icon={documentTextOutline} /></div>
          <p className="lid-empty-title">No hay plantillas en esta categoría</p>
          <p className="lid-empty-sub">Probá con otro filtro o creá una nueva.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="lid-grid lid-grid-2">
          {filtered.map((t) => (
            <TemplateCard key={t.id} t={t} use={getUse(t.name)} onClick={() => history.push(`/templates/${t.id}`)} />
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const USE_BADGE: Record<TemplateUse, { label: string; cls: string }> = {
  broadcast: { label: 'Difusión',   cls: 'lid-badge lid-badge-violet' },
  postsale:  { label: 'Post-Venta', cls: 'lid-badge lid-badge-success' },
  ambas:     { label: 'Ambas',      cls: 'lid-badge lid-badge-gray' },
};

function TemplateCard({ t, use, onClick }: { t: MetaTemplate; use: TemplateUse; onClick: () => void }) {
  const sm = statusMeta(t.status);
  const header = t.components?.find((c) => c.type === 'HEADER');
  const body = t.components?.find((c) => c.type === 'BODY');
  const imageUrl = extractHeaderImageUrl(t);
  const hasMediaHeader = header?.format === 'IMAGE' || header?.format === 'VIDEO' || header?.format === 'DOCUMENT';
  const rate = usePricingStore((s) => s.ratesARS[t.category]);
  const audit = useAuditStore((s) => s.templateCreatorOf(t.name));
  const creator = useUsersStore((s) => (audit ? s.findById(audit.createdByUserId) : null));

  return (
    <div
      className="lid-card lid-card-interactive"
      onClick={onClick}
      style={{
        padding: 0,
        overflow: 'hidden',
        borderLeft: `4px solid ${sm.color}`,
        cursor: 'pointer',
      }}
    >
      {/* Status strip */}
      <div style={{
        background: sm.bg,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <StatusChip status={t.status} />
        <div className="lid-row" style={{ gap: 6 }}>
          <span className={categoryBadgeClass(t.category)}>{t.category}</span>
          <span className={USE_BADGE[use].cls}>{USE_BADGE[use].label}</span>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <strong style={{ fontSize: 16, display: 'block', wordBreak: 'break-word' }}>
          {t.name}
        </strong>
        {creator && (
          <div className="lid-row" style={{ gap: 6, fontSize: 11, color: 'var(--lid-gray-500)', marginBottom: 12 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              background: creator.avatarColor, color: '#fff',
              display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: 10,
            }}>
              {creator.name.slice(0, 1)}
            </div>
            <span>Creada por <strong style={{ color: 'var(--lid-gray-700)' }}>{creator.name}</strong></span>
          </div>
        )}
        {!creator && <div style={{ marginBottom: 12 }} />}

        {imageUrl && (
          <div style={{
            marginBottom: 10,
            borderRadius: 10,
            overflow: 'hidden',
            height: 110,
            background: 'var(--lid-gray-100)',
          }}>
            <img
              src={imageUrl}
              alt="Header"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        {hasMediaHeader && !imageUrl && (
          <div style={{
            marginBottom: 10,
            borderRadius: 10,
            height: 80,
            background: 'var(--lid-gray-100)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--lid-gray-400)',
          }}>
            <div className="lid-row" style={{ gap: 8 }}>
              <IonIcon icon={imageOutline} style={{ fontSize: 20 }} />
              <span className="lid-muted" style={{ fontSize: 12 }}>Media: {header?.format}</span>
            </div>
          </div>
        )}

        <div style={{
          background: '#E7FFDB',
          borderRadius: '12px 12px 12px 4px',
          padding: '10px 12px',
          fontSize: 13,
          color: 'var(--lid-gray-900)',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          maxWidth: '92%',
          marginBottom: 8,
        }}>
          {body?.text ?? '—'}
        </div>

        {t.status === 'REJECTED' && t.rejected_reason && t.rejected_reason !== 'NONE' && (
          <div style={{
            marginTop: 10,
            padding: '8px 12px',
            background: 'var(--lid-pink-50)',
            border: '1px solid var(--lid-pink-100)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--lid-pink-600)',
          }}>
            <strong>Motivo:</strong> {t.rejected_reason}
          </div>
        )}

        <div className="lid-row" style={{ justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
          <div className="lid-row" style={{ gap: 6, fontSize: 12, color: 'var(--lid-gray-600)' }}>
            <IonIcon icon={cashOutline} style={{ color: 'var(--lid-violet-600)' }} />
            <span style={{ fontWeight: 700 }}>{formatARS(rate)}</span>
            <span className="lid-muted">por mensaje</span>
          </div>
          <div className="lid-row" style={{ gap: 2, fontSize: 12, color: 'var(--lid-violet-600)', fontWeight: 600 }}>
            Ver detalle
            <IonIcon icon={chevronForwardOutline} style={{ fontSize: 14 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: TemplateStatus }) {
  const sm = statusMeta(status);
  const icon =
    status === 'APPROVED' ? checkmarkCircle :
    status === 'PENDING' ? timeOutline :
    status === 'REJECTED' ? closeCircle :
    pauseCircleOutline;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      borderRadius: 999,
      background: '#fff',
      border: `1px solid ${sm.color}40`,
      color: sm.fg,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.02em',
    }}>
      <IonIcon icon={icon} style={{ fontSize: 16, color: sm.color }} />
      {sm.label}
    </div>
  );
}
