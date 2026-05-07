import { useEffect, useRef } from 'react';
import { useInboxStore } from '@/stores/inbox.store';
import { useCrmStore } from '@/stores/crm.store';
import { useOpportunitiesStore } from '@/stores/opportunities.store';

export function useInboundMessages() {
  const addNotification = useInboxStore((s) => s.addNotification);
  const findByPhone = useCrmStore((s) => s.findByPhone);
  const upsertFromMessage = useOpportunitiesStore((s) => s.upsertFromMessage);

  const addRef = useRef(addNotification);
  const findRef = useRef(findByPhone);
  const upsertRef = useRef(upsertFromMessage);
  addRef.current = addNotification;
  findRef.current = findByPhone;
  upsertRef.current = upsertFromMessage;

  useEffect(() => {
    // Use relative path that's proxied by nginx, not absolute localhost URL
    const sseUrl = '/webhooks/meta/stream';
    console.log('[LID] Connecting SSE to', sseUrl);
    const es = new EventSource(sseUrl);

    es.onopen = () => console.log('[LID] SSE connected ✓');

    es.onmessage = (event: MessageEvent) => {
      console.log('[LID] SSE message received:', event.data);
      try {
        const msg = JSON.parse(event.data as string);
        const phone = String(msg.from).startsWith('+') ? msg.from : `+${msg.from}`;
        const client = findRef.current(phone);

        const notification = {
          id: msg.messageId || `msg_${Date.now()}`,
          phone,
          contactName: msg.contactName || phone,
          clientName: client?.name ?? null,
          advisorId: client?.advisorId ?? null,
          body: msg.body || '',
          type: msg.type || 'text',
          timestamp: msg.timestamp || new Date().toISOString(),
        };

        addRef.current(notification);

        // Crear oportunidad si no hay una activa para este número
        upsertRef.current({
          phone,
          contactName: msg.contactName || phone,
          clientId: client?.id ?? null,
          clientName: client?.name ?? null,
          advisorId: client?.advisorId ?? null,
          message: msg.body || '',
          timestamp: notification.timestamp,
        });
      } catch {
        // payload inesperado — ignorar
      }
    };

    es.onerror = (e) => console.error('[LID] SSE error:', e);

    return () => es.close();
  }, []);
}
