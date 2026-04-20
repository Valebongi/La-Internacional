import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  sendOutline,
  attachOutline,
  callOutline,
  informationCircleOutline,
  documentTextOutline,
  pricetagOutline,
  personOutline,
} from 'ionicons/icons';
import { mockConversations, mockMessages, stateBadgeClass } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { scopeByAdvisor, isAdmin } from '@/lib/permissions';

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { user } = useAuth();
  const scoped = scopeByAdvisor(mockConversations, user);
  const foundConv = mockConversations.find((c) => c.id === id);
  const canView = foundConv && (isAdmin(user) || foundConv.advisorId === user?.advisorId);
  const conv = canView ? foundConv! : (scoped[0] ?? mockConversations[0]);
  const msgs = mockMessages[conv.id] ?? mockMessages.conv_01;
  const [draft, setDraft] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 320px', height: '100%', minHeight: 'calc(100vh - 68px)' }}>
      {/* Panel izq: otras conversaciones */}
      <aside style={{ borderRight: '1px solid var(--lid-gray-200)', background: '#fff', overflowY: 'auto' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--lid-gray-100)' }}>
          <button className="lid-icon-btn" onClick={() => history.push('/inbox')} title="Volver">
            <IonIcon icon={arrowBackOutline} />
          </button>
          <h3 className="lid-h2" style={{ marginTop: 12 }}>Bandeja</h3>
        </div>
        <div style={{ padding: 8 }}>
          {scoped.map((c) => (
            <div
              key={c.id}
              className={`lid-conv-item ${c.id === conv.id ? 'active' : ''}`}
              onClick={() => history.push(`/conversations/${c.id}`)}
            >
              <div className="lid-conv-avatar" style={{ background: c.color, width: 36, height: 36, fontSize: 13 }}>
                {c.clientName.slice(0, 1)}
              </div>
              <div className="lid-conv-body">
                <div className="lid-conv-row">
                  <span className="lid-conv-name" style={{ fontSize: 13 }}>{c.clientName}</span>
                  <span className="lid-conv-time">{c.time}</span>
                </div>
                <span className="lid-conv-preview" style={{ fontSize: 12 }}>{c.preview}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Panel central: chat */}
      <section style={{ display: 'flex', flexDirection: 'column', background: 'var(--lid-gray-50)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#fff', borderBottom: '1px solid var(--lid-gray-200)' }}>
          <div className="lid-conv-avatar" style={{ background: conv.color, width: 42, height: 42 }}>
            {conv.clientName.slice(0, 1)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{conv.clientName}</div>
            <div className="lid-muted" style={{ fontSize: 12 }}>{conv.phone} · {conv.channel}</div>
          </div>
          <span className={stateBadgeClass(conv.state)}>{conv.state}</span>
          <button className="lid-icon-btn" title="Llamar"><IonIcon icon={callOutline} /></button>
          <button className="lid-icon-btn" title="Info"><IonIcon icon={informationCircleOutline} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--lid-gray-400)', margin: '12px 0' }}>
            — Hoy —
          </div>
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.from === 'advisor' ? 'flex-end' : 'flex-start',
                maxWidth: '72%',
                background: m.from === 'advisor' ? 'var(--lid-brand-gradient)' : '#fff',
                color: m.from === 'advisor' ? '#fff' : 'var(--lid-gray-900)',
                border: m.from === 'advisor' ? 'none' : '1px solid var(--lid-gray-200)',
                borderRadius: m.from === 'advisor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px',
                fontSize: 14,
                lineHeight: 1.45,
                boxShadow: m.from === 'advisor' ? 'var(--lid-shadow-glow)' : 'var(--lid-shadow-xs)',
              }}
            >
              {m.text}
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>{m.time}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 16, background: '#fff', borderTop: '1px solid var(--lid-gray-200)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="lid-icon-btn" title="Adjuntar"><IonIcon icon={attachOutline} /></button>
          <input
            className="lid-input"
            placeholder="Escribí un mensaje…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="lid-btn-gradient" style={{ padding: '10px 16px' }}>
            <IonIcon icon={sendOutline} style={{ verticalAlign: '-3px', marginRight: 6 }} />
            Enviar
          </button>
        </div>
      </section>

      {/* Panel der: datos del cliente */}
      <aside style={{ borderLeft: '1px solid var(--lid-gray-200)', background: '#fff', overflowY: 'auto', padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div className="lid-conv-avatar" style={{ background: conv.color, width: 72, height: 72, fontSize: 26, margin: '0 auto 10px' }}>
            {conv.clientName.slice(0, 1)}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{conv.clientName}</div>
          <div className="lid-muted" style={{ fontSize: 12 }}>{conv.phone}</div>
        </div>

        <div className="lid-divider" />

        <div className="lid-col" style={{ gap: 14 }}>
          <InfoRow icon={personOutline} label="Asesora" value={conv.advisor} />
          <InfoRow icon={pricetagOutline} label="Tipo" value="Cosmetóloga" />
          <InfoRow icon={documentTextOutline} label="Última compra" value="2026-04-02 · USD 178" />
        </div>

        <div className="lid-divider" />

        <h4 className="lid-h3" style={{ marginBottom: 8 }}>Tags</h4>
        <div className="lid-row" style={{ flexWrap: 'wrap', gap: 6 }}>
          <span className="lid-badge lid-badge-pink">VIP</span>
          <span className="lid-badge lid-badge-violet">Quincenal</span>
          <span className="lid-badge lid-badge-sky">Mayorista</span>
        </div>

        <div className="lid-divider" />

        <h4 className="lid-h3" style={{ marginBottom: 8 }}>Últimos comprobantes</h4>
        <div className="lid-col" style={{ gap: 8 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="lid-card" style={{ padding: 12 }}>
              <div className="lid-row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Factura #A-0012{n}</span>
                <span className="lid-badge lid-badge-success">Pagada</span>
              </div>
              <div className="lid-muted" style={{ fontSize: 12, marginTop: 4 }}>USD {120 + n * 30}.00 · 2026-0{n}-12</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="lid-row" style={{ alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'var(--lid-violet-50)', color: 'var(--lid-violet-600)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <IonIcon icon={icon} style={{ fontSize: 16 }} />
      </div>
      <div>
        <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--lid-gray-900)' }}>{value}</div>
      </div>
    </div>
  );
}
