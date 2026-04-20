import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  searchOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  personAddOutline,
  banOutline,
  duplicateOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { CLIENT_TYPES, useCrmStore, type ClientType, type ValidationResult } from '@/stores/crm.store';
import { formatPhonePretty, parsePhoneList } from '@/lib/phone';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';

type Phase = 'input' | 'validated' | 'created';

export default function ClientImportPage() {
  const history = useHistory();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const validatePhones = useCrmStore((s) => s.validatePhones);
  const addClients = useCrmStore((s) => s.addClients);
  const advisors = useCrmStore((s) => s.advisors);
  const advisorForType = useCrmStore((s) => s.advisorForType);

  const currentAdvisor = !admin ? advisors.find((a) => a.id === user?.advisorId) ?? null : null;
  const allowedTypes: ClientType[] = admin ? [...CLIENT_TYPES] : currentAdvisor?.clientTypes ?? [];

  const [phase, setPhase] = useState<Phase>('input');
  const [text, setText] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [newType, setNewType] = useState<ClientType>(allowedTypes[0] ?? 'Cosmetóloga');
  const [newNames, setNewNames] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<number>(0);

  const parsed = useMemo(() => parsePhoneList(text), [text]);

  const onValidate = () => {
    if (!parsed.length) return;
    const r = validatePhones(parsed);
    setResults(r);
    setPhase('validated');
  };

  const newResults = results.filter((r) => r.normalized && !r.existing);
  const duplicates = results.filter((r) => r.existing);
  const invalid = results.filter((r) => !r.normalized);

  const targetAdvisor = advisorForType(newType);

  const onConfirm = () => {
    if (!targetAdvisor) return;
    const batch = newResults.map((r) => ({
      name: (newNames[r.normalized!] || 'Sin nombre').trim(),
      phone: r.normalized!,
      type: newType,
      tags: [],
      state: 'Recibido' as const,
      advisorId: targetAdvisor.id,
    }));
    const out = addClients(batch);
    setCreated(out.length);
    setPhase('created');
  };

  const reset = () => {
    setText('');
    setResults([]);
    setNewNames({});
    setPhase('input');
    setCreated(0);
  };

  return (
    <div className="lid-page lid-fade-up" style={{ maxWidth: 960 }}>
      <button className="lid-icon-btn" onClick={() => history.push('/clients')} style={{ marginBottom: 16 }} title="Volver">
        <IonIcon icon={arrowBackOutline} />
      </button>

      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Validar e importar teléfonos</h1>
          <p className="lid-page-subtitle">
            Pegá una lista de números, detectamos duplicados contra tus clientes y creás solo los nuevos.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="lid-row" style={{ gap: 0, marginBottom: 24, alignItems: 'stretch' }}>
        {['Pegar lista', 'Revisar', 'Crear'].map((label, i) => {
          const active = (phase === 'input' && i === 0) || (phase === 'validated' && i === 1) || (phase === 'created' && i === 2);
          const done =
            (phase === 'validated' && i === 0) ||
            (phase === 'created' && (i === 0 || i === 1));
          return (
            <div key={label} className="lid-row" style={{ flex: 1 }}>
              <div className="lid-row" style={{ gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: done ? 'var(--lid-success)' : active ? 'var(--lid-brand-gradient)' : 'var(--lid-gray-100)',
                  color: done || active ? '#fff' : 'var(--lid-gray-500)',
                  display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12,
                  boxShadow: active ? 'var(--lid-shadow-glow)' : 'none',
                }}>
                  {done ? <IonIcon icon={checkmarkCircleOutline} /> : i + 1}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: active || done ? 'var(--lid-gray-900)' : 'var(--lid-gray-500)' }}>
                  {label}
                </div>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: done ? 'var(--lid-success)' : 'var(--lid-gray-200)', margin: '0 16px' }} />}
            </div>
          );
        })}
      </div>

      {/* ============ PHASE: input ============ */}
      {phase === 'input' && (
        <div className="lid-card lid-col" style={{ gap: 16 }}>
          <div>
            <label className="lid-label">Pegá los teléfonos</label>
            <textarea
              className="lid-input"
              style={{ height: 220, padding: 14, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }}
              placeholder={`Podés pegar separados por coma, espacio o enter:\n\n+5493511234567\n3511234567, 351-444-5566\n+549 351 777-8899`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="lid-muted" style={{ fontSize: 12, marginTop: 6 }}>
              Detectados: <strong>{parsed.length}</strong> números. Se normalizan a E.164 AR (+549…).
            </div>
          </div>
          <div className="lid-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button className="lid-btn-gradient" onClick={onValidate} disabled={!parsed.length}>
              <IonIcon icon={searchOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
              Validar contra el sistema
            </button>
          </div>
        </div>
      )}

      {/* ============ PHASE: validated ============ */}
      {phase === 'validated' && (
        <div className="lid-col" style={{ gap: 16 }}>
          {/* Summary */}
          <div className="lid-grid lid-grid-3">
            <SummaryCard label="Nuevos" count={newResults.length} tone="violet" icon={personAddOutline} />
            <SummaryCard label="Duplicados" count={duplicates.length} tone="blue" icon={duplicateOutline} />
            <SummaryCard label="Inválidos" count={invalid.length} tone="pink" icon={banOutline} />
          </div>

          {/* Invalid */}
          {invalid.length > 0 && (
            <div className="lid-card" style={{ borderColor: 'var(--lid-pink-200)' }}>
              <div className="lid-row" style={{ marginBottom: 10 }}>
                <IonIcon icon={banOutline} style={{ color: 'var(--lid-pink-600)' }} />
                <strong>Inválidos ({invalid.length})</strong>
                <span className="lid-muted" style={{ fontSize: 12 }}>No se pueden normalizar a E.164, se ignoran.</span>
              </div>
              <div className="lid-row" style={{ flexWrap: 'wrap', gap: 6 }}>
                {invalid.map((r, i) => (
                  <span key={i} className="lid-badge lid-badge-pink" style={{ fontFamily: 'monospace' }}>{r.raw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Duplicates */}
          {duplicates.length > 0 && (
            <div className="lid-card">
              <div className="lid-row" style={{ marginBottom: 12 }}>
                <IonIcon icon={duplicateOutline} style={{ color: 'var(--lid-blue-600)' }} />
                <strong>Ya existentes ({duplicates.length})</strong>
                <span className="lid-muted" style={{ fontSize: 12 }}>Se excluyen del alta.</span>
              </div>
              <div className="lid-col" style={{ gap: 6 }}>
                {duplicates.map((r, i) => {
                  const advisor = advisors.find((a) => a.id === r.existing!.advisorId);
                  return (
                    <div key={i} className="lid-row" style={{
                      padding: '8px 12px', background: 'var(--lid-gray-50)', borderRadius: 8, fontSize: 13,
                    }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--lid-gray-600)', minWidth: 160 }}>
                        {formatPhonePretty(r.normalized!)}
                      </span>
                      <strong style={{ flex: 1 }}>{r.existing!.name}</strong>
                      <span className="lid-badge lid-badge-violet">{advisor?.name ?? '—'}</span>
                      <span className="lid-badge lid-badge-gray">{r.existing!.type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* New */}
          {newResults.length > 0 ? (
            <div className="lid-card">
              <div className="lid-row" style={{ marginBottom: 12, justifyContent: 'space-between' }}>
                <div className="lid-row">
                  <IonIcon icon={personAddOutline} style={{ color: 'var(--lid-violet-600)' }} />
                  <strong>Para crear ({newResults.length})</strong>
                </div>
                <div className="lid-row">
                  <label className="lid-muted" style={{ fontSize: 12 }}>Asignar como:</label>
                  <select className="lid-input" style={{ height: 32, padding: '0 10px', fontSize: 13 }} value={newType} onChange={(e) => setNewType(e.target.value as ClientType)}>
                    {allowedTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="lid-badge lid-badge-violet">
                    → {targetAdvisor?.name ?? 'sin asesora'}
                  </span>
                </div>
              </div>

              <div className="lid-col" style={{ gap: 6 }}>
                {newResults.map((r, i) => (
                  <div key={i} className="lid-row" style={{ padding: '8px 12px', background: 'var(--lid-violet-50)', borderRadius: 8, gap: 10 }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--lid-gray-700)', fontSize: 13, minWidth: 160 }}>
                      {formatPhonePretty(r.normalized!)}
                    </span>
                    <input
                      className="lid-input"
                      style={{ height: 34, fontSize: 13, flex: 1 }}
                      placeholder="Nombre (opcional)"
                      value={newNames[r.normalized!] ?? ''}
                      onChange={(e) => setNewNames({ ...newNames, [r.normalized!]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="lid-card lid-empty">
              <div className="lid-empty-icon"><IonIcon icon={checkmarkCircleOutline} /></div>
              <p className="lid-empty-title">No hay nuevos para crear</p>
              <p className="lid-empty-sub">Todos los teléfonos válidos ya existen en el sistema.</p>
            </div>
          )}

          <div className="lid-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button className="lid-icon-btn" onClick={reset} style={{ width: 'auto', padding: '0 18px', fontSize: 13, fontWeight: 600 }}>
              Volver
            </button>
            {newResults.length > 0 && (
              <button className="lid-btn-gradient" onClick={onConfirm} disabled={!targetAdvisor}>
                <IonIcon icon={personAddOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
                Crear {newResults.length} cliente{newResults.length === 1 ? '' : 's'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============ PHASE: created ============ */}
      {phase === 'created' && (
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon" style={{ background: '#ECFDF5', color: 'var(--lid-success)' }}>
            <IonIcon icon={checkmarkCircleOutline} />
          </div>
          <p className="lid-empty-title" style={{ fontSize: 20 }}>
            {created} cliente{created === 1 ? '' : 's'} creado{created === 1 ? '' : 's'} 🎉
          </p>
          <p className="lid-empty-sub">
            Asignados a {targetAdvisor?.name} · tipo {newType}.
          </p>
          <div className="lid-row" style={{ gap: 10, marginTop: 12 }}>
            <button className="lid-icon-btn" onClick={reset} style={{ width: 'auto', padding: '0 18px', fontSize: 13, fontWeight: 600 }}>
              Importar otra lista
            </button>
            <button className="lid-btn-gradient" onClick={() => history.push('/clients')}>
              <IonIcon icon={documentTextOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
              Ver clientes
            </button>
          </div>
        </div>
      )}

      {phase === 'input' && invalid.length > 0 && (
        <div className="lid-card" style={{ background: 'var(--lid-pink-50)', borderColor: 'var(--lid-pink-200)', marginTop: 12 }}>
          <IonIcon icon={alertCircleOutline} style={{ color: 'var(--lid-pink-600)' }} />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, count, tone, icon }: { label: string; count: number; tone: 'violet' | 'blue' | 'pink'; icon: string }) {
  return (
    <div className="lid-stat">
      <div className="lid-stat-head">
        <span className="lid-stat-label">{label}</span>
        <div className={`lid-stat-icon ${tone}`}><IonIcon icon={icon} /></div>
      </div>
      <div className="lid-stat-value">{count}</div>
    </div>
  );
}
