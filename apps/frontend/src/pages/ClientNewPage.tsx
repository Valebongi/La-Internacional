import { useMemo, useState, type FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  personAddOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  callOutline,
  locationOutline,
  pricetagOutline,
  shuffleOutline,
} from 'ionicons/icons';
import { CLIENT_TYPES, useCrmStore, type ClientType } from '@/stores/crm.store';
import { normalizePhoneAR, formatPhonePretty } from '@/lib/phone';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';

export default function ClientNewPage() {
  const history = useHistory();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const addClient = useCrmStore((s) => s.addClient);
  const findByPhone = useCrmStore((s) => s.findByPhone);
  const advisorForType = useCrmStore((s) => s.advisorForType);
  const advisors = useCrmStore((s) => s.advisors);

  // Si es advisor, solo puede elegir tipos que le pertenezcan
  const currentAdvisor = !admin ? advisors.find((a) => a.id === user?.advisorId) ?? null : null;
  const allowedTypes: ClientType[] = admin ? [...CLIENT_TYPES] : currentAdvisor?.clientTypes ?? [];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<ClientType>(allowedTypes[0] ?? 'Cosmetóloga');
  const [tags, setTags] = useState('');
  const [city, setCity] = useState('');
  const [overrideAdvisor, setOverrideAdvisor] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const autoAdvisor = useMemo(() => advisorForType(type), [type, advisorForType]);
  const assignedAdvisor = useMemo(() => {
    if (!admin && currentAdvisor) return currentAdvisor;
    return advisors.find((a) => a.id === (overrideAdvisor ?? autoAdvisor?.id)) ?? null;
  }, [admin, currentAdvisor, advisors, overrideAdvisor, autoAdvisor]);

  const normalized = normalizePhoneAR(phone);
  const existingClient = normalized ? findByPhone(normalized) : null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!name.trim()) return setResult({ ok: false, message: 'El nombre es obligatorio' });
    if (!normalized) return setResult({ ok: false, message: 'Teléfono inválido. Formato AR: +5493511234567 o 3511234567' });
    if (existingClient) return setResult({ ok: false, message: `Ya existe un cliente con ese teléfono: ${existingClient.name}` });
    if (!assignedAdvisor) return setResult({ ok: false, message: 'No hay asesora asignada a este tipo. Configurá el mapping en Settings.' });

    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

    const created = addClient({
      name: name.trim(),
      phone: normalized,
      type,
      tags: tagList,
      city: city.trim() || undefined,
      state: 'Recibido',
      advisorId: assignedAdvisor.id,
    });

    if (!created) {
      return setResult({ ok: false, message: 'No se pudo crear el cliente' });
    }

    setResult({ ok: true, message: `Cliente "${created.name}" creado y asignado a ${assignedAdvisor.name}` });
    setTimeout(() => history.push(`/clients/${created.id}`), 1000);
  };

  return (
    <div className="lid-page lid-fade-up" style={{ maxWidth: 760 }}>
      <button className="lid-icon-btn" onClick={() => history.push('/clients')} style={{ marginBottom: 16 }} title="Volver">
        <IonIcon icon={arrowBackOutline} />
      </button>

      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Nuevo cliente</h1>
          <p className="lid-page-subtitle">La asesora se asigna automáticamente según el tipo.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="lid-card lid-col" style={{ gap: 18 }}>
        <div>
          <label className="lid-label">Nombre</label>
          <input className="lid-input" placeholder="Lucía Fernández" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="lid-label">
            <IonIcon icon={callOutline} style={{ marginRight: 6, verticalAlign: '-3px', color: 'var(--lid-violet-600)' }} />
            Teléfono
          </label>
          <input
            className="lid-input"
            placeholder="+5493511234567 o 3511234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="lid-muted" style={{ fontSize: 12, marginTop: 6 }}>
            {normalized ? (
              existingClient ? (
                <span style={{ color: 'var(--lid-pink-600)' }}>
                  ⚠ Ya existe: <strong>{existingClient.name}</strong> (asesora {advisors.find((a) => a.id === existingClient.advisorId)?.name})
                </span>
              ) : (
                <span style={{ color: 'var(--lid-success)' }}>
                  ✓ Normalizado: <strong>{formatPhonePretty(normalized)}</strong> — disponible
                </span>
              )
            ) : phone ? (
              <span style={{ color: 'var(--lid-pink-600)' }}>Formato inválido</span>
            ) : (
              'Se normaliza a E.164 automáticamente (WhatsApp AR).'
            )}
          </div>
        </div>

        <div>
          <label className="lid-label">
            <IonIcon icon={pricetagOutline} style={{ marginRight: 6, verticalAlign: '-3px', color: 'var(--lid-violet-600)' }} />
            Tipo de cliente
          </label>
          <div className="lid-grid" style={{ gridTemplateColumns: `repeat(${Math.max(allowedTypes.length, 1)}, 1fr)`, gap: 8 }}>
            {allowedTypes.length === 0 ? (
              <div className="lid-muted" style={{ fontSize: 13, padding: 12 }}>
                Tu usuario no tiene tipos asignados. Pedile al admin que te asigne uno.
              </div>
            ) : allowedTypes.map((t) => {
              const advisor = advisorForType(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); setOverrideAdvisor(null); }}
                  className={`lid-card ${type === t ? 'lid-card-feature' : ''}`}
                  style={{
                    padding: 12, textAlign: 'left', cursor: 'pointer',
                    borderColor: type === t ? 'var(--lid-violet-400)' : undefined,
                  }}
                >
                  <strong style={{ fontSize: 12 }}>{t}</strong>
                  <div className="lid-muted" style={{ fontSize: 10, marginTop: 4 }}>
                    {advisor ? `→ ${advisor.name}` : 'sin asesora'}
                  </div>
                </button>
              );
            })}
          </div>
          {!admin && (
            <div className="lid-muted" style={{ fontSize: 11, marginTop: 6 }}>
              Solo podés crear clientes de los tipos que te corresponden.
            </div>
          )}
        </div>

        <div className="lid-card lid-card-feature">
          <div className="lid-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="lid-row">
              {assignedAdvisor ? (
                <>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: assignedAdvisor.color, color: '#fff',
                    display: 'grid', placeItems: 'center', fontWeight: 700,
                  }}>
                    {assignedAdvisor.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                      Asesora asignada
                    </div>
                    <strong style={{ fontSize: 15 }}>{assignedAdvisor.name}</strong>
                    {!overrideAdvisor && (
                      <span className="lid-badge lid-badge-violet" style={{ marginLeft: 8, fontSize: 10 }}>Auto</span>
                    )}
                  </div>
                </>
              ) : (
                <span className="lid-muted">Sin asesora para este tipo</span>
              )}
            </div>
            {admin && (
            <details style={{ position: 'relative' }}>
              <summary style={{ listStyle: 'none', cursor: 'pointer' }}>
                <span className="lid-icon-btn" style={{ width: 'auto', padding: '0 12px', gap: 6, fontSize: 12 }}>
                  <IonIcon icon={shuffleOutline} />
                  Cambiar
                </span>
              </summary>
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: '#fff', border: '1px solid var(--lid-gray-200)',
                borderRadius: 12, padding: 8, boxShadow: 'var(--lid-shadow-md)',
                zIndex: 10, minWidth: 200,
              }}>
                {advisors.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setOverrideAdvisor(a.id)}
                    className="lid-sidebar-item"
                    style={{ padding: '8px 10px', width: '100%' }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: a.color, color: '#fff',
                      display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11,
                    }}>
                      {a.name.slice(0, 1)}
                    </div>
                    {a.name}
                  </button>
                ))}
              </div>
            </details>
            )}
          </div>
        </div>

        <div>
          <label className="lid-label">
            <IonIcon icon={locationOutline} style={{ marginRight: 6, verticalAlign: '-3px', color: 'var(--lid-violet-600)' }} />
            Ciudad (opcional)
          </label>
          <input className="lid-input" placeholder="Córdoba" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <div>
          <label className="lid-label">Tags (opcional, separados por coma)</label>
          <input className="lid-input" placeholder="VIP, Mayorista, Nueva" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>

        {result && (
          <div className="lid-card" style={{
            padding: 14,
            background: result.ok ? '#ECFDF5' : 'var(--lid-pink-50)',
            borderColor: result.ok ? '#6EE7B7' : 'var(--lid-pink-400)',
          }}>
            <div className="lid-row" style={{ gap: 10 }}>
              <IonIcon
                icon={result.ok ? checkmarkCircleOutline : alertCircleOutline}
                style={{ fontSize: 22, color: result.ok ? '#059669' : 'var(--lid-pink-600)' }}
              />
              <div style={{ color: result.ok ? '#059669' : 'var(--lid-pink-600)', fontSize: 13 }}>{result.message}</div>
            </div>
          </div>
        )}

        <div className="lid-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className="lid-icon-btn" onClick={() => history.push('/clients')} style={{ width: 'auto', padding: '0 18px', fontSize: 13, fontWeight: 600 }}>
            Cancelar
          </button>
          <button type="submit" className="lid-btn-gradient">
            <IonIcon icon={personAddOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Crear cliente
          </button>
        </div>
      </form>
    </div>
  );
}
