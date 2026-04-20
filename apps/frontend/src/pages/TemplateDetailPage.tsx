import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  trashOutline,
  logoWhatsapp,
  alertCircleOutline,
  refreshOutline,
  copyOutline,
  openOutline,
  callOutline,
  returnDownForwardOutline,
  imageOutline,
  videocamOutline,
  documentOutline,
} from 'ionicons/icons';
import {
  templatesService,
  categoryBadgeClass,
  statusMeta,
  extractHeaderImageUrl,
  type MetaTemplate,
  type TemplateButton,
  type TemplateComponent,
} from '@/services/templates.service';
import { usePricingStore, formatARS } from '@/stores/pricing.store';
import { cashOutline } from 'ionicons/icons';
import { useAuditStore } from '@/stores/audit.store';
import { useUsersStore } from '@/stores/users.store';

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [t, setT] = useState<MetaTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try GET by ID first (lightweight). Fallback to list if it fails.
      try {
        const one = await templatesService.get(id);
        setT(one);
      } catch {
        const res = await templatesService.list();
        const found = (res.data ?? []).find((x) => x.id === id) ?? null;
        if (!found) throw new Error('Plantilla no encontrada');
        setT(found);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!t) return;
    if (!confirm(`¿Eliminar la plantilla "${t.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      await templatesService.remove(t.name);
      history.push('/templates');
    } catch (e) {
      alert('No se pudo eliminar: ' + (e as Error).message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="lid-page lid-fade-up">
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon">
            <IonIcon icon={refreshOutline} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <p className="lid-empty-title">Cargando plantilla…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !t) {
    return (
      <div className="lid-page lid-fade-up">
        <button className="lid-icon-btn" onClick={() => history.push('/templates')} style={{ marginBottom: 16 }}>
          <IonIcon icon={arrowBackOutline} />
        </button>
        <div className="lid-card" style={{ borderColor: 'var(--lid-pink-500)', background: 'var(--lid-pink-50)' }}>
          <div className="lid-row" style={{ gap: 10 }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: 22, color: 'var(--lid-pink-600)' }} />
            <div>
              <strong style={{ color: 'var(--lid-pink-600)' }}>No pudimos cargar la plantilla</strong>
              <div className="lid-muted" style={{ fontSize: 13, marginTop: 4 }}>{error ?? 'Plantilla no encontrada'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sm = statusMeta(t.status);
  const header = t.components?.find((c) => c.type === 'HEADER');
  const body = t.components?.find((c) => c.type === 'BODY');
  const footer = t.components?.find((c) => c.type === 'FOOTER');
  const buttons = t.components?.find((c) => c.type === 'BUTTONS')?.buttons ?? [];

  return (
    <div className="lid-page lid-fade-up" style={{ maxWidth: 1100 }}>
      <button className="lid-icon-btn" onClick={() => history.push('/templates')} style={{ marginBottom: 16 }}>
        <IonIcon icon={arrowBackOutline} />
      </button>

      {/* Header: status + name + actions */}
      <div className="lid-card" style={{
        padding: 20,
        marginBottom: 20,
        borderLeft: `4px solid ${sm.color}`,
        background: `linear-gradient(135deg, #ffffff 0%, ${sm.bg} 100%)`,
      }}>
        <div className="lid-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="lid-row" style={{ gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 999,
                background: '#fff',
                border: `1px solid ${sm.color}55`,
                color: sm.fg,
                fontWeight: 700,
                fontSize: 12,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 999,
                  background: sm.color,
                  boxShadow: `0 0 0 4px ${sm.color}33`,
                }} />
                {sm.label}
              </div>
              <span className={categoryBadgeClass(t.category)}>{t.category}</span>
            </div>
            <h1 className="lid-page-title" style={{ margin: 0, wordBreak: 'break-word' }}>{t.name}</h1>
            <div className="lid-muted" style={{ fontSize: 12, marginTop: 6, fontFamily: 'monospace' }}>
              ID: {t.id}
            </div>
            <CreatorRow templateName={t.name} />
            <PricePerMessage category={t.category} />
          </div>
          <button
            className="lid-icon-btn"
            onClick={handleDelete}
            disabled={deleting}
            title="Eliminar plantilla"
            style={{ color: 'var(--lid-pink-600)', borderColor: 'var(--lid-pink-200)', width: 'auto', padding: '0 14px', gap: 6 }}
          >
            <IonIcon icon={trashOutline} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{deleting ? 'Eliminando…' : 'Eliminar'}</span>
          </button>
        </div>

        {t.status === 'REJECTED' && t.rejected_reason && t.rejected_reason !== 'NONE' && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: 'var(--lid-pink-50)',
            border: '1px solid var(--lid-pink-200)',
            borderRadius: 10,
            fontSize: 13,
            color: 'var(--lid-pink-600)',
          }}>
            <strong>Motivo del rechazo:</strong> {t.rejected_reason}
          </div>
        )}
      </div>

      {/* Two columns: preview + components */}
      <div className="lid-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
        {/* WA preview */}
        <div className="lid-card" style={{ padding: 20 }}>
          <div className="lid-row" style={{ gap: 8, marginBottom: 14 }}>
            <IonIcon icon={logoWhatsapp} style={{ fontSize: 20, color: '#25D366' }} />
            <h3 className="lid-h3">Cómo se ve en WhatsApp</h3>
          </div>
          <WhatsAppPreview t={t} />
        </div>

        {/* Components breakdown */}
        <div className="lid-col" style={{ gap: 14 }}>
          {header && <ComponentBlock title="Header" component={header} />}
          {body && <ComponentBlock title="Body" component={body} />}
          {footer && <ComponentBlock title="Footer" component={footer} />}
          {buttons.length > 0 && <ButtonsBlock buttons={buttons} />}
        </div>
      </div>
    </div>
  );
}

