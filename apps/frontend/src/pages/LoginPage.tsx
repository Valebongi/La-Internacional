import { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  flashOutline,
  shieldCheckmarkOutline,
  pulseOutline,
  keyOutline,
  personOutline,
} from 'ionicons/icons';
import { useAuth } from '@/lib/auth-context';
import { useUsersStore } from '@/stores/users.store';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  const users = useUsersStore((s) => s.users);

  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (isAuthenticated) return <Redirect to="/inbox" />;

  const doLogin = async (email: string) => {
    setErr(null);
    setLoading(email);
    try {
      await login(email);
      history.replace('/inbox');
    } catch (error) {
      setErr((error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  const admin = users.find((u) => u.role === 'admin');
  const advisors = users.filter((u) => u.role === 'advisor');

  return (
    <div className="lid-login">
      <div className="lid-login-form lid-fade-up">
        <div className="lid-sidebar-brand" style={{ border: 'none', padding: 0, marginBottom: 28 }}>
          <div className="lid-sidebar-brand-mark">LI</div>
          <div className="lid-sidebar-brand-text">
            <span className="lid-sidebar-brand-name">La Internacional</span>
            <span className="lid-sidebar-brand-sub">CRM</span>
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          ¿Quién sos? <span className="lid-brand-text">✦</span>
        </h1>
        <p className="lid-muted" style={{ margin: '0 0 24px', fontSize: 13 }}>
          Elegí tu cuenta para entrar. Cada asesora ve solo lo suyo. Admin ve todo.
        </p>

        {admin && (
          <div style={{ marginBottom: 18 }}>
            <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 8 }}>
              Administración
            </div>
            <UserCard
              user={admin}
              loading={loading === admin.email}
              onClick={() => doLogin(admin.email)}
              description="Acceso total. Analítica, configuración, todas las asesoras y clientes."
              icon={keyOutline}
            />
          </div>
        )}

        <div>
          <div className="lid-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: 8 }}>
            Asesoras
          </div>
          <div className="lid-col" style={{ gap: 8 }}>
            {advisors.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                loading={loading === u.email}
                onClick={() => doLogin(u.email)}
                description="Sus clientes, su bandeja, plantillas y difusiones. Sin analítica."
                icon={personOutline}
              />
            ))}
          </div>
        </div>

        {err && (
          <div className="lid-badge lid-badge-pink" style={{ alignSelf: 'flex-start', marginTop: 14 }}>
            {err}
          </div>
        )}

        <p className="lid-muted" style={{ fontSize: 11, margin: '20px 0 0' }}>
          Demo sin contraseña. Cuando haya backend, pasamos a login real.
        </p>
      </div>

      <div className="lid-login-hero">
        <div className="lid-login-hero-content lid-fade-up">
          <h1>
            Conversaciones rápidas.<br />
            Clientes organizados.<br />
            Resultados medibles.
          </h1>
          <p>
            Todo el ciclo de venta de La Internacional en un solo lugar: bandeja unificada, anti-duplicación,
            difusiones con plantillas y postventa automatizada. Con permisos por rol.
          </p>
          <div className="lid-login-hero-chips">
            <div className="lid-login-hero-chip">
              <IonIcon icon={flashOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
              Rápido como una Ferrari
            </div>
            <div className="lid-login-hero-chip">
              <IonIcon icon={shieldCheckmarkOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
              Roles y permisos
            </div>
            <div className="lid-login-hero-chip">
              <IonIcon icon={pulseOutline} style={{ marginRight: 6, verticalAlign: '-3px' }} />
              Multi-canal WA + IG
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserCard({
  user, description, icon, loading, onClick,
}: {
  user: { name: string; email: string; role: string; avatarColor: string };
  description: string;
  icon: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="lid-card lid-card-interactive"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        opacity: loading ? 0.6 : 1,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: user.avatarColor, color: '#fff',
        display: 'grid', placeItems: 'center',
        fontWeight: 700, fontSize: 15,
        flexShrink: 0,
      }}>
        {user.name.slice(0, 1).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="lid-row" style={{ gap: 8 }}>
          <strong style={{ fontSize: 14 }}>{user.name}</strong>
          <span className={user.role === 'admin' ? 'lid-badge lid-badge-violet' : 'lid-badge lid-badge-sky'}>
            {user.role === 'admin' ? 'Admin' : 'Asesora'}
          </span>
        </div>
        <div className="lid-muted" style={{ fontSize: 12, marginTop: 2 }}>{description}</div>
      </div>
      <IonIcon icon={icon} style={{ fontSize: 20, color: 'var(--lid-violet-600)' }} />
    </button>
  );
}
