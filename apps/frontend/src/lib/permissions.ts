import type { User } from '@/stores/users.store';

/** Permisos del sistema. */
export type Permission =
  | 'viewAnalytics'
  | 'manageSettings'
  | 'viewAllClients'
  | 'viewAllConversations'
  | 'viewAllBroadcasts'
  | 'viewAllSequences'
  | 'manageUsers'
  | 'managePricing';

const ADVISOR_ALLOWED: Permission[] = [];
const ADMIN_ALLOWED: Permission[] = [
  'viewAnalytics',
  'manageSettings',
  'viewAllClients',
  'viewAllConversations',
  'viewAllBroadcasts',
  'viewAllSequences',
  'manageUsers',
  'managePricing',
];

export function can(user: User | null, perm: Permission): boolean {
  if (!user) return false;
  const allowed = user.role === 'admin' ? ADMIN_ALLOWED : ADVISOR_ALLOWED;
  return allowed.includes(perm);
}

export function isAdvisor(user: User | null): boolean {
  return user?.role === 'advisor';
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

/** Filtra una lista por advisorId cuando el usuario es advisor. Admin ve todo. */
export function scopeByAdvisor<T extends { advisorId?: string }>(items: T[], user: User | null): T[] {
  if (!user || user.role === 'admin') return items;
  if (!user.advisorId) return [];
  return items.filter((it) => it.advisorId === user.advisorId);
}

/** Same idea pero cuando la llave se llama distinto. */
export function scopeBy<T>(items: T[], user: User | null, getter: (t: T) => string | undefined): T[] {
  if (!user || user.role === 'admin') return items;
  if (!user.advisorId) return [];
  return items.filter((it) => getter(it) === user.advisorId);
}
