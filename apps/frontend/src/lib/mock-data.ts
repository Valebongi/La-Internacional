export interface MockClient {
  id: string;
  name: string;
  phone: string;
  advisor: string;
  advisorColor: string;
  type: 'Cosmetóloga' | 'Esteticista' | 'Dermatóloga' | 'Revendedora';
  tags: string[];
  lastContact: string;
  state: ClientState;
  city: string;
}

export type ClientState =
  | 'Recibido'
  | 'En validación'
  | 'Presupuestando'
  | 'Sin comprobante'
  | 'Agendado'
  | 'Comprado';

export interface MockConversation {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  channel: 'WA #1' | 'WA #2' | 'WA #3' | 'WA #4' | 'WA #5' | 'Instagram';
  preview: string;
  time: string;
  unread: number;
  state: ClientState;
  advisor: string;
  advisorId: string;
  color: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  from: 'client' | 'advisor' | 'system';
  text: string;
  time: string;
}

export interface MockBroadcast {
  id: string;
  name: string;
  sentAt: string;
  recipients: number;
  delivered: number;
  read: number;
  responded: number;
  cost: number;
  status: 'Enviada' | 'Programada' | 'Borrador';
}

const COLORS = ['#7C3AED', '#2563EB', '#0EA5E9', '#EC4899', '#10B981'];

const advisors = [
  { name: 'Sofía', color: COLORS[0] },
  { name: 'Carla', color: COLORS[1] },
  { name: 'Julia', color: COLORS[2] },
  { name: 'Lu', color: COLORS[3] },
  { name: 'Mica', color: COLORS[4] },
];

export const mockClients: MockClient[] = [
  { id: 'c_01', name: 'Lucía Fernández', phone: '+5493511234567', advisor: 'Sofía', advisorColor: COLORS[0], type: 'Cosmetóloga', tags: ['VIP', 'Quincenal'], lastContact: 'hace 2 h', state: 'Presupuestando', city: 'Córdoba' },
  { id: 'c_02', name: 'Camila Ponce', phone: '+5493514445566', advisor: 'Carla', advisorColor: COLORS[1], type: 'Esteticista', tags: ['Nueva'], lastContact: 'hace 30 min', state: 'Recibido', city: 'Villa María' },
  { id: 'c_03', name: 'Ariana Giménez', phone: '+5493517778899', advisor: 'Julia', advisorColor: COLORS[2], type: 'Dermatóloga', tags: ['Mayorista'], lastContact: 'ayer', state: 'Agendado', city: 'Río Cuarto' },
  { id: 'c_04', name: 'Valentina Ríos', phone: '+5493513334455', advisor: 'Lu', advisorColor: COLORS[3], type: 'Revendedora', tags: ['Top 10'], lastContact: 'hace 4 h', state: 'Comprado', city: 'Córdoba' },
  { id: 'c_05', name: 'Nati Medina', phone: '+5493512226677', advisor: 'Mica', advisorColor: COLORS[4], type: 'Cosmetóloga', tags: [], lastContact: 'hace 3 d', state: 'Sin comprobante', city: 'Alta Gracia' },
  { id: 'c_06', name: 'Agus Torres', phone: '+5493518889900', advisor: 'Sofía', advisorColor: COLORS[0], type: 'Esteticista', tags: ['Recurrente'], lastContact: 'hace 1 h', state: 'En validación', city: 'Jesús María' },
  { id: 'c_07', name: 'Flor Navarro', phone: '+5493516665544', advisor: 'Carla', advisorColor: COLORS[1], type: 'Cosmetóloga', tags: ['VIP'], lastContact: 'hace 2 d', state: 'Presupuestando', city: 'Córdoba' },
  { id: 'c_08', name: 'Rocío Bustos', phone: '+5493515554433', advisor: 'Julia', advisorColor: COLORS[2], type: 'Revendedora', tags: ['Mayorista'], lastContact: 'hace 5 h', state: 'Agendado', city: 'Bell Ville' },
];

