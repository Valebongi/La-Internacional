import { useEffect, useMemo, useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  qrCodeOutline, checkmarkCircle, timeOutline, refreshOutline, addOutline,
  closeOutline, calendarOutline, personCircleOutline, trashOutline, documentTextOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';
import { useAuditStore } from '@/stores/audit.store';
import { useUsersStore } from '@/stores/users.store';
import { CLIENT_TYPES, useCrmStore, type ClientType } from '@/stores/crm.store';
import {
  useSequencesStore,
  triggerLabel,
  type Sequence,
  type SequenceTriggerKind,
} from '@/stores/sequences.store';
import { templatesService, type MetaTemplate } from '@/services/templates.service';

type SessionStatus = 'connected' | 'qr-required' | 'disconnected';

interface SessionData {
  advisorId: string;
  advisor: string;
  color: string;
  status: SessionStatus;
  lastActivity: string;
  msgsToday: number;
}

const MOCK_SESSIONS: SessionData[] = [
  { advisorId: 'a_sofia', advisor: 'Sofía', color: '#7C3AED', status: 'connected',   lastActivity: 'hace 2 min',  msgsToday: 38 },
  { advisorId: 'a_carla', advisor: 'Carla', color: '#2563EB', status: 'connected',   lastActivity: 'hace 8 min',  msgsToday: 24 },
  { advisorId: 'a_julia', advisor: 'Julia', color: '#0EA5E9', status: 'qr-required', lastActivity: 'hace 1 h',    msgsToday: 0 },
  { advisorId: 'a_lu',    advisor: 'Lu',    color: '#EC4899', status: 'connected',   lastActivity: 'hace 15 min', msgsToday: 19 },
  { advisorId: 'a_mica',  advisor: 'Mica',  color: '#10B981', status: 'disconnected',lastActivity: 'ayer',        msgsToday: 0 },
];

export default function PostsalePage() {
  const { user } = useAuth();
  const admin = isAdmin(user);
  const sequences = useSequencesStore((s) => s.sequences);
  const toggleActive = useSequencesStore((s) => s.toggleActive);
  const removeSeq = useSequencesStore((s) => s.remove);
  const [showForm, setShowForm] = useState(false);

  const visibleSessions = useMemo(
    () => (admin ? MOCK_SESSIONS : MOCK_SESSIONS.filter((s) => s.advisorId === user?.advisorId)),
    [admin, user],
  );

  const visibleSequences = useMemo(
    () => (admin ? sequences : sequences.filter((s) => s.createdByUserId === user?.id || s.advisorId === user?.advisorId)),
    [admin, sequences, user],
  );

  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">{admin ? 'Postventa automatizada' : 'Mi postventa'}</h1>
          <p className="lid-page-subtitle">
            {admin
              ? 'Sesiones WA personales de cada asesora + secuencias automáticas'
              : 'Tu sesión de WA y las secuencias que configuraste'}
          </p>
        </div>
      </div>

      <h3 className="lid-h2" style={{ marginBottom: 12 }}>Sesiones {admin ? 'activas' : ''}</h3>
      <div className="lid-grid lid-grid-3" style={{ marginBottom: 32 }}>
        {visibleSessions.length === 0 ? (
          <div className="lid-muted" style={{ fontSize: 13 }}>Todavía no tenés sesión de WA asignada.</div>
        ) : (
          visibleSessions.map((s) => <SessionCard key={s.advisorId} s={s} />)
        )}
      </div>

      <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="lid-h2">Secuencias configuradas</h3>
        <button className="lid-btn-gradient" onClick={() => setShowForm(true)} style={{ padding: '8px 14px', fontSize: 13 }}>
          <IonIcon icon={addOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
          Nueva secuencia
        </button>
      </div>

      {visibleSequences.length === 0 ? (
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon"><IonIcon icon={calendarOutline} /></div>
          <p className="lid-empty-title">Todavía no hay secuencias</p>
          <p className="lid-empty-sub">
            Armá una secuencia que se dispare automáticamente (post-compra, inactividad, cumpleaños…) para mantener el vínculo sin esfuerzo manual.
          </p>
          <button className="lid-btn-gradient" onClick={() => setShowForm(true)} style={{ marginTop: 10 }}>
            <IonIcon icon={addOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Crear primera secuencia
          </button>
        </div>
      ) : (
        <div className="lid-col" style={{ gap: 10 }}>
          {visibleSequences.map((seq) => (
            <SequenceCard key={seq.id} seq={seq} onToggle={() => toggleActive(seq.id)} onRemove={() => { if (confirm(`¿Eliminar "${seq.name}"?`)) removeSeq(seq.id); }} />
          ))}
        </div>
      )}

      {showForm && <SequenceFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}

/* =============== Session card =============== */

function SessionCard({ s }: { s: SessionData }) {
  const statusMeta = {
    connected:     { label: 'Conectada',     cls: 'lid-badge lid-badge-success' },
    'qr-required': { label: 'QR requerido',  cls: 'lid-badge lid-badge-warning' },
    disconnected:  { label: 'Desconectada',  cls: 'lid-badge lid-badge-gray' },
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
            Escaneá desde WhatsApp &gt; Dispositivos vinculados
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
      {s.status === 'connected' && <SessionSuccessIcon />}
    </div>
  );
}

function SessionSuccessIcon() {
  return (
    <div className="lid-row" style={{ marginTop: 10, fontSize: 12, color: 'var(--lid-success)' }}>
      <IonIcon icon={checkmarkCircle} />
      <span>Enlazada con Baileys</span>
    </div>
  );
}

/* =============== Sequence card =============== */

function SequenceCard({ seq, onToggle, onRemove }: { seq: Sequence; onToggle: () => void; onRemove: () => void }) {
  const creator = useUsersStore((s) => s.findById(seq.createdByUserId));
  const templateCreator = useAuditStore((s) => s.templateCreatorOf(seq.templateName));
  const templateCreatorUser = useUsersStore((s) => (templateCreator ? s.findById(templateCreator.createdByUserId) : null));

  return (
    <div className="lid-card">
      <div className="lid-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div className="lid-row" style={{ gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <strong style={{ fontSize: 15 }}>{seq.name}</strong>
            <span className="lid-badge lid-badge-violet">{triggerLabel(seq.trigger)}</span>
            {seq.active ? (
              <span className="lid-badge lid-badge-success">Activa</span>
            ) : (
              <span className="lid-badge lid-badge-gray">Pausada</span>
            )}
            {seq.restrictToType && (
              <span className="lid-badge lid-badge-pink">Solo {seq.restrictToType}</span>
            )}
          </div>
          <div className="lid-row" style={{ gap: 6, fontSize: 12, color: 'var(--lid-gray-500)', flexWrap: 'wrap' }}>
            <IonIcon icon={documentTextOutline} />
            <span>Plantilla: <strong style={{ color: 'var(--lid-gray-700)' }}>{seq.templateName}</strong></span>
            {templateCreatorUser && (
              <span className="lid-muted">(creada por {templateCreatorUser.name})</span>
            )}
          </div>
          {creator && (
            <div className="lid-row" style={{ gap: 6, fontSize: 12, color: 'var(--lid-gray-500)', marginTop: 4 }}>
              <IonIcon icon={personCircleOutline} />
              <span>Configurada por <strong style={{ color: 'var(--lid-gray-700)' }}>{creator.name}</strong></span>
              <span className="lid-muted">· {new Date(seq.createdAt).toLocaleDateString('es-AR')}</span>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', minWidth: 120 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }} className="lid-brand-text">{seq.sentThisMonth}</div>
          <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
            Enviados este mes
          </div>
        </div>
      </div>
      <div className="lid-row" style={{ gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
        <button className="lid-icon-btn" onClick={onToggle} style={{ width: 'auto', padding: '0 14px', fontSize: 12, fontWeight: 600, gap: 6 }}>
          {seq.active ? 'Pausar' : 'Reactivar'}
        </button>
        <button
          className="lid-icon-btn"
          onClick={onRemove}
          title="Eliminar"
          style={{ color: 'var(--lid-pink-600)', borderColor: 'var(--lid-pink-200)', width: 34, height: 34 }}
        >
          <IonIcon icon={trashOutline} />
        </button>
      </div>
    </div>
  );
}

/* =============== New sequence modal =============== */

function SequenceFormModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const admin = isAdmin(user);
  const create = useSequencesStore((s) => s.create);
  const advisors = useCrmStore((s) => s.advisors);

  const currentAdvisor = !admin ? advisors.find((a) => a.id === user?.advisorId) ?? null : null;
  const allowedTypes: ClientType[] = admin ? [...CLIENT_TYPES] : currentAdvisor?.clientTypes ?? [];

  const [name, setName] = useState('');
  const [triggerKind, setTriggerKind] = useState<SequenceTriggerKind>('post_purchase');
  const [days, setDays] = useState(7);
  const [templateName, setTemplateName] = useState<string>('');
  const [restrictToType, setRestrictToType] = useState<ClientType | ''>('');
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTemplatesLoading(true);
    templatesService
      .list()
      .then((r) => {
        const approved = (r.data ?? []).filter((t) => t.status === 'APPROVED');
        setTemplates(approved);
        if (approved.length > 0 && !templateName) setTemplateName(approved[0].name);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setTemplatesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needsDays = triggerKind === 'post_purchase' || triggerKind === 'inactivity' || triggerKind === 'custom_days';

  const onSubmit = () => {
    if (!user) return setError('Sin usuario');
    if (!name.trim()) return setError('Poné un nombre');
    if (!templateName) return setError('Elegí una plantilla');
    create({
      name: name.trim(),
      trigger: { kind: triggerKind, ...(needsDays ? { days } : {}) },
      templateName,
      active: true,
      createdByUserId: user.id,
      advisorId: user.advisorId,
      restrictToType: restrictToType || undefined,
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
        className="lid-card lid-fade-up"
        style={{ width: '100%', maxWidth: 580, maxHeight: '92vh', overflow: 'auto', padding: 24 }}
      >
        <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h3 className="lid-h2">Nueva secuencia</h3>
            <p className="lid-muted" style={{ fontSize: 12, margin: '4px 0 0' }}>
              Se dispara automáticamente cuando el cliente cumple la condición que elijas.
            </p>
          </div>
          <button className="lid-icon-btn" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <div className="lid-col" style={{ gap: 16 }}>
          <div>
            <label className="lid-label">Nombre</label>
            <input
              className="lid-input"
              placeholder="Seguimiento post-compra"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="lid-label">¿Cuándo se dispara?</label>
            <div className="lid-grid lid-grid-2" style={{ gap: 8 }}>
              {([
                { k: 'post_purchase', label: 'Post-compra', desc: 'X días después de comprar' },
                { k: 'inactivity',    label: 'Inactividad', desc: 'X días sin comprar' },
                { k: 'birthday',      label: 'Cumpleaños',  desc: 'el día de su cumple' },
                { k: 'custom_days',   label: 'Personalizado',desc: 'X días desde captura' },
              ] as const).map((opt) => (
                <button
                  key={opt.k}
                  type="button"
                  onClick={() => setTriggerKind(opt.k)}
                  className={`lid-card ${triggerKind === opt.k ? 'lid-card-feature' : ''}`}
                  style={{
                    padding: 12, textAlign: 'left', cursor: 'pointer',
                    borderColor: triggerKind === opt.k ? 'var(--lid-violet-400)' : undefined,
                  }}
                >
                  <strong style={{ fontSize: 13 }}>{opt.label}</strong>
                  <div className="lid-muted" style={{ fontSize: 11, marginTop: 4 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {needsDays && (
            <div>
              <label className="lid-label">Días</label>
              <input
                type="number"
                className="lid-input"
                style={{ maxWidth: 160 }}
                value={days}
                min={0}
                onChange={(e) => setDays(Math.max(0, Number(e.target.value)))}
              />
            </div>
          )}

          <div>
            <label className="lid-label">Plantilla a enviar</label>
            {templatesLoading ? (
              <div className="lid-muted" style={{ fontSize: 13, padding: 10 }}>Cargando plantillas aprobadas…</div>
            ) : templates.length === 0 ? (
              <div className="lid-row" style={{ padding: 12, background: 'var(--lid-pink-50)', borderRadius: 8, gap: 8, fontSize: 12, color: 'var(--lid-pink-600)' }}>
                <IonIcon icon={informationCircleOutline} />
                No hay plantillas aprobadas. Creá una en la sección Plantillas y esperá la aprobación de Meta.
              </div>
            ) : (
              <select className="lid-input" value={templateName} onChange={(e) => setTemplateName(e.target.value)}>
                {templates.map((t) => (
                  <option key={t.id} value={t.name}>{t.name} ({t.category})</option>
                ))}
              </select>
            )}
          </div>

          {allowedTypes.length > 0 && (
            <div>
              <label className="lid-label">Restringir a tipo de cliente (opcional)</label>
              <select
                className="lid-input"
                value={restrictToType}
                onChange={(e) => setRestrictToType(e.target.value as ClientType | '')}
              >
                <option value="">Todos los tipos</option>
                {allowedTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {error && (
            <div className="lid-badge lid-badge-pink" style={{ alignSelf: 'flex-start' }}>
              {error}
            </div>
          )}

          <div className="lid-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button className="lid-icon-btn" onClick={onClose} style={{ width: 'auto', padding: '0 18px', fontSize: 13, fontWeight: 600 }}>
              Cancelar
            </button>
            <button className="lid-btn-gradient" onClick={onSubmit} disabled={templates.length === 0}>
              Crear secuencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

