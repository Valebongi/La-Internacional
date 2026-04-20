import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  sendOutline,
  logoWhatsapp,
  cloudUploadOutline,
  imageOutline,
  textOutline,
  trashOutline,
} from 'ionicons/icons';
import {
  templatesService,
  type CreateTemplateInput,
  type TemplateCategory,
  type TemplateComponent,
} from '@/services/templates.service';
import { usePricingStore, formatARS } from '@/stores/pricing.store';
import { cashOutline } from 'ionicons/icons';
import { useAuth } from '@/lib/auth-context';
import { useAuditStore } from '@/stores/audit.store';

const LANGUAGES = [
  { code: 'es_AR', label: 'Español (Argentina)' },
  { code: 'es', label: 'Español' },
  { code: 'es_MX', label: 'Español (México)' },
  { code: 'en_US', label: 'Inglés (US)' },
  { code: 'pt_BR', label: 'Portugués (Brasil)' },
];

const CATEGORIES: { value: TemplateCategory; label: string; desc: string }[] = [
  { value: 'MARKETING', label: 'Marketing', desc: 'Promociones, novedades, catálogos' },
  { value: 'UTILITY', label: 'Utility', desc: 'Confirmaciones, actualizaciones, recibos' },
  { value: 'AUTHENTICATION', label: 'Authentication', desc: 'Códigos de verificación (OTP)' },
];

const NAME_RX = /^[a-z0-9_]+$/;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE = 'image/jpeg,image/png';

type HeaderMode = 'none' | 'text' | 'image';

function extractVarCount(text: string): number {
  const matches = text.match(/\{\{(\d+)\}\}/g) ?? [];
  const nums = matches.map((m) => parseInt(m.slice(2, -2), 10));
  return nums.length ? Math.max(...nums) : 0;
}