/* ========= WA preview ========= */

function WhatsAppPreview({ t }: { t: MetaTemplate }) {
  const header = t.components?.find((c) => c.type === 'HEADER');
  const body = t.components?.find((c) => c.type === 'BODY');
  const footer = t.components?.find((c) => c.type === 'FOOTER');
  const buttons = t.components?.find((c) => c.type === 'BUTTONS')?.buttons ?? [];
  const imageUrl = extractHeaderImageUrl(t);

  const headerText = header?.format === 'TEXT'
    ? fillVars(header.text ?? '', header.example?.header_text)
    : null;

  const bodyText = fillVars(body?.text ?? '', body?.example?.body_text?.[0]);

  return (
    <div style={{
      background: '#ECE5DD',
      borderRadius: 16,
      padding: 16,
      minHeight: 280,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px 12px 12px 4px',
        padding: header?.format === 'IMAGE' || header?.format === 'VIDEO' ? '4px 4px 10px' : '10px 12px 6px',
        maxWidth: '94%',
        boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
        fontSize: 14,
        color: 'var(--lid-gray-900)',
        lineHeight: 1.45,
        overflow: 'hidden',
      }}>
        {imageUrl && (
          <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
            <img
              src={imageUrl}
              alt="Header"
              style={{ width: '100%', display: 'block', aspectRatio: '16 / 9', objectFit: 'cover' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        {header?.format === 'VIDEO' && !imageUrl && <MediaPlaceholder kind="VIDEO" />}
        {header?.format === 'DOCUMENT' && !imageUrl && <MediaPlaceholder kind="DOCUMENT" />}

        <div style={{ padding: header?.format === 'IMAGE' || header?.format === 'VIDEO' ? '0 8px' : 0 }}>
          {headerText && (
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{headerText}</div>
          )}

          <div style={{ whiteSpace: 'pre-wrap' }}>{bodyText || '—'}</div>

          {footer?.text && (
            <div style={{ fontSize: 11, color: 'var(--lid-gray-500)', marginTop: 8 }}>
              {footer.text}
            </div>
          )}

          <div style={{ fontSize: 10, color: 'var(--lid-gray-400)', textAlign: 'right', marginTop: 4 }}>
            14:32 ✓✓
          </div>
        </div>
      </div>

      {buttons.length > 0 && (
        <div className="lid-col" style={{ gap: 4, marginTop: 8 }}>
          {buttons.map((b, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14,
              color: '#0477E1',
              fontWeight: 500,
              textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 1px 1px rgba(0,0,0,0.06)',
            }}>
              {b.type === 'URL' && <IonIcon icon={openOutline} />}
              {b.type === 'PHONE_NUMBER' && <IonIcon icon={callOutline} />}
              {b.type === 'QUICK_REPLY' && <IonIcon icon={returnDownForwardOutline} />}
              {b.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MediaPlaceholder({ kind }: { kind: 'VIDEO' | 'DOCUMENT' | 'IMAGE' }) {
  const icon = kind === 'VIDEO' ? videocamOutline : kind === 'DOCUMENT' ? documentOutline : imageOutline;
  return (
    <div style={{
      background: 'var(--lid-gray-100)',
      aspectRatio: '16 / 9',
      display: 'grid', placeItems: 'center',
      color: 'var(--lid-gray-400)',
      borderRadius: 10,
      marginBottom: 8,
    }}>
      <div style={{ textAlign: 'center' }}>
        <IonIcon icon={icon} style={{ fontSize: 36 }} />
        <div className="lid-muted" style={{ fontSize: 11, marginTop: 4 }}>Media: {kind}</div>
      </div>
    </div>
  );
}

function fillVars(text: string, examples?: string[]): string {
  if (!examples || examples.length === 0) return text;
  let out = text;
  examples.forEach((val, i) => {
    out = out.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, 'g'), val);
  });
  return out;
}

/* ========= Component blocks ========= */

function ComponentBlock({ title, component }: { title: string; component: TemplateComponent }) {
  const examples: string[] =
    component.example?.body_text?.[0] ??
    component.example?.header_text ??
    [];

  return (
    <div className="lid-card" style={{ padding: 16 }}>
      <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="lid-row" style={{ gap: 8 }}>
          <strong style={{ fontSize: 14 }}>{title}</strong>
          {component.format && (
            <span className="lid-badge lid-badge-gray" style={{ fontSize: 10 }}>
              {component.format}
            </span>
          )}
        </div>
        {component.text && (
          <button
            className="lid-icon-btn"
            style={{ width: 28, height: 28 }}
            onClick={() => navigator.clipboard?.writeText(component.text ?? '')}
            title="Copiar texto"
          >
            <IonIcon icon={copyOutline} style={{ fontSize: 14 }} />
          </button>
        )}
      </div>

      {component.text && (
        <div style={{
          background: 'var(--lid-gray-50)',
          borderRadius: 8,
          padding: 10,
          fontSize: 13,
          color: 'var(--lid-gray-700)',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          lineHeight: 1.5,
        }}>
          {component.text}
        </div>
      )}

      {examples.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 6 }}>
            Ejemplos
          </div>
          <div className="lid-col" style={{ gap: 4 }}>
            {examples.map((ex, i) => (
              <div key={i} className="lid-row" style={{ gap: 8, fontSize: 12 }}>
                <span className="lid-badge lid-badge-violet" style={{ minWidth: 40, justifyContent: 'center' }}>
                  {`{{${i + 1}}}`}
                </span>
                <span style={{ color: 'var(--lid-gray-700)' }}>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreatorRow({ templateName }: { templateName: string }) {
  const audit = useAuditStore((s) => s.templateCreatorOf(templateName));
  const creator = useUsersStore((s) => (audit ? s.findById(audit.createdByUserId) : null));
  if (!audit || !creator) return null;
  return (
    <div className="lid-row" style={{ gap: 8, marginTop: 10 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: creator.avatarColor, color: '#fff',
        display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11,
      }}>
        {creator.name.slice(0, 1)}
      </div>
      <span style={{ fontSize: 12, color: 'var(--lid-gray-600)' }}>
        Creada por <strong style={{ color: 'var(--lid-gray-900)' }}>{creator.name}</strong>
        <span className="lid-muted"> · {new Date(audit.createdAt).toLocaleDateString('es-AR')}</span>
      </span>
    </div>
  );
}

function PricePerMessage({ category }: { category: MetaTemplate['category'] }) {
  const rate = usePricingStore((s) => s.ratesARS[category]);
  return (
    <div className="lid-row" style={{ gap: 6, marginTop: 10, fontSize: 13 }}>
      <IonIcon icon={cashOutline} style={{ color: 'var(--lid-violet-600)' }} />
      <strong className="lid-brand-text" style={{ fontSize: 15 }}>{formatARS(rate)}</strong>
      <span className="lid-muted">por mensaje enviado</span>
    </div>
  );
}

function ButtonsBlock({ buttons }: { buttons: TemplateButton[] }) {
  return (
    <div className="lid-card" style={{ padding: 16 }}>
      <strong style={{ fontSize: 14, display: 'block', marginBottom: 10 }}>Botones</strong>
      <div className="lid-col" style={{ gap: 8 }}>
        {buttons.map((b, i) => (
          <div key={i} className="lid-row" style={{
            padding: 10,
            background: 'var(--lid-gray-50)',
            borderRadius: 8,
            gap: 10,
            fontSize: 13,
          }}>
            <span className="lid-badge lid-badge-blue" style={{ fontSize: 10 }}>{b.type}</span>
            <strong style={{ flex: 1 }}>{b.text}</strong>
            {b.url && <span className="lid-muted" style={{ fontSize: 11, fontFamily: 'monospace' }}>{b.url}</span>}
            {b.phone_number && <span className="lid-muted" style={{ fontSize: 11 }}>{b.phone_number}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