export const mockConversations: MockConversation[] = [
  { id: 'conv_01', clientId: 'c_01', clientName: 'Lucía Fernández', phone: '+549 351 123-4567', channel: 'WA #1', preview: 'Hola! Necesito actualizar la lista de precios de fulvic 🌿', time: '14:32', unread: 3, state: 'Presupuestando', advisor: 'Sofía', advisorId: 'a_sofia', color: COLORS[0] },
  { id: 'conv_02', clientId: 'c_02', clientName: 'Camila Ponce',    phone: '+549 351 444-5566', channel: 'WA #2', preview: 'Recibí el comprobante, gracias!',                         time: '14:10', unread: 0, state: 'Recibido',       advisor: 'Carla', advisorId: 'a_carla', color: COLORS[1] },
  { id: 'conv_03', clientId: 'c_03', clientName: 'Ariana Giménez',  phone: '+549 351 777-8899', channel: 'WA #3', preview: 'Confirmo envío para mañana 10hs',                       time: '13:48', unread: 1, state: 'Agendado',       advisor: 'Julia', advisorId: 'a_julia', color: COLORS[2] },
  { id: 'conv_04', clientId: 'c_04', clientName: 'Valentina Ríos',  phone: '+549 351 333-4455', channel: 'Instagram', preview: '¿Tienen stock del color 7.3?',                      time: '12:22', unread: 0, state: 'Comprado',       advisor: 'Lu',    advisorId: 'a_lu',    color: COLORS[3] },
  { id: 'conv_05', clientId: 'c_05', clientName: 'Nati Medina',     phone: '+549 351 222-6677', channel: 'WA #5', preview: 'No recibí el comprobante todavía...',                   time: 'ayer',  unread: 2, state: 'Sin comprobante',advisor: 'Mica',  advisorId: 'a_mica',  color: COLORS[4] },
  { id: 'conv_06', clientId: 'c_06', clientName: 'Agus Torres',     phone: '+549 351 888-9900', channel: 'WA #1', preview: 'Perfecto, coordino con la chica del local',             time: 'ayer',  unread: 0, state: 'En validación',  advisor: 'Sofía', advisorId: 'a_sofia', color: COLORS[0] },
];

export const mockMessages: Record<string, MockMessage[]> = {
  conv_01: [
    { id: 'm1', conversationId: 'conv_01', from: 'client', text: 'Hola! Soy Lucía de Córdoba, querría ver la lista de precios actualizada', time: '14:20' },
    { id: 'm2', conversationId: 'conv_01', from: 'advisor', text: '¡Hola Lu! Bienvenida de vuelta 💜 Te paso la lista, un segundo.', time: '14:22' },
    { id: 'm3', conversationId: 'conv_01', from: 'advisor', text: 'Listo, aca va: [catalogo_abril.pdf]', time: '14:23' },
    { id: 'm4', conversationId: 'conv_01', from: 'client', text: 'Necesito actualizar la lista de precios de fulvic 🌿', time: '14:30' },
    { id: 'm5', conversationId: 'conv_01', from: 'client', text: '¿Tienen el combo mayorista que subieron a instagram?', time: '14:32' },
  ],
};

export const mockBroadcasts: MockBroadcast[] = [
  { id: 'b_01', name: 'Abril — Catálogo nuevo', sentAt: '2026-04-12 10:30', recipients: 248, delivered: 245, read: 198, responded: 32, cost: 17640, status: 'Enviada' },
  { id: 'b_02', name: 'Promo fin de mes', sentAt: '2026-04-28 09:00', recipients: 312, delivered: 0, read: 0, responded: 0, cost: 0, status: 'Programada' },
  { id: 'b_03', name: 'VIPs — Pre-lanzamiento', sentAt: '2026-04-08 11:15', recipients: 42, delivered: 42, read: 40, responded: 18, cost: 2980, status: 'Enviada' },
  { id: 'b_04', name: 'Reactivación inactivos 45d', sentAt: '—', recipients: 0, delivered: 0, read: 0, responded: 0, cost: 0, status: 'Borrador' },
];

export const mockFunnel = [
  { stage: 'Recibido', value: 840, fill: '#7C3AED' },
  { stage: 'En validación', value: 612, fill: '#8B5CF6' },
  { stage: 'Presupuestando', value: 438, fill: '#2563EB' },
  { stage: 'Sin comprobante', value: 196, fill: '#0EA5E9' },
  { stage: 'Agendado', value: 284, fill: '#38BDF8' },
  { stage: 'Comprado', value: 212, fill: '#EC4899' },
];

export const mockTrend = [
  { day: 'Lun', recibidos: 124, comprados: 28 },
  { day: 'Mar', recibidos: 142, comprados: 36 },
  { day: 'Mie', recibidos: 118, comprados: 31 },
  { day: 'Jue', recibidos: 168, comprados: 44 },
  { day: 'Vie', recibidos: 156, comprados: 48 },
  { day: 'Sab', recibidos: 92, comprados: 21 },
  { day: 'Dom', recibidos: 40, comprados: 4 },
];

export const mockAdvisors = advisors;

export function stateBadgeClass(state: ClientState): string {
  switch (state) {
    case 'Recibido': return 'lid-badge lid-badge-sky';
    case 'En validación': return 'lid-badge lid-badge-blue';
    case 'Presupuestando': return 'lid-badge lid-badge-violet';
    case 'Sin comprobante': return 'lid-badge lid-badge-warning';
    case 'Agendado': return 'lid-badge lid-badge-pink';
    case 'Comprado': return 'lid-badge lid-badge-success';
    default: return 'lid-badge lid-badge-gray';
  }
}
