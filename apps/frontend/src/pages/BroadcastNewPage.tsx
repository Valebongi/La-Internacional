import { useHistory } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  checkmarkCircle,
  peopleOutline,
  documentTextOutline,
  sendOutline,
  refreshOutline,
  alertCircleOutline,
  imageOutline,
  flaskOutline,
  logoWhatsapp,
  closeCircleOutline,
} from 'ionicons/icons';
import { CLIENT_TYPES, useCrmStore, type Client, type ClientType } from '@/stores/crm.store';
import {
  templatesService,
  extractHeaderImageUrl,
  type MetaTemplate,
} from '@/services/templates.service';
import { messagesService, type SendResult } from '@/services/messages.service';
import { formatPhonePretty } from '@/lib/phone';
import { usePricingStore, formatARS } from '@/stores/pricing.store';
import { useAuth } from '@/lib/auth-context';
import { useAuditStore } from '@/stores/audit.store';
import { scopeByAdvisor } from '@/lib/permissions';

const TEST_PHONE = import.meta.env.VITE_META_TEST_PHONE;
const MAX_SENDS_PER_RUN = 20;

const STEPS = [
  { id: 1, label: 'Segmento', icon: peopleOutline },
  { id: 2, label: 'Plantilla', icon: documentTextOutline },
  { id: 3, label: 'Confirmación', icon: sendOutline },
];