export default function TemplateNewPage() {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const recordTemplateCreation = useAuditStore((s) => s.recordTemplateCreation);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('MARKETING');
  const [language, setLanguage] = useState('es_AR');
  const [headerMode, setHeaderMode] = useState<HeaderMode>('none');
  const [headerText, setHeaderText] = useState('');
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [uploadedHandle, setUploadedHandle] = useState<string | null>(null);
  const [body, setBody] = useState('Hola {{1}}! 💜 Tenemos la lista nueva de {{2}} disponible.');
  const [footer, setFooter] = useState('');
  const [examples, setExamples] = useState<string[]>(['Lucía', 'fulvic']);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; id?: string } | null>(null);

  const varCount = useMemo(() => extractVarCount(body), [body]);
  const nameValid = !name || NAME_RX.test(name);

  // Object URL cleanup
  useEffect(() => {
    return () => {
      if (headerPreview) URL.revokeObjectURL(headerPreview);
    };
  }, [headerPreview]);

  const handleImageSelect = (f: File | null) => {
    if (headerPreview) URL.revokeObjectURL(headerPreview);
    if (!f) {
      setHeaderFile(null);
      setHeaderPreview(null);
      setUploadedHandle(null);
      return;
    }
    if (!ACCEPTED_IMAGE.split(',').includes(f.type)) {
      setResult({ ok: false, message: 'Solo se acepta JPEG o PNG.' });
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setResult({ ok: false, message: 'La imagen supera los 5MB.' });
      return;
    }
    setHeaderFile(f);
    setHeaderPreview(URL.createObjectURL(f));
    setUploadedHandle(null);
    setResult(null);
  };

  const insertVar = () => {
    const next = varCount + 1;
    setBody((b) => b + `{{${next}}}`);
    setExamples((e) => [...e, '']);
  };

  const previewBody = useMemo(() => {
    let t = body;
    for (let i = 0; i < varCount; i++) {
      const rx = new RegExp(`\\{\\{${i + 1}\\}\\}`, 'g');
      t = t.replace(rx, examples[i] || `{{${i + 1}}}`);
    }
    return t;
  }, [body, examples, varCount]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!name || !NAME_RX.test(name)) {
      setResult({ ok: false, message: 'El nombre debe ser en minúsculas con _ o números. Ej: bienvenida_lid' });
      return;
    }
    if (!body.trim()) {
      setResult({ ok: false, message: 'El cuerpo del mensaje es obligatorio' });
      return;
    }
    if (varCount > 0 && examples.slice(0, varCount).some((x) => !x.trim())) {
      setResult({ ok: false, message: 'Cada variable necesita un ejemplo (Meta los usa al revisar)' });
      return;
    }
    if (headerMode === 'text' && !headerText.trim()) {
      setResult({ ok: false, message: 'El header de texto no puede estar vacío' });
      return;
    }
    if (headerMode === 'image' && !headerFile) {
      setResult({ ok: false, message: 'Subí una imagen o cambiá el header a "Sin header" / "Texto"' });
      return;
    }

    setSubmitting(true);
    try {
      // 1) Subir imagen si corresponde
      let headerHandle: string | null = uploadedHandle;
      if (headerMode === 'image' && headerFile && !headerHandle) {
        setUploadingImage(true);
        try {
          const up = await templatesService.uploadHeaderMedia(headerFile);
          headerHandle = up.handle;
          setUploadedHandle(up.handle);
        } finally {
          setUploadingImage(false);
        }
      }

      // 2) Armar components
      const components: TemplateComponent[] = [];

      if (headerMode === 'text') {
        components.push({ type: 'HEADER', format: 'TEXT', text: headerText.trim() });
      } else if (headerMode === 'image' && headerHandle) {
        components.push({
          type: 'HEADER',
          format: 'IMAGE',
          example: { header_handle: [headerHandle] },
        });
      }

      components.push({
        type: 'BODY',
        text: body,
        ...(varCount > 0
          ? { example: { body_text: [examples.slice(0, varCount).map((s) => s.trim())] } }
          : {}),
      });

      if (footer.trim()) components.push({ type: 'FOOTER', text: footer.trim() });

      const payload: CreateTemplateInput = { name, category, language, components };

      // 3) Crear plantilla
      const res = await templatesService.create(payload);
      if (user) recordTemplateCreation(name, user.id);
      setResult({
        ok: true,
        message: `Plantilla enviada. Estado inicial: ${res.status}. Meta la revisa en minutos.`,
        id: res.id,
      });
      setTimeout(() => history.push('/templates'), 1400);
    } catch (err) {
      setResult({ ok: false, message: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lid-page lid-fade-up" style={{ maxWidth: 1200 }}>
      <button className="lid-icon-btn" onClick={() => history.push('/templates')} style={{ marginBottom: 16 }} title="Volver">
        <IonIcon icon={arrowBackOutline} />
      </button>

      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Nueva plantilla</h1>
          <p className="lid-page-subtitle">Se envía a revisión de Meta apenas la guardás. Aprobación típica: minutos a pocas horas.</p>
        </div>
      </div>

      <div className="lid-grid" style={{ gridTemplateColumns: '1.3fr 1fr', alignItems: 'start' }}>
        <form onSubmit={onSubmit} className="lid-card lid-col" style={{ gap: 18 }}>
          <div>
            <label className="lid-label">Nombre interno</label>
            <input
              className="lid-input"
              placeholder="bienvenida_lid"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            />
            <div className="lid-muted" style={{ fontSize: 12, marginTop: 6 }}>
              {nameValid ? 'Solo minúsculas, números y guion bajo.' : (
                <span style={{ color: 'var(--lid-pink-600)' }}>Caracteres inválidos. Usá minúsculas, números y _.</span>
              )}
            </div>
          </div>

          <div>
            <label className="lid-label">Categoría</label>
            <div className="lid-grid lid-grid-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`lid-card ${category === c.value ? 'lid-card-feature' : ''}`}
                  style={{
                    padding: 14, textAlign: 'left', cursor: 'pointer',
                    borderColor: category === c.value ? 'var(--lid-violet-400)' : undefined,
                  }}
                >
                  <strong style={{ fontSize: 13 }}>{c.label}</strong>
                  <div className="lid-muted" style={{ fontSize: 11, marginTop: 4 }}>{c.desc}</div>
                </button>
              ))}
            </div>
            <CostPerMessageCard category={category} />
          </div>

          <div>
            <label className="lid-label">Idioma</label>
            <select className="lid-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label} — {l.code}</option>)}
            </select>
          </div>

          {/* ========= Header ========= */}
          <div>
            <label className="lid-label">Header (opcional)</label>
            <div className="lid-tabs" style={{ marginBottom: 12 }}>
              <button type="button" className={`lid-tab ${headerMode === 'none' ? 'active' : ''}`} onClick={() => setHeaderMode('none')}>Sin header</button>
              <button type="button" className={`lid-tab ${headerMode === 'text' ? 'active' : ''}`} onClick={() => setHeaderMode('text')}>
                <IonIcon icon={textOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />Texto
              </button>
              <button type="button" className={`lid-tab ${headerMode === 'image' ? 'active' : ''}`} onClick={() => setHeaderMode('image')}>
                <IonIcon icon={imageOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />Imagen
              </button>
            </div>

            {headerMode === 'text' && (
              <input
                className="lid-input"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Título del mensaje (máx. 60 caracteres)"
                maxLength={60}
              />
            )}

            {headerMode === 'image' && (
              <div>
                {!headerPreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: 24,
                      background: 'var(--lid-gray-50)',
                      border: '2px dashed var(--lid-gray-300)',
                      borderRadius: 12,
                      color: 'var(--lid-gray-600)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'inherit',
                      transition: 'border-color var(--lid-transition), background var(--lid-transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--lid-violet-400)';
                      e.currentTarget.style.background = 'var(--lid-violet-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--lid-gray-300)';
                      e.currentTarget.style.background = 'var(--lid-gray-50)';
                    }}
                  >
                    <IonIcon icon={cloudUploadOutline} style={{ fontSize: 32, color: 'var(--lid-violet-600)' }} />
                    <strong style={{ fontSize: 14, color: 'var(--lid-gray-900)' }}>Subir imagen</strong>
                    <span className="lid-muted" style={{ fontSize: 12 }}>JPEG o PNG, máx. 5MB</span>
                  </button>
                ) : (
                  <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: 'var(--lid-gray-100)' }}>
                    <img src={headerPreview} alt="Header preview" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }} />
                    <button
                      type="button"
                      onClick={() => handleImageSelect(null)}
                      title="Quitar imagen"
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 32, height: 32, borderRadius: 999,
                        background: 'rgba(15,23,42,0.7)', border: 'none', color: '#fff',
                        cursor: 'pointer', display: 'grid', placeItems: 'center',
                      }}
                    >
                      <IonIcon icon={trashOutline} />
                    </button>
                    {uploadedHandle && (
                      <div style={{
                        position: 'absolute', bottom: 8, left: 8,
                        padding: '4px 8px', borderRadius: 6,
                        background: 'rgba(16,185,129,0.95)', color: '#fff',
                        fontSize: 11, fontWeight: 600,
                      }}>
                        <IonIcon icon={checkmarkCircleOutline} style={{ verticalAlign: '-2px', marginRight: 4 }} />
                        Ya subida a Meta
                      </div>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE}
                  onChange={(e) => handleImageSelect(e.target.files?.[0] ?? null)}
                  style={{ display: 'none' }}
                />
                {headerFile && (
                  <div className="lid-muted" style={{ fontSize: 11, marginTop: 8 }}>
                    {headerFile.name} · {(headerFile.size / 1024).toFixed(0)} KB
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========= Body ========= */}
          <div>
            <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="lid-label" style={{ marginBottom: 0 }}>Cuerpo del mensaje</label>
              <button type="button" className="lid-badge lid-badge-violet" onClick={insertVar} style={{ border: 'none', cursor: 'pointer' }}>
                + Insertar variable {`{{${varCount + 1}}}`}
              </button>
            </div>
            <textarea
              className="lid-input"
              style={{ height: 140, padding: 14, resize: 'vertical', fontFamily: 'inherit' }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Hola {{1}}! Te paso..."
            />
            <div className="lid-muted" style={{ fontSize: 12, marginTop: 6 }}>
              Variables detectadas: <strong>{varCount}</strong>. Máximo 1024 caracteres.
            </div>
          </div>

          {varCount > 0 && (
            <div>
              <label className="lid-label">Valores de ejemplo (obligatorios para Meta)</label>
              <div className="lid-col" style={{ gap: 8 }}>
                {Array.from({ length: varCount }).map((_, i) => (
                  <div key={i} className="lid-row" style={{ gap: 10 }}>
                    <span className="lid-badge lid-badge-violet" style={{ minWidth: 48, justifyContent: 'center' }}>
                      {`{{${i + 1}}}`}
                    </span>
                    <input
                      className="lid-input"
                      placeholder={`Ejemplo para variable ${i + 1}`}
                      value={examples[i] ?? ''}
                      onChange={(e) => {
                        const next = [...examples];
                        next[i] = e.target.value;
                        setExamples(next);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="lid-label">Footer (opcional)</label>
            <input
              className="lid-input"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              placeholder="La Internacional"
              maxLength={60}
            />
          </div>

          {result && (
            <div className="lid-card" style={{
              padding: 14,
              background: result.ok ? '#ECFDF5' : 'var(--lid-pink-50)',
              borderColor: result.ok ? '#6EE7B7' : 'var(--lid-pink-400)',
            }}>
              <div className="lid-row" style={{ gap: 10, alignItems: 'flex-start' }}>
                <IonIcon
                  icon={result.ok ? checkmarkCircleOutline : alertCircleOutline}
                  style={{ fontSize: 22, color: result.ok ? '#059669' : 'var(--lid-pink-600)' }}
                />
                <div>
                  <strong style={{ color: result.ok ? '#059669' : 'var(--lid-pink-600)' }}>
                    {result.ok ? '¡Enviada a Meta!' : 'No se pudo crear'}
                  </strong>
                  <div className="lid-muted" style={{ fontSize: 13, marginTop: 4 }}>{result.message}</div>
                  {result.id && <div className="lid-muted" style={{ fontSize: 11, marginTop: 4 }}>ID: {result.id}</div>}
                </div>
              </div>
            </div>
          )}

          <div className="lid-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              className="lid-icon-btn"
              onClick={() => history.push('/templates')}
              style={{ width: 'auto', padding: '0 18px', fontSize: 13, fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button type="submit" className="lid-btn-gradient" disabled={submitting || uploadingImage}>
              <IonIcon icon={sendOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
              {uploadingImage ? 'Subiendo imagen…' : submitting ? 'Enviando a Meta…' : 'Enviar a revisión'}
            </button>
          </div>
        </form>

        {/* ============ Preview ============ */}
        <div className="lid-card" style={{ position: 'sticky', top: 20, padding: 20 }}>
          <div className="lid-row" style={{ gap: 8, marginBottom: 14 }}>
            <IonIcon icon={logoWhatsapp} style={{ fontSize: 20, color: '#25D366' }} />
            <h3 className="lid-h3">Preview del mensaje</h3>
          </div>

          <div style={{
            background: '#ECE5DD',
            borderRadius: 12,
            padding: 16,
            minHeight: 200,
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px 12px 12px 4px',
              padding: headerMode === 'image' ? '4px 4px 10px' : '10px 12px 6px',
              maxWidth: '94%',
              boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
              fontSize: 13,
              color: 'var(--lid-gray-900)',
              lineHeight: 1.5,
              overflow: 'hidden',
            }}>
              {headerMode === 'image' && headerPreview && (
                <img
                  src={headerPreview}
                  alt=""
                  style={{
                    width: '100%', height: 140, objectFit: 'cover',
                    display: 'block', borderRadius: 10, marginBottom: 8,
                  }}
                />
              )}
              {headerMode === 'image' && !headerPreview && (
                <div style={{
                  width: '100%', height: 120, borderRadius: 10, marginBottom: 8,
                  background: 'var(--lid-gray-100)',
                  display: 'grid', placeItems: 'center',
                  color: 'var(--lid-gray-400)',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <IonIcon icon={imageOutline} style={{ fontSize: 28 }} />
                    <div style={{ fontSize: 11, marginTop: 4 }}>Imagen del header</div>
                  </div>
                </div>
              )}

              <div style={{ padding: headerMode === 'image' ? '0 8px' : 0 }}>
                {headerMode === 'text' && headerText && (
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{headerText}</div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{previewBody || 'Tu mensaje va a aparecer acá...'}</div>
                {footer && (
                  <div style={{ fontSize: 11, color: 'var(--lid-gray-500)', marginTop: 6 }}>
                    {footer}
                  </div>
                )}
                <div style={{ fontSize: 10, color: 'var(--lid-gray-400)', textAlign: 'right', marginTop: 4 }}>
                  14:32
                </div>
              </div>
            </div>
          </div>

          <div className="lid-muted" style={{ fontSize: 12, marginTop: 14, lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--lid-gray-700)' }}>Tips:</strong>
            <ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>
              <li>Variables secuenciales desde {'{{1}}'}.</li>
              <li>Para imágenes: usá JPG/PNG rectangular, 800×418 o similar (ratio ~2:1).</li>
              <li>Aprobación: usualmente 1–30 minutos.</li>
            </ul>
          </div>
        </div>
      </div>
      <style>{`button:disabled { opacity: 0.5; cursor: not-allowed; }`}</style>
    </div>
  );
}

function CostPerMessageCard({ category }: { category: TemplateCategory }) {
  const rate = usePricingStore((s) => s.ratesARS[category]);
  const lastUpdated = usePricingStore((s) => s.lastUpdated);

  return (
    <div style={{
      marginTop: 12,
      padding: '12px 16px',
      borderRadius: 12,
      background: 'linear-gradient(135deg, var(--lid-sky-50) 0%, var(--lid-violet-50) 100%)',
      border: '1px solid var(--lid-violet-100)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: '#fff', border: '1px solid var(--lid-violet-200)',
        display: 'grid', placeItems: 'center',
        color: 'var(--lid-violet-600)',
      }}>
        <IonIcon icon={cashOutline} style={{ fontSize: 18 }} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          Costo por mensaje ({category})
        </div>
        <div className="lid-row" style={{ gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }} className="lid-brand-text">
            {formatARS(rate)}
          </span>
          <span className="lid-muted" style={{ fontSize: 11 }}>
            ARS · tarifa Meta para Argentina
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--lid-gray-500)' }}>
        Actualizado<br />
        {new Date(lastUpdated).toLocaleDateString('es-AR')}
      </div>
    </div>
  );
}
