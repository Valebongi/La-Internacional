import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  flashOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  timeOutline,
  personOutline,
  chatbubbleOutline,
  refreshOutline,
} from 'ionicons/icons';
import { useOpportunitiesStore, type Opportunity } from '@/stores/opportunities.store';
import { useCrmStore } from '@/stores/crm.store';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';

type Filter = 'active' | 'all';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

const STATUS_LABEL: Record<Opportunity['status'], string> = {
  active: 'Activa',
  won: 'Ganada',
  lost: 'Perdida',
};

const STATUS_CLASS: Record<Opportunity['status'], string> = {
  active: 'lid-badge lid-badge-green',
  won: 'lid-badge lid-badge-violet',
  lost: 'lid-badge lid-badge-pink',
};

function OppCard({ opp }: { opp: Opportunity }) {
  const { closeOpportunity, reopenOpportunity } = useOpportunitiesStore();
  const advisors = useCrmStore((s) => s.advisors);
  const advisor = advisors.find((a) => a.id === opp.advisorId);

  const displayName = opp.clientName ?? opp.contactName ?? opp.phone;

  return (
    <div className="lid-card lid-opp-card">
      <div className="lid-opp-card-header">
        <span className={STATUS_CLASS[opp.status]}>{STATUS_LABEL[opp.status]}</span>
        <span className="lid-muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <IonIcon icon={timeOutline} />
          {timeAgo(opp.lastMessageAt)}
        </span>
      </div>

      <div className="lid-opp-card-body">
        <div className="lid-opp-card-client">
          <div className="lid-opp-avatar" style={{ background: advisor?.color ?? 'var(--lid-gray-300)' }}>
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{displayName}</div>
            <div className="lid-muted" style={{ fontSize: 12 }}>{opp.phone}</div>
          </div>
        </div>

        {advisor && (
          <div className="lid-opp-card-advisor">
            <IonIcon icon={personOutline} style={{ fontSize: 12 }} />
            <span>{advisor.name}</span>
          </div>
        )}
      </div>

      <div className="lid-opp-card-message">
        <IonIcon icon={chatbubbleOutline} style={{ flexShrink: 0, color: 'var(--lid-gray-400)', fontSize: 13 }} />
        <span className="lid-opp-card-message-text">{opp.lastMessage}</span>
      </div>

      <div className="lid-opp-card-footer">
        <span className="lid-muted" style={{ fontSize: 12 }}>
          {opp.messageCount} {opp.messageCount === 1 ? 'mensaje' : 'mensajes'}
        </span>

        {opp.status === 'active' ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="lid-btn lid-btn-sm"
              style={{ background: 'var(--lid-success)', color: '#fff', border: 'none' }}
              onClick={() => closeOpportunity(opp.id, 'won')}
            >
              <IonIcon icon={checkmarkCircleOutline} />
              Ganada
            </button>
            <button
              className="lid-btn lid-btn-sm"
              style={{ background: 'var(--lid-danger)', color: '#fff', border: 'none' }}
              onClick={() => closeOpportunity(opp.id, 'lost')}
            >
              <IonIcon icon={closeCircleOutline} />
              Perdida
            </button>
          </div>
        ) : (
          <button
            className="lid-btn lid-btn-sm"
            onClick={() => reopenOpportunity(opp.id)}
          >
            <IonIcon icon={refreshOutline} />
            Reabrir
          </button>
        )}
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState<Filter>('active');
  const { user } = useAuth();
  const admin = isAdmin(user);
  const advisors = useCrmStore((s) => s.advisors);
  const allOpps = useOpportunitiesStore((s) => s.opportunities);

  // Admins ven todo; asesoras solo las suyas
  const myAdvisorId = !admin
    ? advisors.find((a) => a.id === (user as any)?.advisorId)?.id ?? null
    : null;

  const scoped = admin ? allOpps : allOpps.filter((o) => o.advisorId === myAdvisorId);
  const visible = filter === 'active' ? scoped.filter((o) => o.status === 'active') : scoped;

  const activeCount = scoped.filter((o) => o.status === 'active').length;
  const wonCount = scoped.filter((o) => o.status === 'won').length;
  const lostCount = scoped.filter((o) => o.status === 'lost').length;

  return (
    <div className="lid-page">
      {/* Header */}
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">
            <IonIcon icon={flashOutline} style={{ verticalAlign: '-3px', marginRight: 8 }} />
            Oportunidades
          </h1>
          <p className="lid-muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
            Contactos que escribieron al número de negocio
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="lid-opp-stats">
        <div className="lid-opp-stat">
          <span className="lid-opp-stat-value" style={{ color: 'var(--lid-violet-600)' }}>{activeCount}</span>
          <span className="lid-opp-stat-label">Activas</span>
        </div>
        <div className="lid-opp-stat">
          <span className="lid-opp-stat-value" style={{ color: 'var(--lid-success)' }}>{wonCount}</span>
          <span className="lid-opp-stat-label">Ganadas</span>
        </div>
        <div className="lid-opp-stat">
          <span className="lid-opp-stat-value" style={{ color: 'var(--lid-danger)' }}>{lostCount}</span>
          <span className="lid-opp-stat-label">Perdidas</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="lid-filter-tabs" style={{ marginBottom: 20 }}>
        {(['active', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`lid-filter-tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'active' ? `Activas (${activeCount})` : `Todas (${scoped.length})`}
          </button>
        ))}
      </div>

      {/* Lista */}
      {visible.length === 0 ? (
        <div className="lid-empty">
          <IonIcon icon={flashOutline} style={{ fontSize: 40, color: 'var(--lid-gray-300)', marginBottom: 12 }} />
          <p style={{ fontWeight: 600, margin: '0 0 4px' }}>
            {filter === 'active' ? 'No hay oportunidades activas' : 'Sin oportunidades aún'}
          </p>
          <p className="lid-muted" style={{ fontSize: 13, margin: 0 }}>
            Se crean automáticamente cuando alguien escribe al número de negocio
          </p>
        </div>
      ) : (
        <div className="lid-opp-grid">
          {visible.map((opp) => (
            <OppCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