export default function BroadcastNewPage() {
  const history = useHistory();
  const [step, setStep] = useState(1);

  // Store
  const { user } = useAuth();
  const allClients = useCrmStore((s) => s.clients);
  const clients = useMemo(() => scopeByAdvisor(allClients, user), [allClients, user]);
  const advisorForType = useCrmStore((s) => s.advisorForType);
  const recordBroadcast = useAuditStore((s) => s.recordBroadcast);

  // Segment state
  const [selectedType, setSelectedType] = useState<ClientType | 'all'>('all');
  const [onlyRecent, setOnlyRecent] = useState(false);

  // Template state
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Send state
  const [testMode, setTestMode] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number } | null>(null);
  const [sendResults, setSendResults] = useState<Array<{ client: Client; result: SendResult }> | null>(null);

  useEffect(() => {
    if (step !== 2) return;
    setTemplatesLoading(true);
    setTemplatesError(null);
    templatesService
      .list()
      .then((r) => setTemplates(r.data ?? []))
      .catch((e) => setTemplatesError((e as Error).message))
      .finally(() => setTemplatesLoading(false));
  }, [step]);

  const autoAdvisor = useMemo(
    () => (selectedType !== 'all' ? advisorForType(selectedType) : null),
    [selectedType, advisorForType],
  );

  const rateFor = usePricingStore((s) => s.rateFor);

  const matchingClients = useMemo(() => {
    if (selectedType === 'all') return clients;
    return clients.filter((c) => c.type === selectedType);
  }, [clients, selectedType]);

  const approvedTemplates = useMemo(
    () => templates.filter((t) => t.status === 'APPROVED'),
    [templates],
  );

  const selectedTemplate = useMemo(
    () => approvedTemplates.find((t) => t.id === selectedTemplateId) ?? null,
    [approvedTemplates, selectedTemplateId],
  );

  const canContinue =
    (step === 1 && matchingClients.length > 0) ||
    (step === 2 && !!selectedTemplateId) ||
    step === 3;

  const handleSendAll = async () => {
    if (!selectedTemplate) return;
    const batch = matchingClients.slice(0, MAX_SENDS_PER_RUN);
    setSending(true);
    setSendResults(null);
    setSendProgress({ current: 0, total: batch.length });
    const results: Array<{ client: Client; result: SendResult }> = [];

    // Pre-step: si la plantilla tiene header imagen, subimos al /media endpoint
    // UNA vez y reutilizamos el mediaId en todo el batch. Meta no puede refetchear
    // las URLs firmadas de scontent.whatsapp.net en delivery, por eso re-subimos.
    let headerMediaId: string | undefined;
    const headerImageUrl = extractHeaderImageUrl(selectedTemplate);
    if (headerImageUrl) {
      const upload = await messagesService.resendHeaderMedia(headerImageUrl);
      if (!upload.ok) {
        setSending(false);
        setSendResults([{
          client: { id: '_pre', name: '— preparación —', phone: '', type: 'Cosmetóloga', advisorId: '', tags: [], state: 'Recibido', createdAt: '' } as Client,
          result: { ok: false, error: `No se pudo preparar la imagen del header: ${upload.error}` },
        }]);
        return;
      }
      headerMediaId = upload.mediaId;
    }

    for (let i = 0; i < batch.length; i++) {
      const client = batch[i];
      const destination = testMode ? TEST_PHONE : client.phone.replace(/^\+/, '');
      const variables = [client.name, client.type, client.city ?? ''].slice(0, 5);
      const result = await messagesService.sendTemplate({
        to: destination,
        template: selectedTemplate,
        variables,
        headerMediaId,
      });
      results.push({ client, result });
      setSendProgress({ current: i + 1, total: batch.length });
    }

    setSendResults(results);
    setSending(false);

    if (user && selectedTemplate) {
      const okCount = results.filter((r) => r.result.ok).length;
      const rate = rateFor(selectedTemplate.category);
      recordBroadcast({
        createdByUserId: user.id,
        advisorId: user.advisorId,
        templateName: selectedTemplate.name,
        templateCategory: selectedTemplate.category,
        segmentType: selectedType,
        recipientCount: batch.length,
        okCount,
        failedCount: results.length - okCount,
        testMode,
        totalCostARS: okCount * rate,
      });
    }
  };

  return (
    <div className="lid-page lid-fade-up" style={{ maxWidth: 1000 }}>
      <button className="lid-icon-btn" onClick={() => history.push('/broadcasts')} style={{ marginBottom: 16 }} title="Volver">
        <IonIcon icon={arrowBackOutline} />
      </button>

      <div className="lid-page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="lid-page-title">Nueva difusión</h1>
          <p className="lid-page-subtitle">Segmento → plantilla aprobada → envío. Cada tipo de cliente lo atiende una asesora fija.</p>
        </div>
      </div>

      <div className="lid-row" style={{ gap: 0, marginBottom: 28, alignItems: 'stretch' }}>
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="lid-row" style={{ flex: 1, alignItems: 'center' }}>
              <div className="lid-row" style={{ gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: done ? 'var(--lid-success)' : active ? 'var(--lid-brand-gradient)' : 'var(--lid-gray-100)',
                  color: done || active ? '#fff' : 'var(--lid-gray-500)',
                  display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13,
                  boxShadow: active ? 'var(--lid-shadow-glow)' : 'none',
                  transition: 'all 180ms',
                }}>
                  {done ? <IonIcon icon={checkmarkCircle} style={{ fontSize: 20 }} /> : s.id}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--lid-gray-400)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
                    Paso {s.id}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: active || done ? 'var(--lid-gray-900)' : 'var(--lid-gray-500)' }}>
                    {s.label}
                  </div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: done ? 'var(--lid-success)' : 'var(--lid-gray-200)', margin: '0 16px', transition: 'background 180ms' }} />
              )}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <SegmentStep
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onlyRecent={onlyRecent}
          setOnlyRecent={setOnlyRecent}
          matchingCount={matchingClients.length}
          autoAdvisor={autoAdvisor}
          allCount={clients.length}
        />
      )}

      {step === 2 && (
        <TemplateStep
          templates={approvedTemplates}
          loading={templatesLoading}
          error={templatesError}
          selectedId={selectedTemplateId}
          onSelect={setSelectedTemplateId}
          onReload={() => setStep(2)}
        />
      )}

      {step === 3 && (
        <ConfirmStep
          matchingCount={matchingClients.length}
          type={selectedType}
          advisor={autoAdvisor}
          template={selectedTemplate}
          testMode={testMode}
          setTestMode={setTestMode}
          sending={sending}
          sendProgress={sendProgress}
          sendResults={sendResults}
        />
      )}

      <div className="lid-row" style={{ justifyContent: 'flex-end', marginTop: 24, gap: 10 }}>
        {step > 1 && !sending && !sendResults && (
          <button className="lid-icon-btn" style={{ width: 'auto', padding: '0 18px', fontSize: 13, fontWeight: 600 }} onClick={() => setStep(step - 1)}>
            Atrás
          </button>
        )}
        {step < 3 && (
          <button className="lid-btn-gradient" onClick={() => setStep(step + 1)} disabled={!canContinue}>Continuar</button>
        )}
        {step === 3 && !sendResults && (
          <button
            className="lid-btn-gradient"
            onClick={handleSendAll}
            disabled={sending || !selectedTemplate || matchingClients.length === 0}
          >
            <IonIcon icon={sendOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            {sending
              ? `Enviando ${sendProgress?.current ?? 0} / ${sendProgress?.total ?? 0}…`
              : `Enviar ${Math.min(matchingClients.length, MAX_SENDS_PER_RUN)} mensaje${matchingClients.length === 1 ? '' : 's'}`}
          </button>
        )}
        {step === 3 && sendResults && (
          <button className="lid-btn-gradient" onClick={() => history.push('/broadcasts')}>
            Volver a difusiones
          </button>
        )}
      </div>
    </div>
  );
}

