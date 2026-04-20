import { NavLink } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  chatbubblesOutline,
  peopleOutline,
  megaphoneOutline,
  documentTextOutline,
  refreshCircleOutline,
  statsChartOutline,
  settingsOutline,
  logOutOutline,
} from 'ionicons/icons';
import { useAuth } from '@/lib/auth-context';
import { can, isAdmin } from '@/lib/permissions';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: number;
  adminOnly?: boolean;
}

const PRIMARY_NAV: NavItem[] = [
  { to: '/inbox', label: 'Bandeja', icon: chatbubblesOutline, badge: 6 },
  { to: '/clients', label: 'Clientes', icon: peopleOutline },
  { to: '/broadcasts', label: 'Difusiones', icon: megaphoneOutline, badge: 2 },
  { to: '/templates', label: 'Plantillas', icon: documentTextOutline },
  { to: '/postsale', label: 'Postventa', icon: refreshCircleOutline, adminOnly: true },
  { to: '/analytics', label: 'Analítica', icon: statsChartOutline, adminOnly: true },
];

const SECONDARY_NAV: NavItem[] = [
  { to: '/settings', label: 'Configuración', icon: settingsOutline, adminOnly: true },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initial = (user?.name || 'U').slice(0, 1).toUpperCase();
  const primary = PRIMARY_NAV.filter((i) => !i.adminOnly || isAdmin(user));
  const secondary = SECONDARY_NAV.filter((i) => !i.adminOnly || can(user, 'manageSettings'));

  return (
    <aside className="lid-sidebar">
      <div className="lid-sidebar-brand">
        <div className="lid-sidebar-brand-mark">LI</div>
        <div className="lid-sidebar-brand-text">
          <span className="lid-sidebar-brand-name">La Internacional</span>
          <span className="lid-sidebar-brand-sub">CRM</span>
        </div>
      </div>

      <div className="lid-sidebar-group-label">Operación</div>
      {primary.map((item) => (
        <NavLink key={item.to} to={item.to} className="lid-sidebar-item" activeClassName="active">
          <IonIcon icon={item.icon} />
          <span>{item.label}</span>
          {item.badge ? <span className="lid-sidebar-badge">{item.badge}</span> : null}
        </NavLink>
      ))}

      {secondary.length > 0 && (
        <>
          <div className="lid-sidebar-group-label">Administración</div>
          {secondary.map((item) => (
            <NavLink key={item.to} to={item.to} className="lid-sidebar-item" activeClassName="active">
              <IonIcon icon={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </>
      )}

      <div className="lid-sidebar-footer">
        <div className="lid-sidebar-avatar" style={{ background: user?.avatarColor ?? 'var(--lid-pink-gradient)' }}>
          {initial}
        </div>
        <div className="lid-sidebar-user">
          <span className="lid-sidebar-user-name">{user?.name || 'Invitado'}</span>
          <span className="lid-sidebar-user-role">{user?.role === 'admin' ? 'Administrador' : 'Asesora'}</span>
        </div>
        <button className="lid-icon-btn" onClick={logout} title="Cerrar sesión" style={{ width: 34, height: 34 }}>
          <IonIcon icon={logOutOutline} />
        </button>
      </div>
    </aside>
  );
}
