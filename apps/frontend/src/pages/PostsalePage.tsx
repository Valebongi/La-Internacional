import { useEffect, useMemo, useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  qrCodeOutline, checkmarkCircle, timeOutline, refreshOutline,
  closeOutline, sendOutline, checkmarkCircleOutline, alertCircleOutline,
  playOutline, peopleOutline, heartOutline, informationCircleOutline,
} from 'ionicons/icons';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';
import { useCrmStore, type Client } from '@/stores/crm.store';
import { templatesService, type MetaTemplate } from '@/services/templates.service';
import { messagesService } from '@/services/messages.service';
import { usePostsaleConfigStore, POSTSALE_STATIC } from '@/stores/postsale-config.store';

const TEST_PHONE = import.meta.env.VITE_META_TEST_PHONE;
const MAX_BATCH = 20;

/* ── Tipos de acción fija ───────────────────────────── */

type ActionId = 'postventa' | 'recuperar';

interface PostsaleAction {
  id: ActionId;
  label: string;
  description: string;
  badgeCls: string;
  icon: string;
  intervalDays: number;
  templateName: string;
  filter(clients: Client[]): Client[];
}

/* ── Sesiones mock (hasta que haya backend) ─────────── */

type SessionStatus = 'connected' | 'qr-required' | 'disconnected';
interface SessionData {
  advisorId: string; advisor: string; color: string;
  status: SessionStatus; lastActivity: string; msgsToday: number;
}

const MOCK_SESSIONS: SessionData[] = [
  { advisorId: 'a_sofia', advisor: 'Sofía', color: '#7C3AED', status: 'connected',    lastActivity: 'hace 2 min',  msgsToday: 38 },
  { advisorId: 'a_carla', advisor: 'Carla', color: '#2563EB', status: 'connected',    lastActivity: 'hace 8 min',  msgsToday: 24 },
  { advisorId: 'a_julia', advisor: 'Julia', color: '#0EA5E9', status: 'qr-required',  lastActivity: 'hace 1 h',    msgsToday: 0  },
  { advisorId: 'a_lu',    advisor: 'Lu',    color: '#EC4899', status: 'connected',    lastActivity: 'hace 15 min', msgsToday: 19 },
  { advisorId: 'a_mica',  advisor: 'Mica',  color: '#10B981', status: 'disconnected', lastActivity: 'ayer',        msgsToday: 0  },
];

/* ── Página principal ────────────────────────────────── */

