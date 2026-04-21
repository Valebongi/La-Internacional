import { useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline, personOutline, chatbubbleOutline } from 'ionicons/icons';
import { useInboxStore, type InboundNotification } from '@/stores/inbox.store';
import { useInboundMessages } from '@/hooks/useInboundMessages';

const AUTO_DISMISS_MS = 7000;

function Toast({ n, onDismiss }: { n: InboundNotification; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const displayName = n.clientName ?? n.contactName ?? n.phone;
  const isKnown = !!n.clientName;

  return (
    <div className="lid-toast">
      <div className="lid-toast-icon">
        <IonIcon icon={isKnown ? personOutline : chatbubbleOutline} />
      </div>
      <div className="lid-toast-body">
        <span className="lid-toast-title">
          {isKnown ? displayName : `Nuevo: ${displayName}`}
        </span>
        <span className="lid-toast-sub">{n.body}</span>
      </div>
      <button className="lid-icon-btn lid-toast-close" onClick={onDismiss} title="Cerrar">
        <IonIcon icon={closeOutline} />
      </button>
    </div>
  );
}

export default function InboundToastContainer() {
  useInboundMessages(); // monta el SSE stream aquí

  const { notifications, dismiss } = useInboxStore();
  const visible = notifications.slice(0, 4); // máximo 4 toasts apilados

  if (visible.length === 0) return null;

  return (
    <div className="lid-toast-container">
      {visible.map((n) => (
        <Toast key={n.id} n={n} onDismiss={() => dismiss(n.id)} />
      ))}
    </div>
  );
}
