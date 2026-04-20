import { useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { searchOutline, notificationsOutline, sparklesOutline, helpCircleOutline } from 'ionicons/icons';

const LABELS: Record<string, string> = {
  inbox: 'Bandeja unificada',
  conversations: 'Conversación',
  clients: 'Clientes',
  broadcasts: 'Difusiones',
  templates: 'Plantillas',
  postsale: 'Postventa',
  analytics: 'Analítica',
  settings: 'Configuración',
};

export default function TopBar() {
  const { pathname } = useLocation();
  const seg = pathname.split('/').filter(Boolean)[0] ?? 'inbox';
  const label = LABELS[seg] ?? 'Inicio';

  return (
    <header className="lid-topbar">
      <div className="lid-topbar-crumb">
        <span>CRM</span>
        <span>/</span>
        <strong>{label}</strong>
      </div>

      <div className="lid-topbar-search">
        <IonIcon icon={searchOutline} />
        <input placeholder="Buscar clientes, conversaciones, difusiones..." />
      </div>

      <div className="lid-topbar-actions">
        <button className="lid-icon-btn" title="Asistente IA">
          <IonIcon icon={sparklesOutline} />
        </button>
        <button className="lid-icon-btn lid-icon-btn-dot" title="Notificaciones">
          <IonIcon icon={notificationsOutline} />
        </button>
        <button className="lid-icon-btn" title="Ayuda">
          <IonIcon icon={helpCircleOutline} />
        </button>
      </div>
    </header>
  );
}