export default function PostsalePage() {
  const { user } = useAuth();
  const admin = isAdmin(user);
  const clients = useCrmStore((s) => s.clients);
  const postventaActive = usePostsaleConfigStore((s) => s.postventaActive);
  const recuperarActive = usePostsaleConfigStore((s) => s.recuperarActive);
  const togglePostventa = usePostsaleConfigStore((s) => s.togglePostventa);
  const toggleRecuperar = usePostsaleConfigStore((s) => s.toggleRecuperar);

  const [running, setRunning] = useState<ActionId | null>(null);

  const visibleSessions = useMemo(
    () => (admin ? MOCK_SESSIONS : MOCK_SESSIONS.filter((s) => s.advisorId === user?.advisorId)),
    [admin, user],
  );

  const actions: PostsaleAction[] = useMemo(() => {
    const { postventa, recuperar } = POSTSALE_STATIC;
    return [
      {
        id: 'postventa',
        label: 'Post-Venta',
        description: 'Seguimiento para clientes que compraron recientemente.',
        badgeCls: 'lid-badge lid-badge-success',
        icon: heartOutline,
        intervalDays: postventa.intervalDays,
        templateName: postventa.templateName,
        filter: (list) => list.filter((c) => c.state === 'Comprado').slice(0, MAX_BATCH),
      },
      {
        id: 'recuperar',
        label: 'Recuperar Cliente',
        description: `Reactivación para clientes sin actividad de ${recuperar.intervalDays}+ días.`,
        badgeCls: 'lid-badge lid-badge-violet',
        icon: peopleOutline,
        intervalDays: recuperar.intervalDays,
        templateName: recuperar.templateName,
        filter: (list) => {
          const cutoff = Date.now() - recuperar.intervalDays * 86_400_000;
          return list
            .filter((c) => c.state !== 'Comprado' && new Date(c.createdAt).getTime() < cutoff)
            .slice(0, MAX_BATCH);
        },
      },
    ];
  }, []);

  const activeStates: Record<ActionId, boolean> = { postventa: postventaActive, recuperar: recuperarActive };
  const toggles: Record<ActionId, () => void> = { postventa: togglePostventa, recuperar: toggleRecuperar };

  const activeAction = running ? actions.find((a) => a.id === running) ?? null : null;

  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Post-Venta</h1>
          <p className="lid-page-subtitle">
            Enviá mensajes de seguimiento a los clientes correctos con un clic.
          </p>
        </div>
      </div>

      {/* Acciones fijas */}
      <div className="lid-grid lid-grid-2" style={{ marginBottom: 40 }}>
        {actions.map((action) => {
          const matching = action.filter(clients);
          return (
            <ActionCard
              key={action.id}
              action={action}
              clientCount={matching.length}
              active={activeStates[action.id]}
              onToggle={toggles[action.id]}
              onRun={() => setRunning(action.id)}
            />
          );
        })}
      </div>

      {/* Sesiones */}
      <h3 className="lid-h2" style={{ marginBottom: 12 }}>Sesiones {admin ? 'activas' : ''}</h3>
      <div className="lid-grid lid-grid-3">
        {visibleSessions.length === 0 ? (
          <div className="lid-muted" style={{ fontSize: 13 }}>Todavía no tenés sesión de WA asignada.</div>
        ) : (
          visibleSessions.map((s) => <SessionCard key={s.advisorId} s={s} />)
        )}
      </div>

      {activeAction && (
        <PostsaleRunModal
          action={activeAction}
          clients={clients}
          onClose={() => setRunning(null)}
        />
      )}
    </div>
  );
}

/* ── ActionCard ─────────────────────────────────────── */

