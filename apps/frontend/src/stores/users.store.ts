import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'advisor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  advisorId?: string; // FK al advisor del crm store si role=advisor
  active: boolean;
  avatarColor: string;
}

const SEED_USERS: User[] = [
  { id: 'u_admin', email: 'admin@lainternacional.com.ar', name: 'Admin',  role: 'admin',   active: true, avatarColor: '#0F172A' },
  { id: 'u_sofia', email: 'sofia@lainternacional.com.ar', name: 'Sofía',  role: 'advisor', active: true, avatarColor: '#7C3AED', advisorId: 'a_sofia' },
  { id: 'u_carla', email: 'carla@lainternacional.com.ar', name: 'Carla',  role: 'advisor', active: true, avatarColor: '#2563EB', advisorId: 'a_carla' },
  { id: 'u_julia', email: 'julia@lainternacional.com.ar', name: 'Julia',  role: 'advisor', active: true, avatarColor: '#0EA5E9', advisorId: 'a_julia' },
  { id: 'u_lu',    email: 'lu@lainternacional.com.ar',    name: 'Lu',     role: 'advisor', active: true, avatarColor: '#EC4899', advisorId: 'a_lu' },
  { id: 'u_mica',  email: 'mica@lainternacional.com.ar',  name: 'Mica',   role: 'advisor', active: true, avatarColor: '#10B981', advisorId: 'a_mica' },
];

interface UsersState {
  users: User[];
  findByEmail(email: string): User | null;
  findById(id: string): User | null;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (_set, get) => ({
      users: SEED_USERS,
      findByEmail(email) {
        return get().users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.active) ?? null;
      },
      findById(id) {
        return get().users.find((u) => u.id === id) ?? null;
      },
    }),
    { name: 'lid-users-store', version: 2 },
  ),
);
