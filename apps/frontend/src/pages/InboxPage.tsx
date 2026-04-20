import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { filterOutline, funnelOutline, logoInstagram, logoWhatsapp, addOutline } from 'ionicons/icons';
import { mockConversations, stateBadgeClass, type MockConversation } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { scopeByAdvisor, isAdmin } from '@/lib/permissions';

const CHANNELS: { id: string; label: string; icon?: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'WA #1', label: 'WA #1', icon: logoWhatsapp },
  { id: 'WA #2', label: 'WA #2', icon: logoWhatsapp },
  { id: 'WA #3', label: 'WA #3', icon: logoWhatsapp },
  { id: 'WA #4', label: 'WA #4', icon: logoWhatsapp },
  { id: 'WA #5', label: 'WA #5', icon: logoWhatsapp },
  { id: 'Instagram', label: 'Instagram', icon: logoInstagram },
];

export default function InboxPage() {
  const [channel, setChannel] = useState<string>('all');
  const history = useHistory();
  const { user } = useAuth();

  const scoped = useMemo(() => scopeByAdvisor(mockConversations, user), [user]);

  const list = useMemo(() => {
    if (channel === 'all') return scoped;
    return scoped.filter((c) => c.channel === channel);
  }, [scoped, channel]);

  const totalUnread = scoped.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">{isAdmin(user) ? 'Bandeja unificada' : 'Mi bandeja'}</h1>
          <p className="lid-page-subtitle">
            {scoped.length} conversación{scoped.length === 1 ? '' : 'es'} · <strong style={{ color: 'var(--lid-pink-600)' }}>{totalUnread} sin leer</strong>
          </p>
        </div>
        <div className="lid-row">
          <button className="lid-icon-btn" title="Filtros avanzados">
            <IonIcon icon={funnelOutline} />
          </button>
          <button className="lid-icon-btn" title="Orden">
            <IonIcon icon={filterOutline} />
          </button>
          <button className="lid-btn-gradient" style={{ padding: '10px 16px', fontSize: 13 }}>
            <IonIcon icon={addOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Nuevo contacto
          </button>
        </div>
      </div>

      <div className="lid-tabs" style={{ marginBottom: 20 }}>
        {CHANNELS.map((ch) => {
          const count =
            ch.id === 'all'
              ? scoped.length
              : scoped.filter((c) => c.channel === ch.id).length;
          return (
            <button
              key={ch.id}
              className={`lid-tab ${channel === ch.id ? 'active' : ''}`}
              onClick={() => setChannel(ch.id)}
            >
              {ch.icon && <IonIcon icon={ch.icon} style={{ marginRight: 6, verticalAlign: '-3px' }} />}
              {ch.label}
              <span style={{ marginLeft: 8, color: 'var(--lid-gray-400)', fontWeight: 500 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="lid-card" style={{ padding: 8 }}>
        <div className="lid-conv-list">
          {list.map((conv) => (
            <ConversationRow key={conv.id} conv={conv} onClick={() => history.push(`/conversations/${conv.id}`)} />
          ))}
          {list.length === 0 && (
            <div className="lid-empty">
              <div className="lid-empty-icon">
                <IonIcon icon={filterOutline} />
              </div>
              <p className="lid-empty-title">Sin resultados</p>
              <p className="lid-empty-sub">Probá otro canal o quitá los filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationRow({ conv, onClick }: { conv: MockConversation; onClick: () => void }) {
  const initial = conv.clientName.slice(0, 1).toUpperCase();
  const channelIcon = conv.channel === 'Instagram' ? logoInstagram : logoWhatsapp;

  return (
    <div className="lid-conv-item" onClick={onClick}>
      <div className="lid-conv-avatar" style={{ background: conv.color }}>{initial}</div>
      <div className="lid-conv-body">
        <div className="lid-conv-row">
          <span className="lid-conv-name">{conv.clientName}</span>
          <span className="lid-conv-time">{conv.time}</span>
        </div>
        <span className="lid-conv-preview">{conv.preview}</span>
        <div className="lid-conv-meta">
          <span className={stateBadgeClass(conv.state)}>{conv.state}</span>
          <span className="lid-badge lid-badge-gray">
            <IonIcon icon={channelIcon} style={{ fontSize: 12, verticalAlign: '-2px', marginRight: 4 }} />
            {conv.channel}
          </span>
          <span className="lid-badge lid-badge-violet">{conv.advisor}</span>
          {conv.unread > 0 && <span className="lid-unread-dot" style={{ marginLeft: 'auto' }}>{conv.unread}</span>}
        </div>
      </div>
    </div>
  );
}