function ActionCard({
  action, clientCount, active, onToggle, onRun,
}: {
  action: PostsaleAction;
  clientCount: number;
  active: boolean;
  onToggle(): void;
  onRun(): void;
}) {
  return (
    <div className="lid-card" style={{ display: 'flex', flexDirection: 'column', gap: 14, opacity: active ? 1 : 0.6, transition: 'opacity 0.2s' }}>
      {/* Header */}
      <div className="lid-row" style={{ justifyContent: 'space-between' }}>
        <div className="lid-row" style={{ gap: 8 }}>
          <span className={action.badgeCls}>{action.label}</span>
          {active
            ? <span className="lid-badge lid-badge-success">Activa</span>
            : <span className="lid-badge lid-badge-gray">Pausada</span>
          }
        </div>
        <IonIcon icon={action.icon} style={{ fontSize: 22, color: 'var(--lid-violet-400)' }} />
      </div>

      <p style={{ margin: 0, fontSize: 13, color: 'var(--lid-gray-700)', lineHeight: 1.5 }}>
        {action.description}
      </p>

      {/* Config estática */}
      <div style={{
        padding: '10px 14px', borderRadius: 10,
        background: 'var(--lid-gray-50)', border: '1px solid var(--lid-gray-100)',
        fontSize: 12,
      }}>
        <div className="lid-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <span className="lid-muted">Plantilla: </span>
            <strong style={{ color: 'var(--lid-gray-800)' }}>{action.templateName}</strong>
          </div>
          <div style={{
            padding: '3px 10px', borderRadius: 999,
            background: 'var(--lid-violet-100)', color: 'var(--lid-violet-700)',
            fontWeight: 700, fontSize: 11,
          }}>
            Cada {action.intervalDays} días
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="lid-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ fontSize: 13, color: 'var(--lid-gray-600)' }}>
          <strong style={{ fontSize: 20, fontWeight: 800, color: active ? 'var(--lid-violet-600)' : 'var(--lid-gray-400)' }}>
            {clientCount}
          </strong>
          {' '}clientes elegibles
        </div>
        <div className="lid-row" style={{ gap: 8 }}>
          <button
            className="lid-icon-btn"
            onClick={onToggle}
            style={{ width: 'auto', padding: '0 14px', fontSize: 12, fontWeight: 600 }}
          >
            {active ? 'Pausar' : 'Reactivar'}
          </button>
          <button
            className="lid-btn-gradient"
            onClick={onRun}
            style={{ padding: '0 14px', fontSize: 13 }}
            disabled={!active || clientCount === 0}
          >
            <IonIcon icon={playOutline} style={{ marginRight: 6, verticalAlign: '-2px' }} />
            Enviar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── PostsaleRunModal ────────────────────────────────── */

type RunPhase = 'preview' | 'sending' | 'done';
interface RunResult { name: string; ok: boolean; error?: string }

function PostsaleRunModal({
  action, clients, onClose,
}: {
  action: PostsaleAction;
  clients: Client[];
  onClose(): void;
}) {
  const [template, setTemplate] = useState<MetaTemplate | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(true);
  const [phase, setPhase] = useState<RunPhase>('preview');
  const [results, setResults] = useState<RunResult[]>([]);
  const [progress, setProgress] = useState(0);

  const matchingClients = useMemo(() => action.filter(clients), [action, clients]);

  useEffect(() => {
    setLoadingTemplate(true);
    templatesService.list()
      .then((r) => {
        const found = (r.data ?? []).find((t) => t.name === action.templateName && t.status === 'APPROVED');
        if (!found) throw new Error(`Plantilla "${action.templateName}" no encontrada o no aprobada`);
        setTemplate(found);
      })
      .catch((e) => setTemplateError((e as Error).message))
      .finally(() => setLoadingTemplate(false));
  }, [action.templateName]);

  const send = async () => {
    if (!template) return;
    setPhase('sending');
    setResults([]);
    setProgress(0);

    const header = template.components?.find((c) => c.type === 'HEADER');
    let headerMediaId: string | undefined;
    if (header?.format === 'IMAGE') {
      const imgUrl = header.example?.header_handle?.[0];
      if (imgUrl) {
        const r = await messagesService.resendHeaderMedia(imgUrl);
        if (r.ok) headerMediaId = r.mediaId;
      }
    }

    const targets = testMode
      ? [{ to: TEST_PHONE, name: 'Test', type: '', city: '' }]
      : matchingClients.map((c) => ({
          to: c.phone.replace(/^\+/, ''),
          name: c.name,
          type: c.type,
          city: c.city ?? '',
        }));

    const acc: RunResult[] = [];
    for (let i = 0; i < targets.length; i++) {
      const item = targets[i];
      const r = await messagesService.sendTemplate({
        to: item.to,
        template,
        variables: [item.name, item.type, item.city],
        headerMediaId,
      });
      acc.push({ name: testMode ? `Test → +${item.to}` : item.name, ok: r.ok, error: r.error });
      setResults([...acc]);
      setProgress(Math.round(((i + 1) / targets.length) * 100));
    }

    setPhase('done');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'grid', placeItems: 'center',
        padding: 20,
      }}
    >
      <div
        className="lid-card lid-fade-up"
        style={{ width: '100%', maxWidth: 520, maxHeight: '92vh', overflow: 'auto', padding: 24 }}
      >
        <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h3 className="lid-h2">{action.label}</h3>
            <p className="lid-muted" style={{ fontSize: 12, margin: '4px 0 0' }}>{action.description}</p>
          </div>
          {phase !== 'sending' && (
            <button className="lid-icon-btn" onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </button>
          )}
        </div>

        {/* Error cargando template */}
        {templateError && (
          <div className="lid-row" style={{ padding: 12, background: 'var(--lid-pink-50)', borderRadius: 8, gap: 8, fontSize: 13, color: 'var(--lid-pink-600)', marginBottom: 16 }}>
            <IonIcon icon={alertCircleOutline} />
            {templateError}
          </div>
        )}

        {loadingTemplate && (
          <div className="lid-muted" style={{ fontSize: 13, textAlign: 'center', padding: 20 }}>
            Cargando plantilla…
          </div>
        )}

        {!loadingTemplate && !templateError && template && (
          <div className="lid-col" style={{ gap: 16 }}>

            {/* Preview */}
            {phase === 'preview' && (
              <>
                {/* Info */}
                <div className="lid-col" style={{ gap: 6, padding: '12px 14px', background: 'var(--lid-gray-50)', borderRadius: 10, fontSize: 13 }}>
                  <div className="lid-row" style={{ gap: 8 }}>
                    <span className="lid-muted">Plantilla:</span>
                    <strong>{template.name}</strong>
                    <span className="lid-badge lid-badge-success" style={{ fontSize: 11 }}>APROBADA</span>
                  </div>
                  <div className="lid-row" style={{ gap: 8 }}>
                    <span className="lid-muted">Destinatarios:</span>
                    <strong>
                      {testMode ? '1 (modo test)' : `${matchingClients.length} clientes`}
                    </strong>
                  </div>
                </div>

                {/* Lista preview de clientes */}
                {!testMode && matchingClients.length > 0 && (
                  <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid var(--lid-gray-100)', borderRadius: 10 }}>
                    {matchingClients.map((c) => (
                      <div key={c.id} className="lid-row" style={{ padding: '8px 12px', gap: 10, borderBottom: '1px solid var(--lid-gray-50)', fontSize: 13 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                          background: 'var(--lid-violet-100)', color: 'var(--lid-violet-700)',
                          display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11,
                        }}>
                          {c.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                          <div className="lid-muted" style={{ fontSize: 11 }}>{c.type}{c.city ? ` · ${c.city}` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!testMode && matchingClients.length === 0 && (
                  <div className="lid-row" style={{ padding: 12, background: 'var(--lid-pink-50)', borderRadius: 8, gap: 8, fontSize: 12, color: 'var(--lid-pink-600)' }}>
                    <IonIcon icon={informationCircleOutline} />
                    No hay clientes que cumplan la condición ahora.
                  </div>
                )}

                {/* Toggle test */}
                <div
                  className="lid-card"
                  style={{
                    padding: 14, cursor: 'pointer',
                    background: testMode ? 'var(--lid-sky-50)' : 'var(--lid-pink-50)',
                    borderColor: testMode ? 'var(--lid-sky-200)' : 'var(--lid-pink-200)',
                  }}
                  onClick={() => setTestMode((v) => !v)}
                >
                  <div className="lid-row" style={{ justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: 13, color: testMode ? 'var(--lid-sky-700)' : 'var(--lid-pink-700)' }}>
                        {testMode ? 'Modo test activado' : 'Modo real'}
                      </strong>
                      <div className="lid-muted" style={{ fontSize: 12, marginTop: 2 }}>
                        {testMode ? `Todos los envíos van a +${TEST_PHONE}` : `Se enviarán ${matchingClients.length} mensajes reales`}
                      </div>
                    </div>
                    <div style={{
                      width: 38, height: 22, borderRadius: 999,
                      background: testMode ? 'var(--lid-sky-400)' : 'var(--lid-pink-500)',
                      position: 'relative', transition: 'background 0.2s',
                    }}>
                      <div style={{
                        position: 'absolute', top: 3,
                        left: testMode ? 3 : 19,
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                      }} />
                    </div>
                  </div>
                </div>

                <div className="lid-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
                  <button className="lid-icon-btn" onClick={onClose} style={{ width: 'auto', padding: '0 18px', fontSize: 13, fontWeight: 600 }}>
                    Cancelar
                  </button>
                  <button
                    className="lid-btn-gradient"
                    onClick={send}
                    disabled={!testMode && matchingClients.length === 0}
                  >
                    <IonIcon icon={sendOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
                    {testMode ? 'Enviar test' : `Enviar a ${matchingClients.length} clientes`}
                  </button>
                </div>
              </>
            )}

            {/* Enviando */}
            {phase === 'sending' && (
              <div className="lid-col" style={{ gap: 12, alignItems: 'center', padding: '12px 0' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Enviando… {progress}%</div>
                <div style={{ width: '100%', height: 8, borderRadius: 999, background: 'var(--lid-gray-100)' }}>
                  <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'var(--lid-violet-500)', transition: 'width 0.3s' }} />
                </div>
                <div className="lid-col" style={{ width: '100%', gap: 6, marginTop: 4 }}>
                  {results.map((r, i) => (
                    <div key={i} className="lid-row" style={{ gap: 8, fontSize: 13 }}>
                      <IonIcon icon={r.ok ? checkmarkCircleOutline : alertCircleOutline}
                        style={{ color: r.ok ? 'var(--lid-success)' : 'var(--lid-pink-500)', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{r.name}</span>
                      {!r.ok && <span className="lid-muted" style={{ fontSize: 11 }}>{r.error}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hecho */}
            {phase === 'done' && (
              <div className="lid-col" style={{ gap: 12 }}>
                <div className="lid-col" style={{ gap: 6 }}>
                  {results.map((r, i) => (
                    <div key={i} className="lid-row" style={{ gap: 8, fontSize: 13 }}>
                      <IonIcon icon={r.ok ? checkmarkCircleOutline : alertCircleOutline}
                        style={{ color: r.ok ? 'var(--lid-success)' : 'var(--lid-pink-500)', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{r.name}</span>
                      {!r.ok && <span className="lid-muted" style={{ fontSize: 11 }}>{r.error}</span>}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--lid-violet-50)', border: '1px solid var(--lid-violet-100)', fontSize: 13 }}>
                  <strong>{results.filter((r) => r.ok).length}</strong> enviados ·{' '}
                  <strong style={{ color: 'var(--lid-pink-600)' }}>{results.filter((r) => !r.ok).length}</strong> fallidos
                </div>
                <div className="lid-row" style={{ justifyContent: 'flex-end' }}>
                  <button className="lid-btn-gradient" onClick={onClose}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── SessionCard ─────────────────────────────────────── */

function SessionCard({ s }: { s: SessionData }) {
  const statusMeta = {
    connected:     { label: 'Conectada',    cls: 'lid-badge lid-badge-success' },
    'qr-required': { label: 'QR requerido', cls: 'lid-badge lid-badge-warning' },
    disconnected:  { label: 'Desconectada', cls: 'lid-badge lid-badge-gray' },
  }[s.status];

  return (
    <div className="lid-card">
      <div className="lid-row" style={{ justifyContent: 'space-between' }}>
        <div className="lid-row">
          <div className="lid-conv-avatar" style={{ background: s.color, width: 40, height: 40, fontSize: 14 }}>
            {s.advisor.slice(0, 1)}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{s.advisor}</div>
            <div className="lid-muted" style={{ fontSize: 12 }}>WA personal</div>
          </div>
        </div>
        <span className={statusMeta.cls}>{statusMeta.label}</span>
      </div>

      {s.status === 'qr-required' && (
        <div style={{
          marginTop: 16, padding: 20, borderRadius: 12,
          background: 'var(--lid-gray-50)', border: '1px dashed var(--lid-gray-300)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <IonIcon icon={qrCodeOutline} style={{ fontSize: 64, color: 'var(--lid-gray-400)' }} />
          <div className="lid-muted" style={{ fontSize: 12, textAlign: 'center' }}>
            Escaneá desde WhatsApp › Dispositivos vinculados
          </div>
        </div>
      )}

      <div className="lid-divider" />

      <div className="lid-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Mensajes hoy</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{s.msgsToday}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Última actividad</div>
          <div className="lid-row" style={{ gap: 4, fontSize: 13, justifyContent: 'flex-end' }}>
            <IonIcon icon={timeOutline} />
            {s.lastActivity}
          </div>
        </div>
      </div>

      {s.status !== 'connected' && (
        <button className="lid-icon-btn" style={{ width: '100%', marginTop: 14, gap: 8 }}>
          <IonIcon icon={refreshOutline} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Reintentar conexión</span>
        </button>
      )}
      {s.status === 'connected' && (
        <div className="lid-row" style={{ marginTop: 10, fontSize: 12, color: 'var(--lid-success)' }}>
          <IonIcon icon={checkmarkCircle} />
          <span>Enlazada</span>
        </div>
      )}
    </div>
  );
}
