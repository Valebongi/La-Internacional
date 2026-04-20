import { useParams, useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBackOutline, chatbubblesOutline, documentTextOutline, refreshCircleOutline, callOutline } from 'ionicons/icons';
import { useState } from 'react';
import { stateBadgeClass } from '@/lib/mock-data';
import { useCrmStore } from '@/stores/crm.store';
import { formatPhonePretty } from '@/lib/phone';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';

const TABS = [
  { id: 'convs', label: 'Conversaciones', icon: chatbubblesOutline },
  { id: 'docs', label: 'Comprobantes', icon: documentTextOutline },
  { id: 'postsale', label: 'Postventa', icon: refreshCircleOutline },
];

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { user } = useAuth();
  const clients = useCrmStore((s) => s.clients);
  const advisors = useCrmStore((s) => s.advisors);
  const client = clients.find((c) => c.id === id);
  const [tab, setTab] = useState('convs');

  const canView = client && (isAdmin(user) || client.advisorId === user?.advisorId);

  if (!client || !canView) {
    return (
      <div className="lid-page lid-fade-up">
        <button className="lid-icon-btn" onClick={() => history.push('/clients')} style={{ marginBottom: 16 }}>
          <IonIcon icon={arrowBackOutline} />
        </button>
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon"><IonIcon icon={documentTextOutline} /></div>
          <p className="lid-empty-title">{client ? 'Sin acceso a este cliente' : 'Cliente no encontrado'}</p>
          {client && !canView && (
            <p className="lid-empty-sub">Este cliente pertenece a otra asesora.</p>
          )}
        </div>
      </div>
    );
  }

  const advisor = advisors.find((a) => a.id === client.advisorId);

  return (
    <div className="lid-page lid-fade-up">
      <button className="lid-icon-btn" onClick={() => history.push('/clients')} style={{ marginBottom: 16 }} title="Volver">
        <IonIcon icon={arrowBackOutline} />
      </button>

      <div className="lid-card" style={{ padding: 24, marginBottom: 20, background: 'linear-gradient(135deg, #ffffff 0%, var(--lid-violet-50) 100%)', borderColor: 'var(--lid-violet-100)' }}>
        <div className="lid-row" style={{ alignItems: 'center', gap: 20 }}>
          <div className="lid-conv-avatar" style={{ background: advisor?.color ?? '#94A3B8', width: 72, height: 72, fontSize: 26 }}>
            {client.name.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="lid-page-title" style={{ marginBottom: 6 }}>{client.name}</h1>
            <div className="lid-row" style={{ gap: 12, flexWrap: 'wrap' }}>
              <span className="lid-muted" style={{ fontFamily: 'monospace' }}>{formatPhonePretty(client.phone)}</span>
              {client.city && (<><span className="lid-muted">·</span><span className="lid-muted">{client.city}</span></>)}
              <span className="lid-muted">·</span>
              <span className="lid-muted">{client.type}</span>
            </div>
            <div className="lid-row" style={{ marginTop: 10, gap: 6, flexWrap: 'wrap' }}>
              <span className={stateBadgeClass(client.state)}>{client.state}</span>
              {advisor && <span className="lid-badge lid-badge-violet">{advisor.name}</span>}
              {client.tags.map((t) => <span key={t} className="lid-badge lid-badge-pink">{t}</span>)}
            </div>
          </div>
          <button className="lid-btn-gradient">
            <IonIcon icon={callOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Abrir chat
          </button>
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
        {tab === 'convs' && (
          <div className="lid-col" style={{ gap: 10 }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="lid-row" style={{ justifyContent: 'space-between', padding: 12, borderRadius: 10, background: 'var(--lid-gray-50)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Conversación WA #{n}</div>
                  <div className="lid-muted" style={{ fontSize: 12 }}>2026-04-{10 + n} · 12 mensajes</div>
                </div>
                <span className="lid-badge lid-badge-success">Cerrada</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'docs' && (
          <div className="lid-grid lid-grid-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="lid-card" style={{ padding: 16 }}>
                <IonIcon icon={documentTextOutline} style={{ fontSize: 28, color: 'var(--lid-violet-600)' }} />
                <div style={{ fontWeight: 600, marginTop: 8 }}>Factura #A-0012{n}</div>
                <div className="lid-muted" style={{ fontSize: 12 }}>USD {120 + n * 30}.00</div>
                <span className="lid-badge lid-badge-success" style={{ marginTop: 8 }}>Pagada</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'postsale' && (
          <div className="lid-empty">
            <div className="lid-empty-icon"><IonIcon icon={refreshCircleOutline} /></div>
            <p className="lid-empty-title">Sin secuencias activas</p>
            <p className="lid-empty-sub">Este cliente no tiene secuencias de postventa programadas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
