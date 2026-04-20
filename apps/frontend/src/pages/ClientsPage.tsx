import { useMemo, useState, type ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { searchOutline, personAddOutline, cloudUploadOutline, filterOutline } from 'ionicons/icons';
import { stateBadgeClass } from '@/lib/mock-data';
import { useCrmStore } from '@/stores/crm.store';
import { formatPhonePretty } from '@/lib/phone';
import { useAuth } from '@/lib/auth-context';
import { scopeByAdvisor, isAdmin } from '@/lib/permissions';

export default function ClientsPage() {
  const [q, setQ] = useState('');
  const history = useHistory();
  const { user } = useAuth();
  const clients = useCrmStore((s) => s.clients);
  const advisors = useCrmStore((s) => s.advisors);

  const scoped = useMemo(() => scopeByAdvisor(clients, user), [clients, user]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return scoped;
    return scoped.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        c.phone.includes(t) ||
        c.type.toLowerCase().includes(t),
    );
  }, [q, scoped]);

  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Clientes</h1>
          <p className="lid-page-subtitle">
            {isAdmin(user)
              ? `${clients.length} contactos · ${advisors.length} asesoras · anti-duplicación activa`
              : `${scoped.length} contactos tuyos · anti-duplicación global activa`}
          </p>
        </div>
        <div className="lid-row">
          <button className="lid-icon-btn" title="Filtros">
            <IonIcon icon={filterOutline} />
          </button>
          <button
            className="lid-icon-btn"
            onClick={() => history.push('/clients/import')}
            style={{ width: 'auto', padding: '0 14px', gap: 6 }}
            title="Importar lista"
          >
            <IonIcon icon={cloudUploadOutline} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Importar</span>
          </button>
          <button className="lid-btn-gradient" onClick={() => history.push('/clients/new')} style={{ padding: '10px 16px', fontSize: 13 }}>
            <IonIcon icon={personAddOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Nuevo cliente
          </button>
        </div>
      </div>

      <div className="lid-card" style={{ padding: 14, marginBottom: 16 }}>
        <div className="lid-topbar-search" style={{ maxWidth: 'none' }}>
          <IonIcon icon={searchOutline} />
          <input
            placeholder="Buscar por nombre, teléfono, tipo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="lid-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--lid-gray-50)', borderBottom: '1px solid var(--lid-gray-200)' }}>
              <Th>Cliente</Th>
              <Th>Tipo</Th>
              <Th>Ciudad</Th>
              <Th>Asesora</Th>
              <Th>Estado</Th>
              <Th>Último contacto</Th>
              <Th>Tags</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const advisor = advisors.find((a) => a.id === c.advisorId);
              return (
                <tr
                  key={c.id}
                  onClick={() => history.push(`/clients/${c.id}`)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid var(--lid-gray-100)', transition: 'background 120ms' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--lid-violet-50)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Td>
                    <div className="lid-row">
                      <div className="lid-conv-avatar" style={{ background: advisor?.color ?? '#94A3B8', width: 36, height: 36, fontSize: 12 }}>
                        {c.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--lid-gray-900)' }}>{c.name}</div>
                        <div className="lid-muted" style={{ fontSize: 12, fontFamily: 'monospace' }}>{formatPhonePretty(c.phone)}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{c.type}</Td>
                  <Td>{c.city ?? <span className="lid-muted">—</span>}</Td>
                  <Td>
                    {advisor ? <span className="lid-badge lid-badge-violet">{advisor.name}</span> : <span className="lid-muted">—</span>}
                  </Td>
                  <Td><span className={stateBadgeClass(c.state)}>{c.state}</span></Td>
                  <Td className="lid-muted">{c.lastContact ?? '—'}</Td>
                  <Td>
                    <div className="lid-row" style={{ flexWrap: 'wrap', gap: 4 }}>
                      {c.tags.map((t) => (
                        <span key={t} className="lid-badge lid-badge-pink">{t}</span>
                      ))}
                      {c.tags.length === 0 && <span className="lid-muted">—</span>}
                    </div>
                  </Td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="lid-empty">
                    <div className="lid-empty-icon"><IonIcon icon={searchOutline} /></div>
                    <p className="lid-empty-title">Sin resultados</p>
                    <p className="lid-empty-sub">Probá otra búsqueda o creá un cliente nuevo.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th style={{
      textAlign: 'left', padding: '12px 16px',
      fontSize: 11, fontWeight: 700, color: 'var(--lid-gray-500)',
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>{children}</th>
  );
}

function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={className} style={{ padding: '14px 16px', verticalAlign: 'middle' }}>{children}</td>;
}