/* =================== Step 1: Segment =================== */

function SegmentStep({
  selectedType, setSelectedType, onlyRecent, setOnlyRecent, matchingCount, autoAdvisor, allCount,
}: {
  selectedType: ClientType | 'all';
  setSelectedType: (t: ClientType | 'all') => void;
  onlyRecent: boolean;
  setOnlyRecent: (v: boolean) => void;
  matchingCount: number;
  autoAdvisor: ReturnType<ReturnType<typeof useCrmStore.getState>['advisorForType']>;
  allCount: number;
}) {
  return (
    <div className="lid-card lid-col" style={{ gap: 20 }}>
      <div>
        <label className="lid-label">Tipo de cliente</label>
        <p className="lid-muted" style={{ fontSize: 12, marginTop: 0, marginBottom: 10 }}>
          Al elegir un tipo, la asesora responsable se auto-asigna (cada tipo tiene una asesora fija).
        </p>
        <div className="lid-grid" style={{ gridTemplateColumns: `repeat(${CLIENT_TYPES.length + 1}, 1fr)`, gap: 8 }}>
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`lid-card ${selectedType === 'all' ? 'lid-card-feature' : ''}`}
            style={{
              padding: 12, textAlign: 'center', cursor: 'pointer',
              borderColor: selectedType === 'all' ? 'var(--lid-violet-400)' : undefined,
            }}
          >
            <strong style={{ fontSize: 12 }}>Todas</strong>
            <div className="lid-muted" style={{ fontSize: 10, marginTop: 4 }}>{allCount} clientes</div>
          </button>
          {CLIENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`lid-card ${selectedType === t ? 'lid-card-feature' : ''}`}
              style={{
                padding: 12, textAlign: 'center', cursor: 'pointer',
                borderColor: selectedType === t ? 'var(--lid-violet-400)' : undefined,
              }}
            >
              <strong style={{ fontSize: 12 }}>{t}</strong>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="lid-label">Filtros adicionales</label>
        <div className="lid-row">
          <label className="lid-row" style={{ gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={onlyRecent} onChange={(e) => setOnlyRecent(e.target.checked)} />
            Solo con última compra en los últimos 30 días
          </label>
        </div>
      </div>

      <div className="lid-card lid-card-feature" style={{ marginTop: 4 }}>
        <div className="lid-row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="lid-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Clientes que matchean
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em' }} className="lid-brand-text">
              {matchingCount}
            </div>
            <div className="lid-muted" style={{ fontSize: 12 }}>
              de {allCount} total{allCount === 1 ? '' : 'es'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="lid-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Asesora responsable
            </div>
            {selectedType === 'all' ? (
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--lid-gray-500)' }}>Varias (según tipo)</div>
            ) : autoAdvisor ? (
              <div className="lid-row" style={{ justifyContent: 'flex-end', marginTop: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: autoAdvisor.color,
                  color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700,
                }}>
                  {autoAdvisor.name.slice(0, 1)}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{autoAdvisor.name}</div>
              </div>
            ) : (
              <div style={{ color: 'var(--lid-pink-600)', fontSize: 13 }}>Sin asesora asignada a este tipo</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== Step 2: Template =================== */

function TemplateStep({
  templates, loading, error, selectedId, onSelect, onReload,
}: {
  templates: MetaTemplate[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReload: () => void;
}) {
  if (loading) {
    return (
      <div className="lid-card lid-empty">
        <div className="lid-empty-icon">
          <IonIcon icon={refreshOutline} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
        <p className="lid-empty-title">Cargando plantillas aprobadas…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lid-card" style={{ background: 'var(--lid-pink-50)', borderColor: 'var(--lid-pink-200)' }}>
        <div className="lid-row" style={{ gap: 10 }}>
          <IonIcon icon={alertCircleOutline} style={{ color: 'var(--lid-pink-600)', fontSize: 22 }} />
          <div>
            <strong style={{ color: 'var(--lid-pink-600)' }}>Error al cargar</strong>
            <div className="lid-muted" style={{ fontSize: 13, marginTop: 4 }}>{error}</div>
            <button className="lid-icon-btn" onClick={onReload} style={{ marginTop: 10, width: 'auto', padding: '0 14px', fontSize: 12, gap: 6 }}>
              <IonIcon icon={refreshOutline} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="lid-card lid-empty">
        <div className="lid-empty-icon"><IonIcon icon={documentTextOutline} /></div>
        <p className="lid-empty-title">No hay plantillas aprobadas</p>
        <p className="lid-empty-sub">
          Solo las plantillas con estado <strong>APPROVED</strong> se pueden usar para difusiones. Creá una nueva o esperá la aprobación de Meta.
        </p>
      </div>
    );
  }

  return (
    <div className="lid-grid lid-grid-2">
      {templates.map((t) => {
        const body = t.components?.find((c) => c.type === 'BODY')?.text ?? '—';
        const imageUrl = extractHeaderImageUrl(t);
        const isSelected = t.id === selectedId;

        return (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`lid-card lid-card-interactive ${isSelected ? 'lid-card-feature' : ''}`}
            style={{
              padding: 16, cursor: 'pointer',
              borderColor: isSelected ? 'var(--lid-violet-500)' : undefined,
              borderWidth: isSelected ? 2 : 1,
            }}
          >
            <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="lid-badge lid-badge-success">Aprobada</span>
              {imageUrl && <IonIcon icon={imageOutline} style={{ color: 'var(--lid-violet-600)' }} />}
            </div>
            <strong style={{ display: 'block', marginBottom: 8 }}>{t.name}</strong>
            {imageUrl && (
              <div style={{ height: 80, borderRadius: 8, overflow: 'hidden', marginBottom: 8, background: 'var(--lid-gray-100)' }}>
                <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <p className="lid-muted" style={{
              fontSize: 12, margin: 0, whiteSpace: 'pre-wrap',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {body}
            </p>
            {isSelected && (
              <div className="lid-row" style={{ marginTop: 10, color: 'var(--lid-violet-700)', fontSize: 12, fontWeight: 600 }}>
                <IonIcon icon={checkmarkCircle} />
                Seleccionada
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =================== Step 3: Confirm =================== */

function ConfirmStep({
  matchingCount, type, advisor, template,
  testMode, setTestMode, sending, sendProgress, sendResults,
}: {
  matchingCount: number;
  type: ClientType | 'all';
  advisor: ReturnType<ReturnType<typeof useCrmStore.getState>['advisorForType']>;
  template: MetaTemplate | null;
  testMode: boolean;
  setTestMode: (v: boolean) => void;
  sending: boolean;
  sendProgress: { current: number; total: number } | null;
  sendResults: Array<{ client: Client; result: SendResult }> | null;
}) {
  const cappedCount = Math.min(matchingCount, MAX_SENDS_PER_RUN);
  const rateFor2 = usePricingStore((s) => s.rateFor);
  const costPerMessage = template ? rateFor2(template.category) : 0;
  const estimatedCostCapped = cappedCount * costPerMessage;
  const estimatedCostFull = matchingCount * costPerMessage;
  const body = template?.components?.find((c) => c.type === 'BODY')?.text ?? '—';
  const imageUrl = template ? extractHeaderImageUrl(template) : null;

  return (
    <div className="lid-col" style={{ gap: 16 }}>
      {/* Test mode banner */}
      <div className="lid-card" style={{
        padding: 16,
        borderLeft: '4px solid var(--lid-sky-500)',
        background: 'linear-gradient(135deg, var(--lid-sky-50) 0%, #ffffff 100%)',
      }}>
        <div className="lid-row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="lid-row" style={{ gap: 12, alignItems: 'flex-start' }}>
            <IonIcon icon={flaskOutline} style={{ fontSize: 24, color: 'var(--lid-sky-600)', marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: 14 }}>Modo prueba</strong>
              <div className="lid-muted" style={{ fontSize: 12, marginTop: 2 }}>
                {testMode ? (
                  <>
                    Los {cappedCount} envíos van a <strong style={{ color: 'var(--lid-sky-700)', fontFamily: 'monospace' }}>+{TEST_PHONE}</strong>. Los números reales de los clientes <strong>no reciben nada</strong>.
                  </>
                ) : (
                  <span style={{ color: 'var(--lid-pink-600)' }}>
                    ⚠ <strong>Modo REAL</strong>: los mensajes se envían a los números reales de los clientes. Pensalo dos veces.
                  </span>
                )}
              </div>
            </div>
          </div>
          <label className="lid-row" style={{ gap: 8, fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              disabled={sending || !!sendResults}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--lid-sky-600)' }}
            />
            <span style={{ fontWeight: 600 }}>{testMode ? 'Activado' : 'Desactivado'}</span>
          </label>
        </div>
      </div>

      {/* Cap warning si aplica */}
      {matchingCount > MAX_SENDS_PER_RUN && (
        <div className="lid-muted" style={{
          fontSize: 12,
          padding: 10,
          background: 'var(--lid-gray-50)',
          borderRadius: 8,
          textAlign: 'center',
        }}>
          ⓘ Se enviarán los primeros <strong>{MAX_SENDS_PER_RUN}</strong> de {matchingCount} matcheos (cap de seguridad).
        </div>
      )}

      {/* Main summary */}
      <div className="lid-card lid-card-feature">
        <h3 className="lid-h2" style={{ marginBottom: 16 }}>Resumen</h3>
        <div className="lid-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="lid-col" style={{ gap: 14 }}>
            <Info label="Tipo de cliente" value={type === 'all' ? 'Todas las categorías' : type} />
            <Info label="Asesora" value={advisor?.name ?? 'Varias'} color={advisor?.color} />
            <Info label="A enviar (capped)" value={String(cappedCount)} big />
            <Info
              label={template ? `Costo (${template.category})` : 'Costo'}
              value={template ? `${formatARS(costPerMessage)} / msg` : '—'}
            />
            <Info label="Costo total capped" value={formatARS(estimatedCostCapped)} big />
            {matchingCount > cappedCount && (
              <Info
                label="Costo si enviaras a todos"
                value={`${formatARS(estimatedCostFull)} (${matchingCount} dest.)`}
              />
            )}
            <Info label="Plantilla" value={template?.name ?? '—'} />
          </div>
          {template && (
            <div className="lid-card" style={{ padding: 12, background: '#ECE5DD' }}>
              <div style={{
                background: '#fff', borderRadius: '12px 12px 12px 4px',
                padding: imageUrl ? '4px 4px 10px' : '10px 12px 6px',
                fontSize: 13, color: 'var(--lid-gray-900)', maxWidth: '96%',
                boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
              }}>
                {imageUrl && (
                  <img src={imageUrl} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, display: 'block', marginBottom: 6 }} />
                )}
                <div style={{ padding: imageUrl ? '0 8px' : 0, whiteSpace: 'pre-wrap' }}>{body}</div>
                <div style={{ fontSize: 10, color: 'var(--lid-gray-400)', textAlign: 'right', marginTop: 4 }}>
                  14:32
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      {sending && sendProgress && (
        <div className="lid-card">
          <div className="lid-row" style={{ gap: 10, marginBottom: 10 }}>
            <IonIcon icon={sendOutline} style={{ color: 'var(--lid-violet-600)', fontSize: 20 }} />
            <strong>Enviando {sendProgress.current} de {sendProgress.total}…</strong>
          </div>
          <div style={{ height: 6, background: 'var(--lid-gray-100)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(sendProgress.current / Math.max(sendProgress.total, 1)) * 100}%`,
              background: 'var(--lid-brand-gradient)',
              transition: 'width 200ms',
            }} />
          </div>
        </div>
      )}

      {/* Results */}
      {sendResults && <SendResultsPanel results={sendResults} testMode={testMode} />}
    </div>
  );
}

function SendResultsPanel({ results, testMode }: { results: Array<{ client: Client; result: SendResult }>; testMode: boolean }) {
  const ok = results.filter((r) => r.result.ok).length;
  const failed = results.length - ok;

  return (
    <div className="lid-col" style={{ gap: 12 }}>
      <div className="lid-grid lid-grid-2">
        <div className="lid-stat" style={{ borderColor: ok > 0 ? '#6EE7B7' : undefined }}>
          <div className="lid-stat-head">
            <span className="lid-stat-label">Enviados OK</span>
            <div className="lid-stat-icon" style={{ background: '#ECFDF5', color: '#047857' }}>
              <IonIcon icon={checkmarkCircle} />
            </div>
          </div>
          <div className="lid-stat-value" style={{ color: ok > 0 ? '#047857' : undefined }}>{ok}</div>
        </div>
        <div className="lid-stat" style={{ borderColor: failed > 0 ? 'var(--lid-pink-200)' : undefined }}>
          <div className="lid-stat-head">
            <span className="lid-stat-label">Fallidos</span>
            <div className="lid-stat-icon pink">
              <IonIcon icon={closeCircleOutline} />
            </div>
          </div>
          <div className="lid-stat-value" style={{ color: failed > 0 ? 'var(--lid-pink-600)' : undefined }}>{failed}</div>
        </div>
      </div>

      <div className="lid-card">
        <div className="lid-row" style={{ marginBottom: 12, gap: 8 }}>
          <IonIcon icon={logoWhatsapp} style={{ color: '#25D366', fontSize: 18 }} />
          <strong>Detalle por cliente</strong>
          {testMode && <span className="lid-badge lid-badge-sky">Todos enviados a {TEST_PHONE}</span>}
        </div>
        <div className="lid-col" style={{ gap: 4 }}>
          {results.map(({ client, result }, i) => (
            <div
              key={i}
              className="lid-row"
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: result.ok ? '#F0FDF4' : 'var(--lid-pink-50)',
                border: `1px solid ${result.ok ? '#BBF7D0' : 'var(--lid-pink-200)'}`,
                fontSize: 13,
              }}
            >
              <IonIcon
                icon={result.ok ? checkmarkCircle : closeCircleOutline}
                style={{ color: result.ok ? '#10B981' : 'var(--lid-pink-600)', fontSize: 18 }}
              />
              <div style={{ flex: 1 }}>
                <strong>{client.name}</strong>
                <span className="lid-muted" style={{ marginLeft: 8, fontFamily: 'monospace', fontSize: 12 }}>
                  {formatPhonePretty(client.phone)}
                </span>
              </div>
              {result.ok ? (
                <span className="lid-muted" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                  {result.messageId?.slice(-10) ?? 'ok'}
                </span>
              ) : (
                <span style={{ color: 'var(--lid-pink-700)', fontSize: 12, maxWidth: 360, textAlign: 'right' }}>
                  {result.error}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, big, color }: { label: string; value: string; big?: boolean; color?: string }) {
  return (
    <div>
      <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: big ? 22 : 15, fontWeight: 700, color: color ?? 'var(--lid-gray-900)' }}>{value}</div>
    </div>
  );
}
