import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { IonIcon } from '@ionic/react';
import {
  megaphoneOutline, addOutline, cashOutline,
  flaskOutline, checkmarkCircleOutline, closeCircleOutline,
} from 'ionicons/icons';
import { useAuditStore } from '@/stores/audit.store';
import { useUsersStore } from '@/stores/users.store';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';
import { formatARS } from '@/stores/pricing.store';

export default function BroadcastsPage() {
  const history = useHistory();
  const { user } = useAuth();
  const admin = isAdmin(user);
  const allBroadcasts = useAuditStore((s) => s.broadcasts);

  const visible = useMemo(() => {
    if (admin) return allBroadcasts;
    return allBroadcasts.filter((b) => b.createdByUserId === user?.id);
  }, [allBroadcasts, admin, user]);

  const totalOk = visible.reduce((a, b) => a + b.okCount, 0);
  const totalFailed = visible.reduce((a, b) => a + b.failedCount, 0);
  const totalCost = visible.reduce((a, b) => a + b.totalCostARS, 0);

  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">{admin ? 'Difusiones' : 'Mis difusiones'}</h1>
          <p className="lid-page-subtitle">
            {admin
              ? 'Campañas masivas con plantillas oficiales de WhatsApp Cloud API'
              : 'Tus envíos masivos. El admin ve los de todo el equipo.'}
          </p>
        </div>
        <button className="lid-btn-gradient" onClick={() => history.push('/broadcasts/new')}>
          <IonIcon icon={addOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
          Nueva difusión
        </button>
      </div>

      <div className="lid-grid lid-grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Enviadas" value={String(visible.length)} icon={megaphoneOutline} tone="violet" />
        <StatCard label="Mensajes OK" value={String(totalOk)} icon={checkmarkCircleOutline} tone="blue" />
        <StatCard label="Fallidos" value={String(totalFailed)} icon={closeCircleOutline} tone="pink" />
        <StatCard label="Costo total" value={formatARS(totalCost)} icon={cashOutline} tone="sky" />
      </div>

      {visible.length === 0 ? (
        <div className="lid-card lid-empty">
          <div className="lid-empty-icon"><IonIcon icon={megaphoneOutline} /></div>
          <p className="lid-empty-title">Todavía no hay difusiones</p>
          <p className="lid-empty-sub">Creá la primera eligiendo un segmento y una plantilla aprobada.</p>
          <button className="lid-btn-gradient" onClick={() => history.push('/broadcasts/new')} style={{ marginTop: 10 }}>
            <IonIcon icon={addOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
            Nueva difusión
          </button>
        </div>
      ) : (
        <div className="lid-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--lid-gray-50)', borderBottom: '1px solid var(--lid-gray-200)' }}>
                <th style={th}>Plantilla</th>
                <th style={th}>Creada por</th>
                <th style={th}>Segmento</th>
                <th style={th}>Fecha</th>
                <th style={th}>OK / Fall.</th>
                <th style={th}>Costo</th>
                <th style={th}>Modo</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => <BroadcastRow key={b.id} b={b} />)}
            </tbody>
          </table>
        </div>
      )}

      {!admin && (
        <div className="lid-muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 14 }}>
          Ves solo las difusiones que enviaste vos.
        </div>
      )}
    </div>
  );
}

function BroadcastRow({ b }: { b: ReturnType<typeof useAuditStore.getState>['broadcasts'][number] }) {
  const creator = useUsersStore((s) => s.findById(b.createdByUserId));
  return (
    <tr style={{ borderBottom: '1px solid var(--lid-gray-100)' }}>
      <td style={td}>
        <strong>{b.templateName}</strong>
        <span className="lid-badge lid-badge-gray" style={{ marginLeft: 8, fontSize: 10 }}>{b.templateCategory}</span>
      </td>
      <td style={td}>
        {creator ? (
          <div className="lid-row" style={{ gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: creator.avatarColor, color: '#fff',
              display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11,
            }}>
              {creator.name.slice(0, 1)}
            </div>
            <span>{creator.name}</span>
          </div>
        ) : <span className="lid-muted">—</span>}
      </td>
      <td style={td}>
        {b.segmentType === 'all' ? (
          <span className="lid-muted">Todos</span>
        ) : (
          <span className="lid-badge lid-badge-violet">{b.segmentType}</span>
        )}
      </td>
      <td style={td} className="lid-muted">{new Date(b.createdAt).toLocaleString('es-AR')}</td>
      <td style={td}>
        <span style={{ color: 'var(--lid-success)', fontWeight: 700 }}>{b.okCount}</span>
        <span className="lid-muted"> / </span>
        <span style={{ color: b.failedCount > 0 ? 'var(--lid-pink-600)' : undefined }}>{b.failedCount}</span>
      </td>
      <td style={td}>{formatARS(b.totalCostARS)}</td>
      <td style={td}>
        {b.testMode ? (
          <span className="lid-badge lid-badge-sky lid-badge-dot">
            <IonIcon icon={flaskOutline} style={{ marginRight: 4 }} />
            Prueba
          </span>
        ) : (
          <span className="lid-badge lid-badge-success">Real</span>
        )}
      </td>
    </tr>
  );
}

const th: CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: 'var(--lid-gray-500)',
  textTransform: 'uppercase', letterSpacing: '0.04em',
};
const td: CSSProperties = { padding: '14px 16px', verticalAlign: 'middle' };

function StatCard({ label, value, icon, tone }: { label: string; value: string; icon: string; tone: 'violet' | 'blue' | 'sky' | 'pink' }) {
  return (
    <div className="lid-stat">
      <div className="lid-stat-head">
        <span className="lid-stat-label">{label}</span>
        <div className={`lid-stat-icon ${tone}`}><IonIcon icon={icon} /></div>
      </div>
      <div className="lid-stat-value">{value}</div>
    </div>
  );
}

